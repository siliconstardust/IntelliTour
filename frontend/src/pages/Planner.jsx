import { useSearchParams } from 'react-router-dom'
import TripPlannerForm from '../components/TripPlannerForm.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getDestinations } from '../services/api.js'

export default function Planner() {
  const [q] = useSearchParams()
  const d = useFetch(getDestinations)
  return (
    <>
      <section className="page-hero"><div className="wrap"><span className="eyebrow">AI trip planner</span><h1 className="hero-title sm">Your kind of trip. <span className="teal">Thoughtfully planned.</span></h1></div></section>
      <section className="sec tight"><div className="wrap"><TripPlannerForm destinations={d.data} initialDestination={q.get('dest') || ''} /></div></section>
    </>
  )
}
