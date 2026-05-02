import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './routes/Home'
import LoginRegister from './routes/LoginRegister'
import StudyCalendar from './routes/StudyCalendar'
import StudyCalendar45 from './routes/StudyCalendar45'
import StudyCalendar60 from './routes/StudyCalendar60'
import StudyCalendar90 from './routes/StudyCalendar90'
import StudyCalendar100 from './routes/StudyCalendar100'
import StudyCalendar150 from './routes/StudyCalendar150'
import StudyCalendarSystemDesign from './routes/StudyCalendarSystemDesign'

// Array Problems
import TwoSum from './routes/problems/TwoSum'
import BestTimeBuyStock from './routes/problems/BestTimeBuyStock'
import ContainsDuplicate from './routes/problems/ContainsDuplicate'
import MaximumSubarray from './routes/problems/MaximumSubarray'

// String Problems
import ValidParentheses from './routes/problems/ValidParentheses'

// Dynamic Programming
import ClimbingStairs from './routes/problems/ClimbingStairs'
import CoinChange from './routes/problems/CoinChange'

// Existing Problems
import LongestCommonSubsequence from './routes/problems/LongestCommonSubsequence'
import LongestCommonSubstring from './routes/problems/LongestCommonSubstring'
import MergeIntervals from './routes/problems/MergeIntervals'
import LongestSubstringNoRepeat from './routes/problems/LongestSubstringNoRepeat'
import CombinationSum from './routes/problems/CombinationSum'
import Subsets from './routes/problems/Subsets'
import Combinations from './routes/problems/Combinations'
import Permutations from './routes/problems/Permutations'

// Pattern Learning
import SlidingWindowPattern from './routes/patterns/SlidingWindow'
import DynamicProgramming from './routes/patterns/DynamicProgramming'

// Placeholder for remaining Blind 75 problems
const CommingSoon = () => <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontSize: 24, fontWeight: 700 }}>🚀 Coming Soon</div>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister />} />
        <Route path="/study-calendar" element={<StudyCalendar />} />
        <Route path="/study-calendar-45" element={<StudyCalendar45 />} />
        <Route path="/study-calendar-60" element={<StudyCalendar60 />} />
        <Route path="/study-calendar-90" element={<StudyCalendar90 />} />
        <Route path="/study-calendar-100" element={<StudyCalendar100 />} />
        <Route path="/study-calendar-150" element={<StudyCalendar150 />} />
        <Route path="/study-calendar-system-design" element={<StudyCalendarSystemDesign />} />
        
        {/* Array */}
        <Route path="/problems/two-sum" element={<TwoSum />} />
        <Route path="/problems/best-time-buy-sell-stock" element={<BestTimeBuyStock />} />
        <Route path="/problems/contains-duplicate" element={<ContainsDuplicate />} />
        <Route path="/problems/maximum-subarray" element={<MaximumSubarray />} />
        
        {/* String */}
        <Route path="/problems/valid-parentheses" element={<ValidParentheses />} />
        
        {/* Dynamic Programming */}
        <Route path="/problems/climbing-stairs" element={<ClimbingStairs />} />
        <Route path="/problems/coin-change" element={<CoinChange />} />
        
        {/* Existing */}
        <Route path="/problems/lcs" element={<LongestCommonSubsequence />} />
        <Route path="/problems/lcss" element={<LongestCommonSubstring />} />
        <Route path="/problems/merge-intervals" element={<MergeIntervals />} />
        <Route path="/problems/longest-substring-no-repeat" element={<LongestSubstringNoRepeat />} />
        <Route path="/problems/combination-sum" element={<CombinationSum />} />
        <Route path="/problems/subsets" element={<Subsets />} />
        <Route path="/problems/combinations" element={<Combinations />} />
        <Route path="/problems/permutations" element={<Permutations />} />
        
        {/* Patterns */}
        <Route path="/patterns/sliding-window" element={<SlidingWindowPattern />} />
        <Route path="/patterns/dynamic-programming" element={<DynamicProgramming />} />
        
        {/* Blind 75 Remaining - Placeholders */}
        <Route path="/problems/product-of-array-except-self" element={<CommingSoon />} />
        <Route path="/problems/longest-increasing-subsequence" element={<CommingSoon />} />
        <Route path="/problems/word-break" element={<CommingSoon />} />
        <Route path="/problems/combination-sum-iv" element={<CommingSoon />} />
        <Route path="/problems/house-robber" element={<CommingSoon />} />
        <Route path="/problems/house-robber-ii" element={<CommingSoon />} />
        <Route path="/problems/decode-ways" element={<CommingSoon />} />
        <Route path="/problems/number-of-islands" element={<CommingSoon />} />
        <Route path="/problems/counting-bits" element={<CommingSoon />} />
        <Route path="/problems/alien-dictionary" element={<CommingSoon />} />
        <Route path="/problems/graph-valid-tree" element={<CommingSoon />} />
        <Route path="/problems/connected-components-undirected-graph" element={<CommingSoon />} />
        <Route path="/problems/course-schedule" element={<CommingSoon />} />
        <Route path="/problems/course-schedule-ii" element={<CommingSoon />} />
        <Route path="/problems/redundant-connection" element={<CommingSoon />} />
        <Route path="/problems/word-ladder" element={<CommingSoon />} />
        <Route path="/problems/clone-graph" element={<CommingSoon />} />
        <Route path="/problems/evaluate-division" element={<CommingSoon />} />
        <Route path="/problems/accounts-merge" element={<CommingSoon />} />
        <Route path="/problems/pacific-atlantic-water-flow" element={<CommingSoon />} />
        <Route path="/problems/insert-interval" element={<CommingSoon />} />
        <Route path="/problems/interval-list-intersections" element={<CommingSoon />} />
        <Route path="/problems/meeting-rooms" element={<CommingSoon />} />
        <Route path="/problems/meeting-rooms-ii" element={<CommingSoon />} />
        <Route path="/problems/reverse-linked-list" element={<CommingSoon />} />
        <Route path="/problems/detect-cycle-linked-list" element={<CommingSoon />} />
        <Route path="/problems/merge-two-sorted-lists" element={<CommingSoon />} />
        <Route path="/problems/merge-k-sorted-lists" element={<CommingSoon />} />
        <Route path="/problems/remove-nth-node-end-list" element={<CommingSoon />} />
        <Route path="/problems/set-matrix-zeroes" element={<CommingSoon />} />
        <Route path="/problems/spiral-matrix" element={<CommingSoon />} />
        <Route path="/problems/rotate-image" element={<CommingSoon />} />
        <Route path="/problems/word-search" element={<CommingSoon />} />
        <Route path="/problems/longest-repeating-character-replacement" element={<CommingSoon />} />
        <Route path="/problems/minimum-window-substring" element={<CommingSoon />} />
        <Route path="/problems/valid-anagram" element={<CommingSoon />} />
        <Route path="/problems/group-anagrams" element={<CommingSoon />} />
        <Route path="/problems/valid-palindrome" element={<CommingSoon />} />
        <Route path="/problems/longest-palindromic-substring" element={<CommingSoon />} />
        <Route path="/problems/palindromic-substrings" element={<CommingSoon />} />
        <Route path="/problems/invert-binary-tree" element={<CommingSoon />} />
        <Route path="/problems/maximum-depth-binary-tree" element={<CommingSoon />} />
        <Route path="/problems/same-tree" element={<CommingSoon />} />
        <Route path="/problems/subtree-of-another-tree" element={<CommingSoon />} />
        <Route path="/problems/lca-bst" element={<CommingSoon />} />
        <Route path="/problems/binary-tree-level-order-traversal" element={<CommingSoon />} />
        <Route path="/problems/binary-tree-right-side-view" element={<CommingSoon />} />
        <Route path="/problems/count-good-nodes" element={<CommingSoon />} />
        <Route path="/problems/implement-trie" element={<CommingSoon />} />
        <Route path="/problems/design-add-search-words" element={<CommingSoon />} />
        <Route path="/problems/top-k-frequent-elements" element={<CommingSoon />} />
        <Route path="/problems/find-median-from-data-stream" element={<CommingSoon />} />
        <Route path="/problems/ipo" element={<CommingSoon />} />
        <Route path="/problems/valid-palindrome-ii" element={<CommingSoon />} />
        <Route path="/problems/two-sum-ii" element={<CommingSoon />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
