import { useState, useEffect, useCallback, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

// ─── Algorithm Step Generators ────────────────────────────────────────────────

function generateBruteForceSteps(s) {
  const steps = []
  let maxLen = 0
  let best = ''

  steps.push({
    phase: 'init',
    left: 0, right: 0,
    window: '',
    set: [],
    description: 'Check every possible substring for uniqueness.',
    best: '',
    highlight: [],
    duplicate: -1,
  })

  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const sub = s.slice(i, j + 1)
      const seen = new Set()
      let isDup = false
      let dupIdx = -1

      for (let k = 0; k < sub.length; k++) {
        if (seen.has(sub[k])) { isDup = true; dupIdx = i + k; break }
        seen.add(sub[k])
      }

      steps.push({
        phase: isDup ? 'duplicate' : 'valid',
        left: i,
        right: j,
        window: sub,
        set: [...seen],
        description: isDup
          ? `s[${i}..${j}]="${sub}" → duplicate '${s[dupIdx]}' at index ${dupIdx}. Skip.`
          : `s[${i}..${j}]="${sub}" → all unique! Length=${sub.length}`,
        best,
        highlight: Array.from({ length: j - i + 1 }, (_, k) => i + k),
        duplicate: dupIdx,
      })

      if (!isDup && sub.length > maxLen) {
        maxLen = sub.length
        best = sub
      }
    }
  }

  steps.push({
    phase: 'done',
    left: -1, right: -1,
    window: best,
    set: [],
    description: `Done! Longest substring without repeating chars = "${best}" (length ${maxLen})`,
    best,
    highlight: [],
    duplicate: -1,
  })

  return { steps, result: maxLen, best }
}

function generateSlidingWindowSteps(s) {
  const steps = []
  const charMap = {} // char → last seen index
  let left = 0
  let maxLen = 0
  let best = ''
  let bestLeft = 0

  steps.push({
    phase: 'init',
    left: 0, right: -1,
    window: '',
    charMap: {},
    description: 'Initialize left=0, right=-1. Expand right one character at a time.',
    best: '',
    shrink: false,
    newChar: '',
    dupChar: '',
  })

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]

    steps.push({
      phase: 'expand',
      left, right,
      window: s.slice(left, right + 1),
      charMap: { ...charMap },
      description: `Expand: check s[${right}]='${ch}'. Is '${ch}' in current window [${left}..${right - 1}]?`,
      best,
      shrink: false,
      newChar: ch,
      dupChar: '',
    })

    if (charMap[ch] !== undefined && charMap[ch] >= left) {
      // duplicate found — move left past the old position
      const oldLeft = left
      left = charMap[ch] + 1

      steps.push({
        phase: 'shrink',
        left, right,
        window: s.slice(left, right + 1),
        charMap: { ...charMap, [ch]: right },
        description: `'${ch}' was at index ${charMap[ch]} (inside window). Move left from ${oldLeft} to ${left}. Window shrinks.`,
        best,
        shrink: true,
        newChar: ch,
        dupChar: ch,
      })
    } else {
      steps.push({
        phase: 'add',
        left, right,
        window: s.slice(left, right + 1),
        charMap: { ...charMap, [ch]: right },
        description: `'${ch}' is new. Add to window. Window="${s.slice(left, right + 1)}" length=${right - left + 1}`,
        best,
        shrink: false,
        newChar: ch,
        dupChar: '',
      })
    }

    charMap[ch] = right

    const curLen = right - left + 1
    if (curLen > maxLen) {
      maxLen = curLen
      best = s.slice(left, right + 1)
      bestLeft = left
    }

    steps.push({
      phase: 'update',
      left, right,
      window: s.slice(left, right + 1),
      charMap: { ...charMap },
      description: `Window="${s.slice(left, right + 1)}" length=${curLen}. Max so far=${maxLen} ("${best}")`,
      best,
      shrink: false,
      newChar: '',
      dupChar: '',
    })
  }

  steps.push({
    phase: 'done',
    left: bestLeft, right: bestLeft + maxLen - 1,
    window: best,
    charMap: {},
    description: `Done! Longest substring = "${best}" (length ${maxLen})`,
    best,
    shrink: false,
    newChar: '',
    dupChar: '',
  })

  return { steps, result: maxLen, best }
}

// ─── String Visualizer (sliding window character view) ────────────────────────

function StringVisualizer({ s, step, mode }) {
  if (!s || !step) return null

  const { left, right, newChar, dupChar, phase } = step

  return (
    <div className="sv-wrap">
      <div className="sv-chars">
        {s.split('').map((ch, idx) => {
          let cls = 'sv-char'
          const inWindow = idx >= left && idx <= right && left >= 0 && right >= 0

          if (phase === 'done' && inWindow) cls += ' sv-best'
          else if (inWindow) {
            if (mode === 'brute') {
              cls += step.duplicate === idx ? ' sv-dup' : ' sv-active'
            } else {
              cls += dupChar && ch === dupChar && idx === step.left - 1 ? ' sv-dup'
                : dupChar && ch === dupChar && idx === right ? ' sv-dup'
                : ' sv-active'
            }
          }

          return (
            <div key={idx} className={cls}>
              <span className="sv-ch">{ch}</span>
              <span className="sv-idx">{idx}</span>
            </div>
          )
        })}
      </div>

      {/* Window bracket */}
      {left >= 0 && right >= left && (
        <div className="sv-bracket-row">
          {s.split('').map((_, idx) => {
            const inW = idx >= left && idx <= right
            return (
              <div key={idx} className={`sv-bracket-cell ${inW ? 'in' : ''} ${idx === left ? 'brace-left' : ''} ${idx === right ? 'brace-right' : ''}`}>
                {idx === left && <span className="sv-pointer sv-l">L</span>}
                {idx === right && mode !== 'brute' && <span className="sv-pointer sv-r">R</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Hash Map Panel ───────────────────────────────────────────────────────────

function HashMapPanel({ charMap, windowStr, dupChar }) {
  const entries = Object.entries(charMap)
  if (entries.length === 0) return (
    <div className="hm-empty">HashMap (char → last index) is empty</div>
  )
  return (
    <div className="hm-wrap">
      <div className="hm-title">HashMap: char → last index</div>
      <div className="hm-entries">
        {entries.map(([ch, idx]) => {
          const inWindow = windowStr.includes(ch)
          const isDup = ch === dupChar
          return (
            <div key={ch} className={`hm-entry ${isDup ? 'hm-dup' : ''} ${inWindow ? 'hm-active' : 'hm-stale'}`}>
              <span className="hm-ch">'{ch}'</span>
              <span className="hm-arrow">→</span>
              <span className="hm-idx">{idx}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Brute Force Visualizer ───────────────────────────────────────────────────

function BruteForceVisualizer({ s, visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see brute force approach</p>
    </div>
  )

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const phaseClass = {
    init: '', valid: 'match', duplicate: 'warning', done: 'match'
  }

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <StringVisualizer s={s} step={step} mode="brute" />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>Step {visualization.currentStep + 1} / {visualization.steps.length}</strong>
        <p>{step.description}</p>
        {step.set.length > 0 && (
          <p><small>Chars seen: {step.set.map(c => `'${c}'`).join(', ')}</small></p>
        )}
        {step.best && <p><small>Best so far: <strong>"{step.best}"</strong></small></p>}
      </div>
    </div>
  )
}

// ─── Sliding Window Visualizer ────────────────────────────────────────────────

function SlidingWindowVisualizer({ s, visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see sliding window approach</p>
    </div>
  )

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const phaseClass = {
    init: '', expand: '', add: 'match', shrink: 'warning',
    update: 'info', done: 'match'
  }

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <StringVisualizer s={s} step={step} mode="sliding" />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>
          Step {visualization.currentStep + 1} / {visualization.steps.length} — {step.phase.toUpperCase()}
        </strong>
        <p>{step.description}</p>
        {step.window && step.phase !== 'init' && (
          <p>
            <small>
              Window: <strong>"{step.window}"</strong>
              {' · '}Left={step.left} Right={step.right}
            </small>
          </p>
        )}
      </div>
      <HashMapPanel
        charMap={step.charMap}
        windowStr={step.window}
        dupChar={step.dupChar}
      />
    </div>
  )
}

// ─── Code Panel ───────────────────────────────────────────────────────────────

const CODE = {
  python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}   # char → last seen index
    left = 0
    max_len = 0

    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1   # shrink window
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)

    return max_len`,

  java: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (map.containsKey(ch) && map.get(ch) >= left) {
            left = map.get(ch) + 1;    // shrink
        }
        map.put(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}`,

  cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> mp;
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.size(); right++) {
        char ch = s[right];
        if (mp.count(ch) && mp[ch] >= left) {
            left = mp[ch] + 1;         // shrink
        }
        mp[ch] = right;
        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}`,

  javascript: `function lengthOfLongestSubstring(s) {
    const map = new Map();  // char → last index
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (map.has(ch) && map.get(ch) >= left) {
            left = map.get(ch) + 1;    // shrink window
        }
        map.set(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}`,
}

function CodePanel() {
  const [lang, setLang] = useState('python')
  return (
    <div>
      <div className="tabs">
        {Object.keys(CODE).map((l) => (
          <button key={l} className={`tab ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
      <ShikiCodeBlock code={CODE[lang]} language={lang} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Classic', raw: 'abcabcbb', hint: 'ans=3' },
  { label: 'All same', raw: 'bbbbb', hint: 'ans=1' },
  { label: 'No repeat', raw: 'abcdef', hint: 'ans=6' },
  { label: 'Mixed', raw: 'pwwkew', hint: 'ans=3' },
  { label: 'With space', raw: 'tmmzuxt', hint: 'ans=5' },
]

export default function LongestSubstringNoRepeat() {
  const [input, setInput] = useState('abcabcbb')
  const [activeTab, setActiveTab] = useState('sliding')
  const [visualization, setVisualization] = useState(null)
  const [result, setResult] = useState(null)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const timerRef = useRef(null)

  const buildVisualization = useCallback((s, algo) => {
    if (!s) return
    const gen = algo === 'brute' ? generateBruteForceSteps : generateSlidingWindowSteps
    const { steps, result: res, best } = gen(s)
    setVisualization({ steps, currentStep: 0 })
    setResult({ len: res, best })
    setIsPaused(true)
  }, [])

  useEffect(() => {
    if (input.length > 0 && input.length <= 20) {
      buildVisualization(input, activeTab)
    }
  }, [input, activeTab, buildVisualization])

  useEffect(() => {
    if (!isPaused && visualization) {
      timerRef.current = setInterval(() => {
        setVisualization((prev) => {
          if (!prev) return prev
          if (prev.currentStep >= prev.steps.length - 1) {
            setIsPaused(true)
            return prev
          }
          return { ...prev, currentStep: prev.currentStep + 1 }
        })
      }, 650 - speed)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, speed, visualization])

  const handleReset = () => {
    clearInterval(timerRef.current)
    setIsPaused(true)
    setVisualization((prev) => prev ? { ...prev, currentStep: 0 } : prev)
  }
  const handlePlay = () => setIsPaused(false)
  const handlePause = () => { clearInterval(timerRef.current); setIsPaused(true) }
  const handleNext = () => setVisualization((prev) => {
    if (!prev || prev.currentStep >= prev.steps.length - 1) return prev
    return { ...prev, currentStep: prev.currentStep + 1 }
  })
  const handlePrev = () => setVisualization((prev) => {
    if (!prev || prev.currentStep <= 0) return prev
    return { ...prev, currentStep: prev.currentStep - 1 }
  })

  return (
    <div className="lsnr-container">
      <PageHeader
        title="3. Longest Substring Without Repeating Characters"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'String', className: 'topic' },
          { label: 'Hash Map', className: 'topic' },
          { label: 'Sliding Window', className: 'topic' },
        ]}
      />

      <div className="lsnr-main">
        {/* ── Full-width: Problem Statement ── */}
        <div className="lsnr-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given a string <code>s</code>, find the length of the{' '}
              <strong>longest substring without repeating characters</strong>.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>0 ≤ s.length ≤ 5 × 10⁴</code>
              <span className="constraints-sep">·</span>
              <code>s</code> consists of English letters, digits, symbols and spaces
            </div>
          </div>
        </div>

        {/* ── Full-width: Input Bar ── */}
        <div className="lsnr-full-width">
          <div className="card input-card">
            <div className="input-bar">
              <div className="input-fields">
                <div className="input-inline">
                  <label>String s</label>
                  <input
                    type="text"
                    value={input}
                    maxLength={20}
                    onChange={(e) => setInput(e.target.value.replace(/\s/, ''))}
                    placeholder="abcabcbb"
                    style={{ width: 160 }}
                  />
                  {input.length > 20 && (
                    <span style={{ fontSize: 11, color: 'var(--error)' }}>Max 20 chars for visualization</span>
                  )}
                </div>
              </div>

              {result && (
                <div className="result-inline">
                  <span className="result-label">LENGTH</span>
                  <span className="result-val" style={{ letterSpacing: 0 }}>{result.len}</span>
                  {result.best && <span className="result-len">"{result.best}"</span>}
                </div>
              )}

              <div className="try-examples">
                <span className="try-label">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    className={`example-chip ${input === ex.raw ? 'active' : ''}`}
                    onClick={() => setInput(ex.raw)}
                  >
                    {ex.label}
                    <span className="chip-hint">{ex.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Left Column ── */}
        <div className="lsnr-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  s = "abcabcbb"
Output: 3
Explain: "abc" — length 3`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  s = "bbbbb"
Output: 1
Explain: "b" — length 1`}</pre>
              </div>
              <div className="example">
                <strong>Example 3</strong>
                <pre>{`Input:  s = "pwwkew"
Output: 3
Explain: "wke" — length 3`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              A substring is valid if it has <strong>no duplicate characters</strong>. The brute force
              checks every O(n²) substring — too slow.
            </p>
            <p>
              The insight: use a <strong>sliding window</strong> with two pointers <code>left</code> and{' '}
              <code>right</code>. As <code>right</code> expands, if the new character already exists
              inside the window, move <code>left</code> forward to just past its last occurrence.
              A hash map stores <code>char → last index</code> so the jump is O(1).
            </p>
            <p>
              The window always represents the longest valid substring <em>ending at</em>{' '}
              <code>right</code>.
            </p>
          </div>

          <div className="card">
            <h2>Approaches</h2>
            <div className="approaches-tabs">
              <div className="approach-block brute">
                <div className="approach-title">🐢 Brute Force</div>
                <p>Try every substring s[i..j], check if all characters are unique using a Set.</p>
                <div className="complexity-row">
                  <span className="complexity bad">Time: O(n³)</span>
                  <span className="complexity ok">Space: O(min(n, m))</span>
                </div>
                <p className="approach-why">O(n²) substrings × O(n) uniqueness check each.</p>
              </div>
              <div className="approach-block better">
                <div className="approach-title">⚡ Sliding Window + HashMap</div>
                <p>
                  One pass: expand <code>right</code>, jump <code>left</code> past duplicates using a map.
                </p>
                <div className="complexity-row">
                  <span className="complexity good">Time: O(n)</span>
                  <span className="complexity ok">Space: O(min(n, m))</span>
                </div>
                <p className="approach-why">Each character is visited at most twice (once by right, once by left).</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Pattern Recognition</h2>
            <p>
              This is the canonical <strong>Sliding Window</strong> problem. Recognize it when:
            </p>
            <ul>
              <li>You need the <em>longest/shortest</em> subarray/substring satisfying a condition</li>
              <li>The condition can be maintained as a window expands/shrinks</li>
            </ul>
            <p style={{ marginTop: 10 }}>Related problems using the same pattern:</p>
            <ul>
              <li><strong>Minimum Window Substring</strong> (LC 76)</li>
              <li><strong>Longest Repeating Character Replacement</strong> (LC 424)</li>
              <li><strong>Fruit Into Baskets</strong> (LC 904)</li>
              <li><strong>Permutation in String</strong> (LC 567)</li>
            </ul>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="lsnr-right">
          <div className="card">
            <div className="viz-header">
              <h2>Visualizer</h2>
              <div className="algo-switch">
                <button
                  className={`algo-btn ${activeTab === 'sliding' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sliding')}
                >
                  Sliding Window
                </button>
                <button
                  className={`algo-btn ${activeTab === 'brute' ? 'active' : ''}`}
                  onClick={() => setActiveTab('brute')}
                >
                  Brute Force
                </button>
              </div>
            </div>

            <VisualizerWrapper title="Longest Substring Without Repeating Characters">
              <div className="visualizer">
                {activeTab === 'brute'
                  ? <BruteForceVisualizer s={input} visualization={visualization} />
                  : <SlidingWindowVisualizer s={input} visualization={visualization} />
                }
              </div>

              {visualization && (
                <PlaybackControls
                  isPaused={isPaused}
                  currentStep={visualization.currentStep}
                  totalSteps={visualization.steps.length}
                  onReset={handleReset}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  speed={speed}
                  onSpeedChange={setSpeed}
                />
              )}
            </VisualizerWrapper>
          </div>

          <div className="card">
            <h2>Dry Run — "abcabcbb"</h2>
            <div className="dry-run-table-wrap">
              <table className="dry-run-table">
                <thead>
                  <tr>
                    <th>right</th>
                    <th>ch</th>
                    <th>in window?</th>
                    <th>left</th>
                    <th>window</th>
                    <th>len</th>
                    <th>max</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [0,'a','No (new)',0,'"a"',1,1],
                    [1,'b','No (new)',0,'"ab"',2,2],
                    [2,'c','No (new)',0,'"abc"',3,3],
                    [3,'a','Yes! at 0',1,'"bca"',3,3],
                    [4,'b','Yes! at 1',2,'"cab"',3,3],
                    [5,'c','Yes! at 2',3,'"abc"',3,3],
                    [6,'b','Yes! at 4',5,'"cb"',2,3],
                    [7,'b','Yes! at 6',7,'"b"',1,3],
                  ].map(([r, ch, inW, l, win, len, mx]) => (
                    <tr key={r}>
                      <td>{r}</td>
                      <td><strong>{ch}</strong></td>
                      <td className={inW.startsWith('Yes') ? 'yes' : 'no'}>{inW}</td>
                      <td>{l}</td>
                      <td>{win}</td>
                      <td>{len}</td>
                      <td><strong>{mx}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Code</h2>
            <CodePanel />
          </div>

          <div className="card">
            <h2>Interview Notes</h2>
            <ul>
              <li>
                <strong>Key condition:</strong> <code>map.get(ch) &gt;= left</code> — a stale entry (char seen before current window) must be ignored. Common bug: not checking <code>&gt;= left</code>.
              </li>
              <li>
                <strong>Edge cases:</strong> empty string (return 0), single character (return 1), all duplicates like "aaaa" (return 1)
              </li>
              <li>
                <strong>Variant:</strong> "At most K distinct characters" — same pattern, track count in map
              </li>
              <li>
                <strong>Follow-ups:</strong> Return actual substring (not just length), handle Unicode characters
              </li>
              <li>
                <strong>Interviewer expects:</strong> Immediately name Sliding Window pattern, explain left-pointer jump instead of crawl, mention O(n) vs O(n³) brute force
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
