import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// NeetCode 150 — 60-Day Study Plan (~2-3 problems/day)
const DAYS = [
  // ── Arrays & Hashing ──────────────────────────────────────────────────────
  { day: 1,  label: 'Arrays & Hashing I',   problems: [
    164,
    181,
    1,
  ]},
  { day: 2,  label: 'Arrays & Hashing II',  problems: [
    46,
    216,
  ]},
  { day: 3,  label: 'Arrays & Hashing III', problems: [
    178,
    35,
  ]},
  { day: 4,  label: 'Arrays & Hashing IV',  problems: [
    190,
    111,
  ]},

  // ── Two Pointers ──────────────────────────────────────────────────────────
  { day: 5,  label: 'Two Pointers I',       problems: [
    108,
    138,
    16,
  ]},
  { day: 6,  label: 'Two Pointers II',      problems: [
    14,
    40,
  ]},

  // ── Sliding Window ────────────────────────────────────────────────────────
  { day: 7,  label: 'Sliding Window I',     problems: [
    103,
    4,
  ]},
  { day: 8,  label: 'Sliding Window II',    problems: [
    231,
    252,
  ]},
  { day: 9,  label: 'Sliding Window III',   problems: [
    67,
    179,
  ]},

  // ── Stack ─────────────────────────────────────────────────────────────────
  { day: 10, label: 'Stack I',              problems: [
    22,
    132,
    126,
  ]},
  { day: 11, label: 'Stack II',             problems: [
    24,
    273,
  ]},
  { day: 12, label: 'Stack III',            problems: [
    283,
    75,
  ]},

  // ── Binary Search ─────────────────────────────────────────────────────────
  { day: 13, label: 'Binary Search I',      problems: [
    268,
    64,
    284,
  ]},
  { day: 14, label: 'Binary Search II',     problems: [
    131,
    31,
  ]},
  { day: 15, label: 'Binary Search III',    problems: [
    292,
    8,
  ]},

  // ── Bit Manipulation ──────────────────────────────────────────────────────
  { day: 16, label: 'Bit Manipulation I',   problems: [
    116,
    145,
    214,
  ]},
  { day: 17, label: 'Bit Manipulation II',  problems: [
    144,
    187,
    219,
    11,
  ]},

  // ── Linked List ───────────────────────────────────────────────────────────
  { day: 18, label: 'Linked List I',        problems: [
    152,
    23,
    122,
  ]},
  { day: 19, label: 'Linked List II',       problems: [
    21,
    117,
    2,
  ]},
  { day: 20, label: 'Linked List III',      problems: [
    120,
    196,
    124,
  ]},
  { day: 21, label: 'Linked List IV',       problems: [
    25,
    27,
  ]},

  // ── Trees ─────────────────────────────────────────────────────────────────
  { day: 22, label: 'Trees I',              problems: [
    168,
    91,
    250,
  ]},
  { day: 23, label: 'Trees II',             problems: [
    97,
    85,
    253,
  ]},
  { day: 24, label: 'Trees III',            problems: [
    175,
    88,
    147,
  ]},
  { day: 25, label: 'Trees IV',             problems: [
    307,
    84,
    171,
  ]},
  { day: 26, label: 'Trees V',              problems: [
    94,
    107,
  ]},
  { day: 27, label: 'Trees VI',             problems: [
    202,
  ]},

  // ── Tries ─────────────────────────────────────────────────────────────────
  { day: 28, label: 'Tries',                problems: [
    155,
    158,
    159,
  ]},

  // ── Heap / Priority Queue ─────────────────────────────────────────────────
  { day: 29, label: 'Heap I',               problems: [
    267,
    300,
    290,
  ]},
  { day: 30, label: 'Heap II',              problems: [
    162,
    254,
    217,
  ]},
  { day: 31, label: 'Heap III',             problems: [
    200,
  ]},

  // ── Backtracking ──────────────────────────────────────────────────────────
  { day: 32, label: 'Backtracking I',       problems: [
    69,
    37,
    43,
  ]},
  { day: 33, label: 'Backtracking II',      problems: [
    79,
    38,
    70,
  ]},
  { day: 34, label: 'Backtracking III',     problems: [
    113,
    18,
    48,
  ]},

  // ── Graphs ────────────────────────────────────────────────────────────────
  { day: 35, label: 'Graphs I',             problems: [
    148,
    114,
    265,
  ]},
  { day: 36, label: 'Graphs II',            problems: [
    229,
    112,
    295,
  ]},
  { day: 37, label: 'Graphs III',           problems: [
    194,
    153,
    156,
  ]},
  { day: 38, label: 'Graphs IV',            problems: [
    263,
    209,
    186,
  ]},
  { day: 39, label: 'Graphs V',             problems: [
    110,
  ]},

  // ── Advanced Graphs ───────────────────────────────────────────────────────
  { day: 40, label: 'Advanced Graphs I',    problems: [
    211,
    311,
  ]},
  { day: 41, label: 'Advanced Graphs II',   problems: [
    274,
    278,
  ]},
  { day: 42, label: 'Advanced Graphs III',  problems: [
    188,
    280,
  ]},

  // ── 1D Dynamic Programming ────────────────────────────────────────────────
  { day: 43, label: '1D DP I',              problems: [
    60,
    275,
    146,
  ]},
  { day: 44, label: '1D DP II',             problems: [
    160,
    9,
    259,
  ]},
  { day: 45, label: '1D DP III',            problems: [
    80,
    207,
    129,
  ]},
  { day: 46, label: '1D DP IV',             problems: [
    118,
    203,
    228,
  ]},

  // ── 2D Dynamic Programming ────────────────────────────────────────────────
  { day: 47, label: '2D DP I',              problems: [
    56,
    302,
    205,
  ]},
  { day: 48, label: '2D DP II',             problems: [
    246,
    242,
    83,
  ]},
  { day: 49, label: '2D DP III',            problems: [
    210,
    101,
  ]},
  { day: 50, label: '2D DP IV',             problems: [
    61,
    206,
    13,
  ]},

  // ── Greedy ────────────────────────────────────────────────────────────────
  { day: 51, label: 'Greedy I',             problems: [
    50,
    52,
    42,
  ]},
  { day: 52, label: 'Greedy II',            problems: [
    115,
    282,
    314,
  ]},
  { day: 53, label: 'Greedy III',           problems: [
    276,
    261,
  ]},

  // ── Intervals ─────────────────────────────────────────────────────────────
  { day: 54, label: 'Intervals I',          problems: [
    54,
    53,
    235,
  ]},
  { day: 55, label: 'Intervals II',         problems: [
    182,
    183,
    313,
  ]},

  // ── Math & Geometry ───────────────────────────────────────────────────────
  { day: 56, label: 'Math & Geometry I',    problems: [
    45,
    51,
    62,
  ]},
  { day: 57, label: 'Math & Geometry II',   problems: [
    150,
    59,
    47,
  ]},
  { day: 58, label: 'Math & Geometry III',  problems: [
    41,
    315,
  ]},

  // ── Review ────────────────────────────────────────────────────────────────
  { day: 59, label: 'Review: Arrays → Graphs', problems: [] },
  { day: 60, label: 'Review: DP → Final Challenge', problems: [] },
]

const TOTAL_PROBLEMS = DAYS.reduce((acc, d) => acc + d.problems.length, 0)

export default function StudyCalendar60() {
  return (
    <StudyCalendarTemplate
      title="🚀 60-Day NeetCode 150 Study Plan"
      subtitle="All 150 NeetCode problems — 2-3 per day across 60 days"
      headerGradient="linear-gradient(135deg, #0a0a1a, #1a0a2e, #2d1b69)"
      progressGradient="linear-gradient(90deg, #a855f7, #6366f1, #3b82f6)"
      days={DAYS}
      totalDays={60}
      breadcrumbs={[
        { label: '← Home', to: '/' },
        { label: '30-Day Plan', to: '/study-calendar' },
        { label: '45-Day Plan', to: '/study-calendar-45' },
      ]}
      extraStats={[
        { label: 'Total Problems', value: TOTAL_PROBLEMS, color: '#c4b5fd' },
      ]}
    />
  )
}
