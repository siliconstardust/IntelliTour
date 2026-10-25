import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
from fastapi.testclient import TestClient
from app.main import app


def client():
    return TestClient(app)


def test_destinations_and_filters():
    with client() as c:
        r = c.get("/destinations").json()
        assert len(r) == 19 and r[0]["highlights"]
        assert all(d["latitude"] and d["longitude"] for d in r)
        assert {d["name"] for d in c.get("/destinations", params={"category": "Beaches"}).json()} >= {"Goa", "Gokarna"}
        assert c.get("/destinations/999").status_code == 404


def test_events_flag_sample_data():
    with client() as c:
        ev = c.get("/events").json()
        assert ev and all(e["is_sample"] for e in ev)


def test_plan_success():
    with client() as c:
        body = {"destination": "Rajasthan", "start_date": "2026-11-02", "end_date": "2026-11-04", "travellers": 2, "budget": 20000, "interests": ["Heritage"], "travel_style": "Balanced"}
        r = c.post("/trips/plan", json=body)
        assert r.status_code == 200, r.text
        j = r.json()
        assert 1 <= len(j["days"]) <= 3 and j["per_person"] is True
        for d in j["days"]:
            assert d["activities"] and all(a["latitude"] for a in d["activities"])
            assert sum(a["duration_hours"] for a in d["activities"]) <= 8 + 0.01
        assert sum(a["cost"] for d in j["days"] for a in d["activities"]) <= 20000 / 2


def test_plan_errors_are_readable():
    with client() as c:
        base = {"start_date": "2026-11-02", "end_date": "2026-11-03", "travellers": 1, "interests": ["Beaches"]}
        r = c.post("/trips/plan", json={**base, "destination": "Atlantis"})
        assert r.status_code == 400 and "Atlantis" in r.json()["detail"]
        r = c.post("/trips/plan", json={**base, "end_date": "2026-11-01"})
        assert r.status_code == 422 and isinstance(r.json()["detail"], str) and "end date" in r.json()["detail"]
        r = c.post("/trips/plan", json={**base, "budget": 10})  # a tiny budget still allows free places, but never exceeds it
        assert r.status_code == 200
        assert sum(a["cost"] for d in r.json()["days"] for a in d["activities"]) <= 10
