import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

const DAYS = [
  { day: 1,  label: 'Two Sum',                          problems: [1]},
  { day: 2,  label: 'Best Time to Buy and Sell Stock',  problems: [103]},
  { day: 3,  label: 'Contains Duplicate',               problems: [164]},
  { day: 4,  label: 'Product of Array Except Self',     problems: [178]},
  { day: 5,  label: 'Maximum Subarray',                 problems: [50]},
  { day: 6,  label: 'Search in Rotated Sorted Array',   problems: [31]},
  { day: 7,  label: 'Container With Most Water',        problems: [14]},
  { day: 8,  label: 'Longest Substring No Repeat',      problems: [6]},
  { day: 9,  label: 'Longest Repeating Char Replacement', problems: [231]},
  { day: 10, label: 'Valid Parentheses',                problems: [22]},
  { day: 11, label: 'Valid Anagram',                    problems: [181]},
  { day: 12, label: 'Group Anagrams',                   problems: [46]},
  { day: 13, label: 'Climbing Stairs',                  problems: [60]},
  { day: 14, label: 'Coin Change',                      problems: [207]},
  { day: 15, label: 'House Robber',                     problems: [146]},
  { day: 16, label: 'Longest Increasing Subsequence',   problems: [203]},
  { day: 17, label: 'Invert Binary Tree',               problems: [168]},
  { day: 18, label: 'Maximum Depth of Binary Tree',     problems: [91]},
  { day: 19, label: 'Binary Tree Level Order Traversal', problems: [88]},
  { day: 20, label: 'Number of Islands',                problems: [148]},
  { day: 21, label: 'Course Schedule',                  problems: [153]},
  { day: 22, label: 'Pacific Atlantic Water Flow',      problems: [229]},
  { day: 23, label: 'Merge Intervals',                  problems: [53]},
  { day: 24, label: 'Insert Interval',                  problems: [54]},
  { day: 25, label: 'Reverse Linked List',              problems: [152]},
  { day: 26, label: 'Linked List Cycle',                problems: [120]},
  { day: 27, label: 'Combination Sum',                  problems: [37]},
  { day: 28, label: 'Permutations',                     problems: [43]},
  { day: 29, label: 'Minimum Window Substring',         problems: [67]},
  { day: 30, label: 'Longest Common Subsequence',       problems: [302]},
]

export default function StudyCalendar() {
  return (
    <StudyCalendarTemplate
      title="📅 30-Day DSA Study Plan"
      subtitle="One problem a day — master core patterns in a month"
      headerGradient="linear-gradient(135deg, var(--color-primary), var(--color-bg-darker))"
      progressGradient="linear-gradient(90deg, #10b981, #34d399)"
      days={DAYS}
      totalDays={30}
      breadcrumbs={[
        { label: '← Home', to: '/' },
        { label: '45-Day Plan →', to: '/study-calendar-45' },
      ]}
    />
  )
}
