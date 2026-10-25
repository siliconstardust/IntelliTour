import { motion } from 'framer-motion'

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  )
}

export function SectionHead({ eyebrow, title, sub, center = false }) {
  return (
    <Reveal className={`shead${center ? ' center' : ''}`}>
      <span className="eyebrow teal">{eyebrow}</span>
      <h2 className="h2">{title}</h2>
      {sub && <p className="lead">{sub}</p>}
    </Reveal>
  )
}
