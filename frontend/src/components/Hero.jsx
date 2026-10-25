import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Sun, Sparkles, Compass, ArrowRight } from 'lucide-react'
import Photo from './Photo.jsx'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Sun className="deco d1" size={56} aria-hidden="true" />
      <Sparkles className="deco d2" size={40} aria-hidden="true" />
      <Compass className="deco d3" size={48} aria-hidden="true" />
      <MapPin className="deco d4" size={44} aria-hidden="true" />
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="eyebrow"><MapPin size={16} /> Your next adventure starts here</span>
          <h1 id="hero-title" className="hero-title">Explore more.<br /><span className="teal">Experience everything.</span></h1>
          <p className="lead">Discover incredible places, find hidden gems, and create journeys that feel uniquely yours.</p>
          <div className="row center">
            <Link className="btn" to="/destinations">Explore destinations <ArrowRight size={18} /></Link>
            <Link className="btn ghost" to="/planner">Plan with AI</Link>
          </div>
        </motion.div>
        <motion.div className="hero-photo" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
          <Photo wiki="Taj Mahal" alt="The Taj Mahal in Agra" size={1400} eager />
          <span className="sticker">Less scrolling.<br />More exploring.</span>
        </motion.div>
      </div>
    </section>
  )
}
