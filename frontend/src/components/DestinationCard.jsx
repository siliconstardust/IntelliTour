import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, Star } from 'lucide-react'
import Photo from './Photo.jsx'
import { useStored } from '../hooks/useStored.js'
import { inr } from '../services/dates.js'

const SIZES = ['s7', 's5', 's4', 's4', 's4', 's5', 's7']

export default function DestinationCard({ d, index = 0, editorial = true }) {
  const [saved, setSaved] = useStored('it_places')
  const on = saved.includes(d.id)
  const toggle = e => { e.preventDefault(); e.stopPropagation(); setSaved(on ? saved.filter(x => x !== d.id) : [...saved, d.id]) }
  return (
    <motion.div className={`dcard ${editorial ? SIZES[index % SIZES.length] : 's4'}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}>
      <Photo src={d.image} wiki={d.wiki} alt={`${d.name}, ${d.state}`} className="fill" />
      <Link to={`/destinations/${d.id}`} className="dlink" aria-label={`${d.name}, ${d.state}. View details`} />
      <div className="dtop">
        <span className="chip">{d.category}</span>
        <button className={`heart${on ? ' on' : ''}`} onClick={toggle} aria-pressed={on} aria-label={on ? `Remove ${d.name} from saved` : `Save ${d.name}`}><Heart size={18} fill={on ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="dbody">
        <p className="dstate">{d.state}</p>
        <h3>{d.name}</h3>
        <p className="ddesc">{d.description}</p>
        <div className="dmeta">
          {d.budget != null && <span>~{inr(d.budget)}/day</span>}
          {d.rating != null && <span><Star size={14} fill="currentColor" /> {Number(d.rating).toFixed(1)}</span>}
          <span className="arrow"><ArrowUpRight size={20} /></span>
        </div>
      </div>
    </motion.div>
  )
}
