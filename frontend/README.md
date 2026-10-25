IntelliTour is a full-stack intelligent tourist system. Pick your interests, budget, dates and travel style, and the planner builds a day-by-day itinerary for destinations across India.

Features

Destination discovery with category filters and photos
Interactive map (Leaflet and OpenStreetMap) with search, list view and preview panel
Events calendar with day-wise activities
AI trip planner: interest matching with cosine similarity, greedy selection under time and budget limits, and route ordering with nearest neighbour and 2-opt
Saved places and itineraries
Responsive, animated UI

Tech stack: React, Vite, React Router, Framer Motion, Leaflet, FastAPI, SQLAlchemy, MySQL (SQLite for quick start)

Note: costs, visit times and some coordinates are approximate sample data, and the calendar events are sample entries.

React + Vite + React Router + Framer Motion + Leaflet (OpenStreetMap). Hand-written CSS with design tokens
(yellow `#FFD43B`, charcoal `#292929`, teal `#008F87`, coral `#FF686B`), Barlow Condensed and DM Sans.

## Run
```bash
npm install
cp .env.example .env     # optional
npm run dev              # http://localhost:5173
npm run build            # production build in dist/
```

## Connect your FastAPI backend
All network code is in `src/services/api.js`. Set `VITE_API_URL` (for local dev use `/api`, which Vite proxies to
`http://localhost:8000`). Enable CORS in FastAPI if you call it directly from another origin.

| Purpose | Request | Fields read (first match wins) |
|---|---|---|
| Destinations | `GET /destinations` | `id`, `name`, `state` or `region`, `category`, `budget` / `budget_per_day` / `estimated_budget`, `rating`, `description`, `latitude`/`lat`, `longitude`/`lng`/`lon`, `image_url` |
| Events (calendar) | `GET /events` | `id`, `date` (YYYY-MM-DD), `title`, `category`, `time`, `location` |
| Trip planner | `POST /trips/plan` | sends `start_city, destination, start_date, end_date, travellers, budget, interests[], travel_style`; reads `days[].activities[]` with `name, time, cost, description, latitude, longitude` |

If your routes or field names differ, change only the paths and the `normDest`, `getEvents` and `planTrip` mappers.
Errors from the API are shown to the user; no fake AI result is ever produced when a request fails.

## Demo mode
With `VITE_API_URL` empty, the app uses 12 sample Indian destinations (`src/data/demo.js`) and generated sample events.
The UI says so (calendar note and planner banner). Demo itineraries are assembled locally, not by an AI.

## Notes
* Photos load from Wikipedia at runtime. Use `image_url` from your API to supply your own.
* Saved places and itineraries are stored in the browser (localStorage). Authentication is not included here; wire your
  existing login into `Navbar.jsx` and keep your protected routes.
* Contact email and social links in the footer only appear when `VITE_CONTACT_EMAIL` / `VITE_SOCIAL_*` are set.
