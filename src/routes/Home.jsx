import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const PROBLEMS = [
  // Array
  { path: '/problems/two-sum', num: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'], category: 'Array' },
  { path: '/problems/best-time-buy-sell-stock', num: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Greedy'], category: 'Array' },
  { path: '/problems/contains-duplicate', num: 217, title: 'Contains Duplicate', difficulty: 'Easy', tags: ['Array', 'Hash Map'], category: 'Array' },
  { path: '/problems/product-of-array-except-self', num: 238, title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['Array'], category: 'Array' },
  { path: '/problems/maximum-subarray', num: 53, title: 'Maximum Subarray', difficulty: 'Medium', tags: ['Array', 'DP', 'Greedy'], category: 'Array' },
  { path: '/problems/maximum-product-subarray', num: 152, title: 'Maximum Product Subarray', difficulty: 'Medium', tags: ['Array', 'DP'], category: 'Array' },
  { path: '/problems/search-rotated-sorted-array', num: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', tags: ['Array', 'Binary Search'], category: 'Array' },
  { path: '/problems/3sum', num: 15, title: '3Sum', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], category: 'Array' },
  { path: '/problems/container-with-most-water', num: 11, title: 'Container With Most Water', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], category: 'Array' },
  
  // Bit Manipulation
  { path: '/problems/sum-of-two-integers', num: 371, title: 'Sum of Two Integers', difficulty: 'Medium', tags: ['Bit Manipulation'], category: 'Bit Manipulation' },
  { path: '/problems/number-of-1-bits', num: 191, title: 'Number of 1 Bits', difficulty: 'Easy', tags: ['Bit Manipulation'], category: 'Bit Manipulation' },
  { path: '/problems/reverse-bits', num: 190, title: 'Reverse Bits', difficulty: 'Easy', tags: ['Bit Manipulation'], category: 'Bit Manipulation' },
  
  // Dynamic Programming
  { path: '/problems/climbing-stairs', num: 70, title: 'Climbing Stairs', difficulty: 'Easy', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/coin-change', num: 322, title: 'Coin Change', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/longest-increasing-subsequence', num: 300, title: 'Longest Increasing Subsequence', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/lcs', num: 1143, title: 'Longest Common Subsequence', difficulty: 'Medium', tags: ['DP', 'String'], category: 'Dynamic Programming' },
  { path: '/problems/word-break', num: 139, title: 'Word Break', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/combination-sum-iv', num: 377, title: 'Combination Sum IV', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/house-robber', num: 198, title: 'House Robber', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/house-robber-ii', num: 213, title: 'House Robber II', difficulty: 'Medium', tags: ['DP'], category: 'Dynamic Programming' },
  { path: '/problems/decode-ways', num: 91, title: 'Decode Ways', difficulty: 'Medium', tags: ['DP', 'String'], category: 'Dynamic Programming' },
  { path: '/problems/lcss', num: 718, title: 'Maximum Length of Repeated Subarray', difficulty: 'Medium', tags: ['DP', 'String'], category: 'Dynamic Programming' },
  { path: '/problems/counting-bits', num: 338, title: 'Counting Bits', difficulty: 'Easy', tags: ['DP', 'Bit Manipulation'], category: 'Dynamic Programming' },
  
  // Graph
  { path: '/problems/number-of-islands', num: 200, title: 'Number of Islands', difficulty: 'Medium', tags: ['Graph', 'DFS/BFS'], category: 'Graph' },
  { path: '/problems/alien-dictionary', num: 269, title: 'Alien Dictionary', difficulty: 'Hard', tags: ['Graph', 'Topological Sort'], category: 'Graph' },
  { path: '/problems/graph-valid-tree', num: 261, title: 'Graph Valid Tree', difficulty: 'Medium', tags: ['Graph', 'Union Find'], category: 'Graph' },
  { path: '/problems/connected-components-undirected-graph', num: 323, title: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', tags: ['Graph', 'Union Find', 'DFS/BFS'], category: 'Graph' },
  { path: '/problems/course-schedule', num: 207, title: 'Course Schedule', difficulty: 'Medium', tags: ['Graph', 'Topological Sort'], category: 'Graph' },
  { path: '/problems/course-schedule-ii', num: 210, title: 'Course Schedule II', difficulty: 'Medium', tags: ['Graph', 'Topological Sort'], category: 'Graph' },
  { path: '/problems/redundant-connection', num: 684, title: 'Redundant Connection', difficulty: 'Medium', tags: ['Graph', 'Union Find'], category: 'Graph' },
  { path: '/problems/word-ladder', num: 127, title: 'Word Ladder', difficulty: 'Hard', tags: ['Graph', 'BFS'], category: 'Graph' },
  { path: '/problems/clone-graph', num: 133, title: 'Clone Graph', difficulty: 'Medium', tags: ['Graph', 'DFS/BFS'], category: 'Graph' },
  { path: '/problems/evaluate-division', num: 399, title: 'Evaluate Division', difficulty: 'Medium', tags: ['Graph'], category: 'Graph' },
  { path: '/problems/accounts-merge', num: 721, title: 'Accounts Merge', difficulty: 'Medium', tags: ['Graph', 'Union Find'], category: 'Graph' },
  { path: '/problems/pacific-atlantic-water-flow', num: 417, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', tags: ['Graph', 'DFS/BFS'], category: 'Graph' },
  
  // Interval
  { path: '/problems/merge-intervals', num: 56, title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting', 'Greedy'], category: 'Interval' },
  { path: '/problems/insert-interval', num: 57, title: 'Insert Interval', difficulty: 'Hard', tags: ['Array', 'Interval'], category: 'Interval' },
  { path: '/problems/interval-list-intersections', num: 986, title: 'Interval List Intersections', difficulty: 'Medium', tags: ['Array', 'Interval'], category: 'Interval' },
  { path: '/problems/meeting-rooms', num: 252, title: 'Meeting Rooms', difficulty: 'Easy', tags: ['Array', 'Sorting'], category: 'Interval' },
  { path: '/problems/meeting-rooms-ii', num: 253, title: 'Meeting Rooms II', difficulty: 'Medium', tags: ['Array', 'Heap', 'Sorting'], category: 'Interval' },
  
  // Linked List
  { path: '/problems/reverse-linked-list', num: 206, title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List'], category: 'Linked List' },
  { path: '/problems/detect-cycle-linked-list', num: 141, title: 'Linked List Cycle', difficulty: 'Easy', tags: ['Linked List', 'Two Pointers'], category: 'Linked List' },
  { path: '/problems/merge-two-sorted-lists', num: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', tags: ['Linked List'], category: 'Linked List' },
  { path: '/problems/merge-k-sorted-lists', num: 23, title: 'Merge K Sorted Lists', difficulty: 'Hard', tags: ['Linked List', 'Heap'], category: 'Linked List' },
  { path: '/problems/remove-nth-node-end-list', num: 19, title: 'Remove Nth Node From End of List', difficulty: 'Medium', tags: ['Linked List', 'Two Pointers'], category: 'Linked List' },
  
  // Matrix
  { path: '/problems/set-matrix-zeroes', num: 73, title: 'Set Matrix Zeroes', difficulty: 'Medium', tags: ['Matrix'], category: 'Matrix' },
  { path: '/problems/spiral-matrix', num: 54, title: 'Spiral Matrix', difficulty: 'Medium', tags: ['Matrix'], category: 'Matrix' },
  { path: '/problems/rotate-image', num: 48, title: 'Rotate Image', difficulty: 'Medium', tags: ['Matrix'], category: 'Matrix' },
  { path: '/problems/word-search', num: 79, title: 'Word Search', difficulty: 'Medium', tags: ['Matrix', 'Backtracking'], category: 'Matrix' },
  
  // String
  { path: '/problems/longest-substring-no-repeat', num: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['String', 'Hash Map', 'Sliding Window'], category: 'String' },
  { path: '/problems/longest-repeating-character-replacement', num: 424, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', tags: ['String', 'Sliding Window'], category: 'String' },
  { path: '/problems/minimum-window-substring', num: 76, title: 'Minimum Window Substring', difficulty: 'Hard', tags: ['String', 'Sliding Window'], category: 'String' },
  { path: '/problems/valid-parentheses', num: 20, title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'], category: 'String' },
  { path: '/problems/valid-anagram', num: 242, title: 'Valid Anagram', difficulty: 'Easy', tags: ['String', 'Hash Map'], category: 'String' },
  { path: '/problems/group-anagrams', num: 49, title: 'Group Anagrams', difficulty: 'Medium', tags: ['String', 'Hash Map'], category: 'String' },
  { path: '/problems/valid-palindrome', num: 125, title: 'Valid Palindrome', difficulty: 'Easy', tags: ['String', 'Two Pointers'], category: 'String' },
  { path: '/problems/longest-palindromic-substring', num: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', tags: ['String', 'DP'], category: 'String' },
  { path: '/problems/palindromic-substrings', num: 647, title: 'Palindromic Substrings', difficulty: 'Medium', tags: ['String', 'DP'], category: 'String' },
  
  // Tree
  { path: '/problems/invert-binary-tree', num: 226, title: 'Invert Binary Tree', difficulty: 'Easy', tags: ['Tree', 'DFS/BFS'], category: 'Tree' },
  { path: '/problems/maximum-depth-binary-tree', num: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tags: ['Tree', 'DFS/BFS'], category: 'Tree' },
  { path: '/problems/same-tree', num: 100, title: 'Same Tree', difficulty: 'Easy', tags: ['Tree', 'DFS/BFS'], category: 'Tree' },
  { path: '/problems/subtree-of-another-tree', num: 572, title: 'Subtree of Another Tree', difficulty: 'Easy', tags: ['Tree', 'DFS/BFS'], category: 'Tree' },
  { path: '/problems/lca-bst', num: 235, title: 'Lowest Common Ancestor of a BST', difficulty: 'Easy', tags: ['Tree', 'DFS/BFS'], category: 'Tree' },
  { path: '/problems/binary-tree-level-order-traversal', num: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', tags: ['Tree', 'BFS'], category: 'Tree' },
  { path: '/problems/binary-tree-right-side-view', num: 199, title: 'Binary Tree Right Side View', difficulty: 'Medium', tags: ['Tree', 'BFS'], category: 'Tree' },
  { path: '/problems/count-good-nodes', num: 1448, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', tags: ['Tree', 'DFS'], category: 'Tree' },
  
  // Trie
  { path: '/problems/implement-trie', num: 208, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', tags: ['Trie'], category: 'Trie' },
  { path: '/problems/design-add-search-words', num: 211, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', tags: ['Trie', 'DFS'], category: 'Trie' },
  
  // Heap
  { path: '/problems/top-k-frequent-elements', num: 347, title: 'Top K Frequent Elements', difficulty: 'Medium', tags: ['Heap', 'Hash Map'], category: 'Heap' },
  { path: '/problems/find-median-from-data-stream', num: 295, title: 'Find Median from Data Stream', difficulty: 'Hard', tags: ['Heap'], category: 'Heap' },
  { path: '/problems/ipo', num: 502, title: 'IPO', difficulty: 'Hard', tags: ['Heap', 'Greedy'], category: 'Heap' },
  
  // Two Pointers
  { path: '/problems/valid-palindrome-ii', num: 680, title: 'Valid Palindrome II', difficulty: 'Easy', tags: ['String', 'Two Pointers'], category: 'Two Pointers' },
  { path: '/problems/two-sum-ii', num: 167, title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], category: 'Two Pointers' },
  
  // Backtracking
  { path: '/problems/combination-sum', num: 39, title: 'Combination Sum', difficulty: 'Medium', tags: ['Array', 'Backtracking'], category: 'Backtracking' },
  { path: '/problems/subsets', num: 78, title: 'Subsets', difficulty: 'Medium', tags: ['Array', 'Backtracking', 'Bit Manipulation'], category: 'Backtracking' },
  { path: '/problems/combinations', num: 77, title: 'Combinations', difficulty: 'Medium', tags: ['Backtracking'], category: 'Backtracking' },
  { path: '/problems/permutations', num: 46, title: 'Permutations', difficulty: 'Medium', tags: ['Array', 'Backtracking'], category: 'Backtracking' },
]

export default function Home() {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const categories = [...new Set(PROBLEMS.map(p => p.category))]
  
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', fontFamily: '"Segoe UI", sans-serif', color: 'var(--color-accent)' }}>
      {/* User Header */}
      {isAuthenticated && (
        <div style={{ background: 'var(--color-bg-dark)', borderBottom: '1px solid var(--color-border)', padding: '12px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bg-darkest)', fontWeight: 700, fontSize: 14 }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.6)' }}>Logged in as</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 6,
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'
              e.currentTarget.style.borderColor = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
      
      {!isAuthenticated && (
        <div style={{ background: 'var(--color-bg-dark)', borderBottom: '1px solid var(--color-border)', padding: '12px 30px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to="/login"
            style={{
              padding: '8px 16px',
              background: 'var(--color-accent)',
              color: 'var(--color-bg-darkest)',
              textDecoration: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 0.85
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 1
            }}
          >
            🔐 Sign In with Google
          </Link>
        </div>
      )}
      {/* Hero Section */}
      <div style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-bg-darker))`, color: 'var(--color-accent)', padding: '60px 30px', textAlign: 'center', borderBottom: `1px solid var(--color-border)` }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>🎯 DSA Calenders</h1>
        <p style={{ opacity: 0.9, fontSize: 18, marginBottom: 24 }}>Master the Blind 75 with interactive, step-by-step visualizations</p>
        {isAuthenticated && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>        
            <Link to="/study-calendar" style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: 8, fontSize: 14, color: '#34d399', textDecoration: 'none', fontWeight: 600, border: '1px solid #34d39940' }}>📅 30-Day Study Plan</Link>          
            <Link to="/study-calendar-45" style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: 8, fontSize: 14, color: '#a5b4fc', textDecoration: 'none', fontWeight: 600, border: '1px solid #6366f140' }}>🗓️ 45-Day Blind 75</Link>          
            <Link to="/study-calendar-60" style={{ padding: '8px 16px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: 8, fontSize: 14, color: '#c4b5fd', textDecoration: 'none', fontWeight: 600, border: '1px solid #a855f740' }}>🚀 60-Day NeetCode 150</Link>          
            <Link to="/study-calendar-90" style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: 14, color: '#fca5a5', textDecoration: 'none', fontWeight: 600, border: '1px solid #ef444440' }}>🏆 90-Day Calender</Link>
            <Link to="/study-calendar-100" style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: 14, color: '#fca5a5', textDecoration: 'none', fontWeight: 600, border: '1px solid #ef444440' }}>🏆 100-Day AlgoMaster 300</Link>
            <Link to="/study-calendar-150" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: 8, fontSize: 14, color: '#93c5fd', textDecoration: 'none', fontWeight: 600, border: '1px solid #3b82f640' }}>⭐ 150-Day Master Plan</Link>        
          </div>
        )}
        {!isAuthenticated && (
          <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: 24 }}>
            <p style={{ fontSize: 16, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>🔒 Study plans are only available for logged-in users.</p>
            <Link to="/login" style={{ padding: '10px 20px', background: 'var(--color-accent)', color: 'var(--color-bg-darkest)', textDecoration: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, display: 'inline-block', transition: 'all 0.2s' }}>Sign in to access study calendars</Link>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* Problems by Category */}
        {categories.map(cat => (
          <section key={cat} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--color-accent)' }}>📚 {cat} Problems</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {PROBLEMS.filter(p => p.category === cat).map((problem) => (
                <ProblemCard key={problem.path} problem={problem} />
              ))}
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer style={{ marginTop: 80, paddingTop: 30, borderTop: `1px solid var(--color-border)`, textAlign: 'center', color: 'rgba(176, 228, 204, 0.6)', fontSize: 14 }}>
          <p>🚀 Built with React, Tailwind CSS, and passion for algorithms</p>
          <p style={{ marginTop: 8 }}>Perfect for interview prep and algorithm mastery</p>
        </footer>
      </div>
    </div>
  )
}

function ProblemCard({ problem }) {
  const diffColor = { Easy: 'var(--color-success)', Medium: 'var(--color-warning)', Hard: 'var(--color-error)' }

  return (
    <Link to={problem.path} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--color-bg-dark)',
        border: `1px solid var(--color-border)`,
        borderRadius: 10,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(64, 138, 113, 0.3)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'Monaco, monospace',
            fontSize: 13,
            color: 'rgba(176, 228, 204, 0.6)',
            fontWeight: 600,
          }}>
            #{problem.num}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: diffColor[problem.difficulty],
            padding: '3px 10px',
            background: `${diffColor[problem.difficulty]}20`,
            borderRadius: 6,
            whiteSpace: 'nowrap',
          }}>
            {problem.difficulty}
          </span>
        </div>
        
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 8, fontSize: 14, lineHeight: '1.3' }}>
            {problem.title}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {problem.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11,
              padding: '3px 8px',
              background: 'var(--color-overlay-light)',
              border: `1px solid var(--color-border)`,
              borderRadius: 10,
              color: 'rgba(176, 228, 204, 0.7)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
