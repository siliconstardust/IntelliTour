import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Bookmark, ArrowRight, Menu, X } from 'lucide-react'
import { useStored } from '../hooks/useStored.js'

const LINKS = [['Discover', '/#discover'], ['Destinations', '/destinations'], ['AI Trip Planner', '/planner'], ['Experiences', '/#experiences']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [places] = useStored('it_places')
  const [trips] = useStored('it_trips')
  const { pathname, hash } = useLocation()
  const count = places.length + trips.length

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  return (
    <header className={`nav${solid ? ' solid' : ''}`}>
      <div className="wrap nav-in">
        <Link to="/" className="logo" aria-label="IntelliTour home"><span className="logo-mark"><Compass size={20} /></span>IntelliTour</Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([t, to]) => to.startsWith('/#')
            ? <Link key={t} to={to}>{t}</Link>
            : <NavLink key={t} to={to}>{t}</NavLink>)}
        </nav>
        <div className="nav-right">
          <Link to="/saved" className="icon-btn" aria-label={`Saved trips and places (${count})`}>
            <Bookmark size={20} />{count > 0 && <span className="badge">{count}</span>}
          </Link>
          <Link to="/planner" className="btn sm hide-sm">Plan your trip <ArrowRight size={16} /></Link>
          <button className="icon-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={22} /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="drawer" role="dialog" aria-label="Menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
              <button className="icon-btn close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></button>
              {LINKS.map(([t, to]) => <Link key={t} to={to} className="drawer-link">{t}</Link>)}
              <Link to="/saved" className="drawer-link">Saved trips</Link>
              <Link to="/planner" className="btn coral">Plan your trip <ArrowRight size={16} /></Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
