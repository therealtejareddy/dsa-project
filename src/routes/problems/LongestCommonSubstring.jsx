import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import CharRow from '../../components/CharRow'
import RecursionTree from '../../components/visualizers/RecursionTree'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

export default function LongestCommonSubstring() {
  const [str1, setStr1] = useState('ABCDE')
  const [str2, setStr2] = useState('ACDFE')
  const [activeTab, setActiveTab] = useState('recursion')
  const [visualization, setVisualization] = useState(null)
  const [result, setResult] = useState(null)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)

  // ─── Recursion ───────────────────────────────────────────────────────────────
  const lcsrRecursion = (text1, text2) => {
    const steps = []
    const treeNodes = []
    let nodeIdCounter = 0
    let best = ''

    const helper = (i, j, parentId = null, streak = '') => {
      const id = nodeIdCounter++
      const isBase = i >= text1.length || j >= text2.length
      const char1 = i < text1.length ? text1[i] : '∅'
      const char2 = j < text2.length ? text2[j] : '∅'
      const match = !isBase && char1 === char2

      const node = { id, parentId, i, j, isBase, match, streak, label: `(${i},${j})` }
      treeNodes.push(node)
      steps.push({ nodeId: id, i, j, char1, char2, match, isBase, streak, bestSoFar: best })

      if (isBase) {
        node.result = streak.length
        return streak
      }

      if (match) {
        const newStreak = streak + text1[i]
        if (newStreak.length > best.length) best = newStreak
        const res = helper(i + 1, j + 1, id, newStreak)
        node.result = res.length
        return res
      }

      helper(i + 1, j, id, '')
      helper(i, j + 1, id, '')
      node.result = streak.length
      return streak
    }

    helper(0, 0)
    treeNodes.forEach(n => {
      const s = steps.find(ss => ss.nodeId === n.id)
      if (s) s.result = n.result ?? 0
    })

    return { lcss: best, steps, treeNodes, callCount: treeNodes.length }
  }

  // ─── Tabulation ───────────────────────────────────────────────────────────────
  const lcsrTabulation = (text1, text2) => {
    const m = text1.length
    const n = text2.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    const steps = []
    let maxLen = 0
    let endIdx = 0

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const match = text1[i - 1] === text2[j - 1]
        if (match) {
          dp[i][j] = dp[i - 1][j - 1] + 1
          if (dp[i][j] > maxLen) {
            maxLen = dp[i][j]
            endIdx = i
          }
        } else {
          dp[i][j] = 0
        }
        steps.push({
          currentI: i,
          currentJ: j,
          char1: text1[i - 1],
          char2: text2[j - 1],
          match,
          dpSnapshot: dp.map(row => [...row]),
          maxLen,
        })
      }
    }

    const lcss = text1.substring(endIdx - maxLen, endIdx)
    return { lcss, steps, dp, length: maxLen }
  }

  // ─── Memoization (top-down suffix DP) ────────────────────────────────────────
  const lcsrMemoization = (text1, text2) => {
    const memo = {}
    const steps = []
    let best = ''

    const helper = (i, j) => {
      const key = `${i},${j}`
      steps.push({
        i, j,
        char1: i < text1.length ? text1[i] : '∅',
        char2: j < text2.length ? text2[j] : '∅',
        match: i < text1.length && j < text2.length && text1[i] === text2[j],
        isMemoized: key in memo,
        bestSoFar: best,
      })

      if (key in memo) return memo[key]
      if (i >= text1.length || j >= text2.length) { memo[key] = 0; return 0 }

      if (text1[i] === text2[j]) {
        memo[key] = 1 + helper(i + 1, j + 1)
      } else {
        memo[key] = 0
      }
      return memo[key]
    }

    for (let i = 0; i < text1.length; i++) {
      for (let j = 0; j < text2.length; j++) {
        const len = helper(i, j)
        if (len > best.length) best = text1.substring(i, i + len)
      }
    }

    return { lcss: best, steps, memoSize: Object.keys(memo).length }
  }

  // ─── Auto-compute ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!str1 || !str2) return
    let data
    if (activeTab === 'recursion') data = lcsrRecursion(str1, str2)
    else if (activeTab === 'memoization') data = lcsrMemoization(str1, str2)
    else data = lcsrTabulation(str1, str2)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.lcss)
    setIsPaused(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str1, str2, activeTab])

  const handleReset = () => {
    setVisualization(prev => prev ? { ...prev, currentStep: 0 } : prev)
    setIsPaused(true)
  }

  const handleNext = useCallback(() => {
    setVisualization(prev => {
      if (!prev || prev.currentStep >= prev.steps.length - 1) return prev
      return { ...prev, currentStep: prev.currentStep + 1 }
    })
  }, [])

  const handlePrev = useCallback(() => {
    setVisualization(prev => {
      if (!prev || prev.currentStep <= 0) return prev
      return { ...prev, currentStep: prev.currentStep - 1 }
    })
  }, [])

  useEffect(() => {
    if (!visualization || isPaused) return
    if (visualization.currentStep >= visualization.steps.length - 1) {
      setIsPaused(true)
      return
    }
    const delay = Math.max(50, 800 - speed * 1.3)
    const timer = setTimeout(() => {
      setVisualization(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
    }, delay)
    return () => clearTimeout(timer)
  }, [visualization, isPaused, speed])

  return (
    <div className="lcss-container">
      <PageHeader
        title="Longest Common Substring"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Dynamic Programming', className: 'topic' },
          { label: 'Strings', className: 'topic' },
        ]}
      />

      <main className="lcss-main">
        {/* Problem Statement */}
        <div className="card lcss-full-width">
          <h2>📋 Problem Statement</h2>
          <p>
            Given two strings <code>s1</code> and <code>s2</code>, find the length of the
            longest common substring. A <strong>substring</strong> is a sequence of characters
            that appears <strong>contiguously</strong> in a string (unlike a subsequence,
            characters cannot be skipped).
          </p>
          <p className="constraints-line">
            <span className="constraints-title">Constraints:</span>
            <code>1 &lt;= s1.length, s2.length &lt;= 1000</code>
            <span className="constraints-sep">|</span>
            <code>s1, s2</code> consist of lowercase English characters
          </p>
        </div>

        {/* Examples */}
        <div className="card lcss-full-width">
          <h2>📝 Examples</h2>
          <div className="examples-grid">
            <div className="example">
              <strong>Example 1:</strong>
              <pre>
Input:  s1 = "ABCDE", s2 = "ACDFE"
Output: "CD" (length = 2)
              </pre>
            </div>
            <div className="example">
              <strong>Example 2:</strong>
              <pre>
Input:  s1 = "AAAA", s2 = "AAAA"
Output: "AAAA" (length = 4)
              </pre>
            </div>
            <div className="example">
              <strong>Example 3:</strong>
              <pre>
Input:  s1 = "ABC", s2 = "DEF"
Output: "" (length = 0)
              </pre>
            </div>
          </div>
        </div>

        {/* LCS vs LCSS Comparison */}
        <div className="card lcss-full-width diff-card">
          <h2>🔍 Substring vs Subsequence</h2>
          <div className="diff-grid">
            <div className="diff-col">
              <div className="diff-title sub-str">Substring (contiguous)</div>
              <p>Characters must be adjacent. No skipping allowed.</p>
              <p>s1 = "ABCDE", s2 = "ACDFE" → <strong>"CD"</strong></p>
              <p>dp[i][j] resets to <strong>0</strong> on mismatch</p>
            </div>
            <div className="diff-divider">vs</div>
            <div className="diff-col">
              <div className="diff-title sub-seq">Subsequence (non-contiguous)</div>
              <p>Characters can be non-adjacent. Skipping allowed.</p>
              <p>s1 = "ABCDE", s2 = "ACDFE" → <strong>"ACDE"</strong></p>
              <p>dp[i][j] = max of neighbors on mismatch</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="card lcss-full-width input-card">
          <div className="input-bar">
            <div className="input-fields">
              <div className="input-inline">
                <label>s1</label>
                <input type="text" value={str1} onChange={e => setStr1(e.target.value.toUpperCase())} placeholder="e.g. ABCDE" maxLength="7" />
              </div>
              <div className="input-inline">
                <label>s2</label>
                <input type="text" value={str2} onChange={e => setStr2(e.target.value.toUpperCase())} placeholder="e.g. ACDFE" maxLength="7" />
              </div>
              {result !== null && (
                <div className="result-inline">
                  <span className="result-label">Substring</span>
                  <span className="result-val">{result || '∅'}</span>
                  <span className="result-len">len={result.length}</span>
                </div>
              )}
            </div>
            <div className="try-examples">
              <span className="try-label">Try:</span>
              {[
                { label: 'Classic',  t1: 'ABCDE',   t2: 'ACDFE' },
                { label: 'Same',     t1: 'AAAA',    t2: 'AAAA' },
                { label: 'No match', t1: 'ABC',     t2: 'DEF' },
                { label: 'Partial',  t1: 'XYZABCD', t2: 'ABCPQR' },
              ].map(ex => (
                <button
                  key={ex.label}
                  className={`example-chip ${str1 === ex.t1 && str2 === ex.t2 ? 'active' : ''}`}
                  onClick={() => { setStr1(ex.t1); setStr2(ex.t2) }}
                >
                  {ex.label}
                  <span className="chip-hint">{ex.t1} / {ex.t2}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Left panel */}
        <section className="lcss-left">
          <div className="card">
            <h2>💡 Intuition</h2>
            <p>
              Unlike LCS, a common substring must be contiguous. The key insight is:
            </p>
            <ul>
              <li><strong>Match:</strong> dp[i][j] = dp[i-1][j-1] + 1 — extend the streak</li>
              <li><strong>No match:</strong> dp[i][j] = 0 — the streak <em>resets</em></li>
              <li>Track the maximum value seen across the whole table</li>
            </ul>
          </div>

          {/* Complexity */}
          <div className="card">
            <h2>📈 Complexity Analysis</h2>
            {activeTab === 'recursion' && (
              <>
                <p><strong>Time:</strong> O(m × n × min(m,n)) — brute force over all starts</p>
                <p><strong>Space:</strong> O(min(m,n)) — recursion depth</p>
              </>
            )}
            {activeTab === 'memoization' && (
              <>
                <p><strong>Time:</strong> O(m × n) — each (i,j) pair computed once</p>
                <p><strong>Space:</strong> O(m × n) — memo table</p>
              </>
            )}
            {activeTab === 'tabulation' && (
              <>
                <p><strong>Time:</strong> O(m × n) — fill DP table</p>
                <p><strong>Space:</strong> O(m × n) — DP table (optimizable to O(n))</p>
              </>
            )}
          </div>

          {/* Common Mistakes */}
          <div className="card">
            <h2>⚠️ Common Mistakes</h2>
            <ul>
              <li>Confusing substring (contiguous) with subsequence (non-contiguous)</li>
              <li>Forgetting to reset dp[i][j] to 0 on mismatch</li>
              <li>Tracking max length but forgetting to track the end index for backtracking</li>
              <li>Off-by-one errors when slicing the result string</li>
            </ul>
          </div>
        </section>

        {/* Right panel */}
        <section className="lcss-right">
          <div className="card">
            <div className="tabs">
              {['recursion', 'memoization', 'tabulation'].map(tab => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'recursion' ? '🔄 Recursion' : tab === 'memoization' ? '💾 Memoization' : '📊 Tabulation'}
                </button>
              ))}
            </div>

            <VisualizerWrapper title="Longest Common Substring — Visualizer">
              <div className="visualizer">
                {activeTab === 'recursion' && <RecursionVisualizer str1={str1} str2={str2} visualization={visualization} />}
                {activeTab === 'memoization' && <MemoizationVisualizer str1={str1} str2={str2} visualization={visualization} />}
                {activeTab === 'tabulation' && <TabulationVisualizer str1={str1} str2={str2} visualization={visualization} />}

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
              </div>
            </VisualizerWrapper>
          </div>

          <div className="card">
            <h2>💻 Code</h2>
            {activeTab === 'recursion' && <CodeRecursion />}
            {activeTab === 'memoization' && <CodeMemoization />}
            {activeTab === 'tabulation' && <CodeTabulation />}
          </div>
        </section>
      </main>
    </div>
  )
}



// ─── Recursion Visualizer ────────────────────────────────────────────────────

function RecursionVisualizer({ str1, str2, visualization }) {
  if (!visualization) return <div className="visual-placeholder"><p>Select an approach and press Play</p></div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null
  const activeNodeId = step.nodeId
  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <CharRow label={`s1: ${str1}`} str={str1} activeIdx={step.i} />
      <CharRow label={`s2: ${str2}`} str={str2} activeIdx={step.j} />
      <div className={`info-box ${step.match ? 'match' : ''} ${step.isBase ? 'base' : ''}`}>
        <strong>Call #{visualization.currentStep + 1} — lcss({step.i}, {step.j})</strong>
        {step.isBase
          ? <p className="base-text">📍 Base case — end of string{step.streak ? `, streak "${step.streak}" ends` : ''}</p>
          : step.match
            ? <p className="match-text">✓ '{step.char1}' === '{step.char2}' — extend streak: "{step.streak}{step.char1}"</p>
            : <p>✗ '{step.char1}' ≠ '{step.char2}' — streak resets, explore both branches</p>
        }
        {step.bestSoFar && <p><small>Best so far: "<strong>{step.bestSoFar}</strong>" (len={step.bestSoFar.length})</small></p>}
        <small>Total calls: {visualization.currentStep + 1} / {visualization.steps.length}</small>
      </div>
      <div className="tree-section">
        <div className="tree-label">Recursion Tree</div>
        {visualization.treeNodes?.length > 80
          ? <div className="tree-too-large">Tree too large. Use strings ≤ 4 chars each for tree view.</div>
          : <RecursionTree treeNodes={visualization.treeNodes} activeNodeId={activeNodeId} />
        }
      </div>
    </div>
  )
}

// ─── Memoization Visualizer ───────────────────────────────────────────────────
function MemoizationVisualizer({ str1, str2, visualization }) {
  if (!visualization) return <div className="visual-placeholder"><p>Select an approach and press Play</p></div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memoSeen = {}
  for (let s = 0; s <= visualization.currentStep; s++) {
    const ss = visualization.steps[s]
    if (!ss.isMemoized) memoSeen[`${ss.i},${ss.j}`] = true
  }

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <CharRow label={`s1: ${str1}`} str={str1} activeIdx={step.i} />
      <CharRow label={`s2: ${str2}`} str={str2} activeIdx={step.j} />
      <div className={`info-box ${step.isMemoized ? 'memoized' : step.match ? 'match' : ''}`}>
        <strong>suffix({step.i}, {step.j})</strong>
        {step.isMemoized
          ? <p className="memoized-text">⚡ Cache hit — reuse stored length</p>
          : step.match
            ? <p className="match-text">✓ '{step.char1}' === '{step.char2}' — 1 + suffix({step.i + 1}, {step.j + 1})</p>
            : <p>✗ '{step.char1}' ≠ '{step.char2}' — streak ends, return 0</p>
        }
        <small>Cache entries: {Object.keys(memoSeen).length} | Step {visualization.currentStep + 1} / {visualization.steps.length}</small>
      </div>
      <div className="memo-grid-wrap">
        <div className="memo-grid-label">Memo Cache:</div>
        <div className="memo-grid">
          {Array.from({ length: str1.length + 1 }, (_, i) =>
            Array.from({ length: str2.length + 1 }, (_, j) => {
              const key = `${i},${j}`
              const isActive = step.i === i && step.j === j
              const isCached = key in memoSeen
              return (
                <div key={key} className={`memo-cell ${isActive ? 'active' : ''} ${isCached ? 'cached' : ''}`}>
                  {i},{j}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tabulation Visualizer ────────────────────────────────────────────────────
function TabulationVisualizer({ str1, str2, visualization }) {
  if (!visualization) return <div className="visual-placeholder"><p>Select an approach and press Play</p></div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dpToShow = step.dpSnapshot
  const { currentI, currentJ } = step

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <CharRow label={`s1: ${str1}`} str={str1} activeIdx={currentI - 1} />
      <CharRow label={`s2: ${str2}`} str={str2} activeIdx={currentJ - 1} />
      <div className={`info-box ${step.match ? 'match' : ''}`}>
        <strong>Filling dp[{currentI}][{currentJ}]</strong>
        <p>Comparing: <code>{step.char1}</code> (s1[{currentI - 1}]) vs <code>{step.char2}</code> (s2[{currentJ - 1}])</p>
        {step.match
          ? <p className="match-text">✓ Match! dp[{currentI}][{currentJ}] = dp[{currentI-1}][{currentJ-1}] + 1 = {dpToShow[currentI][currentJ]}</p>
          : <p>✗ No match → dp[{currentI}][{currentJ}] = <strong>0</strong> (streak resets)</p>
        }
        <small>Max substring length so far: {step.maxLen}</small>
      </div>
      <div className="dp-table">
        <div className="dp-axis-row">
          <div className="dp-corner" />
          <div className="dp-axis-cell dp-axis-spacer">ε</div>
          {str2.split('').map((c, j) => (
            <div key={j} className={`dp-axis-cell ${currentJ - 1 === j ? 'axis-active' : ''}`}>{c}</div>
          ))}
        </div>
        {dpToShow.map((row, i) => (
          <div key={i} className="dp-row">
            <div className={`dp-axis-cell ${i > 0 && currentI - 1 === i - 1 ? 'axis-active' : ''}`}>
              {i === 0 ? 'ε' : str1[i - 1]}
            </div>
            {row.map((val, j) => {
              const isCurrent = i === currentI && j === currentJ
              const isPast = (i < currentI) || (i === currentI && j < currentJ)
              const isHot = val > 0 && isPast
              return (
                <div key={j} className={`dp-cell ${isCurrent ? 'dp-current' : ''} ${isHot ? 'dp-hot' : isPast ? 'dp-past' : ''}`}>
                  {val}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Code blocks ─────────────────────────────────────────────────────────────
function CodeRecursion() {
  const code = `function longestCommonSubstring(s1, s2) {
  let best = "";

  function helper(i, j, current) {
    if (i >= s1.length || j >= s2.length) return;

    if (s1[i] === s2[j]) {
      const streak = current + s1[i];
      if (streak.length > best.length) best = streak;
      helper(i + 1, j + 1, streak); // extend streak
    }
    // try next starting positions
    helper(i + 1, j, "");
    helper(i, j + 1, "");
  }

  for (let i = 0; i < s1.length; i++)
    for (let j = 0; j < s2.length; j++)
      helper(i, j, "");

  return best;
}`
  return <ShikiCodeBlock code={code} language="javascript" />
}

function CodeMemoization() {
  const code = `function longestCommonSubstring(s1, s2) {
  const memo = {};
  let best = "";

  function suffixLen(i, j) {
    const key = \`\${i},\${j}\`;
    if (key in memo) return memo[key];
    if (i >= s1.length || j >= s2.length) return (memo[key] = 0);

    if (s1[i] === s2[j]) {
      memo[key] = 1 + suffixLen(i + 1, j + 1);
    } else {
      memo[key] = 0; // streak resets — key difference from LCS
    }
    return memo[key];
  }

  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      const len = suffixLen(i, j);
      if (len > best.length) best = s1.substring(i, i + len);
    }
  }
  return best;
}`
  return <ShikiCodeBlock code={code} language="javascript" />
}

function CodeTabulation() {
  const code = `function longestCommonSubstring(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxLen = 0, endIdx = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // extend streak
        if (dp[i][j] > maxLen) {
          maxLen = dp[i][j];
          endIdx = i; // track where it ends in s1
        }
      } else {
        dp[i][j] = 0; // ← resets to 0, unlike LCS!
      }
    }
  }

  return s1.substring(endIdx - maxLen, endIdx);
}`
  return <ShikiCodeBlock code={code} language="javascript" />
}
