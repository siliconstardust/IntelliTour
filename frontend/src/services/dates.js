const pad = n => String(n).padStart(2, '0')
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const fmtLong = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
export const inr = n => '₹' + Math.round(n).toLocaleString('en-IN')
