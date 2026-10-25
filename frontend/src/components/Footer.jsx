import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

const env = import.meta.env || {}
const SOCIAL = [['Instagram', env.VITE_SOCIAL_INSTAGRAM], ['X', env.VITE_SOCIAL_X], ['YouTube', env.VITE_SOCIAL_YOUTUBE]].filter(([, u]) => u)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap fgrid-foot">
        <div>
          <Link to="/" className="logo light"><span className="logo-mark"><Compass size={20} /></span>IntelliTour</Link>
          <p>An intelligent tourist system that helps you discover places across India and plan trips day by day.</p>
        </div>
        <div><h4>Explore</h4><Link to="/#discover">Discover</Link><Link to="/destinations">Destinations</Link><Link to="/#experiences">Experiences</Link></div>
        <div><h4>Plan</h4><Link to="/planner">AI trip planner</Link><Link to="/saved">Saved trips</Link></div>
        {(env.VITE_CONTACT_EMAIL || SOCIAL.length > 0) && (
          <div><h4>Contact</h4>
            {env.VITE_CONTACT_EMAIL && <a href={`mailto:${env.VITE_CONTACT_EMAIL}`}>{env.VITE_CONTACT_EMAIL}</a>}
            {SOCIAL.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n}</a>)}
          </div>
        )}
      </div>
      <div className="wrap copy">© {new Date().getFullYear()} IntelliTour. Maps © OpenStreetMap contributors. Photos from Wikipedia.</div>
    </footer>
  )
}
