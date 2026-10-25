import { Link } from 'react-router-dom'
import { Gem, Route, Landmark, Heart, ArrowRight } from 'lucide-react'
import Photo from './Photo.jsx'
import { Reveal, SectionHead } from './Reveal.jsx'

const F = [
  { icon: Gem, t: 'Discover hidden gems', c: 'coral', wiki: 'Spiti Valley', p: 'Go beyond the usual list with places locals love.' },
  { icon: Route, t: 'Build personalized itineraries', c: 'teal', wiki: 'Kerala backwaters', p: 'Tell us what you enjoy and get a plan that fits your days.' },
  { icon: Landmark, t: 'Explore local culture', c: 'yellow', wiki: 'Kathakali', p: 'Festivals, food trails and heritage walks in every region.' },
  { icon: Heart, t: 'Save your favorite places', c: 'coral', wiki: 'Great Rann of Kutch', p: 'Keep a shortlist and come back to it when you are ready.' },
]

export default function Features() {
  return (
    <>
      <section id="experiences" className="sec">
        <div className="wrap">
          <SectionHead eyebrow="Experiences" title={<>Travel that feels <span className="teal">like you</span>.</>} />
          <div className="fgrid4">
            {F.map((x, i) => (
              <Reveal key={x.t} delay={i * 0.08}>
                <article className="fcard">
                  <Photo wiki={x.wiki} alt="" size={700} />
                  <span className={`ficon ${x.c}`}><x.icon size={20} /></span>
                  <h3>{x.t}</h3><p>{x.p}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="sec tight">
        <div className="wrap">
          <Reveal>
            <div className="cta">
              <h2 className="h2">Stop dreaming about the trip.<br />Start planning it.</h2>
              <Link to="/planner" className="btn">Start with the AI planner <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
