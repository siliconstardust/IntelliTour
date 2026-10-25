// Sample content used ONLY when VITE_API_URL is not set (demo mode). The UI labels it as demo data.
import { iso } from '../services/dates.js'

export const CATEGORIES = ['Mountains', 'Beaches', 'Heritage', 'Nature', 'Spiritual', 'City escapes']

export const DEMO_DESTINATIONS = [
  { id: 1, name: 'Leh, Ladakh', state: 'Ladakh', category: 'Mountains', tags: ['Mountains', 'Nature'], budget: 3500, lat: 34.1526, lng: 77.5771, wiki: 'Leh Palace',
    description: 'High-altitude desert, ancient monasteries and some of the clearest night skies in India.',
    highlights: ['Leh Palace and old town walk', 'Shanti Stupa at sunset', 'Pangong Lake day trip', 'Nubra Valley and Hunder dunes', 'Thiksey Monastery'] },
  { id: 2, name: 'Manali', state: 'Himachal Pradesh', category: 'Mountains', tags: ['Mountains', 'Nature'], budget: 2500, lat: 32.2432, lng: 77.1892, wiki: 'Solang Valley',
    description: 'Pine forests, snow valleys and cafes on the banks of the Beas.',
    highlights: ['Hadimba Temple', 'Old Manali cafe walk', 'Solang Valley', 'Jogini Waterfall trek', 'Vashisht hot springs'] },
  { id: 3, name: 'Munnar', state: 'Kerala', category: 'Nature', tags: ['Nature', 'Mountains'], budget: 2500, lat: 10.0889, lng: 77.0595, wiki: 'Munnar',
    description: 'Rolling tea estates, misty hills and winding roads in the Western Ghats.',
    highlights: ['Tea Museum and plantations', 'Eravikulam National Park', 'Mattupetty Dam', 'Top Station viewpoint', 'Echo Point'] },
  { id: 4, name: 'Goa', state: 'Goa', category: 'Beaches', tags: ['Beaches', 'Heritage', 'City escapes'], budget: 3500, lat: 15.4909, lng: 73.8278, wiki: 'Baga Beach',
    description: 'Palm-lined beaches, Portuguese-era churches and a relaxed coastal pace.',
    highlights: ['Fort Aguada', 'Old Goa churches', 'Fontainhas heritage walk', 'Palolem Beach', 'Spice plantation lunch'] },
  { id: 5, name: 'Gokarna', state: 'Karnataka', category: 'Beaches', tags: ['Beaches', 'Spiritual'], budget: 1800, lat: 14.5479, lng: 74.3188, wiki: 'Gokarna, Karnataka',
    description: 'A temple town with quiet beaches reached by short coastal treks.',
    highlights: ['Om Beach', 'Kudle Beach', 'Mahabaleshwar Temple', 'Half Moon and Paradise beach trek', 'Main beach sunset'] },
  { id: 6, name: 'Havelock Island', state: 'Andaman and Nicobar Islands', category: 'Beaches', tags: ['Beaches', 'Nature'], budget: 5000, lat: 11.974, lng: 92.987, wiki: 'Radhanagar Beach',
    description: 'Clear water, coral reefs and some of Asia’s best-known beaches.',
    highlights: ['Radhanagar Beach', 'Elephant Beach snorkelling', 'Kalapathar Beach sunrise', 'Introductory scuba session', 'Neil Island day trip'] },
  { id: 7, name: 'Jaipur', state: 'Rajasthan', category: 'Heritage', tags: ['Heritage', 'City escapes'], budget: 3000, lat: 26.9124, lng: 75.7873, wiki: 'Hawa Mahal',
    description: 'The Pink City: forts, palaces and bazaars full of crafts.',
    highlights: ['Amber Fort', 'City Palace and Jantar Mantar', 'Hawa Mahal', 'Nahargarh sunset', 'Johari Bazaar'] },
  { id: 8, name: 'Hampi', state: 'Karnataka', category: 'Heritage', tags: ['Heritage', 'Nature'], budget: 1800, lat: 15.335, lng: 76.46, wiki: 'Hampi',
    description: 'Boulder-strewn ruins of the Vijayanagara empire beside the Tungabhadra.',
    highlights: ['Virupaksha Temple', 'Vittala Temple and stone chariot', 'Hemakuta Hill sunset', 'Lotus Mahal and Elephant Stables', 'Coracle ride on the Tungabhadra'] },
  { id: 9, name: 'Varanasi', state: 'Uttar Pradesh', category: 'Spiritual', tags: ['Spiritual', 'Heritage'], budget: 2000, lat: 25.3176, lng: 82.9739, wiki: 'Dashashwamedh Ghat',
    description: 'One of the world’s oldest living cities, centred on the ghats of the Ganga.',
    highlights: ['Dawn boat ride', 'Dashashwamedh Ghat aarti', 'Kashi Vishwanath Temple', 'Sarnath', 'Kachori Gali breakfast'] },
  { id: 10, name: 'Rishikesh', state: 'Uttarakhand', category: 'Spiritual', tags: ['Spiritual', 'Nature', 'Mountains'], budget: 2200, lat: 30.0869, lng: 78.2676, wiki: 'Lakshman Jhula',
    description: 'Yoga, riverside ashrams and the foothills of the Himalaya.',
    highlights: ['Ganga aarti at Triveni Ghat', 'Laxman Jhula walk', 'Beatles Ashram', 'River rafting (seasonal)', 'Yoga class at an ashram'] },
  { id: 11, name: 'Udaipur', state: 'Rajasthan', category: 'City escapes', tags: ['City escapes', 'Heritage'], budget: 3500, lat: 24.5854, lng: 73.7125, wiki: 'City Palace, Udaipur',
    description: 'Lakeside palaces and old-city lanes, one of India’s most romantic cities.',
    highlights: ['City Palace', 'Lake Pichola boat ride', 'Saheliyon ki Bari', 'Monsoon Palace sunset', 'Ambrai Ghat dinner'] },
  { id: 12, name: 'Kochi', state: 'Kerala', category: 'City escapes', tags: ['City escapes', 'Heritage', 'Nature'], budget: 2800, lat: 9.9312, lng: 76.2673, wiki: 'Chinese fishing nets',
    description: 'A harbour city of spice history, art cafes and backwater cruises.',
    highlights: ['Fort Kochi walk', 'Chinese fishing nets', 'Mattancherry Palace', 'Kathakali performance', 'Backwater cruise'] },
]

// Clearly labelled demonstration events, generated for the current and next month.
export function demoEvents() {
  const t = new Date(), out = []
  const T = [['LOCAL EXPERIENCE', 'Heritage walk through the old city', '07:30', 'Old city gate'],
    ['OUTDOORS', 'Sunset viewpoint exploration', '17:00', 'Hilltop trailhead'],
    ['FOOD & CULTURE', 'Local food and culture trail', '11:00', 'Main market square'],
    ['OUTDOORS', 'Weekend nature excursion', '06:30', 'Visitor centre']]
  ;[0, 1].forEach(m => [3, 8, 12, 17, 21, 26].forEach((day, i) => {
    const [category, title, time, place] = T[(i + m) % 4]
    out.push({ id: `demo-${m}-${day}`, date: iso(new Date(t.getFullYear(), t.getMonth() + m, day)), category, title, time, place })
  }))
  out.push({ id: 'demo-extra', date: iso(new Date(t.getFullYear(), t.getMonth(), 12)), category: 'FOOD & CULTURE', title: 'Street food evening', time: '19:00', place: 'Market square' })
  return out
}
