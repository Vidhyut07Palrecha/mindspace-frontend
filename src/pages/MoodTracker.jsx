import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PlusCircle, Calendar, TrendingUp } from 'lucide-react'

const MOODS = [
  { label: 'Happy',   emoji: '😊', value: 5, color: '#36D9A0' },
  { label: 'Calm',    emoji: '😌', value: 4, color: '#4F8EF7' },
  { label: 'Neutral', emoji: '😐', value: 3, color: '#8A9BBE' },
  { label: 'Anxious', emoji: '😰', value: 2, color: '#F7A94F' },
  { label: 'Sad',     emoji: '😢', value: 1, color: '#7B5CF0' },
  { label: 'Angry',   emoji: '😤', value: 0, color: '#F75C5C' },
]

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function loadEntries() {
  try { return JSON.parse(localStorage.getItem('mindspace_moods') || '{}') } catch { return {} }
}

function saveEntries(entries) {
  localStorage.setItem('mindspace_moods', JSON.stringify(entries))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    const mood = MOODS.find(m => m.value === val)
    return (
      <div style={{
        background: 'var(--card2)', border: '1px solid var(--border2)',
        borderRadius: 10, padding: '8px 14px', fontSize: 13,
      }}>
        <div style={{ color: 'var(--text2)', marginBottom: 2 }}>{label}</div>
        <div style={{ color: mood?.color || 'var(--text)', fontWeight: 500 }}>
          {mood?.emoji} {mood?.label}
        </div>
      </div>
    )
  }
  return null
}

export default function MoodTracker() {
  const [entries, setEntries] = useState(loadEntries)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [saved, setSaved] = useState(false)

  const todayKey = getTodayKey()
  const todayEntry = entries[todayKey]

  const chartData = getLast7Days().map(dateKey => {
    const entry = entries[dateKey]
    const shortDate = dateKey.slice(5).replace('-', '/')
    return {
      date: shortDate,
      mood: entry ? entry.value : null,
      label: entry ? entry.label : null,
    }
  }).filter(d => d.mood !== null)

  function logMood() {
    if (!selected) return
    const newEntries = {
      ...entries,
      [todayKey]: { ...selected, note, timestamp: new Date().toISOString() }
    }
    setEntries(newEntries)
    saveEntries(newEntries)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function getInsight() {
    const days = getLast7Days()
    const moodSummary = days.map(d => {
      const e = entries[d]
      return e ? `${d}: ${e.label}` : `${d}: No entry`
    }).join(', ')

    setLoadingInsight(true)
    setInsight('')

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Here are a user's mood entries for the past 7 days: ${moodSummary}. 
                Write a warm, supportive 2-3 sentence insight about their emotional pattern this week. 
                Point out any trends and give one gentle suggestion. Be encouraging, not clinical. Under 80 words.`
              }]
            }],
            generationConfig: { maxOutputTokens: 150, temperature: 0.7 }
          })
        }
      )
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keep tracking your mood to unlock weekly insights!'
      setInsight(text)
    } catch {
      setInsight('Unable to load insight. Check your connection and try again.')
    } finally {
      setLoadingInsight(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Mood Tracker</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Log how you feel today and track your emotional patterns</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Left — Log mood */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Calendar size={16} color="var(--accent)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>How are you feeling today?</span>
          </div>

          {todayEntry && (
            <div style={{
              background: todayEntry.color + '15',
              border: `1px solid ${todayEntry.color}44`,
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, marginBottom: 16,
              color: todayEntry.color,
            }}>
              Today's log: {todayEntry.emoji} {todayEntry.label}
              {todayEntry.note && <div style={{ color: 'var(--text2)', marginTop: 4 }}>"{todayEntry.note}"</div>}
            </div>
          )}

          {/* Mood selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {MOODS.map(mood => (
              <button key={mood.label} onClick={() => setSelected(mood)} style={{
                background: selected?.label === mood.label ? mood.color + '20' : 'var(--card2)',
                border: `1px solid ${selected?.label === mood.label ? mood.color : 'var(--border)'}`,
                borderRadius: 10, padding: '10px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 0.2s', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 22 }}>{mood.emoji}</span>
                <span style={{ fontSize: 11, color: selected?.label === mood.label ? mood.color : 'var(--text2)', fontWeight: 500 }}>{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Note */}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            rows={2}
            style={{
              width: '100%', background: 'var(--card2)',
              border: '1px solid var(--border)', borderRadius: 10,
              color: 'var(--text)', fontSize: 13, padding: '10px 12px',
              resize: 'none', outline: 'none', marginBottom: 14,
            }}
          />

          <button onClick={logMood} disabled={!selected} style={{
            width: '100%', padding: '11px',
            background: selected ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'var(--card2)',
            border: '1px solid var(--border2)', borderRadius: 10,
            color: selected ? '#fff' : 'var(--text3)',
            fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
          }}>
            <PlusCircle size={15} />
            {saved ? '✓ Logged!' : 'Log mood'}
          </button>
        </div>

        {/* Right — Chart */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--accent3)" />
              <span style={{ fontSize: 14, fontWeight: 600 }}>This week</span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="mood"
                  stroke="var(--accent)" strokeWidth={2.5}
                  dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, fill: 'var(--accent2)' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 180, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexDirection: 'column', gap: 8,
            }}>
              <span style={{ fontSize: 32 }}>📊</span>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>Log your mood to see the chart</span>
            </div>
          )}

          {/* Mood legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {MOODS.map(m => (
              <div key={m.label} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: 'var(--text3)',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div style={{
        marginTop: 20, background: 'var(--card)',
        border: '1px solid var(--border)', borderRadius: '14px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Weekly AI Insight</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Get a personalised analysis of your mood this week</p>
          </div>
          <button onClick={getInsight} disabled={loadingInsight || chartData.length === 0} style={{
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            border: 'none', borderRadius: 10, color: '#fff',
            padding: '9px 18px', fontSize: 13, fontWeight: 500,
            opacity: chartData.length === 0 ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}>
            {loadingInsight ? 'Analysing...' : '✦ Get insight'}
          </button>
        </div>

        {insight ? (
          <div className="fade-in" style={{
            background: 'var(--card2)', border: '1px solid var(--border2)',
            borderRadius: 10, padding: '14px 16px',
            fontSize: 14, color: 'var(--text2)', lineHeight: 1.7,
          }}>
            {insight}
          </div>
        ) : (
          <div style={{
            background: 'var(--card2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
            fontSize: 13, color: 'var(--text3)', fontStyle: 'italic',
          }}>
            Log at least one mood entry, then click "Get insight" to see your weekly pattern analysis.
          </div>
        )}
      </div>
    </div>
  )
}
