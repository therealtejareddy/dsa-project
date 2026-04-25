import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// Comprehensive 100-Day Curriculum with Revision Days: ~400 LeetCode Problems
// Organized by topic with strategic revision days interspersed for consolidation
const DAYS = [
  // ── ARRAYS & STRINGS (Days 1-9) ──────────────────────────────────────────
  { day: 1, label: 'Arrays I', problems: [
    { num: 1, title: 'Two Sum', path: '/problems/two-sum', difficulty: 'Easy', category: 'Array' },
    { num: 217, title: 'Contains Duplicate', path: '/problems/contains-duplicate', difficulty: 'Easy', category: 'Array' },
    { num: 242, title: 'Valid Anagram', path: '/problems/valid-anagram', difficulty: 'Easy', category: 'Array' },
    { num: 283, title: 'Move Zeroes', path: '/problems/move-zeroes', difficulty: 'Easy', category: 'Array' },
  ]},
  { day: 2, label: 'Arrays II', problems: [
    { num: 169, title: 'Majority Element', path: '/problems/majority-element', difficulty: 'Easy', category: 'Array' },
    { num: 26, title: 'Remove Duplicates from Sorted Array', path: '/problems/remove-duplicates-sorted-array', difficulty: 'Easy', category: 'Array' },
    { num: 121, title: 'Best Time to Buy and Sell Stock', path: '/problems/best-time-buy-sell-stock', difficulty: 'Easy', category: 'Array' },
    { num: 189, title: 'Rotate Array', path: '/problems/rotate-array', difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 3, label: 'Arrays III', problems: [
    { num: 238, title: 'Product of Array Except Self', path: '/problems/product-of-array-except-self', difficulty: 'Medium', category: 'Array' },
    { num: 122, title: 'Best Time to Buy and Sell Stock II', path: '/problems/best-time-buy-sell-stock-ii', difficulty: 'Medium', category: 'Array' },
    { num: 2484, title: 'Number of Zero-Filled Subarrays', path: '/problems/number-of-zero-filled-subarrays', difficulty: 'Medium', category: 'Array' },
    { num: 334, title: 'Increasing Triplet Subsequence', path: '/problems/increasing-triplet-subsequence', difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 4, label: 'Arrays IV', problems: [
    { num: 41, title: 'First Missing Positive', path: '/problems/first-missing-positive', difficulty: 'Hard', category: 'Array' },
    { num: 49, title: 'Group Anagrams', path: '/problems/group-anagrams', difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 5, label: 'Strings I', problems: [
    { num: 392, title: 'Is Subsequence', path: '/problems/is-subsequence', difficulty: 'Easy', category: 'String' },
    { num: 125, title: 'Valid Palindrome', path: '/problems/valid-palindrome', difficulty: 'Easy', category: 'String' },
    { num: 14, title: 'Longest Common Prefix', path: '/problems/longest-common-prefix', difficulty: 'Easy', category: 'String' },
  ]},
  { day: 6, label: 'Strings II', problems: [
    { num: 6, title: 'Zigzag Conversion', path: '/problems/zigzag-conversion', difficulty: 'Medium', category: 'String' },
    { num: 151, title: 'Reverse Words in a String', path: '/problems/reverse-words-in-a-string', difficulty: 'Medium', category: 'String' },
  ]},
  { day: 7, label: 'Bit Manipulation I', problems: [
    { num: 136, title: 'Single Number', path: '/problems/single-number', difficulty: 'Easy', category: 'Bit Manipulation' },
    { num: 191, title: 'Number of 1 Bits', path: '/problems/number-of-1-bits', difficulty: 'Easy', category: 'Bit Manipulation' },
    { num: 338, title: 'Counting Bits', path: '/problems/counting-bits', difficulty: 'Easy', category: 'Bit Manipulation' },
  ]},
  { day: 8, label: 'Bit Manipulation II', problems: [
    { num: 190, title: 'Reverse Bits', path: '/problems/reverse-bits', difficulty: 'Easy', category: 'Bit Manipulation' },
    { num: 201, title: 'Bitwise AND of Numbers Range', path: '/problems/bitwise-and-of-numbers-range', difficulty: 'Medium', category: 'Bit Manipulation' },
    { num: 260, title: 'Single Number III', path: '/problems/single-number-iii', difficulty: 'Medium', category: 'Bit Manipulation' },
    { num: 371, title: 'Sum of Two Integers', path: '/problems/sum-of-two-integers', difficulty: 'Medium', category: 'Bit Manipulation' },
  ]},

  // ── REVISION DAY 1 (Day 9) ───────────────────────────────────────────────
  { day: 9, label: '🔄 Revision: Arrays, Strings & Bit Ops', problems: [] },

  // ── HASH TABLES & DESIGN (Days 10-14) ────────────────────────────────────
  { day: 10, label: 'Hash Tables I', problems: [
    { num: 706, title: 'Design HashMap', path: '/problems/design-hashmap', difficulty: 'Easy', category: 'Hash Table' },
    { num: 1189, title: 'Maximum Number of Balloons', path: '/problems/maximum-number-of-balloons', difficulty: 'Easy', category: 'Hash Table' },
    { num: 1512, title: 'Number of Good Pairs', path: '/problems/number-of-good-pairs', difficulty: 'Easy', category: 'Hash Table' },
  ]},
  { day: 11, label: 'Hash Tables II', problems: [
    { num: 205, title: 'Isomorphic Strings', path: '/problems/isomorphic-strings', difficulty: 'Easy', category: 'Hash Table' },
    { num: 383, title: 'Ransom Note', path: '/problems/ransom-note', difficulty: 'Easy', category: 'Hash Table' },
    { num: 219, title: 'Contains Duplicate II', path: '/problems/contains-duplicate-ii', difficulty: 'Easy', category: 'Hash Table' },
  ]},
  { day: 12, label: 'Encoding & Design', problems: [
    { num: 271, title: 'Encode and Decode Strings', path: '/problems/encode-decode-strings', difficulty: 'Medium', category: 'Design' },
    { num: 1160, title: 'Find Words That Can Be Formed', path: '/problems/find-words-formed-by-characters', difficulty: 'Easy', category: 'Design' },
  ]},
  { day: 13, label: 'Data Structure Design', problems: [
    { num: 146, title: 'LRU Cache', path: '/problems/lru-cache', difficulty: 'Medium', category: 'Design' },
    { num: 380, title: 'Insert Delete GetRandom O(1)', path: '/problems/insert-delete-getrandom-o1', difficulty: 'Medium', category: 'Design' },
    { num: 981, title: 'Time Based Key-Value Store', path: '/problems/time-based-key-value-store', difficulty: 'Medium', category: 'Design' },
  ]},

  // ── REVISION DAY 2 (Day 14) ──────────────────────────────────────────────
  { day: 14, label: '🔄 Revision: Hash Tables & Design', problems: [] },

  // ── TWO POINTERS & PREFIX SUM (Days 15-21) ──────────────────────────────
  { day: 15, label: 'Two Pointers I', problems: [
    { num: 88, title: 'Merge Sorted Array', path: '/problems/merge-sorted-array', difficulty: 'Easy', category: 'Two Pointers' },
    { num: 167, title: 'Two Sum II - Input Array Is Sorted', path: '/problems/two-sum-ii', difficulty: 'Easy', category: 'Two Pointers' },
    { num: 11, title: 'Container With Most Water', path: '/problems/container-with-most-water', difficulty: 'Medium', category: 'Two Pointers' },
  ]},
  { day: 16, label: 'Two Pointers II', problems: [
    { num: 15, title: '3Sum', path: '/problems/3sum', difficulty: 'Medium', category: 'Two Pointers' },
    { num: 42, title: 'Trapping Rain Water', path: '/problems/trapping-rain-water', difficulty: 'Hard', category: 'Two Pointers' },
  ]},
  { day: 17, label: 'Prefix Sum I', problems: [
    { num: 303, title: 'Range Sum Query - Immutable', path: '/problems/range-sum-query-immutable', difficulty: 'Easy', category: 'Prefix Sum' },
    { num: 560, title: 'Subarray Sum Equals K', path: '/problems/subarray-sum-equals-k', difficulty: 'Medium', category: 'Prefix Sum' },
    { num: 974, title: 'Subarray Sums Divisible by K', path: '/problems/subarray-sums-divisible-by-k', difficulty: 'Medium', category: 'Prefix Sum' },
  ]},
  { day: 18, label: 'Prefix Sum II', problems: [
    { num: 523, title: 'Continuous Subarray Sum', path: '/problems/continuous-subarray-sum', difficulty: 'Medium', category: 'Prefix Sum' },
    { num: 525, title: 'Contiguous Array', path: '/problems/contiguous-array', difficulty: 'Medium', category: 'Prefix Sum' },
  ]},
  { day: 19, label: 'Sliding Window Fixed', problems: [
    { num: 643, title: 'Maximum Average Subarray I', path: '/problems/maximum-average-subarray-i', difficulty: 'Easy', category: 'Sliding Window' },
    { num: 438, title: 'Find All Anagrams in a String', path: '/problems/find-all-anagrams-in-string', difficulty: 'Medium', category: 'Sliding Window' },
    { num: 567, title: 'Permutation in String', path: '/problems/permutation-in-string', difficulty: 'Medium', category: 'Sliding Window' },
  ]},
  { day: 20, label: 'Sliding Window Dynamic', problems: [
    { num: 3, title: 'Longest Substring Without Repeating Characters', path: '/problems/longest-substring-no-repeat', difficulty: 'Medium', category: 'Sliding Window' },
    { num: 424, title: 'Longest Repeating Character Replacement', path: '/problems/longest-repeating-character-replacement', difficulty: 'Medium', category: 'Sliding Window' },
    { num: 76, title: 'Minimum Window Substring', path: '/problems/minimum-window-substring', difficulty: 'Hard', category: 'Sliding Window' },
  ]},

  // ── REVISION DAY 3 (Day 21) ──────────────────────────────────────────────
  { day: 21, label: '🔄 Revision: Two Pointers & Sliding Window', problems: [] },

  // ── KADANE'S & MATRIX (Days 22-25) ───────────────────────────────────────
  { day: 22, label: 'Kadane\'s Algorithm', problems: [
    { num: 53, title: 'Maximum Subarray', path: '/problems/maximum-subarray', difficulty: 'Medium', category: 'Array' },
    { num: 918, title: 'Maximum Sum Circular Subarray', path: '/problems/maximum-sum-circular-subarray', difficulty: 'Medium', category: 'Array' },
    { num: 152, title: 'Maximum Product Subarray', path: '/problems/maximum-product-subarray', difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 23, label: 'Matrix (2D Array) I', problems: [
    { num: 54, title: 'Spiral Matrix', path: '/problems/spiral-matrix', difficulty: 'Medium', category: 'Matrix' },
    { num: 48, title: 'Rotate Image', path: '/problems/rotate-image', difficulty: 'Medium', category: 'Matrix' },
    { num: 73, title: 'Set Matrix Zeroes', path: '/problems/set-matrix-zeroes', difficulty: 'Medium', category: 'Matrix' },
  ]},
  { day: 24, label: 'Matrix (2D Array) II', problems: [
    { num: 36, title: 'Valid Sudoku', path: '/problems/valid-sudoku', difficulty: 'Medium', category: 'Matrix' },
    { num: 289, title: 'Game of Life', path: '/problems/game-of-life', difficulty: 'Medium', category: 'Matrix' },
  ]},

  // ── REVISION DAY 4 (Day 25) ──────────────────────────────────────────────
  { day: 25, label: '🔄 Revision: Kadane & Matrix', problems: [] },

  // ── LINKED LIST (Days 26-34) ─────────────────────────────────────────────
  { day: 26, label: 'Linked List Basics', problems: [
    { num: 160, title: 'Intersection of Two Linked Lists', path: '/problems/intersection-of-two-linked-lists', difficulty: 'Easy', category: 'Linked List' },
    { num: 707, title: 'Design Linked List', path: '/problems/design-linked-list', difficulty: 'Medium', category: 'Linked List' },
    { num: 19, title: 'Remove Nth Node From End of List', path: '/problems/remove-nth-node-end-list', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 27, label: 'Linked List II', problems: [
    { num: 82, title: 'Remove Duplicates from Sorted List II', path: '/problems/remove-duplicates-sorted-list-ii', difficulty: 'Medium', category: 'Linked List' },
    { num: 24, title: 'Swap Nodes in Pairs', path: '/problems/swap-nodes-in-pairs', difficulty: 'Medium', category: 'Linked List' },
    { num: 138, title: 'Copy List with Random Pointer', path: '/problems/copy-list-with-random-pointer', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 28, label: 'Linked List III', problems: [
    { num: 86, title: 'Partition List', path: '/problems/partition-list', difficulty: 'Medium', category: 'Linked List' },
    { num: 61, title: 'Rotate List', path: '/problems/rotate-list', difficulty: 'Medium', category: 'Linked List' },
    { num: 2, title: 'Add Two Numbers', path: '/problems/add-two-numbers', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 29, label: 'Linked List Reversal I', problems: [
    { num: 206, title: 'Reverse Linked List', path: '/problems/reverse-linked-list', difficulty: 'Easy', category: 'Linked List' },
    { num: 92, title: 'Reverse Linked List II', path: '/problems/reverse-linked-list-ii', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 30, label: 'Linked List Reversal II', problems: [
    { num: 25, title: 'Reverse Nodes in k-Group', path: '/problems/reverse-nodes-in-k-group', difficulty: 'Hard', category: 'Linked List' },
    { num: 234, title: 'Palindrome Linked List', path: '/problems/palindrome-linked-list', difficulty: 'Easy', category: 'Linked List' },
  ]},
  { day: 31, label: 'Fast & Slow Pointers', problems: [
    { num: 876, title: 'Middle of the Linked List', path: '/problems/middle-of-the-linked-list', difficulty: 'Easy', category: 'Linked List' },
    { num: 202, title: 'Happy Number', path: '/problems/happy-number', difficulty: 'Easy', category: 'Math' },
    { num: 141, title: 'Linked List Cycle II', path: '/problems/linked-list-cycle-ii', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 32, label: 'Linked List Advanced', problems: [
    { num: 23, title: 'Merge K Sorted Lists', path: '/problems/merge-k-sorted-lists', difficulty: 'Hard', category: 'Linked List' },
    { num: 25, title: 'Reverse Nodes in k-Group', path: '/problems/reverse-nodes-in-k-group', difficulty: 'Hard', category: 'Linked List' },
  ]},
  { day: 33, label: 'Linked List Flatten', problems: [
    { num: 430, title: 'Flatten a Multilevel Doubly Linked List', path: '/problems/flatten-multilevel-linked-list', difficulty: 'Medium', category: 'Linked List' },
    { num: 445, title: 'Add Two Numbers II', path: '/problems/add-two-numbers-ii', difficulty: 'Medium', category: 'Linked List' },
  ]},

  // ── REVISION DAY 5 (Day 34) ──────────────────────────────────────────────
  { day: 34, label: '🔄 Revision: Linked Lists', problems: [] },

  // ── STACKS & QUEUES (Days 35-41) ─────────────────────────────────────────
  { day: 35, label: 'Stack Basics', problems: [
    { num: 20, title: 'Valid Parentheses', path: '/problems/valid-parentheses', difficulty: 'Easy', category: 'Stack' },
    { num: 1544, title: 'Make The String Great', path: '/problems/make-the-string-great', difficulty: 'Easy', category: 'Stack' },
    { num: 844, title: 'Backspace String Compare', path: '/problems/backspace-string-compare', difficulty: 'Easy', category: 'Stack' },
  ]},
  { day: 36, label: 'Stack Design', problems: [
    { num: 155, title: 'Min Stack', path: '/problems/min-stack', difficulty: 'Medium', category: 'Stack' },
    { num: 150, title: 'Evaluate Reverse Polish Notation', path: '/problems/evaluate-reverse-polish-notation', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 37, label: 'Monotonic Stack I', problems: [
    { num: 496, title: 'Next Greater Element I', path: '/problems/next-greater-element-i', difficulty: 'Easy', category: 'Stack' },
    { num: 739, title: 'Daily Temperatures', path: '/problems/daily-temperatures', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 38, label: 'Monotonic Stack II', problems: [
    { num: 901, title: 'Online Stock Span', path: '/problems/online-stock-span', difficulty: 'Medium', category: 'Stack' },
    { num: 84, title: 'Largest Rectangle in Histogram', path: '/problems/largest-rectangle-in-histogram', difficulty: 'Hard', category: 'Stack' },
  ]},
  { day: 39, label: 'Monotonic Queue', problems: [
    { num: 239, title: 'Sliding Window Maximum', path: '/problems/sliding-window-maximum', difficulty: 'Hard', category: 'Stack' },
    { num: 1438, title: 'Longest Continuous Subarray', path: '/problems/longest-continuous-subarray', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 40, label: 'Queues & Stack Design', problems: [
    { num: 933, title: 'Number of Recent Calls', path: '/problems/number-of-recent-calls', difficulty: 'Easy', category: 'Queue' },
    { num: 232, title: 'Implement Queue using Stacks', path: '/problems/implement-queue-using-stacks', difficulty: 'Easy', category: 'Stack' },
    { num: 225, title: 'Implement Stack using Queues', path: '/problems/implement-stack-using-queues', difficulty: 'Easy', category: 'Stack' },
  ]},

  // ── REVISION DAY 6 (Day 41) ──────────────────────────────────────────────
  { day: 41, label: '🔄 Revision: Stacks & Queues', problems: [] },

  // ── RECURSION & SORTING (Days 42-45) ─────────────────────────────────────
  { day: 42, label: 'Recursion & Divide & Conquer', problems: [
    { num: 21, title: 'Merge Two Sorted Lists', path: '/problems/merge-two-sorted-lists', difficulty: 'Easy', category: 'Recursion' },
    { num: 50, title: 'Pow(x, n)', path: '/problems/powx-n', difficulty: 'Medium', category: 'Recursion' },
    { num: 394, title: 'Decode String', path: '/problems/decode-string', difficulty: 'Medium', category: 'Recursion' },
  ]},
  { day: 43, label: 'Merge Sort & QuickSelect', problems: [
    { num: 148, title: 'Sort List', path: '/problems/sort-list', difficulty: 'Medium', category: 'Sorting' },
    { num: 75, title: 'Sort Colors', path: '/problems/sort-colors', difficulty: 'Medium', category: 'Sorting' },
    { num: 215, title: 'Kth Largest Element in an Array', path: '/problems/kth-largest-element-in-array', difficulty: 'Medium', category: 'Sorting' },
  ]},
  { day: 44, label: 'Bucket Sort & Counting', problems: [
    { num: 347, title: 'Top K Frequent Elements', path: '/problems/top-k-frequent-elements', difficulty: 'Medium', category: 'Sorting' },
  ]},

  // ── REVISION DAY 7 (Day 45) ──────────────────────────────────────────────
  { day: 45, label: '🔄 Revision: Recursion & Sorting', problems: [] },

  // ── BINARY SEARCH (Days 46-50) ───────────────────────────────────────────
  { day: 46, label: 'Binary Search I', problems: [
    { num: 704, title: 'Binary Search', path: '/problems/binary-search', difficulty: 'Easy', category: 'Binary Search' },
    { num: 35, title: 'Search Insert Position', path: '/problems/search-insert-position', difficulty: 'Easy', category: 'Binary Search' },
    { num: 278, title: 'First Bad Version', path: '/problems/first-bad-version', difficulty: 'Easy', category: 'Binary Search' },
  ]},
  { day: 47, label: 'Binary Search II', problems: [
    { num: 34, title: 'Find First and Last Position of Element', path: '/problems/find-first-last-position', difficulty: 'Medium', category: 'Binary Search' },
    { num: 33, title: 'Search in Rotated Sorted Array', path: '/problems/search-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search' },
    { num: 153, title: 'Find Minimum in Rotated Sorted Array', path: '/problems/find-min-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 48, label: 'Binary Search III', problems: [
    { num: 162, title: 'Find Peak Element', path: '/problems/find-peak-element', difficulty: 'Medium', category: 'Binary Search' },
    { num: 74, title: 'Search a 2D Matrix', path: '/problems/search-a-2d-matrix', difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 49, label: 'Binary Search IV', problems: [
    { num: 875, title: 'Koko Eating Bananas', path: '/problems/koko-eating-bananas', difficulty: 'Medium', category: 'Binary Search' },
    { num: 4, title: 'Median of Two Sorted Arrays', path: '/problems/median-of-two-sorted-arrays', difficulty: 'Hard', category: 'Binary Search' },
  ]},

  // ── REVISION DAY 8 (Day 50) ──────────────────────────────────────────────
  { day: 50, label: '🔄 Revision: Binary Search', problems: [] },

  // ── BACKTRACKING (Days 51-55) ────────────────────────────────────────────
  { day: 51, label: 'Backtracking I', problems: [
    { num: 78, title: 'Subsets', path: '/problems/subsets', difficulty: 'Medium', category: 'Backtracking' },
    { num: 90, title: 'Subsets II', path: '/problems/subsets-ii', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 52, label: 'Backtracking II', problems: [
    { num: 39, title: 'Combination Sum', path: '/problems/combination-sum', difficulty: 'Medium', category: 'Backtracking' },
    { num: 40, title: 'Combination Sum II', path: '/problems/combination-sum-ii', difficulty: 'Medium', category: 'Backtracking' },
    { num: 216, title: 'Combination Sum III', path: '/problems/combination-sum-iii', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 53, label: 'Backtracking III', problems: [
    { num: 46, title: 'Permutations', path: '/problems/permutations', difficulty: 'Medium', category: 'Backtracking' },
    { num: 47, title: 'Permutations II', path: '/problems/permutations-ii', difficulty: 'Medium', category: 'Backtracking' },
    { num: 17, title: 'Letter Combinations of a Phone Number', path: '/problems/letter-combinations-phone-number', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 54, label: 'Backtracking IV', problems: [
    { num: 79, title: 'Word Search', path: '/problems/word-search', difficulty: 'Medium', category: 'Backtracking' },
    { num: 131, title: 'Palindrome Partitioning', path: '/problems/palindrome-partitioning', difficulty: 'Medium', category: 'Backtracking' },
    { num: 51, title: 'N-Queens', path: '/problems/n-queens', difficulty: 'Hard', category: 'Backtracking' },
  ]},

  // ── REVISION DAY 9 (Day 55) ──────────────────────────────────────────────
  { day: 55, label: '🔄 Revision: Backtracking', problems: [] },

  // ── TREES (Days 56-66) ───────────────────────────────────────────────────
  { day: 56, label: 'Trees - Level Order', problems: [
    { num: 102, title: 'Binary Tree Level Order Traversal', path: '/problems/binary-tree-level-order-traversal', difficulty: 'Medium', category: 'Tree' },
    { num: 199, title: 'Binary Tree Right Side View', path: '/problems/binary-tree-right-side-view', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 57, label: 'Trees - Pre Order', problems: [
    { num: 100, title: 'Same Tree', path: '/problems/same-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 101, title: 'Symmetric Tree', path: '/problems/symmetric-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 257, title: 'Binary Tree Paths', path: '/problems/binary-tree-paths', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 58, label: 'Trees - In Order', problems: [
    { num: 94, title: 'Binary Tree Inorder Traversal', path: '/problems/binary-tree-inorder-traversal', difficulty: 'Easy', category: 'Tree' },
    { num: 98, title: 'Validate Binary Search Tree', path: '/problems/validate-binary-search-tree', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 59, label: 'Trees - Post Order', problems: [
    { num: 145, title: 'Binary Tree Postorder Traversal', path: '/problems/binary-tree-postorder-traversal', difficulty: 'Easy', category: 'Tree' },
    { num: 226, title: 'Invert Binary Tree', path: '/problems/invert-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 543, title: 'Diameter of Binary Tree', path: '/problems/diameter-of-binary-tree', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 60, label: 'Trees - Basics', problems: [
    { num: 104, title: 'Maximum Depth of Binary Tree', path: '/problems/maximum-depth-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 110, title: 'Balanced Binary Tree', path: '/problems/balanced-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 572, title: 'Subtree of Another Tree', path: '/problems/subtree-of-another-tree', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 61, label: 'Trees - BST & LCA', problems: [
    { num: 230, title: 'Kth Smallest Element in a BST', path: '/problems/kth-smallest-element-in-bst', difficulty: 'Medium', category: 'Tree' },
    { num: 235, title: 'Lowest Common Ancestor of BST', path: '/problems/lca-bst', difficulty: 'Medium', category: 'Tree' },
    { num: 236, title: 'Lowest Common Ancestor of BT', path: '/problems/lca-binary-tree', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 62, label: 'Trees - Construction', problems: [
    { num: 105, title: 'Construct BT from Preorder and Inorder', path: '/problems/construct-binary-tree-preorder-inorder', difficulty: 'Medium', category: 'Tree' },
    { num: 106, title: 'Construct BT from Inorder and Postorder', path: '/problems/construct-binary-tree-inorder-postorder', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 63, label: 'Trees - Hard I', problems: [
    { num: 124, title: 'Binary Tree Maximum Path Sum', path: '/problems/binary-tree-maximum-path-sum', difficulty: 'Hard', category: 'Tree' },
    { num: 968, title: 'Binary Tree Cameras', path: '/problems/binary-tree-cameras', difficulty: 'Hard', category: 'Tree' },
  ]},
  { day: 64, label: 'Trees - Hard II', problems: [
    { num: 297, title: 'Serialize and Deserialize Binary Tree', path: '/problems/serialize-deserialize-binary-tree', difficulty: 'Hard', category: 'Tree' },
  ]},
  { day: 65, label: 'Tries I', problems: [
    { num: 208, title: 'Implement Trie (Prefix Tree)', path: '/problems/implement-trie', difficulty: 'Medium', category: 'Trie' },
    { num: 211, title: 'Design Add and Search Words', path: '/problems/design-add-search-words', difficulty: 'Medium', category: 'Trie' },
  ]},

  // ── REVISION DAY 10 (Day 66) ─────────────────────────────────────────────
  { day: 66, label: '🔄 Revision: Trees & Tries', problems: [] },

  // ── HEAPS & PRIORITY QUEUES (Days 67-72) ────────────────────────────────
  { day: 67, label: 'Heap I - Basics', problems: [
    { num: 703, title: 'Kth Largest Element in a Stream', path: '/problems/kth-largest-element-in-stream', difficulty: 'Easy', category: 'Heap' },
    { num: 1046, title: 'Last Stone Weight', path: '/problems/last-stone-weight', difficulty: 'Easy', category: 'Heap' },
  ]},
  { day: 68, label: 'Heap II - Top K', problems: [
    { num: 347, title: 'Top K Frequent Elements', path: '/problems/top-k-frequent-elements', difficulty: 'Medium', category: 'Heap' },
    { num: 973, title: 'K Closest Points to Origin', path: '/problems/k-closest-points-to-origin', difficulty: 'Medium', category: 'Heap' },
    { num: 215, title: 'Kth Largest Element in an Array', path: '/problems/kth-largest-element-in-array', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 69, label: 'Heap III - Two Heaps', problems: [
    { num: 295, title: 'Find Median from Data Stream', path: '/problems/find-median-from-data-stream', difficulty: 'Hard', category: 'Heap' },
    { num: 502, title: 'IPO', path: '/problems/ipo', difficulty: 'Hard', category: 'Heap' },
  ]},
  { day: 70, label: 'Heap IV - Design', problems: [
    { num: 621, title: 'Task Scheduler', path: '/problems/task-scheduler', difficulty: 'Medium', category: 'Heap' },
    { num: 355, title: 'Design Twitter', path: '/problems/design-twitter', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 71, label: 'Heap V - Merge', problems: [
    { num: 23, title: 'Merge K Sorted Lists', path: '/problems/merge-k-sorted-lists', difficulty: 'Hard', category: 'Heap' },
    { num: 632, title: 'Smallest Range Covering Elements', path: '/problems/smallest-range-covering-elements', difficulty: 'Hard', category: 'Heap' },
  ]},

  // ── REVISION DAY 11 (Day 72) ─────────────────────────────────────────────
  { day: 72, label: '🔄 Revision: Heaps & Priority Queues', problems: [] },

  // ── GRAPHS (Days 73-84) ──────────────────────────────────────────────────
  { day: 73, label: 'Graphs I - DFS/BFS', problems: [
    { num: 200, title: 'Number of Islands', path: '/problems/number-of-islands', difficulty: 'Medium', category: 'Graph' },
    { num: 133, title: 'Clone Graph', path: '/problems/clone-graph', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 74, label: 'Graphs II - Advanced DFS', problems: [
    { num: 417, title: 'Pacific Atlantic Water Flow', path: '/problems/pacific-atlantic-water-flow', difficulty: 'Medium', category: 'Graph' },
    { num: 130, title: 'Surrounded Regions', path: '/problems/surrounded-regions', difficulty: 'Medium', category: 'Graph' },
    { num: 994, title: 'Rotting Oranges', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 75, label: 'Graphs III - Union Find', problems: [
    { num: 684, title: 'Redundant Connection', path: '/problems/redundant-connection', difficulty: 'Medium', category: 'Graph' },
    { num: 323, title: 'Number of Connected Components', path: '/problems/connected-components-undirected-graph', difficulty: 'Medium', category: 'Graph' },
    { num: 261, title: 'Graph Valid Tree', path: '/problems/graph-valid-tree', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 76, label: 'Graphs IV - Topological', problems: [
    { num: 207, title: 'Course Schedule', path: '/problems/course-schedule', difficulty: 'Medium', category: 'Graph' },
    { num: 210, title: 'Course Schedule II', path: '/problems/course-schedule-ii', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 77, label: 'Graphs V - Shortest Path', problems: [
    { num: 743, title: 'Network Delay Time', path: '/problems/network-delay-time', difficulty: 'Medium', category: 'Graph' },
    { num: 1631, title: 'Path With Minimum Effort', path: '/problems/path-with-minimum-effort', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 78, label: 'Graphs VI - Advanced', problems: [
    { num: 778, title: 'Swim in Rising Water', path: '/problems/swim-in-rising-water', difficulty: 'Hard', category: 'Graph' },
    { num: 269, title: 'Alien Dictionary', path: '/problems/alien-dictionary', difficulty: 'Hard', category: 'Graph' },
  ]},
  { day: 79, label: 'Graphs VII - Eulerian', problems: [
    { num: 332, title: 'Reconstruct Itinerary', path: '/problems/reconstruct-itinerary', difficulty: 'Hard', category: 'Graph' },
    { num: 1584, title: 'Min Cost to Connect All Points', path: '/problems/min-cost-connect-all-points', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 80, label: 'Intervals & Greedy I', problems: [
    { num: 56, title: 'Merge Intervals', path: '/problems/merge-intervals', difficulty: 'Medium', category: 'Interval' },
    { num: 57, title: 'Insert Interval', path: '/problems/insert-interval', difficulty: 'Medium', category: 'Interval' },
  ]},
  { day: 81, label: 'Greedy II', problems: [
    { num: 55, title: 'Jump Game', path: '/problems/jump-game', difficulty: 'Medium', category: 'Greedy' },
    { num: 45, title: 'Jump Game II', path: '/problems/jump-game-ii', difficulty: 'Medium', category: 'Greedy' },
  ]},
  { day: 82, label: 'Greedy III', problems: [
    { num: 134, title: 'Gas Station', path: '/problems/gas-station', difficulty: 'Medium', category: 'Greedy' },
    { num: 435, title: 'Non Overlapping Intervals', path: '/problems/non-overlapping-intervals', difficulty: 'Medium', category: 'Greedy' },
  ]},
  { day: 83, label: 'Greedy IV', problems: [
    { num: 763, title: 'Partition Labels', path: '/problems/partition-labels', difficulty: 'Medium', category: 'Greedy' },
    { num: 678, title: 'Valid Parenthesis String', path: '/problems/valid-parenthesis-string', difficulty: 'Medium', category: 'Greedy' },
  ]},

  // ── REVISION DAY 12 (Day 84) ─────────────────────────────────────────────
  { day: 84, label: '🔄 Revision: Graphs, Intervals & Greedy', problems: [] },

  // ── DYNAMIC PROGRAMMING (Days 85-96) ────────────────────────────────────
  { day: 85, label: '1D DP I', problems: [
    { num: 70, title: 'Climbing Stairs', path: '/problems/climbing-stairs', difficulty: 'Easy', category: 'DP' },
    { num: 198, title: 'House Robber', path: '/problems/house-robber', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 86, label: '1D DP II - Knapsack', problems: [
    { num: 416, title: 'Partition Equal Subset Sum', path: '/problems/partition-equal-subset-sum', difficulty: 'Medium', category: 'DP' },
    { num: 494, title: 'Target Sum', path: '/problems/target-sum', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 87, label: '1D DP III - Unbounded', problems: [
    { num: 322, title: 'Coin Change', path: '/problems/coin-change', difficulty: 'Medium', category: 'DP' },
    { num: 518, title: 'Coin Change II', path: '/problems/coin-change-ii', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 88, label: '1D DP IV - LIS', problems: [
    { num: 300, title: 'Longest Increasing Subsequence', path: '/problems/longest-increasing-subsequence', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 89, label: '2D DP I - Grid', problems: [
    { num: 62, title: 'Unique Paths', path: '/problems/unique-paths', difficulty: 'Medium', category: 'DP' },
    { num: 64, title: 'Minimum Path Sum', path: '/problems/minimum-path-sum', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 90, label: '2D DP II - String', problems: [
    { num: 1143, title: 'Longest Common Subsequence', path: '/problems/lcs', difficulty: 'Medium', category: 'DP' },
    { num: 72, title: 'Edit Distance', path: '/problems/edit-distance', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 91, label: '2D DP III - Hard', problems: [
    { num: 97, title: 'Interleaving String', path: '/problems/interleaving-string', difficulty: 'Medium', category: 'DP' },
    { num: 115, title: 'Distinct Subsequences', path: '/problems/distinct-subsequences', difficulty: 'Hard', category: 'DP' },
  ]},
  { day: 92, label: '2D DP IV - Expert', problems: [
    { num: 174, title: 'Dungeon Game', path: '/problems/dungeon-game', difficulty: 'Hard', category: 'DP' },
    { num: 10, title: 'Regular Expression Matching', path: '/problems/regular-expression-matching', difficulty: 'Hard', category: 'DP' },
  ]},
  { day: 93, label: 'String DP & Tree DP', problems: [
    { num: 5, title: 'Longest Palindromic Substring', path: '/problems/longest-palindromic-substring', difficulty: 'Medium', category: 'DP' },
    { num: 139, title: 'Word Break', path: '/problems/word-break', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 94, label: 'Math & Geometry I', problems: [
    { num: 9, title: 'Palindrome Number', path: '/problems/palindrome-number', difficulty: 'Easy', category: 'Math' },
    { num: 7, title: 'Reverse Integer', path: '/problems/reverse-integer', difficulty: 'Medium', category: 'Math' },
  ]},
  { day: 95, label: 'Math & Geometry II', problems: [
    { num: 66, title: 'Plus One', path: '/problems/plus-one', difficulty: 'Easy', category: 'Math' },
    { num: 2013, title: 'Detect Squares', path: '/problems/detect-squares', difficulty: 'Medium', category: 'Math' },
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
