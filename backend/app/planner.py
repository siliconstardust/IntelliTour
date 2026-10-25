"""Trip planner: interest matching (cosine similarity), greedy selection under time and budget limits,
and route ordering (nearest neighbour + 2-opt). Pure functions, no database access."""
import math
from datetime import date, timedelta

# Planner interests (frontend categories) -> weights over [history, nature, food, adventure, spiritual, shopping]
INTEREST_MAP = {
    "Mountains": {1: 0.6, 3: 0.9}, "Beaches": {1: 0.7, 2: 0.3, 3: 0.3}, "Heritage": {0: 1.0},
    "Nature": {1: 1.0}, "Spiritual": {4: 1.0}, "City escapes": {2: 0.7, 5: 0.7, 0: 0.3},
}
STYLE = {"Relaxed": (6.0, 3), "Balanced": (8.0, 4), "Packed": (10.0, 6)}  # day hours, max stops
MIN_MATCH = 0.2
ROAD_FACTOR, SPEED_KMH, START_HOUR = 1.35, 25.0, 9.0
MAX_HOP_KM = 600  # straight-line distance between consecutive destinations in one trip


class PlanError(Exception):
    pass


def user_vector(interests):
    v = [0.0] * 6
    for name in interests:
        for i, w in INTEREST_MAP.get(name, {}).items():
            v[i] = max(v[i], w)
    return v if any(v) else [0.5] * 6


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(y * y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def km(a, b):
    r = math.pi / 180
    h = math.sin((b.latitude - a.latitude) * r / 2) ** 2 + math.cos(a.latitude * r) * math.cos(b.latitude * r) * math.sin((b.longitude - a.longitude) * r / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def hours_between(a, b):
    return km(a, b) * ROAD_FACTOR / SPEED_KMH


def route_len(start, route):
    return sum(km(route[i - 1] if i else start, p) for i, p in enumerate(route))


def order_route(start, items):
    left, route, cur = list(items), [], start
    while left:
        nxt = min(left, key=lambda p: km(cur, p))
        left.remove(nxt)
        route.append(nxt)
        cur = nxt
    improved = True
    while improved:  # 2-opt on an open path
        improved = False
        for i in range(len(route) - 1):
            for j in range(i + 1, len(route)):
                cand = route[:i] + route[i:j + 1][::-1] + route[j + 1:]
                if route_len(start, cand) < route_len(start, route) - 1e-9:
                    route, improved = cand, True
    return route


def total_hours(start, route):
    return sum(p.duration_hours for p in route) + sum(hours_between(route[i - 1] if i else start, p) for i, p in enumerate(route))


def activity_score(uv, a):
    return 0.7 * cosine(uv, a.interest) + 0.3 * (a.popularity or 4.2) / 5


def destination_score(uv, d):
    s = sorted((activity_score(uv, a) for a in d.activities if cosine(uv, a.interest) >= MIN_MATCH), reverse=True)[:4]
    return sum(s) / len(s) if s else 0.0


def fmt_time(h):
    m = round(h * 60)
    return f"{m // 60 % 24:02d}:{m % 60:02d}"


def build_plan(destinations, req):
    uv = user_vector(req.interests)
    q = (req.destination or "").strip().lower()
    pool = [d for d in destinations if q in f"{d.name} {d.state} {d.category}".lower()] if q else list(destinations)
    if not pool:
        raise PlanError(f"No destinations match “{req.destination}”. Try a city, a state such as Rajasthan, or a category such as Beaches.")
    ranked = sorted(pool, key=lambda d: destination_score(uv, d), reverse=True)
    ranked = [d for d in ranked if destination_score(uv, d) > 0]
    if not ranked:
        raise PlanError("No places match those interests in that destination. Try other interests.")
    top = destination_score(uv, ranked[0])
    # extra destinations only if they match nearly as well AND are within a realistic travel distance of the first one
    rest = [d for d in ranked[1:] if destination_score(uv, d) >= 0.75 * top and km(ranked[0], d) <= MAX_HOP_KM]
    order = [ranked[0]]
    while rest and len(order) < 3:
        nxt = min(rest, key=lambda d: km(order[-1], d))
        rest.remove(nxt)
        if km(order[-1], nxt) <= MAX_HOP_KM:
            order.append(nxt)

    n_days = (req.end_date - req.start_date).days + 1
    day_hours, max_stops = STYLE[req.travel_style]
    budget_pp = req.budget / req.travellers if req.budget else None
    spent_pp, days, notes = 0.0, [], []
    for d in order:
        acts = sorted((a for a in d.activities if cosine(uv, a.interest) >= MIN_MATCH), key=lambda a: activity_score(uv, a), reverse=True)
        while len(days) < n_days and acts:
            route = []
            for a in list(acts):
                if budget_pp is not None and spent_pp + a.cost > budget_pp:
                    continue
                if len(route) >= max_stops:
                    break
                trial = order_route(d, route + [a])
                if total_hours(d, trial) <= day_hours:
                    route = trial
            if not route:
                break
            for a in route:
                acts.remove(a)
                spent_pp += a.cost
            clock, prev, items = START_HOUR, d, []
            for a in route:
                clock += hours_between(prev, a)
                items.append({"name": a.name, "time": fmt_time(clock), "cost": a.cost, "description": f"{d.name}: {a.description}".strip(": "),
                              "latitude": a.latitude, "longitude": a.longitude, "duration_hours": a.duration_hours})
                clock += a.duration_hours
                prev = a
            days.append({"day": len(days) + 1, "date": (req.start_date + timedelta(days=len(days))).isoformat(), "destination": d.name, "activities": items})
        if len(days) >= n_days:
            break
    if not days:
        raise PlanError("Nothing fits those limits. Try a higher budget, a longer day style or different interests.")
    if len(days) < n_days:
        notes.append(f"Only {len(days)} of {n_days} days could be filled with matching activities within your limits.")
    if len({x['destination'] for x in days}) > 1:
        notes.append("This trip spans several destinations. Allow extra time for travel between them.")
    if budget_pp is not None and spent_pp >= budget_pp * 0.9:
        notes.append("The plan uses most of your budget. Costs are approximate, so keep a buffer.")
    return {"days": days, "per_person": True, "note": " ".join(notes), "currency": "INR"}
