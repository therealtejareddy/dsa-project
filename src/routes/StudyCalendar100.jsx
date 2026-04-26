import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// Comprehensive 100-Day Curriculum with Revision Days: ~400 LeetCode Problems
// Organized by topic with strategic revision days interspersed for consolidation
const DAYS = [
  // ── ARRAYS & STRINGS (Days 1-9) ──────────────────────────────────────────
  { day: 1, label: 'Arrays I', problems: [
    1,
    164,
    181,
    193,
  ]},
  { day: 2, label: 'Arrays II', problems: [
    140,
    28,
    103,
    143,
  ]},
  { day: 3, label: 'Arrays III', problems: [
    178,
    105,
    316,
    212,
  ]},
  { day: 4, label: 'Arrays IV', problems: [
    39,
    46,
  ]},
  { day: 5, label: 'Strings I', problems: [
    224,
    108,
    15,
  ]},
  { day: 6, label: 'Strings II', problems: [
    10,
    128,
  ]},
  { day: 7, label: 'Bit Manipulation I', problems: [
    116,
    145,
    214,
  ]},
  { day: 8, label: 'Bit Manipulation II', problems: [
    144,
    149,
    185,
    219,
  ]},

  // ── REVISION DAY 1 (Day 9) ───────────────────────────────────────────────
  { day: 9, label: '🔄 Revision: Arrays, Strings & Bit Ops', problems: [] },

  // ── HASH TABLES & DESIGN (Days 10-14) ────────────────────────────────────
  { day: 10, label: 'Hash Tables I', problems: [
    269,
    304,
    308,
  ]},
  { day: 11, label: 'Hash Tables II', problems: [
    151,
    223,
    165,
  ]},
  { day: 12, label: 'Encoding & Design', problems: [
    190,
    303,
  ]},
  { day: 13, label: 'Data Structure Design', problems: [
    124,
    221,
    292,
  ]},

  // ── REVISION DAY 2 (Day 14) ──────────────────────────────────────────────
  { day: 14, label: '🔄 Revision: Hash Tables & Design', problems: [] },

  // ── TWO POINTERS & PREFIX SUM (Days 15-21) ──────────────────────────────
  { day: 15, label: 'Two Pointers I', problems: [
    78,
    139,
    14,
  ]},
  { day: 16, label: 'Two Pointers II', problems: [
    16,
    40,
  ]},
  { day: 17, label: 'Prefix Sum I', problems: [
    204,
    251,
    291,
  ]},
  { day: 18, label: 'Prefix Sum II', problems: [
    247,
    248,
  ]},
  { day: 19, label: 'Sliding Window Fixed', problems: [
    258,
    237,
    252,
  ]},
  { day: 20, label: 'Sliding Window Dynamic', problems: [
    5,
    231,
    67,
  ]},

  // ── REVISION DAY 3 (Day 21) ──────────────────────────────────────────────
  { day: 21, label: '🔄 Revision: Two Pointers & Sliding Window', problems: [] },

  // ── KADANE'S & MATRIX (Days 22-25) ───────────────────────────────────────
  { day: 22, label: 'Kadane\'s Algorithm', problems: [
    50,
    287,
    129,
  ]},
  { day: 23, label: 'Matrix (2D Array) I', problems: [
    51,
    45,
    62,
  ]},
  { day: 24, label: 'Matrix (2D Array) II', problems: [
    35,
    197,
  ]},

  // ── REVISION DAY 4 (Day 25) ──────────────────────────────────────────────
  { day: 25, label: '🔄 Revision: Kadane & Matrix', problems: [] },

  // ── LINKED LIST (Days 26-34) ─────────────────────────────────────────────
  { day: 26, label: 'Linked List Basics', problems: [
    135,
    270,
    21,
  ]},
  { day: 27, label: 'Linked List II', problems: [
    72,
    26,
    117,
  ]},
  { day: 28, label: 'Linked List III', problems: [
    77,
    55,
    2,
  ]},
  { day: 29, label: 'Linked List Reversal I', problems: [
    152,
    81,
  ]},
  { day: 30, label: 'Linked List Reversal II', problems: [
    27,
    173,
  ]},
  { day: 31, label: 'Fast & Slow Pointers', problems: [
    285,
    150,
    121,
  ]},
  { day: 32, label: 'Linked List Advanced', problems: [
    25,
    27,
  ]},
  { day: 33, label: 'Linked List Flatten', problems: [
    232,
    238,
  ]},

  // ── REVISION DAY 5 (Day 34) ──────────────────────────────────────────────
  { day: 34, label: '🔄 Revision: Linked Lists', problems: [] },

  // ── STACKS & QUEUES (Days 35-41) ─────────────────────────────────────────
  { day: 35, label: 'Stack Basics', problems: [
    22,
    310,
    281,
  ]},
  { day: 36, label: 'Stack Design', problems: [
    132,
    126,
  ]},
  { day: 37, label: 'Monotonic Stack I', problems: [
    243,
    273,
  ]},
  { day: 38, label: 'Monotonic Stack II', problems: [
    286,
    75,
  ]},
  { day: 39, label: 'Monotonic Queue', problems: [
    179,
    306,
  ]},
  { day: 40, label: 'Queues & Stack Design', problems: [
    288,
    172,
    167,
  ]},

  // ── REVISION DAY 6 (Day 41) ──────────────────────────────────────────────
  { day: 41, label: '🔄 Revision: Stacks & Queues', problems: [] },

  // ── RECURSION & SORTING (Days 42-45) ─────────────────────────────────────
  { day: 42, label: 'Recursion & Divide & Conquer', problems: [
    23,
    47,
    225,
  ]},
  { day: 43, label: 'Merge Sort & QuickSelect', problems: [
    125,
    66,
    162,
  ]},
  { day: 44, label: 'Bucket Sort & Counting', problems: [
    216,
  ]},

  // ── REVISION DAY 7 (Day 45) ──────────────────────────────────────────────
  { day: 45, label: '🔄 Revision: Recursion & Sorting', problems: [] },

  // ── BINARY SEARCH (Days 46-50) ───────────────────────────────────────────
  { day: 46, label: 'Binary Search I', problems: [
    268,
    34,
    191,
  ]},
  { day: 47, label: 'Binary Search II', problems: [
    33,
    31,
    131,
  ]},
  { day: 48, label: 'Binary Search III', problems: [
    136,
    64,
  ]},
  { day: 49, label: 'Binary Search IV', problems: [
    284,
    8,
  ]},

  // ── REVISION DAY 8 (Day 50) ──────────────────────────────────────────────
  { day: 50, label: '🔄 Revision: Binary Search', problems: [] },

  // ── BACKTRACKING (Days 51-55) ────────────────────────────────────────────
  { day: 51, label: 'Backtracking I', problems: [
    69,
    79,
  ]},
  { day: 52, label: 'Backtracking II', problems: [
    37,
    38,
    163,
  ]},
  { day: 53, label: 'Backtracking III', problems: [
    43,
    44,
    18,
  ]},
  { day: 54, label: 'Backtracking IV', problems: [
    70,
    113,
    48,
  ]},

  // ── REVISION DAY 9 (Day 55) ──────────────────────────────────────────────
  { day: 55, label: '🔄 Revision: Backtracking', problems: [] },

  // ── TREES (Days 56-66) ───────────────────────────────────────────────────
  { day: 56, label: 'Trees - Level Order', problems: [
    88,
    147,
  ]},
  { day: 57, label: 'Trees - Pre Order', problems: [
    85,
    86,
    184,
  ]},
  { day: 58, label: 'Trees - In Order', problems: [
    82,
    84,
  ]},
  { day: 59, label: 'Trees - Post Order', problems: [
    123,
    168,
    250,
  ]},
  { day: 60, label: 'Trees - Basics', problems: [
    91,
    97,
    253,
  ]},
  { day: 61, label: 'Trees - BST & LCA', problems: [
    170,
    175,
    177,
  ]},
  { day: 62, label: 'Trees - Construction', problems: [
    93,
    96,
  ]},
  { day: 63, label: 'Trees - Hard I', problems: [
    107,
    289,
  ]},
  { day: 64, label: 'Trees - Hard II', problems: [
    202,
  ]},
  { day: 65, label: 'Tries I', problems: [
    155,
    158,
  ]},

  // ── REVISION DAY 10 (Day 66) ─────────────────────────────────────────────
  { day: 66, label: '🔄 Revision: Trees & Tries', problems: [] },

  // ── HEAPS & PRIORITY QUEUES (Days 67-72) ────────────────────────────────
  { day: 67, label: 'Heap I - Basics', problems: [
    267,
    300,
  ]},
  { day: 68, label: 'Heap II - Top K', problems: [
    216,
    290,
    162,
  ]},
  { day: 69, label: 'Heap III - Two Heaps', problems: [
    200,
    244,
  ]},
  { day: 70, label: 'Heap IV - Design', problems: [
    254,
    217,
  ]},
  { day: 71, label: 'Heap V - Merge', problems: [
    25,
    256,
  ]},

  // ── REVISION DAY 11 (Day 72) ─────────────────────────────────────────────
  { day: 72, label: '🔄 Revision: Heaps & Priority Queues', problems: [] },

  // ── GRAPHS (Days 73-84) ──────────────────────────────────────────────────
  { day: 73, label: 'Graphs I - DFS/BFS', problems: [
    148,
    114,
  ]},
  { day: 74, label: 'Graphs II - Advanced DFS', problems: [
    229,
    112,
    { num: 994, title: 'Rotting Oranges', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 75, label: 'Graphs III - Union Find', problems: [
    263,
    209,
    186,
  ]},
  { day: 76, label: 'Graphs IV - Topological', problems: [
    153,
    156,
  ]},
  { day: 77, label: 'Graphs V - Shortest Path', problems: [
    274,
    312,
  ]},
  { day: 78, label: 'Graphs VI - Advanced', problems: [
    278,
    188,
  ]},
  { day: 79, label: 'Graphs VII - Eulerian', problems: [
    211,
    311,
  ]},
  { day: 80, label: 'Intervals & Greedy I', problems: [
    53,
    54,
  ]},
  { day: 81, label: 'Greedy II', problems: [
    52,
    42,
  ]},
  { day: 82, label: 'Greedy III', problems: [
    115,
    235,
  ]},
  { day: 83, label: 'Greedy IV', problems: [
    276,
    261,
  ]},

  // ── REVISION DAY 12 (Day 84) ─────────────────────────────────────────────
  { day: 84, label: '🔄 Revision: Graphs, Intervals & Greedy', problems: [] },

  // ── DYNAMIC PROGRAMMING (Days 85-96) ────────────────────────────────────
  { day: 85, label: '1D DP I', problems: [
    60,
    146,
  ]},
  { day: 86, label: '1D DP II - Knapsack', problems: [
    228,
    242,
  ]},
  { day: 87, label: '1D DP III - Unbounded', problems: [
    207,
    246,
  ]},
  { day: 88, label: '1D DP IV - LIS', problems: [
    203,
  ]},
  { day: 89, label: '2D DP I - Grid', problems: [
    56,
    58,
  ]},
  { day: 90, label: '2D DP II - String', problems: [
    302,
    61,
  ]},
  { day: 91, label: '2D DP III - Hard', problems: [
    83,
    101,
  ]},
  { day: 92, label: '2D DP IV - Expert', problems: [
    142,
    13,
  ]},
  { day: 93, label: 'String DP & Tree DP', problems: [
    9,
    118,
  ]},
  { day: 94, label: 'Math & Geometry I', problems: [
    12,
    11,
  ]},
  { day: 95, label: 'Math & Geometry II', problems: [
    59,
    315,
  ]},

  // ── REVISION DAY 13 (Day 96) ─────────────────────────────────────────────
  { day: 96, label: '🔄 Revision: Dynamic Programming & Math', problems: [] },

  // ── FINAL POLISH & CHALLENGE (Days 97-100) ──────────────────────────────
  { day: 97, label: 'Advanced Topics Review', problems: [] },
  { day: 98, label: 'Mock Interviews & Practice', problems: [] },
  { day: 99, label: 'Pattern Recognition & Synthesis', problems: [] },
  { day: 100, label: '🏆 Final Challenge & Celebration', problems: [] },
]

const TOTAL_PROBLEMS = DAYS.reduce((sum, day) => sum + day.problems.length, 0)

export default function StudyCalendar100() {
  return (
    <StudyCalendarTemplate
      title="🎯 100-Day DSA Mastery Plan"
      subtitle="Comprehensive curriculum with strategic revision days for deep consolidation"
      progressGradient="linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe)"
      days={DAYS}
      totalDays={100}
      breadcrumbs={[
        { label: '← Home',      to: '/' },
        { label: '30-Day Plan', to: '/study-calendar' },
        { label: '60-Day Plan', to: '/study-calendar-60' },
        { label: '90-Day Plan', to: '/study-calendar-90' },
      ]}
      extraStats={[
        { label: 'Total Problems', value: TOTAL_PROBLEMS, color: '#f093fb' },
        { label: 'Revision Days', value: '13 days', color: '#4facfe' },
        { label: 'Coverage', value: '~400+ problems', color: '#667eea' },
      ]}
    />
  )
}
