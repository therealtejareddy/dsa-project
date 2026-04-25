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

export default function LongestCommonSubsequence() {
  const [str1, setStr1] = useState('ABCDE')
  const [str2, setStr2] = useState('ACDFE')
  const [activeTab, setActiveTab] = useState('recursion')
  const [visualization, setVisualization] = useState(null)
  const [result, setResult] = useState(null)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)

  // Recursion Approach — builds tree structure alongside steps
  const lcsRecursion = (text1, text2) => {
    const steps = []
    const treeNodes = []
    let nodeIdCounter = 0

    const helper = (i, j, parentId = null) => {
      const id = nodeIdCounter++
      const isBase = i >= text1.length || j >= text2.length
      const char1 = i < text1.length ? text1[i] : '∅'
      const char2 = j < text2.length ? text2[j] : '∅'
      const match = !isBase && char1 === char2

      const node = { id, parentId, i, j, isBase, match, result: null, label: `(${i},${j})` }
      treeNodes.push(node)

      steps.push({ nodeId: id, i, j, char1, char2, match, isBase })

      if (isBase) {
        node.result = ''
        return ''
      }

      if (match) {
        const res = text1[i] + helper(i + 1, j + 1, id)
        node.result = res
        return res
      }

      const opt1 = helper(i + 1, j, id)
      const opt2 = helper(i, j + 1, id)
      const res = opt1.length >= opt2.length ? opt1 : opt2
      node.result = res
      return res
    }

    const lcs = helper(0, 0)
    // Annotate each step with the result computed so far
    treeNodes.forEach(n => {
      const s = steps.find(ss => ss.nodeId === n.id)
      if (s) s.result = n.result ?? ''
    })
    return { lcs, steps, treeNodes, callCount: treeNodes.length }
  }

  // Memoization Approach
  const lcsMemoization = (text1, text2) => {
    const memo = {}
    const steps = []

    const helper = (i, j) => {
      const key = `${i},${j}`

      steps.push({
        i,
        j,
        text1Ptr: i,
        text2Ptr: j,
        match: i < text1.length && j < text2.length && text1[i] === text2[j],
        char1: i < text1.length ? text1[i] : '∅',
        char2: j < text2.length ? text2[j] : '∅',
        isMemoized: key in memo,
      })

      if (key in memo) {
        return memo[key]
      }

      if (i === text1.length || j === text2.length) {
        memo[key] = ''
        return ''
      }

      if (text1[i] === text2[j]) {
        memo[key] = text1[i] + helper(i + 1, j + 1)
      } else {
        const opt1 = helper(i + 1, j)
        const opt2 = helper(i, j + 1)
        memo[key] = opt1.length > opt2.length ? opt1 : opt2
      }

      return memo[key]
    }

    const lcs = helper(0, 0)
    return { lcs, steps, memoSize: Object.keys(memo).length }
  }

  // Tabulation Approach — snapshot dp state after each cell fill
  const lcsTabulation = (text1, text2) => {
    const m = text1.length
    const n = text2.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    const steps = []

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const match = text1[i - 1] === text2[j - 1]
        if (match) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
        steps.push({
          currentI: i,
          currentJ: j,
          char1: text1[i - 1],
          char2: text2[j - 1],
          match,
          dpSnapshot: dp.map(row => [...row]),
        })
      }
    }

    // Backtrack
    let lcs = ''
    let i = m, j = n
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcs = text1[i - 1] + lcs
        i--; j--
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }

    return { lcs, steps, dp, length: dp[m][n] }
  }

  // Auto-compute whenever inputs or active tab change
  useEffect(() => {
    let data
    if (activeTab === 'recursion') data = lcsRecursion(str1, str2)
    else if (activeTab === 'memoization') data = lcsMemoization(str1, str2)
    else data = lcsTabulation(str1, str2)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.lcs)
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
      setVisualization(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }))
    }, delay)
    return () => clearTimeout(timer)
  }, [visualization, isPaused, speed])

  return (
    <div className="lcs-container">
      <PageHeader
        title="Longest Common Subsequence"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Dynamic Programming', className: 'topic' },
        ]}
      />

      <main className="lcs-main">
        {/* Full-width top cards */}
        <div className="card lcs-full-width">
          <h2>📋 Problem Statement</h2>
          <p>
            Given two strings <code>text1</code> and <code>text2</code>, return
            the length of their longest common subsequence. A subsequence of a
            string is a new string generated from the original string with some
            characters (can be none) deleted without changing the relative
            order of the remaining characters.
          </p>
          <p className="constraints-line">
            <span className="constraints-title">Constraints:</span>
            <code>1 &lt;= text1.length, text2.length &lt;= 1000</code>
            <span className="constraints-sep">|</span>
            <code>text1, text2</code> consist of lowercase English characters
          </p>
        </div>

        <div className="card lcs-full-width">
          <h2>📝 Examples</h2>
          <div className="examples-grid">
            <div className="example">
              <strong>Example 1:</strong>
              <pre>
Input: text1 = "ABCDGH", text2 = "AEDFHR"
Output: "ADH" (length = 3)
              </pre>
            </div>
            <div className="example">
              <strong>Example 2:</strong>
              <pre>
Input: text1 = "abc", text2 = "abc"
Output: "abc" (length = 3)
              </pre>
            </div>
            <div className="example">
              <strong>Example 3:</strong>
              <pre>
Input: text1 = "abc", text2 = "def"
Output: "" (length = 0)
              </pre>
            </div>
          </div>
        </div>

        {/* Full-width compact input bar */}
        <div className="card lcs-full-width input-card">
          <div className="input-bar">
            <div className="input-fields">
              <div className="input-inline">
                <label>Text 1</label>
                <input
                  type="text"
                  value={str1}
                  onChange={(e) => setStr1(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE"
                  maxLength="6"
                />
              </div>
              <div className="input-inline">
                <label>Text 2</label>
                <input
                  type="text"
                  value={str2}
                  onChange={(e) => setStr2(e.target.value.toUpperCase())}
                  placeholder="e.g. ACDFE"
                  maxLength="6"
                />
              </div>
              {result !== null && (
                <div className="result-inline">
                  <span className="result-label">LCS</span>
                  <span className="result-val">{result || '∅'}</span>
                  <span className="result-len">len={result.length}</span>
                </div>
              )}
            </div>

            <div className="try-examples">
              <span className="try-label">Try:</span>
              {[
                { label: 'Classic', t1: 'ABCDE', t2: 'ACDFE' },
                { label: 'Same', t1: 'ABC', t2: 'ABC' },
                { label: 'No match', t1: 'ABC', t2: 'DEF' },
                { label: 'Partial', t1: 'AGGTAB', t2: 'GXTXAY' },
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

        {/* Left Panel */}
        <section className="lcs-left">
          {/* Intuition */}
          <div className="card">
            <h2>💡 Intuition</h2>
            <p>
              This is a classic Dynamic Programming problem. At each character,
              we have two choices:
            </p>
            <ul>
              <li>
                <strong>Characters match:</strong> Include it in LCS and move to
                next chars
              </li>
              <li>
                <strong>Characters don't match:</strong> Try both possibilities
                (skip char1 or skip char2) and take the longer result
              </li>
            </ul>
          </div>
        </section>

        {/* Right Panel */}
        <section className="lcs-right">
          {/* Approach Tabs */}
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

            {/* Visualizer */}
            <VisualizerWrapper title="Longest Common Subsequence — Visualizer">
              <div className="visualizer">
                {activeTab === 'recursion' && (
                  <RecursionVisualizer
                    str1={str1}
                    str2={str2}
                    visualization={visualization}
                  />
                )}
                {activeTab === 'memoization' && (
                  <MemoizationVisualizer
                    str1={str1}
                    str2={str2}
                    visualization={visualization}
                  />
                )}
                {activeTab === 'tabulation' && (
                  <TabulationVisualizer
                    str1={str1}
                    str2={str2}
                    visualization={visualization}
                  />
                )}

                {/* Playback Controls */}
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

          {/* Code */}
          <div className="card">
            <h2>💻 Code</h2>
            {activeTab === 'recursion' && <CodeRecursion />}
            {activeTab === 'memoization' && <CodeMemoization />}
            {activeTab === 'tabulation' && <CodeTabulation />}
          </div>

          {/* Complexity */}
          <div className="card">
            <h2>📈 Complexity Analysis</h2>
            {activeTab === 'recursion' && (
              <>
                <p>
                  <strong>Time:</strong> O(2^(m+n)) - Explores all combinations
                </p>
                <p>
                  <strong>Space:</strong> O(max(m, n)) - Recursion stack depth
                </p>
              </>
            )}
            {activeTab === 'memoization' && (
              <>
                <p>
                  <strong>Time:</strong> O(m × n) - Each state computed once
                </p>
                <p>
                  <strong>Space:</strong> O(m × n) - Memoization storage
                </p>
              </>
            )}
            {activeTab === 'tabulation' && (
              <>
                <p>
                  <strong>Time:</strong> O(m × n) - Fill DP table completely
                </p>
                <p>
                  <strong>Space:</strong> O(m × n) - DP table storage
                </p>
              </>
            )}
          </div>

          {/* Common Mistakes */}
          <div className="card">
            <h2>⚠️ Common Mistakes</h2>
            <ul>
              <li>Confusing subsequence with substring</li>
              <li>Not handling empty strings correctly</li>
              <li>Forgetting to check if characters match before recursing</li>
              <li>Index confusion in 0-indexed vs 1-indexed approaches</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}







// ─── Recursion Visualizer ─────────────────────────────────────────────────────
function RecursionVisualizer({ str1, str2, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Play</strong> to see recursion in action</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null
  const activeNodeId = step.nodeId

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <CharRow label={`Text1: ${str1}`} str={str1} activeIdx={step.i} />
      <CharRow label={`Text2: ${str2}`} str={str2} activeIdx={step.j} />

      <div className={`info-box ${step.match ? 'match' : ''} ${step.isBase ? 'base' : ''}`}>
        <strong>Call #{visualization.currentStep + 1} — lcs({step.i}, {step.j})</strong>
        {step.isBase
          ? <p className="base-text">📍 Base case reached — return ""</p>
          : step.match
            ? <p className="match-text">✓ '{step.char1}' === '{step.char2}' — include in LCS</p>
            : <p>✗ '{step.char1}' ≠ '{step.char2}' — explore both branches</p>
        }
        <small>Total calls so far: {visualization.currentStep + 1} / {visualization.steps.length}</small>
      </div>

      <div className="tree-section">
        <div className="tree-label">Recursion Tree</div>
        {visualization.treeNodes?.length > 80 ? (
          <div className="tree-too-large">Tree too large to display. Use strings ≤ 4 chars each for tree view.</div>
        ) : (
          <RecursionTree treeNodes={visualization.treeNodes} activeNodeId={activeNodeId} />
        )}
      </div>
    </div>
  )
}

// ─── Memoization Visualizer ───────────────────────────────────────────────────
function MemoizationVisualizer({ str1, str2, visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Run</strong> to see memoization in action</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  // Build memo state up to current step
  const memoSeen = {}
  for (let s = 0; s <= visualization.currentStep; s++) {
    const ss = visualization.steps[s]
    if (!ss.isMemoized) memoSeen[`${ss.i},${ss.j}`] = true
  }

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <CharRow label={`Text1: ${str1}`} str={str1} activeIdx={step.text1Ptr} />
      <CharRow label={`Text2: ${str2}`} str={str2} activeIdx={step.text2Ptr} />

      <div className={`info-box ${step.isMemoized ? 'memoized' : step.match ? 'match' : ''}`}>
        <strong>Step {visualization.currentStep + 1} — lcs({step.i}, {step.j})</strong>
        {step.isMemoized
          ? <p className="memoized-text">⚡ Cache hit! Answer already computed — skip recomputation</p>
          : step.match
            ? <p className="match-text">✓ '{step.char1}' === '{step.char2}' — match, recurse diagonally</p>
            : <p>✗ '{step.char1}' ≠ '{step.char2}' — try both branches</p>
        }
        <small>Cache entries so far: {Object.keys(memoSeen).length}</small>
      </div>

      {/* Memo cache visual */}
      <div className="memo-grid-wrap">
        <div className="memo-grid-label">Memo Cache (visited states):</div>
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
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>Click <strong>Run</strong> to see the DP table filled cell by cell</p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dpToShow = step.dpSnapshot
  const { currentI, currentJ } = step

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <CharRow label={`Text1: ${str1}`} str={str1} activeIdx={currentI - 1} />
      <CharRow label={`Text2: ${str2}`} str={str2} activeIdx={currentJ - 1} />

      <div className={`info-box ${step.match ? 'match' : ''}`}>
        <strong>Filling dp[{currentI}][{currentJ}]</strong>
        <p>
          Comparing: <code>{step.char1}</code> (text1[{currentI - 1}]) vs <code>{step.char2}</code> (text2[{currentJ - 1}])
        </p>
        {step.match
          ? <p className="match-text">✓ Match! dp[{currentI}][{currentJ}] = dp[{currentI-1}][{currentJ-1}] + 1 = {dpToShow[currentI][currentJ]}</p>
          : <p>✗ No match. dp[{currentI}][{currentJ}] = max(dp[{currentI-1}][{currentJ}], dp[{currentI}][{currentJ-1}]) = {dpToShow[currentI][currentJ]}</p>
        }
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
              return (
                <div
                  key={j}
                  className={`dp-cell ${isCurrent ? 'dp-current' : ''} ${isPast ? 'dp-past' : ''}`}
                >
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

// Code Components
function CodeRecursion() {
  const code = `function longestCommonSubsequence(text1, text2) {
    function lcs(i, j) {
        // Base case
        if (i === text1.length || j === text2.length) {
            return "";
        }
        
        // Characters match
        if (text1[i] === text2[j]) {
            return text1[i] + lcs(i + 1, j + 1);
        }
        
        // Try both options, return longer
        const opt1 = lcs(i + 1, j);
        const opt2 = lcs(i, j + 1);
        
        return opt1.length > opt2.length ? opt1 : opt2;
    }
    
    return lcs(0, 0);
}`

  return <CodeBlock code={code} language="javascript" />
}

function CodeMemoization() {
  const code = `function longestCommonSubsequence(text1, text2) {
    const memo = {};
    
    function lcs(i, j) {
        // Check memo
        const key = \`\${i},\${j}\`;
        if (key in memo) return memo[key];
        
        // Base case
        if (i === text1.length || j === text2.length) {
            return "";
        }
        
        let result;
        
        // Characters match
        if (text1[i] === text2[j]) {
            result = text1[i] + lcs(i + 1, j + 1);
        } else {
            // Try both, take longer
            const opt1 = lcs(i + 1, j);
            const opt2 = lcs(i, j + 1);
            result = opt1.length > opt2.length ? opt1 : opt2;
        }
        
        memo[key] = result;
        return result;
    }
    
    return lcs(0, 0);
}`

  return <CodeBlock code={code} language="javascript" />
}

function CodeTabulation() {
  const code = `function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table
    const dp = Array.from({ length: m + 1 }, () => 
        Array(n + 1).fill(0)
    );
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtrack to find LCS string
    let lcs = "";
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}`

  return <CodeBlock code={code} language="javascript" />
}

function CodeBlock({ code, language }) {
  return <ShikiCodeBlock code={code} language={language} />
}
