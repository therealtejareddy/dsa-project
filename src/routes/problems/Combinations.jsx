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
// LeetCode 77: choose k distinct numbers from [1..n]

function generateSteps(n, k) {
  const steps = []
  const results = []
  let nodeIdCounter = 0
  const allTreeNodes = []

  function snap(phase, activeId, stack, path, desc, extra = {}) {
    steps.push({
      phase, activeNodeId: activeId,
      treeNodes: allTreeNodes.map(nd => ({ ...nd })),
      callStack: stack.map(f => ({ ...f })),
      path: [...path],
      results: results.map(r => [...r]),
      description: desc, ...extra,
    })
  }

  function bt(start, path, parentId, stack, decision) {
    const id = nodeIdCounter++
    const need = k - path.length
    const isBase = path.length === k
    const node = {
      id, parentId, decision,
      label: `sz=${path.length}`,
      start, path: [...path],
      isBase, isPrune: false, match: false,
    }
    allTreeNodes.push(node)

    const frame = { id, funcName: 'bt', start, path: [...path], need }
    const newStack = [...stack, frame]

    snap(
      'enter', id, newStack, path,
      isBase
        ? `✅ path.length==${k}. Found combination [${path.join(', ')}]!`
        : `Enter bt(start=${start}, path=[${path.join(',')}], need=${need})`,
      { entering: true },
    )

    if (isBase) {
      node.match = true
      results.push([...path])
      snap('found', id, newStack, path,
        `✅ Add [${path.join(', ')}] to results. Backtrack.`,
        { found: true })
      return
    }

    for (let i = start; i <= n; i++) {
      // pruning: remaining numbers (n - i + 1) must be >= remaining needed (k - path.length)
      if (n - i + 1 < need) {
        snap('prune', id, newStack, path,
          `✂️ Prune: only ${n - i + 1} numbers left (${i}..${n}) but need ${need} more. Stop.`,
          { pruneCand: i })
        break
      }

      snap('choose', id, newStack, path,
        `Choose ${i}: path=[${[...path, i].join(',')}]`,
        { choosing: i })

      path.push(i)
      bt(i + 1, path, id, newStack, { type: 'pick', val: i })
      path.pop()

      snap('undo', id, newStack, path,
        `↩ Undo ${i}. Back to path=[${path.join(',')}]`,
        { undoing: i })
    }

    snap('return', id, stack, path, `Return from bt(start=${start})`)
  }

  const rootId = nodeIdCounter++
  allTreeNodes.push({
    id: rootId, parentId: null, decision: null,
    label: 'root', start: 1, path: [],
    isBase: false, isPrune: false, match: false,
  })

  snap('init', rootId, [], [], `Start: n=${n}, k=${k}. Choose ${k} from [1..${n}].`)
  bt(1, [], rootId, [])
  snap('done', -1, [], [],
    `Done! Found all ${results.length} combination(s): ${results.map(r => '['+r.join(',')+']').join(' ')}`,
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
                stroke={cn?.match ? '#10b981' : cn?.isPrune ? '#ef4444' : '#94a3b8'}
                strokeWidth={cn?.match ? 2.5 : 1.5}
                strokeDasharray={cn?.isPrune ? '4,3' : 'none'} />
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
              +{n.decision.val}
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
          else if (n.isPrune) { fill = '#fee2e2'; stroke = '#ef4444'; textColor = '#991b1b' }
          return (
            <g key={`nd-${n.id}`}>
              <circle cx={cx} cy={cy} r={20} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={cx} y={cy-2} textAnchor="middle" fontSize="9" fill={textColor} fontWeight="700">sz</text>
              <text x={cx} y={cy+9} textAnchor="middle" fontSize="12" fill={textColor} fontWeight="800">
                {n.isBase ? '✓' : n.path.length}
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
        <span className="csp-var"><span className="csp-var-k">start</span>={frame.start}</span>
        <span className="csp-var"><span className="csp-var-k">need</span>={frame.need}</span>
        <span className="csp-var"><span className="csp-var-k">path</span>=[{frame.path.join(',')}]</span>
      </div>
    </>
  )
}

// ─── Path Panel ───────────────────────────────────────────────────────────────

function PathPanel({ path, results, k }) {
  return (
    <div className="cs-path-panel">
      <div className="cs-path-row">
        <span className="cs-path-label">Current Path ({path.length}/{k}):</span>
        <div className="cs-path-chips">
          {path.length === 0
            ? <span className="cs-path-empty">[]</span>
            : path.map((v, i) => <span key={i} className="cs-path-chip">{v}</span>)
          }
          {path.length === k && <span className="cs-path-found"> ✅ complete!</span>}
        </div>
      </div>
      {results.length > 0 && (
        <div className="cs-results-row">
          <span className="cs-path-label">Combinations ({results.length}):</span>
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

function CombinationsVisualizer({ k, visualization }) {
  if (!visualization) return (
    <div className="visual-placeholder">
      <p>Click <strong>Play</strong> to see backtracking step-by-step</p>
    </div>
  )
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null
  const phaseClass = { found: 'match', prune: 'warning', choose: 'info', done: 'match' }
  const tooLarge = step.treeNodes.length > 200
  return (
    <div className="visualizer-content">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <PathPanel path={step.path} results={step.results} k={k} />
      <div className={`info-box ${phaseClass[step.phase] || ''}`}>
        <strong>Step {visualization.currentStep+1} / {visualization.steps.length} — {step.phase.toUpperCase()}</strong>
        <p>{step.description}</p>
      </div>
      <div className="cs-viz-split">
        <div className="cs-tree-section">
          <div className="cs-section-label">Decision Tree</div>
          {tooLarge
            ? <div className="cs-tree-toolarge">Tree too large. Use smaller n/k values.</div>
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
  python: `def combine(n, k):
    results = []

    def bt(start, path):
        if len(path) == k:
            results.append(path[:])  # found k elements
            return
        for i in range(start, n + 1):
            # Pruning: need (k - len(path)) more, so i can go up to n-(k-len(path))+1
            if n - i + 1 < k - len(path):
                break
            path.append(i)
            bt(i + 1, path)          # next number must be larger (no reuse)
            path.pop()               # undo

    bt(1, [])
    return results`,

  java: `public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> results = new ArrayList<>();
    backtrack(n, k, 1, new ArrayList<>(), results);
    return results;
}

void backtrack(int n, int k, int start,
               List<Integer> path, List<List<Integer>> res) {
    if (path.size() == k) {
        res.add(new ArrayList<>(path)); return;
    }
    int need = k - path.size();
    for (int i = start; i <= n; i++) {
        if (n - i + 1 < need) break;   // prune
        path.add(i);
        backtrack(n, k, i + 1, path, res);
        path.remove(path.size() - 1);   // undo
    }
}`,

  cpp: `vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> results;
    vector<int> path;

    function<void(int)> bt = [&](int start) {
        if (path.size() == k) {
            results.push_back(path); return;
        }
        int need = k - path.size();
        for (int i = start; i <= n; i++) {
            if (n - i + 1 < need) break;  // prune
            path.push_back(i);
            bt(i + 1);
            path.pop_back();              // undo
        }
    };

    bt(1);
    return results;
}`,

  javascript: `function combine(n, k) {
    const results = [];

    function bt(start, path) {
        if (path.length === k) {
            results.push([...path]);
            return;
        }
        const need = k - path.length;
        for (let i = start; i <= n; i++) {
            if (n - i + 1 < need) break;  // prune
            path.push(i);
            bt(i + 1, path);              // next must be > i
            path.pop();                   // undo
        }
    }

    bt(1, []);
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

function DryRunTable({ n, k }) {
  const { results } = generateSteps(n, k)
  return (
    <div className="card">
      <h2>Dry Run — n={n}, k={k}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        All C({n},{k}) = {results.length} combinations choosing {k} from [1..{n}]:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {results.map((r, i) => (
          <span key={i} className="cs-result-chip">[{r.join(', ')}]</span>
        ))}
      </div>
    </div>
  )
}

const EXAMPLES = [
  { label: 'n=4,k=2', n: '4', k: '2', hint: '6 combos' },
  { label: 'n=4,k=3', n: '4', k: '3', hint: '4 combos' },
  { label: 'n=5,k=3', n: '5', k: '3', hint: '10 combos' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Combinations() {
  const [nRaw, setNRaw] = useState('4')
  const [kRaw, setKRaw] = useState('2')
  const [visualization, setVisualization] = useState(null)
  const [finalResults, setFinalResults] = useState([])
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const build = useCallback((nr, kr) => {
    const n = parseInt(nr, 10), k = parseInt(kr, 10)
    if (isNaN(n) || n < 1 || n > 8) { setError('n must be 1–8'); return }
    if (isNaN(k) || k < 1 || k > n) { setError(`k must be 1–${n}`); return }
    setError('')
    const { steps, results } = generateSteps(n, k)
    setVisualization({ steps, currentStep: 0 })
    setFinalResults(results)
    setIsPaused(true)
  }, [])

  useEffect(() => { build(nRaw, kRaw) }, [nRaw, kRaw, build])

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

  const n = parseInt(nRaw, 10), k = parseInt(kRaw, 10)
  const validN = !isNaN(n) && n >= 1 && n <= 8
  const validK = !isNaN(k) && k >= 1 && k <= n

  return (
    <div className="cs-container">
      <PageHeader
        title="77. Combinations"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Backtracking', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given two integers <code>n</code> and <code>k</code>, return{' '}
              <em>all possible combinations of k numbers chosen from [1, n]</em>.
              Return the answer in any order.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ n ≤ 20</code>
              <span className="constraints-sep">·</span>
              <code>1 ≤ k ≤ n</code>
            </div>
          </div>
        </div>

        <div className="cs-full-width">
          <div className="card input-card">
            <div className="input-bar">
              <div className="input-fields">
                <div className="input-inline">
                  <label>n</label>
                  <input type="number" value={nRaw} min={1} max={8} onChange={e => setNRaw(e.target.value)} style={{ width: 60 }} />
                </div>
                <div className="input-inline">
                  <label>k</label>
                  <input type="number" value={kRaw} min={1} max={8} onChange={e => setKRaw(e.target.value)} style={{ width: 60 }} />
                </div>
                {error && <span className="cs-error">{error}</span>}
              </div>
              {finalResults.length >= 0 && !error && (
                <div className="result-inline">
                  <span className="result-label">RESULTS</span>
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
                    className={`example-chip ${nRaw === ex.n && kRaw === ex.k ? 'active' : ''}`}
                    onClick={() => { setNRaw(ex.n); setKRaw(ex.k) }}>
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
                <pre>{`Input:  n=4, k=2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  n=1, k=1
Output: [[1]]`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              We need to pick exactly <code>k</code> numbers from <code>[1..n]</code> in{' '}
              <strong>non-decreasing order</strong> (to avoid duplicates). At each step we pick
              the next number from <code>start</code> to <code>n</code>, ensuring no reuse.
            </p>
            <p>
              <strong>Key pruning:</strong> if there aren't enough remaining numbers to fill{' '}
              <code>k - path.length</code> slots, break early. This significantly reduces the
              search space ({`n - i + 1 < k - path.length → break`}).
            </p>
          </div>

          <Approaches
            approaches={[
              { type: 'choose', label: 'Choose', description: 'Pick number i from start..n.' },
              { type: 'recurse', label: 'Recurse', description: 'bt(i+1) — next pick must be strictly larger.' },
              { type: 'undo', label: 'Undo', description: 'Pop, try next i.' },
              { type: 'prune', icon: '✂', label: 'Prune', description: 'If n−i+1 < need, no valid combo possible. Break.' },
            ]}
            complexity={{
              time: 'O(k · C(n,k))',
              space: 'O(k) stack + O(k · C(n,k)) output',
            }}
          />

          <InterviewNotes
            whatToLookFor={[
              'Recognizing i+1 (not i) avoids element reuse',
              'The pruning condition and why it\'s valid',
            ]}
            commonTraps={[
              'Confusion with Combination Sum (39) where reuse is allowed',
              'Missing the pruning condition → TLE on larger inputs',
            ]}
            followUps={[
              'Combination Sum (39) — unlimited reuse',
              'Combination Sum II (40) — each element once, duplicates in input',
              'Letter Combinations of a Phone Number (17)',
            ]}
          />

          <PatternRecognition
            patternName="Backtracking — Fixed-Length Combinations"
            description="Choosing k items from n with order ignored and no reuse. The key is always advancing start to avoid duplicates + use pruning for efficiency."
          />
        </div>

        <div className="cs-right">
          <VisualizerWrapper title="Combinations Backtracking Visualizer">
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
              <CombinationsVisualizer k={k} visualization={visualization} />
            </div>
          </VisualizerWrapper>

          {validN && validK && <DryRunTable n={n} k={k} />}

          <div className="card">
            <h2>Code</h2>
            <CodePanel />
          </div>
        </div>
      </div>
    </div>
  )
}
