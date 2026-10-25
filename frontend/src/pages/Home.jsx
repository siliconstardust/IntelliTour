import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import DestinationGrid from '../components/DestinationGrid.jsx'
import EventsCalendar from '../components/EventsCalendar.jsx'
import TripPlannerForm from '../components/TripPlannerForm.jsx'
import MapSection from '../components/MapSection.jsx'
import Features from '../components/Features.jsx'
import { SectionHead } from '../components/Reveal.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getDestinations, getEvents, DEMO } from '../services/api.js'

export default function Home() {
  const { hash } = useLocation()
  const dest = useFetch(getDestinations)
  const ev = useFetch(getEvents)
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60) }, [hash])
  return (
    <>
      <Hero />
      <section id="discover" className="sec">
        <div className="wrap">
          <SectionHead eyebrow="Your next chapter" title={<>Somewhere <span className="teal">wonderful</span> is waiting.</>}
            sub="From quiet mountain escapes to vibrant cities, find a place that matches your kind of adventure." />
          <DestinationGrid items={dest.data} loading={dest.loading} error={dest.error} onRetry={dest.reload} limit={7} />
        </div>
      </section>
      <section className="sec alt">
        <div className="wrap">
          <SectionHead eyebrow="Make the most of every journey" title={<>There’s always something <span className="teal">to discover.</span></>} />
          <EventsCalendar events={ev.data} loading={ev.loading} error={ev.error} onRetry={ev.reload} demo={DEMO || !!ev.data?.some(e => e.sample)} />
        </div>
      </section>
      <section id="planner" className="sec">
        <div className="wrap">
          <SectionHead eyebrow="AI trip planner" title={<>Your kind of trip. <span className="teal">Thoughtfully planned.</span></>} />
          <TripPlannerForm destinations={dest.data} />
        </div>
      </section>
      <section id="map" className="sec alt">
        <div className="wrap">
          <SectionHead eyebrow="Explore the map" title={<>Find your way to <span className="teal">somewhere amazing.</span></>} />
          <MapSection items={dest.data} loading={dest.loading} error={dest.error} onRetry={dest.reload} />
        </div>
      </section>
      <Features />
    </>
  )
}
