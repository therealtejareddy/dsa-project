import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { saveCalendarStatus, getCalendarStatus } from '../services/firestoreService'

export const CATEGORY_COLORS = {
  Array:                 { bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', text: '#a5b4fc' },
  'Two Pointers':        { bg: 'rgba(20, 184, 166, 0.12)', border: '#14b8a6', text: '#5eead4' },
  'Sliding Window':      { bg: 'rgba(6, 182, 212, 0.12)',  border: '#06b6d4', text: '#67e8f9' },
  Stack:                 { bg: 'rgba(100, 116, 139, 0.15)',border: '#64748b', text: '#cbd5e1' },
  'Binary Search':       { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', text: '#c4b5fd' },
  'Bit Manipulation':    { bg: 'rgba(251, 146, 60, 0.15)', border: '#fb923c', text: '#fed7aa' },
  'Dynamic Programming': { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#6ee7b7' },
  DP:                    { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#6ee7b7' },
  String:                { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fcd34d' },
  Tree:                  { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', text: '#f9a8d4' },
  Interval:              { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#d8b4fe' },
  'Linked List':         { bg: 'rgba(34, 211, 238, 0.12)', border: '#22d3ee', text: '#a5f3fc' },
  Matrix:                { bg: 'rgba(132, 204, 22, 0.12)', border: '#84cc16', text: '#d9f99d' },
  'Math & Geometry':     { bg: 'rgba(244, 114, 182, 0.12)',border: '#f472b6', text: '#fbcfe8' },
  Graph:                 { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#93c5fd' },
  'Advanced Graph':      { bg: 'rgba(30, 64, 175, 0.18)',  border: '#1e40af', text: '#93c5fd' },
  Heap:                  { bg: 'rgba(239, 68, 68, 0.12)',  border: '#ef4444', text: '#fca5a5' },
  Trie:                  { bg: 'rgba(249, 115, 22, 0.12)', border: '#f97316', text: '#fdba74' },
  Backtracking:          { bg: 'rgba(234, 179, 8, 0.12)',  border: '#eab308', text: '#fef08a' },
  Greedy:                { bg: 'rgba(74, 222, 128, 0.12)', border: '#4ade80', text: '#bbf7d0' },
}

export const DIFF_COLOR = {
  Easy:   { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  Medium: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  Hard:   { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
}

const DEFAULT_WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dayPrimaryCategory(dayEntry) {
  return dayEntry.problems?.length > 0 ? dayEntry.problems[0].category : null
}

function buildWeeks(totalDays) {
  const rows = Math.ceil(totalDays / 7)
  const weeks = []
  for (let w = 0; w < rows; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const n = w * 7 + d + 1
      week.push(n <= totalDays ? n : null)
    }
    weeks.push(week)
  }
  return weeks
}

/**
 * Reusable study calendar component.
 *
 * Props:
 *   title          {string}   Page heading
 *   subtitle       {string}   Sub-heading below the title
 *   headerGradient {string}   CSS `background` value for the header section
 *   progressGradient {string} CSS `background` value for the progress bar fill
 *   days           {Array}    Array of { day: number, label?: string, problems: Problem[] }
 *                             Problem: { num, title, path, difficulty, category }
 *   totalDays      {number}   Total number of days in the plan
 *   breadcrumbs    {Array}    [{ label: string, to: string }] back-links shown in header
 *   weekDayLabels  {string[]} Optional 7-element array, defaults to Mon–Sun
 *   extraStats     {Array}    Optional extra stat chips [{ label, value, color }]
 */
export default function StudyCalendarTemplate({
  title,
  subtitle,
  headerGradient = 'linear-gradient(135deg, var(--color-primary), var(--color-bg-darker))',
  progressGradient = 'linear-gradient(90deg, #10b981, #34d399)',
  days = [],
  totalDays,
  breadcrumbs = [],
  weekDayLabels = DEFAULT_WEEK_DAYS,
  extraStats = [],
}) {
  const [completedDays, setCompletedDays] = useState(new Set())
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  // Load calendar status from Firestore when component mounts or user changes
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        try {
          setLoading(true)
          const calendarId = String(totalDays)
          const savedStatus = await getCalendarStatus(user.uid, calendarId)
          setCompletedDays(savedStatus)
        } catch (error) {
          console.error('Failed to load calendar progress:', error)
          // Continue without Firebase sync
        } finally {
          setLoading(false)
        }
      } else {
        setCompletedDays(new Set())
        setLoading(false)
      }
    }
    loadProgress()
  }, [user, totalDays])

  // Save calendar status to Firestore whenever completedDays changes
  useEffect(() => {
    if (user && completedDays.size >= 0) {
      const saveProgress = async () => {
        try {
          const calendarId = String(totalDays)
          await saveCalendarStatus(user.uid, calendarId, completedDays)
        } catch (error) {
          console.error('Failed to save calendar progress:', error)
          // Continue - progress is saved locally
        }
      }
      // Debounce save to avoid too frequent writes
      const timer = setTimeout(saveProgress, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, completedDays, totalDays])

  const toggleComplete = (day) => {
    setCompletedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const completedCount = completedDays.size
  const progressPercent = Math.round((completedCount / totalDays) * 100)
  const selectedDayEntry = selectedDay ? days.find(d => d.day === selectedDay) : null

  const allProblems = days.flatMap(d => d.problems)
  const WEEKS = buildWeeks(totalDays)

  const defaultStats = [
    { label: 'Days Done', value: completedCount, color: '#34d399' },
    { label: 'Remaining', value: totalDays - completedCount, color: '#fbbf24' },
    { label: 'Easy', value: allProblems.filter(p => p.difficulty === 'Easy').length, color: '#34d399' },
    { label: 'Medium', value: allProblems.filter(p => p.difficulty === 'Medium').length, color: '#fbbf24' },
    { label: 'Hard', value: allProblems.filter(p => p.difficulty === 'Hard').length, color: '#f87171' },
  ]
  const stats = [...defaultStats, ...extraStats]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', color: 'var(--color-accent)', fontFamily: '"Segoe UI", sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ background: headerGradient, padding: '40px 30px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              {breadcrumbs.map((b, i) => (
                <Link key={i} to={b.to} style={{ color: 'rgba(176, 228, 204, 0.6)', textDecoration: 'none', fontSize: 13 }}>
                  {b.label}
                </Link>
              ))}
            </div>
          )}

          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, marginBottom: 8 }}>{title}</h1>
          <p style={{ opacity: 0.8, fontSize: 16, margin: 0 }}>{subtitle}</p>

          {/* Progress bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'rgba(176, 228, 204, 0.8)' }}>
              <span>{completedCount} / {totalDays} days completed</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ height: 10, background: 'rgba(176, 228, 204, 0.15)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressGradient,
                borderRadius: 10,
                transition: 'width 0.4s ease',
              }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(176, 228, 204, 0.6)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

          {/* Calendar grid */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📆 Calendar View</h2>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {weekDayLabels.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(176, 228, 204, 0.5)', paddingBottom: 6 }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Rows */}
            {WEEKS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                {week.map((dayNum, di) => {
                  if (!dayNum) return <div key={di} />
                  const entry = days.find(d => d.day === dayNum)
                  const isCompleted = completedDays.has(dayNum)
                  const isSelected = selectedDay === dayNum
                  const cat = dayPrimaryCategory(entry)
                  const catColor = cat ? CATEGORY_COLORS[cat] : null
                  const isReview = entry?.problems?.length === 0

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                      style={{
                        borderRadius: 10,
                        padding: '8px 6px',
                        cursor: 'pointer',
                        background: isCompleted
                          ? 'rgba(52, 211, 153, 0.12)'
                          : isReview
                            ? 'rgba(176, 228, 204, 0.04)'
                            : isSelected
                              ? catColor?.bg || 'rgba(176, 228, 204, 0.1)'
                              : 'var(--color-bg-dark)',
                        border: `2px solid ${
                          isSelected
                            ? catColor?.border || 'var(--color-primary)'
                            : isCompleted
                              ? '#34d399'
                              : isReview
                                ? 'rgba(176, 228, 204, 0.15)'
                                : 'var(--color-border)'
                        }`,
                        transition: 'all 0.2s ease',
                        minHeight: 80,
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = catColor?.border || 'var(--color-primary)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = `0 4px 16px ${catColor?.border || 'rgba(64, 138, 113, 0.3)'}40`
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = isCompleted ? '#34d399' : isReview ? 'rgba(176, 228, 204, 0.15)' : 'var(--color-border)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {/* Day label row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: isCompleted ? '#34d399' : 'rgba(176, 228, 204, 0.9)' }}>
                          D{dayNum}
                        </span>
                        <button
                          onClick={ev => { ev.stopPropagation(); toggleComplete(dayNum) }}
                          style={{
                            width: 16, height: 16, borderRadius: '50%',
                            border: `2px solid ${isCompleted ? '#34d399' : 'rgba(176, 228, 204, 0.3)'}`,
                            background: isCompleted ? '#34d399' : 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: isCompleted ? '#000' : 'transparent', padding: 0, flexShrink: 0,
                          }}
                        >✓</button>
                      </div>

                      {/* Day topic label */}
                      {entry?.label && (
                        <div style={{
                          fontSize: 9, fontWeight: 600,
                          color: catColor?.text || 'rgba(176, 228, 204, 0.5)',
                          marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}>
                          {entry.label}
                        </div>
                      )}

                      {/* Problems */}
                      {isReview ? (
                        <div style={{ fontSize: 9, color: 'rgba(176, 228, 204, 0.4)', fontStyle: 'italic' }}>Review day</div>
                      ) : (
                        entry?.problems?.map((p, i) => (
                          <div key={i} style={{
                            fontSize: 9, lineHeight: '1.3',
                            color: isCompleted ? '#6ee7b7' : 'rgba(176, 228, 204, 0.65)',
                            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: 1,
                          }}>
                            <span style={{ color: DIFF_COLOR[p.difficulty]?.color, marginRight: 2 }}>●</span>
                            {p.title}
                          </div>
                        ))
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Category legend */}
            <div style={{ marginTop: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(176, 228, 204, 0.7)', marginBottom: 12 }}>Category Legend</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(CATEGORY_COLORS)
                  .filter(([cat]) => cat !== 'DP') // DP is alias of Dynamic Programming
                  .map(([cat, c]) => (
                    <div key={cat} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: c.bg, border: `1px solid ${c.border}40`,
                      borderRadius: 8, padding: '4px 10px',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.border }} />
                      <span style={{ fontSize: 11, color: c.text, fontWeight: 600 }}>{cat}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ position: 'sticky', top: 20 }}>

            {/* Selected day detail */}
            {selectedDayEntry ? (
              <div style={{
                background: 'var(--color-bg-dark)',
                border: '1px solid var(--color-border)',
                borderRadius: 16, padding: 24, marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.5)', marginBottom: 4 }}>Day {selectedDayEntry.day}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{selectedDayEntry.label || `Day ${selectedDayEntry.day}`}</h3>
                  </div>
                  <button
                    onClick={() => toggleComplete(selectedDayEntry.day)}
                    style={{
                      padding: '6px 14px', borderRadius: 8,
                      border: `1px solid ${completedDays.has(selectedDayEntry.day) ? '#34d399' : 'var(--color-border)'}`,
                      background: completedDays.has(selectedDayEntry.day) ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
                      color: completedDays.has(selectedDayEntry.day) ? '#34d399' : 'rgba(176, 228, 204, 0.7)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {completedDays.has(selectedDayEntry.day) ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>

                {selectedDayEntry.problems?.length === 0 ? (
                  <div style={{ color: 'rgba(176, 228, 204, 0.5)', fontSize: 14, fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                    Review &amp; revise previous problems
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedDayEntry.problems.map((p, i) => {
                      const catColor = CATEGORY_COLORS[p.category]
                      const diffColor = DIFF_COLOR[p.difficulty]
                      return (
                        <Link key={i} to={p.path} style={{ textDecoration: 'none' }}>
                          <div
                            style={{
                              background: catColor?.bg || 'rgba(176, 228, 204, 0.05)',
                              border: `1px solid ${catColor?.border || 'var(--color-border)'}40`,
                              borderRadius: 10, padding: '12px 14px', transition: 'all 0.2s ease', cursor: 'pointer',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = catColor?.border || 'var(--color-primary)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = `${catColor?.border || 'var(--color-border)'}40` }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(176, 228, 204, 0.5)' }}>#{p.num}</span>
                              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: diffColor?.bg, color: diffColor?.color, fontWeight: 700 }}>
                                {p.difficulty}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: catColor?.text || 'var(--color-accent)' }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(176, 228, 204, 0.4)', marginTop: 4 }}>{p.category}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)',
                borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={{ color: 'rgba(176, 228, 204, 0.5)', fontSize: 14 }}>Click a day to see problems</div>
              </div>
            )}

            {/* All days list */}
            <div style={{
              background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)',
              borderRadius: 16, padding: 20, maxHeight: 480, overflowY: 'auto',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>All {totalDays} Days</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {days.map(entry => {
                  const isCompleted = completedDays.has(entry.day)
                  const cat = dayPrimaryCategory(entry)
                  const catColor = cat ? CATEGORY_COLORS[cat] : null
                  return (
                    <div
                      key={entry.day}
                      onClick={() => setSelectedDay(selectedDay === entry.day ? null : entry.day)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                        background: selectedDay === entry.day ? (catColor?.bg || 'rgba(176, 228, 204, 0.08)') : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(176, 228, 204, 0.4)', minWidth: 28 }}>D{entry.day}</span>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: catColor?.border || 'rgba(176, 228, 204, 0.2)' }} />
                      <span style={{
                        fontSize: 12, flex: 1,
                        color: isCompleted ? '#34d399' : 'rgba(176, 228, 204, 0.8)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {entry.label || entry.problems?.[0]?.title || `Day ${entry.day}`}
                      </span>
                      {entry.problems?.length > 0 && (
                        <span style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.35)' }}>{entry.problems.length}p</span>
                      )}
                      {isCompleted && <span style={{ fontSize: 10, color: '#34d399' }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
