import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import EventList from './EventList.jsx'
import { iso, parseISO, fmtLong } from '../services/dates.js'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function EventsCalendar({ events, loading, error, onRetry, demo }) {
  const today = new Date(), todayIso = iso(today)
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [sel, setSel] = useState(todayIso)
  const byDate = useMemo(() => { const m = {}; (events || []).forEach(e => (m[e.date] ||= []).push(e)); return m }, [events])
  const first = view.getDay(), dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))]
  const move = n => setView(new Date(view.getFullYear(), view.getMonth() + n, 1))

  return (
    <div className="cal-wrap">
      <div className="card cal" aria-busy={loading}>
        <div className="cal-head">
          <h3>{view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
          <div>
            <button className="icon-btn" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft /></button>
            <button className="icon-btn" onClick={() => move(1)} aria-label="Next month"><ChevronRight /></button>
          </div>
        </div>
        <div className="cal-grid" role="grid" aria-label="Calendar">
          {DOW.map(d => <span key={d} className="dow" role="columnheader">{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />
            const k = iso(d), has = !!byDate[k]
            return (
              <button key={k} className={`day${k === sel ? ' sel' : ''}${k === todayIso ? ' today' : ''}`} aria-pressed={k === sel}
                aria-label={`${fmtLong(d)}${has ? `, ${byDate[k].length} experience(s)` : ''}`} onClick={() => setSel(k)}>
                {d.getDate()}{has && <i className="dot" />}
              </button>
            )
          })}
        </div>
        {demo && <p className="demo-note">Demonstration events. They are sample data, not real listings.</p>}
      </div>
      <div className="day-panel">
        <h3 className="day-title">{fmtLong(parseISO(sel))}</h3>
        {loading && <div className="skel" style={{ minHeight: 220 }} />}
        {error && <div className="state small" role="alert"><AlertTriangle /><p>{error}</p><button className="btn sm" onClick={onRetry}>Try again</button></div>}
        {!loading && !error && <EventList events={byDate[sel] || []} />}
      </div>
    </div>
  )
}
