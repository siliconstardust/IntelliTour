import os
from contextlib import asynccontextmanager
from datetime import date
from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from . import schemas
from .database import get_db
from .models import Activity, Destination, Event
from .planner import PlanError, build_plan
from .seed import init_db


@asynccontextmanager
async def lifespan(app):
    init_db(auto=os.getenv("AUTO_SEED", "1") == "1")
    yield


app = FastAPI(title="IntelliTour API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")],
                   allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, exc: RequestValidationError):
    msg = "; ".join(f"{'.'.join(str(p) for p in e['loc'][1:])}: {e['msg'].replace('Value error, ', '')}" if e["loc"][1:] else e["msg"].replace("Value error, ", "") for e in exc.errors())
    return JSONResponse(status_code=422, content={"detail": f"Please check the form. {msg}"})


def dest_out(d: Destination) -> schemas.DestinationOut:
    out = schemas.DestinationOut.model_validate(d)
    out.highlights = [a.name for a in sorted(d.activities, key=lambda a: -(a.popularity or 0))[:5]]
    return out


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/destinations", response_model=list[schemas.DestinationOut])
def list_destinations(category: str | None = None, q: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Destination).options(selectinload(Destination.activities)).order_by(Destination.id)
    rows = db.scalars(stmt).all()
    if category:
        rows = [d for d in rows if category == d.category or category in d.tags]
    if q:
        rows = [d for d in rows if q.lower() in f"{d.name} {d.state}".lower()]
    return [dest_out(d) for d in rows]


@app.get("/destinations/{dest_id}", response_model=schemas.DestinationOut)
def get_destination(dest_id: int, db: Session = Depends(get_db)):
    d = db.scalar(select(Destination).options(selectinload(Destination.activities)).where(Destination.id == dest_id))
    if not d:
        raise HTTPException(404, "Destination not found.")
    return dest_out(d)


@app.get("/destinations/{dest_id}/activities", response_model=list[schemas.ActivityOut])
def destination_activities(dest_id: int, db: Session = Depends(get_db)):
    if not db.get(Destination, dest_id):
        raise HTTPException(404, "Destination not found.")
    return db.scalars(select(Activity).where(Activity.destination_id == dest_id).order_by(Activity.id)).all()


@app.get("/events", response_model=list[schemas.EventOut])
def list_events(month: str | None = Query(None, pattern=r"^\d{4}-\d{2}$"), db: Session = Depends(get_db)):
    rows = db.scalars(select(Event).order_by(Event.event_date, Event.event_time)).all()
    if month:
        rows = [e for e in rows if e.event_date.strftime("%Y-%m") == month]
    return [schemas.EventOut(id=e.id, title=e.title, category=e.category, date=e.event_date, time=e.event_time, location=e.location, is_sample=e.is_sample) for e in rows]


@app.post("/trips/plan")
def plan_trip(req: schemas.PlanRequest, db: Session = Depends(get_db)):
    dests = db.scalars(select(Destination).options(selectinload(Destination.activities))).all()
    try:
        return build_plan(dests, req)
    except PlanError as e:
        raise HTTPException(400, str(e))
