import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Sparkles, AlertTriangle } from 'lucide-react'
import Photo from '../components/Photo.jsx'
import InteractiveMap from '../components/InteractiveMap.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { useStored } from '../hooks/useStored.js'
import { getDestinations } from '../services/api.js'
import { inr } from '../services/dates.js'

export default function DestinationDetail() {
  const { id } = useParams()
  const { data, loading, error, reload } = useFetch(getDestinations)
  const [saved, setSaved] = useStored('it_places')
  const d = (data || []).find(x => String(x.id) === id)
  if (loading) return <section className="page-hero"><div className="wrap"><div className="skel" style={{ minHeight: 300 }} /></div></section>
  if (error) return <section className="page-hero"><div className="wrap"><div className="state" role="alert"><AlertTriangle /><p>{error}</p><button className="btn sm" onClick={reload}>Try again</button></div></div></section>
  if (!d) return <section className="page-hero"><div className="wrap"><h1 className="hero-title sm">Place not found</h1><Link className="btn" to="/destinations">Back to destinations</Link></div></section>
  const on = saved.includes(d.id)
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Link to="/destinations" className="back"><ArrowLeft size={16} /> All destinations</Link>
          <span className="eyebrow">{d.state} · {d.category}</span>
          <h1 className="hero-title sm">{d.name}</h1>
        </div>
      </section>
      <section className="sec tight">
        <div className="wrap detail">
          <Photo src={d.image} wiki={d.wiki} alt={`${d.name}, ${d.state}`} size={1200} className="dphoto" eager />
          <div>
            <p className="lead">{d.description}</p>
            <ul className="facts">
              {d.budget != null && <li><span>Approx. budget</span><strong>{inr(d.budget)} per day</strong></li>}
              {d.rating != null && <li><span>Rating</span><strong>{Number(d.rating).toFixed(1)} / 5</strong></li>}
              <li><span>Best for</span><strong>{d.tags.join(', ')}</strong></li>
            </ul>
            {d.highlights.length > 0 && <><h3 className="h3">Highlights</h3><ul className="hl">{d.highlights.map(h => <li key={h}>{h}</li>)}</ul></>}
            <div className="row">
              <Link className="btn coral" to={`/planner?dest=${encodeURIComponent(d.name)}`}><Sparkles size={18} /> Plan a trip here</Link>
              <button className="btn ghost" aria-pressed={on} onClick={() => setSaved(on ? saved.filter(x => x !== d.id) : [...saved, d.id])}><Heart size={18} fill={on ? 'currentColor' : 'none'} /> {on ? 'Saved' : 'Save place'}</button>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 32 }}><InteractiveMap items={[d]} height={320} label={`Map showing ${d.name}`} /></div>
      </section>
    </>
  )
}
