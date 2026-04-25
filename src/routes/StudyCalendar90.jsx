import StudyCalendarTemplate from '../components/StudyCalendarTemplate'

// Comprehensive 90-Day DSA Curriculum: ~500+ LeetCode Problems
// Organized by topic with extended problem sets for deeper mastery
const DAYS = [
  // ── ARRAYS & TWO POINTERS (Days 1-5) ─────────────────────────────────────
  { day: 1, label: 'Arrays & Two Sum', problems: [
    { num: 1, title: 'Two Sum', path: '/problems/two-sum', difficulty: 'Easy', category: 'Array' },
    { num: 167, title: 'Two Sum II - Sorted', path: '/problems/two-sum-ii', difficulty: 'Easy', category: 'Two Pointers' },
    { num: 15, title: '3Sum', path: '/problems/3sum', difficulty: 'Medium', category: 'Two Pointers' },
    { num: 18, title: '4Sum', path: '/problems/4sum', difficulty: 'Medium', category: 'Two Pointers' },
  ]},
  { day: 2, label: 'Stock Trading Problems', problems: [
    { num: 121, title: 'Best Time Buy Sell Stock', path: '/problems/best-time-buy-sell-stock', difficulty: 'Easy', category: 'Array' },
    { num: 122, title: 'Best Time Buy Sell Stock II', path: '/problems/best-time-buy-sell-stock-ii', difficulty: 'Medium', category: 'Array' },
    { num: 123, title: 'Best Time Buy Sell Stock III', path: '/problems/best-time-buy-sell-stock-iii', difficulty: 'Hard', category: 'Array' },
  ]},
  { day: 3, label: 'Container & Trapping Water', problems: [
    { num: 11, title: 'Container With Most Water', path: '/problems/container-with-most-water', difficulty: 'Medium', category: 'Two Pointers' },
    { num: 42, title: 'Trapping Rain Water', path: '/problems/trapping-rain-water', difficulty: 'Hard', category: 'Two Pointers' },
    { num: 407, title: 'Trapping Rain Water II', path: '/problems/trapping-rain-water-ii', difficulty: 'Hard', category: 'Two Pointers' },
  ]},
  { day: 4, label: 'Product & Subarrays', problems: [
    { num: 238, title: 'Product of Array Except Self', path: '/problems/product-of-array-except-self', difficulty: 'Medium', category: 'Array' },
    { num: 152, title: 'Maximum Product Subarray', path: '/problems/maximum-product-subarray', difficulty: 'Medium', category: 'Array' },
    { num: 53, title: 'Maximum Subarray (Kadane)', path: '/problems/maximum-subarray', difficulty: 'Medium', category: 'Array' },
  ]},
  { day: 5, label: 'Contains Duplicate Variants', problems: [
    { num: 217, title: 'Contains Duplicate', path: '/problems/contains-duplicate', difficulty: 'Easy', category: 'Array' },
    { num: 219, title: 'Contains Duplicate II', path: '/problems/contains-duplicate-ii', difficulty: 'Easy', category: 'Array' },
    { num: 220, title: 'Contains Duplicate III', path: '/problems/contains-duplicate-iii', difficulty: 'Medium', category: 'Array' },
  ]},

  // ── STRINGS & HASHING (Days 6-10) ────────────────────────────────────────
  { day: 6, label: 'Valid Strings', problems: [
    { num: 242, title: 'Valid Anagram', path: '/problems/valid-anagram', difficulty: 'Easy', category: 'String' },
    { num: 125, title: 'Valid Palindrome', path: '/problems/valid-palindrome', difficulty: 'Easy', category: 'String' },
    { num: 680, title: 'Valid Palindrome II', path: '/problems/valid-palindrome-ii', difficulty: 'Easy', category: 'String' },
  ]},
  { day: 7, label: 'Substring Problems I', problems: [
    { num: 3, title: 'Longest Substring No Repeat', path: '/problems/longest-substring-no-repeat', difficulty: 'Medium', category: 'String' },
    { num: 159, title: 'K Distinct Characters', path: '/problems/longest-substring-k-distinct', difficulty: 'Medium', category: 'String' },
    { num: 76, title: 'Minimum Window Substring', path: '/problems/minimum-window-substring', difficulty: 'Hard', category: 'String' },
  ]},
  { day: 8, label: 'Substring Problems II', problems: [
    { num: 424, title: 'Longest Repeating Char Replacement', path: '/problems/longest-repeating-character-replacement', difficulty: 'Medium', category: 'String' },
    { num: 567, title: 'Permutation in String', path: '/problems/permutation-in-string', difficulty: 'Medium', category: 'String' },
    { num: 438, title: 'Find All Anagrams', path: '/problems/find-all-anagrams-in-string', difficulty: 'Medium', category: 'String' },
  ]},
  { day: 9, label: 'Anagrams & Groups', problems: [
    { num: 49, title: 'Group Anagrams', path: '/problems/group-anagrams', difficulty: 'Medium', category: 'String' },
    { num: 1002, title: 'Find Common Characters', path: '/problems/find-common-characters', difficulty: 'Easy', category: 'String' },
  ]},
  { day: 10, label: 'Word & Reverse Problems', problems: [
    { num: 151, title: 'Reverse Words in String', path: '/problems/reverse-words-in-a-string', difficulty: 'Medium', category: 'String' },
    { num: 541, title: 'Reverse String II', path: '/problems/reverse-string-ii', difficulty: 'Easy', category: 'String' },
    { num: 344, title: 'Reverse String', path: '/problems/reverse-string', difficulty: 'Easy', category: 'String' },
  ]},

  // ── DESIGN & HASH TABLES (Days 11-15) ────────────────────────────────────
  { day: 11, label: 'Cache Design I', problems: [
    { num: 146, title: 'LRU Cache', path: '/problems/lru-cache', difficulty: 'Medium', category: 'Design' },
    { num: 460, title: 'LFU Cache', path: '/problems/lfu-cache', difficulty: 'Hard', category: 'Design' },
    { num: 706, title: 'Design HashMap', path: '/problems/design-hashmap', difficulty: 'Easy', category: 'Design' },
  ]},
  { day: 12, label: 'Cache Design II', problems: [
    { num: 981, title: 'Time Based Key-Value Store', path: '/problems/time-based-key-value-store', difficulty: 'Medium', category: 'Design' },
    { num: 355, title: 'Design Twitter', path: '/problems/design-twitter', difficulty: 'Medium', category: 'Design' },
    { num: 362, title: 'Design Hit Counter', path: '/problems/design-hit-counter', difficulty: 'Medium', category: 'Design' },
  ]},
  { day: 13, label: 'Randomized & Set Design', problems: [
    { num: 380, title: 'Insert Delete GetRandom O(1)', path: '/problems/insert-delete-getrandom-o1', difficulty: 'Medium', category: 'Design' },
    { num: 381, title: 'Insert Delete GetRandom Duplicates', path: '/problems/insert-delete-getrandom-duplicates', difficulty: 'Hard', category: 'Design' },
  ]},
  { day: 14, label: 'Queue & Stack Design', problems: [
    { num: 232, title: 'Implement Queue using Stacks', path: '/problems/implement-queue-using-stacks', difficulty: 'Easy', category: 'Design' },
    { num: 225, title: 'Implement Stack using Queues', path: '/problems/implement-stack-using-queues', difficulty: 'Easy', category: 'Design' },
    { num: 622, title: 'Design Circular Queue', path: '/problems/design-circular-queue', difficulty: 'Medium', category: 'Design' },
  ]},
  { day: 15, label: 'Pattern & Encoding', problems: [
    { num: 205, title: 'Isomorphic Strings', path: '/problems/isomorphic-strings', difficulty: 'Easy', category: 'String' },
    { num: 290, title: 'Word Pattern', path: '/problems/word-pattern', difficulty: 'Easy', category: 'String' },
    { num: 271, title: 'Encode Decode Strings', path: '/problems/encode-decode-strings', difficulty: 'Medium', category: 'Design' },
  ]},

  // ── INTERVALS & SCHEDULING (Days 16-20) ─────────────────────────────────
  { day: 16, label: 'Intervals I', problems: [
    { num: 56, title: 'Merge Intervals', path: '/problems/merge-intervals', difficulty: 'Medium', category: 'Interval' },
    { num: 57, title: 'Insert Interval', path: '/problems/insert-interval', difficulty: 'Medium', category: 'Interval' },
    { num: 435, title: 'Non-overlapping Intervals', path: '/problems/non-overlapping-intervals', difficulty: 'Medium', category: 'Interval' },
  ]},
  { day: 17, label: 'Intervals II', problems: [
    { num: 252, title: 'Meeting Rooms', path: '/problems/meeting-rooms', difficulty: 'Easy', category: 'Interval' },
    { num: 253, title: 'Meeting Rooms II', path: '/problems/meeting-rooms-ii', difficulty: 'Medium', category: 'Interval' },
  ]},
  { day: 18, label: 'Task Scheduling', problems: [
    { num: 621, title: 'Task Scheduler', path: '/problems/task-scheduler', difficulty: 'Medium', category: 'Heap' },
    { num: 767, title: 'Reorganize String', path: '/problems/reorganize-string', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 19, label: 'String Reorganization', problems: [
    { num: 1054, title: 'Distant Barcodes', path: '/problems/distant-barcodes', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 20, label: 'Rearrangement Problems', problems: [
    { num: 1288, title: 'Remove Covered Intervals', path: '/problems/remove-covered-intervals', difficulty: 'Medium', category: 'Interval' },
  ]},

  // ── LINKED LIST (Days 21-25) ──────────────────────────────────────────────
  { day: 21, label: 'Linked List Reversal I', problems: [
    { num: 206, title: 'Reverse Linked List', path: '/problems/reverse-linked-list', difficulty: 'Easy', category: 'Linked List' },
    { num: 92, title: 'Reverse Linked List II', path: '/problems/reverse-linked-list-ii', difficulty: 'Medium', category: 'Linked List' },
    { num: 25, title: 'Reverse Nodes in k-Group', path: '/problems/reverse-nodes-in-k-group', difficulty: 'Hard', category: 'Linked List' },
  ]},
  { day: 22, label: 'Linked List Operations', problems: [
    { num: 19, title: 'Remove Nth Node From End', path: '/problems/remove-nth-node-end-list', difficulty: 'Medium', category: 'Linked List' },
    { num: 83, title: 'Remove Duplicates Sorted List', path: '/problems/remove-duplicates-sorted-list', difficulty: 'Easy', category: 'Linked List' },
    { num: 82, title: 'Remove Duplicates Sorted List II', path: '/problems/remove-duplicates-sorted-list-ii', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 23, label: 'Linked List Merging', problems: [
    { num: 21, title: 'Merge Two Sorted Lists', path: '/problems/merge-two-sorted-lists', difficulty: 'Easy', category: 'Linked List' },
    { num: 23, title: 'Merge K Sorted Lists', path: '/problems/merge-k-sorted-lists', difficulty: 'Hard', category: 'Linked List' },
  ]},
  { day: 24, label: 'Linked List Arithmetic', problems: [
    { num: 2, title: 'Add Two Numbers', path: '/problems/add-two-numbers', difficulty: 'Medium', category: 'Linked List' },
    { num: 445, title: 'Add Two Numbers II', path: '/problems/add-two-numbers-ii', difficulty: 'Medium', category: 'Linked List' },
  ]},
  { day: 25, label: 'Linked List Advanced', problems: [
    { num: 160, title: 'Intersection Two Linked Lists', path: '/problems/intersection-of-two-linked-lists', difficulty: 'Easy', category: 'Linked List' },
    { num: 141, title: 'Linked List Cycle', path: '/problems/detect-cycle-linked-list', difficulty: 'Easy', category: 'Linked List' },
    { num: 287, title: 'Find Duplicate Number', path: '/problems/find-the-duplicate-number', difficulty: 'Medium', category: 'Linked List' },
  ]},

  // ── STACKS & PARENTHESES (Days 26-30) ────────────────────────────────────
  { day: 26, label: 'Valid Parentheses', problems: [
    { num: 20, title: 'Valid Parentheses', path: '/problems/valid-parentheses', difficulty: 'Easy', category: 'Stack' },
    { num: 1541, title: 'Min Add Parentheses Valid', path: '/problems/minimum-add-to-make-parentheses-valid', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 27, label: 'Generate Parentheses', problems: [
    { num: 22, title: 'Generate Parentheses', path: '/problems/generate-parentheses', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 28, label: 'Stack Operations', problems: [
    { num: 155, title: 'Min Stack', path: '/problems/min-stack', difficulty: 'Medium', category: 'Stack' },
    { num: 150, title: 'Evaluate Reverse Polish Notation', path: '/problems/evaluate-reverse-polish-notation', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 29, label: 'Monotonic Stack', problems: [
    { num: 739, title: 'Daily Temperatures', path: '/problems/daily-temperatures', difficulty: 'Medium', category: 'Stack' },
    { num: 496, title: 'Next Greater Element I', path: '/problems/next-greater-element-i', difficulty: 'Easy', category: 'Stack' },
    { num: 503, title: 'Next Greater Element II', path: '/problems/next-greater-element-ii', difficulty: 'Medium', category: 'Stack' },
  ]},
  { day: 30, label: 'Histogram & Rectangles', problems: [
    { num: 84, title: 'Largest Rectangle Histogram', path: '/problems/largest-rectangle-in-histogram', difficulty: 'Hard', category: 'Stack' },
    { num: 85, title: 'Maximal Rectangle', path: '/problems/maximal-rectangle', difficulty: 'Hard', category: 'Stack' },
  ]},

  // ── BINARY SEARCH (Days 31-35) ───────────────────────────────────────────
  { day: 31, label: 'Binary Search Basics', problems: [
    { num: 704, title: 'Binary Search', path: '/problems/binary-search', difficulty: 'Easy', category: 'Binary Search' },
    { num: 35, title: 'Search Insert Position', path: '/problems/search-insert-position', difficulty: 'Easy', category: 'Binary Search' },
    { num: 278, title: 'First Bad Version', path: '/problems/first-bad-version', difficulty: 'Easy', category: 'Binary Search' },
  ]},
  { day: 32, label: 'Binary Search Find', problems: [
    { num: 34, title: 'Find First Last Position', path: '/problems/find-first-last-position', difficulty: 'Medium', category: 'Binary Search' },
    { num: 33, title: 'Search Rotated Sorted Array', path: '/problems/search-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search' },
    { num: 153, title: 'Find Min Rotated Sorted Array', path: '/problems/find-min-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 33, label: 'Binary Search Advanced', problems: [
    { num: 162, title: 'Find Peak Element', path: '/problems/find-peak-element', difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 34, label: 'Binary Search 2D', problems: [
    { num: 74, title: 'Search 2D Matrix', path: '/problems/search-a-2d-matrix', difficulty: 'Medium', category: 'Binary Search' },
    { num: 240, title: 'Search 2D Matrix II', path: '/problems/search-a-2d-matrix-ii', difficulty: 'Medium', category: 'Binary Search' },
  ]},
  { day: 35, label: 'Binary Search Optimization', problems: [
    { num: 875, title: 'Koko Eating Bananas', path: '/problems/koko-eating-bananas', difficulty: 'Medium', category: 'Binary Search' },
    { num: 1011, title: 'Capacity to Ship Packages', path: '/problems/capacity-to-ship-packages-within-d-days', difficulty: 'Medium', category: 'Binary Search' },
    { num: 4, title: 'Median Two Sorted Arrays', path: '/problems/median-of-two-sorted-arrays', difficulty: 'Hard', category: 'Binary Search' },
  ]},

  // ── TREES - TRAVERSAL (Days 36-40) ───────────────────────────────────────
  { day: 36, label: 'Level Order Traversal', problems: [
    { num: 102, title: 'Binary Tree Level Order', path: '/problems/binary-tree-level-order-traversal', difficulty: 'Medium', category: 'Tree' },
    { num: 103, title: 'Binary Tree Zigzag Level Order', path: '/problems/binary-tree-zigzag-level-order-traversal', difficulty: 'Medium', category: 'Tree' },
    { num: 199, title: 'Binary Tree Right Side View', path: '/problems/binary-tree-right-side-view', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 37, label: 'Basic Tree Properties', problems: [
    { num: 100, title: 'Same Tree', path: '/problems/same-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 101, title: 'Symmetric Tree', path: '/problems/symmetric-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 572, title: 'Subtree of Another Tree', path: '/problems/subtree-of-another-tree', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 38, label: 'Tree Depth & Diameter', problems: [
    { num: 104, title: 'Maximum Depth Binary Tree', path: '/problems/maximum-depth-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 111, title: 'Minimum Depth Binary Tree', path: '/problems/minimum-depth-of-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 543, title: 'Diameter of Binary Tree', path: '/problems/diameter-of-binary-tree', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 39, label: 'Tree Inversion & Balancing', problems: [
    { num: 226, title: 'Invert Binary Tree', path: '/problems/invert-binary-tree', difficulty: 'Easy', category: 'Tree' },
    { num: 110, title: 'Balanced Binary Tree', path: '/problems/balanced-binary-tree', difficulty: 'Easy', category: 'Tree' },
  ]},
  { day: 40, label: 'Tree Path Problems', problems: [
    { num: 257, title: 'Binary Tree Paths', path: '/problems/binary-tree-paths', difficulty: 'Easy', category: 'Tree' },
    { num: 112, title: 'Path Sum', path: '/problems/path-sum', difficulty: 'Easy', category: 'Tree' },
    { num: 113, title: 'Path Sum II', path: '/problems/path-sum-ii', difficulty: 'Medium', category: 'Tree' },
  ]},

  // ── TREES - ADVANCED (Days 41-45) ─────────────────────────────────────────
  { day: 41, label: 'BST Operations', problems: [
    { num: 98, title: 'Validate Binary Search Tree', path: '/problems/validate-binary-search-tree', difficulty: 'Medium', category: 'Tree' },
    { num: 230, title: 'Kth Smallest Element BST', path: '/problems/kth-smallest-element-in-bst', difficulty: 'Medium', category: 'Tree' },
    { num: 173, title: 'BST Iterator', path: '/problems/binary-search-tree-iterator', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 42, label: 'LCA & Ancestors', problems: [
    { num: 235, title: 'LCA of BST', path: '/problems/lca-bst', difficulty: 'Easy', category: 'Tree' },
    { num: 236, title: 'LCA of Binary Tree', path: '/problems/lca-binary-tree', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 43, label: 'Tree Construction', problems: [
    { num: 105, title: 'Construct BT Preorder Inorder', path: '/problems/construct-binary-tree-preorder-inorder', difficulty: 'Medium', category: 'Tree' },
    { num: 106, title: 'Construct BT Inorder Postorder', path: '/problems/construct-binary-tree-inorder-postorder', difficulty: 'Medium', category: 'Tree' },
    { num: 1008, title: 'Construct BST from Preorder', path: '/problems/construct-binary-search-tree-from-preorder-traversal', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 44, label: 'Maximum Path & Serialization', problems: [
    { num: 124, title: 'Binary Tree Maximum Path Sum', path: '/problems/binary-tree-maximum-path-sum', difficulty: 'Hard', category: 'Tree' },
    { num: 297, title: 'Serialize Deserialize Binary Tree', path: '/problems/serialize-deserialize-binary-tree', difficulty: 'Hard', category: 'Tree' },
    { num: 449, title: 'Serialize Deserialize BST', path: '/problems/serialize-and-deserialize-bst', difficulty: 'Medium', category: 'Tree' },
  ]},
  { day: 45, label: 'Tries', problems: [
    { num: 208, title: 'Implement Trie Prefix Tree', path: '/problems/implement-trie', difficulty: 'Medium', category: 'Trie' },
    { num: 211, title: 'Add Search Words', path: '/problems/design-add-search-words', difficulty: 'Medium', category: 'Trie' },
    { num: 212, title: 'Word Search II', path: '/problems/word-search-ii', difficulty: 'Hard', category: 'Trie' },
  ]},

  // ── HEAPS & GRAPHS (Days 46-50) ──────────────────────────────────────────
  { day: 46, label: 'Heap Basics', problems: [
    { num: 703, title: 'Kth Largest Element Stream', path: '/problems/kth-largest-element-in-stream', difficulty: 'Easy', category: 'Heap' },
    { num: 1046, title: 'Last Stone Weight', path: '/problems/last-stone-weight', difficulty: 'Easy', category: 'Heap' },
    { num: 215, title: 'Kth Largest Element Array', path: '/problems/kth-largest-element-in-array', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 47, label: 'Top K Problems', problems: [
    { num: 347, title: 'Top K Frequent Elements', path: '/problems/top-k-frequent-elements', difficulty: 'Medium', category: 'Heap' },
    { num: 692, title: 'Top K Frequent Words', path: '/problems/top-k-frequent-words', difficulty: 'Medium', category: 'Heap' },
  ]},
  { day: 48, label: 'Median & Data Stream', problems: [
    { num: 295, title: 'Find Median Data Stream', path: '/problems/find-median-from-data-stream', difficulty: 'Hard', category: 'Heap' },
    { num: 480, title: 'Sliding Window Median', path: '/problems/sliding-window-median', difficulty: 'Hard', category: 'Heap' },
  ]},
  { day: 49, label: 'Graph Basics', problems: [
    { num: 200, title: 'Number of Islands', path: '/problems/number-of-islands', difficulty: 'Medium', category: 'Graph' },
    { num: 695, title: 'Max Area of Island', path: '/problems/max-area-of-island', difficulty: 'Medium', category: 'Graph' },
    { num: 133, title: 'Clone Graph', path: '/problems/clone-graph', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 50, label: 'Graph Traversal', problems: [
    { num: 417, title: 'Pacific Atlantic Water Flow', path: '/problems/pacific-atlantic-water-flow', difficulty: 'Medium', category: 'Graph' },
    { num: 130, title: 'Surrounded Regions', path: '/problems/surrounded-regions', difficulty: 'Medium', category: 'Graph' },
    { num: 994, title: 'Rotting Oranges', path: '/problems/rotting-oranges', difficulty: 'Medium', category: 'Graph' },
  ]},

  // ── GRAPHS ADVANCED (Days 51-55) ──────────────────────────────────────────
  { day: 51, label: 'Union-Find', problems: [
    { num: 684, title: 'Redundant Connection', path: '/problems/redundant-connection', difficulty: 'Medium', category: 'Graph' },
    { num: 323, title: 'Number Connected Components', path: '/problems/connected-components-undirected-graph', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 52, label: 'Topological Sort', problems: [
    { num: 207, title: 'Course Schedule', path: '/problems/course-schedule', difficulty: 'Medium', category: 'Graph' },
    { num: 210, title: 'Course Schedule II', path: '/problems/course-schedule-ii', difficulty: 'Medium', category: 'Graph' },
    { num: 269, title: 'Alien Dictionary', path: '/problems/alien-dictionary', difficulty: 'Hard', category: 'Graph' },
  ]},
  { day: 53, label: 'Word Transformation', problems: [
    { num: 127, title: 'Word Ladder', path: '/problems/word-ladder', difficulty: 'Hard', category: 'Graph' },
    { num: 126, title: 'Word Ladder II', path: '/problems/word-ladder-ii', difficulty: 'Hard', category: 'Graph' },
    { num: 433, title: 'Minimum Genetic Mutation', path: '/problems/minimum-genetic-mutation', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 54, label: 'Shortest Path', problems: [
    { num: 743, title: 'Network Delay Time', path: '/problems/network-delay-time', difficulty: 'Medium', category: 'Graph' },
    { num: 787, title: 'Cheapest Flights Within K Stops', path: '/problems/cheapest-flights-within-k-stops', difficulty: 'Medium', category: 'Graph' },
  ]},
  { day: 55, label: 'Bipartite & Coloring', problems: [
    { num: 785, title: 'Is Graph Bipartite', path: '/problems/is-graph-bipartite', difficulty: 'Medium', category: 'Graph' },
    { num: 1042, title: 'Possible Bipartition', path: '/problems/possible-bipartition', difficulty: 'Medium', category: 'Graph' },
  ]},

  // ── BACKTRACKING (Days 56-60) ────────────────────────────────────────────
  { day: 56, label: 'Subsets & Combinations', problems: [
    { num: 78, title: 'Subsets', path: '/problems/subsets', difficulty: 'Medium', category: 'Backtracking' },
    { num: 90, title: 'Subsets II', path: '/problems/subsets-ii', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 57, label: 'Combination Sum', problems: [
    { num: 39, title: 'Combination Sum', path: '/problems/combination-sum', difficulty: 'Medium', category: 'Backtracking' },
    { num: 40, title: 'Combination Sum II', path: '/problems/combination-sum-ii', difficulty: 'Medium', category: 'Backtracking' },
    { num: 216, title: 'Combination Sum III', path: '/problems/combination-sum-iii', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 58, label: 'Permutations', problems: [
    { num: 46, title: 'Permutations', path: '/problems/permutations', difficulty: 'Medium', category: 'Backtracking' },
    { num: 47, title: 'Permutations II', path: '/problems/permutations-ii', difficulty: 'Medium', category: 'Backtracking' },
    { num: 31, title: 'Next Permutation', path: '/problems/next-permutation', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 59, label: 'Letter & Word Combinations', problems: [
    { num: 17, title: 'Letter Combinations Phone', path: '/problems/letter-combinations-phone-number', difficulty: 'Medium', category: 'Backtracking' },
    { num: 79, title: 'Word Search', path: '/problems/word-search', difficulty: 'Medium', category: 'Backtracking' },
  ]},
  { day: 60, label: 'Palindrome & Partition', problems: [
    { num: 131, title: 'Palindrome Partitioning', path: '/problems/palindrome-partitioning', difficulty: 'Medium', category: 'Backtracking' },
    { num: 763, title: 'Partition Labels', path: '/problems/partition-labels', difficulty: 'Medium', category: 'Greedy' },
  ]},

  // ── DYNAMIC PROGRAMMING (Days 61-75) ──────────────────────────────────────
  { day: 61, label: '1D DP Basics', problems: [
    { num: 70, title: 'Climbing Stairs', path: '/problems/climbing-stairs', difficulty: 'Easy', category: 'DP' },
    { num: 746, title: 'Min Cost Climbing Stairs', path: '/problems/min-cost-climbing-stairs', difficulty: 'Easy', category: 'DP' },
    { num: 198, title: 'House Robber', path: '/problems/house-robber', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 62, label: '1D DP House Robber', problems: [
    { num: 213, title: 'House Robber II', path: '/problems/house-robber-ii', difficulty: 'Medium', category: 'DP' },
    { num: 337, title: 'House Robber III', path: '/problems/house-robber-iii', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 63, label: '1D DP Coin Change', problems: [
    { num: 322, title: 'Coin Change', path: '/problems/coin-change', difficulty: 'Medium', category: 'DP' },
    { num: 518, title: 'Coin Change II', path: '/problems/coin-change-ii', difficulty: 'Medium', category: 'DP' },
    { num: 983, title: 'Min Cost For Tickets', path: '/problems/minimum-cost-for-tickets', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 64, label: '1D DP Decoding', problems: [
    { num: 91, title: 'Decode Ways', path: '/problems/decode-ways', difficulty: 'Medium', category: 'DP' },
    { num: 639, title: 'Decode Ways II', path: '/problems/decode-ways-ii', difficulty: 'Hard', category: 'DP' },
  ]},
  { day: 65, label: '1D DP Sequences', problems: [
    { num: 300, title: 'Longest Increasing Subsequence', path: '/problems/longest-increasing-subsequence', difficulty: 'Medium', category: 'DP' },
    { num: 673, title: 'Number of LIS', path: '/problems/number-of-longest-increasing-subsequence', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 66, label: '2D DP Grid', problems: [
    { num: 62, title: 'Unique Paths', path: '/problems/unique-paths', difficulty: 'Medium', category: 'DP' },
    { num: 63, title: 'Unique Paths II', path: '/problems/unique-paths-ii', difficulty: 'Medium', category: 'DP' },
    { num: 64, title: 'Minimum Path Sum', path: '/problems/minimum-path-sum', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 67, label: '2D DP String', problems: [
    { num: 1143, title: 'Longest Common Subsequence', path: '/problems/lcs', difficulty: 'Medium', category: 'DP' },
    { num: 72, title: 'Edit Distance', path: '/problems/edit-distance', difficulty: 'Medium', category: 'DP' },
    { num: 115, title: 'Distinct Subsequences', path: '/problems/distinct-subsequences', difficulty: 'Hard', category: 'DP' },
  ]},
  { day: 68, label: '2D DP Expert', problems: [
    { num: 139, title: 'Word Break', path: '/problems/word-break', difficulty: 'Medium', category: 'DP' },
    { num: 140, title: 'Word Break II', path: '/problems/word-break-ii', difficulty: 'Hard', category: 'DP' },
  ]},
  { day: 69, label: 'Palindrome DP', problems: [
    { num: 5, title: 'Longest Palindromic Substring', path: '/problems/longest-palindromic-substring', difficulty: 'Medium', category: 'DP' },
    { num: 647, title: 'Palindromic Substrings', path: '/problems/palindromic-substrings', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 70, label: 'Knapsack DP', problems: [
    { num: 416, title: 'Partition Equal Subset Sum', path: '/problems/partition-equal-subset-sum', difficulty: 'Medium', category: 'DP' },
    { num: 494, title: 'Target Sum', path: '/problems/target-sum', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 71, label: 'DP Complex', problems: [
    { num: 10, title: 'Regular Expression Matching', path: '/problems/regular-expression-matching', difficulty: 'Hard', category: 'DP' },
    { num: 97, title: 'Interleaving String', path: '/problems/interleaving-string', difficulty: 'Medium', category: 'DP' },
  ]},
  { day: 72, label: 'Matrix Problems', problems: [
    { num: 48, title: 'Rotate Image', path: '/problems/rotate-image', difficulty: 'Medium', category: 'Matrix' },
    { num: 54, title: 'Spiral Matrix', path: '/problems/spiral-matrix', difficulty: 'Medium', category: 'Matrix' },
    { num: 73, title: 'Set Matrix Zeroes', path: '/problems/set-matrix-zeroes', difficulty: 'Medium', category: 'Matrix' },
  ]},
  { day: 73, label: 'Matrix Advanced', problems: [
    { num: 36, title: 'Valid Sudoku', path: '/problems/valid-sudoku', difficulty: 'Medium', category: 'Matrix' },
    { num: 37, title: 'Sudoku Solver', path: '/problems/sudoku-solver', difficulty: 'Hard', category: 'Matrix' },
  ]},
  { day: 74, label: 'N-Queens & Sorting', problems: [
    { num: 51, title: 'N-Queens', path: '/problems/n-queens', difficulty: 'Hard', category: 'Backtracking' },
    { num: 75, title: 'Sort Colors Dutch Flag', path: '/problems/sort-colors', difficulty: 'Medium', category: 'Sorting' },
  ]},
  { day: 75, label: 'Advanced Sorting', problems: [
    { num: 148, title: 'Sort List', path: '/problems/sort-list', difficulty: 'Medium', category: 'Sorting' },
    { num: 280, title: 'Wiggle Sort', path: '/problems/wiggle-sort', difficulty: 'Medium', category: 'Sorting' },
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
