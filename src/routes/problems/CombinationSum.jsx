import { useState, useEffect, useCallback, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import CallStackPanel from '../../components/CallStackPanel'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

// ─── Step Generator ───────────────────────────────────────────────────────────
// Each step captures: treeNodes snapshot, callStack, current path,
// results found so far, active node, and a description.

function generateSteps(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b)
  const steps = []
  const results = []
  let nodeIdCounter = 0

  // We snapshot the full state at each decision point
  // treeNodes accumulates incrementally
  const allTreeNodes = []

  function snap(phase, activeId, stack, path, desc, extra = {}) {
    steps.push({
      phase,
      activeNodeId: activeId,
      treeNodes: allTreeNodes.map((n) => ({ ...n })),
      callStack: stack.map((f) => ({ ...f })),
      path: [...path],
      results: results.map((r) => [...r]),
      description: desc,
      ...extra,
    })
  }

  function bt(start, remaining, path, parentId, stack) {
    const id = nodeIdCounter++
    const label = `rem=${remaining}`
    const isBase = remaining === 0
    const isPrune = remaining < 0

    const node = {
      id,
      parentId,
      label,
      remaining,
      path: [...path],
      isBase,
      isPrune,
      match: false,
      result: null,
    }
    allTreeNodes.push(node)

    const frame = { id, funcName: 'bt', start, remaining, path: [...path] }
    const newStack = [...stack, frame]

    // ── Enter call ──
    snap(
      'enter',
      id,
      newStack,
      path,
      remaining === 0
        ? `✅ Found combination! [${path.join(', ')}] sums to ${target}`
        : `Enter bt(start=${start}, rem=${remaining}, path=[${path.join(',')}])`,
      { entering: true },
    )

    if (remaining === 0) {
      node.match = true
      node.result = [...path]
      results.push([...path])
      snap('found', id, newStack, path, `✅ Add [${path.join(', ')}] to results. Backtrack.`, {
        found: true,
      })
      return
    }

    for (let i = start; i < sorted.length; i++) {
      const cand = sorted[i]
      if (cand > remaining) {
        snap(
          'prune',
          id,
          newStack,
          path,
          `✂️ Prune: ${cand} > ${remaining} (remaining). Skip rest.`,
          { pruneCand: cand },
        )
        break
      }

      snap(
        'choose',
        id,
        newStack,
        path,
        `Choose ${cand}. New path=[${[...path, cand].join(',')}], rem=${remaining - cand}`,
        { choosing: cand },
      )

      path.push(cand)
      bt(i, remaining - cand, path, id, newStack)
      path.pop()

      snap(
        'undo',
        id,
        newStack,
        path,
        `↩ Undo ${cand}. Back to path=[${path.join(',')}], rem=${remaining}`,
        { undoing: cand },
      )
    }

    snap('return', id, stack, path, `Return from bt(start=${start}, rem=${remaining})`)
  }

  // Root sentinel node for visual clarity
  const rootId = nodeIdCounter++
  allTreeNodes.push({
    id: rootId,
    parentId: null,
    label: `target=${target}`,
    remaining: target,
    path: [],
    isBase: false,
    isPrune: false,
    match: false,
    result: null,
  })

  snap('init', rootId, [], [], `Start: candidates=${JSON.stringify(sorted)}, target=${target}`)
  bt(0, target, [], rootId, [])
  snap('done', -1, [], [], `Done! Found ${results.length} combination(s): ${results.map((r) => '[' + r.join(',') + ']').join(' ')}`, { done: true })

  return { steps, results }
}

// ─── Decision Tree (custom SVG, backtracking-specific) ────────────────────────

function buildLayout(nodes) {
  if (!nodes || nodes.length === 0) return { positions: {}, edges: [], nodeMap: {} }

  const nodeMap = {}
  const childrenMap = {}
  nodes.forEach((n) => { nodeMap[n.id] = n; childrenMap[n.id] = [] })
  nodes.forEach((n) => {
    if (n.parentId !== null && n.parentId !== undefined) {
      childrenMap[n.parentId]?.push(n.id)
    }
  })

  const widths = {}
  function computeWidth(id) {
    const ch = childrenMap[id] ?? []
    if (!ch.length) { widths[id] = 1; return 1 }
    const total = ch.reduce((s, c) => s + computeWidth(c), 0)
    widths[id] = total
    return total
  }
  computeWidth(nodes[0].id)

  const CW = 68, CH = 72
  const positions = {}
  function assign(id, left, depth) {
    const w = widths[id] || 1
    positions[id] = { x: (left + w / 2) * CW, y: depth * CH }
    let cursor = left
    for (const cid of childrenMap[id] ?? []) {
      assign(cid, cursor, depth + 1)
      cursor += widths[cid] || 1
    }
  }
  assign(nodes[0].id, 0, 0)

  return { positions, childrenMap, nodeMap }
}

function DecisionTree({ treeNodes, activeNodeId }) {
  if (!treeNodes || treeNodes.length === 0) return null

  const { positions, childrenMap, nodeMap } = buildLayout(treeNodes)

  const allX = Object.values(positions).map((p) => p.x)
  const allY = Object.values(positions).map((p) => p.y)
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const maxY = Math.max(...allY)
  const PAD = 36
  const svgW = maxX - minX + PAD * 2 + 68
  const svgH = maxY + PAD * 2 + 68
  const ox = PAD + 34 - minX

  return (
    <div className="cs-tree-wrap">
      <svg width={svgW} height={svgH} className="cs-tree-svg">
        {/* Edges */}
        {treeNodes.map((n) => {
          const children = childrenMap[n.id] ?? []
          return children.map((cid) => {
            const p = positions[n.id]
            const c = positions[cid]
            if (!p || !c) return null
            const cn = nodeMap[cid]
            const edgeColor = cn?.match ? '#10b981' : cn?.isPrune ? '#ef4444' : '#94a3b8'
            return (
              <line
                key={`e-${n.id}-${cid}`}
                x1={p.x + ox} y1={p.y + 26}
                x2={c.x + ox} y2={c.y + 10}
                stroke={edgeColor}
                strokeWidth={cn?.match ? 2.5 : 1.5}
                strokeDasharray={cn?.isPrune ? '4,3' : 'none'}
              />
            )
          })
        })}

        {/* Edge labels (chosen candidate) */}
        {treeNodes.map((n) => {
          if (n.parentId === null || n.parentId === undefined) return null
          const p = positions[n.parentId]
          const c = positions[n.id]
          if (!p || !c) return null
          const chosenVal = n.path.length > 0 ? n.path[n.path.length - 1] : null
          if (chosenVal === null) return null
          const mx = (p.x + c.x) / 2 + ox
          const my = (p.y + c.y) / 2 + 16
          return (
            <text key={`el-${n.id}`} x={mx} y={my} textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="700">
              +{chosenVal}
            </text>
          )
        })}

        {/* Nodes */}
        {treeNodes.map((n) => {
          const pos = positions[n.id]
          if (!pos) return null
          const isActive = n.id === activeNodeId
          const cx = pos.x + ox
          const cy = pos.y + 22

          let fill = '#e2e8f0'
          let stroke = '#94a3b8'
          let textColor = '#1e293b'

          if (isActive)    { fill = '#6366f1'; stroke = '#4f46e5'; textColor = 'white' }
          else if (n.match)   { fill = '#d1fae5'; stroke = '#10b981'; textColor = '#065f46' }
          else if (n.isPrune) { fill = '#fee2e2'; stroke = '#ef4444'; textColor = '#991b1b' }

          return (
            <g key={`nd-${n.id}`}>
              <circle cx={cx} cy={cy} r={20} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fill={textColor} fontWeight="700">
                rem
              </text>
              <text x={cx} y={cy + 8} textAnchor="middle" fontSize="12" fill={textColor} fontWeight="800">
                {n.remaining}
              </text>
              {n.match && (
                <text x={cx} y={cy + 34} textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="700">
                  ✓
                </text>
              )}
              {n.isPrune && (
                <text x={cx} y={cy + 34} textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="700">
                  ✂
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Call Stack Panel — uses shared <CallStackPanel> component ───────────────

function renderBtFrame(frame, isTop) {
  return (
    <>
      <div className="csp-frame-name">bt()</div>
      <div className="csp-frame-vars">
        <span className="csp-var"><span className="csp-var-k">start</span>={frame.start}</span>
        <span className="csp-var"><span className="csp-var-k">rem</span>={frame.remaining}</span>
        <span className="csp-var"><span className="csp-var-k">path</span>=[{frame.path.join(',')}]</span>
      </div>
    </>
  )
}

// ─── Path & Results Panel ─────────────────────────────────────────────────────

function PathPanel({ path, results, target }) {
  const sum = path.reduce((a, b) => a + b, 0)
  const remaining = target - sum
  return (
    <div className="cs-path-panel">
      <div className="cs-path-row">
        <span className="cs-path-label">Current Path:</span>
        <div className="cs-path-chips">
          {path.length === 0
            ? <span className="cs-path-empty">[]</span>
            : path.map((v, i) => <span key={i} className="cs-path-chip">{v}</span>)
          }
          {path.length > 0 && (
            <span className="cs-path-sum">
              sum={sum}
              {remaining > 0 && <span className="cs-path-rem"> · need {remaining} more</span>}
              {remaining === 0 && <span className="cs-path-found"> · ✅ found!</span>}
            </span>
          )}
        </div>
      </div>
      {results.length > 0 && (
        <div className="cs-results-row">
          <span className="cs-path-label">Results ({results.length}):</span>
          <div className="cs-results-list">
            {results.map((r, i) => (
              <span key={i} className="cs-result-chip">[{r.join(', ')}]</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Visualizer ──────────────────────────────────────────────────────────

function BacktrackingVisualizer({ candidates, target, visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see backtracking step-by-step</p>
    </div>
  )

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const phaseClass = {
    init: '',
    enter: '',
    found: 'match',
    prune: 'warning',
    choose: 'info',
    undo: '',
    return: '',
    done: 'match',
  }

  const tooLarge = step.treeNodes.length > 120

  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <PathPanel path={step.path} results={step.results} target={target} />

      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>
          Step {visualization.currentStep + 1} / {visualization.steps.length} — {step.phase.toUpperCase()}
        </strong>
        <p>{step.description}</p>
      </div>

      <div className="cs-viz-split">
        <div className="cs-tree-section">
          <div className="cs-section-label">Decision Tree</div>
          {tooLarge ? (
            <div className="cs-tree-toolarge">
              Tree too large to render. Use smaller candidates or target ≤ 8.
            </div>
          ) : (
            <DecisionTree treeNodes={step.treeNodes} activeNodeId={step.activeNodeId} />
          )}
        </div>
        <CallStackPanel frames={step.callStack} renderFrame={renderBtFrame} />
      </div>
    </div>
  )
}

// ─── Code Panel ───────────────────────────────────────────────────────────────

const CODE = {
  python: `def combinationSum(candidates, target):
    candidates.sort()
    results = []

    def bt(start, remaining, path):
        if remaining == 0:
            results.append(path[:])  # found!
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break              # pruned
            path.append(candidates[i])
            bt(i, remaining - candidates[i], path)  # i not i+1 (reuse allowed)
            path.pop()             # undo (backtrack)

    bt(0, target, [])
    return results`,

  java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> results = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), results);
    return results;
}

void backtrack(int[] cands, int rem, int start,
               List<Integer> path, List<List<Integer>> res) {
    if (rem == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < cands.length; i++) {
        if (cands[i] > rem) break;          // prune
        path.add(cands[i]);
        backtrack(cands, rem - cands[i], i, path, res);
        path.remove(path.size() - 1);       // undo
    }
}`,

  cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> results;
    vector<int> path;
    
    function<void(int, int)> bt = [&](int start, int rem) {
        if (rem == 0) { results.push_back(path); return; }
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > rem) break;  // prune
            path.push_back(candidates[i]);
            bt(i, rem - candidates[i]);      // i not i+1
            path.pop_back();                  // undo
        }
    };
    
    bt(0, target);
    return results;
}`,

  javascript: `function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);
    const results = [];

    function bt(start, remaining, path) {
        if (remaining === 0) {
            results.push([...path]);
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;  // prune
            path.push(candidates[i]);
            bt(i, remaining - candidates[i], path); // i not i+1
            path.pop();                              // undo
        }
    }

    bt(0, target, []);
    return results;
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

// ─── Input Parsing ────────────────────────────────────────────────────────────

function parseInput(raw) {
  try {
    const arr = JSON.parse(raw)
    if (
      Array.isArray(arr) &&
      arr.length > 0 &&
      arr.every((v) => typeof v === 'number' && Number.isInteger(v) && v > 0) &&
      new Set(arr).size === arr.length
    ) return arr
  } catch (_) {}
  return null
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Classic', cands: '[2,3,6,7]', target: 7, hint: '2 results' },
  { label: 'Simple', cands: '[2,3,5]', target: 8, hint: '3 results' },
  { label: 'Single', cands: '[2]', target: 4, hint: '1 result' },
  { label: 'No result', cands: '[3,5]', target: 4, hint: '0 results' },
]

export default function CombinationSum() {
  const [candsRaw, setCandsRaw] = useState('[2,3,6,7]')
  const [targetRaw, setTargetRaw] = useState('7')
  const [visualization, setVisualization] = useState(null)
  const [finalResults, setFinalResults] = useState([])
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const build = useCallback((candsStr, tgtStr) => {
    const cands = parseInput(candsStr)
    const tgt = parseInt(tgtStr, 10)
    if (!cands) { setError('Candidates must be a JSON array of distinct positive integers, e.g. [2,3,6,7]'); return }
    if (isNaN(tgt) || tgt <= 0 || tgt > 20) { setError('Target must be a positive integer ≤ 20'); return }
    setError('')
    const { steps, results } = generateSteps(cands, tgt)
    setVisualization({ steps, currentStep: 0 })
    setFinalResults(results)
    setIsPaused(true)
  }, [])

  useEffect(() => { build(candsRaw, targetRaw) }, [candsRaw, targetRaw, build])

  useEffect(() => {
    if (!isPaused && visualization) {
      timerRef.current = setInterval(() => {
        setVisualization((prev) => {
          if (!prev) return prev
          if (prev.currentStep >= prev.steps.length - 1) { setIsPaused(true); return prev }
          return { ...prev, currentStep: prev.currentStep + 1 }
        })
      }, 700 - speed)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, speed, visualization])

  const handleReset = () => { clearInterval(timerRef.current); setIsPaused(true); setVisualization((p) => p ? { ...p, currentStep: 0 } : p) }
  const handlePlay = () => setIsPaused(false)
  const handlePause = () => { clearInterval(timerRef.current); setIsPaused(true) }
  const handleNext = () => setVisualization((p) => (!p || p.currentStep >= p.steps.length - 1) ? p : { ...p, currentStep: p.currentStep + 1 })
  const handlePrev = () => setVisualization((p) => (!p || p.currentStep <= 0) ? p : { ...p, currentStep: p.currentStep - 1 })

  const cands = parseInput(candsRaw)
  const tgt = parseInt(targetRaw, 10)

  return (
    <div className="cs-container">
      <PageHeader
        title="39. Combination Sum"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Array', className: 'topic' },
          { label: 'Backtracking', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        {/* ── Problem Statement ── */}
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target
              integer <code>target</code>, return <em>all unique combinations</em> of candidates where
              the chosen numbers sum to target. The <strong>same number may be chosen an unlimited
              number of times</strong>. Return combinations in any order.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ candidates.length ≤ 30</code>
              <span className="constraints-sep">·</span>
              <code>2 ≤ candidates[i] ≤ 40</code>
              <span className="constraints-sep">·</span>
              <code>1 ≤ target ≤ 40</code>
              <span className="constraints-sep">·</span>
              All elements are <strong>distinct</strong>
            </div>
          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="cs-full-width">
          <div className="card input-card">
            <div className="input-bar">
              <div className="input-fields">
                <div className="input-inline">
                  <label>Candidates</label>
                  <input
                    type="text"
                    value={candsRaw}
                    onChange={(e) => setCandsRaw(e.target.value)}
                    placeholder="[2,3,6,7]"
                    style={{ width: 160, letterSpacing: 0, fontFamily: 'Monaco,monospace', fontSize: 13 }}
                  />
                </div>
                <div className="input-inline">
                  <label>Target</label>
                  <input
                    type="number"
                    value={targetRaw}
                    min={1}
                    max={20}
                    onChange={(e) => setTargetRaw(e.target.value)}
                    style={{ width: 60 }}
                  />
                </div>
                {error && <span className="cs-error">{error}</span>}
              </div>

              {finalResults.length >= 0 && !error && (
                <div className="result-inline">
                  <span className="result-label">RESULTS</span>
                  <span className="result-val" style={{ letterSpacing: 0, fontSize: 12 }}>
                    {finalResults.length === 0
                      ? 'none'
                      : finalResults.map((r) => `[${r.join(',')}]`).join(' ')}
                  </span>
                  <span className="result-len">({finalResults.length})</span>
                </div>
              )}

              <div className="try-examples">
                <span className="try-label">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    className={`example-chip ${candsRaw === ex.cands && targetRaw === String(ex.target) ? 'active' : ''}`}
                    onClick={() => { setCandsRaw(ex.cands); setTargetRaw(String(ex.target)) }}
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
        <div className="cs-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  candidates=[2,3,6,7] target=7
Output: [[2,2,3],[7]]
Explain: 2+2+3=7, 7=7`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  candidates=[2,3,5] target=8
Output: [[2,2,2,2],[2,3,3],[3,5]]`}</pre>
              </div>
              <div className="example">
                <strong>Example 3</strong>
                <pre>{`Input:  candidates=[2] target=1
Output: []
Explain: No combination sums to 1`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              Think of building combinations like a <strong>decision tree</strong>. At each node, we
              decide which candidate to pick next (allowing repeats). We explore every branch and{' '}
              <strong>backtrack</strong> when a branch exceeds the target or is exhausted.
            </p>
            <p>
              <strong>Key trick — avoid duplicates:</strong> always start from index <code>i</code>{' '}
              (not 0) in recursive calls. This ensures we never consider a candidate that comes
              before the current one, preventing duplicate combinations like{' '}
              <code>[2,3]</code> and <code>[3,2]</code>.
            </p>
            <p>
              <strong>Pruning:</strong> Sort candidates first. When a candidate exceeds{' '}
              <code>remaining</code>, break — all subsequent candidates are also too large.
            </p>
          </div>

          <Approaches
            approaches={[
              { type: 'choose', label: 'Choose', description: 'Pick a candidate cand[i], add to path, subtract from remaining.' },
              { type: 'recurse', label: 'Explore', description: 'Recurse with bt(i, rem - cand[i]) — note i not i+1 (same element reusable).' },
              { type: 'undo', label: 'Undo', description: 'After the recursive call returns, path.pop() to restore state and try the next candidate.' },
            ]}
            complexity={{
              time: 'O(N^(T/M))',
              space: 'O(T/M)',
            }}
          />
          <p className="approach-why" style={{ fontSize: 13, marginTop: 12 }}>
            N = candidates, T = target, M = minimum candidate value. Depth of recursion ≤ T/M.
          </p>

          <PatternRecognition
            patternName="Backtracking — Combination with Reuse"
            description="Explore all combinations with constraint satisfaction. Template: sort → choose → recurse(i, rem-val) → undo. Related: Combination Sum II (40), Combination Sum III (216), Subsets (78), Permutations (46), Word Search (79)."
          />
        </div>

        {/* ── Right Column ── */}
        <div className="cs-right">
          <div className="card">
            <h2>Visualizer</h2>
            <p className="cs-viz-hint">
              <span className="cs-legend cs-legend-active">Purple = active call</span>
              <span className="cs-legend cs-legend-found">Green = found combination</span>
              <span className="cs-legend cs-legend-prune">Red = pruned branch</span>
            </p>

            <VisualizerWrapper title="Combination Sum — Backtracking">
              <div className="visualizer">
                <BacktrackingVisualizer
                  candidates={cands || []}
                  target={tgt || 0}
                  visualization={visualization}
                />
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
            <h2>Dry Run — candidates=[2,3,6,7], target=7</h2>
            <div className="cs-dryrun">
              <table className="dry-run-table">
                <thead>
                  <tr>
                    <th>Call</th>
                    <th>start</th>
                    <th>rem</th>
                    <th>path</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['bt(0,7)',  0, 7, '[]',        'Choose 2'],
                    ['bt(0,5)',  0, 5, '[2]',        'Choose 2'],
                    ['bt(0,3)',  0, 3, '[2,2]',      'Choose 2'],
                    ['bt(0,1)',  0, 1, '[2,2,2]',    '2>1 prune, 3>1 prune → return'],
                    ['back',    0, 3, '[2,2]',       'Undo 2, choose 3'],
                    ['bt(1,0)', 1, 0, '[2,2,3]',     '✅ rem=0 → add result!'],
                    ['back',    0, 5, '[2]',          'Undo 3 → undo 2, choose 3'],
                    ['bt(1,2)', 1, 2, '[2,3]',        '3>2 prune → return'],
                    ['back',    0, 7, '[]',           'Undo 2, choose 3'],
                    ['bt(1,4)', 1, 4, '[3]',          '3≤4 choose 3'],
                    ['bt(1,1)', 1, 1, '[3,3]',        '3>1 prune → return'],
                    ['back',    0, 7, '[]',           'Undo 3, choose 6'],
                    ['bt(2,1)', 2, 1, '[6]',          '6>1 prune → return'],
                    ['back',    0, 7, '[]',           'Undo 6, choose 7'],
                    ['bt(3,0)', 3, 0, '[7]',          '✅ rem=0 → add result!'],
                  ].map(([call, start, rem, path, action], i) => (
                    <tr key={i} className={action.includes('✅') ? 'dr-found' : action.includes('prune') ? 'dr-prune' : ''}>
                      <td>{call}</td>
                      <td>{start}</td>
                      <td>{rem}</td>
                      <td style={{ fontFamily: 'Monaco, monospace' }}>{path}</td>
                      <td>{action}</td>
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

          <InterviewNotes
            whatToLookFor={[
              'Recognizing i (not i+1) allows element reuse',
              'Pruning: when cand[i] > remaining, all subsequent candidates too large',
              'Proper state restoration: path.pop() after recursion returns',
            ]}
            commonTraps={[
              'Not copying path on result push — results.append(path[:]) not results.append(path)',
              'Confusing with Combination Sum II (duplicates in array, each used once)',
              'Missing pruning optimization → TLE on large inputs',
            ]}
            followUps={[
              'Combination Sum II (40) — each element once, duplicates in input',
              'Combination Sum III (216) — exactly k numbers from 1–09',
              'Combination Sum IV (377) — count combinations, order matters',
            ]}
          />
        </div>
      </div>
    </div>
  )
}
