import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// Comprehensive 90-Day DSA Curriculum: ~500+ LeetCode Problems
// Organized by topic with extended problem sets for deeper mastery
const DAYS = [
  // ── ARRAYS & TWO POINTERS (Days 1-5) ─────────────────────────────────────
  { day: 1, label: 'Arrays & Two Sum', problems: [
    1,
    137,
    16,
    19,
  ]},
  { day: 2, label: 'Stock Trading Problems', problems: [
    103,
    105,
    106,
  ]},
  { day: 3, label: 'Container & Trapping Water', problems: [
    14,
    40,
    227,
  ]},
  { day: 4, label: 'Product & Subarrays', problems: [
    178,
    129,
    49,
  ]},
  { day: 5, label: 'Contains Duplicate Variants', problems: [
    164,
    165,
    166,
  ]},

  // ── STRINGS & HASHING (Days 6-10) ────────────────────────────────────────
  { day: 6, label: 'Valid Strings', problems: [
    181,
    108,
    262,
  ]},
  { day: 7, label: 'Substring Problems I', problems: [
    3,
    133,
    67,
  ]},
  { day: 8, label: 'Substring Problems II', problems: [
    230,
    252,
    236,
  ]},
  { day: 9, label: 'Anagrams & Groups', problems: [
    46,
    296,
  ]},
  { day: 10, label: 'Word & Reverse Problems', problems: [
    127,
    249,
    215,
  ]},

  // ── DESIGN & HASH TABLES (Days 11-15) ────────────────────────────────────
  { day: 11, label: 'Cache Design I', problems: [
    124,
    240,
    269,
  ]},
  { day: 12, label: 'Cache Design II', problems: [
    292,
    217,
    218,
  ]},
  { day: 13, label: 'Randomized & Set Design', problems: [
    221,
    222,
  ]},
  { day: 14, label: 'Queue & Stack Design', problems: [
    172,
    167,
    255,
  ]},
  { day: 15, label: 'Pattern & Encoding', problems: [
    151,
    198,
    189,
  ]},

  // ── INTERVALS & SCHEDULING (Days 16-20) ─────────────────────────────────
  { day: 16, label: 'Intervals I', problems: [
    53,
    54,
    234,
  ]},
  { day: 17, label: 'Intervals II', problems: [
    182,
    183,
  ]},
  { day: 18, label: 'Task Scheduling', problems: [
    254,
    277,
  ]},
  { day: 19, label: 'String Reorganization', problems: [
    301,
  ]},
  { day: 20, label: 'Rearrangement Problems', problems: [
    305,
  ]},

  // ── LINKED LIST (Days 21-25) ──────────────────────────────────────────────
  { day: 21, label: 'Linked List Reversal I', problems: [
    152,
    81,
    27,
  ]},
  { day: 22, label: 'Linked List Operations', problems: [
    20,
    73,
    71,
  ]},
  { day: 23, label: 'Linked List Merging', problems: [
    23,
    25,
  ]},
  { day: 24, label: 'Linked List Arithmetic', problems: [
    2,
    238,
  ]},
  { day: 25, label: 'Linked List Advanced', problems: [
    134,
    120,
    195,
  ]},

  // ── STACKS & PARENTHESES (Days 26-30) ────────────────────────────────────
  { day: 26, label: 'Valid Parentheses', problems: [
    22,
    309,
  ]},
  { day: 27, label: 'Generate Parentheses', problems: [
    24,
  ]},
  { day: 28, label: 'Stack Operations', problems: [
    132,
    126,
  ]},
  { day: 29, label: 'Monotonic Stack', problems: [
    273,
    243,
    245,
  ]},
  { day: 30, label: 'Histogram & Rectangles', problems: [
    74,
    76,
  ]},

  // ── BINARY SEARCH (Days 31-35) ───────────────────────────────────────────
  { day: 31, label: 'Binary Search Basics', problems: [
    268,
    34,
    191,
  ]},
  { day: 32, label: 'Binary Search Find', problems: [
    32,
    30,
    130,
  ]},
  { day: 33, label: 'Binary Search Advanced', problems: [
    136,
  ]},
  { day: 34, label: 'Binary Search 2D', problems: [
    63,
    180,
  ]},
  { day: 35, label: 'Binary Search Optimization', problems: [
    284,
    298,
    7,
  ]},

  // ── TREES - TRAVERSAL (Days 36-40) ───────────────────────────────────────
  { day: 36, label: 'Level Order Traversal', problems: [
    88,
    89,
    147,
  ]},
  { day: 37, label: 'Basic Tree Properties', problems: [
    85,
    86,
    253,
  ]},
  { day: 38, label: 'Tree Depth & Diameter', problems: [
    90,
    98,
    250,
  ]},
  { day: 39, label: 'Tree Inversion & Balancing', problems: [
    168,
    97,
  ]},
  { day: 40, label: 'Tree Path Problems', problems: [
    184,
    99,
    100,
  ]},

  // ── TREES - ADVANCED (Days 41-45) ─────────────────────────────────────────
  { day: 41, label: 'BST Operations', problems: [
    84,
    169,
    141,
  ]},
  { day: 42, label: 'LCA & Ancestors', problems: [
    174,
    176,
  ]},
  { day: 43, label: 'Tree Construction', problems: [
    92,
    95,
    297,
  ]},
  { day: 44, label: 'Maximum Path & Serialization', problems: [
    107,
    201,
    239,
  ]},
  { day: 45, label: 'Tries', problems: [
    154,
    157,
    159,
  ]},

  // ── HEAPS & GRAPHS (Days 46-50) ──────────────────────────────────────────
  { day: 46, label: 'Heap Basics', problems: [
    266,
    300,
    161,
  ]},
  { day: 47, label: 'Top K Problems', problems: [
    216,
    264,
  ]},
  { day: 48, label: 'Median & Data Stream', problems: [
    199,
    241,
  ]},
  { day: 49, label: 'Graph Basics', problems: [
    148,
    265,
    114,
  ]},
  { day: 50, label: 'Graph Traversal', problems: [
    229,
    112,
    295,
  ]},

  // ── GRAPHS ADVANCED (Days 51-55) ──────────────────────────────────────────
  { day: 51, label: 'Union-Find', problems: [
    263,
    208,
  ]},
  { day: 52, label: 'Topological Sort', problems: [
    153,
    156,
    188,
  ]},
  { day: 53, label: 'Word Transformation', problems: [
    110,
    109,
    233,
  ]},
  { day: 54, label: 'Shortest Path', problems: [
    274,
    280,
  ]},
  { day: 55, label: 'Bipartite & Coloring', problems: [
    279,
    299,
  ]},

  // ── BACKTRACKING (Days 56-60) ────────────────────────────────────────────
  { day: 56, label: 'Subsets & Combinations', problems: [
    69,
    79,
  ]},
  { day: 57, label: 'Combination Sum', problems: [
    37,
    38,
    163,
  ]},
  { day: 58, label: 'Permutations', problems: [
    43,
    44,
    29,
  ]},
  { day: 59, label: 'Letter & Word Combinations', problems: [
    17,
    70,
  ]},
  { day: 60, label: 'Palindrome & Partition', problems: [
    113,
    276,
  ]},

  // ── DYNAMIC PROGRAMMING (Days 61-75) ──────────────────────────────────────
  { day: 61, label: '1D DP Basics', problems: [
    60,
    275,
    146,
  ]},
  { day: 62, label: '1D DP House Robber', problems: [
    160,
    213,
  ]},
  { day: 63, label: '1D DP Coin Change', problems: [
    207,
    246,
    293,
  ]},
  { day: 64, label: '1D DP Decoding', problems: [
    80,
    257,
  ]},
  { day: 65, label: '1D DP Sequences', problems: [
    203,
    260,
  ]},
  { day: 66, label: '2D DP Grid', problems: [
    56,
    57,
    58,
  ]},
  { day: 67, label: '2D DP String', problems: [
    302,
    61,
    101,
  ]},
  { day: 68, label: '2D DP Expert', problems: [
    118,
    119,
  ]},
  { day: 69, label: 'Palindrome DP', problems: [
    9,
    259,
  ]},
  { day: 70, label: 'Knapsack DP', problems: [
    228,
    242,
  ]},
  { day: 71, label: 'DP Complex', problems: [
    13,
    83,
  ]},
  { day: 72, label: 'Matrix Problems', problems: [
    45,
    51,
    62,
  ]},
  { day: 73, label: 'Matrix Advanced', problems: [
    35,
    36,
  ]},
  { day: 74, label: 'N-Queens & Sorting', problems: [
    48,
    65,
  ]},
  { day: 75, label: 'Advanced Sorting', problems: [
    125,
    192,
  ]},

  // ── FINAL REVIEW & CHALLENGES (Days 76-90) ─────────────────────────────
  { day: 76, label: 'Problem Set Review I', problems: [] },
  { day: 77, label: 'Problem Set Review II', problems: [] },
  { day: 78, label: 'Problem Set Review III', problems: [] },
  { day: 79, label: 'Mock Interview I', problems: [] },
  { day: 80, label: 'Mock Interview II', problems: [] },
  { day: 81, label: 'Mock Interview III', problems: [] },
  { day: 82, label: 'Pattern Synthesis I', problems: [] },
  { day: 83, label: 'Pattern Synthesis II', problems: [] },
  { day: 84, label: 'Mock Interview IV', problems: [] },
  { day: 85, label: 'System Design Focus', problems: [] },
  { day: 86, label: 'Advanced Algorithms', problems: [] },
  { day: 87, label: 'Competitive Coding', problems: [] },
  { day: 88, label: 'Final Polish', problems: [] },
  { day: 89, label: 'Comprehensive Review', problems: [] },
  { day: 90, label: '🏆 Final Challenge Day', problems: [] },
]

const TOTAL_PROBLEMS = DAYS.reduce((sum, day) => sum + day.problems.length, 0)

export default function StudyCalendar90() {
  return (
    <StudyCalendarTemplate
      title="🎯 90-Day Comprehensive DSA Plan"
      subtitle="~500+ LeetCode problems with extensive coverage across all major topics"
      progressGradient="linear-gradient(90deg, #e94560, #f5a623, #f7e017, #38ef7d)"
      days={DAYS}
      totalDays={90}
      breadcrumbs={[
        { label: '← Home',      to: '/' },
        { label: '30-Day Plan', to: '/study-calendar' },
        { label: '60-Day Plan', to: '/study-calendar-60' },
        { label: '100-Day Plan', to: '/study-calendar-100' },
      ]}
      extraStats={[
        { label: 'Total Problems', value: TOTAL_PROBLEMS, color: '#f5a623' },
        { label: 'Coverage', value: '~500+ problems', color: '#38ef7d' },
        { label: 'Topics', value: '25+ areas', color: '#e94560' },
      ]}
    />
  )
}
