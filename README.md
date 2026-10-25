# IntelliTour: Intelligent Tourist System (full stack)

React + Vite frontend, FastAPI backend, MySQL (or SQLite for a quick start).

```
frontend/   React app (bold yellow / teal / coral editorial design, Leaflet map, calendar, AI planner form)
backend/    FastAPI API, SQLAlchemy models, seed data, trip planner, tests
```

## Quick start (SQLite, no database setup)
Terminal 1, backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Terminal 2, frontend:
```bash
cd frontend
npm install
npm run dev                                              # http://localhost:5173
```
The first backend start creates the tables and seeds 19 destinations, 148 activities and sample events.
`frontend/.env.development` already points the app at the backend through the Vite proxy (`/api` to port 8000).
API docs: http://localhost:8000/docs

## Use MySQL
```sql
CREATE DATABASE intellitour CHARACTER SET utf8mb4;
CREATE USER 'intellitour'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL ON intellitour.* TO 'intellitour'@'localhost';
```
Then in `backend/.env` (copy from `.env.example`) set
`DATABASE_URL=mysql+pymysql://intellitour:yourpassword@localhost:3306/intellitour?charset=utf8mb4`
and restart. MySQL 5.7 or newer is needed for the JSON columns. To reset the data: `python -m app.seed`.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/destinations?category=&q=` | List destinations (with top highlights) |
| GET | `/destinations/{id}` and `/destinations/{id}/activities` | One destination, its activities |
| GET | `/events?month=YYYY-MM` | Calendar events (`is_sample` marks demo rows) |
| POST | `/trips/plan` | Build a day-by-day itinerary |
| GET | `/health` | Health check |

## How the AI planner works (`backend/app/planner.py`)
1. **Interest matching:** your interests become a vector over history, nature, food, adventure, spiritual and shopping; each activity has the same vector. Cosine similarity, blended with popularity: score = 0.7 x match + 0.3 x popularity/5.
2. **Selection:** per day, add the best-scoring activities while total time (visits plus travel at an assumed 25 km/h on roads 1.35x the straight-line distance) fits the travel style (Relaxed 6 h, Balanced 8 h, Packed 10 h) and the per-person budget holds.
3. **Routing:** nearest neighbour, then 2-opt swaps, from the destination centre.
4. **Multi-destination trips:** only nearby destinations (within 600 km) that match almost as well are chained; the response notes when you need travel time between them.
It is classical algorithms (similarity, greedy selection, local search), not a language model. Swap in an LLM in `build_plan` if your course requires one.

## Important limits
* Costs, visit durations and popularity scores are approximate placeholders; coordinates for the seven added destinations (Leh, Manali, Munnar, Gokarna, Havelock, Hampi, Rishikesh) were entered by hand and are approximate. Verify before presenting them as facts.
* The planner does not check opening hours or seasons; times are sequential estimates.
* The seeded events are labelled sample data and shown as such in the calendar. Replace them with real rows in the `events` table.
* No login yet. Saved places and itineraries are stored in the browser only.
* Tests: `cd backend && pytest`. Tested on SQLite; the MySQL setup above was not run here.
