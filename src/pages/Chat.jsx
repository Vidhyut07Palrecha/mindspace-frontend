import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, Bot, User, Loader } from 'lucide-react'

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'

const SYSTEM_PROMPT = `You are MindSpace, a compassionate AI mental health companion. 
When the user shares how they feel, you must:
1. First identify their primary emotion from exactly one of these: Happy, Sad, Anxious, Angry, Neutral
2. Respond with warmth and empathy — like a caring friend, not a clinical therapist
3. Suggest one practical, specific coping strategy
4. Keep your response under 100 words
5. Never diagnose any mental health condition
6. If the user seems in serious distress or mentions self-harm, gently recommend speaking to a professional or calling a helpline

Always start your response with: EMOTION: [emotion]
Then on a new line, your actual response.

Example format:
EMOTION: Anxious
I can hear that you're feeling overwhelmed right now, and that's completely valid. When anxiety peaks, try the 4-7-8 breathing technique — breathe in for 4 counts, hold for 7, exhale for 8. It activates your body's calm response almost immediately. You're not alone in this. 💙`

const emotionColors = {
  Happy: '#36D9A0',
  Sad: '#4F8EF7',
  Anxious: '#F7A94F',
  Angry: '#F75C5C',
  Neutral: '#8A9BBE',
}

const emotionEmojis = {
  Happy: '😊', Sad: '😢', Anxious: '😰', Angry: '😤', Neutral: '😐'
}

function parseResponse(raw) {
  const lines = raw.trim().split('\n')
  const emotionLine = lines.find(l => l.startsWith('EMOTION:'))
  const emotion = emotionLine ? emotionLine.replace('EMOTION:', '').trim() : 'Neutral'
  const text = lines.filter(l => !l.startsWith('EMOTION:')).join('\n').trim()
  return { emotion, text }
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm MindSpace 🌿 I'm here to listen without judgment. How are you feeling today?",
      emotion: null,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Build conversation history for context
      const history = messages
        .filter(m => m.role !== 'assistant' || m !== messages[0])
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
              ...history,
              { role: 'user', parts: [{ text }] }
            ],
            generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
          })
        }
      )

      const data = await response.json()
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here for you. Could you tell me more about how you\'re feeling?'
      const { emotion, text: replyText } = parseResponse(raw)

      setMessages(prev => [...prev, { role: 'assistant', text: replyText, emotion }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'I had trouble connecting. Please check your internet and try again.',
        emotion: 'Neutral'
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      text: "Hi, I'm MindSpace 🌿 I'm here to listen without judgment. How are you feeling today?",
      emotion: null,
    }])
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>AI Companion</h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>A safe space to express yourself</p>
        </div>
        <button onClick={clearChat} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--card)', border: '1px solid var(--border)',
          color: 'var(--text2)', borderRadius: 10,
          padding: '8px 14px', fontSize: 13,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.map((msg, i) => (
          <div key={i} className="slide-up" style={{
            display: 'flex', gap: 12,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: msg.role === 'user' ? 'var(--accent2)' : 'var(--card2)',
              border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="var(--accent)" />}
            </div>

            <div style={{ maxWidth: '75%' }}>
              {/* Emotion badge */}
              {msg.emotion && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: emotionColors[msg.emotion] + '15',
                  border: `1px solid ${emotionColors[msg.emotion]}44`,
                  borderRadius: 100, padding: '2px 10px',
                  fontSize: 11, color: emotionColors[msg.emotion],
                  marginBottom: 6, fontWeight: 500,
                }}>
                  {emotionEmojis[msg.emotion]} {msg.emotion} detected
                </div>
              )}
              {/* Bubble */}
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'var(--card2)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border2)',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '12px 16px',
                fontSize: 14, lineHeight: 1.7,
                color: 'var(--text)',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--card2)', border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={16} color="var(--accent)" />
            </div>
            <div style={{
              background: 'var(--card2)', border: '1px solid var(--border2)',
              borderRadius: '14px 14px 14px 4px', padding: '12px 16px',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {[0,1,2].map(n => (
                <div key={n} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'pulse 1.2s ease infinite',
                  animationDelay: `${n * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        marginTop: 16, display: 'flex', gap: 10,
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '12px 14px',
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Share how you're feeling..."
          rows={1}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 14, resize: 'none',
            lineHeight: 1.6, maxHeight: 120, overflow: 'auto',
          }}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: input.trim() && !loading ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'var(--card2)',
          border: '1px solid var(--border2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {loading ? <Loader size={16} color="var(--text3)" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} color={input.trim() ? '#fff' : 'var(--text3)'} />}
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 8 }}>
        Press Enter to send · Shift+Enter for new line
      </p>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
