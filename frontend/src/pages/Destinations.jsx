import DestinationGrid from '../components/DestinationGrid.jsx'
import MapSection from '../components/MapSection.jsx'
import { SectionHead } from '../components/Reveal.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getDestinations } from '../services/api.js'

export default function Destinations() {
  const d = useFetch(getDestinations)
  return (
    <>
      <section className="page-hero"><div className="wrap"><span className="eyebrow">Destinations</span><h1 className="hero-title sm">Pick your <span className="teal">next place.</span></h1></div></section>
      <section className="sec"><div className="wrap"><DestinationGrid items={d.data} loading={d.loading} error={d.error} onRetry={d.reload} /></div></section>
      <section className="sec alt"><div className="wrap">
        <SectionHead eyebrow="On the map" title={<>See where <span className="teal">everything is.</span></>} />
        <MapSection items={d.data} loading={d.loading} error={d.error} onRetry={d.reload} />
      </div></section>
    </>
  )
}
