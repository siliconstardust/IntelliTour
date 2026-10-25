import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertTriangle, Sparkles, Bookmark, Info } from 'lucide-react'
import InteractiveMap from './InteractiveMap.jsx'
import { CATEGORIES } from '../data/demo.js'
import { DEMO, planTrip } from '../services/api.js'
import { iso, parseISO, addDays, fmtLong, inr } from '../services/dates.js'
import { useStored } from '../hooks/useStored.js'

const STYLES = ['Relaxed', 'Balanced', 'Packed']

function Itinerary({ result, form, onSave, savedMsg }) {
  const start = parseISO(form.from)
  const sum = result.days.reduce((s, d) => s + d.items.reduce((t, i) => t + (+i.cost || 0), 0), 0)
  const total = result.perPerson ? sum * form.travellers : sum
  const budget = +form.budget || 0
  const stops = result.days.flatMap(d => d.items.map((i, j) => ({ ...i, id: `${d.day}-${j}`, state: `Day ${d.day}`, category: i.time || '' }))).filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lng))
    .map((s, i) => ({ ...s, n: i + 1 }))
  return (
    <div className="result">
      <div className="summary">
        <div><span>Estimated cost</span><strong>{inr(total)}</strong><small>{result.perPerson ? `${inr(sum)} per person × ${form.travellers}` : 'as returned by the planner'}</small></div>
        {budget > 0 && <div><span>Your budget</span><strong className={total > budget ? 'over' : 'under'}>{total > budget ? `${inr(total - budget)} over` : `${inr(budget - total)} to spare`}</strong></div>}
        <div><span>Days</span><strong>{result.days.length}</strong></div>
        <button className="btn sm" onClick={onSave}><Bookmark size={16} /> Save itinerary</button>
      </div>
      {savedMsg && <p className="ok" role="status">{savedMsg} <Link to="/saved">View saved trips</Link></p>}
      {result.demo && <p className="demo-note"><Info size={14} /> Demo mode: assembled locally from sample destinations, not by the AI backend.</p>}
      {result.note && <p className="demo-note">{result.note}</p>}
      <div className="days">
        {result.days.map((d, i) => (
          <article key={d.day} className="day-card">
            <h4><span>Day {d.day}</span>{fmtLong(d.date ? parseISO(String(d.date).slice(0, 10)) : addDays(start, i))}</h4>
            <ul>
              {d.items.map((it, j) => (
                <li key={j}>
                  <time>{it.time}</time>
                  <div><strong>{it.name}</strong>{it.description && <p>{it.description}</p>}</div>
                  <span className="cost">{it.cost != null ? inr(it.cost) : ''}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {stops.length > 0 && <InteractiveMap items={stops} height={360} label="Map of itinerary stops" />}
    </div>
  )
}

export default function TripPlannerForm({ destinations, initialDestination = '' }) {
  const [f, setF] = useState({ start: '', destination: initialDestination, from: iso(new Date()), to: iso(addDays(new Date(), 2)), travellers: 2, budget: '', interests: [], style: 'Balanced' })
  const [s, setS] = useState({ loading: false, error: '', result: null, form: null })
  const [trips, setTrips] = useStored('it_trips')
  const [savedMsg, setSavedMsg] = useState('')
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))
  const regions = useMemo(() => [...new Set((destinations || []).flatMap(d => [d.name, d.state]).filter(Boolean))], [destinations])
  const days = Math.round((parseISO(f.to || f.from) - parseISO(f.from)) / 864e5) + 1
  const toggle = c => set('interests', f.interests.includes(c) ? f.interests.filter(x => x !== c) : [...f.interests, c])

  async function submit(e) {
    e.preventDefault(); setSavedMsg('')
    if (!f.from || !f.to || days < 1) return setS({ loading: false, error: 'Choose an end date on or after the start date.', result: null })
    if (!f.destination.trim() && !f.interests.length) return setS({ loading: false, error: 'Add a destination or pick at least one interest.', result: null })
    setS({ loading: true, error: '', result: null })
    try {
      const result = await planTrip({ ...f, travellers: +f.travellers || 1, days }, destinations || [])
      setS({ loading: false, error: '', result, form: { ...f, travellers: +f.travellers || 1 } })
    } catch (err) { setS({ loading: false, error: err.message || 'Could not create the itinerary.', result: null }) }
  }
  function save() {
    setTrips([{ id: Date.now(), savedAt: iso(new Date()), form: s.form, result: s.result }, ...trips])
    setSavedMsg('Saved.')
  }

  return (
    <div className="planner">
      <form className="card pform" onSubmit={submit} noValidate>
        {DEMO && <p className="demo-note"><Info size={14} /> Demo mode: no backend is configured, so plans use sample destinations.</p>}
        <div className="fgrid">
          <label>Starting city<input value={f.start} onChange={e => set('start', e.target.value)} placeholder="e.g. Pune" /></label>
          <label>Destination or region<input list="regions" value={f.destination} onChange={e => set('destination', e.target.value)} placeholder="e.g. Rajasthan" /><datalist id="regions">{regions.map(r => <option key={r} value={r} />)}</datalist></label>
          <label>Start date<input type="date" value={f.from} onChange={e => set('from', e.target.value)} /></label>
          <label>End date<input type="date" min={f.from} value={f.to} onChange={e => set('to', e.target.value)} /></label>
          <label>Travellers<input type="number" min="1" max="20" value={f.travellers} onChange={e => set('travellers', e.target.value)} /></label>
          <label>Budget (₹, optional)<input type="number" min="0" step="500" value={f.budget} onChange={e => set('budget', e.target.value)} placeholder="e.g. 25000" /></label>
        </div>
        <fieldset><legend>Interests</legend>
          <div className="chips">{CATEGORIES.map(c => <button type="button" key={c} className={`fchip${f.interests.includes(c) ? ' on' : ''}`} aria-pressed={f.interests.includes(c)} onClick={() => toggle(c)}>{c}</button>)}</div>
        </fieldset>
        <fieldset><legend>Travel style</legend>
          <div className="chips">{STYLES.map(c => <button type="button" key={c} className={`fchip${f.style === c ? ' on' : ''}`} aria-pressed={f.style === c} onClick={() => set('style', c)}>{c}</button>)}</div>
        </fieldset>
        <button className="btn coral big" disabled={s.loading}>{s.loading ? <><Loader2 className="spin" size={20} /> Planning…</> : <><Sparkles size={20} /> Create my itinerary</>}</button>
      </form>
      <div className="presult" aria-live="polite">
        {s.loading && <div className="loading"><div className="skel" /><div className="skel" /><p>Planning your days. This can take a few seconds.</p></div>}
        {s.error && <div className="state" role="alert"><AlertTriangle /><p>{s.error}</p></div>}
        {s.result && <Itinerary result={s.result} form={s.form} onSave={save} savedMsg={savedMsg} />}
        {!s.loading && !s.error && !s.result && <div className="state small"><Sparkles /><p>Your day-by-day itinerary will appear here.</p></div>}
      </div>
    </div>
  )
}
