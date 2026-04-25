import { useState, useEffect, useCallback, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

// ─── Algorithm Helpers ────────────────────────────────────────────────────────

function parsIntervals(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (iv) => Array.isArray(iv) && iv.length === 2 && iv.every((v) => typeof v === 'number'),
      )
    ) {
      return parsed
    }
  } catch (_) {}
  return null
}

// Brute Force: repeatedly scan for any two overlapping intervals and merge them
function generateBruteForceSteps(intervals) {
  if (!intervals || intervals.length === 0) return { steps: [], result: [] }
  const steps = []
  let arr = intervals.map((iv) => [...iv])

  steps.push({
    phase: 'init',
    arr: arr.map((iv) => [...iv]),
    comparing: [],
    merged: null,
    description: 'Starting with original intervals. We repeatedly scan for overlapping pairs.',
  })

  let changed = true
  let iteration = 0
  while (changed) {
    changed = false
    let i = 0
    while (i < arr.length) {
      let j = i + 1
      while (j < arr.length) {
        steps.push({
          phase: 'compare',
          arr: arr.map((iv) => [...iv]),
          comparing: [i, j],
          merged: null,
          description: `Compare interval[${i}]=[${arr[i]}] with interval[${j}]=[${arr[j]}]. Overlapping if start[j] ≤ end[i].`,
        })

        const [ai, bi] = arr[i]
        const [aj, bj] = arr[j]

        if (aj <= bi) {
          // overlapping — merge
          const newInterval = [Math.min(ai, aj), Math.max(bi, bj)]
          steps.push({
            phase: 'merge',
            arr: arr.map((iv) => [...iv]),
            comparing: [i, j],
            merged: newInterval,
            description: `Overlap found! Merge [${arr[i]}] ∪ [${arr[j]}] = [${newInterval}]`,
          })
          arr[i] = newInterval
          arr.splice(j, 1)
          changed = true
          steps.push({
            phase: 'after-merge',
            arr: arr.map((iv) => [...iv]),
            comparing: [i],
            merged: null,
            description: `After merge. Array now has ${arr.length} intervals. Restarting scan.`,
          })
          break
        } else {
          steps.push({
            phase: 'no-overlap',
            arr: arr.map((iv) => [...iv]),
            comparing: [i, j],
            merged: null,
            description: `No overlap. [${arr[j]}] starts after [${arr[i]}] ends.`,
          })
          j++
        }
      }
      if (changed) break
      i++
    }
    iteration++
    if (iteration > 100) break // safety
  }

  steps.push({
    phase: 'done',
    arr: arr.map((iv) => [...iv]),
    comparing: [],
    merged: null,
    description: `Done! Result: [${arr.map((iv) => `[${iv}]`).join(', ')}] — all overlaps merged.`,
  })

  return { steps, result: arr }
}

// Optimal: sort by start, then linear sweep
function generateOptimalSteps(intervals) {
  if (!intervals || intervals.length === 0) return { steps: [], result: [] }
  const steps = []

  // Step 1: show original
  steps.push({
    phase: 'init',
    arr: intervals.map((iv) => [...iv]),
    sortedArr: null,
    pointer: -1,
    merged: [],
    description: 'Start: original unsorted intervals.',
  })

  // Step 2: sort
  const sorted = [...intervals].map((iv) => [...iv]).sort((a, b) => a[0] - b[0])
  steps.push({
    phase: 'sorted',
    arr: intervals.map((iv) => [...iv]),
    sortedArr: sorted.map((iv) => [...iv]),
    pointer: -1,
    merged: [],
    description: `Sort intervals by start time → [${sorted.map((iv) => `[${iv}]`).join(', ')}]`,
  })

  // Step 3: sweep
  const result = [sorted[0]]
  steps.push({
    phase: 'sweep-init',
    arr: sorted.map((iv) => [...iv]),
    sortedArr: sorted.map((iv) => [...iv]),
    pointer: 0,
    merged: [[...sorted[0]]],
    description: `Initialize result with first interval [${sorted[0]}].`,
  })

  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1]
    const cur = sorted[i]

    steps.push({
      phase: 'check',
      arr: sorted.map((iv) => [...iv]),
      sortedArr: sorted.map((iv) => [...iv]),
      pointer: i,
      lastInterval: [...last],
      merged: result.map((iv) => [...iv]),
      description: `Check interval[${i}]=[${cur}] against last merged=[${last}]. Does ${cur[0]} ≤ ${last[1]}?`,
    })

    if (cur[0] <= last[1]) {
      const prevLast = [...last]
      last[1] = Math.max(last[1], cur[1])
      steps.push({
        phase: 'extend',
        arr: sorted.map((iv) => [...iv]),
        sortedArr: sorted.map((iv) => [...iv]),
        pointer: i,
        lastInterval: [...last],
        merged: result.map((iv) => [...iv]),
        description: `Yes! Extend last merged: [${prevLast}] → [${last}] (max end = ${last[1]})`,
      })
    } else {
      result.push([...cur])
      steps.push({
        phase: 'push',
        arr: sorted.map((iv) => [...iv]),
        sortedArr: sorted.map((iv) => [...iv]),
        pointer: i,
        merged: result.map((iv) => [...iv]),
        description: `No overlap. Push [${cur}] as new merged interval. Result count: ${result.length}`,
      })
    }
  }

  steps.push({
    phase: 'done',
    arr: sorted.map((iv) => [...iv]),
    sortedArr: sorted.map((iv) => [...iv]),
    pointer: -1,
    merged: result.map((iv) => [...iv]),
    description: `Done! Merged intervals: [${result.map((iv) => `[${iv}]`).join(', ')}]`,
  })

  return { steps, result }
}

// ─── Timeline Bar Visualizer ──────────────────────────────────────────────────

function IntervalBar({ interval, color, label, scale, offset }) {
  const left = (interval[0] - offset) * scale
  const width = (interval[1] - interval[0]) * scale
  return (
    <div className="iv-bar-row">
      {label && <span className="iv-bar-label">{label}</span>}
      <div className="iv-bar-track">
        <div
          className="iv-bar"
          style={{
            left: `${left}px`,
            width: `${Math.max(width, 8)}px`,
            background: color,
          }}
        >
          <span className="iv-bar-text">
            [{interval[0]}, {interval[1]}]
          </span>
        </div>
      </div>
    </div>
  )
}

function TimelineAxis({ min, max, scale, offset }) {
  const ticks = []
  for (let v = min; v <= max; v++) {
    ticks.push(v)
  }
  return (
    <div className="iv-axis">
      {ticks.map((v) => (
        <div
          key={v}
          className="iv-tick"
          style={{ left: `${(v - offset) * scale}px` }}
        >
          <span>{v}</span>
        </div>
      ))}
    </div>
  )
}

function IntervalTimeline({ intervals, highlightIdxs = [], mergedIntervals = [], step }) {
  if (!intervals || intervals.length === 0) return null

  const allVals = [...intervals.flat(), ...(mergedIntervals.flat())]
  const minV = Math.min(...allVals)
  const maxV = Math.max(...allVals)
  const range = maxV - minV || 1
  const trackWidth = Math.min(Math.max(range * 40, 200), 500)
  const scale = trackWidth / range
  const offset = minV

  const phaseColors = {
    comparing: '#f59e0b',
    active: '#6366f1',
    merged: '#10b981',
    normal: '#94a3b8',
    highlight: '#ef4444',
  }

  return (
    <div className="interval-timeline">
      <div className="iv-section-label">Input Intervals</div>
      <div className="iv-timeline-wrap" style={{ width: `${trackWidth + 120}px` }}>
        {intervals.map((iv, idx) => {
          let color = phaseColors.normal
          if (highlightIdxs.includes(idx)) {
            color = step?.phase === 'merge' || step?.phase === 'extend' ? phaseColors.merged : phaseColors.comparing
          }
          return (
            <IntervalBar
              key={idx}
              interval={iv}
              color={color}
              label={`[${idx}]`}
              scale={scale}
              offset={offset}
            />
          )
        })}
        <TimelineAxis min={minV} max={maxV} scale={scale} offset={offset} />
      </div>

      {mergedIntervals.length > 0 && (
        <>
          <div className="iv-section-label" style={{ marginTop: 16 }}>
            Merged Result
          </div>
          <div className="iv-timeline-wrap" style={{ width: `${trackWidth + 120}px` }}>
            {mergedIntervals.map((iv, idx) => (
              <IntervalBar
                key={idx}
                interval={iv}
                color={phaseColors.merged}
                label={`R[${idx}]`}
                scale={scale}
                offset={offset}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Brute Force Visualizer ───────────────────────────────────────────────────

function BruteForceVisualizer({ visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>
          Click <strong>Play</strong> to see brute force merging
        </p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const phaseClass = {
    init: 'info',
    compare: 'warning',
    merge: 'match',
    'after-merge': 'match',
    'no-overlap': '',
    done: 'match',
  }

  return (
    <div className="visualizer-content">
      <ProgressBar
        current={visualization.currentStep}
        total={visualization.steps.length}
      />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>
          Step {visualization.currentStep + 1} / {visualization.steps.length} —{' '}
          {step.phase.toUpperCase()}
        </strong>
        <p>{step.description}</p>
        {step.merged && (
          <p>
            <span className="match-text">
              → Merged: [{step.merged[0]}, {step.merged[1]}]
            </span>
          </p>
        )}
      </div>
      <IntervalTimeline
        intervals={step.arr}
        highlightIdxs={step.comparing}
        mergedIntervals={step.phase === 'done' ? step.arr : []}
        step={step}
      />
    </div>
  )
}

// ─── Optimal Visualizer ───────────────────────────────────────────────────────

function OptimalVisualizer({ visualization }) {
  if (!visualization) {
    return (
      <div className="visual-placeholder">
        <p>
          Click <strong>Play</strong> to see optimal merging
        </p>
      </div>
    )
  }

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const phaseClass = {
    init: '',
    sorted: 'info',
    'sweep-init': 'info',
    check: 'warning',
    extend: 'match',
    push: 'info',
    done: 'match',
  }

  const displayArr = step.sortedArr || step.arr
  const highlight = step.pointer >= 0 ? [step.pointer] : []

  return (
    <div className="visualizer-content">
      <ProgressBar
        current={visualization.currentStep}
        total={visualization.steps.length}
      />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>
          Step {visualization.currentStep + 1} / {visualization.steps.length} —{' '}
          {step.phase.toUpperCase()}
        </strong>
        <p>{step.description}</p>
        {step.lastInterval && step.phase === 'extend' && (
          <p>
            <span className="match-text">→ Extend last: [{step.lastInterval.join(', ')}]</span>
          </p>
        )}
      </div>
      <IntervalTimeline
        intervals={displayArr}
        highlightIdxs={highlight}
        mergedIntervals={step.merged || []}
        step={step}
      />
    </div>
  )
}

// ─── Code Panel ───────────────────────────────────────────────────────────────

const CODE = {
  python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])  # sort by start
    merged = [intervals[0]]
    
    for start, end in intervals[1:]:
        last = merged[-1]
        if start <= last[1]:          # overlapping
            last[1] = max(last[1], end)
        else:
            merged.append([start, end])
    
    return merged`,

  java: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            merged.add(intervals[i]);
        }
    }
    
    return merged.toArray(new int[0][]);
}`,

  cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    
    for (int i = 1; i < intervals.size(); i++) {
        auto& last = merged.back();
        if (intervals[i][0] <= last[1]) {
            last[1] = max(last[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    
    return merged;
}`,

  javascript: `function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            merged.push(intervals[i]);
        }
    }
    
    return merged;
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
  { label: 'Basic', raw: '[[1,3],[2,6],[8,10],[15,18]]', hint: '4 intervals' },
  { label: 'Single cover', raw: '[[1,4],[4,5]]', hint: 'touch at 4' },
  { label: 'All overlap', raw: '[[1,10],[2,6],[8,15],[3,9]]', hint: 'nest' },
  { label: 'No overlap', raw: '[[1,2],[3,4],[5,6]]', hint: 'disjoint' },
]

export default function MergeIntervals() {
  const [rawInput, setRawInput] = useState('[[1,3],[2,6],[8,10],[15,18]]')
  const [activeAlgo, setActiveAlgo] = useState('optimal')
  const [activeCodeLang, setActiveCodeLang] = useState('python')
  const [visualization, setVisualization] = useState(null)
  const [result, setResult] = useState(null)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [inputError, setInputError] = useState('')
  const timerRef = useRef(null)

  const buildVisualization = useCallback(
    (intervals, algo) => {
      const gen = algo === 'brute' ? generateBruteForceSteps : generateOptimalSteps
      const { steps, result: res } = gen(intervals)
      setVisualization({ steps, currentStep: 0 })
      setResult(res)
      setIsPaused(true)
    },
    [],
  )

  useEffect(() => {
    const intervals = parsIntervals(rawInput)
    if (intervals) {
      setInputError('')
      buildVisualization(intervals, activeAlgo)
    } else {
      setInputError('Invalid format. Use JSON like [[1,3],[2,6]]')
    }
  }, [rawInput, activeAlgo, buildVisualization])

  // Playback
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
    setVisualization((prev) => (prev ? { ...prev, currentStep: 0 } : prev))
  }

  const handlePlay = () => setIsPaused(false)
  const handlePause = () => {
    clearInterval(timerRef.current)
    setIsPaused(true)
  }
  const handleNext = () => {
    setVisualization((prev) => {
      if (!prev || prev.currentStep >= prev.steps.length - 1) return prev
      return { ...prev, currentStep: prev.currentStep + 1 }
    })
  }
  const handlePrev = () => {
    setVisualization((prev) => {
      if (!prev || prev.currentStep <= 0) return prev
      return { ...prev, currentStep: prev.currentStep - 1 }
    })
  }

  const loadExample = (ex) => {
    setRawInput(ex.raw)
  }

  const intervals = parsIntervals(rawInput)

  return (
    <div className="mi-container">
      <PageHeader
        title="56. Merge Intervals"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Array', className: 'topic' },
          { label: 'Sorting', className: 'topic' },
          { label: 'Greedy', className: 'topic' },
        ]}
      />

      <div className="mi-main">
        {/* ── Full-width: Problem + Input ── */}
        <div className="mi-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an array of intervals where <code>intervals[i] = [start_i, end_i]</code>,
              merge all overlapping intervals and return an array of the <strong>non-overlapping</strong>{' '}
              intervals that cover all the intervals in the input.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ intervals.length ≤ 10⁴</code>
              <span className="constraints-sep">·</span>
              <code>intervals[i].length == 2</code>
              <span className="constraints-sep">·</span>
              <code>0 ≤ start_i ≤ end_i ≤ 10⁴</code>
            </div>
          </div>
        </div>

        <div className="mi-full-width">
          <div className="card input-card">
            <div className="input-bar">
              <div className="input-fields">
                <div className="input-inline" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <label>Intervals (JSON)</label>
                  <input
                    type="text"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="[[1,3],[2,6],[8,10]]"
                    style={{ width: 280, letterSpacing: 0, fontFamily: 'Monaco, monospace', fontSize: 13 }}
                  />
                  {inputError && <span className="input-error">{inputError}</span>}
                </div>
              </div>

              {result && (
                <div className="result-inline">
                  <span className="result-label">OUTPUT</span>
                  <span className="result-val" style={{ letterSpacing: 0, fontSize: 12 }}>
                    {result.map((iv) => `[${iv}]`).join(', ')}
                  </span>
                  <span className="result-len">({result.length} intervals)</span>
                </div>
              )}

              <div className="try-examples">
                <span className="try-label">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    className={`example-chip ${rawInput === ex.raw ? 'active' : ''}`}
                    onClick={() => loadExample(ex)}
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
        <div className="mi-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explain: [1,3] and [2,6] overlap → [1,6]`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  [[1,4],[4,5]]
Output: [[1,5]]
Explain: [1,4] and [4,5] touch at 4 → merge`}</pre>
              </div>
              <div className="example">
                <strong>Example 3</strong>
                <pre>{`Input:  [[1,4],[0,2],[3,5]]
Output: [[0,5]]
Explain: All three overlap after sort`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              Two intervals <code>[a,b]</code> and <code>[c,d]</code> overlap if and only if{' '}
              <code>c ≤ b</code> (the next start is before or at the current end). When they overlap,
              the merged interval is <code>[min(a,c), max(b,d)]</code>.
            </p>
            <p>
              The key insight for the optimal solution: if we <strong>sort intervals by start time</strong>,
              then each interval only needs to be compared with the{' '}
              <em>last merged interval</em> — because any earlier interval already has a smaller start and
              was already merged or determined to be non-overlapping.
            </p>
          </div>

          <div className="card">
            <h2>Approaches</h2>
            <div className="approaches-tabs">
              <div className="approach-block brute">
                <div className="approach-title">🐢 Brute Force</div>
                <p>
                  Repeatedly scan all pairs and merge any overlapping pair until no more overlaps exist.
                </p>
                <div className="complexity-row">
                  <span className="complexity bad">Time: O(n²)</span>
                  <span className="complexity ok">Space: O(n)</span>
                </div>
                <p className="approach-why">
                  Each pass may reduce by only one merge; worst case O(n) passes × O(n) pairs.
                </p>
              </div>
              <div className="approach-block optimal">
                <div className="approach-title">⚡ Optimal — Sort + Sweep</div>
                <p>
                  Sort by start time once, then make a single left-to-right pass. Extend the last
                  merged interval if the current one overlaps; otherwise push a new one.
                </p>
                <div className="complexity-row">
                  <span className="complexity good">Time: O(n log n)</span>
                  <span className="complexity ok">Space: O(n)</span>
                </div>
                <p className="approach-why">
                  After sorting, each interval is processed exactly once — O(n) sweep.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Pattern Recognition</h2>
            <p>
              This is a classic <strong>Interval Scheduling / Greedy</strong> problem. The sort + sweep
              pattern appears in many interval problems:
            </p>
            <ul>
              <li>
                <strong>Insert Interval</strong> (LC 57) — insert & merge a new interval
              </li>
              <li>
                <strong>Non-overlapping Intervals</strong> (LC 435) — minimum removals
              </li>
              <li>
                <strong>Meeting Rooms II</strong> (LC 253) — minimum rooms needed
              </li>
              <li>
                <strong>Employee Free Time</strong> (LC 759) — find gaps
              </li>
            </ul>
            <p style={{ marginTop: 10 }}>
              <strong>Trigger:</strong> When you see intervals and need to combine/schedule them → sort
              by start, then sweep with a running last-interval pointer.
            </p>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="mi-right">
          <div className="card">
            <div className="viz-header">
              <h2>Visualizer</h2>
              <div className="algo-switch">
                <button
                  className={`algo-btn ${activeAlgo === 'optimal' ? 'active' : ''}`}
                  onClick={() => setActiveAlgo('optimal')}
                >
                  Optimal
                </button>
                <button
                  className={`algo-btn ${activeAlgo === 'brute' ? 'active' : ''}`}
                  onClick={() => setActiveAlgo('brute')}
                >
                  Brute Force
                </button>
              </div>
            </div>

            <VisualizerWrapper title="Merge Intervals — Step Visualizer">
              <div className="visualizer">
                {activeAlgo === 'brute' ? (
                  <BruteForceVisualizer visualization={visualization} />
                ) : (
                  <OptimalVisualizer visualization={visualization} />
                )}
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
            <h2>Dry Run — [[1,3],[2,6],[8,10],[15,18]]</h2>
            <div className="dry-run-table-wrap">
              <table className="dry-run-table">
                <thead>
                  <tr>
                    <th>i</th>
                    <th>Current</th>
                    <th>Last Merged</th>
                    <th>Overlap?</th>
                    <th>Action</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="dr-init">
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>Sort → [[1,3],[2,6],[8,10],[15,18]]</td>
                    <td>[[1,3]]</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>[2,6]</td>
                    <td>[1,3]</td>
                    <td className="yes">2 ≤ 3 ✓</td>
                    <td>Extend end: max(3,6)=6</td>
                    <td>[[1,6]]</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>[8,10]</td>
                    <td>[1,6]</td>
                    <td className="no">8 &gt; 6 ✗</td>
                    <td>Push new interval</td>
                    <td>[[1,6],[8,10]]</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>[15,18]</td>
                    <td>[8,10]</td>
                    <td className="no">15 &gt; 10 ✗</td>
                    <td>Push new interval</td>
                    <td>[[1,6],[8,10],[15,18]]</td>
                  </tr>
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
                <strong>Ask:</strong> Are input intervals sorted? (usually not — mention you'll sort)
              </li>
              <li>
                <strong>Edge cases:</strong> single interval, already non-overlapping, all fully nested ([1,10] contains [2,5])
              </li>
              <li>
                <strong>Trap:</strong> Using <code>a[1] = end</code> vs. <code>a[1] = max(a[1], end)</code> —
                always use max because the current interval could be fully inside the last merged one
              </li>
              <li>
                <strong>Follow-ups:</strong> Insert Interval (LC 57), Minimum # meeting rooms (LC 253),
                Employee Free Time (LC 759)
              </li>
              <li>
                <strong>Interviewer expects:</strong> Recognize sort + linear sweep, articulate why
                sorting reduces comparisons, handle nested intervals correctly
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
