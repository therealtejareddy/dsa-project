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

function generateSteps(nums) {
  const sorted = [...nums].sort((a, b) => a - b)
  const steps = []
  const results = []
  let nodeIdCounter = 0
  const allTreeNodes = []

  function snap(phase, activeId, stack, path, desc, extra = {}) {
    steps.push({
      phase, activeNodeId: activeId,
      treeNodes: allTreeNodes.map(n => ({ ...n })),
      callStack: stack.map(f => ({ ...f })),
      path: [...path],
      results: results.map(r => [...r]),
      description: desc, ...extra,
    })
  }

  function bt(idx, path, parentId, stack, decision) {
    const id = nodeIdCounter++
    const node = {
      id, parentId, decision,
      label: `idx=${idx}`,
      idx, path: [...path],
      isBase: idx === sorted.length,
      isPrune: false, match: false,
    }
    allTreeNodes.push(node)

    const frame = { id, funcName: 'bt', idx, path: [...path] }
    const newStack = [...stack, frame]

    snap(
      'enter', id, newStack, path,
      idx === sorted.length
        ? `✅ idx=${idx} (end). Subset [${path.join(',')}] is complete!`
        : `Enter bt(idx=${idx}, path=[${path.join(',')}])`,
      { entering: true },
    )

    if (idx === sorted.length) {
      node.match = true
      results.push([...path])
      snap('found', id, newStack, path,
        `✅ Add subset [${path.join(',')}] to results. Backtrack.`,
        { found: true })
      return
    }

    const val = sorted[idx]

    // Include branch
    snap('choose', id, newStack, path,
      `Include ${val}: path becomes [${[...path, val].join(',')}]`,
      { choosing: val, branch: 'include' })
    path.push(val)
    bt(idx + 1, path, id, newStack, { type: 'include', val })
    path.pop()

    snap('undo', id, newStack, path,
      `↩ Include-${val} branch done. Now try exclude-${val}.`,
      { undoing: val })

    // Exclude branch
    snap('choose', id, newStack, path,
      `Exclude ${val}: path stays [${path.join(',')}]`,
      { choosing: null, branch: 'exclude' })
    bt(idx + 1, path, id, newStack, { type: 'exclude', val })

    snap('return', id, stack, path,
      `Return from bt(idx=${idx})`)
  }

  const rootId = nodeIdCounter++
  allTreeNodes.push({
    id: rootId, parentId: null, decision: null,
    label: 'root', idx: 0, path: [],
    isBase: false, isPrune: false, match: false,
  })

  snap('init', rootId, [], [], `Start: nums=${JSON.stringify(sorted)}. Generating all 2^${sorted.length}=${Math.pow(2,sorted.length)} subsets.`)
  bt(0, [], rootId, [])
  snap('done', -1, [], [],
    `Done! Found all ${results.length} subsets: ${results.map(r => '['+r.join(',')+']').join(' ')}`,
    { done: true })

  return { steps, results }
}

// ─── Decision Tree SVG ────────────────────────────────────────────────────────

function buildLayout(nodes) {
  if (!nodes || nodes.length === 0) return { positions: {}, childrenMap: {}, nodeMap: {} }
  const nodeMap = {}
  const childrenMap = {}
  nodes.forEach(n => { nodeMap[n.id] = n; childrenMap[n.id] = [] })
  nodes.forEach(n => {
    if (n.parentId !== null && n.parentId !== undefined)
      childrenMap[n.parentId]?.push(n.id)
  })
  const widths = {}
  function computeWidth(id) {
    const ch = childrenMap[id] ?? []
    if (!ch.length) { widths[id] = 1; return 1 }
    const total = ch.reduce((s, c) => s + computeWidth(c), 0)
    widths[id] = total; return total
  }
  computeWidth(nodes[0].id)
  const CW = 72, CH = 74
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
  const allX = Object.values(positions).map(p => p.x)
  const allY = Object.values(positions).map(p => p.y)
  const minX = Math.min(...allX), maxX = Math.max(...allX), maxY = Math.max(...allY)
  const PAD = 42
  const svgW = maxX - minX + PAD * 2 + 72
  const svgH = maxY + PAD * 2 + 72
  const ox = PAD + 36 - minX

  return (
    <div className="cs-tree-wrap">
      <svg width={svgW} height={svgH} className="cs-tree-svg">
        {/* Edges */}
        {treeNodes.map(n => {
          const children = childrenMap[n.id] ?? []
          return children.map(cid => {
            const p = positions[n.id], c = positions[cid]
            if (!p || !c) return null
            const cn = nodeMap[cid]
            const isInclude = cn?.decision?.type === 'include'
            const edgeColor = cn?.match ? '#10b981' : isInclude ? '#6366f1' : '#94a3b8'
            return (
              <line key={`e-${n.id}-${cid}`}
                x1={p.x+ox} y1={p.y+26} x2={c.x+ox} y2={c.y+10}
                stroke={edgeColor} strokeWidth={1.5}
                strokeDasharray={!isInclude ? '4,3' : 'none'} />
            )
          })
        })}

        {/* Edge labels */}
        {treeNodes.map(n => {
          if (n.parentId == null || !n.decision) return null
          const p = positions[n.parentId], c = positions[n.id]
          if (!p || !c) return null
          const isInclude = n.decision.type === 'include'
          const label = isInclude ? `+${n.decision.val}` : `×${n.decision.val}`
          const color = isInclude ? '#6366f1' : '#94a3b8'
          return (
            <text key={`el-${n.id}`}
              x={(p.x+c.x)/2+ox} y={(p.y+c.y)/2+16}
              textAnchor="middle" fontSize="10" fill={color} fontWeight="700">
              {label}
            </text>
          )
        })}

        {/* Nodes */}
        {treeNodes.map(n => {
          const pos = positions[n.id]
          if (!pos) return null
          const isActive = n.id === activeNodeId
          const cx = pos.x + ox, cy = pos.y + 22
          let fill = '#e2e8f0', stroke = '#94a3b8', textColor = '#1e293b'
          if (isActive)   { fill = '#6366f1'; stroke = '#4f46e5'; textColor = 'white' }
          else if (n.match) { fill = '#d1fae5'; stroke = '#10b981'; textColor = '#065f46' }
          return (
            <g key={`nd-${n.id}`}>
              <circle cx={cx} cy={cy} r={20} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={cx} y={cy-2} textAnchor="middle" fontSize="9" fill={textColor} fontWeight="700">idx</text>
              <text x={cx} y={cy+9} textAnchor="middle" fontSize="12" fill={textColor} fontWeight="800">
                {n.isBase ? '✓' : n.idx}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Call Stack render frame ──────────────────────────────────────────────────

function renderBtFrame(frame) {
  return (
    <>
      <div className="csp-frame-name">bt()</div>
      <div className="csp-frame-vars">
        <span className="csp-var"><span className="csp-var-k">idx</span>={frame.idx}</span>
        <span className="csp-var"><span className="csp-var-k">path</span>=[{frame.path.join(',')}]</span>
      </div>
    </>
  )
}

// ─── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ path, results }) {
  return (
    <div className="cs-path-panel">
      <div className="cs-path-row">
        <span className="cs-path-label">Current Path:</span>
        <div className="cs-path-chips">
          {path.length === 0
            ? <span className="cs-path-empty">[]</span>
            : path.map((v, i) => <span key={i} className="cs-path-chip">{v}</span>)
          }
        </div>
      </div>
      {results.length > 0 && (
        <div className="cs-results-row">
          <span className="cs-path-label">Subsets ({results.length}):</span>
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

function SubsetsVisualizer({ visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see backtracking step-by-step</p>
    </div>
  )
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null
  const phaseClass = { found: 'match', choose: 'info', done: 'match', undo: '', return: '', enter: '', init: '' }
  const tooLarge = step.treeNodes.length > 200
  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <ResultsPanel path={step.path} results={step.results} />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>Step {visualization.currentStep+1} / {visualization.steps.length} — {step.phase.toUpperCase()}</strong>
        <p>{step.description}</p>
      </div>
      <div className="cs-viz-split">
        <div className="cs-tree-section">
          <div className="cs-section-label">Decision Tree (✓ include / × exclude)</div>
          {tooLarge
            ? <div className="cs-tree-toolarge">Tree too large. Use ≤ 4 elements.</div>
            : <DecisionTree treeNodes={step.treeNodes} activeNodeId={step.activeNodeId} />
          }
        </div>
        <CallStackPanel frames={step.callStack} renderFrame={renderBtFrame} />
      </div>
    </div>
  )
}

// ─── Code Panel ───────────────────────────────────────────────────────────────

const CODE = {
  python: `def subsets(nums):
    nums.sort()
    results = []

    def bt(idx, path):
        if idx == len(nums):
            results.append(path[:])  # snapshot current path
            return

        # include nums[idx]
        path.append(nums[idx])
        bt(idx + 1, path)
        path.pop()           # undo

        # exclude nums[idx]
        bt(idx + 1, path)

    bt(0, [])
    return results`,

  java: `public List<List<Integer>> subsets(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> results = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), results);
    return results;
}

void backtrack(int[] nums, int idx,
               List<Integer> path, List<List<Integer>> res) {
    if (idx == nums.length) {
        res.add(new ArrayList<>(path));  // snapshot
        return;
    }
    // include
    path.add(nums[idx]);
    backtrack(nums, idx + 1, path, res);
    path.remove(path.size() - 1);        // undo

    // exclude
    backtrack(nums, idx + 1, path, res);
}`,

  cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> results;
    vector<int> path;

    function<void(int)> bt = [&](int idx) {
        if (idx == nums.size()) {
            results.push_back(path);  // snapshot
            return;
        }
        // include
        path.push_back(nums[idx]);
        bt(idx + 1);
        path.pop_back();   // undo

        // exclude
        bt(idx + 1);
    };

    bt(0);
    return results;
}`,

  javascript: `function subsets(nums) {
    nums.sort((a, b) => a - b);
    const results = [];

    function bt(idx, path) {
        if (idx === nums.length) {
            results.push([...path]);  // snapshot
            return;
        }
        // include nums[idx]
        path.push(nums[idx]);
        bt(idx + 1, path);
        path.pop();           // undo

        // exclude nums[idx]
        bt(idx + 1, path);
    }

    bt(0, []);
    return results;
}`,
}

function CodePanel() {
  const [lang, setLang] = useState('python')
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

// ─── Input Parsing ────────────────────────────────────────────────────────────

function parseNums(raw) {
  try {
    const arr = JSON.parse(raw)
    if (
      Array.isArray(arr) && arr.length >= 1 && arr.length <= 5 &&
      arr.every(v => typeof v === 'number' && Number.isInteger(v)) &&
      new Set(arr).size === arr.length
    ) return arr
  } catch (_) {}
  return null
}

const EXAMPLES = [
  { label: '[1,2,3]', nums: '[1,2,3]', hint: '8 subsets' },
  { label: '[0]',     nums: '[0]',     hint: '2 subsets' },
  { label: '[1,2,3,4]', nums: '[1,2,3,4]', hint: '16 subsets' },
]

// ─── Dry Run Table ────────────────────────────────────────────────────────────

function DryRunTable({ nums }) {
  const sorted = [...nums].sort((a, b) => a - b)
  const subsets = [[]]
  for (const n of sorted) {
    const newSubsets = subsets.map(s => [...s, n])
    subsets.push(...newSubsets)
  }
  return (
    <div className="card">
      <h2>Dry Run — nums={JSON.stringify(sorted)}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        At each element, every existing subset is duplicated — one copy excludes it, one copy includes it.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="dry-run-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Element Considered</th>
              <th>New Subsets Added</th>
              <th>Total Subsets So Far</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let current = [[]]
              return [
                <tr key="init">
                  <td>init</td>
                  <td>—</td>
                  <td>[]</td>
                  <td>1</td>
                </tr>,
                ...sorted.map((val, idx) => {
                  const added = current.map(s => [...s, val])
                  current = [...current, ...added]
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><code>{val}</code></td>
                      <td style={{ fontSize: 12 }}>{added.map(s => `[${s.join(',')}]`).join(' ')}</td>
                      <td><strong>{current.length}</strong></td>
                    </tr>
                  )
                }),
              ]
            })()}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Subsets() {
  const [numsRaw, setNumsRaw] = useState('[1,2,3]')
  const [visualization, setVisualization] = useState(null)
  const [finalResults, setFinalResults] = useState([])
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const build = useCallback((raw) => {
    const nums = parseNums(raw)
    if (!nums) { setError('Enter a JSON array of 1–5 distinct integers, e.g. [1,2,3]'); return }
    setError('')
    const { steps, results } = generateSteps(nums)
    setVisualization({ steps, currentStep: 0 })
    setFinalResults(results)
    setIsPaused(true)
  }, [])

  useEffect(() => { build(numsRaw) }, [numsRaw, build])

  useEffect(() => {
    if (!isPaused && visualization) {
      timerRef.current = setInterval(() => {
        setVisualization(prev => {
          if (!prev) return prev
          if (prev.currentStep >= prev.steps.length - 1) { setIsPaused(true); return prev }
          return { ...prev, currentStep: prev.currentStep + 1 }
        })
      }, 700 - speed)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, speed, visualization])

  const handleReset = () => { clearInterval(timerRef.current); setIsPaused(true); setVisualization(p => p ? { ...p, currentStep: 0 } : p) }
  const handlePlay  = () => setIsPaused(false)
  const handlePause = () => { clearInterval(timerRef.current); setIsPaused(true) }
  const handleNext  = () => setVisualization(p => (!p || p.currentStep >= p.steps.length-1) ? p : { ...p, currentStep: p.currentStep+1 })
  const handlePrev  = () => setVisualization(p => (!p || p.currentStep <= 0) ? p : { ...p, currentStep: p.currentStep-1 })

  const parsedNums = parseNums(numsRaw)

  return (
    <div className="cs-container">
      <PageHeader
        title="78. Subsets"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Array', className: 'topic' },
          { label: 'Backtracking', className: 'topic' },
          { label: 'Bit Manipulation', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        {/* ── Problem Statement ── */}
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an integer array <code>nums</code> of <strong>unique elements</strong>, return
              <em> all possible subsets</em> (the power set). The solution set must{' '}
              <strong>not contain duplicate subsets</strong>. Return the solution in any order.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ nums.length ≤ 10</code>
              <span className="constraints-sep">·</span>
              <code>-10 ≤ nums[i] ≤ 10</code>
              <span className="constraints-sep">·</span>
              All nums are <strong>unique</strong>
            </div>
          </div>
        </div>

        {/* ── Input ── */}
        <div className="cs-full-width">
          <div className="card input-card">
            <div className="input-bar">
              <div className="input-fields">
                <div className="input-inline">
                  <label>nums</label>
                  <input
                    type="text" value={numsRaw}
                    onChange={e => setNumsRaw(e.target.value)}
                    placeholder="[1,2,3]"
                    style={{ width: 140, fontFamily: 'Monaco,monospace', fontSize: 13 }}
                  />
                </div>
                {error && <span className="cs-error">{error}</span>}
              </div>
              {finalResults.length >= 0 && !error && (
                <div className="result-inline">
                  <span className="result-label">SUBSETS</span>
                  <span className="result-val" style={{ fontSize: 12 }}>
                    {finalResults.map(r => `[${r.join(',')}]`).join(' ')}
                  </span>
                  <span className="result-len">({finalResults.length})</span>
                </div>
              )}
              <div className="try-examples">
                <span className="try-label">Try:</span>
                {EXAMPLES.map(ex => (
                  <button key={ex.label}
                    className={`example-chip ${numsRaw === ex.nums ? 'active' : ''}`}
                    onClick={() => setNumsRaw(ex.nums)}>
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
                <pre>{`Input:  nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  nums = [0]
Output: [[], [0]]`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              For each element we make a <strong>binary choice</strong>: include it or exclude it.
              With <code>n</code> elements, there are exactly <strong>2<sup>n</sup> subsets</strong>.
            </p>
            <p>
              We model this as a recursion tree where at each level we branch{' '}
              <strong>left (include)</strong> or <strong>right (exclude)</strong>. When we reach
              index <code>n</code>, we've made all decisions — snapshot the current path.
            </p>
            <p>
              No pruning needed because every path leads to a valid subset. The tree has exactly{' '}
              <code>2<sup>n+1</sup> − 1</code> nodes.
            </p>
          </div>

          <Approaches
            approaches={[
              { type: 'choose', label: 'Choose', description: 'At each index, decide include or exclude the element.' },
              { type: 'recurse', label: 'Recurse', description: 'Move to idx+1, passing updated path.' },
              { type: 'undo', label: 'Undo', description: 'After include-branch returns, pop element from path, then recurse for exclude.' },
              { type: 'base', label: 'Base case', description: 'idx === n → add snapshot of path to results.' },
            ]}
            complexity={{
              time: 'O(n · 2ⁿ) — 2ⁿ subsets, each takes O(n) to copy',
              space: 'O(n) recursion stack + O(n · 2ⁿ) output',
            }}
          />
          <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 13 }}>
            <div className="tabs" style={{ marginTop: 0 }}>
              {['Brute Force', 'Backtracking', 'Bitmask'].map((t, i) => (
                <span key={t} className={`tab ${i === 1 ? 'active' : ''}`}>{t}</span>
              ))}
            </div>
          </div>

          <InterviewNotes
            whatToLookFor={[
              'Understanding of include/exclude decision model',
              'Using a mutable path + pop instead of creating new arrays each call',
              'Knowing total result count is always 2ⁿ',
            ]}
            commonTraps={[
              'Forgetting to snapshot: results.append(path) adds a reference — use path[:]',
              'Confusing with Subsets II (with duplicates) — need sort + skip logic',
            ]}
            followUps={[
              'Subsets II (90) — handle duplicate numbers',
              'Bitmask approach: iterate 0..2^n-1, each bit = include/exclude',
              'Count subsets with XOR equal to target',
            ]}
          />

          <PatternRecognition
            patternName="Backtracking — Subset / Power Set"
            description="Every element has an independent binary choice (in/out). Tree width doubles at each level. Similar problems: Subsets II, Target Sum, Partition Equal Subset Sum."
          />
        </div>

        {/* ── Right Column ── */}
        <div className="cs-right">
          <VisualizerWrapper title="Subset Backtracking Visualizer">
            <div className="visualizer">
              <PlaybackControls
                isPaused={isPaused}
                onPlay={handlePlay}
                onPause={handlePause}
                onNext={handleNext}
                onPrev={handlePrev}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={setSpeed}
                disablePrev={!visualization || visualization.currentStep <= 0}
                disableNext={!visualization || visualization.currentStep >= (visualization.steps.length - 1)}
              />
              <SubsetsVisualizer visualization={visualization} />
            </div>
          </VisualizerWrapper>

          {parsedNums && <DryRunTable nums={parsedNums} />}

          <div className="card">
            <h2>Code</h2>
            <CodePanel />
          </div>
        </div>
      </div>
    </div>
  )
}
