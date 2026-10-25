import { useEffect, useRef } from 'react'
import L from 'leaflet'

// items: [{ id, name, state, category, lat, lng, n? }]
export default function InteractiveMap({ items, selectedId, onSelect, onOpen, height = 460, label = 'Map of destinations' }) {
  const el = useRef(null), map = useRef(null), layer = useRef(null), fitKey = useRef('')

  useEffect(() => {
    const m = L.map(el.current, { scrollWheelZoom: false }).setView([22.5, 79], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' }).addTo(m)
    layer.current = L.layerGroup().addTo(m); map.current = m
    return () => { m.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const m = map.current; if (!m) return
    layer.current.clearLayers()
    const pts = []
    items.filter(d => Number.isFinite(d.lat) && Number.isFinite(d.lng)).forEach(d => {
      const on = d.id === selectedId
      const mk = L.marker([d.lat, d.lng], { title: d.name, zIndexOffset: on ? 500 : 0,
        icon: L.divIcon({ className: '', html: `<span class="pin${on ? ' on' : ''}">${d.n ?? ''}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(layer.current)
      const box = document.createElement('div')
      const t = document.createElement('strong'); t.textContent = d.name
      const s = document.createElement('div'); s.textContent = [d.state, d.category].filter(Boolean).join(' · ')
      box.append(t, s)
      if (onOpen) { const a = document.createElement('a'); a.href = '#'; a.className = 'pop-link'; a.textContent = 'View details →'; a.onclick = e => { e.preventDefault(); onOpen(d.id) }; box.append(a) }
      mk.bindPopup(box)
      mk.on('click', () => onSelect && onSelect(d.id))
      pts.push([d.lat, d.lng])
    })
    const key = items.map(i => i.id).join(',')
    if (pts.length && key !== fitKey.current) { m.fitBounds(pts, { padding: [40, 40], maxZoom: 10 }); fitKey.current = key }
  }, [items, selectedId, onSelect, onOpen])

  return <div ref={el} className="map" style={{ height }} role="region" aria-label={label} />
}
