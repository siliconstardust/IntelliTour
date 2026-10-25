"""Seeds destinations, activities and sample events. Run: python -m app.seed  (or set AUTO_SEED=1 to seed an empty database on startup).
All costs, durations and popularity scores are approximate placeholders. Replace them with verified data before real use."""
import json
from datetime import date
from pathlib import Path
from sqlalchemy import select
from .database import Base, SessionLocal, engine
from .models import Activity, Destination, Event

DATA = Path(__file__).resolve().parent.parent / "seed_data"

EXTRA_DESTINATIONS = [
    ("Pune", "Maharashtra", "City escapes", ["City escapes", "Heritage"], 2500, 18.5204, 73.8567, "Shaniwar Wada", "Peshwa-era forts, hill temples and a lively student food scene."),
    ("Mumbai", "Maharashtra", "City escapes", ["City escapes", "Heritage"], 4000, 19.076, 72.8777, "Gateway of India", "A seafront megacity of colonial landmarks, street food and cafes."),
    ("Delhi", "Delhi", "Heritage", ["Heritage", "City escapes"], 3000, 28.6139, 77.209, "Red Fort", "Mughal monuments, old-city bazaars and busy food streets."),
    ("Agra", "Uttar Pradesh", "Heritage", ["Heritage"], 2500, 27.1767, 78.0081, "Taj Mahal", "Home of the Taj Mahal and the Mughal-era Agra Fort."),
    ("Bengaluru", "Karnataka", "City escapes", ["City escapes", "Nature"], 3500, 12.9716, 77.5946, "Lalbagh", "Gardens, breweries and food institutions in a green tech city."),
    ("Hyderabad", "Telangana", "Heritage", ["Heritage", "City escapes"], 2800, 17.385, 78.4867, "Charminar", "Forts, palaces and the home of Hyderabadi biryani."),
    ("Kolkata", "West Bengal", "Heritage", ["Heritage", "City escapes"], 2600, 22.5726, 88.3639, "Victoria Memorial", "Colonial architecture, book markets and Bengali sweets."),
]

# destination -> (name, interest digits [history nature food adventure spiritual shopping], cost INR, hours, lat, lng, description). Coordinates approximate.
NEW_ACTIVITIES = {
    "Leh, Ladakh": [("Leh Palace and old town walk", "920000", 50, 2, 34.1642, 77.5855, "Hilltop palace above the old market."),
                    ("Shanti Stupa at sunset", "340090", 0, 1.5, 34.1808, 77.5658, "White-domed stupa with valley views."),
                    ("Thiksey Monastery", "630090", 50, 2, 34.058, 77.667, "Hillside monastery with a large Maitreya statue."),
                    ("Hall of Fame Museum", "800000", 40, 1.5, 34.1364, 77.5667, "Army museum on Ladakh's history and mountain warfare."),
                    ("Leh Market stroll", "103009", 0, 1.5, 34.165, 77.583, "Local crafts, dry fruit and cafes.")],
    "Manali": [("Hadimba Temple", "510091", 0, 1, 32.248, 77.18, "Wooden temple in a cedar forest."),
               ("Old Manali cafe walk", "029003", 400, 2, 32.2565, 77.179, "Riverside cafes and small shops."),
               ("Solang Valley", "060800", 800, 3, 32.316, 77.158, "Snow and adventure activities in a high valley."),
               ("Jogini Waterfall trek", "080600", 0, 3, 32.267, 77.181, "Forest trail to a waterfall."),
               ("Vashisht hot springs", "210060", 0, 1, 32.265, 77.189, "Village with temples and hot springs.")],
    "Munnar": [("Tea Museum and plantations", "322003", 125, 1.5, 10.09, 77.062, "How tea is grown and processed."),
               ("Eravikulam National Park", "090400", 200, 3, 10.156, 77.059, "Grasslands and views in a protected park."),
               ("Mattupetty Dam", "070200", 100, 1, 10.107, 77.123, "Reservoir with boating and viewpoints."),
               ("Top Station viewpoint", "080100", 0, 1.5, 10.1, 77.237, "High viewpoint over the Western Ghats."),
               ("Echo Point", "070100", 50, 1, 10.11, 77.133, "Lakeside viewpoint known for echoes.")],
    "Gokarna": [("Om Beach", "064300", 0, 2, 14.523, 74.319, "Beach shaped like the Om symbol."),
                ("Kudle Beach", "075300", 0, 2, 14.534, 74.317, "Long beach with shacks and sunsets."),
                ("Mahabaleshwar Temple", "420090", 0, 1, 14.55, 74.319, "Old Shiva temple in the town."),
                ("Half Moon and Paradise beach trek", "080600", 100, 3, 14.503, 74.316, "Coastal trek to quiet beaches."),
                ("Gokarna main beach sunset", "052000", 0, 1.5, 14.546, 74.314, "Easy evening walk by the sea.")],
    "Havelock Island": [("Radhanagar Beach", "090200", 0, 2.5, 11.986, 92.95, "Wide white-sand beach."),
                        ("Elephant Beach snorkelling", "070900", 1500, 3, 12.0, 92.96, "Boat trip and snorkelling over coral."),
                        ("Kalapathar Beach sunrise", "090100", 0, 1.5, 11.952, 93.005, "Quiet beach good for sunrise."),
                        ("Introductory scuba session", "050900", 4500, 3, 11.976, 92.989, "Beginner dive with an instructor."),
                        ("Neil Island day trip", "060500", 2500, 6, 11.834, 93.046, "Ferry to a smaller, quieter island.")],
    "Hampi": [("Virupaksha Temple", "720090", 0, 1.5, 15.335, 76.46, "Living temple at the centre of the ruins."),
              ("Vittala Temple and stone chariot", "920000", 40, 2, 15.343, 76.475, "Famous stone chariot and carved halls."),
              ("Hemakuta Hill sunset", "440100", 0, 1.5, 15.333, 76.459, "Hilltop shrines and sunset views."),
              ("Lotus Mahal and Elephant Stables", "930000", 40, 2, 15.333, 76.473, "Royal enclosure buildings."),
              ("Coracle ride on the Tungabhadra", "040500", 400, 1, 15.337, 76.464, "Round boat ride on the river.")],
    "Rishikesh": [("Ganga aarti at Triveni Ghat", "200090", 0, 1.5, 30.1, 78.297, "Evening riverside prayer ceremony."),
                  ("Laxman Jhula walk", "330040", 0, 1, 30.127, 78.314, "Iron suspension bridge over the Ganga."),
                  ("Beatles Ashram", "540040", 150, 1.5, 30.103, 78.318, "Abandoned ashram with street art."),
                  ("River rafting (seasonal)", "050800", 1200, 3, 30.133, 78.401, "White-water rafting on the Ganga."),
                  ("Yoga class at an ashram", "020090", 500, 1.5, 30.103, 78.299, "Drop-in session with a local teacher.")],
}


def _vec(digits):
    return [int(c) / 9 for c in digits]


def seed(db):
    dests = json.loads((DATA / "destinations_base.json").read_text(encoding="utf-8"))
    by_name = {}
    for d in dests:
        o = Destination(name=d["name"], state=d["state"], category=d["category"], tags=d["tags"], budget_per_day=d["budget"],
                        description=d["description"], latitude=d["lat"], longitude=d["lng"], wiki=d["wiki"])
        by_name[o.name] = o
    for n, st, cat, tags, bud, lat, lng, wiki, desc in EXTRA_DESTINATIONS:
        by_name[n] = Destination(name=n, state=st, category=cat, tags=tags, budget_per_day=bud, description=desc, latitude=lat, longitude=lng, wiki=wiki)
    for a in json.loads((DATA / "activities_base.json").read_text(encoding="utf-8")):
        by_name[a["city"]].activities.append(Activity(name=a["name"], description=a["desc"], interest=a["t"], cost=a["cost"],
                                                       duration_hours=a["hours"], popularity=a["pop"], latitude=a["lat"], longitude=a["lng"]))
    for n, rows in NEW_ACTIVITIES.items():
        for name, dg, cost, hrs, lat, lng, desc in rows:
            by_name[n].activities.append(Activity(name=name, description=desc, interest=_vec(dg), cost=cost, duration_hours=hrs, popularity=4.2, latitude=lat, longitude=lng))
    db.add_all(by_name.values())

    t = date.today()
    tpl = [("LOCAL EXPERIENCE", "Heritage walk through the old city", "07:30", "Old city gate"), ("OUTDOORS", "Sunset viewpoint exploration", "17:00", "Hilltop trailhead"),
           ("FOOD & CULTURE", "Local food and culture trail", "11:00", "Main market square"), ("OUTDOORS", "Weekend nature excursion", "06:30", "Visitor centre")]
    for m in (0, 1):
        y, mo = t.year + (t.month - 1 + m) // 12, (t.month - 1 + m) % 12 + 1
        for i, day in enumerate((3, 8, 12, 17, 21, 26)):
            c, title, tm, loc = tpl[(i + m) % 4]
            db.add(Event(title=title, category=c, event_date=date(y, mo, day), event_time=tm, location=loc, is_sample=True))
    db.commit()


def init_db(auto=True):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if auto and db.scalar(select(Destination.id).limit(1)) is None:
            seed(db)


if __name__ == "__main__":
    Base.metadata.drop_all(engine)
    init_db()
    print("Seeded.")
