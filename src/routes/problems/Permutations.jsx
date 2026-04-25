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
// LeetCode 46: all permutations of distinct integers

function generateSteps(nums) {
  const sorted = [...nums].sort((a, b) => a - b)
  const steps = []
  const results = []
  let nodeIdCounter = 0
  const allTreeNodes = []

  function snap(phase, activeId, stack, path, used, desc, extra = {}) {
    steps.push({
      phase, activeNodeId: activeId,
      treeNodes: allTreeNodes.map(n => ({ ...n })),
      callStack: stack.map(f => ({ ...f })),
      path: [...path],
      used: [...used],
      results: results.map(r => [...r]),
      description: desc, ...extra,
    })
  }

  function bt(path, used, parentId, stack, decision) {
    const id = nodeIdCounter++
    const isBase = path.length === sorted.length
    const node = {
      id, parentId, decision,
      label: `d=${path.length}`,
      depth: path.length, path: [...path],
      isBase, isPrune: false, match: false,
    }
    allTreeNodes.push(node)

    const frame = { id, funcName: 'bt', depth: path.length, path: [...path], used: [...used] }
    const newStack = [...stack, frame]

    snap(
      'enter', id, newStack, path, used,
      isBase
        ? `✅ All ${sorted.length} elements placed. Permutation [${path.join(', ')}] found!`
        : `Enter bt(depth=${path.length}, path=[${path.join(',')}])`,
      { entering: true },
    )

    if (isBase) {
      node.match = true
      results.push([...path])
      snap('found', id, newStack, path, used,
        `✅ Add [${path.join(', ')}] to results. Backtrack.`,
        { found: true })
      return
    }

    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) {
        snap('skip', id, newStack, path, used,
          `Skip ${sorted[i]}: already used in current path.`,
          { skipping: i })
        continue
      }

      snap('choose', id, newStack, path, used,
        `Choose ${sorted[i]}: path=[${[...path, sorted[i]].join(',')}]`,
        { choosing: sorted[i] })

      path.push(sorted[i])
      used[i] = true
      bt(path, used, id, newStack, { type: 'pick', val: sorted[i] })
      path.pop()
      used[i] = false

      snap('undo', id, newStack, path, used,
        `↩ Undo ${sorted[i]}. Back to path=[${path.join(',')}]`,
        { undoing: sorted[i] })
    }

    snap('return', id, stack, path, used,
      `Return from bt(depth=${path.length})`)
  }

  const rootId = nodeIdCounter++
  allTreeNodes.push({
    id: rootId, parentId: null, decision: null,
    label: 'root', depth: 0, path: [],
    isBase: false, isPrune: false, match: false,
  })

  snap('init', rootId, [], [], new Array(sorted.length).fill(false),
    `Start: nums=${JSON.stringify(sorted)}. Generating all ${sorted.length}! = ${factorial(sorted.length)} permutations.`)
  bt([], new Array(sorted.length).fill(false), rootId, [])
  snap('done', -1, [], [], new Array(sorted.length).fill(false),
    `Done! Found all ${results.length} permutations: ${results.map(r => '['+r.join(',')+']').join(' ')}`,
    { done: true })

  return { steps, results }
}

function factorial(n) {
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
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
  const CW = 70, CH = 74
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
  const svgW = maxX - minX + PAD * 2 + 70
  const svgH = maxY + PAD * 2 + 70
  const ox = PAD + 35 - minX

  return (
    <div className="cs-tree-wrap">
      <svg width={svgW} height={svgH} className="cs-tree-svg">
        {treeNodes.map(n => {
          const children = childrenMap[n.id] ?? []
          return children.map(cid => {
            const p = positions[n.id], c = positions[cid]
            if (!p || !c) return null
            const cn = nodeMap[cid]
            return (
              <line key={`e-${n.id}-${cid}`}
                x1={p.x+ox} y1={p.y+26} x2={c.x+ox} y2={c.y+10}
                stroke={cn?.match ? '#10b981' : '#94a3b8'}
                strokeWidth={cn?.match ? 2.5 : 1.5} />
            )
          })
        })}

        {treeNodes.map(n => {
          if (n.parentId == null || !n.decision) return null
          const p = positions[n.parentId], c = positions[n.id]
          if (!p || !c) return null
          return (
            <text key={`el-${n.id}`}
              x={(p.x+c.x)/2+ox} y={(p.y+c.y)/2+16}
              textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="700">
              {n.decision.val}
            </text>
          )
        })}

        {treeNodes.map(n => {
          const pos = positions[n.id]
          if (!pos) return null
          const isActive = n.id === activeNodeId
          const cx = pos.x + ox, cy = pos.y + 22
          let fill = '#e2e8f0', stroke = '#94a3b8', textColor = '#1e293b'
          if (isActive)     { fill = '#6366f1'; stroke = '#4f46e5'; textColor = 'white' }
          else if (n.match) { fill = '#d1fae5'; stroke = '#10b981'; textColor = '#065f46' }
          return (
            <g key={`nd-${n.id}`}>
              <circle cx={cx} cy={cy} r={20} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={cx} y={cy-2} textAnchor="middle" fontSize="9" fill={textColor} fontWeight="700">d</text>
              <text x={cx} y={cy+9} textAnchor="middle" fontSize="12" fill={textColor} fontWeight="800">
                {n.isBase ? '✓' : n.depth}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Used Array Display ───────────────────────────────────────────────────────

function UsedArray({ nums, used }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Used:</span>
      {nums.sort((a,b)=>a-b).map((v, i) => (
        <span key={i} style={{
          padding: '2px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
          background: used[i] ? '#fee2e2' : '#d1fae5',
          color: used[i] ? '#991b1b' : '#065f46',
          border: `1.5px solid ${used[i] ? '#ef4444' : '#10b981'}`,
          textDecoration: used[i] ? 'line-through' : 'none',
        }}>
          {v}
        </span>
      ))}
    </div>
  )
}

// ─── Call Stack render frame ──────────────────────────────────────────────────

function renderBtFrame(frame) {
  return (
    <>
      <div className="csp-frame-name">bt()</div>
      <div className="csp-frame-vars">
        <span className="csp-var"><span className="csp-var-k">d</span>={frame.depth}</span>
        <span className="csp-var"><span className="csp-var-k">path</span>=[{frame.path.join(',')}]</span>
      </div>
    </>
  )
}

// ─── Path Panel ───────────────────────────────────────────────────────────────

function PathPanel({ path, results, nums, used }) {
  const n = nums ? nums.sort((a,b)=>a-b) : []
  return (
    <div className="cs-path-panel">
      <div className="cs-path-row">
        <span className="cs-path-label">Current Permutation ({path.length}/{n.length}):</span>
        <div className="cs-path-chips">
          {path.length === 0
            ? <span className="cs-path-empty">[]</span>
            : path.map((v, i) => <span key={i} className="cs-path-chip">{v}</span>)
          }
          {path.length === n.length && <span className="cs-path-found"> ✅ complete!</span>}
        </div>
      </div>
      {used && n.length > 0 && <UsedArray nums={n} used={used} />}
      {results.length > 0 && (
        <div className="cs-results-row">
          <span className="cs-path-label">Permutations ({results.length}):</span>
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

// ─── Visualizer ───────────────────────────────────────────────────────────────

function PermutationsVisualizer({ nums, visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see backtracking step-by-step</p>
    </div>
  )
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null
  const phaseClass = { found: 'match', choose: 'info', done: 'match', skip: 'warning' }
  const tooLarge = step.treeNodes.length > 250
  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <PathPanel path={step.path} results={step.results} nums={nums} used={step.used} />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>Step {visualization.currentStep+1} / {visualization.steps.length} — {step.phase.toUpperCase()}</strong>
        <p>{step.description}</p>
      </div>
      <div className="cs-viz-split">
        <div className="cs-tree-section">
          <div className="cs-section-label">Decision Tree (edge = chosen element)</div>
          {tooLarge
            ? <div className="cs-tree-toolarge">Tree too large. Use ≤ 3 elements.</div>
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
  python: `def permute(nums):
    results = []
    used = [False] * len(nums)

    def bt(path):
        if len(path) == len(nums):
            results.append(path[:])  # snapshot
            return
        for i in range(len(nums)):
            if used[i]:
                continue              # skip used elements
            used[i] = True
            path.append(nums[i])
            bt(path)
            path.pop()               # undo
            used[i] = False          # undo

    bt([])
    return results`,

  java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> results = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), results);
    return results;
}

void backtrack(int[] nums, boolean[] used,
               List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path)); return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, used, path, res);
        path.remove(path.size() - 1);  // undo
        used[i] = false;               // undo
    }
}`,

  cpp: `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> results;
    vector<bool> used(nums.size(), false);
    vector<int> path;

    function<void()> bt = [&]() {
        if (path.size() == nums.size()) {
            results.push_back(path); return;
        }
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push_back(nums[i]);
            bt();
            path.pop_back();   // undo
            used[i] = false;   // undo
        }
    };

    bt();
    return results;
}`,

  javascript: `function permute(nums) {
    const results = [];
    const used = new Array(nums.length).fill(false);

    function bt(path) {
        if (path.length === nums.length) {
            results.push([...path]);  // snapshot
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            bt(path);
            path.pop();        // undo
            used[i] = false;   // undo
        }
    }

    bt([]);
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

// ─── Dry Run Table ────────────────────────────────────────────────────────────

function DryRunTable({ nums }) {
  const sorted = [...nums].sort((a,b)=>a-b)
  const { results } = generateSteps(nums)
  return (
    <div className="card">
      <h2>Dry Run — nums={JSON.stringify(sorted)}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        All {factorial(sorted.length)} permutations (depth={sorted.length}, one branch chosen per level):
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {results.map((r, i) => (
          <span key={i} className="cs-result-chip">[{r.join(', ')}]</span>
        ))}
      </div>
    </div>
  )
}

// ─── Input Parsing ────────────────────────────────────────────────────────────

function parseNums(raw) {
  try {
    const arr = JSON.parse(raw)
    if (
      Array.isArray(arr) && arr.length >= 1 && arr.length <= 4 &&
      arr.every(v => typeof v === 'number' && Number.isInteger(v)) &&
      new Set(arr).size === arr.length
    ) return arr
  } catch (_) {}
  return null
}

const EXAMPLES = [
  { label: '[1,2,3]', nums: '[1,2,3]', hint: '6 perms' },
  { label: '[0,1]',   nums: '[0,1]',   hint: '2 perms' },
  { label: '[1,2,3,4]', nums: '[1,2,3,4]', hint: '24 perms' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Permutations() {
  const [numsRaw, setNumsRaw] = useState('[1,2,3]')
  const [visualization, setVisualization] = useState(null)
  const [finalResults, setFinalResults] = useState([])
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const build = useCallback((raw) => {
    const nums = parseNums(raw)
    if (!nums) { setError('Enter a JSON array of 1–4 distinct integers, e.g. [1,2,3]'); return }
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
        title="46. Permutations"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Array', className: 'topic' },
          { label: 'Backtracking', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an array <code>nums</code> of <strong>distinct integers</strong>, return{' '}
              <em>all possible permutations</em>. You can return the answer in any order.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ nums.length ≤ 6</code>
              <span className="constraints-sep">·</span>
              <code>-10 ≤ nums[i] ≤ 10</code>
              <span className="constraints-sep">·</span>
              All integers are <strong>unique</strong>
            </div>
          </div>
        </div>

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
                  <span className="result-label">PERMUTATIONS</span>
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

        <div className="cs-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  nums = [0,1]
Output: [[0,1],[1,0]]`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              A permutation uses <strong>every element exactly once</strong> in a different order.
              We build permutations position-by-position: at each depth, try every{' '}
              <strong>unused</strong> element, mark it used, recurse, then unmark (backtrack).
            </p>
            <p>
              Key difference from combinations: <strong>order matters</strong> and we look at all
              indices (not just <code>start..n</code>) — we skip only elements already in the path
              via a <code>used[]</code> boolean array.
            </p>
            <p>
              Total permutations = <strong>n!</strong>. With n=3: 3×2×1 = 6.
            </p>
          </div>

          <Approaches
            approaches={[
              { type: 'choose', label: 'Choose', description: 'Try each nums[i] that is not in used[].' },
              { type: 'recurse', label: 'Recurse', description: 'Mark used[i]=true, add to path, recurse.' },
              { type: 'undo', label: 'Undo', description: 'Pop path, set used[i]=false. Try next element.' },
              { type: 'base', label: 'Base case', description: 'path.length === n → all placed, snapshot.' },
            ]}
            complexity={{
              time: 'O(n · n!) — n! permutations, O(n) copy each',
              space: 'O(n) stack + used[] + O(n · n!) output',
            }}
          />

          <InterviewNotes
            whatToLookFor={[
              'Using used[] vs. swapping in-place (both valid)',
              'Understanding why we loop all indices (not start..n)',
              'Correctly restoring state after each recursive call',
            ]}
            commonTraps={[
              'Forgetting to snapshot path (reference vs copy)',
              'Not resetting used[i] after recursion returns',
              'Confusing with Permutations II (47) — duplicates require sorting + neighbor skip',
            ]}
            followUps={[
              'Permutations II (47) — array may contain duplicates',
              'Next Permutation (31) — O(n) in-place without backtracking',
              'Permutation Sequence (60) — find k-th permutation directly',
            ]}
          />

          <PatternRecognition
            patternName="Backtracking — Permutations / Ordering"
            description="When order matters and every element must appear, use a used[] boolean array. At each position, try all unused elements. The recursion tree has n branches at depth 0, n−1 at depth 1, etc., giving n! leaves."
          />
        </div>

        <div className="cs-right">
          <VisualizerWrapper title="Permutations Backtracking Visualizer">
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
              <PermutationsVisualizer nums={parsedNums || [1,2,3]} visualization={visualization} />
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
