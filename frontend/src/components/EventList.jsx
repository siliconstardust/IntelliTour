import { ArrowUpRight, CalendarOff } from 'lucide-react'
import { parseISO } from '../services/dates.js'

const COLORS = ['coral', 'teal', 'yellow']

export default function EventList({ events }) {
  if (!events.length) return <div className="state small"><CalendarOff /><p>Nothing scheduled for this day. Pick a date with a teal dot.</p></div>
  return (
    <ul className="events">
      {events.map((e, i) => {
        const d = parseISO(e.date)
        return (
          <li key={e.id} className="event">
            <div className={`dbadge ${COLORS[i % 3]}`}><strong>{d.getDate()}</strong><span>{d.toLocaleDateString('en-IN', { month: 'short' })}</span></div>
            <div className="einfo">
              <span className="ecat">{e.category}</span>
              <h4>{e.title}</h4>
              <p>{[e.time, e.place].filter(Boolean).join(' · ')}</p>
            </div>
            <ArrowUpRight className="earrow" size={22} aria-hidden="true" />
          </li>
        )
      })}
    </ul>
  )
}
