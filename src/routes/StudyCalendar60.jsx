import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// NeetCode 150 — 60-Day Study Plan (~2-3 problems/day)
const DAYS = [
  // ── Arrays & Hashing ──────────────────────────────────────────────────────
  { day: 1,  label: 'Arrays & Hashing I',   problems: [
    { num: 217,  title: 'Contains Duplicate',                path: '/problems/contains-duplicate',                     difficulty: 'Easy',   category: 'Array' },
    { num: 242,  title: 'Valid Anagram',                     path: '/problems/valid-anagram',                          difficulty: 'Easy',   category: 'Array' },
    { num: 1,    title: 'Two Sum',                           path: '/problems/two-sum',                                difficulty: 'Easy',   category: 'Array' },
  ]},
  { day: 2,  label: 'Arrays & Hashing II',  problems: [
    { num: 49,   title: 'Group Anagrams',                    path: '/problems/group-anagrams',                         difficulty: 'Medium', category: 'Array' },
    { num: 347,  title: 'Top K Frequent Elements',           path: '/problems/top-k-frequent-elements',                difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 3,  label: 'Arrays & Hashing III', problems: [
    { num: 238,  title: 'Product of Array Except Self',      path: '/problems/product-of-array-except-self',           difficulty: 'Medium', category: 'Array' },
    { num: 36,   title: 'Valid Sudoku',                      path: '/problems/valid-sudoku',                           difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 4,  label: 'Arrays & Hashing IV',  problems: [
    { num: 271,  title: 'Encode and Decode Strings',         path: '/problems/encode-decode-strings',                  difficulty: 'Medium', category: 'Array' },
    { num: 128,  title: 'Longest Consecutive Sequence',      path: '/problems/longest-consecutive-sequence',           difficulty: 'Medium', category: 'Array' },
  ]},

  // ── Two Pointers ──────────────────────────────────────────────────────────
  { day: 5,  label: 'Two Pointers I',       problems: [
    { num: 125,  title: 'Valid Palindrome',                  path: '/problems/valid-palindrome',                       difficulty: 'Easy',   category: 'Two Pointers' },
    { num: 167,  title: 'Two Sum II',                        path: '/problems/two-sum-ii',                             difficulty: 'Medium', category: 'Two Pointers' },
    { num: 15,   title: '3Sum',                              path: '/problems/3sum',                                   difficulty: 'Medium', category: 'Two Pointers' },
  ]},
  { day: 6,  label: 'Two Pointers II',      problems: [
    { num: 11,   title: 'Container With Most Water',         path: '/problems/container-with-most-water',              difficulty: 'Medium', category: 'Two Pointers' },
    { num: 42,   title: 'Trapping Rain Water',               path: '/problems/trapping-rain-water',                    difficulty: 'Hard',   category: 'Two Pointers' },
  ]},

  // ── Sliding Window ────────────────────────────────────────────────────────
  { day: 7,  label: 'Sliding Window I',     problems: [
    { num: 121,  title: 'Best Time to Buy and Sell Stock',   path: '/problems/best-time-buy-sell-stock',               difficulty: 'Easy',   category: 'Sliding Window' },
    { num: 3,    title: 'Longest Substring Without Repeating', path: '/problems/longest-substring-no-repeat',          difficulty: 'Medium', category: 'Sliding Window' },
  ]},
  { day: 8,  label: 'Sliding Window II',    problems: [
    { num: 424,  title: 'Longest Repeating Character Replacement', path: '/problems/longest-repeating-character-replacement', difficulty: 'Medium', category: 'Sliding Window' },
    { num: 567,  title: 'Permutation in String',             path: '/problems/permutation-in-string',                  difficulty: 'Medium', category: 'Sliding Window' },
  ]},
  { day: 9,  label: 'Sliding Window III',   problems: [
    { num: 76,   title: 'Minimum Window Substring',          path: '/problems/minimum-window-substring',               difficulty: 'Hard',   category: 'Sliding Window' },
    { num: 239,  title: 'Sliding Window Maximum',            path: '/problems/sliding-window-maximum',                 difficulty: 'Hard',   category: 'Sliding Window' },
  ]},

  // ── Stack ─────────────────────────────────────────────────────────────────
  { day: 10, label: 'Stack I',              problems: [
    { num: 20,   title: 'Valid Parentheses',                 path: '/problems/valid-parentheses',                      difficulty: 'Easy',   category: 'Stack' },
    { num: 155,  title: 'Min Stack',                        path: '/problems/min-stack',                              difficulty: 'Medium', category: 'Stack' },
    { num: 150,  title: 'Evaluate Reverse Polish Notation',  path: '/problems/evaluate-reverse-polish-notation',       difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 11, label: 'Stack II',             problems: [
    { num: 22,   title: 'Generate Parentheses',              path: '/problems/generate-parentheses',                   difficulty: 'Medium', category: 'Stack' },
    { num: 739,  title: 'Daily Temperatures',                path: '/problems/daily-temperatures',                     difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 12, label: 'Stack III',            problems: [
    { num: 853,  title: 'Car Fleet',                         path: '/problems/car-fleet',                              difficulty: 'Medium', category: 'Stack' },
    { num: 84,   title: 'Largest Rectangle in Histogram',   path: '/problems/largest-rectangle-in-histogram',         difficulty: 'Hard',   category: 'Stack' },
  ]},

  // ── Binary Search ─────────────────────────────────────────────────────────
  { day: 13, label: 'Binary Search I',      problems: [
    { num: 704,  title: 'Binary Search',                     path: '/problems/binary-search',                          difficulty: 'Easy',   category: 'Binary Search' },
    { num: 74,   title: 'Search a 2D Matrix',                path: '/problems/search-a-2d-matrix',                     difficulty: 'Medium', category: 'Binary Search' },
    { num: 875,  title: 'Koko Eating Bananas',               path: '/problems/koko-eating-bananas',                    difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 14, label: 'Binary Search II',     problems: [
    { num: 153,  title: 'Find Minimum in Rotated Sorted Array', path: '/problems/find-min-rotated-sorted-array',       difficulty: 'Medium', category: 'Binary Search' },
    { num: 33,   title: 'Search in Rotated Sorted Array',    path: '/problems/search-rotated-sorted-array',            difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 15, label: 'Binary Search III',    problems: [
    { num: 981,  title: 'Time Based Key-Value Store',        path: '/problems/time-based-key-value-store',             difficulty: 'Medium', category: 'Binary Search' },
    { num: 4,    title: 'Median of Two Sorted Arrays',       path: '/problems/median-of-two-sorted-arrays',            difficulty: 'Hard',   category: 'Binary Search' },
  ]},

  // ── Bit Manipulation ──────────────────────────────────────────────────────
  { day: 16, label: 'Bit Manipulation I',   problems: [
    { num: 136,  title: 'Single Number',                     path: '/problems/single-number',                          difficulty: 'Easy',   category: 'Bit Manipulation' },
    { num: 191,  title: 'Number of 1 Bits',                  path: '/problems/number-of-1-bits',                       difficulty: 'Easy',   category: 'Bit Manipulation' },
    { num: 338,  title: 'Counting Bits',                     path: '/problems/counting-bits',                          difficulty: 'Easy',   category: 'Bit Manipulation' },
  ]},
  { day: 17, label: 'Bit Manipulation II',  problems: [
    { num: 190,  title: 'Reverse Bits',                      path: '/problems/reverse-bits',                           difficulty: 'Easy',   category: 'Bit Manipulation' },
    { num: 268,  title: 'Missing Number',                    path: '/problems/missing-number',                         difficulty: 'Easy',   category: 'Bit Manipulation' },
    { num: 371,  title: 'Sum of Two Integers',               path: '/problems/sum-of-two-integers',                    difficulty: 'Medium', category: 'Bit Manipulation' },
    { num: 7,    title: 'Reverse Integer',                   path: '/problems/reverse-integer',                        difficulty: 'Medium', category: 'Bit Manipulation' },
  ]},

  // ── Linked List ───────────────────────────────────────────────────────────
  { day: 18, label: 'Linked List I',        problems: [
    { num: 206,  title: 'Reverse Linked List',               path: '/problems/reverse-linked-list',                    difficulty: 'Easy',   category: 'Linked List' },
    { num: 21,   title: 'Merge Two Sorted Lists',            path: '/problems/merge-two-sorted-lists',                 difficulty: 'Easy',   category: 'Linked List' },
    { num: 143,  title: 'Reorder List',                      path: '/problems/reorder-list',                           difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 19, label: 'Linked List II',       problems: [
    { num: 19,   title: 'Remove Nth Node From End of List',  path: '/problems/remove-nth-node-end-list',               difficulty: 'Medium', category: 'Linked List' },
    { num: 138,  title: 'Copy List with Random Pointer',     path: '/problems/copy-list-with-random-pointer',          difficulty: 'Medium', category: 'Linked List' },
    { num: 2,    title: 'Add Two Numbers',                   path: '/problems/add-two-numbers',                        difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 20, label: 'Linked List III',      problems: [
    { num: 141,  title: 'Linked List Cycle',                 path: '/problems/detect-cycle-linked-list',               difficulty: 'Easy',   category: 'Linked List' },
    { num: 287,  title: 'Find the Duplicate Number',         path: '/problems/find-the-duplicate-number',              difficulty: 'Medium', category: 'Linked List' },
    { num: 146,  title: 'LRU Cache',                         path: '/problems/lru-cache',                              difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 21, label: 'Linked List IV',       problems: [
    { num: 23,   title: 'Merge K Sorted Lists',              path: '/problems/merge-k-sorted-lists',                   difficulty: 'Hard',   category: 'Linked List' },
    { num: 25,   title: 'Reverse Nodes in k-Group',          path: '/problems/reverse-nodes-in-k-group',               difficulty: 'Hard',   category: 'Linked List' },
  ]},

  // ── Trees ─────────────────────────────────────────────────────────────────
  { day: 22, label: 'Trees I',              problems: [
    { num: 226,  title: 'Invert Binary Tree',                path: '/problems/invert-binary-tree',                     difficulty: 'Easy',   category: 'Tree' },
    { num: 104,  title: 'Maximum Depth of Binary Tree',      path: '/problems/maximum-depth-binary-tree',              difficulty: 'Easy',   category: 'Tree' },
    { num: 543,  title: 'Diameter of Binary Tree',           path: '/problems/diameter-of-binary-tree',                difficulty: 'Easy',   category: 'Tree' },
  ]},
  { day: 23, label: 'Trees II',             problems: [
    { num: 110,  title: 'Balanced Binary Tree',              path: '/problems/balanced-binary-tree',                   difficulty: 'Easy',   category: 'Tree' },
    { num: 100,  title: 'Same Tree',                         path: '/problems/same-tree',                              difficulty: 'Easy',   category: 'Tree' },
    { num: 572,  title: 'Subtree of Another Tree',           path: '/problems/subtree-of-another-tree',                difficulty: 'Easy',   category: 'Tree' },
  ]},
  { day: 24, label: 'Trees III',            problems: [
    { num: 235,  title: 'Lowest Common Ancestor of BST',     path: '/problems/lca-bst',                                difficulty: 'Medium', category: 'Tree' },
    { num: 102,  title: 'Binary Tree Level Order Traversal', path: '/problems/binary-tree-level-order-traversal',      difficulty: 'Medium', category: 'Tree' },
    { num: 199,  title: 'Binary Tree Right Side View',       path: '/problems/binary-tree-right-side-view',            difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 25, label: 'Trees IV',             problems: [
    { num: 1448, title: 'Count Good Nodes in Binary Tree',   path: '/problems/count-good-nodes',                       difficulty: 'Medium', category: 'Tree' },
    { num: 98,   title: 'Validate Binary Search Tree',       path: '/problems/validate-binary-search-tree',            difficulty: 'Medium', category: 'Tree' },
    { num: 230,  title: 'Kth Smallest Element in BST',       path: '/problems/kth-smallest-element-in-bst',            difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 26, label: 'Trees V',              problems: [
    { num: 105,  title: 'Construct Binary Tree from Preorder/Inorder', path: '/problems/construct-binary-tree-preorder-inorder', difficulty: 'Medium', category: 'Tree' },
    { num: 124,  title: 'Binary Tree Maximum Path Sum',      path: '/problems/binary-tree-maximum-path-sum',           difficulty: 'Hard',   category: 'Tree' },
  ]},
  { day: 27, label: 'Trees VI',             problems: [
    { num: 297,  title: 'Serialize and Deserialize Binary Tree', path: '/problems/serialize-deserialize-binary-tree',  difficulty: 'Hard',   category: 'Tree' },
  ]},

  // ── Tries ─────────────────────────────────────────────────────────────────
  { day: 28, label: 'Tries',                problems: [
    { num: 208,  title: 'Implement Trie (Prefix Tree)',      path: '/problems/implement-trie',                         difficulty: 'Medium', category: 'Trie' },
    { num: 211,  title: 'Design Add and Search Words',       path: '/problems/design-add-search-words',                difficulty: 'Medium', category: 'Trie' },
    { num: 212,  title: 'Word Search II',                    path: '/problems/word-search-ii',                         difficulty: 'Hard',   category: 'Trie' },
  ]},

  // ── Heap / Priority Queue ─────────────────────────────────────────────────
  { day: 29, label: 'Heap I',               problems: [
    { num: 703,  title: 'Kth Largest Element in a Stream',   path: '/problems/kth-largest-element-in-stream',          difficulty: 'Easy',   category: 'Heap' },
    { num: 1046, title: 'Last Stone Weight',                 path: '/problems/last-stone-weight',                      difficulty: 'Easy',   category: 'Heap' },
    { num: 973,  title: 'K Closest Points to Origin',        path: '/problems/k-closest-points-to-origin',             difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 30, label: 'Heap II',              problems: [
    { num: 215,  title: 'Kth Largest Element in an Array',   path: '/problems/kth-largest-element-in-array',           difficulty: 'Medium', category: 'Heap' },
    { num: 621,  title: 'Task Scheduler',                    path: '/problems/task-scheduler',                         difficulty: 'Medium', category: 'Heap' },
    { num: 355,  title: 'Design Twitter',                    path: '/problems/design-twitter',                         difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 31, label: 'Heap III',             problems: [
    { num: 295,  title: 'Find Median from Data Stream',      path: '/problems/find-median-from-data-stream',           difficulty: 'Hard',   category: 'Heap' },
  ]},

  // ── Backtracking ──────────────────────────────────────────────────────────
  { day: 32, label: 'Backtracking I',       problems: [
    { num: 78,   title: 'Subsets',                           path: '/problems/subsets',                                difficulty: 'Medium', category: 'Backtracking' },
    { num: 39,   title: 'Combination Sum',                   path: '/problems/combination-sum',                        difficulty: 'Medium', category: 'Backtracking' },
    { num: 46,   title: 'Permutations',                      path: '/problems/permutations',                           difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 33, label: 'Backtracking II',      problems: [
    { num: 90,   title: 'Subsets II',                        path: '/problems/subsets-ii',                             difficulty: 'Medium', category: 'Backtracking' },
    { num: 40,   title: 'Combination Sum II',                path: '/problems/combination-sum-ii',                     difficulty: 'Medium', category: 'Backtracking' },
    { num: 79,   title: 'Word Search',                       path: '/problems/word-search',                            difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 34, label: 'Backtracking III',     problems: [
    { num: 131,  title: 'Palindrome Partitioning',           path: '/problems/palindrome-partitioning',                difficulty: 'Medium', category: 'Backtracking' },
    { num: 17,   title: 'Letter Combinations of a Phone Number', path: '/problems/letter-combinations-phone-number',   difficulty: 'Medium', category: 'Backtracking' },
    { num: 51,   title: 'N-Queens',                          path: '/problems/n-queens',                               difficulty: 'Hard',   category: 'Backtracking' },
  ]},

  // ── Graphs ────────────────────────────────────────────────────────────────
  { day: 35, label: 'Graphs I',             problems: [
    { num: 200,  title: 'Number of Islands',                 path: '/problems/number-of-islands',                      difficulty: 'Medium', category: 'Graph' },
    { num: 133,  title: 'Clone Graph',                       path: '/problems/clone-graph',                            difficulty: 'Medium', category: 'Graph' },
    { num: 695,  title: 'Max Area of Island',                path: '/problems/max-area-of-island',                     difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 36, label: 'Graphs II',            problems: [
    { num: 417,  title: 'Pacific Atlantic Water Flow',       path: '/problems/pacific-atlantic-water-flow',            difficulty: 'Medium', category: 'Graph' },
    { num: 130,  title: 'Surrounded Regions',                path: '/problems/surrounded-regions',                     difficulty: 'Medium', category: 'Graph' },
    { num: 994,  title: 'Rotting Oranges',                   path: '/problems/rotting-oranges',                        difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 37, label: 'Graphs III',           problems: [
    { num: 286,  title: 'Walls and Gates',                   path: '/problems/walls-and-gates',                        difficulty: 'Medium', category: 'Graph' },
    { num: 207,  title: 'Course Schedule',                   path: '/problems/course-schedule',                        difficulty: 'Medium', category: 'Graph' },
    { num: 210,  title: 'Course Schedule II',                path: '/problems/course-schedule-ii',                     difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 38, label: 'Graphs IV',            problems: [
    { num: 684,  title: 'Redundant Connection',              path: '/problems/redundant-connection',                   difficulty: 'Medium', category: 'Graph' },
    { num: 323,  title: 'Number of Connected Components',    path: '/problems/connected-components-undirected-graph',  difficulty: 'Medium', category: 'Graph' },
    { num: 261,  title: 'Graph Valid Tree',                  path: '/problems/graph-valid-tree',                       difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 39, label: 'Graphs V',             problems: [
    { num: 127,  title: 'Word Ladder',                       path: '/problems/word-ladder',                            difficulty: 'Hard',   category: 'Graph' },
  ]},

  // ── Advanced Graphs ───────────────────────────────────────────────────────
  { day: 40, label: 'Advanced Graphs I',    problems: [
    { num: 332,  title: 'Reconstruct Itinerary',             path: '/problems/reconstruct-itinerary',                  difficulty: 'Hard',   category: 'Advanced Graph' },
    { num: 1584, title: 'Min Cost to Connect All Points',    path: '/problems/min-cost-connect-all-points',            difficulty: 'Medium', category: 'Advanced Graph' },
  ]},
  { day: 41, label: 'Advanced Graphs II',   problems: [
    { num: 743,  title: 'Network Delay Time',                path: '/problems/network-delay-time',                     difficulty: 'Medium', category: 'Advanced Graph' },
    { num: 778,  title: 'Swim in Rising Water',              path: '/problems/swim-in-rising-water',                   difficulty: 'Hard',   category: 'Advanced Graph' },
  ]},
  { day: 42, label: 'Advanced Graphs III',  problems: [
    { num: 269,  title: 'Alien Dictionary',                  path: '/problems/alien-dictionary',                       difficulty: 'Hard',   category: 'Advanced Graph' },
    { num: 787,  title: 'Cheapest Flights Within K Stops',   path: '/problems/cheapest-flights-within-k-stops',        difficulty: 'Medium', category: 'Advanced Graph' },
  ]},

  // ── 1D Dynamic Programming ────────────────────────────────────────────────
  { day: 43, label: '1D DP I',              problems: [
    { num: 70,   title: 'Climbing Stairs',                   path: '/problems/climbing-stairs',                        difficulty: 'Easy',   category: 'Dynamic Programming' },
    { num: 746,  title: 'Min Cost Climbing Stairs',          path: '/problems/min-cost-climbing-stairs',               difficulty: 'Easy',   category: 'Dynamic Programming' },
    { num: 198,  title: 'House Robber',                      path: '/problems/house-robber',                           difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},
  { day: 44, label: '1D DP II',             problems: [
    { num: 213,  title: 'House Robber II',                   path: '/problems/house-robber-ii',                        difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 5,    title: 'Longest Palindromic Substring',     path: '/problems/longest-palindromic-substring',          difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 647,  title: 'Palindromic Substrings',            path: '/problems/palindromic-substrings',                 difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},
  { day: 45, label: '1D DP III',            problems: [
    { num: 91,   title: 'Decode Ways',                       path: '/problems/decode-ways',                            difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 322,  title: 'Coin Change',                       path: '/problems/coin-change',                            difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 152,  title: 'Maximum Product Subarray',          path: '/problems/maximum-product-subarray',               difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},
  { day: 46, label: '1D DP IV',             problems: [
    { num: 139,  title: 'Word Break',                        path: '/problems/word-break',                             difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 300,  title: 'Longest Increasing Subsequence',    path: '/problems/longest-increasing-subsequence',         difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 416,  title: 'Partition Equal Subset Sum',        path: '/problems/partition-equal-subset-sum',             difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},

  // ── 2D Dynamic Programming ────────────────────────────────────────────────
  { day: 47, label: '2D DP I',              problems: [
    { num: 62,   title: 'Unique Paths',                      path: '/problems/unique-paths',                           difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 1143, title: 'Longest Common Subsequence',        path: '/problems/lcs',                                    difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 309,  title: 'Best Time to Buy/Sell with Cooldown', path: '/problems/best-time-buy-sell-cooldown',          difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},
  { day: 48, label: '2D DP II',             problems: [
    { num: 518,  title: 'Coin Change II',                    path: '/problems/coin-change-ii',                         difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 494,  title: 'Target Sum',                        path: '/problems/target-sum',                             difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 97,   title: 'Interleaving String',               path: '/problems/interleaving-string',                    difficulty: 'Medium', category: 'Dynamic Programming' },
  ]},
  { day: 49, label: '2D DP III',            problems: [
    { num: 329,  title: 'Longest Increasing Path in a Matrix', path: '/problems/longest-increasing-path-matrix',       difficulty: 'Hard',   category: 'Dynamic Programming' },
    { num: 115,  title: 'Distinct Subsequences',             path: '/problems/distinct-subsequences',                  difficulty: 'Hard',   category: 'Dynamic Programming' },
  ]},
  { day: 50, label: '2D DP IV',             problems: [
    { num: 72,   title: 'Edit Distance',                     path: '/problems/edit-distance',                          difficulty: 'Medium', category: 'Dynamic Programming' },
    { num: 312,  title: 'Burst Balloons',                    path: '/problems/burst-balloons',                         difficulty: 'Hard',   category: 'Dynamic Programming' },
    { num: 10,   title: 'Regular Expression Matching',       path: '/problems/regular-expression-matching',            difficulty: 'Hard',   category: 'Dynamic Programming' },
  ]},

  // ── Greedy ────────────────────────────────────────────────────────────────
  { day: 51, label: 'Greedy I',             problems: [
    { num: 53,   title: 'Maximum Subarray',                  path: '/problems/maximum-subarray',                       difficulty: 'Medium', category: 'Greedy' },
    { num: 55,   title: 'Jump Game',                         path: '/problems/jump-game',                              difficulty: 'Medium', category: 'Greedy' },
    { num: 45,   title: 'Jump Game II',                      path: '/problems/jump-game-ii',                           difficulty: 'Medium', category: 'Greedy' },
  ]},
  { day: 52, label: 'Greedy II',            problems: [
    { num: 134,  title: 'Gas Station',                       path: '/problems/gas-station',                            difficulty: 'Medium', category: 'Greedy' },
    { num: 846,  title: 'Hand of Straights',                 path: '/problems/hand-of-straights',                      difficulty: 'Medium', category: 'Greedy' },
    { num: 1899, title: 'Merge Triplets to Form Target Triplet', path: '/problems/merge-triplets-form-target-triplet', difficulty: 'Medium', category: 'Greedy' },
  ]},
  { day: 53, label: 'Greedy III',           problems: [
    { num: 763,  title: 'Partition Labels',                  path: '/problems/partition-labels',                       difficulty: 'Medium', category: 'Greedy' },
    { num: 678,  title: 'Valid Parenthesis String',          path: '/problems/valid-parenthesis-string',               difficulty: 'Medium', category: 'Greedy' },
  ]},

  // ── Intervals ─────────────────────────────────────────────────────────────
  { day: 54, label: 'Intervals I',          problems: [
    { num: 57,   title: 'Insert Interval',                   path: '/problems/insert-interval',                        difficulty: 'Medium', category: 'Interval' },
    { num: 56,   title: 'Merge Intervals',                   path: '/problems/merge-intervals',                        difficulty: 'Medium', category: 'Interval' },
    { num: 435,  title: 'Non Overlapping Intervals',         path: '/problems/non-overlapping-intervals',              difficulty: 'Medium', category: 'Interval' },
  ]},
  { day: 55, label: 'Intervals II',         problems: [
    { num: 252,  title: 'Meeting Rooms',                     path: '/problems/meeting-rooms',                          difficulty: 'Easy',   category: 'Interval' },
    { num: 253,  title: 'Meeting Rooms II',                  path: '/problems/meeting-rooms-ii',                       difficulty: 'Medium', category: 'Interval' },
    { num: 1851, title: 'Minimum Interval to Include Each Query', path: '/problems/minimum-interval-include-each-query', difficulty: 'Hard', category: 'Interval' },
  ]},

  // ── Math & Geometry ───────────────────────────────────────────────────────
  { day: 56, label: 'Math & Geometry I',    problems: [
    { num: 48,   title: 'Rotate Image',                      path: '/problems/rotate-image',                           difficulty: 'Medium', category: 'Math & Geometry' },
    { num: 54,   title: 'Spiral Matrix',                     path: '/problems/spiral-matrix',                          difficulty: 'Medium', category: 'Math & Geometry' },
    { num: 73,   title: 'Set Matrix Zeroes',                 path: '/problems/set-matrix-zeroes',                      difficulty: 'Medium', category: 'Math & Geometry' },
  ]},
  { day: 57, label: 'Math & Geometry II',   problems: [
    { num: 202,  title: 'Happy Number',                      path: '/problems/happy-number',                           difficulty: 'Easy',   category: 'Math & Geometry' },
    { num: 66,   title: 'Plus One',                          path: '/problems/plus-one',                               difficulty: 'Easy',   category: 'Math & Geometry' },
    { num: 50,   title: 'Pow(x, n)',                         path: '/problems/powx-n',                                 difficulty: 'Medium', category: 'Math & Geometry' },
  ]},
  { day: 58, label: 'Math & Geometry III',  problems: [
    { num: 43,   title: 'Multiply Strings',                  path: '/problems/multiply-strings',                       difficulty: 'Medium', category: 'Math & Geometry' },
    { num: 2013, title: 'Detect Squares',                    path: '/problems/detect-squares',                         difficulty: 'Medium', category: 'Math & Geometry' },
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
