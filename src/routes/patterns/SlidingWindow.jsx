import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import CharRow from '../../components/CharRow'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import ProblemCard from '../../components/ProblemCard'
import CodeLangTabs from '../../components/CodeLangTabs'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { usePlayback } from '../../hooks/usePlayback'
import { useProblemNotes } from '../../hooks/useProblemNotes'
import '../../styles/SlidingWindow.css'

export default function SlidingWindow() {
  const [activePattern, setActivePattern] = useState('fixed')
  const [activeSubTab, setActiveSubTab] = useState('template')
  const [activeCodeLang, setActiveCodeLang] = useState('javascript')
  const CODE = {
    javascript: `console.log("Code template coming soon...")`,

    // python: `print("Code template coming soon...")`,

    // java: `System.out.println("Code template coming soon...");`,

  }

  function CodePanel() {
    const [lang, setLang] = useState('javascript')
    return (
      <div>
        <div className="tabs">
          {Object.keys(CODE).map(l => (
            <button key={l} className={`tab ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
        <ShikiCodeBlock code={CODE[lang]} language={lang} />
      </div>
    )
  }

  return (
    <div className="sliding-window-container">
      <PageHeader
        title="Sliding Window Patterns"
        badges={[
          { label: 'Intermediate', className: 'difficulty-intermediate' },
          { label: 'Two Pointers', className: 'topic' },
        ]}
      />

      <main className="sliding-window-main">
        {/* Full-width introduction */}
        <div className="card sliding-window-full-width">
          <h2>📋 Sliding Window Overview</h2>
          <p>
            The Sliding Window technique is an optimization method that reduces nested loops to a single pass through data.
            It's particularly effective for problems involving contiguous arrays/strings and conditions that can be updated incrementally.
          </p>
          <p className="constraints-line">
            <span className="constraints-title">Best for:</span>
            Finding subarrays, substrings, maximum/minimum values in ranges, frequency problems
          </p>
        </div>

        {/* Pattern Selection Tabs */}
        <div className="card sliding-window-full-width">
          <div className="pattern-tabs">
            {[
              { id: 'fixed', label: '📌 Fixed Window' },
              { id: 'dynamic', label: '📍 Dynamic Window' },
              { id: 'frequency', label: '📊 Frequency Array' },
              { id: 'atmost', label: '🎯 At Most/Exactly K' },
            ].map(pattern => (
              <button
                key={pattern.id}
                className={`pattern-tab ${activePattern === pattern.id ? 'active' : ''}`}
                onClick={() => {
                  setActivePattern(pattern.id)
                  setActiveSubTab('template')
                  setActiveCodeLang('javascript')
                }}
              >
                {pattern.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed Window Pattern */}
        {activePattern === 'fixed' && <FixedWindowPattern />}

        {/* Dynamic Window Pattern */}
        {activePattern === 'dynamic' && <DynamicWindowPattern />}

        {/* Frequency Array Pattern */}
        {activePattern === 'frequency' && <FrequencyArrayPattern />}

        {/* At Most/Exactly K Pattern */}
        {activePattern === 'atmost' && <AtMostExactlyKPattern />}
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIXED WINDOW PATTERN
// ═══════════════════════════════════════════════════════════════════════════════
function FixedWindowPattern() {
  const { user } = useContext(AuthContext)
  const [arr, setArr] = useState([1, 2, 3, 4, 5])
  const [k, setK] = useState(3)
  const [result, setResult] = useState(null)

  const {
    visualization, setVisualization,
    isPaused, setIsPaused,
    speed, setSpeed,
    handleReset, handleNext, handlePrev,
  } = usePlayback()

  const fixedWindowProblems = [
    {
      id: 'lc239',
      title: 'LC 239. Sliding Window Maximum',
      description: 'Find the maximum value in each sliding window of size k.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/sliding-window-maximum/description/',
      topics: ['Array', 'Deque', 'Sliding Window'],
    },
    {
      id: 'lc643',
      title: 'LC 643. Maximum Average Subarray I',
      description: 'Find the contiguous subarray of size k with maximum average.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/maximum-average-subarray-i/description/',
      topics: ['Array', 'Sliding Window'],
    },
    {
      id: 'first_neg',
      title: 'First Negative Number in every Window of Size K',
      description: 'For each window of size k, find the first negative number (if exists). Classic DSA problem from GeeksforGeeks.',
      difficulty: 'Easy',
      leetcodeLink: 'https://www.geeksforgeeks.org/first-negative-integer-in-every-window-of-size-k/',
      topics: ['Array', 'Deque', 'Sliding Window'],
    },
    {
      id: 'perm_string',
      title: 'LC 567. Permutation in String',
      description: 'Check if one string is a permutation of another using sliding window.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/permutation-in-string/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc438',
      title: 'LC 438. Find All Anagrams in a String',
      description: 'Find all starting indices of anagrams of p in s using sliding window.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'anagram_count',
      title: 'Count Occurrences of Anagrams',
      description: 'Count how many times the anagrams of a pattern appear in text. Variation of LC 438.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'max_points_cards',
      title: 'LC 1423. Maximum Points You Can Obtain from Cards',
      description: 'Maximize points by taking cards from either end up to k moves.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/',
      topics: ['Array', 'Sliding Window', 'Prefix Sum'],
    },
    {
      id: 'max_distinct_subarray',
      title: 'LC 2461. Maximum Sum of Distinct Subarrays With Length K',
      description: 'Find the maximum sum of distinct subarrays of length k.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/',
      topics: ['Array', 'Sliding Window', 'HashMap'],
    },
  ]

  const { problems, handleSaveNote: handleSaveProblemNote } = useProblemNotes('fixed', fixedWindowProblems, user?.uid)

  const maxSumFixedWindow = (arr, k) => {
    const steps = []
    let maxSum = 0
    let windowSum = 0

    for (let i = 0; i < k; i++) {
      windowSum += arr[i]
      steps.push({ type: 'init', left: 0, right: i, windowSum, currentIdx: i, value: arr[i] })
    }
    maxSum = windowSum

    for (let i = k; i < arr.length; i++) {
      windowSum = windowSum - arr[i - k] + arr[i]
      steps.push({
        type: 'slide', left: i - k + 1, right: i,
        removed: arr[i - k], added: arr[i], windowSum, currentIdx: i, value: arr[i],
      })
      if (windowSum > maxSum) maxSum = windowSum
    }

    return { maxSum, steps }
  }

  useEffect(() => {
    if (k > arr.length || k <= 0) return
    const data = maxSumFixedWindow(arr, k)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.maxSum)
    setIsPaused(true)
  }, [arr, k])

  return (
    <section className="sliding-pattern-section">
      {/* When to Use & Complexity */}
      <div className="pattern-grid">
        <div className="card">
          <h2>📋 When to Use</h2>
          <ul>
            <li>Window size is constant</li>
            <li>Find max/min/sum in a subarray of fixed size k</li>
            <li>Problems with a predetermined window length</li>
          </ul>
          <p className="example-use">
            <strong>Example:</strong> Maximum sum subarray of size k, Average of subarrays of size k
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity</h2>
          <p>
            <strong>Time:</strong> O(n) - Single pass through array
          </p>
          <p>
            <strong>Space:</strong> O(1) - Only storing window variables
          </p>
          <p className="complexity-note">
            vs Brute Force: O(n × k)
          </p>
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>🎬 Live Animation - Maximum Sum Subarray (size k)</h2>
        <div className="input-section">
          <div className="input-inline">
            <label>Array:</label>
            <input
              type="text"
              value={arr.join(', ')}
              onChange={(e) => {
                const vals = e.target.value.split(',').map(v => parseInt(v.trim()) || 0)
                if (vals.length <= 10) setArr(vals)
              }}
              placeholder="e.g. 1,2,3,4,5"
            />
          </div>
          <div className="input-inline">
            <label>Window Size (k):</label>
            <input
              type="number"
              value={k}
              onChange={(e) => setK(Math.max(1, Math.min(arr.length, parseInt(e.target.value) || 1)))}
              min="1"
              max={arr.length}
            />
          </div>
          {result !== null && (
            <div className="result-inline">
              <span className="result-label">Max Sum</span>
              <span className="result-val">{result}</span>
            </div>
          )}
        </div>

        <VisualizerWrapper title="Fixed Window Visualization">
          <FixedWindowVisualizer arr={arr} k={k} visualization={visualization} />
          <PlaybackControls
            isPaused={isPaused}
            currentStep={visualization?.currentStep ?? 0}
            totalSteps={visualization?.steps?.length ?? 0}
            onReset={handleReset}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </VisualizerWrapper>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        {/* <CodePanel /> */}
        <ShikiCodeBlock code={'console.log("Code template coming soon...")'} language={'javascript'} />
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="algo-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Build Initial Window</strong>
              <p>Sum the first k elements to establish the baseline window</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Slide the Window</strong>
              <p>Move one element at a time—remove the leftmost element, add the new rightmost element</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Update Result</strong>
              <p>Compare current window sum with the maximum found so far</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Repeat</strong>
              <p>Continue until the window reaches the end of the array</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems - Fixed Size Sliding Window</h2>
        <div className="problems-list">
          {problems.map(problem => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onSaveNote={handleSaveProblemNote}
              userId={user?.uid}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul>
          <li><strong>Fixed size is the key:</strong> If k doesn't change, use this pattern</li>
          <li><strong>Arithmetic optimization:</strong> Use addition/subtraction instead of recalculating sums</li>
          <li><strong>Edge cases:</strong> {`Handle k > arr.length, k = 0, empty arrays`}</li>
          <li><strong>O(n) vs O(nk):</strong> This pattern reduces time complexity significantly</li>
        </ul>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC WINDOW PATTERN
// ═══════════════════════════════════════════════════════════════════════════════
function DynamicWindowPattern() {
  const { user } = useContext(AuthContext)
  const [str, setStr] = useState('abcabcbb')
  const [result, setResult] = useState(null)
  const [activeCodeLang, setActiveCodeLang] = useState('javascript')

  const {
    visualization, setVisualization,
    isPaused, setIsPaused,
    speed, setSpeed,
    handleReset, handleNext, handlePrev,
  } = usePlayback()

  const dynamicWindowProblems = [
    {
      id: 'lc3',
      title: 'LC 3. Longest Substring Without Repeating Characters',
      description: 'Find the length of the longest substring without repeating characters.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc76',
      title: 'LC 76. Minimum Window Substring',
      description: 'Find the minimum window in s that contains all characters in t.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/minimum-window-substring/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc30',
      title: 'LC 30. Substring with Concatenation of All Words',
      description: 'Find all starting indices of concatenated substrings that contain all words from the array.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/substring-with-concatenation-of-all-words/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc159',
      title: 'LC 159. Longest Substring with At Most 2 Distinct Characters',
      description: 'Find the length of longest substring with at most 2 distinct characters.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/description/',
      topics: ['String', 'Sliding Window', 'HashMap'],
    },
  ]

  const { problems, handleSaveNote: handleSaveProblemNote } = useProblemNotes('dynamic', dynamicWindowProblems, user?.uid)

  const longestSubstringWithoutRepeating = (s) => {
    const steps = []
    const charIndex = {}
    let left = 0
    let maxLen = 0
    let maxStart = 0

    for (let right = 0; right < s.length; right++) {
      const char = s[right]

      if (char in charIndex && charIndex[char] >= left) {
        left = charIndex[char] + 1
        steps.push({
          type: 'duplicate',
          left,
          right,
          char,
          currentLen: right - left + 1,
        })
      } else {
        steps.push({
          type: 'expand',
          left,
          right,
          char,
          currentLen: right - left + 1,
        })
      }

      charIndex[char] = right

      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1
        maxStart = left
      }
    }

    const substring = s.substring(maxStart, maxStart + maxLen)
    return { substring, maxLen, steps }
  }

  useEffect(() => {
    if (str.length === 0) return
    const data = longestSubstringWithoutRepeating(str)
    setVisualization({ ...data, currentStep: 0 })
    setResult({ substring: data.substring, length: data.maxLen })
    setIsPaused(true)
  }, [str])

  return (
    <section className="sliding-pattern-section">
      {/* When to Use & Complexity */}
      <div className="pattern-grid">
        <div className="card">
          <h2>📋 When to Use</h2>
          <ul>
            <li>Window size varies based on conditions</li>
            <li>Find longest/shortest valid substring/subarray</li>
            <li>Conditions can grow or shrink the window dynamically</li>
          </ul>
          <p className="example-use">
            <strong>Example:</strong> Longest substring without repeating characters, Minimum window substring
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity</h2>
          <p>
            <strong>Time:</strong> O(n) - Each element visited at most twice (enter & exit window)
          </p>
          <p>
            <strong>Space:</strong> O(min(n, charset)) - Hash map for character tracking
          </p>
          <p className="complexity-note">
            vs Brute Force: O(n²) or O(n³)
          </p>
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>🎬 Live Animation - Longest Substring Without Repeating</h2>
        <div className="input-section">
          <div className="input-inline">
            <label>String:</label>
            <input
              type="text"
              value={str}
              onChange={(e) => {
                const val = e.target.value.toLowerCase()
                if (val.length <= 15) setStr(val)
              }}
              placeholder="e.g. abcabcbb"
            />
          </div>
          {result !== null && (
            <div className="result-inline">
              <span className="result-label">Longest Substring</span>
              <span className="result-val">"{result.substring}"</span>
              <span className="result-len">length={result.length}</span>
            </div>
          )}
        </div>

        <VisualizerWrapper title="Dynamic Window Visualization">
          <DynamicWindowVisualizer str={str} visualization={visualization} />
          <PlaybackControls
            isPaused={isPaused}
            currentStep={visualization?.currentStep ?? 0}
            totalSteps={visualization?.steps?.length ?? 0}
            onReset={handleReset}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </VisualizerWrapper>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <CodeLangTabs activeLang={activeCodeLang} onChange={setActiveCodeLang} />
        {activeCodeLang === 'javascript' && (
          <ShikiCodeBlock
            code={`function longestSubstringWithoutRepeating(s) {
    const charIndex = {};
    let left = 0;
    let maxLen = 0;
    let maxStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        // If duplicate found and in current window
        if (char in charIndex && charIndex[char] >= left) {
            left = charIndex[char] + 1;
        }
        
        // Update character's latest index
        charIndex[char] = right;
        
        // Update max length
        if (right - left + 1 > maxLen) {
            maxLen = right - left + 1;
            maxStart = left;
        }
    }
    
    return s.substring(maxStart, maxStart + maxLen);
}`}
            language="javascript"
          />
        )}
        {activeCodeLang === 'python' && (
          <ShikiCodeBlock
            code={`def longest_substring_without_repeating(s):
    char_index = {}
    left = 0
    max_len = 0
    max_start = 0
    
    for right in range(len(s)):
        char = s[right]
        
        # If duplicate found and in current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        # Update character's latest index
        char_index[char] = right
        
        # Update max length
        if right - left + 1 > max_len:
            max_len = right - left + 1
            max_start = left
    
    return s[max_start:max_start + max_len]`}
            language="python"
          />
        )}
        {activeCodeLang === 'java' && (
          <ShikiCodeBlock
            code={`public static String longestSubstringWithoutRepeating(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLen = 0;
    int maxStart = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        // If duplicate found and in current window
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        
        // Update character's index
        charIndex.put(c, right);
        
        // Update max length
        if (right - left + 1 > maxLen) {
            maxLen = right - left + 1;
            maxStart = left;
        }
    }
    
    return s.substring(maxStart, maxStart + maxLen);
}`}
            language="java"
          />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="algo-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Expand Right Pointer</strong>
              <p>Move right pointer to include new characters in the window</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Track Characters</strong>
              <p>Use a hash map to store the latest position of each character</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Contract Left Pointer</strong>
              <p>When duplicate found, move left pointer to remove the duplicate</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Record Maximum</strong>
              <p>Keep track of the longest valid window seen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems - Dynamic Size Sliding Window</h2>
        <div className="problems-list">
          {problems.map(problem => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onSaveNote={handleSaveProblemNote}
              userId={user?.uid}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul>
          <li><strong>Two pointers:</strong> Left and right expand/contract based on conditions</li>
          <li><strong>Hash map usage:</strong> Track elements in current window for O(1) lookups</li>
          <li><strong>Condition-based movement:</strong> Right expands window, left contracts when condition fails</li>
          <li><strong>State maintenance:</strong> Keep running state of window (sum, count, frequency)</li>
        </ul>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FREQUENCY ARRAY PATTERN
// ═══════════════════════════════════════════════════════════════════════════════
function FrequencyArrayPattern() {
  const [s, setS] = useState('aabacbcbcadaabaaba')
  const [target, setTarget] = useState('aaab')
  const [result, setResult] = useState(null)
  const [activeCodeLang, setActiveCodeLang] = useState('javascript')

  const {
    visualization, setVisualization,
    isPaused, setIsPaused,
    speed, setSpeed,
    handleReset, handleNext, handlePrev,
  } = usePlayback()

  const minWindowSubstring = (s, t) => {
    if (t.length > s.length) return ''

    const steps = []
    const targetCount = {}
    const windowCount = {}

    for (const char of t) {
      targetCount[char] = (targetCount[char] || 0) + 1
    }

    let have = 0
    let need = Object.keys(targetCount).length
    let left = 0
    let minLen = Infinity
    let minStart = 0

    for (let right = 0; right < s.length; right++) {
      const char = s[right]
      windowCount[char] = (windowCount[char] || 0) + 1

      if (char in targetCount && windowCount[char] === targetCount[char]) {
        have++
      }

      steps.push({
        type: 'expand',
        left,
        right,
        char,
        have,
        need,
        valid: have === need,
      })

      while (have === need) {
        if (right - left + 1 < minLen) {
          minLen = right - left + 1
          minStart = left
        }

        const leftChar = s[left]
        windowCount[leftChar]--
        if (leftChar in targetCount && windowCount[leftChar] < targetCount[leftChar]) {
          have--
        }
        left++

        steps.push({
          type: 'contract',
          left,
          right,
          have,
          need,
          valid: have === need,
        })
      }
    }

    return { window: minLen === Infinity ? '' : s.substring(minStart, minStart + minLen), steps }
  }

  useEffect(() => {
    if (target.length === 0 || s.length === 0) return
    const data = minWindowSubstring(s, target)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.window)
    setIsPaused(true)
  }, [s, target])

  return (
    <section className="sliding-pattern-section">
      {/* When to Use & Complexity */}
      <div className="pattern-grid">
        <div className="card">
          <h2>📋 When to Use</h2>
          <ul>
            <li>Problems involving character/element frequencies</li>
            <li>Matching specific frequency requirements</li>
            <li>Finding anagrams or permutations in strings</li>
          </ul>
          <p className="example-use">
            <strong>Example:</strong> Minimum window substring, Permutation in string, Find all anagrams
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity</h2>
          <p>
            <strong>Time:</strong> O(n + m) - n for main string, m for target
          </p>
          <p>
            <strong>Space:</strong> O(1) - Maximum 26 for lowercase letters (constant)
          </p>
          <p className="complexity-note">
            Frequency arrays enable O(1) frequency checks
          </p>
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>🎬 Live Animation - Minimum Window Substring</h2>
        <div className="input-section">
          <div className="input-inline">
            <label>String:</label>
            <input
              type="text"
              value={s}
              onChange={(e) => {
                const val = e.target.value.toLowerCase()
                if (val.length <= 25) setS(val)
              }}
              placeholder="e.g. aabacbcbcadaabaaba"
            />
          </div>
          <div className="input-inline">
            <label>Target:</label>
            <input
              type="text"
              value={target}
              onChange={(e) => {
                const val = e.target.value.toLowerCase()
                if (val.length <= 10) setTarget(val)
              }}
              placeholder="e.g. aaab"
            />
          </div>
          {result !== null && (
            <div className="result-inline">
              <span className="result-label">Min Window</span>
              <span className="result-val">"{result || '∅'}"</span>
            </div>
          )}
        </div>

        <VisualizerWrapper title="Frequency Array Window Visualization">
          <FrequencyWindowVisualizer s={s} target={target} visualization={visualization} />
          <PlaybackControls
            isPaused={isPaused}
            currentStep={visualization?.currentStep ?? 0}
            totalSteps={visualization?.steps?.length ?? 0}
            onReset={handleReset}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </VisualizerWrapper>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <CodeLangTabs activeLang={activeCodeLang} onChange={setActiveCodeLang} />
        {activeCodeLang === 'javascript' && (
          <ShikiCodeBlock
            code={`function minWindow(s, t) {
    if (t.length > s.length) return "";
    
    const targetCount = {};
    const windowCount = {};
    
    // Count target characters
    for (const char of t) {
        targetCount[char] = (targetCount[char] || 0) + 1;
    }
    
    let have = 0; // Matching frequencies count
    let need = Object.keys(targetCount).length;
    let left = 0;
    let minLen = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        windowCount[char] = (windowCount[char] || 0) + 1;
        
        // Check if this char reached target frequency
        if (char in targetCount && windowCount[char] === targetCount[char]) {
            have++;
        }
        
        // Contract window while valid
        while (have === need) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            const leftChar = s[left];
            windowCount[leftChar]--;
            if (leftChar in targetCount && windowCount[leftChar] < targetCount[leftChar]) {
                have--;
            }
            left++;
        }
    }
    
    return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}`}
            language="javascript"
          />
        )}
        {activeCodeLang === 'python' && (
          <ShikiCodeBlock
            code={`def min_window(s, t):
    if len(t) > len(s):
        return ""
    
    target_count = {}
    window_count = {}
    
    for char in t:
        target_count[char] = target_count.get(char, 0) + 1
    
    have = 0
    need = len(target_count)
    left = 0
    min_len = float('inf')
    min_start = 0
    
    for right in range(len(s)):
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1
        
        if char in target_count and window_count[char] == target_count[char]:
            have += 1
        
        while have == need:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left
            
            left_char = s[left]
            window_count[left_char] -= 1
            if left_char in target_count and window_count[left_char] < target_count[left_char]:
                have -= 1
            left += 1
    
    return "" if min_len == float('inf') else s[min_start:min_start + min_len]`}
            language="python"
          />
        )}
        {activeCodeLang === 'java' && (
          <ShikiCodeBlock
            code={`public static String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    
    Map<Character, Integer> targetCount = new HashMap<>();
    Map<Character, Integer> windowCount = new HashMap<>();
    
    for (char c : t.toCharArray()) {
        targetCount.put(c, targetCount.getOrDefault(c, 0) + 1);
    }
    
    int have = 0;
    int need = targetCount.size();
    int left = 0;
    int minLen = Integer.MAX_VALUE;
    int minStart = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        windowCount.put(c, windowCount.getOrDefault(c, 0) + 1);
        
        if (targetCount.containsKey(c) && windowCount.get(c).equals(targetCount.get(c))) {
            have++;
        }
        
        while (have == need) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            char leftChar = s.charAt(left);
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (targetCount.containsKey(leftChar) && windowCount.get(leftChar) < targetCount.get(leftChar)) {
                have--;
            }
            left++;
        }
    }
    
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}`}
            language="java"
          />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="algo-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Build Target Frequency Map</strong>
              <p>Count how many of each character is needed from target</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Expand Window (Right Pointer)</strong>
              <p>Add characters to window and update frequency map</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Check Validity</strong>
              <p>Track how many unique characters have reached target frequency</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Contract Window (Left Pointer)</strong>
              <p>When window is valid, remove characters from left to find minimum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems</h2>
        <div className="problems-list">
          <div className="problem">
            <h3>Minimum Window Substring</h3>
            <p>Find the minimum window substring containing all characters from target.</p>
            <span className="difficulty hard">Hard</span>
          </div>
          <div className="problem">
            <h3>Find All Anagrams in a String</h3>
            <p>Find all start indices of p's anagrams in s.</p>
            <span className="difficulty medium">Medium</span>
          </div>
          <div className="problem">
            <h3>Permutation in String</h3>
            <p>Check if s1's permutation exists as a substring in s2.</p>
            <span className="difficulty medium">Medium</span>
          </div>
          <div className="problem">
            <h3>Longest Repeating Character Replacement</h3>
            <p>Find longest substring with same letter after at most k changes.</p>
            <span className="difficulty medium">Medium</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul>
          <li><strong>Frequency arrays:</strong> Enable O(1) frequency lookups vs O(n) rechecking</li>
          <li><strong>Counter variable:</strong> Track how many unique characters are satisfied</li>
          <li><strong>Efficient comparison:</strong> Compare counters instead of iterating through frequencies</li>
          <li><strong>Two-pass optimization:</strong> First count target, then slide window</li>
        </ul>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// AT MOST / EXACTLY K PATTERN
// ═══════════════════════════════════════════════════════════════════════════════
function AtMostExactlyKPattern() {
  const { user } = useContext(AuthContext)
  const [arr, setArr] = useState([1, 2, 1, 2, 3])
  const [k, setK] = useState(2)
  const [result, setResult] = useState(null)
  const [activeCodeLang, setActiveCodeLang] = useState('javascript')

  const {
    visualization, setVisualization,
    isPaused, setIsPaused,
    speed, setSpeed,
    handleReset, handleNext, handlePrev,
  } = usePlayback()

  const atMostKProblems = [
    {
      id: 'lc1248',
      title: 'LC 1248. Count Number of Nice Subarrays',
      description: 'Count subarrays with exactly k odd numbers.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/count-number-of-nice-subarrays/description/',
      topics: ['Array', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc930',
      title: 'LC 930. Binary Subarrays With Sum',
      description: 'Return the number of non-empty subarrays with exactly k sum.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/binary-subarrays-with-sum/description/',
      topics: ['Array', 'Sliding Window', 'HashMap'],
    },
    {
      id: 'lc1004',
      title: 'LC 1004. Max Consecutive Ones III',
      description: 'Return the maximum number of consecutive 1\'s if you can flip at most k zeros.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/max-consecutive-ones-iii/description/',
      topics: ['Array', 'Sliding Window'],
    },
  ]

  const { problems, handleSaveNote: handleSaveProblemNote } = useProblemNotes('atmost', atMostKProblems, user?.uid)

  const subarraysWithKDistinct = (arr, k) => {
    const steps = []

    const atMostKDistinct = (k) => {
      const count = {}
      let left = 0
      let result = 0

      for (let right = 0; right < arr.length; right++) {
        const num = arr[right]
        count[num] = (count[num] || 0) + 1

        while (Object.keys(count).length > k) {
          count[arr[left]]--
          if (count[arr[left]] === 0) delete count[arr[left]]
          left++
        }

        result += right - left + 1

        steps.push({
          right,
          left,
          count: { ...count },
          distinctCount: Object.keys(count).length,
          subarraysInThisStep: right - left + 1,
          totalSoFar: result,
        })
      }

      return result
    }

    const atMostK = atMostKDistinct(k)
    const atMostK1 = atMostKDistinct(k - 1)
    const exactlyK = atMostK - atMostK1

    return { exactlyK, steps }
  }

  useEffect(() => {
    if (k <= 0 || arr.length === 0) return
    const data = subarraysWithKDistinct(arr, k)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.exactlyK)
    setIsPaused(true)
  }, [arr, k])

  return (
    <section className="sliding-pattern-section">
      {/* When to Use & Complexity */}
      <div className="pattern-grid">
        <div className="card">
          <h2>📋 When to Use</h2>
          <ul>
            <li>Find subarrays with exactly k distinct elements</li>
            <li>At most k occurrences of specific elements</li>
            <li>Count operations: use "exactly k" = "at most k" - "at most k-1"</li>
          </ul>
          <p className="example-use">
            <strong>Example:</strong> Subarrays with K Different Integers, At Most K Different Characters
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity</h2>
          <p>
            <strong>Time:</strong> O(n) - Each element enters/exits window once
          </p>
          <p>
            <strong>Space:</strong> O(k) - Hash map for at most k distinct elements
          </p>
          <p className="complexity-note">
            Trick: Exactly K = AtMostK - AtMostK-1
          </p>
        </div>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>🎬 Live Animation - Subarrays with Exactly K Distinct Elements</h2>
        <div className="input-section">
          <div className="input-inline">
            <label>Array:</label>
            <input
              type="text"
              value={arr.join(', ')}
              onChange={(e) => {
                const vals = e.target.value.split(',').map(v => parseInt(v.trim()) || 0)
                if (vals.length <= 10) setArr(vals)
              }}
              placeholder="e.g. 1,2,1,2,3"
            />
          </div>
          <div className="input-inline">
            <label>K (exactly):</label>
            <input
              type="number"
              value={k}
              onChange={(e) => setK(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </div>
          {result !== null && (
            <div className="result-inline">
              <span className="result-label">Subarrays with exactly {k} distinct</span>
              <span className="result-val">{result}</span>
            </div>
          )}
        </div>

        <VisualizerWrapper title="At Most/Exactly K Window Visualization">
          <AtMostKVisualizer arr={arr} k={k} visualization={visualization} />
          <PlaybackControls
            isPaused={isPaused}
            currentStep={visualization?.currentStep ?? 0}
            totalSteps={visualization?.steps?.length ?? 0}
            onReset={handleReset}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </VisualizerWrapper>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <CodeLangTabs activeLang={activeCodeLang} onChange={setActiveCodeLang} />
        {activeCodeLang === 'javascript' && (
          <ShikiCodeBlock
            code={`function subarraysWithKDistinct(arr, k) {
    // Helper function: count subarrays with AT MOST k distinct
    function atMostKDistinct(k) {
        const count = {};
        let left = 0;
        let result = 0;
        
        for (let right = 0; right < arr.length; right++) {
            const num = arr[right];
            count[num] = (count[num] || 0) + 1;
            
            // Shrink window if more than k distinct
            while (Object.keys(count).length > k) {
                count[arr[left]]--;
                if (count[arr[left]] === 0) delete count[arr[left]];
                left++;
            }
            
            // All subarrays ending at right with at most k distinct
            result += right - left + 1;
        }
        
        return result;
    }
    
    // Exactly K = At Most K - At Most K-1
    return atMostKDistinct(k) - atMostKDistinct(k - 1);
}`}
            language="javascript"
          />
        )}
        {activeCodeLang === 'python' && (
          <ShikiCodeBlock
            code={`def subarrays_with_k_distinct(arr, k):
    def at_most_k_distinct(k):
        count = {}
        left = 0
        result = 0
        
        for right in range(len(arr)):
            num = arr[right]
            count[num] = count.get(num, 0) + 1
            
            # Shrink window if more than k distinct
            while len(count) > k:
                count[arr[left]] -= 1
                if count[arr[left]] == 0:
                    del count[arr[left]]
                left += 1
            
            # All subarrays ending at right
            result += right - left + 1
        
        return result
    
    # Exactly K = At Most K - At Most K-1
    return at_most_k_distinct(k) - at_most_k_distinct(k - 1)`}
            language="python"
          />
        )}
        {activeCodeLang === 'java' && (
          <ShikiCodeBlock
            code={`public static int subarraysWithKDistinct(int[] arr, int k) {
    return atMostKDistinct(arr, k) - atMostKDistinct(arr, k - 1);
}

private static int atMostKDistinct(int[] arr, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0;
    int result = 0;
    
    for (int right = 0; right < arr.length; right++) {
        count.put(arr[right], count.getOrDefault(arr[right], 0) + 1);
        
        // Shrink window if more than k distinct
        while (count.size() > k) {
            int leftVal = arr[left];
            count.put(leftVal, count.get(leftVal) - 1);
            if (count.get(leftVal) == 0) {
                count.remove(leftVal);
            }
            left++;
        }
        
        // Add all subarrays ending at right
        result += right - left + 1;
    }
    
    return result;
}`}
            language="java"
          />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="algo-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Use Mathematical Trick</strong>
              <p>Exactly K = (At Most K) - (At Most K-1)</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Implement At Most K</strong>
              <p>Use standard sliding window to count subarrays with ≤ k distinct</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Expand and Contract</strong>
              <p>Expand right pointer to include new elements, contract left when exceeding k</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Count Valid Subarrays</strong>
              <p>For each position, all subarrays ending at right are valid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems - At Most/Exactly K</h2>
        <div className="problems-list">
          {problems.map(problem => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onSaveNote={handleSaveProblemNote}
              userId={user?.uid}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul>
          <li><strong>Mathematical approach:</strong> Exactly K = AtMostK - AtMostK-1 is often easier to implement</li>
          <li><strong>Frequency tracking:</strong> Use hash map to track element counts in window</li>
          <li><strong>Distinct count:</strong> Monitor the number of unique elements, not total count</li>
          <li><strong>Subarray counting:</strong> At each step, all subarrays from left to right are valid</li>
        </ul>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function FixedWindowVisualizer({ arr, k, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Play</strong> to see the window sliding</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="fixed-window-display">
        <div className="array-container">
          {arr.map((num, idx) => (
            <div
              key={idx}
              className={`array-cell ${
                idx >= step.left && idx <= step.right ? 'in-window' : ''
              } ${idx === step.currentIdx ? 'current' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className={`info-box ${step.type === 'slide' ? 'slide' : 'init'}`}>
        <strong>
          {step.type === 'init' ? 'Building Initial Window' : 'Sliding Window'}
        </strong>
        <p>
          Window: [{step.left}, {step.right}] | Sum: <code>{step.windowSum}</code>
        </p>
        {step.type === 'slide' && (
          <p>
            Removed: <code>{step.removed}</code> | Added: <code>{step.added}</code>
          </p>
        )}
      </div>
    </div>
  )
}

function DynamicWindowVisualizer({ str, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Play</strong> to see the window expand and contract</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="char-window-display">
        <div className="string-container">
          {str.split('').map((char, idx) => (
            <div
              key={idx}
              className={`char-cell ${
                idx >= step.left && idx <= step.right ? 'in-window' : ''
              } ${idx === step.right ? 'current' : ''}`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className={`info-box ${step.type === 'duplicate' ? 'error' : 'success'}`}>
        <strong>Step {visualization.currentStep + 1}</strong>
        {step.type === 'duplicate' ? (
          <p>
            ✗ Duplicate '{step.char}' found at position {step.right}!
            <br />
            Moving left pointer to skip previous duplicate
          </p>
        ) : (
          <p>
            ✓ Adding '{step.char}' | Current substring length: {step.currentLen}
          </p>
        )}
        <small>Window: [{step.left}, {step.right}]</small>
      </div>
    </div>
  )
}

function FrequencyWindowVisualizer({ s, target, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Play</strong> to see frequency matching in action</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="frequency-window-display">
        <div className="string-container">
          {s.split('').map((char, idx) => (
            <div
              key={idx}
              className={`char-cell ${
                idx >= step.left && idx <= step.right ? 'in-window' : ''
              } ${idx === step.right ? 'current' : ''}`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className={`info-box ${step.valid ? 'match' : ''}`}>
        <strong>{step.type === 'expand' ? '→ Expanding' : '← Contracting'}</strong>
        <p>
          Valid window: {step.valid ? '✓ YES' : '✗ NO'} ({step.have}/{step.need})
        </p>
        <small>Window: [{step.left}, {step.right}]</small>
      </div>

      <div className="frequency-info">
        <div className="target-info">
          <strong>Target chars needed:</strong>
          <span>{target.split('').join(', ')}</span>
        </div>
      </div>
    </div>
  )
}

function AtMostKVisualizer({ arr, k, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Play</strong> to see counting subarrays with exactly k distinct</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const distinctValues = Object.entries(step.count).map(([k, v]) => `${k}:${v}`)

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="atmostk-window-display">
        <div className="array-container">
          {arr.map((num, idx) => (
            <div
              key={idx}
              className={`array-cell ${
                idx >= step.left && idx <= step.right ? 'in-window' : ''
              } ${idx === step.right ? 'current' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className={`info-box ${step.distinctCount === k ? 'exact' : step.distinctCount < k ? 'under' : ''}`}>
        <strong>Step {visualization.currentStep + 1}</strong>
        <p>
          Distinct elements: {step.distinctCount} {step.distinctCount === k && '(Exactly K!)'}
        </p>
        <p>
          Subarrays ending here: {step.subarraysInThisStep} | Total so far: {step.totalSoFar}
        </p>
        <small>Window: [{step.left}, {step.right}] | Frequencies: {distinctValues.join(', ')}</small>
      </div>
    </div>
  )
}
