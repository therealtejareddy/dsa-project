import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

const DAYS = [
  { day: 1,  label: 'Two Sum',                          problems: [{ num: 1,    title: 'Two Sum',                                    path: '/problems/two-sum',                               difficulty: 'Easy',   category: 'Array'        }]},
  { day: 2,  label: 'Best Time to Buy and Sell Stock',  problems: [{ num: 121,  title: 'Best Time to Buy and Sell Stock',             path: '/problems/best-time-buy-sell-stock',              difficulty: 'Easy',   category: 'Array'        }]},
  { day: 3,  label: 'Contains Duplicate',               problems: [{ num: 217,  title: 'Contains Duplicate',                         path: '/problems/contains-duplicate',                    difficulty: 'Easy',   category: 'Array'        }]},
  { day: 4,  label: 'Product of Array Except Self',     problems: [{ num: 238,  title: 'Product of Array Except Self',               path: '/problems/product-of-array-except-self',          difficulty: 'Medium', category: 'Array'        }]},
  { day: 5,  label: 'Maximum Subarray',                 problems: [{ num: 53,   title: 'Maximum Subarray',                           path: '/problems/maximum-subarray',                      difficulty: 'Medium', category: 'Array'        }]},
  { day: 6,  label: 'Search in Rotated Sorted Array',   problems: [{ num: 33,   title: 'Search in Rotated Sorted Array',             path: '/problems/search-rotated-sorted-array',           difficulty: 'Medium', category: 'Array'        }]},
  { day: 7,  label: 'Container With Most Water',        problems: [{ num: 11,   title: 'Container With Most Water',                  path: '/problems/container-with-most-water',             difficulty: 'Medium', category: 'Array'        }]},
  { day: 8,  label: 'Longest Substring No Repeat',      problems: [{ num: 3,    title: 'Longest Substring Without Repeating Chars',  path: '/problems/longest-substring-no-repeat',           difficulty: 'Medium', category: 'String'       }]},
  { day: 9,  label: 'Longest Repeating Char Replacement', problems: [{ num: 424, title: 'Longest Repeating Character Replacement',  path: '/problems/longest-repeating-character-replacement', difficulty: 'Medium', category: 'String'      }]},
  { day: 10, label: 'Valid Parentheses',                problems: [{ num: 20,   title: 'Valid Parentheses',                          path: '/problems/valid-parentheses',                     difficulty: 'Easy',   category: 'String'       }]},
  { day: 11, label: 'Valid Anagram',                    problems: [{ num: 242,  title: 'Valid Anagram',                              path: '/problems/valid-anagram',                         difficulty: 'Easy',   category: 'String'       }]},
  { day: 12, label: 'Group Anagrams',                   problems: [{ num: 49,   title: 'Group Anagrams',                             path: '/problems/group-anagrams',                        difficulty: 'Medium', category: 'String'       }]},
  { day: 13, label: 'Climbing Stairs',                  problems: [{ num: 70,   title: 'Climbing Stairs',                            path: '/problems/climbing-stairs',                       difficulty: 'Easy',   category: 'DP'           }]},
  { day: 14, label: 'Coin Change',                      problems: [{ num: 322,  title: 'Coin Change',                                path: '/problems/coin-change',                           difficulty: 'Medium', category: 'DP'           }]},
  { day: 15, label: 'House Robber',                     problems: [{ num: 198,  title: 'House Robber',                               path: '/problems/house-robber',                          difficulty: 'Medium', category: 'DP'           }]},
  { day: 16, label: 'Longest Increasing Subsequence',   problems: [{ num: 300,  title: 'Longest Increasing Subsequence',             path: '/problems/longest-increasing-subsequence',        difficulty: 'Medium', category: 'DP'           }]},
  { day: 17, label: 'Invert Binary Tree',               problems: [{ num: 226,  title: 'Invert Binary Tree',                         path: '/problems/invert-binary-tree',                    difficulty: 'Easy',   category: 'Tree'         }]},
  { day: 18, label: 'Maximum Depth of Binary Tree',     problems: [{ num: 104,  title: 'Maximum Depth of Binary Tree',               path: '/problems/maximum-depth-binary-tree',             difficulty: 'Easy',   category: 'Tree'         }]},
  { day: 19, label: 'Binary Tree Level Order Traversal', problems: [{ num: 102, title: 'Binary Tree Level Order Traversal',          path: '/problems/binary-tree-level-order-traversal',     difficulty: 'Medium', category: 'Tree'         }]},
  { day: 20, label: 'Number of Islands',                problems: [{ num: 200,  title: 'Number of Islands',                          path: '/problems/number-of-islands',                     difficulty: 'Medium', category: 'Graph'        }]},
  { day: 21, label: 'Course Schedule',                  problems: [{ num: 207,  title: 'Course Schedule',                            path: '/problems/course-schedule',                       difficulty: 'Medium', category: 'Graph'        }]},
  { day: 22, label: 'Pacific Atlantic Water Flow',      problems: [{ num: 417,  title: 'Pacific Atlantic Water Flow',                path: '/problems/pacific-atlantic-water-flow',           difficulty: 'Medium', category: 'Graph'        }]},
  { day: 23, label: 'Merge Intervals',                  problems: [{ num: 56,   title: 'Merge Intervals',                            path: '/problems/merge-intervals',                       difficulty: 'Medium', category: 'Interval'     }]},
  { day: 24, label: 'Insert Interval',                  problems: [{ num: 57,   title: 'Insert Interval',                            path: '/problems/insert-interval',                       difficulty: 'Hard',   category: 'Interval'     }]},
  { day: 25, label: 'Reverse Linked List',              problems: [{ num: 206,  title: 'Reverse Linked List',                        path: '/problems/reverse-linked-list',                   difficulty: 'Easy',   category: 'Linked List'  }]},
  { day: 26, label: 'Linked List Cycle',                problems: [{ num: 141,  title: 'Linked List Cycle',                          path: '/problems/detect-cycle-linked-list',              difficulty: 'Easy',   category: 'Linked List'  }]},
  { day: 27, label: 'Combination Sum',                  problems: [{ num: 39,   title: 'Combination Sum',                            path: '/problems/combination-sum',                       difficulty: 'Medium', category: 'Backtracking' }]},
  { day: 28, label: 'Permutations',                     problems: [{ num: 46,   title: 'Permutations',                               path: '/problems/permutations',                          difficulty: 'Medium', category: 'Backtracking' }]},
  { day: 29, label: 'Minimum Window Substring',         problems: [{ num: 76,   title: 'Minimum Window Substring',                   path: '/problems/minimum-window-substring',              difficulty: 'Hard',   category: 'String'       }]},
  { day: 30, label: 'Longest Common Subsequence',       problems: [{ num: 1143, title: 'Longest Common Subsequence',                 path: '/problems/lcs',                                   difficulty: 'Medium', category: 'DP'           }]},
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
