import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

const DAYS = [
  // Week 1 — Arrays + Two Pointers + Bit
  { day: 1,  label: 'Arrays I',           problems: [1, 103]},
  { day: 2,  label: 'Arrays II',          problems: [164, 178]},
  { day: 3,  label: 'Arrays III',         problems: [50, 129]},
  { day: 4,  label: 'Arrays IV',          problems: [31, 16]},
  { day: 5,  label: 'Arrays V',           problems: [14]},
  { day: 6,  label: 'Two Pointers',       problems: [262, 138]},
  { day: 7,  label: 'Bit Manipulation I', problems: [219, 145]},
  // Week 2 — Bit + DP
  { day: 8,  label: 'Bit Manipulation II',problems: [144, 214]},
  { day: 9,  label: 'DP I',               problems: [60, 207]},
  { day: 10, label: 'DP II',              problems: [146, 160]},
  { day: 11, label: 'DP III',             problems: [203, 118]},
  { day: 12, label: 'DP IV',              problems: [302, 271]},
  { day: 13, label: 'DP V',               problems: [80, 220]},
  { day: 14, label: 'Strings I',          problems: [108, 181]},
  // Week 3 — Strings + Trees
  { day: 15, label: 'Strings II',         problems: [22, 46]},
  { day: 16, label: 'Strings III',        problems: [4, 230]},
  { day: 17, label: 'Strings IV',         problems: [9, 259]},
  { day: 18, label: 'Strings V',          problems: [67]},
  { day: 19, label: 'Trees I',            problems: [168, 91]},
  { day: 20, label: 'Trees II',           problems: [85, 253]},
  { day: 21, label: 'Trees III',          problems: [175, 88]},
  // Week 4 — Trees + Intervals + Linked Lists
  { day: 22, label: 'Trees IV',           problems: [147, 307]},
  { day: 23, label: 'Intervals I',        problems: [182, 53]},
  { day: 24, label: 'Intervals II',       problems: [54, 183]},
  { day: 25, label: 'Intervals III',      problems: [294]},
  { day: 26, label: 'Linked Lists I',     problems: [152, 120]},
  { day: 27, label: 'Linked Lists II',    problems: [23, 21]},
  { day: 28, label: 'Linked Lists III',   problems: [25]},
  // Week 5 — Matrix + Graph
  { day: 29, label: 'Matrix I',           problems: [62, 51]},
  { day: 30, label: 'Matrix II',          problems: [45, 70]},
  { day: 31, label: 'Graph I',            problems: [148, 114]},
  { day: 32, label: 'Graph II',           problems: [153, 156]},
  { day: 33, label: 'Graph III',          problems: [186, 209]},
  { day: 34, label: 'Graph IV',           problems: [263, 272]},
  { day: 35, label: 'Graph V',            problems: [229, 226]},
  // Week 6 — Graph Hard + Heap + Trie + Backtracking
  { day: 36, label: 'Graph VI',           problems: [188, 110]},
  { day: 37, label: 'Heap I',             problems: [216, 200]},
  { day: 38, label: 'Heap II',            problems: [244]},
  { day: 39, label: 'Trie',               problems: [155, 158]},
  { day: 40, label: 'Backtracking I',     problems: [69, 68]},
  { day: 41, label: 'Backtracking II',    problems: [37, 43]},
  // Week 7 — Review
  { day: 42, label: 'Review: Arrays + Strings', problems: [] },
  { day: 43, label: 'Review: DP + Trees',        problems: [] },
  { day: 44, label: 'Review: Graphs + Heaps',    problems: [] },
  { day: 45, label: 'Final Challenge',           problems: [] },
]

const TOTAL_PROBLEMS = DAYS.reduce((acc, d) => acc + d.problems.length, 0)

export default function StudyCalendar45() {
  return (
    <StudyCalendarTemplate
      title="🗓️ 45-Day Blind 75 Study Plan"
      subtitle="All 75 problems — structured across 45 days with review sessions"
      headerGradient="linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
      progressGradient="linear-gradient(90deg, #6366f1, #10b981)"
      days={DAYS}
      totalDays={45}
      breadcrumbs={[
        { label: '← Home', to: '/' },
        { label: '30-Day Plan', to: '/study-calendar' },
      ]}
      extraStats={[
        { label: 'Total Problems', value: TOTAL_PROBLEMS, color: '#93c5fd' },
      ]}
    />
  )
}
