import { Link } from 'react-router-dom'
import { MessageCircle, BarChart2, BookHeart, ArrowRight, Sparkles } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    color: '#4F8EF7',
    bg: '#4F8EF710',
    title: 'AI Companion Chat',
    desc: 'Talk about how you feel. Our AI listens, detects your emotion, and responds with empathy and practical coping strategies.',
    to: '/chat',
  },
  {
    icon: BarChart2,
    color: '#36D9A0',
    bg: '#36D9A010',
    title: 'Mood Tracker',
    desc: 'Log your mood daily and visualise your emotional patterns over the week with interactive charts.',
    to: '/mood',
  },
  {
    icon: BookHeart,
    color: '#7B5CF0',
    bg: '#7B5CF010',
    title: 'Resources & Exercises',
    desc: 'Guided breathing exercises, personalised self-care tips, and access to professional helplines.',
    to: '/resources',
  },
]

const emotions = [
  { label: 'Happy', color: '#36D9A0', emoji: '😊' },
  { label: 'Calm', color: '#4F8EF7', emoji: '😌' },
  { label: 'Anxious', color: '#F7A94F', emoji: '😰' },
  { label: 'Sad', color: '#4F8EF7', emoji: '😢' },
  { label: 'Angry', color: '#F75C5C', emoji: '😤' },
]

export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 4rem' }}>

      {/* Hero */}
      <div className="fade-in" style={{ textAlign: 'center', padding: '80px 0 60px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 100, padding: '6px 14px',
          fontSize: 12, color: 'var(--accent)', marginBottom: 28,
          fontWeight: 500,
        }}>
          <Sparkles size={12} />
          AI-Powered Mental Wellness
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #E8EEF8 30%, #4F8EF7 70%, #7B5CF0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Your mental health<br />companion, always here.
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text2)',
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Talk to an AI that truly listens. Track your mood. Find calm.
          MindSpace gives you a safe, judgment-free space anytime you need it.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/chat" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            color: '#fff', textDecoration: 'none',
            padding: '13px 26px', borderRadius: '14px',
            fontSize: 15, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(79,142,247,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.3)' }}
          >
            Start your check-in <ArrowRight size={16} />
          </Link>
          <Link to="/mood" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--card)', border: '1px solid var(--border2)',
            color: 'var(--text)', textDecoration: 'none',
            padding: '13px 26px', borderRadius: '14px',
            fontSize: 15, fontWeight: 500,
            transition: 'border-color 0.2s',
          }}>
            Track my mood
          </Link>
        </div>
      </div>

      {/* Emotion pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 80, flexWrap: 'wrap' }}>
        {emotions.map(({ label, color, emoji }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--card)', border: `1px solid ${color}33`,
            borderRadius: 100, padding: '6px 14px',
            fontSize: 13, color,
          }}>
            {emoji} {label}
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {features.map(({ icon: Icon, color, bg, title, desc, to }, i) => (
          <Link key={title} to={to} style={{ textDecoration: 'none' }}>
            <div className="fade-in" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '28px 24px',
              height: '100%',
              transition: 'border-color 0.2s, transform 0.2s',
              animationDelay: `${i * 0.1}s`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '66'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: 'var(--text)' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{desc}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 18, fontSize: 13, color, fontWeight: 500,
              }}>
                Open <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom disclaimer */}
      <p style={{
        textAlign: 'center', marginTop: 60,
        fontSize: 12, color: 'var(--text3)', lineHeight: 1.8,
      }}>
        MindSpace is not a substitute for professional mental health care.<br />
        If you are in crisis, please contact a licensed professional or a helpline.
      </p>
    </div>
  )
}
