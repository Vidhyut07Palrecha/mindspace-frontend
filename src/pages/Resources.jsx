import { useState, useEffect, useRef } from 'react'
import { Wind, Phone, Heart, ChevronDown, ChevronUp } from 'lucide-react'

const EXERCISES = [
  {
    name: '4-7-8 Breathing',
    desc: 'Reduces anxiety and helps you fall asleep. Breathe in 4, hold 7, out 8.',
    phases: [
      { label: 'Breathe In', duration: 4, color: '#4F8EF7' },
      { label: 'Hold',       duration: 7, color: '#7B5CF0' },
      { label: 'Breathe Out',duration: 8, color: '#36D9A0' },
    ],
    benefit: 'Activates the parasympathetic nervous system — your body\'s natural calm response.',
  },
  {
    name: 'Box Breathing',
    desc: 'Used by Navy SEALs to stay calm under pressure. Equal counts of 4.',
    phases: [
      { label: 'Breathe In', duration: 4, color: '#4F8EF7' },
      { label: 'Hold',       duration: 4, color: '#7B5CF0' },
      { label: 'Breathe Out',duration: 4, color: '#36D9A0' },
      { label: 'Hold',       duration: 4, color: '#F7A94F' },
    ],
    benefit: 'Resets your autonomic nervous system and improves focus and concentration.',
  },
  {
    name: 'Deep Belly Breath',
    desc: 'The simplest and most effective. Slow, deep breaths from your diaphragm.',
    phases: [
      { label: 'Breathe In', duration: 5, color: '#4F8EF7' },
      { label: 'Breathe Out',duration: 6, color: '#36D9A0' },
    ],
    benefit: 'Lowers heart rate and blood pressure. Perfect for beginners.',
  },
]

const HELPLINES = [
  { name: 'iCall (India)', number: '9152987821', desc: 'Free psychological counselling — Mon to Sat, 8am–10pm', color: '#4F8EF7' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health helpline — free and confidential', color: '#36D9A0' },
  { name: 'NIMHANS (Bangalore)', number: '080-46110007', desc: 'National Institute of Mental Health — professional guidance', color: '#7B5CF0' },
  { name: 'Snehi India', number: '044-24640050', desc: 'Emotional support helpline — Mon to Sat, 8am–10pm', color: '#F7A94F' },
]

const TIPS = [
  { emoji: '🚶', title: 'Take a 10-minute walk', desc: 'Even a short walk releases endorphins and breaks the cycle of anxious thoughts.' },
  { emoji: '📵', title: 'Phone-free hour', desc: 'One hour without your phone before bed dramatically improves sleep quality.' },
  { emoji: '💧', title: 'Hydrate first thing', desc: 'Drink a glass of water before coffee. Dehydration worsens anxiety and low mood.' },
  { emoji: '📓', title: 'Write 3 things', desc: 'Each morning, write 3 things you\'re grateful for. Small but proven to shift mindset.' },
  { emoji: '🌿', title: 'Go outside', desc: '20 minutes in nature reduces cortisol (stress hormone) levels significantly.' },
  { emoji: '😴', title: 'Consistent sleep time', desc: 'Going to bed at the same time every night is the single best thing for mental health.' },
]

function BreathingExercise({ exercise }) {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [countdown, setCountdown] = useState(exercise.phases[0].duration)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhaseIdx(pi => {
            const next = (pi + 1) % exercise.phases.length
            if (next === 0) setCycles(c => c + 1)
            setCountdown(exercise.phases[next].duration)
            return next
          })
          return exercise.phases[(phaseIdx + 1) % exercise.phases.length].duration
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phaseIdx])

  function toggle() {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
      setPhaseIdx(0)
      setCountdown(exercise.phases[0].duration)
      setCycles(0)
    } else {
      setRunning(true)
    }
  }

  const phase = exercise.phases[phaseIdx]
  const progress = running ? (phase.duration - countdown) / phase.duration : 0
  const size = 120
  const r = 46
  const circ = 2 * Math.PI * r

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '14px', padding: '24px',
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{exercise.name}</h3>
      <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>{exercise.desc}</p>

      {/* Circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border2)" strokeWidth={4} />
            <circle
              cx={size/2} cy={size/2} r={r} fill="none"
              stroke={phase.color} strokeWidth={4}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: phase.color, fontFamily: 'Syne, sans-serif' }}>
              {running ? countdown : '·'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
              {running ? phase.label : 'Ready'}
            </div>
          </div>
        </div>

        {cycles > 0 && (
          <div style={{ fontSize: 12, color: 'var(--accent3)', marginTop: 8 }}>
            {cycles} cycle{cycles > 1 ? 's' : ''} completed ✓
          </div>
        )}
      </div>

      <button onClick={toggle} style={{
        width: '100%', padding: '10px',
        background: running ? 'var(--card2)' : `linear-gradient(135deg, ${phase.color}cc, ${phase.color})`,
        border: `1px solid ${running ? 'var(--border2)' : phase.color}`,
        borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 500,
        transition: 'all 0.2s',
      }}>
        {running ? '■ Stop' : '▶ Start'}
      </button>

      <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, lineHeight: 1.6 }}>{exercise.benefit}</p>
    </div>
  )
}

export default function Resources() {
  const [openTip, setOpenTip] = useState(null)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 2rem 4rem' }}>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Resources & Exercises</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Tools to help you find calm and take care of yourself</p>
      </div>

      {/* Breathing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Wind size={16} color="var(--accent)" />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Guided Breathing Exercises</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 40 }}>
        {EXERCISES.map(ex => <BreathingExercise key={ex.name} exercise={ex} />)}
      </div>

      {/* Self-care tips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Heart size={16} color="#F75C5C" />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Daily Self-Care Tips</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginBottom: 40 }}>
        {TIPS.map((tip, i) => (
          <div key={tip.title}
            onClick={() => setOpenTip(openTip === i ? null : i)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '14px 16px',
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{tip.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{tip.title}</span>
              </div>
              {openTip === i ? <ChevronUp size={14} color="var(--text3)" /> : <ChevronDown size={14} color="var(--text3)" />}
            </div>
            {openTip === i && (
              <p className="fade-in" style={{ fontSize: 12, color: 'var(--text2)', marginTop: 10, lineHeight: 1.7 }}>
                {tip.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Helplines */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Phone size={16} color="var(--accent3)" />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Professional Helplines (India)</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {HELPLINES.map(h => (
          <div key={h.name} style={{
            background: 'var(--card)', border: `1px solid ${h.color}33`,
            borderRadius: '14px', padding: '18px 20px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: h.color, marginBottom: 4 }}>{h.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>{h.number}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>{h.desc}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 40, lineHeight: 1.8 }}>
        MindSpace is a supportive tool, not a replacement for professional care.<br />
        If you are in crisis, please reach out to a helpline or a trusted person immediately.
      </p>
    </div>
  )
}
