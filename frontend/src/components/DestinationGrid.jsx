import { useState } from 'react'
import { AlertTriangle, SearchX } from 'lucide-react'
import DestinationCard from './DestinationCard.jsx'
import { CATEGORIES } from '../data/demo.js'

export default function DestinationGrid({ items, loading, error, onRetry, limit }) {
  const [cat, setCat] = useState('All')
  const all = (items || []).filter(d => cat === 'All' || d.tags.includes(cat) || d.category === cat)
  const shown = limit ? all.slice(0, limit) : all
  return (
    <div>
      <div className="chips" role="group" aria-label="Filter by category">
        {['All', ...CATEGORIES].map(c => <button key={c} className={`fchip${cat === c ? ' on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {loading && <div className="dgrid" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className={`skel dcard ${['s7', 's5', 's4'][i % 3]}`} />)}</div>}
      {error && <div className="state" role="alert"><AlertTriangle /><p>{error}</p><button className="btn sm" onClick={onRetry}>Try again</button></div>}
      {!loading && !error && shown.length === 0 && <div className="state"><SearchX /><p>No destinations in this category yet.</p></div>}
      {!loading && !error && shown.length > 0 && <div className="dgrid">{shown.map((d, i) => <DestinationCard key={d.id} d={d} index={i} />)}</div>}
    </div>
  )
}
