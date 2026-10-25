import { Link } from 'react-router-dom'
export default function NotFound() {
  return <section className="page-hero"><div className="wrap"><h1 className="hero-title sm">Lost on the way?</h1><p className="lead">That page does not exist.</p><Link className="btn" to="/">Back home</Link></div></section>
}
