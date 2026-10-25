// All backend access lives here. Set VITE_API_URL to your FastAPI base URL.
// Expected endpoints (adjust the paths or the normalisers below to match your API):
//   GET  /destinations -> [{ id, name, state, category, budget, rating, description, latitude, longitude, image_url }]
//   GET  /events       -> [{ id, date, title, category, time, location }]
//   POST /trips/plan   -> { days: [{ day, date, activities: [{ name, time, cost, description, latitude, longitude }] }] }
import { DEMO_DESTINATIONS, demoEvents } from '../data/demo.js'

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const DEMO = !BASE

async function req(path, opts = {}) {
  let r
  try { r = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts }) }
  catch { throw new Error('Cannot reach the server. Check your connection or the API address.') }
  if (!r.ok) {
    let m = ''
    try { const j = await r.json(); m = typeof j.detail === 'string' ? j.detail : '' } catch { /* ignore */ }
    throw new Error(m || `The server returned an error (${r.status}).`)
  }
  return r.json()
}

const normDest = d => ({
  id: d.id ?? d.destination_id, name: d.name, state: d.state || d.region || '',
  category: d.category || 'Heritage', tags: d.tags?.length ? d.tags : [d.category].filter(Boolean),
  budget: d.budget ?? d.budget_per_day ?? d.estimated_budget ?? null, rating: d.rating ?? null,
  description: d.description || '', lat: +(d.latitude ?? d.lat), lng: +(d.longitude ?? d.lng ?? d.lon),
  image: d.image_url || d.image || null, wiki: d.wiki || d.name, highlights: d.highlights || [],
})

let destPromise = null
export function getDestinations() {
  if (!destPromise) {
    destPromise = (DEMO ? Promise.resolve(DEMO_DESTINATIONS) : req('/destinations').then(j => Array.isArray(j) ? j : j.items || j.destinations || []))
      .then(list => list.map(normDest)).catch(e => { destPromise = null; throw e })
  }
  return destPromise
}

export async function getEvents() {
  const list = DEMO ? demoEvents() : await req('/events').then(j => Array.isArray(j) ? j : j.items || j.events || [])
  return list.map(e => ({ id: e.id, date: String(e.date || e.start_date || '').slice(0, 10), category: String(e.category || 'LOCAL EXPERIENCE').toUpperCase(),
    title: e.title || e.name, time: e.time || e.start_time || '', place: e.location || e.place || '', sample: DEMO || !!(e.is_sample ?? e.sample) }))
}

const rad = x => x * Math.PI / 180
const km = (a, b) => { const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)) }

// Demo mode only: builds a plan locally from the sample destinations. Never used when an API is configured.
function localPlan(p, all) {
  if (!all.length) throw new Error('Destinations are still loading. Try again in a moment.')
  const per = { Relaxed: 1, Balanced: 2, Packed: 3 }[p.style] || 2
  const q = (p.destination || '').trim().toLowerCase()
  const scored = all.map(d => ({ d, s: d.tags.filter(t => p.interests.includes(t)).length + (q && `${d.name} ${d.state} ${d.category}`.toLowerCase().includes(q) ? 3 : 0) }))
    .filter(x => x.s > 0 || (!q && !p.interests.length)).sort((a, b) => b.s - a.s)
  if (!scored.length) throw new Error('No sample destinations match that region or those interests. Try other interests or clear the destination.')
  const order = [scored[0].d], rest = scored.slice(1).map(x => x.d)
  while (rest.length && order.length < 4) { rest.sort((a, b) => km(order.at(-1), a) - km(order.at(-1), b)); order.push(rest.shift()) }
  const pool = order.flatMap(d => d.highlights.map(name => ({ name, d })))
  const want = Math.max(1, Math.min(7, p.days)), n = Math.max(1, Math.min(want, Math.floor(pool.length / per)))
  const slots = ['09:30', '13:00', '16:30']
  const days = Array.from({ length: n }, (_, i) => ({ day: i + 1, items: pool.slice(i * per, (i + 1) * per).map((x, j) => ({
    name: x.name, time: slots[j], cost: Math.round((x.d.budget || 2500) / per / 10) * 10, description: `${x.d.name}, ${x.d.state}`, lat: x.d.lat, lng: x.d.lng })) }))
  return { days, demo: true, perPerson: true, note: n < want ? `The sample data covers ${n} day(s) for this selection.` : '' }
}

export async function planTrip(p, destinations) {
  if (DEMO) return localPlan(p, destinations)
  const j = await req('/trips/plan', { method: 'POST', body: JSON.stringify({
    start_city: p.start, destination: p.destination, start_date: p.from, end_date: p.to, travellers: p.travellers,
    budget: p.budget || null, interests: p.interests, travel_style: p.style }) })
  const days = (j.days || j.itinerary || []).map((d, i) => ({ day: d.day || i + 1, date: d.date, items: (d.activities || d.items || d.stops || []).map(a => ({
    name: a.name || a.title, time: a.time || a.start_time || '', cost: a.cost ?? a.estimated_cost ?? null, description: a.description || a.location || '',
    lat: +(a.latitude ?? a.lat) || null, lng: +(a.longitude ?? a.lng ?? a.lon) || null })) }))
  if (!days.length) throw new Error('The planner returned no itinerary. Try different details.')
  return { days, demo: false, perPerson: !!j.per_person, note: j.note || '' }
}
