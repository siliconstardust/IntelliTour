import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Map as MapIcon, List, Search, ArrowRight, AlertTriangle } from 'lucide-react'
import InteractiveMap from './InteractiveMap.jsx'
import { CATEGORIES } from '../data/demo.js'
import { inr } from '../services/dates.js'

export default function MapSection({ items, loading, error, onRetry }) {
  const nav = useNavigate()
  const [view, setView] = useState('map'), [q, setQ] = useState(''), [cat, setCat] = useState('All'), [sel, setSel] = useState(null)
  const list = (items || []).filter(d => (cat === 'All' || d.tags.includes(cat) || d.category === cat) && `${d.name} ${d.state}`.toLowerCase().includes(q.trim().toLowerCase()))
  const selected = list.find(d => d.id === sel) || null
  const open = useCallback(id => nav(`/destinations/${id}`), [nav])

  return (
    <div>
      <div className="map-tools">
        <label className="search"><Search size={18} /><input type="search" placeholder="Search places or states" value={q} onChange={e => setQ(e.target.value)} aria-label="Search destinations" /></label>
        <select value={cat} onChange={e => setCat(e.target.value)} aria-label="Category">
          {['All', ...CATEGORIES].map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="seg" role="group" aria-label="View">
          <button className={view === 'map' ? 'on' : ''} aria-pressed={view === 'map'} onClick={() => setView('map')}><MapIcon size={16} /> Map</button>
          <button className={view === 'list' ? 'on' : ''} aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={16} /> List</button>
        </div>
      </div>
      {error && <div className="state" role="alert"><AlertTriangle /><p>{error}</p><button className="btn sm" onClick={onRetry}>Try again</button></div>}
      {loading && <div className="skel" style={{ minHeight: 460 }} aria-busy="true" />}
      {!loading && !error && (
        <div className="map-grid">
          {view === 'map'
            ? <InteractiveMap items={list} selectedId={sel} onSelect={setSel} onOpen={open} />
            : <ul className="mlist">{list.map(d => <li key={d.id}><button onClick={() => setSel(d.id)} className={d.id === sel ? 'on' : ''}><strong>{d.name}</strong><span>{d.state} · {d.category}</span></button></li>)}
                {!list.length && <li className="muted">No places match your search.</li>}</ul>}
          <aside className="preview" aria-live="polite">
            {selected ? (
              <>
                <span className="chip dark">{selected.category}</span>
                <h3>{selected.name}</h3>
                <p className="dstate">{selected.state}</p>
                <p>{selected.description}</p>
                {selected.budget != null && <p><strong>~{inr(selected.budget)}/day</strong> approx. budget</p>}
                <Link className="btn sm" to={`/destinations/${selected.id}`}>View details <ArrowRight size={16} /></Link>
              </>
            ) : <p className="muted">{list.length ? 'Select a marker or a place to preview it here.' : 'No places match your filters.'}</p>}
          </aside>
        </div>
      )}
    </div>
  )
}
