import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import DestinationCard from '../components/DestinationCard.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { useStored } from '../hooks/useStored.js'
import { getDestinations } from '../services/api.js'
import { inr } from '../services/dates.js'

export default function Saved() {
  const d = useFetch(getDestinations)
  const [places] = useStored('it_places')
  const [trips, setTrips] = useStored('it_trips')
  const mine = (d.data || []).filter(x => places.includes(x.id))
  return (
    <>
      <section className="page-hero"><div className="wrap"><span className="eyebrow">Saved</span><h1 className="hero-title sm">Your <span className="teal">saved trips</span> and places</h1></div></section>
      <section className="sec tight"><div className="wrap">
        <h2 className="h3">Itineraries</h2>
        {trips.length === 0 && <div className="state small"><p>No saved itineraries yet. <Link to="/planner">Create one</Link>.</p></div>}
        <div className="tripl">
          {trips.map(t => (
            <details key={t.id} className="card trip">
              <summary><strong>{t.form.destination || t.form.interests.join(', ') || 'Trip'}</strong> · {t.result.days.length} day(s) · saved {t.savedAt}</summary>
              {t.result.days.map(day => <div key={day.day}><h4>Day {day.day}</h4><ul>{day.items.map((i, k) => <li key={k}>{i.time} {i.name}{i.cost != null ? ` (${inr(i.cost)})` : ''}</li>)}</ul></div>)}
              <button className="btn ghost sm" onClick={() => setTrips(trips.filter(x => x.id !== t.id))}><Trash2 size={16} /> Remove</button>
            </details>
          ))}
        </div>
        <h2 className="h3" style={{ marginTop: 48 }}>Places</h2>
        {!d.loading && mine.length === 0 && <div className="state small"><p>No saved places yet. Tap the heart on any destination.</p></div>}
        <div className="dgrid">{mine.map((x, i) => <DestinationCard key={x.id} d={x} index={i} editorial={false} />)}</div>
      </div></section>
    </>
  )
}
