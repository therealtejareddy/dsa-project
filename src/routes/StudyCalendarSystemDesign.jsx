import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { getSystemDesignData, saveSystemDesignData } from '../services/firestoreService'
import sdData from '../data/system-design-120-days.json'

// ── Color palette per phase ──────────────────────────────────────────────────
const PHASE_COLORS = {
  1: { bg: 'rgba(16, 185, 129, 0.12)',  border: '#10b981', text: '#6ee7b7', badge: 'rgba(16, 185, 129, 0.2)'  },
  2: { bg: 'rgba(99, 102, 241, 0.12)',  border: '#6366f1', text: '#a5b4fc', badge: 'rgba(99, 102, 241, 0.2)'  },
  3: { bg: 'rgba(245, 158, 11, 0.12)',  border: '#f59e0b', text: '#fcd34d', badge: 'rgba(245, 158, 11, 0.2)'  },
  4: { bg: 'rgba(239, 68, 68, 0.12)',   border: '#ef4444', text: '#fca5a5', badge: 'rgba(239, 68, 68, 0.2)'   },
}

const PHASE_ICONS = { 1: '🏗️', 2: '⚙️', 3: '💡', 4: '🎯' }

// ── Flatten the nested JSON into a flat array of 120 day entries ─────────────
function buildDayMap() {
  const map = {}
  sdData.phases.forEach(phase => {
    phase.weeks.forEach(week => {
      week.plan.forEach(entry => {
        map[entry.day] = {
          day: entry.day,
          focus: entry.focus,
          study: entry.study || [],
          task: entry.task || '',
          phase: phase.phase,
          phaseTitle: phase.title,
          weekTopic: week.topic,
          weekNum: week.week,
          isMock: entry.focus?.toLowerCase().includes('mock') || false,
          isReview: entry.focus?.toLowerCase().includes('review') || entry.focus?.toLowerCase().includes('wrap-up') || entry.focus?.toLowerCase().includes('blitz') || false,
        }
      })
    })
  })
  return map
}

const DAY_MAP = buildDayMap()
const TOTAL_DAYS = 120

function buildWeeks(total) {
  const rows = Math.ceil(total / 7)
  const weeks = []
  for (let w = 0; w < rows; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const n = w * 7 + d + 1
      week.push(n <= total ? n : null)
    }
    weeks.push(week)
  }
  return weeks
}

const WEEKS = buildWeeks(TOTAL_DAYS)
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const CALENDAR_ID = 'sd-120'

// ── Cell background logic ────────────────────────────────────────────────────
function cellStyle(dayNum, isSelected, isCompleted) {
  const entry = DAY_MAP[dayNum]
  if (!entry) return {}
  const pc = PHASE_COLORS[entry.phase]
  if (isCompleted)
    return { background: 'rgba(52, 211, 153, 0.14)', border: '2px solid #34d399' }
  if (isSelected)
    return { background: pc.bg, border: `2px solid ${pc.border}` }
  if (entry.isMock)
    return { background: 'rgba(249, 115, 22, 0.08)', border: '2px solid rgba(249,115,22,0.4)' }
  if (entry.isReview)
    return { background: 'rgba(176, 228, 204, 0.04)', border: '2px solid rgba(176,228,204,0.15)' }
  return { background: 'var(--color-bg-dark)', border: '2px solid var(--color-border)' }
}

export default function StudyCalendarSystemDesign() {
  const { user } = useContext(AuthContext)
  const [completedDays, setCompletedDays] = useState(new Set())
  const [completedTopics, setCompletedTopics] = useState(new Set()) // Track individual topics
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dayNotes, setDayNotes] = useState({})
  const [topicNotes, setTopicNotes] = useState({}) // Notes per topic
  const [editingNote, setEditingNote] = useState(false)
  const [editingTopicNote, setEditingTopicNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)

  // ── Load progress ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (user) {
        try {
          setLoading(true)
          const data = await getSystemDesignData(user.uid, CALENDAR_ID)
          setCompletedDays(data.completedDays)
          setCompletedTopics(data.completedTopics)
          setDayNotes(data.dayNotes)
          setTopicNotes(data.topicNotes)
        } catch (e) {
          console.error('Failed to load SD calendar progress', e)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    load()
  }, [user])

  // ── Save all progress to Firestore ─────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const t = setTimeout(() => {
      saveSystemDesignData(user.uid, CALENDAR_ID, {
        dayNotes,
        topicNotes,
        completedTopics,
        completedDays,
      }).catch(e => console.error('Failed to save SD calendar progress', e))
    }, 1000)
    return () => clearTimeout(t)
  }, [user, dayNotes, topicNotes, completedTopics, completedDays])

  const toggleComplete = dayNum => {
    setCompletedDays(prev => {
      const next = new Set(prev)
      next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum)
      return next
    })
  }

  const topicKey = (dayNum, topicIdx) => `${CALENDAR_ID}-topic-notes-${dayNum}-${topicIdx}`
  const topicCompletedKey = (dayNum, topicIdx) => `${CALENDAR_ID}-topic-completed-${dayNum}-${topicIdx}`
  const dayNoteKey = d => `${CALENDAR_ID}-day-notes-${d}`

  const toggleTopicComplete = (dayNum, topicIdx) => {
    const key = topicCompletedKey(dayNum, topicIdx)
    setCompletedTopics(prevTopics => {
      const nextTopics = new Set(prevTopics)
      if (nextTopics.has(key)) {
        nextTopics.delete(key)
      } else {
        nextTopics.add(key)
      }
      
      // Check if all topics for this day are complete
      const entry = DAY_MAP[dayNum]
      if (entry && entry.study.length > 0) {
        const allTopicsComplete = entry.study.every((_, idx) => 
          nextTopics.has(topicCompletedKey(dayNum, idx))
        )
        
        // Auto-update day completion status based on topics
        setCompletedDays(prevDays => {
          const nextDays = new Set(prevDays)
          if (allTopicsComplete) {
            nextDays.add(dayNum)
          } else {
            nextDays.delete(dayNum)
          }
          return nextDays
        })
      }
      
      return nextTopics
    })
  }

  const openNoteEditor = () => {
    setNoteText(dayNotes[dayNoteKey(selectedDay)] || '')
    setEditingNote(true)
  }

  const saveNote = () => {
    const k = dayNoteKey(selectedDay)
    setDayNotes(prev => ({ ...prev, [k]: noteText }))
    setEditingNote(false)
  }

  const openTopicNoteEditor = (dayNum, topicIdx, currentNote) => {
    setSelectedTopic({ dayNum, topicIdx })
    setNoteText(currentNote || '')
    setEditingTopicNote(true)
  }

  const saveTopicNote = () => {
    const { dayNum, topicIdx } = selectedTopic
    const k = topicKey(dayNum, topicIdx)
    setTopicNotes(prev => ({ ...prev, [k]: noteText }))
    setEditingTopicNote(false)
  }

  const completedCount = completedDays.size
  const progressPercent = Math.round((completedCount / TOTAL_DAYS) * 100)
  const selectedEntry = selectedDay ? DAY_MAP[selectedDay] : null

  // Phase completion stats
  const phaseStats = sdData.phases.map(p => {
    const phaseDays = Object.values(DAY_MAP).filter(d => d.phase === p.phase)
    const done = phaseDays.filter(d => completedDays.has(d.day)).length
    return { phase: p.phase, title: p.title, total: phaseDays.length, done }
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', color: 'var(--color-accent)', fontFamily: '"Segoe UI", sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', padding: '40px 30px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1450, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(176,228,204,0.6)', textDecoration: 'none', fontSize: 13 }}>← Home</Link>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, marginBottom: 8 }}>🏗️ 120-Day System Design Preparation</h1>
          <p style={{ opacity: 0.8, fontSize: 16, margin: 0 }}>
            4-phase deep-dive covering foundations → advanced patterns → interview practice → final polish
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'rgba(176,228,204,0.8)' }}>
              <span>{completedCount} / {TOTAL_DAYS} days completed</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ height: 10, background: 'rgba(176,228,204,0.15)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #10b981, #6366f1, #f59e0b, #ef4444)',
                borderRadius: 10,
                transition: 'width 0.4s ease',
              }} />
            </div>

            {/* Phase stats */}
            <div style={{ display: 'flex', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
              {phaseStats.map(ps => {
                const pc = PHASE_COLORS[ps.phase]
                return (
                  <div key={ps.phase} style={{ background: pc.badge, border: `1px solid ${pc.border}40`, borderRadius: 10, padding: '8px 16px', minWidth: 120 }}>
                    <div style={{ fontSize: 11, color: pc.text, marginBottom: 4, fontWeight: 700 }}>
                      {PHASE_ICONS[ps.phase]} Phase {ps.phase}: {ps.title}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: pc.text }}>{ps.done}<span style={{ fontSize: 12, fontWeight: 400 }}>/{ps.total}</span></div>
                  </div>
                )
              })}
              <div style={{ textAlign: 'center', padding: '8px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24' }}>{TOTAL_DAYS - completedCount}</div>
                <div style={{ fontSize: 11, color: 'rgba(176,228,204,0.6)' }}>Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1450, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

          {/* ── Calendar grid ──────────────────────────────────────────── */}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📆 Calendar View</h2>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {WEEK_LABELS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(176,228,204,0.5)', paddingBottom: 6 }}>{d}</div>
              ))}
            </div>

            {/* Rows */}
            {WEEKS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                {week.map((dayNum, di) => {
                  if (!dayNum) return <div key={di} />
                  const entry = DAY_MAP[dayNum]
                  if (!entry) return <div key={di} />
                  const isCompleted = completedDays.has(dayNum)
                  const isSelected = selectedDay === dayNum
                  const pc = PHASE_COLORS[entry.phase]
                  const cs = cellStyle(dayNum, isSelected, isCompleted)

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                      style={{
                        borderRadius: 10,
                        padding: '8px 6px',
                        cursor: 'pointer',
                        minHeight: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 4,
                        transition: 'all 0.2s ease',
                        ...cs,
                      }}
                    >
                      {/* Day number */}
                      <div style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: isCompleted ? '#34d399' : pc.text,
                        width: '100%',
                        textAlign: 'center',
                      }}>
                        {isCompleted ? '✓' : dayNum}
                      </div>

                      {/* Phase dot */}
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: pc.border, flexShrink: 0 }} />

                      {/* Focus label */}
                      <div style={{
                        fontSize: 9,
                        color: isCompleted ? '#34d399' : pc.text,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        opacity: 0.85,
                      }}>
                        {entry.isMock ? '🎤 Mock' : entry.isReview ? '🔄 Review' : entry.focus}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Legend */}
            <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(176,228,204,0.6)' }}>
              {sdData.phases.map(p => {
                const pc = PHASE_COLORS[p.phase]
                return (
                  <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: pc.bg, border: `1px solid ${pc.border}` }} />
                    <span>{PHASE_ICONS[p.phase]} Phase {p.phase}: {p.title}</span>
                  </div>
                )
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)' }} />
                <span>🎤 Mock Interview</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(52,211,153,0.14)', border: '1px solid #34d399' }} />
                <span>✅ Completed</span>
              </div>
            </div>

            {/* Phase Timeline */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Phase Timeline</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {sdData.phases.map(phase => {
                  const pc = PHASE_COLORS[phase.phase]
                  const phaseDays = Object.values(DAY_MAP).filter(d => d.phase === phase.phase)
                  const done = phaseDays.filter(d => completedDays.has(d.day)).length
                  const pct = Math.round((done / phaseDays.length) * 100)
                  return (
                    <div key={phase.phase} style={{ background: 'var(--color-bg-dark)', borderRadius: 12, padding: 16, border: `1px solid ${pc.border}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: pc.text }}>
                          {PHASE_ICONS[phase.phase]} Phase {phase.phase}: {phase.title}
                        </div>
                        <div style={{ fontSize: 12, color: pc.text }}>{pct}%</div>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>Days {phase.days} · {phase.goal}</div>
                      <div style={{ height: 6, background: 'rgba(176,228,204,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${pc.border}, ${pc.border}99)`, borderRadius: 6, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(176,228,204,0.5)', marginTop: 6 }}>{done}/{phaseDays.length} days completed</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Side panel ─────────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 20 }}>
            {selectedEntry ? (
              <DayDetail
                entry={selectedEntry}
                dayNum={selectedDay}
                isCompleted={completedDays.has(selectedDay)}
                onToggle={() => toggleComplete(selectedDay)}
                note={dayNotes[dayNoteKey(selectedDay)] || ''}
                onEditNote={openNoteEditor}
                completedTopics={completedTopics}
                topicNotes={topicNotes}
                onToggleTopic={(idx) => toggleTopicComplete(selectedDay, idx)}
                onEditTopicNote={(idx) => openTopicNoteEditor(selectedDay, idx, topicNotes[topicKey(selectedDay, idx)])}
                topicKey={(idx) => topicKey(selectedDay, idx)}
                topicCompletedKey={(idx) => topicCompletedKey(selectedDay, idx)}
              />
            ) : (
              <EmptyPanel />
            )}
          </div>
        </div>
      </div>

      {/* ── Note editor modal ─────────────────────────────────────────────── */}
      {editingNote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg-dark)', borderRadius: 16, padding: 28, width: '90%', maxWidth: 520, border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📝 Day {selectedDay} Notes</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add your notes, key learnings, or observations here..."
              style={{
                width: '100%', minHeight: 160, background: 'var(--color-bg-darkest)',
                border: '1px solid var(--color-border)', borderRadius: 8, padding: 12,
                color: 'var(--color-accent)', fontSize: 14, resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingNote(false)} style={{ padding: '8px 20px', borderRadius: 8, background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={saveNote} style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--color-primary)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Topic note editor modal ──────────────────────────────────────── */}
      {editingTopicNote && selectedTopic && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg-dark)', borderRadius: 16, padding: 28, width: '90%', maxWidth: 520, border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📝 Notes - {DAY_MAP[selectedTopic.dayNum].study[selectedTopic.topicIdx]}</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add your notes for this topic..."
              style={{
                width: '100%', minHeight: 140, background: 'var(--color-bg-darkest)',
                border: '1px solid var(--color-border)', borderRadius: 8, padding: 12,
                color: 'var(--color-accent)', fontSize: 14, resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingTopicNote(false)} style={{ padding: '8px 20px', borderRadius: 8, background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={saveTopicNote} style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--color-primary)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Day Detail Panel ──────────────────────────────────────────────────────────
function DayDetail({ 
  entry, 
  dayNum, 
  isCompleted, 
  onToggle, 
  note, 
  onEditNote,
  completedTopics,
  topicNotes,
  onToggleTopic,
  onEditTopicNote,
  topicKey,
  topicCompletedKey
}) {
  const pc = PHASE_COLORS[entry.phase]
  
  // Calculate topic progress
  const completedTopicCount = entry.study.filter((_, idx) => 
    completedTopics.has(topicCompletedKey(idx))
  ).length
  const totalTopics = entry.study.length
  const topicProgress = totalTopics > 0 ? Math.round((completedTopicCount / totalTopics) * 100) : 0

  return (
    <div style={{ background: 'var(--color-bg-dark)', borderRadius: 16, border: `1px solid ${pc.border}50`, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: pc.bg, borderBottom: `1px solid ${pc.border}40`, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: pc.text, fontWeight: 700, marginBottom: 4 }}>
              {PHASE_ICONS[entry.phase]} Phase {entry.phase}: {entry.phaseTitle} · Week {entry.weekNum}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(176,228,204,0.5)' }}>{entry.weekTopic}</div>
          </div>
          <div style={{ background: pc.badge, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: pc.text, fontWeight: 700, whiteSpace: 'nowrap' }}>
            Day {dayNum}
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1.3 }}>
          {entry.isMock && '🎤 '}{entry.isReview && '🔄 '}{entry.focus}
        </h3>
      </div>

      {/* Study Topics with checkboxes */}
      {entry.study.length > 0 && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(176,228,204,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>📚 Study Topics</div>
            <div style={{ fontSize: 11, color: pc.text, fontWeight: 600 }}>{completedTopicCount}/{totalTopics}</div>
          </div>
          
          {/* Topic progress bar */}
          {totalTopics > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 6, background: 'rgba(176,228,204,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${topicProgress}%`, 
                  background: `linear-gradient(90deg, ${pc.border}, ${pc.border}99)`, 
                  borderRadius: 6, 
                  transition: 'width 0.4s ease' 
                }} />
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entry.study.map((topic, idx) => {
              const completedKey = topicCompletedKey(idx)
              const isTopicComplete = completedTopics.has(completedKey)
              const tnote = topicNotes[topicKey(idx)] || ''
              
              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 10,
                    background: isTopicComplete ? 'rgba(52, 211, 153, 0.08)' : 'rgba(176,228,204,0.04)', 
                    borderRadius: 8,
                    padding: '10px 12px', 
                    border: `1px solid ${isTopicComplete ? '#34d39950' : 'rgba(176,228,204,0.08)'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isTopicComplete}
                    onChange={() => onToggleTopic(idx)}
                    style={{
                      marginTop: 2,
                      cursor: 'pointer',
                      accentColor: pc.border,
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                    }}
                  />
                  
                  {/* Topic text and note preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13,
                      color: isTopicComplete ? 'rgba(52, 211, 153, 0.8)' : 'var(--color-accent)',
                      lineHeight: 1.4,
                      textDecoration: isTopicComplete ? 'line-through' : 'none',
                      opacity: isTopicComplete ? 0.7 : 1,
                    }}>
                      {topic}
                    </div>
                    {tnote && (
                      <div style={{
                        fontSize: 11,
                        color: 'rgba(176,228,204,0.5)',
                        marginTop: 4,
                        fontStyle: 'italic',
                        maxHeight: 32,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        💬 {tnote}
                      </div>
                    )}
                  </div>
                  
                  {/* Note button */}
                  <button 
                    onClick={() => onEditTopicNote(idx)}
                    style={{
                      fontSize: 11,
                      background: tnote ? 'rgba(168, 85, 247, 0.15)' : 'rgba(176,228,204,0.06)',
                      border: tnote ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(176,228,204,0.15)',
                      borderRadius: 5,
                      padding: '3px 8px',
                      color: tnote ? '#d8b4fe' : 'rgba(176,228,204,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(176,228,204,0.15)'
                      e.target.style.color = 'rgba(176,228,204,0.9)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = tnote ? 'rgba(168, 85, 247, 0.15)' : 'rgba(176,228,204,0.06)'
                      e.target.style.color = tnote ? '#d8b4fe' : 'rgba(176,228,204,0.6)'
                    }}
                  >
                    {tnote ? '✎' : '✚'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Task */}
      {entry.task && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(176,228,204,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>✅ Today's Task</div>
          <div style={{
            background: `${pc.bg}`,
            border: `1px solid ${pc.border}50`,
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--color-accent)',
            lineHeight: 1.5,
          }}>
            {entry.task}
          </div>
        </div>
      )}

      {/* Day Notes */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: note ? 8 : 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(176,228,204,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>📝 Day Notes</div>
          <button onClick={onEditNote} style={{ fontSize: 11, background: 'rgba(176,228,204,0.06)', border: '1px solid rgba(176,228,204,0.15)', borderRadius: 6, padding: '4px 10px', color: 'rgba(176,228,204,0.7)', cursor: 'pointer' }}>
            {note ? 'Edit' : '+ Add'}
          </button>
        </div>
        {note && (
          <div style={{ fontSize: 13, color: 'rgba(176,228,204,0.8)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{note}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            transition: 'all 0.2s ease',
            background: isCompleted ? 'rgba(52,211,153,0.2)' : pc.bg,
            color: isCompleted ? '#34d399' : pc.text,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: isCompleted ? '#34d399' : pc.border,
          }}
        >
          {isCompleted ? '✓ Day Completed — Mark Incomplete' : `Mark Day ${dayNum} Complete`}
        </button>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyPanel() {
  return (
    <div style={{ background: 'var(--color-bg-dark)', borderRadius: 16, padding: 32, border: '1px solid var(--color-border)', textAlign: 'center', color: 'rgba(176,228,204,0.5)' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🏗️</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Select a Day</div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        Click any day in the calendar to see the focus topic, study materials, and daily task.
      </div>

      <div style={{ marginTop: 24, textAlign: 'left' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(176,228,204,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Phase Overview</div>
        {sdData.phases.map(p => {
          const pc = PHASE_COLORS[p.phase]
          return (
            <div key={p.phase} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.border, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: pc.text }}>{PHASE_ICONS[p.phase]} Phase {p.phase}: {p.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(176,228,204,0.4)', marginTop: 2 }}>Days {p.days} · {p.goal}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, background: 'rgba(176,228,204,0.04)', borderRadius: 10, padding: 14, textAlign: 'left', border: '1px solid rgba(176,228,204,0.08)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(176,228,204,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>💡 Tips</div>
        {sdData.tips?.slice(0, 4).map((tip, i) => (
          <div key={i} style={{ fontSize: 12, color: 'rgba(176,228,204,0.6)', marginBottom: 6, lineHeight: 1.4 }}>• {tip}</div>
        ))}
      </div>
    </div>
  )
}
