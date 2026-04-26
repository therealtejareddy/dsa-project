import { useState, useEffect, useContext } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import VisualizerWrapper from '../../components/VisualizerWrapper'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import ProblemCard from '../../components/ProblemCard'
import RecursionTree from '../../components/visualizers/RecursionTree'
import DPApproachTabs from '../../components/DPApproachTabs'
import CodeLangTabs from '../../components/CodeLangTabs'
import { usePlayback } from '../../hooks/usePlayback'
import { useProblemNotes } from '../../hooks/useProblemNotes'
import { AuthContext } from '../../contexts/AuthContext'
import '../../styles/DynamicProgramming.css'

/* ════════════════════════════════════════════════════════════════════════════
   MAIN ENTRY — DP Pattern
   ════════════════════════════════════════════════════════════════════════════ */
export default function DynamicProgramming() {
  const [activePattern, setActivePattern] = useState('fibonacci')

  const patterns = [
    { id: 'fibonacci',        label: '🔢 Fibonacci',          desc: 'Linear recurrence' },
    { id: 'knapsack01',       label: '🎒 0/1 Knapsack',       desc: 'Include/exclude items' },
    { id: 'unbounded',        label: '♾ Unbounded Knapsack',  desc: 'Reuse items freely' },
    { id: 'lis',              label: '📈 LIS',                 desc: 'Longest increasing sub' },
    { id: 'lcs',              label: '🔤 LCS',                 desc: 'Longest common sub' },
    { id: 'kadane',           label: '💰 Kadane\'s',           desc: 'Max subarray sum' },
    { id: 'mcm',              label: '✖ MCM',                  desc: 'Matrix chain mult.' },
    { id: 'subsequences',     label: '🌿 Subsequences',        desc: 'Pick / Don\'t Pick' },
    { id: 'grid',             label: '🗺 DP on Grid',          desc: '2D grid traversal' },
    { id: 'trees',            label: '🌳 DP on Trees',         desc: 'Tree DP' },
    { id: 'graphs',           label: '🕸 DP on Graphs',        desc: 'Shortest/longest paths' },
    { id: 'partition',        label: '✂ Partition',            desc: 'Subset partitioning' },
  ]

  return (
    <div className="dp-container">
      <PageHeader
        title="Dynamic Programming Patterns"
        badges={[
          { label: 'Advanced', className: 'difficulty-hard' },
          { label: 'Dynamic Programming', className: 'topic' },
        ]}
      />

      <main className="dp-main">
        {/* Overview Card */}
        <div className="card dp-full-width">
          <h2>📋 Dynamic Programming Overview</h2>
          <p>
            Dynamic Programming is an optimization technique that solves complex problems by breaking them into
            overlapping subproblems, solving each only once, and storing results. It converts exponential
            brute-force into polynomial time.
          </p>
          <p className="constraints-line">
            <span className="constraints-title">Core Idea:</span>
            Recursion + Memoization (top-down) = Tabulation (bottom-up)
          </p>
        </div>

        {/* Pattern Tabs */}
        <div className="card dp-full-width">
          <div className="dp-pattern-tabs">
            {patterns.map(p => (
              <button
                key={p.id}
                className={`dp-pattern-tab ${activePattern === p.id ? 'active' : ''}`}
                onClick={() => setActivePattern(p.id)}
              >
                <span className="dp-tab-label">{p.label}</span>
                <span className="dp-tab-desc">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active SubPattern */}
        {activePattern === 'fibonacci'    && <FibonacciPattern />}
        {activePattern === 'knapsack01'   && <Knapsack01Pattern />}
        {activePattern === 'unbounded'    && <UnboundedKnapsackPattern />}
        {activePattern === 'lis'          && <LISPattern />}
        {activePattern === 'lcs'          && <LCSPattern />}
        {activePattern === 'kadane'       && <KadanePattern />}
        {activePattern === 'mcm'          && <MCMPattern />}
        {activePattern === 'subsequences' && <SubsequencesPattern />}
        {activePattern === 'grid'         && <GridPattern />}
        {activePattern === 'trees'        && <TreesPattern />}
        {activePattern === 'graphs'       && <GraphsPattern />}
        {activePattern === 'partition'    && <PartitionPattern />}
      </main>
    </div>
  )
}

/* ─── ComingSoon placeholder ─────────────────────────────────────────────── */
function ComingSoon({ label }) {
  return (
    <section className="dp-pattern-section">
      <div className="card dp-coming-soon">
        <span className="dp-coming-icon">🚀</span>
        <h2>{label}</h2>
        <p>This subpattern is being built. Check back soon!</p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   FIBONACCI PATTERN
   ════════════════════════════════════════════════════════════════════════════ */
function FibonacciPattern() {
  const { user } = useContext(AuthContext)
  const [approach,  setApproach] = useState('recursion')
  const [codeLang,  setCodeLang] = useState('javascript')
  const [n,         setN]        = useState(6)
  const [result,    setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  /* ── Problem List ────────────────────────────────────────────────────── */
  const fibProblems = [
    {
      id: 'lc509',
      title: 'LC 509. Fibonacci Number',
      description: 'Compute the nth Fibonacci number using DP.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/fibonacci-number/description/',
      topics: ['Math', 'DP', 'Memoization'],
    },
    {
      id: 'lc1137',
      title: 'LC 1137. N-th Tribonacci Number',
      description: 'Tribonacci is like Fibonacci but sums three previous values.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/n-th-tribonacci-number/description/',
      topics: ['Math', 'DP', 'Memoization'],
    },
    {
      id: 'lc70',
      title: 'LC 70. Climbing Stairs',
      description: 'Count distinct ways to climb n stairs taking 1 or 2 steps at a time.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/description/',
      topics: ['Math', 'DP', 'Memoization'],
    },
    {
      id: 'lc198',
      title: 'LC 198. House Robber',
      description: 'Maximize loot from non-adjacent houses — a Fibonacci-style linear DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/house-robber/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc213',
      title: 'LC 213. House Robber II',
      description: 'Houses arranged in a circle — apply House Robber twice on subarrays.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/house-robber-ii/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc746',
      title: 'LC 746. Min Cost Climbing Stairs',
      description: 'Reach the top with minimum cost, each step costs cost[i].',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/min-cost-climbing-stairs/description/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-fibonacci', fibProblems, user?.uid)

  /* ── Recursion Algorithm ────────────────────────────────────────────── */
  const computeRecursion = (target) => {
    const steps = []
    const calls = []
    let callId = 0

    const fib = (k, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, k, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, k, depth, parentId, callStack: calls.map(c => ({ ...c })) })

      if (k <= 1) {
        calls[id].resolved = true
        calls[id].value = k
        steps.push({ type: 'return', id, k, value: k, depth, callStack: calls.map(c => ({ ...c })) })
        return k
      }

      const left  = fib(k - 1, depth + 1, id)
      const right = fib(k - 2, depth + 1, id)
      const val   = left + right
      calls[id].resolved = true
      calls[id].value = val
      steps.push({ type: 'return', id, k, value: val, depth, callStack: calls.map(c => ({ ...c })) })
      return val
    }

    const result = target <= 10 ? fib(target) : fib(Math.min(target, 10))
    return { result, steps, calls }
  }

  /* ── Memoization Algorithm ──────────────────────────────────────────── */
  const computeMemoization = (target) => {
    const steps = []
    const memo  = {}
    const safeN = Math.min(target, 15)

    const fib = (k) => {
      if (k in memo) {
        steps.push({ type: 'cache-hit', k, value: memo[k], memo: { ...memo } })
        return memo[k]
      }
      steps.push({ type: 'compute', k, memo: { ...memo } })
      if (k <= 1) {
        memo[k] = k
        steps.push({ type: 'store', k, value: k, memo: { ...memo } })
        return k
      }
      const val = fib(k - 1) + fib(k - 2)
      memo[k] = val
      steps.push({ type: 'store', k, value: val, memo: { ...memo } })
      return val
    }

    const result = fib(safeN)
    return { result, steps, memo }
  }

  /* ── Tabulation Algorithm ───────────────────────────────────────────── */
  const computeTabulation = (target) => {
    const safeN = Math.min(target, 20)
    const dp    = new Array(safeN + 1).fill(0)
    const steps = []

    dp[0] = 0
    if (safeN >= 1) dp[1] = 1
    steps.push({ i: 0, dp: [...dp], filled: 0 })
    if (safeN >= 1) steps.push({ i: 1, dp: [...dp], filled: 1 })

    for (let i = 2; i <= safeN; i++) {
      dp[i] = dp[i - 1] + dp[i - 2]
      steps.push({ i, dp: [...dp], filled: i, from1: i - 1, from2: i - 2 })
    }

    return { result: dp[safeN], steps, dp }
  }

  /* ── Compute on input/approach change ──────────────────────────────── */
  useEffect(() => {
    let data
    if      (approach === 'recursion')    data = computeRecursion(n)
    else if (approach === 'memoization')  data = computeMemoization(n)
    else                                   data = computeTabulation(n)
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [n, approach])

  /* ── Complexity per approach ────────────────────────────────────────── */
  const complexity = {
    recursion:   { time: 'O(2ⁿ)',    space: 'O(n) — call stack' },
    memoization: { time: 'O(n)',      space: 'O(n) — memo table + stack' },
    tabulation:  { time: 'O(n)',      space: 'O(n) → O(1) with space opt.' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Fibonacci DP</h2>
          <ul>
            <li>Current state depends on <strong>previous 1–2 states</strong></li>
            <li>Linear recurrence: <code>f(n) = f(n-1) + f(n-2)</code></li>
            <li>Problems: climbing stairs, house robber, tile tiling</li>
            <li>Any problem with a "choose from last k results" structure</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> Recognise the recurrence, define base cases, fill bottom-up or memoize top-down.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span>{v.time}</span>
                <span>{v.space.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Fibonacci(n)</h2>

        {/* Input */}
        <div className="dp-input-bar">
          <label>n =</label>
          <input
            type="number"
            value={n}
            min={1}
            max={approach === 'recursion' ? 10 : approach === 'memoization' ? 15 : 20}
            onChange={e => setN(Math.max(1, parseInt(e.target.value) || 1))}
            className="dp-n-input"
          />
          {result !== null && (
            <div className="dp-result-badge">
              <span>fib({n})</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
          <span className="dp-input-hint">
            max n: {approach === 'recursion' ? 10 : approach === 'memoization' ? 15 : 20}
          </span>
        </div>

        {/* Approach Tabs */}
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />

        <VisualizerWrapper title={`Fibonacci — ${approach.charAt(0).toUpperCase() + approach.slice(1)}`}>
          {approach === 'recursion'   && <FibRecursionVisualizer n={n} visualization={visualization} />}
          {approach === 'memoization' && <FibMemoVisualizer n={n} visualization={visualization} />}
          {approach === 'tabulation'  && <FibTableVisualizer n={n} visualization={visualization} />}
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
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {/* Recursion Code */}
        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
function fib(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;

  // Recursive case: fib(n) = fib(n-1) + fib(n-2)
  // Problem: fib(n-2) is recomputed many times!
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(6)); // 8`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
def fib(n: int) -> int:
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1

    # Recursive case: fib(n) = fib(n-1) + fib(n-2)
    # Problem: fib(n-2) is recomputed many times!
    return fib(n - 1) + fib(n - 2)

print(fib(6))  # 8`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
public class Fibonacci {
    public static int fib(int n) {
        // Base cases
        if (n <= 0) return 0;
        if (n == 1) return 1;

        // Recursive case: fib(n) = fib(n-1) + fib(n-2)
        // Problem: fib(n-2) is recomputed many times!
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(6)); // 8
    }
}`} />
        )}

        {/* Memoization Code */}
        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n) time, O(n) space
function fib(n, memo = {}) {
  // Check cache first
  if (n in memo) return memo[n];

  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;

  // Compute and store in memo before returning
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

console.log(fib(6));  // 8
console.log(fib(40)); // 102334155 — fast!`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n) time, O(n) space
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1

    # Compute and cache automatically via @lru_cache
    return fib(n - 1) + fib(n - 2)

print(fib(6))   # 8
print(fib(40))  # 102334155 — fast!

# Manual memo version
def fib_manual(n: int, memo: dict = {}) -> int:
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_manual(n - 1, memo) + fib_manual(n - 2, memo)
    return memo[n]`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n) time, O(n) space
import java.util.HashMap;
import java.util.Map;

public class Fibonacci {
    private static Map<Integer, Long> memo = new HashMap<>();

    public static long fib(int n) {
        // Check cache first
        if (memo.containsKey(n)) return memo.get(n);

        // Base cases
        if (n <= 0) return 0;
        if (n == 1) return 1;

        // Compute and store in memo before returning
        long result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(fib(6));  // 8
        System.out.println(fib(40)); // 102334155
    }
}`} />
        )}

        {/* Tabulation Code */}
        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n) time
// Option A: O(n) space
function fib(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // Fill table left-to-right
  }

  return dp[n];
}

// Option B: O(1) space optimisation
function fibOptimized(n) {
  if (n <= 0) return 0;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    [prev2, prev1] = [prev1, prev1 + prev2];
  }
  return n === 1 ? prev1 : prev1;
}

console.log(fib(6));           // 8
console.log(fibOptimized(6));  // 8`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n) time
# Option A: O(n) space
def fib(n: int) -> int:
    if n <= 0: return 0
    if n == 1: return 1

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]  # Fill left-to-right

    return dp[n]

# Option B: O(1) space optimisation
def fib_optimized(n: int) -> int:
    if n <= 0: return 0
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1 if n >= 1 else 0

print(fib(6))           # 8
print(fib_optimized(6)) # 8`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n) time
public class Fibonacci {

    // Option A: O(n) space
    public static long fib(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;

        long[] dp = new long[n + 1];
        dp[0] = 0;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2]; // Fill table left-to-right
        }

        return dp[n];
    }

    // Option B: O(1) space optimisation
    public static long fibOptimized(int n) {
        if (n <= 0) return 0;
        long prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            long curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return n == 1 ? 1 : prev1;
    }

    public static void main(String[] args) {
        System.out.println(fib(6));           // 8
        System.out.println(fibOptimized(6));   // 8
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Identify Overlapping Subproblems</strong>
              <p>fib(5) calls fib(4) and fib(3). fib(4) also calls fib(3) — it's computed twice! This is the hallmark of a DP problem.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Define Recurrence</strong>
              <p><code>fib(n) = fib(n-1) + fib(n-2)</code> with base cases <code>fib(0)=0, fib(1)=1</code>.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Memoize (Top-Down)</strong>
              <p>Store each computed value in a map. Before computing, check if it's already cached — if yes, return immediately.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Tabulize (Bottom-Up)</strong>
              <p>Fill a dp[] array from dp[0] to dp[n]. No recursion needed — just a loop. Optimize space to O(1) by keeping only the last two values.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Recursion tree:</strong> Draw it first — if you see repeated calls, DP is the fix</li>
          <li><strong>Top-down = Recursion + HashMap:</strong> Add a cache on top of the brute-force solution</li>
          <li><strong>Bottom-up = Loop + Array:</strong> Fill from smallest subproblem upward</li>
          <li><strong>Space optimize:</strong> If dp[i] only depends on dp[i-1] and dp[i-2], use two variables</li>
          <li><strong>Fibonacci family:</strong> Climbing Stairs, House Robber, Tile Tiling all reduce to this pattern</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Fibonacci DP</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VISUALIZER COMPONENTS
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Recursion Visualizer ───────────────────────────────────────────────── */
function FibRecursionVisualizer({ n, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `fib(${c.k})`,
    isBase: c.k <= 1,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Calling <strong>fib({step.k})</strong> at depth {step.depth}</>}
        {step.type === 'return' && <>↩ fib({step.k}) returned <strong>{step.value}</strong></>}
      </div>

      {/* Recursion Tree + Call Stack Side by Side */}
      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.id}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">fib({c.k})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Memoization Visualizer ─────────────────────────────────────────────── */
function FibMemoVisualizer({ n, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const safeN = Math.min(n, 15)
  const memo  = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>fib({step.k})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored <strong>fib({step.k}) = {step.value}</strong> in cache</>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>fib({step.k}) = {step.value}</strong> (skipped computation!)</>}
      </div>

      {/* Cache Status */}
      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cache entries: <strong>{Object.keys(memo).length}</strong> / {safeN + 1}</span>
        <span className="dp-saved">Current: <strong>fib({step.k})</strong></span>
      </div>

      {/* Memo table */}
      <div className="dp-memo-grid">
        {Array.from({ length: safeN + 1 }, (_, i) => (
          <div
            key={i}
            className={`dp-memo-cell ${i in memo ? 'filled' : ''} ${step.k === i ? 'active' : ''}`}
          >
            <span className="dp-memo-key">fib({i})</span>
            <span className="dp-memo-val">{i in memo ? memo[i] : '?'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Tabulation Visualizer ──────────────────────────────────────────────── */
function FibTableVisualizer({ n, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="dp-call-badge store">
        {step.i <= 1
          ? <>🔧 Base case: <strong>dp[{step.i}] = {dp[step.i]}</strong></>
          : <>➕ dp[{step.i}] = dp[{step.from1}] + dp[{step.from2}] = {dp[step.from1 ?? 0]} + {dp[step.from2 ?? 0]} = <strong>{dp[step.i]}</strong></>
        }
      </div>

      {/* DP Table */}
      <div className="dp-table-row">
        {dp.map((val, idx) => (
          <div
            key={idx}
            className={`dp-table-cell
              ${idx === step.i ? 'active' : ''}
              ${idx === step.from1 ? 'from1' : ''}
              ${idx === step.from2 ? 'from2' : ''}
              ${idx < step.i ? 'filled' : idx > step.i ? 'empty' : ''}
            `}
          >
            <span className="dp-cell-label">dp[{idx}]</span>
            <span className="dp-cell-val">{idx <= step.filled ? val : '?'}</span>
          </div>
        ))}
      </div>

      {step.i >= 2 && (
        <div className="dp-table-arrows">
          <span className="dp-arrow-from1">dp[{step.from1}] ──╮</span>
          <span className="dp-arrow-merge">          + = dp[{step.i}]</span>
          <span className="dp-arrow-from2">dp[{step.from2}] ──╯</span>
        </div>
      )}

      <div className="dp-table-progress">
        Filled: {step.filled + 1} / {dp.length} cells
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   0/1 KNAPSACK PATTERN
   ════════════════════════════════════════════════════════════════════════════ */
function Knapsack01Pattern() {
  const { user } = useContext(AuthContext)
  const [approach,  setApproach] = useState('recursion')
  const [codeLang,  setCodeLang] = useState('javascript')
  const [result,    setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Default example: 4 items
  const weights  = [1, 3, 4, 5]
  const values   = [1, 4, 5, 7]
  const capacity = 7

  /* ── Problem List ────────────────────────────────────────────────────── */
  const ksProblems = [
    {
      id: 'lc416',
      title: 'LC 416. Partition Equal Subset Sum',
      description: 'Can you partition an array into two subsets with equal sum? Classic 0/1 knapsack variant.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/partition-equal-subset-sum/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc494',
      title: 'LC 494. Target Sum',
      description: 'Assign + or − to each number so the expression equals target. Count ways.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/target-sum/description/',
      topics: ['Array', 'DP', 'Backtracking'],
    },
    {
      id: 'lc474',
      title: 'LC 474. Ones and Zeroes',
      description: 'Given strings of 0s/1s, maximize how many strings fit within m zeros and n ones budget.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/ones-and-zeroes/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc1049',
      title: 'LC 1049. Last Stone Weight II',
      description: 'Split stones into two groups minimizing the absolute difference of their sums.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/last-stone-weight-ii/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc2787',
      title: 'LC 2787. Ways to Express an Integer as Sum of Powers',
      description: 'Count ways to express n as sum of unique x^power values. 0/1 knapsack on power values.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/ways-to-express-an-integer-as-sum-of-powers/description/',
      topics: ['DP'],
    },
    {
      id: 'lc0ks',
      title: 'Classic 0/1 Knapsack',
      description: 'Given weights, values, and a capacity W, maximize total value without exceeding capacity.',
      difficulty: 'Medium',
      leetcodeLink: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-knapsack01', ksProblems, user?.uid)

  /* ── Recursion Algorithm (top-down brute force) ─────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const treeNodes = []
    let nodeId = 0
    const n = weights.length

    const solve = (i, w, parentId = null) => {
      const id = nodeId++
      const isBase = i < 0 || w === 0
      const label = `(${i},${w})`
      treeNodes.push({ id, parentId, label, isBase, returnValue: null, i, w })
      steps.push({ nodeId: id, i, w, isBase, callStack: treeNodes.map(c => ({ ...c })) })

      if (isBase) {
        treeNodes[id].returnValue = 0
        return 0
      }

      let val
      if (weights[i] > w) {
        // Can't pick item i
        val = solve(i - 1, w, id)
      } else {
        // Choice: skip or pick
        const skip = solve(i - 1, w, id)
        const pick = values[i] + solve(i - 1, w - weights[i], id)
        val = Math.max(skip, pick)
      }
      treeNodes[id].returnValue = val
      return val
    }

    const res = solve(n - 1, capacity)
    // Annotate steps with returnValue
    steps.forEach(s => { s.returnValue = treeNodes[s.nodeId]?.returnValue })
    return { result: res, steps, treeNodes }
  }

  /* ── Memoization Algorithm ──────────────────────────────────────────── */
  const computeMemoization = () => {
    const memo = {}
    const steps = []
    const n = weights.length

    const solve = (i, w) => {
      const key = `${i},${w}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', i, w, value: memo[key], memo: { ...memo } })
        return memo[key]
      }
      steps.push({ type: 'compute', i, w, memo: { ...memo } })
      if (i < 0 || w === 0) {
        memo[key] = 0
        steps.push({ type: 'store', i, w, value: 0, memo: { ...memo } })
        return 0
      }
      let val
      if (weights[i] > w) {
        val = solve(i - 1, w)
      } else {
        const skip = solve(i - 1, w)
        const pick = values[i] + solve(i - 1, w - weights[i])
        val = Math.max(skip, pick)
      }
      memo[key] = val
      steps.push({ type: 'store', i, w, value: val, memo: { ...memo } })
      return val
    }

    const res = solve(n - 1, capacity)
    return { result: res, steps, memo }
  }

  /* ── Tabulation Algorithm ──────────────────────────────────────────── */
  const computeTabulation = () => {
    const n = weights.length
    // dp[i][w] = max value using items 0..i-1 with capacity w
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))
    const steps = []

    // Record initial state
    steps.push({ item: 0, w: 0, dp: dp.map(r => [...r]), activeI: 0, activeW: 0, action: 'init' })

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const wt = weights[i - 1]
        const val = values[i - 1]
        if (wt > w) {
          dp[i][w] = dp[i - 1][w]
          steps.push({
            item: i, w, dp: dp.map(r => [...r]),
            activeI: i, activeW: w,
            action: 'skip',
            from: { i: i - 1, w },
            wt, val,
          })
        } else {
          const skip = dp[i - 1][w]
          const pick = val + dp[i - 1][w - wt]
          dp[i][w] = Math.max(skip, pick)
          steps.push({
            item: i, w, dp: dp.map(r => [...r]),
            activeI: i, activeW: w,
            action: dp[i][w] === pick ? 'pick' : 'skip',
            from: { i: i - 1, w },
            fromPick: { i: i - 1, w: w - wt },
            wt, val, skip, pick,
          })
        }
      }
    }

    return { result: dp[n][capacity], steps, dp }
  }

  /* ── Compute on approach change ─────────────────────────────────────── */
  useEffect(() => {
    let data
    if      (approach === 'recursion')   data = computeRecursion()
    else if (approach === 'memoization') data = computeMemoization()
    else                                  data = computeTabulation()
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [approach])

  const complexity = {
    recursion:   { time: 'O(2ⁿ)',    space: 'O(n) — call stack' },
    memoization: { time: 'O(n·W)',    space: 'O(n·W) — memo table' },
    tabulation:  { time: 'O(n·W)',    space: 'O(n·W) → O(W) optimised' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use 0/1 Knapsack</h2>
          <ul>
            <li>Each item can be <strong>included at most once</strong> (0 or 1)</li>
            <li>Choices have a weight/cost and a value/profit</li>
            <li>You must maximise value within a capacity budget</li>
            <li>Keywords: <em>subset sum, partition, target sum, equal sum</em></li>
          </ul>
          <p className="dp-example-use">
            <strong>Recurrence:</strong>{' '}
            <code>dp[i][w] = max(dp[i-1][w],  val[i] + dp[i-1][w-wt[i]])</code>
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span>{v.time}</span>
                <span>{v.space.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <p className="dp-example-use" style={{ marginTop: '0.75rem' }}>
            <strong>Example input:</strong> weights=[1,3,4,5] values=[1,4,5,7] capacity=7 → <strong>max={result ?? '…'}</strong>
          </p>
        </div>
      </div>

      {/* Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — 0/1 Knapsack</h2>
        <div className="dp-ks-legend">
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>weights: [{weights.join(', ')}]</span>
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>values:  [{values.join(', ')}]</span>
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>capacity: {capacity}</span>
          {result !== null && (
            <div className="dp-result-badge">
              <span>max value</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
        </div>

        <DPApproachTabs activeApproach={approach} onChange={setApproach} />

        <VisualizerWrapper title={`0/1 Knapsack — ${approach.charAt(0).toUpperCase() + approach.slice(1)}`}>
          {approach === 'recursion'   && <KsRecursionVisualizer   visualization={visualization} weights={weights} values={values} />}
          {approach === 'memoization' && <KsMemoVisualizer         visualization={visualization} weights={weights} values={values} capacity={capacity} />}
          {approach === 'tabulation'  && <KsTableVisualizer        visualization={visualization} weights={weights} values={values} capacity={capacity} />}
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
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {/* ── Recursion ── */}
        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Brute force — O(2^n) — tries every subset
function knapsack(weights, values, capacity, i = weights.length - 1) {
  // Base case: no items left or no capacity
  if (i < 0 || capacity === 0) return 0;

  // Item too heavy — must skip
  if (weights[i] > capacity) {
    return knapsack(weights, values, capacity, i - 1);
  }

  // Choice: skip item i  OR  pick item i
  const skip = knapsack(weights, values, capacity, i - 1);
  const pick = values[i] + knapsack(weights, values, capacity - weights[i], i - 1);

  return Math.max(skip, pick);
}

const weights = [1, 3, 4, 5], values = [1, 4, 5, 7], W = 7;
console.log(knapsack(weights, values, W)); // 9`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Brute force — O(2^n) — tries every subset
def knapsack(weights, values, capacity, i=None):
    if i is None:
        i = len(weights) - 1

    # Base case: no items left or no capacity
    if i < 0 or capacity == 0:
        return 0

    # Item too heavy — must skip
    if weights[i] > capacity:
        return knapsack(weights, values, capacity, i - 1)

    # Choice: skip item i  OR  pick item i
    skip = knapsack(weights, values, capacity, i - 1)
    pick = values[i] + knapsack(weights, values, capacity - weights[i], i - 1)

    return max(skip, pick)

weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
print(knapsack(weights, values, 7))  # 9`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Brute force — O(2^n) — tries every subset
public class Knapsack {
    public static int knapsack(int[] weights, int[] values, int capacity, int i) {
        // Base case: no items left or no capacity
        if (i < 0 || capacity == 0) return 0;

        // Item too heavy — must skip
        if (weights[i] > capacity) {
            return knapsack(weights, values, capacity, i - 1);
        }

        // Choice: skip item i  OR  pick item i
        int skip = knapsack(weights, values, capacity, i - 1);
        int pick = values[i] + knapsack(weights, values, capacity - weights[i], i - 1);

        return Math.max(skip, pick);
    }

    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        System.out.println(knapsack(w, v, 7, w.length - 1)); // 9
    }
}`} />
        )}

        {/* ── Memoization ── */}
        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n·W) time & space
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const memo = {};

  function solve(i, w) {
    if (i < 0 || w === 0) return 0;

    const key = \`\${i},\${w}\`;
    if (key in memo) return memo[key]; // cache hit!

    // Must skip — too heavy
    if (weights[i] > w) {
      return memo[key] = solve(i - 1, w);
    }

    // Choose best of skip vs pick
    const skip = solve(i - 1, w);
    const pick = values[i] + solve(i - 1, w - weights[i]);
    return memo[key] = Math.max(skip, pick);
  }

  return solve(n - 1, capacity);
}

const weights = [1, 3, 4, 5], values = [1, 4, 5, 7];
console.log(knapsack(weights, values, 7)); // 9`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n·W) time & space
from functools import lru_cache

def knapsack(weights, values, capacity):
    n = len(weights)

    @lru_cache(maxsize=None)
    def solve(i, w):
        if i < 0 or w == 0:
            return 0
        if weights[i] > w:
            return solve(i - 1, w)
        skip = solve(i - 1, w)
        pick = values[i] + solve(i - 1, w - weights[i])
        return max(skip, pick)

    return solve(n - 1, capacity)

weights = (1, 3, 4, 5)   # tuples for lru_cache
values  = (1, 4, 5, 7)
print(knapsack(weights, values, 7))  # 9`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n·W) time & space
import java.util.HashMap;

public class Knapsack {
    private static HashMap<String, Integer> memo = new HashMap<>();

    public static int knapsack(int[] weights, int[] values, int capacity, int i) {
        if (i < 0 || capacity == 0) return 0;

        String key = i + "," + capacity;
        if (memo.containsKey(key)) return memo.get(key); // cache hit!

        if (weights[i] > capacity) {
            int res = knapsack(weights, values, capacity, i - 1);
            memo.put(key, res);
            return res;
        }

        int skip = knapsack(weights, values, capacity, i - 1);
        int pick = values[i] + knapsack(weights, values, capacity - weights[i], i - 1);
        int res  = Math.max(skip, pick);
        memo.put(key, res);
        return res;
    }

    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        System.out.println(knapsack(w, v, 7, w.length - 1)); // 9
    }
}`} />
        )}

        {/* ── Tabulation ── */}
        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n·W) time
// dp[i][w] = max value using first i items with capacity w
function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      // Option A: skip item i
      dp[i][w] = dp[i - 1][w];

      // Option B: pick item i (only if it fits)
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      }
    }
  }

  return dp[n][W]; // answer
}

// Space-optimised O(W) — use a single 1D array, fill right-to-left
function knapsack1D(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) { // ← right-to-left!
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  return dp[W];
}

const weights = [1, 3, 4, 5], values = [1, 4, 5, 7];
console.log(knapsack(weights, values, 7));   // 9
console.log(knapsack1D(weights, values, 7)); // 9`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n·W) time
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            # Option A: skip item i
            dp[i][w] = dp[i - 1][w]
            # Option B: pick item i (only if it fits)
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])

    return dp[n][W]

# Space-optimised O(W) — fill right-to-left
def knapsack_1d(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):  # ← right-to-left!
            dp[w] = max(dp[w], val + dp[w - wt])
    return dp[W]

weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
print(knapsack(weights, values, 7))    # 9
print(knapsack_1d(weights, values, 7)) # 9`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n·W) time
public class Knapsack {

    public static int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                // Option A: skip item i
                dp[i][w] = dp[i - 1][w];
                // Option B: pick item i (only if it fits)
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
                }
            }
        }
        return dp[n][W];
    }

    // Space-optimised O(W) — fill right-to-left
    public static int knapsack1D(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = W; w >= weights[i]; w--) { // ← right-to-left!
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        return dp[W];
    }

    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        System.out.println(knapsack(w, v, 7));   // 9
        System.out.println(knapsack1D(w, v, 7)); // 9
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Define State</strong>
              <p><code>dp[i][w]</code> = maximum value achievable using the first <code>i</code> items with a bag capacity of <code>w</code>.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Recurrence — Two Choices per Item</strong>
              <p>
                For each item <code>i</code> and weight <code>w</code>:<br />
                • <strong>Skip:</strong> <code>dp[i][w] = dp[i-1][w]</code><br />
                • <strong>Pick</strong> (if <code>wt[i] ≤ w</code>): <code>dp[i][w] = val[i] + dp[i-1][w - wt[i]]</code><br />
                Take the <code>max</code> of both.
              </p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Base Cases</strong>
              <p><code>dp[0][w] = 0</code> (no items) and <code>dp[i][0] = 0</code> (no capacity). The entire first row and column are zero.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Space Optimisation</strong>
              <p>Since row <code>i</code> only looks at row <code>i-1</code>, you can collapse to a 1D array. Fill it <strong>right-to-left</strong> to avoid using an item twice.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>0/1 = each item used at most once.</strong> Unbounded knapsack allows reuse.</li>
          <li><strong>Right-to-left fill</strong> in 1D DP prevents counting an item twice.</li>
          <li><strong>Subset Sum</strong> is a special case: values = weights, target = sum/2.</li>
          <li><strong>Partition Equal Subset Sum</strong>: can we fill capacity = totalSum/2? Boolean DP.</li>
          <li><strong>Target Sum (LC 494)</strong>: reduce to subset sum by math — count, not maximise.</li>
          <li><strong>Traceback:</strong> Walk table from dp[n][W] back up to find chosen items.</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — 0/1 Knapsack</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── 0/1 Knapsack Recursion Visualizer ───────────────────────────────────── */
function KsRecursionVisualizer({ visualization, weights, values }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `(${c.i},${c.w})`,
    isBase: c.isBase,
    returnValue: c.returnValue !== null && c.returnValue !== undefined ? c.returnValue : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      
      {/* Explanation */}
      <div className="dp-ks-axis-hint">
        📍 <strong>(item_index, remaining_capacity)</strong> — e.g., (2, 5) = item 2 with 5 units of capacity
      </div>

      {/* Current State Badge */}
      <div className="dp-call-badge call">
        {step.isBase
          ? <>
              🔚 <strong>BASE CASE</strong>: No items left or no capacity
              <br/><span style={{ fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>solve({step.i}, {step.w}) = <strong>0</strong></span>
            </>
          : <>
              📍 Evaluating <strong>item {step.i}</strong> with <strong>{step.w} capacity</strong> left
              <br/>
              <span style={{ fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                Item: weight=<strong>{weights[step.i]}</strong>, value=<strong>{values[step.i]}</strong>
              </span>
              {weights[step.i] > step.w
                ? <span style={{ fontSize: '0.85rem', color: 'var(--color-warning)', marginTop: '2px', display: 'block' }}>⚠️ TOO HEAVY — can only skip → solve({step.i + 1}, {step.w})</span>
                : <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', marginTop: '2px', display: 'block' }}>✅ Can SKIP → solve({step.i + 1}, {step.w})<br/>OR PICK → solve({step.i + 1}, {step.w - weights[step.i]})</span>
              }
            </>
        }
      </div>

      {/* Item Reference Table */}
      {!step.isBase && (
        <div className="dp-ks-items-table">
          <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-light)' }}>📦 Items to Consider:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
            {weights.map((w, idx) => (
              <div key={idx} className={`dp-ks-item-chip ${idx === step.i ? 'active' : ''}`}>
                <strong>i{idx}</strong>
                <br/>w={w} v={values[idx]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recursion Tree + Call Stack Side by Side */}
      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.nodeId}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.nodeId ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">({c.i},{c.w})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 0/1 Knapsack Memoization Visualizer ────────────────────────────────── */
function KsMemoVisualizer({ visualization, weights, values, capacity }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}
  const keys = Object.keys(memo)

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />
      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>
          🔄 Computing <strong>solve({step.i}, {step.w})</strong>…
          <br/><span style={{ fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>Item {step.i} (w={weights[step.i] ?? '–'}, v={values[step.i] ?? '–'}) with {step.w} capacity</span>
        </>}
        {step.type === 'store'     && <>💾 Stored <strong>solve({step.i}, {step.w}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>solve({step.i}, {step.w}) = {step.value}</strong> (skipped computation!)</>}
      </div>

      {/* Cache Status */}
      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cache entries: <strong>{keys.length}</strong></span>
        <span>Current: <strong>({step.i}, {step.w})</strong></span>
      </div>

      {/* Cache Grid */}
      <div className="dp-memo-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
        {keys.map(k => {
          const [ki, kw] = k.split(',').map(Number)
          const isActive = ki === step.i && kw === step.w
          return (
            <div key={k} className={`dp-memo-cell filled ${isActive ? 'active' : ''}`}>
              <span className="dp-memo-key">({ki},{kw})</span>
              <span className="dp-memo-val">{memo[k]}</span>
            </div>
          )
        })}
        {keys.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Cache empty — computing first call…</p>}
      </div>
    </div>
  )
}

/* ── 0/1 Knapsack Tabulation Visualizer ─────────────────────────────────── */
function KsTableVisualizer({ visualization, weights, values, capacity }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []
  const n = dp.length - 1        // number of items
  const W = dp[0]?.length - 1    // capacity

  const itemLabels = ['∅', ...weights.map((w, i) => `i${i + 1}(w=${w},v=${values[i]})`)]

  return (
    <div className="dp-viz-table" style={{ overflowX: 'auto' }}>
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.action === 'pick' ? 'store' : 'call'}`}>
        {step.action === 'init' && <>🔧 Initialising base cases (all zeros)</>}
        {step.action === 'skip' && <>⏭ Item {step.item} (w={weights[step.item - 1]}) too heavy or skipped → dp[{step.activeI}][{step.activeW}] = {dp[step.activeI]?.[step.activeW]}</>}
        {step.action === 'pick' && <>✅ Picked item {step.item} (v={values[step.item - 1]}) → dp[{step.activeI}][{step.activeW}] = {step.pick}</>}
      </div>

      {/* 2D DP Table */}
      <div className="dp-ks-table-wrap">
        {/* Column headers (capacities) */}
        <div className="dp-ks-table-row dp-ks-table-header">
          <div className="dp-ks-table-cell dp-ks-label">Item \ W</div>
          {Array.from({ length: W + 1 }, (_, w) => (
            <div key={w} className={`dp-ks-table-cell dp-ks-col-hdr ${w === step.activeW ? 'active-col' : ''}`}>{w}</div>
          ))}
        </div>

        {/* Rows */}
        {dp.map((row, i) => (
          <div key={i} className="dp-ks-table-row">
            <div className={`dp-ks-table-cell dp-ks-label ${i === step.activeI ? 'active-row' : ''}`}>
              {i === 0 ? '∅' : `i${i}`}
              {i > 0 && <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.7 }}>w={weights[i-1]} v={values[i-1]}</span>}
            </div>
            {row.map((val, w) => {
              const isActive = i === step.activeI && w === step.activeW
              const isFromSkip = step.from && i === step.from.i && w === step.from.w
              const isFromPick = step.fromPick && i === step.fromPick.i && w === step.fromPick.w
              return (
                <div
                  key={w}
                  className={`dp-ks-table-cell
                    ${isActive    ? 'active'  : ''}
                    ${isFromSkip  ? 'from1'   : ''}
                    ${isFromPick  ? 'from2'   : ''}
                    ${i < step.activeI || (i === step.activeI && w < step.activeW) ? 'filled' : ''}
                  `}
                >
                  {val}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length} &nbsp;·&nbsp; Answer: dp[{n}][{W}] = <strong>{dp[n]?.[W] ?? '…'}</strong>
      </div>
    </div>
  )
}
/* ════════════════════════════════════════════════════════════════════════════════
   UNBOUNDED KNAPSACK PATTERN
   ════════════════════════════════════════════════════════════════════════════════ */
function UnboundedKnapsackPattern() {
  const { user } = useContext(AuthContext)
  const [approach,  setApproach] = useState('recursion')
  const [codeLang,  setCodeLang] = useState('javascript')
  const [result,    setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)
  const weights  = [1, 3, 4, 5]
  const values   = [1, 4, 5, 7]
  const capacity = 7

  /* ── Problem List ────────────────────────────────────────────────────── */
  const ubProblems = [
    {
      id: 'lc322',
      title: 'LC 322. Coin Change',
      description: 'Minimum coins needed to make amount. Items can be reused infinitely.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/coin-change/description/',
      topics: ['Array', 'DP', 'BFS'],
    },
    {
      id: 'lc518',
      title: 'LC 518. Coin Change II',
      description: 'Count ways to make amount with given coins. Unbounded knapsack on combinations.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/coin-change-ii/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc377',
      title: 'LC 377. Combination Sum IV',
      description: 'Count combinations and permutations. Each number can be used unlimited times.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/combination-sum-iv/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc1046',
      title: 'LC 1046. Last Stone Weight',
      description: 'Unbounded selection with greedy/DP twist on knapsack.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/last-stone-weight/description/',
      topics: ['Array', 'Heap', 'DP'],
    },
    {
      id: 'lc139',
      title: 'LC 139. Word Break',
      description: 'Can you form string from dictionary? Unbounded knapsack on words.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/word-break/description/',
      topics: ['String', 'DP', 'Trie'],
    },
    {
      id: 'ubkc',
      title: 'Classic Unbounded Knapsack',
      description: 'Each item can be used unlimited times. Maximize value within capacity.',
      difficulty: 'Medium',
      leetcodeLink: 'https://www.geeksforgeeks.org/unbounded-knapsack-problem/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-unbounded', ubProblems, user?.uid)

  /* ── Recursion Algorithm (items can be reused) ──────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const treeNodes = []
    let nodeId = 0
    const n = weights.length

    const solve = (i, w, parentId = null) => {
      const id = nodeId++
      const isBase = i < 0 || w === 0
      const label = `(${i},${w})`
      treeNodes.push({ id, parentId, label, isBase, returnValue: null, i, w })
      steps.push({ nodeId: id, i, w, isBase, callStack: treeNodes.map(c => ({ ...c })) })

      if (isBase) {
        treeNodes[id].returnValue = 0
        return 0
      }

      let val
      if (weights[i] > w) {
        // Can't pick item i
        val = solve(i - 1, w, id)
      } else {
        // Choice: DON'T pick, or PICK and try same item again (reuse!)
        const skip = solve(i - 1, w, id)
        const pick = values[i] + solve(i, w - weights[i], id)  // KEY: solve(i, ...) not solve(i-1, ...) for reuse
        val = Math.max(skip, pick)
      }
      treeNodes[id].returnValue = val
      return val
    }

    const res = solve(n - 1, capacity)
    steps.forEach(s => { s.returnValue = treeNodes[s.nodeId]?.returnValue })
    return { result: res, steps, treeNodes }
  }

  /* ── Memoization Algorithm ──────────────────────────────────────────── */
  const computeMemoization = () => {
    const memo = {}
    const steps = []
    const n = weights.length

    const solve = (i, w) => {
      const key = `${i},${w}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', i, w, value: memo[key], memo: { ...memo } })
        return memo[key]
      }
      steps.push({ type: 'compute', i, w, memo: { ...memo } })
      if (i < 0 || w === 0) {
        memo[key] = 0
        steps.push({ type: 'store', i, w, value: 0, memo: { ...memo } })
        return 0
      }
      let val
      if (weights[i] > w) {
        val = solve(i - 1, w)
      } else {
        const skip = solve(i - 1, w)
        const pick = values[i] + solve(i, w - weights[i])  // Reuse: solve(i, ...)
        val = Math.max(skip, pick)
      }
      memo[key] = val
      steps.push({ type: 'store', i, w, value: val, memo: { ...memo } })
      return val
    }

    const res = solve(n - 1, capacity)
    return { result: res, steps, memo }
  }

  /* ── Tabulation Algorithm ──────────────────────────────────────────── */
  const computeTabulation = () => {
    const n = weights.length
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))
    const steps = []

    steps.push({ item: 0, w: 0, dp: dp.map(r => [...r]), activeI: 0, activeW: 0, action: 'init' })

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const wt = weights[i - 1]
        const val = values[i - 1]
        if (wt > w) {
          dp[i][w] = dp[i - 1][w]
          steps.push({
            item: i, w, dp: dp.map(r => [...r]),
            activeI: i, activeW: w,
            action: 'skip',
            from: { i: i - 1, w },
            wt, val,
          })
        } else {
          // KEY DIFFERENCE: check dp[i][w - wt] (same item reuse) vs dp[i-1][w-wt]
          const dontPick = dp[i - 1][w]
          const pick = val + dp[i][w - wt]  // dp[i] allows reuse!
          dp[i][w] = Math.max(dontPick, pick)
          steps.push({
            item: i, w, dp: dp.map(r => [...r]),
            activeI: i, activeW: w,
            action: dp[i][w] === pick ? 'pick' : 'skip',
            from: { i: i - 1, w },
            fromReuse: { i, w: w - wt },  // Reuse row
            wt, val, dontPick, pick,
          })
        }
      }
    }

    return { result: dp[n][capacity], steps, dp }
  }

  /* ── Compute on approach change ─────────────────────────────────────── */
  useEffect(() => {
    let data
    if      (approach === 'recursion')   data = computeRecursion()
    else if (approach === 'memoization') data = computeMemoization()
    else                                  data = computeTabulation()
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [approach])

  const complexity = {
    recursion:   { time: 'O(n·W)',    space: 'O(n·W) — call stack width' },
    memoization: { time: 'O(n·W)',    space: 'O(n·W) — memo table' },
    tabulation:  { time: 'O(n·W)',    space: 'O(n·W) → O(W) optimised' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Unbounded Knapsack</h2>
          <ul>
            <li>Each item can be <strong>used unlimited times</strong> (unbounded)</li>
            <li>Choices have weight and value, maximize value in capacity budget</li>
            <li>Keywords: <em>coin change, word break, unlimited items</em></li>
            <li><strong>vs. 0/1:</strong> Items can repeat; recursion picks same item again</li>
          </ul>
          <p className="dp-example-use">
            <strong>Recurrence:</strong>{' '}
            <code>dp[i][w] = max(dp[i-1][w],  val[i] + dp[i][w-wt[i]])</code>
            {' '}<em>(note: dp[i] allows reuse)</em>
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span>{v.time}</span>
                <span>{v.space.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <p className="dp-example-use" style={{ marginTop: '0.75rem' }}>
            <strong>Example input:</strong> weights=[1,3,4,5] values=[1,4,5,7] capacity=7 → <strong>max={result ?? '…'}</strong>
          </p>
        </div>
      </div>

      {/* Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Unbounded Knapsack</h2>
        <div className="dp-ks-legend">
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>weights: [{weights.join(', ')}]</span>
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>values:  [{values.join(', ')}]</span>
          <span className="dp-ks-item" style={{ background: 'var(--color-bg-darker)' }}>capacity: {capacity}</span>
          {result !== null && (
            <div className="dp-result-badge">
              <span>max value</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
        </div>

        <DPApproachTabs activeApproach={approach} onChange={setApproach} />

        <VisualizerWrapper title={`Unbounded Knapsack — ${approach.charAt(0).toUpperCase() + approach.slice(1)}`}>
          {approach === 'recursion'   && <UbRecursionVisualizer   visualization={visualization} weights={weights} values={values} />}
          {approach === 'memoization' && <UbMemoVisualizer         visualization={visualization} weights={weights} values={values} capacity={capacity} />}
          {approach === 'tabulation'  && <UbTableVisualizer        visualization={visualization} weights={weights} values={values} capacity={capacity} />}
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
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {/* Recursion Code */}
        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Unbounded Knapsack — Recursion
// KEY: Can reuse same item → solve(i, w - wt[i]) not solve(i+1, ...)
function knapsack(weights, values, capacity, i = 0) {
  // Base cases
  if (i === weights.length || capacity === 0) return 0;

  // Option 1: Skip item i
  const skip = knapsack(weights, values, capacity, i + 1);

  // Option 2: Pick item i (and TRY AGAIN on same item!)
  let pick = 0;
  if (weights[i] <= capacity) {
    pick = values[i] + knapsack(weights, values, capacity - weights[i], i); // i not i+1
  }

  return Math.max(skip, pick);
}

console.log(knapsack([1,3,4,5], [1,4,5,7], 7)); // 12 (items 0+0+2 or others)`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Unbounded Knapsack — Recursion
# KEY: Can reuse same item → solve(i, w - wt[i]) not solve(i+1, ...)
def knapsack(weights, values, capacity, i=0):
    # Base cases
    if i == len(weights) or capacity == 0:
        return 0

    # Option 1: Skip item i
    skip = knapsack(weights, values, capacity, i + 1)

    # Option 2: Pick item i (and TRY AGAIN on same item!)
    pick = 0
    if weights[i] <= capacity:
        pick = values[i] + knapsack(weights, values, capacity - weights[i], i)  # i not i+1

    return max(skip, pick)

print(knapsack([1,3,4,5], [1,4,5,7], 7))  # 12`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Unbounded Knapsack — Recursion
// KEY: Can reuse same item → solve(i, w - wt[i]) not solve(i+1, ...)
public class UnboundedKnapsack {
    public static int knapsack(int[] weights, int[] values, int capacity, int i) {
        // Base cases
        if (i == weights.length || capacity == 0) return 0;

        // Option 1: Skip item i
        int skip = knapsack(weights, values, capacity, i + 1);

        // Option 2: Pick item i (and TRY AGAIN on same item!)
        int pick = 0;
        if (weights[i] <= capacity) {
            pick = values[i] + knapsack(weights, values, capacity - weights[i], i); // i not i+1
        }

        return Math.max(skip, pick);
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[]{1,3,4,5}, new int[]{1,4,5,7}, 7, 0)); // 12
    }
}`} />
        )}

        {/* Memoization Code */}
        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n·W)
function knapsack(weights, values, capacity, memo = {}) {
  const n = weights.length;

  const solve = (i, w) => {
    const key = \`\${i},\${w}\`;
    if (key in memo) return memo[key];
    if (i === n || w === 0) return 0;

    const skip = solve(i + 1, w);
    let pick = 0;
    if (weights[i] <= w) {
      pick = values[i] + solve(i, w - weights[i]); // Reuse: solve(i, ...)
    }

    memo[key] = Math.max(skip, pick);
    return memo[key];
  };

  return solve(0, capacity);
}

console.log(knapsack([1,3,4,5], [1,4,5,7], 7)); // 12`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n·W)
def knapsack(weights, values, capacity):
    n = len(weights)
    memo = {}

    def solve(i, w):
        if (i, w) in memo:
            return memo[(i, w)]
        if i == n or w == 0:
            return 0

        skip = solve(i + 1, w)
        pick = 0
        if weights[i] <= w:
            pick = values[i] + solve(i, w - weights[i])  # Reuse!

        memo[(i, w)] = max(skip, pick)
        return memo[(i, w)]

    return solve(0, capacity)

print(knapsack([1,3,4,5], [1,4,5,7], 7))  # 12`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n·W)
import java.util.HashMap;
import java.util.Map;

public class UnboundedKnapsack {
    static Map<String, Integer> memo = new HashMap<>();

    public static int solve(int[] weights, int[] values, int w, int i) {
        if (i == weights.length || w == 0) return 0;
        
        String key = i + "," + w;
        if (memo.containsKey(key)) return memo.get(key);

        int skip = solve(weights, values, w, i + 1);
        int pick = 0;
        if (weights[i] <= w) {
            pick = values[i] + solve(weights, values, w - weights[i], i); // Reuse!
        }

        int result = Math.max(skip, pick);
        memo.put(key, result);
        return result;
    }

    public static void main(String[] args) {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        System.out.println(solve(weights, values, 7, 0)); // 12
    }
}`} />
        )}

        {/* Tabulation Code */}
        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n·W)
// KEY: Fill left-to-right on SAME ITEM row to allow reuse
function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      const wt = weights[i - 1], val = values[i - 1];
      
      // Don't pick
      dp[i][w] = dp[i - 1][w];
      
      // Pick (and reuse same item)
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i][w], val + dp[i][w - wt]);
      }
    }
  }

  return dp[n][W];
}

// Space optimization: 1D array
function knapsack1D(weights, values, W) {
  const dp = new Array(W + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    for (let w = weights[i]; w <= W; w++) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }

  return dp[W];
}

console.log(knapsack([1,3,4,5], [1,4,5,7], 7));   // 12
console.log(knapsack1D([1,3,4,5], [1,4,5,7], 7)); // 12`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n·W)
# KEY: Fill left-to-right on SAME ITEM row to allow reuse
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, W + 1):
            wt, val = weights[i - 1], values[i - 1]

            # Don't pick
            dp[i][w] = dp[i - 1][w]

            # Pick (and reuse same item)
            if wt <= w:
                dp[i][w] = max(dp[i][w], val + dp[i][w - wt])

    return dp[n][W]

# Space optimization: 1D array
def knapsack_1d(weights, values, W):
    dp = [0] * (W + 1)

    for i in range(len(weights)):
        for w in range(weights[i], W + 1):
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])

    return dp[W]

print(knapsack([1,3,4,5], [1,4,5,7], 7))     # 12
print(knapsack_1d([1,3,4,5], [1,4,5,7], 7)) # 12`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n·W)
// KEY: Fill left-to-right on SAME ITEM row to allow reuse
public class UnboundedKnapsack {

    public static int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                int wt = weights[i - 1], val = values[i - 1];

                // Don't pick
                dp[i][w] = dp[i - 1][w];

                // Pick (and reuse same item)
                if (wt <= w) {
                    dp[i][w] = Math.max(dp[i][w], val + dp[i][w - wt]);
                }
            }
        }

        return dp[n][W];
    }

    public static int knapsack1D(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];

        for (int i = 0; i < weights.length; i++) {
            for (int w = weights[i]; w <= W; w++) {
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }

        return dp[W];
    }

    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        System.out.println(knapsack(w, v, 7));   // 12
        System.out.println(knapsack1D(w, v, 7)); // 12
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Recognize Item Reuse</strong>
              <p>Unlike 0/1 Knapsack, each item CAN be picked multiple times. Choose item i, then immediately reconsider item i again (not move to i+1).</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Recurrence with Reuse</strong>
              <p><code>dp[i][w] = max(dp[i-1][w], val[i] + dp[i][w-wt[i]])</code><br/>Notice: <code>dp[i]</code> on the right (allows reuse) vs. <code>dp[i-1]</code> (blocks reuse)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Memoize or Tabulate</strong>
              <p>Same approach as 0/1, but memoization recursion uses solve(i, w) not solve(i+1, w) when picking.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Tabulation: Left-to-Right Fill</strong>
              <p>When filling row i, iterate w left-to-right (not right-to-left). This allows <code>dp[i][w - wt]</code> to reference the updated reuse values.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>vs. 0/1 Knapsack:</strong> Change solve(i+1, ...) to solve(i, ...) when picking</li>
          <li><strong>Tabulation fill order:</strong> Left-to-right (unbounded) vs. right-to-left (0/1)</li>
          <li><strong>Coin Change family:</strong> Classic unbounded knapsack problems (min coins, ways to make amount)</li>
          <li><strong>1D optimization:</strong> Unbounded naturally supports O(W) space since rows can be merged</li>
          <li><strong>Practical tip:</strong> If items have unlimited supply and you want to maximize value/minimize cost, think unbounded knapsack</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Unbounded Knapsack</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────────── */
/* UNBOUNDED KNAPSACK VISUALIZERS */
/* ────────────────────────────────────────────────────────────────────────────── */

function UbRecursionVisualizer({ visualization, weights, values }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `(${c.i},${c.w})`,
    isBase: c.isBase,
    returnValue: c.resolved ? c.value : undefined,
    i: c.i,
    w: c.w,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.isBase ? 'return' : 'call'}`}>
        {!step.isBase   && <>📞 Considering item <strong>{step.i}</strong> with capacity <strong>{step.w}</strong></>}
        {step.isBase    && <>↩ Base case: <strong>{step.returnValue}</strong></>}
      </div>

      {step.i !== undefined && step.i < weights.length && (
        <div className="dp-ks-items-table">
          <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-light)' }}>📦 Items:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
            {weights.map((w, idx) => (
              <div key={idx} className={`dp-ks-item-chip ${idx === step.i ? 'active' : ''}`}>
                <strong>i{idx}</strong>
                <br/>w={w} v={values[idx]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recursion Tree + Call Stack Side by Side */}
      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.nodeId}
          />
        </div>

        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.nodeId ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">({c.i},{c.w})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UbMemoVisualizer({ visualization, weights, values, capacity }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>({step.i},{step.w})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored <strong>({step.i},{step.w}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>({step.i},{step.w}) = {step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cache entries: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>({step.i},{step.w})</strong></span>
      </div>

      {/* Memo grid by i */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        {Array.from({ length: weights.length }, (_, i) => (
          <div key={i} style={{ border: '1px solid var(--color-bg-darker)', borderRadius: '6px', padding: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '8px' }}>Item {i}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(35px, 1fr))', gap: '4px' }}>
              {Array.from({ length: capacity + 1 }, (_, w) => {
                const key = `${i},${w}`
                const val = memo[key]
                const isActive = step.i === i && step.w === w
                return (
                  <div
                    key={w}
                    style={{
                      padding: '4px 6px',
                      background: isActive ? 'var(--color-primary)' : (key in memo ? 'rgba(176, 228, 204, 0.1)' : 'var(--color-bg-darker)'),
                      border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-bg-darker)',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      textAlign: 'center',
                      color: isActive ? 'white' : 'var(--color-text-light)',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'default',
                    }}
                  >
                    {key in memo ? val : '?'}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UbTableVisualizer({ visualization, weights, values, capacity }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []
  const n = weights.length
  const W = capacity

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.action === 'pick' ? 'pick' : 'skip'}`}>
        {step.action === 'init'
          ? <>🔧 Initializing DP table (n+1) × (W+1)</>
          : step.action === 'skip'
          ? <>⏭ Skip item {step.item - 1}: dp[{step.item}][{step.w}] = dp[{step.item - 1}][{step.w}] = {dp[step.item]?.[step.w] ?? '?'}</>
          : <>✅ Pick item {step.item - 1} (reuse!): dp[{step.item}][{step.w}] = {step.val} + dp[{step.item}][{step.w - step.wt}] = <strong>{dp[step.item]?.[step.w] ?? '?'}</strong></>
        }
      </div>

      {/* DP Table Grid */}
      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.75rem', width: '100%' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-darker)' }}>
              <th style={{ border: '1px solid var(--color-bg-darker)', padding: '6px', textAlign: 'center', fontWeight: '700' }}>i\\w</th>
              {Array.from({ length: Math.min(W + 1, 16) }, (_, w) => (
                <th key={w} style={{ border: '1px solid var(--color-bg-darker)', padding: '6px', textAlign: 'center', fontWeight: '700', color: 'var(--color-accent)' }}>
                  {w}
                </th>
              ))}
              {W > 15 && <th style={{ border: '1px solid var(--color-bg-darker)', padding: '6px', textAlign: 'center' }}>…</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(n + 1, 6) }, (_, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid var(--color-bg-darker)', padding: '6px', background: 'var(--color-bg-darker)', fontWeight: '700', textAlign: 'center', color: 'var(--color-accent)' }}>
                  {i}
                </td>
                {Array.from({ length: Math.min(W + 1, 16) }, (_, w) => {
                  const isActive = step.activeI === i && step.activeW === w
                  const isFrom = step.from && step.from.i === i && step.from.w === w
                  const isFromReuse = step.fromReuse && step.fromReuse.i === i && step.fromReuse.w === w
                  return (
                    <td
                      key={w}
                      style={{
                        border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-bg-darker)',
                        padding: '6px',
                        textAlign: 'center',
                        background: isActive ? 'var(--color-primary)' : (isFrom ? 'rgba(100, 200, 100, 0.2)' : (isFromReuse ? 'rgba(255, 165, 0, 0.2)' : 'transparent')),
                        color: isActive ? 'white' : 'var(--color-text)',
                        fontWeight: isActive ? '700' : '500',
                      }}
                    >
                      {dp[i]?.[w] ?? '?'}
                    </td>
                  )
                })}
                {W > 15 && <td style={{ border: '1px solid var(--color-bg-darker)', padding: '6px', textAlign: 'center' }}>…</td>}
              </tr>
            ))}
            {n > 5 && (
              <tr>
                <td colSpan={Math.min(W + 2, 17)} style={{ textAlign: 'center', padding: '6px', color: 'var(--color-text-light)' }}>…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length} &nbsp;·&nbsp; Answer: dp[{n}][{W}] = <strong>{dp[n]?.[W] ?? '…'}</strong>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════════
   LONGEST INCREASING SUBSEQUENCE (LIS) PATTERN
   ════════════════════════════════════════════════════════════════════════════════ */
function LISPattern() {
  const { user } = useContext(AuthContext)
  const [approach,  setApproach] = useState('tabulation')  // Default to tabulation for LIS
  const [codeLang,  setCodeLang] = useState('javascript')
  const [result,    setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Default example array
  const arr = [10, 9, 2, 5, 3, 7, 101, 18]
  // Expected LIS length: 4 (e.g., [2, 3, 7, 101] or [2, 3, 7, 18])

  /* ── Problem List ────────────────────────────────────────────────────── */
  const lisProblems = [
    {
      id: 'lc300',
      title: 'LC 300. Longest Increasing Subsequence',
      description: 'Find the length of the longest strictly increasing subsequence. O(n²) or O(n log n).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-increasing-subsequence/description/',
      topics: ['Array', 'DP', 'Binary Search'],
    },
    {
      id: 'lc1626',
      title: 'LC 1626. Best Team With No Conflicts',
      description: 'Select team members with increasing age/skills — variant of LIS on 2D.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/best-team-with-no-conflicts/description/',
      topics: ['Array', 'DP', 'Sorting'],
    },
    {
      id: 'lc354',
      title: 'LC 354. Russian Doll Envelopes',
      description: '2D LIS: maximize nested envelopes using LIS on sorted width + LIS on height.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/russian-doll-envelopes/description/',
      topics: ['Array', 'DP', 'Binary Search'],
    },
    {
      id: 'lc673',
      title: 'LC 673. Number of Longest Increasing Subsequence',
      description: 'Count how many LIS of max length exist.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc1048',
      title: 'LC 1048. Longest String Chain',
      description: 'Chain strings by adding one letter at a time — LIS on strings.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-string-chain/description/',
      topics: ['Array', 'DP', 'Sorting'],
    },
    {
      id: 'lis-classic',
      title: 'Classic LIS',
      description: 'Find length of longest strictly increasing subsequence. Classic DP problem.',
      difficulty: 'Medium',
      leetcodeLink: 'https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-lis', lisProblems, user?.uid)

  /* ── Recursion Algorithm ──────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const treeNodes = []
    let nodeId = 0

    const solve = (idx, prevVal, parentId = null) => {
      const id = nodeId++
      const label = `(${idx},${prevVal===null?'_':prevVal})`
      const isBase = idx < 0
      treeNodes.push({ id, parentId, label, isBase, returnValue: null, idx, prevVal })
      steps.push({ nodeId: id, idx, prevVal, isBase, callStack: treeNodes.map(c => ({ ...c })) })

      if (isBase) {
        treeNodes[id].returnValue = 0
        return 0
      }

      let result
      // Option 1: Don't take current
      let notTake = solve(idx - 1, prevVal, id)

      // Option 2: Take current (if valid)
      let take = 0
      if (prevVal === null || arr[idx] > prevVal) {
        take = 1 + solve(idx - 1, arr[idx], id)
      }

      result = Math.max(notTake, take)
      treeNodes[id].returnValue = result
      return result
    }

    const res = solve(arr.length - 1, null)
    steps.forEach(s => { s.returnValue = treeNodes[s.nodeId]?.returnValue })
    return { result: res, steps, treeNodes }
  }

  /* ── Memoization Algorithm ──────────────────────────────────────────── */
  const computeMemoization = () => {
    const memo = {}
    const steps = []

    const solve = (idx, prevVal) => {
      const key = `${idx},${prevVal===null?-1:prevVal}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', idx, prevVal, value: memo[key], memo: { ...memo } })
        return memo[key]
      }
      steps.push({ type: 'compute', idx, prevVal, memo: { ...memo } })
      if (idx < 0) {
        memo[key] = 0
        steps.push({ type: 'store', idx, prevVal, value: 0, memo: { ...memo } })
        return 0
      }

      let notTake = solve(idx - 1, prevVal)
      let take = 0
      if (prevVal === null || arr[idx] > prevVal) {
        take = 1 + solve(idx - 1, arr[idx])
      }
      const result = Math.max(notTake, take)

      memo[key] = result
      steps.push({ type: 'store', idx, prevVal, value: result, memo: { ...memo } })
      return result
    }

    const res = solve(arr.length - 1, null)
    return { result: res, steps, memo }
  }

  /* ── Tabulation Algorithm (standard O(n²) approach) ─────────────────── */
  const computeTabulation = () => {
    const n = arr.length
    const dp = new Array(n).fill(1)  // Each element is an LIS of length 1
    const steps = []

    steps.push({ i: 0, dp: [...dp], activeI: 0, action: 'init' })

    for (let i = 1; i < n; i++) {
      let maxLen = 1
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i]) {
          maxLen = Math.max(maxLen, dp[j] + 1)
        }
      }
      dp[i] = maxLen
      steps.push({
        i,
        dp: [...dp],
        activeI: i,
        action: 'update',
        comparisons: Array.from({ length: i }, (_, j) => ({
          j,
          isCandidate: arr[j] < arr[i],
          val: arr[j],
          dpi: dp[j],
        })),
        maxLen,
      })
    }

    return { result: Math.max(...dp), steps, dp }
  }

  /* ── Compute on approach change ─────────────────────────────────────── */
  useEffect(() => {
    let data
    if      (approach === 'recursion')   data = computeRecursion()
    else if (approach === 'memoization') data = computeMemoization()
    else                                  data = computeTabulation()
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [approach])

  const complexity = {
    recursion:   { time: 'O(2ⁿ)',    space: 'O(n) — call stack' },
    memoization: { time: 'O(n²)',      space: 'O(n²) — memo table' },
    tabulation:  { time: 'O(n²)',      space: 'O(n) → O(1) optimal' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use LIS</h2>
          <ul>
            <li>Find the <strong>longest subsequence</strong> where elements are <strong>strictly increasing</strong></li>
            <li>Subsequence: elements don't need to be contiguous</li>
            <li>Keywords: <em>increase, longest chain, build sequence</em></li>
            <li><strong>Approaches:</strong> O(n²) DP, O(n log n) binary search</li>
          </ul>
          <p className="dp-example-use">
            <strong>Recurrence:</strong>{' '}
            <code>dp[i] = max(dp[j] + 1) for all j &lt; i where arr[j] &lt; arr[i]</code>
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span>{v.time}</span>
                <span>{v.space.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <p className="dp-example-use" style={{ marginTop: '0.75rem' }}>
            <strong>Example:</strong> arr={JSON.stringify(arr)} → <strong>LIS length={result ?? '…'}</strong>
            {result && <br/>}
            {result && <small>Example: [2, 3, 7, 101] or [2, 3, 7, 18]</small>}
          </p>
        </div>
      </div>

      {/* Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Longest Increasing Subsequence</h2>
        <div className="dp-lis-legend">
          <span className="dp-lis-item">Array: [{arr.join(', ')}]</span>
          {result !== null && (
            <div className="dp-result-badge">
              <span>LIS length</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
        </div>

        <DPApproachTabs activeApproach={approach} onChange={setApproach} />

        <VisualizerWrapper title={`LIS — ${approach.charAt(0).toUpperCase() + approach.slice(1)}`}>
          {approach === 'recursion'   && <LisRecursionVisualizer   visualization={visualization} arr={arr} />}
          {approach === 'memoization' && <LisMemoVisualizer         visualization={visualization} arr={arr} />}
          {approach === 'tabulation'  && <LisTableVisualizer        visualization={visualization} arr={arr} />}
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
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {/* Recursion Code */}
        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Exponential — O(2ⁿ) Recursion
// Try including/excluding each element, track previous value
function lis(arr, idx = 0, prevVal = null) {
  // Base: reached end
  if (idx === arr.length) return 0;

  // Option 1: Don't take current element
  const notTake = lis(arr, idx + 1, prevVal);

  // Option 2: Take current element (if valid: > prevVal)
  let take = 0;
  if (prevVal === null || arr[idx] > prevVal) {
    take = 1 + lis(arr, idx + 1, arr[idx]);
  }

  return Math.max(notTake, take);
}

console.log(lis([10, 9, 2, 5, 3, 7, 101, 18])); // 4`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Exponential — O(2ⁿ) Recursion
# Try including/excluding each element, track previous value
def lis(arr, idx=0, prev_val=None):
    # Base: reached end
    if idx == len(arr):
        return 0

    # Option 1: Don't take current element
    not_take = lis(arr, idx + 1, prev_val)

    # Option 2: Take current element (if valid: > prev_val)
    take = 0
    if prev_val is None or arr[idx] > prev_val:
        take = 1 + lis(arr, idx + 1, arr[idx])

    return max(not_take, take)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))  # 4`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Exponential — O(2ⁿ) Recursion
public class LIS {
    public static int lis(int[] arr, int idx, Integer prevVal) {
        // Base: reached end
        if (idx == arr.length) return 0;

        // Option 1: Don't take current element
        int notTake = lis(arr, idx + 1, prevVal);

        // Option 2: Take current element (if valid: > prevVal)
        int take = 0;
        if (prevVal == null || arr[idx] > prevVal) {
            take = 1 + lis(arr, idx + 1, arr[idx]);
        }

        return Math.max(notTake, take);
    }

    public static void main(String[] args) {
        System.out.println(lis(new int[]{10, 9, 2, 5, 3, 7, 101, 18}, 0, null)); // 4
    }
}`} />
        )}

        {/* Memoization Code */}
        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n²)
function lis(arr) {
  const memo = {};

  function solve(idx, prevIdx = -1) {
    const key = \`\${idx},\${prevIdx}\`;
    if (key in memo) return memo[key];
    if (idx === arr.length) return 0;

    // Option 1: Don't take current
    const notTake = solve(idx + 1, prevIdx);

    // Option 2: Take current (if valid)
    let take = 0;
    if (prevIdx === -1 || arr[idx] > arr[prevIdx]) {
      take = 1 + solve(idx + 1, idx);
    }

    memo[key] = Math.max(notTake, take);
    return memo[key];
  }

  return solve(0);
}

console.log(lis([10, 9, 2, 5, 3, 7, 101, 18])); // 4`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n²)
def lis(arr):
    memo = {}

    def solve(idx, prev_idx=-1):
        key = (idx, prev_idx)
        if key in memo:
            return memo[key]
        if idx == len(arr):
            return 0

        # Option 1: Don't take current
        not_take = solve(idx + 1, prev_idx)

        # Option 2: Take current (if valid)
        take = 0
        if prev_idx == -1 or arr[idx] > arr[prev_idx]:
            take = 1 + solve(idx + 1, idx)

        memo[key] = max(not_take, take)
        return memo[key]

    return solve(0)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))  # 4`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n²)
import java.util.HashMap;
import java.util.Map;

public class LIS {
    static Map<String, Integer> memo = new HashMap<>();
    static int[] arr;

    public static int solve(int idx, int prevIdx) {
        String key = idx + "," + prevIdx;
        if (memo.containsKey(key)) return memo.get(key);
        if (idx == arr.length) return 0;

        // Option 1: Don't take current
        int notTake = solve(idx + 1, prevIdx);

        // Option 2: Take current (if valid)
        int take = 0;
        if (prevIdx == -1 || arr[idx] > arr[prevIdx]) {
            take = 1 + solve(idx + 1, idx);
        }

        int result = Math.max(notTake, take);
        memo.put(key, result);
        return result;
    }

    public static void main(String[] args) {
        arr = new int[]{10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println(solve(0, -1)); // 4
    }
}`} />
        )}

        {/* Tabulation Code */}
        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n²)
function lis(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1); // Each element is LIS of length ≥ 1

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

// ✅ Binary Search (Patience Sorting) — O(n log n)
function lisBinarySearch(arr) {
  const lis = [];

  for (const num of arr) {
    let left = 0, right = lis.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (lis[mid] < num) left = mid + 1;
      else right = mid;
    }
    lis[left] = num;
  }

  return lis.length;
}

console.log(lis([10, 9, 2, 5, 3, 7, 101, 18]));           // 4
console.log(lisBinarySearch([10, 9, 2, 5, 3, 7, 101, 18])); // 4`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n²)
def lis(arr):
    n = len(arr)
    dp = [1] * n  # Each element is LIS of length ≥ 1

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)

# ✅ Binary Search (Patience Sorting) — O(n log n)
def lis_binary_search(arr):
    import bisect
    lis = []

    for num in arr:
        pos = bisect.bisect_left(lis, num)
        if pos == len(lis):
            lis.append(num)
        else:
            lis[pos] = num

    return len(lis)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))           # 4
print(lis_binary_search([10, 9, 2, 5, 3, 7, 101, 18])) # 4`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n²)
public class LIS {
    public static int lis(int[] arr) {
        int n = arr.length;
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) dp[i] = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
        }

        int max = 0;
        for (int x : dp) max = Math.max(max, x);
        return max;
    }

    // ✅ Binary Search (Patience Sorting) — O(n log n)
    public static int lisBinarySearch(int[] arr) {
        List<Integer> lis = new ArrayList<>();

        for (int num : arr) {
            int pos = Collections.binarySearch(lis, num);
            if (pos < 0) pos = -(pos + 1);
            if (pos == lis.size()) lis.add(num);
            else lis.set(pos, num);
        }

        return lis.size();
    }

    public static void main(String[] args) {
        int[] arr = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println(lis(arr));             // 4
        System.out.println(lisBinarySearch(arr)); // 4
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Define State</strong>
              <p><code>dp[i]</code> = length of longest increasing subsequence <strong>ending at index i</strong></p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Recurrence Relation</strong>
              <p>For each i, check all j &lt; i where arr[j] &lt; arr[i]. Then <code>dp[i] = max(dp[j]) + 1</code></p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Bottom-Up Fill</strong>
              <p>Fill dp[] from left to right. For each position, look back at all smaller values and take the best previous LIS length + 1</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Answer</strong>
              <p>Return <code>max(dp)</code> — the longest LIS among all ending positions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>O(n²) DP:</strong> Simple nested loop, compare all pairs (i, j)</li>
          <li><strong>O(n log n) Binary Search:</strong> Maintain array of smallest tails for each length using patience sorting</li>
          <li><strong>Reconstruct LIS:</strong> Track parent pointers or previous indices while building dp[]</li>
          <li><strong>Variants:</strong> Non-decreasing (≤), weighted LIS, 2D LIS (envelopes, buildings)</li>
          <li><strong>Subsequence vs Subarray:</strong> Subsequence ≠ contiguous; can skip elements</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — LIS</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────────── */
/* LCS PATTERN                                                                    */
/* ────────────────────────────────────────────────────────────────────────────── */

function LCSPattern() {
  const { user } = useContext(AuthContext)
  const [approach,  setApproach] = useState('tabulation')
  const [codeLang,  setCodeLang] = useState('javascript')
  const [result,    setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  const text1 = 'ABCDE'
  const text2 = 'ACDFE'
  // LCS = "ACDE" or "ACFE" → length 4

  const lcsProblems = [
    {
      id: 'lc1143',
      title: 'LC 1143. Longest Common Subsequence',
      description: 'Classic LCS — find the longest subsequence present in both strings.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-common-subsequence/description/',
      topics: ['String', 'DP'],
    },
    {
      id: 'lc583',
      title: 'LC 583. Delete Operation for Two Strings',
      description: 'Minimum deletions to make two strings equal. Reduces to: n + m - 2 * LCS.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/delete-operation-for-two-strings/description/',
      topics: ['String', 'DP'],
    },
    {
      id: 'lc72',
      title: 'LC 72. Edit Distance',
      description: 'Minimum insert/delete/replace operations to convert one string to another.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/edit-distance/description/',
      topics: ['String', 'DP'],
    },
    {
      id: 'lc516',
      title: 'LC 516. Longest Palindromic Subsequence',
      description: 'LPS of s = LCS(s, reverse(s)). Classic LCS application.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-palindromic-subsequence/description/',
      topics: ['String', 'DP'],
    },
    {
      id: 'lc1092',
      title: 'LC 1092. Shortest Common Supersequence',
      description: 'Shortest string that has both strings as subsequences. Uses LCS.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/shortest-common-supersequence/description/',
      topics: ['String', 'DP'],
    },
    {
      id: 'lc1035',
      title: 'LC 1035. Uncrossed Lines',
      description: 'Maximum lines connecting equal elements — identical recurrence to LCS.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/uncrossed-lines/description/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-lcs', lcsProblems, user?.uid)

  /* ── Recursion Algorithm ─────────────────────────────────────────────── */
  const computeRecursion = () => {
    // Use shorter strings to keep the recursion tree manageable
    const t1 = text1.slice(0, 4)
    const t2 = text2.slice(0, 4)
    const steps = []
    const treeNodes = []
    let nodeId = 0

    const solve = (i, j, parentId = null) => {
      const id = nodeId++
      const isBase = i < 0 || j < 0
      const isMatch = !isBase && t1[i] === t2[j]
      const label = isBase ? `(∅,∅)` : `(${i},${j})`
      treeNodes.push({ id, parentId, label, isBase, match: isMatch, returnValue: null, i, j })
      steps.push({ nodeId: id, i, j, isBase, match: isMatch })

      if (isBase) {
        treeNodes[id].returnValue = 0
        return 0
      }

      let res
      if (isMatch) {
        res = 1 + solve(i - 1, j - 1, id)
      } else {
        const optA = solve(i - 1, j, id)
        const optB = solve(i, j - 1, id)
        res = Math.max(optA, optB)
      }
      treeNodes[id].returnValue = res
      return res
    }

    const res = solve(t1.length - 1, t2.length - 1)
    steps.forEach(s => { s.returnValue = treeNodes[s.nodeId]?.returnValue })
    return { result: res, steps, treeNodes, recText1: t1, recText2: t2 }
  }

  /* ── Memoization Algorithm ───────────────────────────────────────────── */
  const computeMemoization = () => {
    const memo = {}
    const steps = []

    const solve = (i, j) => {
      const key = `${i},${j}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', i, j, value: memo[key], memo: { ...memo } })
        return memo[key]
      }
      steps.push({ type: 'compute', i, j, memo: { ...memo } })

      if (i < 0 || j < 0) {
        memo[key] = 0
        steps.push({ type: 'store', i, j, value: 0, memo: { ...memo } })
        return 0
      }

      let res
      if (text1[i] === text2[j]) {
        res = 1 + solve(i - 1, j - 1)
      } else {
        res = Math.max(solve(i - 1, j), solve(i, j - 1))
      }
      memo[key] = res
      steps.push({ type: 'store', i, j, value: res, memo: { ...memo } })
      return res
    }

    const res = solve(text1.length - 1, text2.length - 1)
    return { result: res, steps, memo }
  }

  /* ── Tabulation Algorithm ────────────────────────────────────────────── */
  const computeTabulation = () => {
    const m = text1.length
    const n = text2.length
    // dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    const steps = []

    steps.push({ i: 0, j: 0, dp: dp.map(r => [...r]), action: 'init', activeI: -1, activeJ: -1 })

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const match = text1[i - 1] === text2[j - 1]
        if (match) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
        steps.push({
          i, j,
          dp: dp.map(r => [...r]),
          activeI: i, activeJ: j,
          match,
          char1: text1[i - 1],
          char2: text2[j - 1],
          action: match ? 'match' : 'no-match',
        })
      }
    }

    return { result: dp[m][n], steps, dp }
  }

  useEffect(() => {
    let data
    if      (approach === 'recursion')   data = computeRecursion()
    else if (approach === 'memoization') data = computeMemoization()
    else                                  data = computeTabulation()
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [approach])

  const complexity = {
    recursion:   { time: 'O(2^(m+n))', space: 'O(m+n) — call stack' },
    memoization: { time: 'O(m × n)',    space: 'O(m × n) — memo table' },
    tabulation:  { time: 'O(m × n)',    space: 'O(m × n) → O(n) optimized' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use LCS</h2>
          <ul>
            <li>Find the <strong>longest subsequence</strong> common to two strings</li>
            <li>Subsequence: characters don't need to be contiguous</li>
            <li>Keywords: <em>common characters, edit distance, delete operations</em></li>
            <li><strong>Base:</strong> if either string is empty → LCS = 0</li>
            <li><strong>Match:</strong> <code>1 + LCS(i-1, j-1)</code></li>
            <li><strong>No Match:</strong> <code>max(LCS(i-1, j), LCS(i, j-1))</code></li>
          </ul>
          <p className="dp-example-use">
            <strong>Example:</strong> text1="{text1}", text2="{text2}" → LCS = "ACDE" (length {result ?? 4})
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span>{v.time}</span>
                <span>{v.space.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <p className="dp-example-use" style={{ marginTop: '0.75rem' }}>
            <strong>Result:</strong> LCS length = <strong>{result ?? '…'}</strong>
          </p>
        </div>
      </div>

      {/* Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Longest Common Subsequence</h2>
        <div className="dp-lis-legend">
          <span className="dp-lis-item">text1: "{text1}"</span>
          <span className="dp-lis-item">text2: "{text2}"</span>
          {result !== null && (
            <div className="dp-result-badge">
              <span>LCS length</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
        </div>

        <DPApproachTabs activeApproach={approach} onChange={setApproach} />

        <VisualizerWrapper title={`LCS — ${approach.charAt(0).toUpperCase() + approach.slice(1)}`}>
          {approach === 'recursion'   && <LcsRecursionVisualizer   visualization={visualization} text1={text1} text2={text2} />}
          {approach === 'memoization' && <LcsMemoVisualizer         visualization={visualization} text1={text1} text2={text2} />}
          {approach === 'tabulation'  && <LcsTableVisualizer        visualization={visualization} text1={text1} text2={text2} />}
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
        <DPApproachTabs activeApproach={approach} onChange={setApproach} />
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {/* ── Recursion ── */}
        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// LCS — Recursion (Exponential)
// Solve from end of both strings backward
function lcs(text1, text2, i = text1.length - 1, j = text2.length - 1) {
  // Base: one string exhausted
  if (i < 0 || j < 0) return 0;

  if (text1[i] === text2[j]) {
    // Characters match → take both and go diagonal
    return 1 + lcs(text1, text2, i - 1, j - 1);
  }

  // No match → try skipping from text1 OR text2
  return Math.max(
    lcs(text1, text2, i - 1, j),  // skip char from text1
    lcs(text1, text2, i, j - 1)   // skip char from text2
  );
}

console.log(lcs('ABCDE', 'ACDFE')); // 4 (ACDE)`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# LCS — Recursion (Exponential)
# Solve from end of both strings backward
def lcs(text1, text2, i=None, j=None):
    if i is None: i = len(text1) - 1
    if j is None: j = len(text2) - 1

    # Base: one string exhausted
    if i < 0 or j < 0:
        return 0

    if text1[i] == text2[j]:
        # Characters match → take both and go diagonal
        return 1 + lcs(text1, text2, i - 1, j - 1)

    # No match → try skipping from text1 OR text2
    return max(
        lcs(text1, text2, i - 1, j),  # skip char from text1
        lcs(text1, text2, i, j - 1)   # skip char from text2
    )

print(lcs('ABCDE', 'ACDFE'))  # 4 (ACDE)`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// LCS — Recursion (Exponential)
// Solve from end of both strings backward
public class LCS {
    public static int lcs(String text1, String text2, int i, int j) {
        // Base: one string exhausted
        if (i < 0 || j < 0) return 0;

        if (text1.charAt(i) == text2.charAt(j)) {
            // Characters match → take both and go diagonal
            return 1 + lcs(text1, text2, i - 1, j - 1);
        }

        // No match → try skipping from text1 OR text2
        return Math.max(
            lcs(text1, text2, i - 1, j),  // skip char from text1
            lcs(text1, text2, i, j - 1)   // skip char from text2
        );
    }

    public static void main(String[] args) {
        String t1 = "ABCDE", t2 = "ACDFE";
        System.out.println(lcs(t1, t2, t1.length()-1, t2.length()-1)); // 4
    }
}`} />
        )}

        {/* ── Memoization ── */}
        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// LCS — Memoization (Top-Down DP)
// Cache results of overlapping subproblems
function lcs(text1, text2) {
  const memo = {}

  function solve(i, j) {
    if (i < 0 || j < 0) return 0;
    const key = \`\${i},\${j}\`
    if (key in memo) return memo[key];  // cache hit!

    if (text1[i] === text2[j]) {
      memo[key] = 1 + solve(i - 1, j - 1);
    } else {
      memo[key] = Math.max(solve(i - 1, j), solve(i, j - 1));
    }
    return memo[key];
  }

  return solve(text1.length - 1, text2.length - 1);
}

console.log(lcs('ABCDE', 'ACDFE')); // 4`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# LCS — Memoization (Top-Down DP)
# Cache results of overlapping subproblems
from functools import lru_cache

def lcs(text1, text2):
    @lru_cache(maxsize=None)
    def solve(i, j):
        if i < 0 or j < 0:
            return 0
        if text1[i] == text2[j]:
            return 1 + solve(i - 1, j - 1)
        return max(solve(i - 1, j), solve(i, j - 1))

    return solve(len(text1) - 1, len(text2) - 1)

print(lcs('ABCDE', 'ACDFE'))  # 4`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// LCS — Memoization (Top-Down DP)
// Cache results of overlapping subproblems
import java.util.HashMap;

public class LCS {
    static HashMap<String, Integer> memo = new HashMap<>();

    public static int lcs(String text1, String text2, int i, int j) {
        if (i < 0 || j < 0) return 0;
        String key = i + "," + j;
        if (memo.containsKey(key)) return memo.get(key); // cache hit!

        int result;
        if (text1.charAt(i) == text2.charAt(j)) {
            result = 1 + lcs(text1, text2, i - 1, j - 1);
        } else {
            result = Math.max(lcs(text1, text2, i - 1, j), lcs(text1, text2, i, j - 1));
        }
        memo.put(key, result);
        return result;
    }

    public static void main(String[] args) {
        String t1 = "ABCDE", t2 = "ACDFE";
        System.out.println(lcs(t1, t2, t1.length()-1, t2.length()-1)); // 4
    }
}`} />
        )}

        {/* ── Tabulation ── */}
        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ LCS — Bottom-Up Tabulation  O(m×n) time, O(m×n) space
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  // Extra row/col of zeros for empty-string base case
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;  // diagonal + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // best of top/left
      }
    }
  }

  return dp[m][n];
}

// ✅ Space-Optimized — O(n) space (rolling row)
function lcsOptimized(text1, text2) {
  const m = text1.length, n = text2.length;
  let prev = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }
  return prev[n];
}

console.log(lcs('ABCDE', 'ACDFE'));          // 4
console.log(lcsOptimized('ABCDE', 'ACDFE')); // 4`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ LCS — Bottom-Up Tabulation  O(m×n) time, O(m×n) space
# dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    # Extra row/col of zeros for empty-string base case
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1  # diagonal + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # best of top/left

    return dp[m][n]

# ✅ Space-Optimized — O(n) space (rolling row)
def lcs_optimized(text1, text2):
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)

    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev = curr

    return prev[n]

print(lcs('ABCDE', 'ACDFE'))           # 4
print(lcs_optimized('ABCDE', 'ACDFE')) # 4`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ LCS — Bottom-Up Tabulation  O(m×n) time, O(m×n) space
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
public class LCS {
    public static int lcs(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        // Extra row/col of zeros for empty-string base case
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;  // diagonal + 1
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // best of top/left
                }
            }
        }
        return dp[m][n];
    }

    // ✅ Space-Optimized — O(n) space (rolling row)
    public static int lcsOptimized(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[] prev = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int[] curr = new int[n + 1];
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = Math.max(prev[j], curr[j - 1]);
                }
            }
            prev = curr;
        }
        return prev[n];
    }

    public static void main(String[] args) {
        System.out.println(lcs("ABCDE", "ACDFE"));          // 4
        System.out.println(lcsOptimized("ABCDE", "ACDFE")); // 4
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Define State</strong>
              <p><code>dp[i][j]</code> = length of LCS of <code>text1[0..i-1]</code> and <code>text2[0..j-1]</code>. Row/col 0 = empty string → LCS = 0.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Characters Match</strong>
              <p>If <code>text1[i-1] === text2[j-1]</code>: <code>dp[i][j] = dp[i-1][j-1] + 1</code> — take diagonal + 1</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Characters Don't Match</strong>
              <p><code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code> — take the best from skipping one char in either string</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Answer</strong>
              <p>Return <code>dp[m][n]</code> — the LCS length of the full two strings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Match → Diagonal:</strong> <code>dp[i-1][j-1] + 1</code> — both characters consumed</li>
          <li><strong>No Match → max(Top, Left):</strong> <code>max(dp[i-1][j], dp[i][j-1])</code></li>
          <li><strong>Space Optimization:</strong> Only need current and previous row → reduce to O(n)</li>
          <li><strong>Reconstruct path:</strong> Backtrack through dp table — diagonal = match, otherwise follow the larger neighbor</li>
          <li><strong>LPS:</strong> Longest Palindromic Subsequence = LCS(s, reversed(s))</li>
          <li><strong>Edit Distance:</strong> Adds replace operation on top of LCS logic</li>
          <li><strong>Delete to Make Equal:</strong> <code>m + n - 2 * LCS(text1, text2)</code></li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — LCS</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────────── */
/* LCS VISUALIZERS                                                                */
/* ────────────────────────────────────────────────────────────────────────────── */

function LcsRecursionVisualizer({ visualization, text1, text2 }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  // Use the shorter strings actually used in the recursion
  const t1 = visualization.recText1 || text1
  const t2 = visualization.recText2 || text2
  const isBase = step.isBase
  const match = step.match

  return (
    <div className="dp-viz-content">
      {/* Note about shortened strings */}
      <div style={{ marginBottom: '8px', padding: '6px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
        ℹ️ Using first {t1.length} chars of each string to keep the tree readable. Recursion is exponential O(2^(m+n)).
      </div>

      {/* Step info */}
      <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'var(--color-bg-darker)', borderRadius: '6px', fontSize: '0.85rem' }}>
        <strong>Step {visualization.currentStep + 1}/{visualization.steps.length}</strong>
        {' · '}
        {isBase
          ? <span style={{ color: '#fbbf24' }}>Base case: i or j &lt; 0 → return 0</span>
          : match
            ? <span style={{ color: 'var(--color-accent)' }}>✓ Match! '{t1[step.i]}' === '{t2[step.j]}' → 1 + lcs({step.i-1},{step.j-1})</span>
            : <span style={{ color: '#f87171' }}>✗ No match: '{t1[step.i]}' ≠ '{t2[step.j]}' → max(lcs({step.i-1},{step.j}), lcs({step.i},{step.j-1}))</span>
        }
      </div>

      {/* String pointers */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {[{ label: 'text1', str: t1, ptr: step.i }, { label: 'text2', str: t2, ptr: step.j }].map(({ label, str, ptr }) => (
          <div key={label}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '4px' }}>{label} (ptr={ptr})</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {str.split('').map((ch, idx) => (
                <div key={idx} style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: idx === ptr ? '700' : '400',
                  background: idx === ptr
                    ? (match ? 'var(--color-accent)' : 'var(--color-primary)')
                    : idx < ptr ? 'rgba(64,138,113,0.12)' : 'var(--color-bg-darkest)',
                  border: idx === ptr ? '2px solid var(--color-accent)' : '1px solid transparent',
                  color: idx === ptr ? 'white' : 'var(--color-text)',
                }}>
                  {ch}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} /> Current call
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#d1fae5', border: '1px solid #10b981', display: 'inline-block' }} /> Match
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#fef3c7', border: '1px solid #f59e0b', display: 'inline-block' }} /> Base case
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#c7d2fe', border: '1px solid #818cf8', display: 'inline-block' }} /> Resolved
        </span>
      </div>

      {/* Recursion Tree */}
      {visualization.treeNodes && (
        <RecursionTree
          treeNodes={visualization.treeNodes.slice(0, visualization.currentStep + 1)}
          activeNodeId={step.nodeId}
        />
      )}

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length} · Calls so far: {visualization.currentStep + 1}
      </div>
    </div>
  )
}

function LcsMemoVisualizer({ visualization, text1, text2 }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const entries = Object.entries(step.memo || {}).slice(-20) // show last 20

  return (
    <div className="dp-viz-content">
      {/* Step info */}
      <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'var(--color-bg-darker)', borderRadius: '6px', fontSize: '0.85rem' }}>
        <strong>Step {visualization.currentStep + 1}/{visualization.steps.length}</strong>
        {' · '}
        {step.type === 'cache-hit'
          ? <span style={{ color: '#fbbf24' }}>Cache HIT: memo[{step.i},{step.j}] = {step.value}</span>
          : step.type === 'store'
            ? <span style={{ color: 'var(--color-accent)' }}>Stored: memo[{step.i},{step.j}] = {step.value}</span>
            : <span>Computing lcs({step.i}, {step.j})</span>
        }
      </div>

      {/* String highlights */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {[{ label: 'text1', str: text1, ptr: step.i }, { label: 'text2', str: text2, ptr: step.j }].map(({ label, str, ptr }) => (
          <div key={label}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '4px' }}>{label} (ptr={ptr})</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {str.split('').map((ch, idx) => (
                <div key={idx} style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: idx === ptr ? '700' : '400',
                  background: idx === ptr ? 'var(--color-primary)' : idx < ptr ? 'rgba(64,138,113,0.12)' : 'var(--color-bg-darkest)',
                  border: idx === ptr ? '2px solid var(--color-accent)' : '1px solid transparent',
                  color: idx === ptr ? 'white' : 'var(--color-text)',
                }}>
                  {ch}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Memo cache */}
      <div style={{ background: 'var(--color-bg-darker)', borderRadius: '6px', padding: '12px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-accent)' }}>Memo Cache (most recent):</div>
        {entries.length === 0
          ? <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Empty</div>
          : <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {entries.map(([k, v]) => (
                <div key={k} style={{
                  padding: '4px 8px',
                  background: k === `${step.i},${step.j}` ? 'var(--color-primary)' : 'var(--color-bg-darkest)',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  border: k === `${step.i},${step.j}` ? '1px solid var(--color-accent)' : '1px solid transparent',
                  color: 'var(--color-text)',
                }}>
                  [{k}]={v}
                </div>
              ))}
            </div>
        }
      </div>

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length} · Cache size: {Object.keys(step.memo || {}).length}
      </div>
    </div>
  )
}

function LcsTableVisualizer({ visualization, text1, text2 }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []
  const activeI = step.activeI
  const activeJ = step.activeJ

  return (
    <div className="dp-viz-content">
      {/* Step info */}
      <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'var(--color-bg-darker)', borderRadius: '6px', fontSize: '0.85rem' }}>
        <strong>Step {visualization.currentStep + 1}/{visualization.steps.length}</strong>
        {activeI > 0 && activeJ > 0 && (
          <>
            {' · '}
            {step.match
              ? <span style={{ color: 'var(--color-accent)' }}>
                  Match: '{step.char1}' === '{step.char2}' → dp[{activeI}][{activeJ}] = dp[{activeI-1}][{activeJ-1}] + 1 = <strong>{dp[activeI]?.[activeJ]}</strong>
                </span>
              : <span style={{ color: '#f87171' }}>
                  No match: '{step.char1}' ≠ '{step.char2}' → dp[{activeI}][{activeJ}] = max(dp[{activeI-1}][{activeJ}], dp[{activeI}][{activeJ-1}]) = <strong>{dp[activeI]?.[activeJ]}</strong>
                </span>
            }
          </>
        )}
      </div>

      {/* DP Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 8px', background: 'var(--color-bg-darkest)', color: 'var(--color-text-light)', border: '1px solid var(--color-bg-lighter)' }}>i\j</th>
              <th style={{ padding: '6px 8px', background: 'var(--color-bg-darkest)', color: 'var(--color-text-light)', border: '1px solid var(--color-bg-lighter)' }}>""</th>
              {text2.split('').map((ch, j) => (
                <th key={j} style={{ padding: '6px 8px', background: 'var(--color-bg-darkest)', color: 'var(--color-text-light)', border: '1px solid var(--color-bg-lighter)' }}>{ch}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '6px 8px', background: 'var(--color-bg-darkest)', color: 'var(--color-text-light)', border: '1px solid var(--color-bg-lighter)', fontWeight: '600' }}>
                  {i === 0 ? '""' : text1[i - 1]}
                </td>
                {row.map((val, j) => {
                  const isActive = i === activeI && j === activeJ
                  const isFilled = (activeI > i) || (activeI === i && activeJ >= j)
                  return (
                    <td key={j} style={{
                      padding: '6px 10px',
                      textAlign: 'center',
                      fontWeight: isActive ? '700' : '400',
                      background: isActive
                        ? (step.match ? 'var(--color-accent)' : 'var(--color-primary)')
                        : isFilled ? 'rgba(64,138,113,0.12)' : 'var(--color-bg-darkest)',
                      border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-bg-lighter)',
                      color: isActive ? 'white' : 'var(--color-text)',
                    }}>
                      {isFilled || val > 0 ? val : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length}
        {dp.length > 0 && ` · LCS so far: ${Math.max(...dp.flat())}`}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────── */
/* LIS VISUALIZERS */
/* ────────────────────────────────────────────────────────────────────────────── */

function LisRecursionVisualizer({ visualization, arr }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `(${c.idx},${c.prevVal===null?'_':c.prevVal})`,
    isBase: c.isBase,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.isBase ? 'return' : 'call'}`}>
        {!step.isBase   && <>📍 At index <strong>{step.idx}</strong> (arr[{step.idx}]={arr[step.idx]}), prev=<strong>{step.prevVal===null?'none':step.prevVal}</strong></>}
        {step.isBase    && <>↩ Base case: <strong>{step.returnValue}</strong></>}
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px', fontSize: '0.85rem' }}>
        <strong>Array:</strong> [{arr.map((v, i) => (
          <span key={i} style={{ color: i === step.idx ? '#fbbf24' : 'var(--color-text)' }}>
            {i > 0 && ', '}{v}
          </span>
        ))}]
      </div>

      {/* Recursion Tree + Call Stack */}
      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.nodeId}
          />
        </div>

        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.nodeId ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">({c.idx},{c.prevVal===null?'_':c.prevVal})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LisMemoVisualizer({ visualization, arr }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing LIS from index <strong>{step.idx}</strong>…</>}
        {step.type === 'store'     && <>💾 Stored ({step.idx},{step.prevVal===null?'_':step.prevVal}) = <strong>{step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — ({step.idx},{step.prevVal===null?'_':step.prevVal}) = <strong>{step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cache entries: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>({step.idx},{step.prevVal===null?'_':step.prevVal})</strong></span>
      </div>

      {/* Memo display */}
      <div style={{ padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', fontSize: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
        {Object.entries(memo).slice(0, 20).map(([key, val]) => (
          <div key={key} style={{ padding: '4px 8px', borderBottom: '1px solid var(--color-bg-darkest)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-accent)' }}>({key})</span>
            <span style={{ color: '#fbbf24', fontWeight: '600' }}>{val}</span>
          </div>
        ))}
        {Object.keys(memo).length > 20 && (
          <div style={{ padding: '4px 8px', textAlign: 'center', color: 'var(--color-text-light)' }}>
            … {Object.keys(memo).length - 20} more entries
          </div>
        )}
      </div>
    </div>
  )
}

function LisTableVisualizer({ visualization, arr }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="dp-call-badge store">
        {step.action === 'init'
          ? <>🔧 Initializing: each element is min LIS of length 1</>
          : <>📍 At index {step.i} (val={arr[step.i]}): Find max LIS from smaller elements, add 1. Result: <strong>dp[{step.i}] = {step.maxLen}</strong></>
        }
      </div>

      {/* Array with current element highlighted */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        {arr.map((val, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px 12px',
              background: idx === step.i ? 'var(--color-primary)' : (idx < step.i ? 'rgba(64, 138, 113, 0.1)' : 'var(--color-bg-darkest)'),
              border: idx === step.i ? '2px solid var(--color-accent)' : '1px solid var(--color-bg-darker)',
              borderRadius: '4px',
              fontWeight: idx === step.i ? '700' : '500',
              textAlign: 'center',
              minWidth: '40px',
              color: idx === step.i ? 'white' : 'var(--color-text)',
            }}
          >
            {val}
          </div>
        ))}
      </div>

      {/* DP array */}
      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-accent)' }}>dp[] (LIS length ending at index):</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {dp.map((val, idx) => (
            <div
              key={idx}
              style={{
                padding: '6px 10px',
                background: idx === step.i ? 'var(--color-primary)' : (idx < step.i ? 'rgba(64, 138, 113, 0.15)' : 'var(--color-bg-darkest)'),
                border: idx === step.i ? '2px solid var(--color-accent)' : '1px solid var(--color-bg-darker)',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: idx === step.i ? '700' : '500',
                textAlign: 'center',
                color: idx === step.i ? 'white' : 'var(--color-text)',
              }}
            >
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>dp[{idx}]</div>
              <div>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparisons for current step */}
      {step.comparisons && step.comparisons.length > 0 && (
        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(64, 138, 113, 0.1)', borderRadius: '6px', fontSize: '0.8rem' }}>
          <strong>Checking indices before {step.i}:</strong>
          {step.comparisons.map((c, idx) => (
            <div key={idx} style={{ marginTop: '4px', color: c.isCandidate ? '#fbbf24' : 'var(--color-text-light)' }}>
              j={c.j}: arr[{c.j}]={c.val} {c.isCandidate ? '&lt;' : '≥'} arr[{step.i}] → dp[{c.j}]={c.dpi} {c.isCandidate ? '✓ candidate' : '✗ skip'}
            </div>
          ))}
        </div>
      )}

      <div className="dp-table-progress">
        Step {visualization.currentStep + 1} / {visualization.steps.length} &nbsp;·&nbsp; Current max LIS: <strong>{Math.max(...dp)}</strong>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   KADANE'S ALGORITHM PATTERN
   ══════════════════════════════════════════════════════════════════════════════ */
function KadanePattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('kadane')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result,   setResult]   = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

  const kadaneProblems = [
    {
      id: 'lc53',
      title: 'LC 53. Maximum Subarray',
      description: "Find the contiguous subarray with the largest sum. Classic Kadane's problem.",
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/description/',
      topics: ['Array', 'DP', 'Divide and Conquer'],
    },
    {
      id: 'lc918',
      title: 'LC 918. Maximum Sum Circular Subarray',
      description: "Max subarray sum in a circular array. Use Kadane's + total-sum trick.",
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-sum-circular-subarray/description/',
      topics: ['Array', 'DP', 'Queue'],
    },
    {
      id: 'lc152',
      title: 'LC 152. Maximum Product Subarray',
      description: 'Max product instead of sum — track both max and min (negatives flip sign).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-product-subarray/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc121',
      title: 'LC 121. Best Time to Buy and Sell Stock',
      description: 'Maximize profit by choosing buy/sell day — reduces to max subarray of price diffs.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc1186',
      title: 'LC 1186. Maximum Subarray Sum with One Deletion',
      description: 'Optionally delete one element — use two DP arrays (with/without deletion).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/description/',
      topics: ['Array', 'DP'],
    },
    {
      id: 'lc1749',
      title: 'LC 1749. Maximum Absolute Sum of Any Subarray',
      description: "Find max of |subarray sums| — run Kadane's for both max and min subarray.",
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/description/',
      topics: ['Array', 'DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-kadane', kadaneProblems, user?.uid)

  /* ── Brute Force O(n²) ──────────────────────────────────────────────── */
  const computeBruteForce = () => {
    const steps = []
    let globalMax = -Infinity
    for (let i = 0; i < arr.length; i++) {
      let sum = 0
      for (let j = i; j < arr.length; j++) {
        sum += arr[j]
        const prevMax = globalMax
        const isNewMax = sum > globalMax  // capture BEFORE update
        if (isNewMax) globalMax = sum
        steps.push({ i, j, sum, globalMax, prevMax, subarray: arr.slice(i, j + 1), isNewMax })
      }
    }
    return { result: globalMax, steps }
  }

  /* ── Kadane's O(n) ──────────────────────────────────────────────────── */
  const computeKadane = () => {
    const steps = []
    let currentMax = arr[0], globalMax = arr[0]
    let start = 0, end = 0, tempStart = 0

    steps.push({
      idx: 0, val: arr[0], currentMax, globalMax,
      action: 'init', window: [0, 0],
      decision: 'Initialize: currentMax = globalMax = arr[0]',
    })

    for (let i = 1; i < arr.length; i++) {
      const extendSum = currentMax + arr[i]
      const restarted = arr[i] > extendSum
      if (restarted) {
        currentMax = arr[i]
        tempStart  = i
        steps.push({
          idx: i, val: arr[i], currentMax, globalMax,
          action: 'restart', window: [tempStart, i],
          decision: `arr[${i}]=${arr[i]} > extend(${extendSum}) → restart subarray here`,
        })
      } else {
        currentMax = extendSum
        steps.push({
          idx: i, val: arr[i], currentMax, globalMax,
          action: 'extend', window: [tempStart, i],
          decision: `extend: currentMax = ${extendSum - arr[i]} + arr[${i}](${arr[i]}) = ${currentMax}`,
        })
      }
      if (currentMax > globalMax) {
        globalMax = currentMax
        start = tempStart; end = i
        steps.push({
          idx: i, val: arr[i], currentMax, globalMax,
          action: 'new-max', window: [start, end],
          decision: `🏆 New global max = ${globalMax}`,
        })
      }
    }

    return { result: globalMax, steps, bestStart: start, bestEnd: end }
  }

  useEffect(() => {
    const data = approach === 'brute' ? computeBruteForce() : computeKadane()
    setVisualization({ ...data, currentStep: 0 })
    setResult(data.result)
    setIsPaused(true)
  }, [approach])

  const complexity = {
    brute:  { time: 'O(n²)', space: 'O(1)' },
    kadane: { time: 'O(n)',  space: 'O(1)' },
  }

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Kadane's</h2>
          <ul>
            <li>Find the <strong>maximum sum contiguous subarray</strong></li>
            <li>Think of it as a sliding window: extend or restart</li>
            <li>Keywords: <em>max subarray, max sum, contiguous elements</em></li>
            <li>Works in <strong>O(n)</strong> one pass, <strong>O(1)</strong> space</li>
            <li>Basis for circular subarray, max product, stock problems</li>
          </ul>
          <p className="dp-example-use">
            <strong>Recurrence:</strong>{' '}
            <code>dp[i] = max(arr[i], dp[i-1] + arr[i])</code>
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach === 'brute' ? 'Brute Force' : "Kadane's"}</h2>
          <p><strong>Time:</strong> {complexity[approach].time}</p>
          <p><strong>Space:</strong> {complexity[approach].space}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {Object.entries(complexity).map(([k, v]) => (
              <div key={k} className={`dp-cmp-row ${approach === k ? 'active' : ''}`}>
                <span>{k === 'brute' ? 'Brute Force' : "Kadane's"}</span>
                <span>{v.time}</span>
                <span>{v.space}</span>
              </div>
            ))}
          </div>
          <p className="dp-example-use" style={{ marginTop: '0.75rem' }}>
            <strong>Example:</strong> [{arr.join(', ')}] → max sum = <strong>{result ?? '…'}</strong>
          </p>
        </div>
      </div>

      {/* Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Maximum Subarray</h2>
        <div className="dp-lis-legend">
          <span className="dp-lis-item">Array: [{arr.join(', ')}]</span>
          {result !== null && (
            <div className="dp-result-badge">
              <span>max sum</span>
              <span className="dp-result-val">{result}</span>
            </div>
          )}
        </div>

        <div className="dp-approach-tabs">
          {[{ id: 'brute', label: '🔴 Brute Force' }, { id: 'kadane', label: "⚡ Kadane's" }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title={approach === 'brute' ? 'Brute Force — O(n²)' : "Kadane's Algorithm — O(n)"}>
          {approach === 'brute'  && <KadaneBruteVisualizer arr={arr} visualization={visualization} />}
          {approach === 'kadane' && <KadaneVisualizer arr={arr} visualization={visualization} />}
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
        <div className="dp-approach-tabs">
          {[{ id: 'brute', label: '🔴 Brute Force' }, { id: 'kadane', label: "⚡ Kadane's" }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'brute' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Brute Force — O(n²) — try every subarray
function maxSubArray(nums) {
  let globalMax = nums[0];

  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      globalMax = Math.max(globalMax, sum);
    }
  }
  return globalMax;
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6`} />
        )}
        {approach === 'brute' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Brute Force — O(n²) — try every subarray
def max_subarray(nums):
    global_max = nums[0]
    for i in range(len(nums)):
        current_sum = 0
        for j in range(i, len(nums)):
            current_sum += nums[j]
            global_max = max(global_max, current_sum)
    return global_max

print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6`} />
        )}
        {approach === 'brute' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Brute Force — O(n²) — try every subarray
public class MaxSubarray {
    public static int maxSubArray(int[] nums) {
        int globalMax = nums[0];
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                globalMax = Math.max(globalMax, sum);
            }
        }
        return globalMax;
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
    }
}`} />
        )}

        {approach === 'kadane' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Kadane's Algorithm — O(n) time, O(1) space
function maxSubArray(nums) {
  let currentMax = nums[0]; // best sum ending HERE
  let globalMax  = nums[0]; // best sum seen so far

  for (let i = 1; i < nums.length; i++) {
    // Key: extend current subarray OR start fresh at nums[i]
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax  = Math.max(globalMax, currentMax);
  }
  return globalMax;
}

// Variant: also return the subarray indices
function maxSubArrayWithIndices(nums) {
  let currentMax = nums[0], globalMax = nums[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > currentMax + nums[i]) {
      currentMax = nums[i];
      tempStart  = i;           // restart window
    } else {
      currentMax += nums[i];
    }
    if (currentMax > globalMax) {
      globalMax = currentMax;
      start = tempStart;
      end   = i;
    }
  }
  return { max: globalMax, subarray: nums.slice(start, end + 1) };
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));           // 6
console.log(maxSubArrayWithIndices([-2,1,-3,4,-1,2,1,-5,4])); // {max:6, subarray:[4,-1,2,1]}`} />
        )}
        {approach === 'kadane' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Kadane's Algorithm — O(n) time, O(1) space
def max_subarray(nums):
    current_max = nums[0]  # best sum ending HERE
    global_max  = nums[0]  # best sum seen so far

    for num in nums[1:]:
        # Key: extend OR start fresh
        current_max = max(num, current_max + num)
        global_max  = max(global_max, current_max)
    return global_max

# Variant: also return subarray indices
def max_subarray_with_indices(nums):
    current_max = global_max = nums[0]
    start = end = temp_start = 0

    for i in range(1, len(nums)):
        if nums[i] > current_max + nums[i]:
            current_max = nums[i]
            temp_start  = i          # restart window
        else:
            current_max += nums[i]
        if current_max > global_max:
            global_max = current_max
            start, end = temp_start, i

    return global_max, nums[start:end+1]

print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))            # 6
print(max_subarray_with_indices([-2,1,-3,4,-1,2,1,-5,4])) # (6, [4, -1, 2, 1])`} />
        )}
        {approach === 'kadane' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Kadane's Algorithm — O(n) time, O(1) space
public class MaxSubarray {
    public static int maxSubArray(int[] nums) {
        int currentMax = nums[0]; // best sum ending HERE
        int globalMax  = nums[0]; // best sum seen so far

        for (int i = 1; i < nums.length; i++) {
            // Key: extend current subarray OR start fresh at nums[i]
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            globalMax  = Math.max(globalMax, currentMax);
        }
        return globalMax;
    }

    // Variant: also return subarray indices [start, end, maxSum]
    public static int[] maxSubArrayWithIndices(int[] nums) {
        int currentMax = nums[0], globalMax = nums[0];
        int start = 0, end = 0, tempStart = 0;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > currentMax + nums[i]) {
                currentMax = nums[i];
                tempStart  = i;       // restart window
            } else {
                currentMax += nums[i];
            }
            if (currentMax > globalMax) {
                globalMax = currentMax;
                start = tempStart;
                end   = i;
            }
        }
        return new int[]{start, end, globalMax};
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Core Observation</strong>
              <p>At each index <code>i</code>, the maximum subarray ending exactly at <code>i</code> either starts fresh (<code>arr[i]</code>) or extends the best subarray ending at <code>i-1</code>.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP Recurrence</strong>
              <p><code>dp[i] = max(arr[i], dp[i-1] + arr[i])</code></p>
              <p>If <code>dp[i-1]</code> is negative, adding it only hurts — so restart from <code>arr[i]</code>.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Track Global Best</strong>
              <p>After each position, update <code>globalMax = max(globalMax, currentMax)</code>. The final answer is the highest value seen across all positions.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>O(1) Space Trick</strong>
              <p><code>dp[i]</code> depends only on <code>dp[i-1]</code>, so store just <code>currentMax</code> — no array needed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Negative prefix = drag:</strong> if <code>currentMax &lt; 0</code>, restart at the next element</li>
          <li><strong>All negatives:</strong> initialise to <code>nums[0]</code> (not 0) so the answer is the least-negative element</li>
          <li><strong>Circular subarray (LC 918):</strong> <code>max(Kadane's result, totalSum − minSubarray)</code></li>
          <li><strong>Max product (LC 152):</strong> track both <code>maxProd</code> and <code>minProd</code> because negatives flip sign</li>
          <li><strong>Buy/sell stock:</strong> build <code>diff[i] = price[i] − price[i-1]</code>, then run Kadane's on the diffs</li>
        </ul>
      </div>

      {/* Practice */}
      <div className="card">
        <h2>🎯 Practice Problems — Kadane's Algorithm</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Kadane Brute Force Visualizer ──────────────────────────────────────── */
function KadaneBruteVisualizer({ arr, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-empty">Press ▶ to start</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.isNewMax ? 'store' : 'call'}`}>
        {step.isNewMax
          ? <>🏆 New global max! [{step.subarray.join(', ')}] → sum = <strong>{step.sum}</strong>{step.prevMax !== -Infinity ? ` (was ${step.prevMax})` : ''}</>
          : <>📍 arr[{step.i}..{step.j}] = [{step.subarray.join(', ')}] → sum = <strong>{step.sum}</strong> ≤ globalMax ({step.globalMax})</>
        }
      </div>

      <div className="dp-table-row" style={{ marginTop: '16px' }}>
        {arr.map((val, idx) => (
          <div
            key={idx}
            className={`dp-table-cell
              ${idx === step.j ? 'active' : ''}
              ${idx >= step.i && idx < step.j ? 'from1' : ''}
            `}
          >
            <span className="dp-cell-label">[{idx}]</span>
            <span className="dp-cell-val">{val}</span>
          </div>
        ))}
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        i={step.i}, j={step.j} &nbsp;·&nbsp; current sum = <strong>{step.sum}</strong> &nbsp;·&nbsp; global max = <strong>{step.globalMax}</strong>
      </div>
    </div>
  )
}

/* ── Kadane's Algorithm Visualizer ──────────────────────────────────────── */
function KadaneVisualizer({ arr, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-empty">Press ▶ to start</div>
  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const badgeClass = { init: 'call', extend: 'call', restart: 'hit', 'new-max': 'store' }

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${badgeClass[step.action] ?? 'call'}`}>
        {step.decision}
      </div>

      <div className="dp-table-row" style={{ marginTop: '16px' }}>
        {arr.map((val, idx) => (
          <div
            key={idx}
            className={`dp-table-cell
              ${idx === step.idx ? 'active' : ''}
              ${idx >= step.window[0] && idx < step.idx ? 'from1' : ''}
            `}
          >
            <span className="dp-cell-label">[{idx}]</span>
            <span className="dp-cell-val">{val}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        <div className="dp-memo-cell active" style={{ minWidth: '120px', textAlign: 'center' }}>
          <span className="dp-memo-key">currentMax</span>
          <span className="dp-memo-val">{step.currentMax}</span>
        </div>
        <div className="dp-memo-cell filled" style={{ minWidth: '120px', textAlign: 'center' }}>
          <span className="dp-memo-key">globalMax</span>
          <span className="dp-memo-val">{step.globalMax}</span>
        </div>
        <div className="dp-memo-cell" style={{ minWidth: '120px', textAlign: 'center' }}>
          <span className="dp-memo-key">window</span>
          <span className="dp-memo-val">[{step.window[0]}, {step.window[1]}]</span>
        </div>
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {visualization.currentStep + 1} / {visualization.steps.length}
        &nbsp;·&nbsp; idx={step.idx} arr[{step.idx}]={step.val}
        &nbsp;·&nbsp; action: <strong>{step.action}</strong>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MATRIX CHAIN MULTIPLICATION PATTERN
   ══════════════════════════════════════════════════════════════════════════════ */
function MCMPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Dimensions: [10, 20, 30, 40, 30]
  // Matrices: A(10×20), B(20×30), C(30×40), D(40×30)
  const p = [10, 20, 30, 40, 30]
  const matrixNames = ['A', 'B', 'C', 'D']

  const mcmProblems = [
    {
      id: 'icm-classic',
      title: 'Classic MCM Problem',
      description: 'Given matrix dimensions, find minimum multiplications to compute product.',
      difficulty: 'Hard',
      leetcodeLink: '#',
      topics: ['DP', 'Interval DP', 'Optimization'],
    },
    {
      id: 'lc1547',
      title: 'LC 1547. Minimum Cost to Cut a Stick',
      description: 'Similar to MCM — optimal split decisions to minimize cost.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/description/',
      topics: ['DP', 'Interval DP'],
    },
    {
      id: 'lc312',
      title: 'LC 312. Burst Balloons',
      description: 'Optimal removal order — interval DP similar to MCM logic.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/burst-balloons/description/',
      topics: ['DP', 'Interval DP'],
    },
    {
      id: 'lc1000',
      title: 'LC 1000. Minimum Cost to Merge Stones',
      description: 'Merge adjacent piles optimally — uses MCM style interval DP.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/minimum-cost-to-merge-stones/description/',
      topics: ['DP', 'Interval DP'],
    },
    {
      id: 'lc368',
      title: 'Optimal Binary Search Tree',
      description: 'Minimize cost of accessing keys — another classic interval DP problem.',
      difficulty: 'Hard',
      leetcodeLink: '#',
      topics: ['DP', 'Interval DP'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-mcm', mcmProblems, user?.uid)

  /* ── Pure Recursion O(2^n) ──────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const mcm = (i, j, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, i, j, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, i, j, depth, parentId, callStack: calls.map(c => ({ ...c })) })

      // Base case: single matrix
      if (i === j) {
        calls[id].resolved = true
        calls[id].value = 0
        steps.push({ type: 'return', id, i, j, value: 0, depth, callStack: calls.map(c => ({ ...c })) })
        return 0
      }

      let minCost = Infinity
      let bestK = -1

      // Try all split points
      for (let k = i; k < j; k++) {
        const left = mcm(i, k, depth + 1, id)
        const right = mcm(k + 1, j, depth + 1, id)
        const cost = left + right + p[i] * p[k + 1] * p[j + 1]

        if (cost < minCost) {
          minCost = cost
          bestK = k
        }
      }

      calls[id].resolved = true
      calls[id].value = minCost
      steps.push({ type: 'return', id, i, j, value: minCost, depth, callStack: calls.map(c => ({ ...c })) })
      return minCost
    }

    // Limit recursion depth for MCM (n=4 means 4 matrices)
    const n = Math.min(4, p.length - 1)
    const result = mcm(0, n - 1)
    
    return { result, steps }
  }

  /* ── Memoized Recursion O(n³) ────────────────────────────────────────── */
  const computeMemoized = () => {
    const steps = []
    const memo = {}

    let callDepth = 0
    const mcrMemo = (i, j) => {
      if (i === j) {
        callDepth++
        steps.push({
          type: 'base',
          i, j,
          cost: 0,
          message: `Base: M[${i}] is single matrix, cost=0`,
          callDepth,
        })
        return 0
      }

      const key = `${i},${j}`
      if (memo[key]) {
        callDepth++
        steps.push({
          type: 'memo-hit',
          i, j,
          cost: memo[key],
          message: `Memo hit: M[${i}..${j}]=${memo[key]}`,
          callDepth,
        })
        return memo[key]
      }

      let minCost = Infinity
      let bestK = -1

      for (let k = i; k < j; k++) {
        callDepth++
        steps.push({
          type: 'try-split',
          i, j, k,
          message: `Try split at k=${k}: M[${i}..${k}] + M[${k+1}..${j}] + cost`,
          callDepth,
        })

        const left = mcrMemo(i, k)
        const right = mcrMemo(k + 1, j)
        const cost = left + right + p[i] * p[k + 1] * p[j + 1]

        steps.push({
          type: 'merge-cost',
          i, j, k,
          left,
          right,
          multCost: p[i] * p[k + 1] * p[j + 1],
          totalCost: cost,
          message: `k=${k}: ${left} + ${right} + ${p[i]}×${p[k + 1]}×${p[j + 1]}=${cost}`,
          callDepth,
        })

        if (cost < minCost) {
          minCost = cost
          bestK = k
        }
      }

      memo[key] = minCost
      callDepth++
      steps.push({
        type: 'store',
        i, j,
        cost: minCost,
        bestK,
        message: `Store: dp[${i}][${j}]=${minCost} (split at k=${bestK})`,
        callDepth,
      })

      return minCost
    }

    const totalCost = mcrMemo(0, p.length - 2)
    return { result: totalCost, steps }
  }

  /* ── Tabulation O(n³) ────────────────────────────────────────────────── */
  const computeDP = () => {
    const steps = []
    const n = p.length - 1
    const dp = Array(n).fill(0).map(() => Array(n).fill(0))
    const split = Array(n).fill(0).map(() => Array(n).fill(0))

    steps.push({
      type: 'init',
      message: 'Initialize dp[i][i]=0 (single matrix, no multiplication)',
      dp: dp.map(r => [...r]),
      split: split.map(r => [...r]),
    })

    // len = length of chain
    for (let len = 2; len <= n; len++) {
      steps.push({
        type: 'start-len',
        len,
        message: `Processing chains of length ${len}`,
        dp: dp.map(r => [...r]),
        split: split.map(r => [...r]),
      })

      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1
        dp[i][j] = Infinity

        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]

          steps.push({
            type: 'try-split',
            i, j, k, len,
            left: dp[i][k],
            right: dp[k + 1][j],
            multCost: p[i] * p[k + 1] * p[j + 1],
            totalCost: cost,
            message: `[${i}..${j}] split at k=${k}: ${dp[i][k]} + ${dp[k + 1][j]} + ${p[i]}×${p[k + 1]}×${p[j + 1]}=${cost}`,
            dp: dp.map(r => [...r]),
            split: split.map(r => [...r]),
          })

          if (cost < dp[i][j]) {
            dp[i][j] = cost
            split[i][j] = k

            steps.push({
              type: 'update',
              i, j, k,
              cost,
              message: `Update: dp[${i}][${j}]=${cost} (best so far, split at k=${k})`,
              dp: dp.map(r => [...r]),
              split: split.map(r => [...r]),
            })
          }
        }
      }
    }

    return { result: dp[0][n - 1], steps, dp, split }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memo') {
        data = computeMemoized()
      } else {
        data = computeDP()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('MCM computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Matrix Chain Multiplication</h2>
          <ul>
            <li>Given a sequence of matrices, find <strong>minimum multiplications</strong> to compute product</li>
            <li>Problem shows <strong>optimal substructure</strong> — solution contains solutions to subproblems</li>
            <li>Overlapping subproblems: same chain lengths computed multiple times (recursion)</li>
            <li>Classic <strong>interval DP</strong> — solve by increasing chain lengths</li>
            <li>Problems: MCM itself, Burst Balloons (LC 312), Minimum Cost to Cut (LC 1547), Merge Stones (LC 1000)</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> Break chain into [i..k] and [k+1..j], combine costs, find minimum across all k.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {approach === 'recursion' ? 'O(2ⁿ)' : 'O(n³) — all three DP approaches'}</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(n) — call stack' : approach === 'memo' ? 'O(n²) — memo table' : 'O(n²) — DP table'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoization', time: 'O(n³)', space: 'O(n²)' }, { name: 'Tabulation', time: 'O(n³)', space: 'O(n²)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Matrix Chain Multiplication</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memo', label: '💾 Memoization (Top-Down)' }, { id: 'dp', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title={`MCM — Matrices: ${matrixNames.join(', ')}`}>
          {approach === 'recursion' && <MCMRecursionVisualizer p={p} visualization={visualization} />}
          {approach === 'memo' && <MCMMemoVisualizer p={p} matrixNames={matrixNames} visualization={visualization} />}
          {approach === 'dp' && <MCMDPVisualizer p={p} matrixNames={matrixNames} visualization={visualization} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Result: <strong style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{result !== null ? result : '—'}</strong> scalar multiplications
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memo', label: '💾 Memoization (Top-Down)' }, { id: 'dp', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
function matrixChainOrder(p) {
  const n = p.length - 1

  function mcm(i, j) {
    if (i === j) return 0
    let minCost = Infinity
    for (let k = i; k < j; k++) {
      const cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1]
      minCost = Math.min(minCost, cost)
    }
    return minCost
  }

  return mcm(0, n - 1)
}

console.log(matrixChainOrder([10, 20, 30, 40, 30])) // 30000
// Problem: Same subproblems computed many times with exponential branches!`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
def matrix_chain_order(p):
    n = len(p) - 1

    def mcm(i, j):
        if i == j:
            return 0
        min_cost = float('inf')
        for k in range(i, j):
            cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1]
            min_cost = min(min_cost, cost)
        return min_cost

    return mcm(0, n - 1)

print(matrix_chain_order([10, 20, 30, 40, 30]))  # 30000
# Problem: Same subproblems computed many times with exponential branches!`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Exponential — O(2^n) — demonstrates overlapping subproblems
public class MCM {
    static int[] p;

    public static int matrixChainOrder(int[] dimensions) {
        p = dimensions;
        int n = dimensions.length - 1;
        return mcm(0, n - 1);
    }

    static int mcm(int i, int j) {
        if (i == j) return 0;
        int minCost = Integer.MAX_VALUE;
        for (int k = i; k < j; k++) {
            int cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1];
            minCost = Math.min(minCost, cost);
        }
        return minCost;
    }

    public static void main(String[] args) {
        System.out.println(matrixChainOrder(new int[]{10, 20, 30, 40, 30})); // 30000
    }
}
// Problem: Same subproblems computed many times with exponential branches!`} />
        )}

        {approach === 'memo' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n³) time, O(n²) space
function matrixChainOrder(p) {
  const n = p.length - 1
  const memo = {}

  function mcm(i, j) {
    if (i === j) return 0
    const key = \`\${i},\${j}\`
    if (memo[key] !== undefined) return memo[key]

    let minCost = Infinity
    for (let k = i; k < j; k++) {
      const cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1]
      minCost = Math.min(minCost, cost)
    }
    return memo[key] = minCost
  }

  return mcm(0, n - 1)
}

console.log(matrixChainOrder([10, 20, 30, 40, 30])) // 30000
// Each subproblem computed once — fast recovery via memo dictionary!`} />
        )}
        {approach === 'memo' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n³) time, O(n²) space
def matrix_chain_order_memo(p):
    n = len(p) - 1
    memo = {}

    def mcm(i, j):
        if i == j:
            return 0
        key = (i, j)
        if key in memo:
            return memo[key]

        min_cost = float('inf')
        for k in range(i, j):
            cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1]
            min_cost = min(min_cost, cost)
        memo[key] = min_cost
        return min_cost

    return mcm(0, n - 1)

print(matrix_chain_order_memo([10, 20, 30, 40, 30]))  # 30000
# Each subproblem computed once — fast recovery via memo dictionary!`} />
        )}
        {approach === 'memo' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n³) time, O(n²) space
import java.util.HashMap;
import java.util.Map;

public class MCM {
    static Map<String, Integer> memo = new HashMap<>();
    static int[] p;

    public static int matrixChainOrder(int[] dimensions) {
        p = dimensions;
        memo.clear();
        int n = dimensions.length - 1;
        return mcm(0, n - 1);
    }

    static int mcm(int i, int j) {
        if (i == j) return 0;
        String key = i + "," + j;
        if (memo.containsKey(key)) return memo.get(key);

        int minCost = Integer.MAX_VALUE;
        for (int k = i; k < j; k++) {
            int cost = mcm(i, k) + mcm(k + 1, j) + p[i] * p[k + 1] * p[j + 1];
            minCost = Math.min(minCost, cost);
        }
        memo.put(key, minCost);
        return minCost;
    }

    public static void main(String[] args) {
        System.out.println(matrixChainOrder(new int[]{10, 20, 30, 40, 30})); // 30000
    }
}
// Each subproblem computed once — fast recovery via memo dictionary!`} />
        )}

        {approach === 'dp' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n³) time, O(n²) space
function matrixChainOrder(p) {
  const n = p.length - 1
  const dp = Array(n).fill(0).map(() => Array(n).fill(0))
  const split = Array(n).fill(0).map(() => Array(n).fill(0))

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
        if (cost < dp[i][j]) {
          dp[i][j] = cost
          split[i][j] = k
        }
      }
    }
  }
  return dp[0][n - 1]
}

console.log(matrixChainOrder([10, 20, 30, 40, 30])) // 30000
// Fill bottom-up by chain length — guaranteed all dependencies computed first!`} />
        )}
        {approach === 'dp' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n³) time, O(n²) space
def matrix_chain_order(p):
    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    split = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k

    return dp[0][n - 1]

print(matrix_chain_order([10, 20, 30, 40, 30]))  # 30000
# Fill bottom-up by chain length — guaranteed all dependencies computed first!`} />
        )}
        {approach === 'dp' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n³) time, O(n²) space
public class MCM {
    public static int matrixChainOrder(int[] p) {
        int n = p.length - 1;
        int[][] dp = new int[n][n];
        int[][] split = new int[n][n];

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i < n - len + 1; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        split[i][j] = k;
                    }
                }
            }
        }
        return dp[0][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(matrixChainOrder(new int[]{10, 20, 30, 40, 30})); // 30000
    }
}
// Fill bottom-up by chain length — guaranteed all dependencies computed first!`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Setup</strong>
              <p>
                Given matrices M<sub>1</sub>, M<sub>2</sub>, ..., M<sub>n</sub> with dimensions p<sub>0</sub>×p<sub>1</sub>, p<sub>1</sub>×p<sub>2</sub>, ..., p<sub>n-1</sub>×p<sub>n</sub>.
                Find the parenthesization that minimizes total scalar multiplications.
              </p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP Definition</strong>
              <p><code>dp[i][j]</code> = minimum multiplications to compute product of M<sub>i</sub> through M<sub>j</sub></p>
              <p><code>split[i][j]</code> = optimal split point (which matrix group merges first)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>DP Recurrence</strong>
              <p><code>dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i] × p[k+1] × p[j+1])</code> for all k in [i, j)</p>
              <p><strong>Cost of multiplying two groups:</strong> (rows of left) × (shared middle) × (cols of right) = p[i] × p[k+1] × p[j+1]</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Tabulation Order</strong>
              <p>Compute by chain length: length=1 (base), length=2, length=3, ..., length=n</p>
              <p>Ensures all subproblems are solved before use.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Complexity</strong>
              <p><strong>Time:</strong> O(n³) — three nested loops for length, i, and k</p>
              <p><strong>Space:</strong> O(n²) — DP table storing results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Interval DP:</strong> MCM is a classic "interval DP" problem — solve by subproblem chain length</li>
          <li><strong>Not about math:</strong> You don't actually multiply matrices; count scalar operations only</li>
          <li><strong>Problem breakdown:</strong> Split a large chain into two smaller chains, then multiply results</li>
          <li><strong>Cost formula:</strong> Multiplying matrix A(p×q) with B(q×r) costs p×q×r scalar multiplications</li>
          <li><strong>Similar problems:</strong> Burst Balloons (LC 312), Minimum Cost to Cut (LC 1547) use similar interval DP logic</li>
          <li><strong>Memoization vs Tabulation:</strong> Both O(n³), but tabulation more cache-friendly and easier to reconstruct solution</li>
        </ul>
      </div>

      {/* Practice */}
      <div className="card">
        <h2>🎯 Practice Problems — Matrix Chain Multiplication & Interval DP</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   SUBSEQUENCES PATTERN (Pick / Don't Pick)
   ════════════════════════════════════════════════════════════════════════════ */
function SubsequencesPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Problem: Count subsequences with target sum
  const arr = [1, 1, 1, 2]
  const target = 2

  const subseqProblems = [
    {
      id: 'lc494',
      title: 'LC 494. Target Sum',
      description: 'Partition array into + and - sets to achieve target. Classic pick/don\'t pick DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/target-sum/description/',
      topics: ['DP', 'Subsequence', 'Partition'],
    },
    {
      id: 'lc39',
      title: 'LC 39. Combination Sum',
      description: 'Find all unique combinations that sum to target. Pick/reuse elements.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/combination-sum/description/',
      topics: ['DP', 'Backtracking', 'Subsequence'],
    },
    {
      id: 'lc40',
      title: 'LC 40. Combination Sum II',
      description: 'Combination sum with duplicates and no-reuse constraint.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/combination-sum-ii/description/',
      topics: ['DP', 'Backtracking', 'Subsequence'],
    },
    {
      id: 'lc377',
      title: 'LC 377. Combination Sum IV',
      description: 'Count ordered combinations (permutations) that sum to target.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/combination-sum-iv/description/',
      topics: ['DP', 'Subsequence'],
    },
    {
      id: 'lc518',
      title: 'LC 518. Coin Change II',
      description: 'Count ways to make amount using coins — classic unbounded subsequence DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/coin-change-ii/description/',
      topics: ['DP', 'Subsequence', 'Unbounded'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-subsequences', subseqProblems, user?.uid)

  /* ── Recursion ────────────────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const countSubseq = (idx, sum, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, idx, sum, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, idx, sum, depth, parentId, callStack: calls.map(c => ({ ...c })) })

      // Base cases
      if (sum === 0) {
        calls[id].resolved = true
        calls[id].value = 1
        steps.push({ type: 'return', id, idx, sum, value: 1, depth, callStack: calls.map(c => ({ ...c })) })
        return 1
      }

      if (idx >= arr.length || sum < 0) {
        calls[id].resolved = true
        calls[id].value = 0
        steps.push({ type: 'return', id, idx, sum, value: 0, depth, callStack: calls.map(c => ({ ...c })) })
        return 0
      }

      // Pick current element
      const pick = countSubseq(idx + 1, sum - arr[idx], depth + 1, id)
      // Don't pick current element
      const notPick = countSubseq(idx + 1, sum, depth + 1, id)
      
      const result = pick + notPick
      calls[id].resolved = true
      calls[id].value = result
      steps.push({ type: 'return', id, idx, sum, value: result, depth, callStack: calls.map(c => ({ ...c })) })
      return result
    }

    const result = countSubseq(0, target)
    return { result, steps }
  }

  /* ── Memoization ──────────────────────────────────────────────────── */
  const computeMemoization = () => {
    const steps = []
    const memo = {}

    const countSubseq = (idx, sum) => {
      if (sum === 0) {
        steps.push({ type: 'base', idx, sum, value: 1, memo: { ...memo } })
        return 1
      }

      if (idx >= arr.length || sum < 0) {
        steps.push({ type: 'base', idx, sum, value: 0, memo: { ...memo } })
        return 0
      }

      const key = `${idx},${sum}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', idx, sum, value: memo[key], memo: { ...memo } })
        return memo[key]
      }

      steps.push({ type: 'compute', idx, sum, memo: { ...memo } })
      const pick = countSubseq(idx + 1, sum - arr[idx])
      const notPick = countSubseq(idx + 1, sum)
      memo[key] = pick + notPick
      steps.push({ type: 'store', idx, sum, value: memo[key], memo: { ...memo } })
      return memo[key]
    }

    const result = countSubseq(0, target)
    return { result, steps, memo }
  }

  /* ── Tabulation ───────────────────────────────────────────────────── */
  const computeTabulation = () => {
    const steps = []
    const n = arr.length
    const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(0))

    // Base: sum = 0 with any number of elements
    for (let i = 0; i <= n; i++) {
      dp[i][0] = 1
    }
    steps.push({ table: dp.map(r => [...r]), filled: 0, message: 'Base: dp[i][0] = 1 for all i' })

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let s = 0; s <= target; s++) {
        steps.push({
          i, s,
          table: dp.map(r => [...r]),
          message: `Compute dp[${i}][${s}]...`,
        })

        // Don't pick arr[i-1]
        dp[i][s] = dp[i - 1][s]

        // Pick arr[i-1] if possible
        if (s >= arr[i - 1]) {
          dp[i][s] += dp[i - 1][s - arr[i - 1]]
        }

        steps.push({
          i, s,
          table: dp.map(r => [...r]),
          value: dp[i][s],
          element: arr[i - 1],
          message: `dp[${i}][${s}] = ${dp[i][s]} (element: ${arr[i - 1]})`,
        })
      }
    }

    return { result: dp[n][target], steps, table: dp }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memoization') {
        data = computeMemoization()
      } else {
        data = computeTabulation()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('Subsequences computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Pick/Don't Pick DP</h2>
          <ul>
            <li>At each step, choose to <strong>include</strong> or <strong>exclude</strong> current element</li>
            <li>Problem shows <strong>overlapping subproblems</strong> across different decisions</li>
            <li>Problems: Target Sum, Combination Sum, Coin Change, Subset Sum, Partition Equal Subset</li>
            <li>State: <code>dp[i][s]</code> = answer using first i elements with constraint s</li>
            <li>Transition: Combine pick and don't-pick branches</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> For each element, decide pick or not. Combine both results to get final answer.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {approach === 'recursion' ? 'O(2ⁿ)' : 'O(n·sum)'}</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(n) — recursion depth' : approach === 'memoization' ? 'O(n·sum) — memo' : 'O(n·sum) — DP table'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoization', time: 'O(n·sum)', space: 'O(n·sum)' }, { name: 'Tabulation', time: 'O(n·sum)', space: 'O(n·sum)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Count Subsequences with Sum = {target}</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memoization', label: '💾 Memoization (Top-Down)' }, { id: 'tabulation', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title={`Subsequence DP — Array: [${arr.join(', ')}], Target: ${target}`}>
          {approach === 'recursion' && <SubseqRecursionVisualizer arr={arr} visualization={visualization} />}
          {approach === 'memoization' && <SubseqMemoVisualizer arr={arr} target={target} visualization={visualization} />}
          {approach === 'tabulation' && <SubseqTableVisualizer arr={arr} target={target} visualization={visualization} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Result: <strong style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{result !== null ? result : '—'}</strong> subsequences
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memoization', label: '💾 Memoization (Top-Down)' }, { id: 'tabulation', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Exponential — O(2^n) — picking or not picking each element
function countSubsequences(arr, target) {
  function count(idx, sum) {
    if (sum === 0) return 1  // Found valid subsequence
    if (idx >= arr.length || sum < 0) return 0  // Invalid state
    
    // Pick current element
    const pick = count(idx + 1, sum - arr[idx])
    // Don't pick current element
    const notPick = count(idx + 1, sum)
    
    return pick + notPick
  }
  
  return count(0, target)
}

console.log(countSubsequences([1, 1, 1, 2], 2))  // 3`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Exponential — O(2^n) — picking or not picking each element
def count_subsequences(arr, target):
    def count(idx, sum_left):
        if sum_left == 0:
            return 1  # Found valid subsequence
        if idx >= len(arr) or sum_left < 0:
            return 0  # Invalid state
        
        # Pick current element
        pick = count(idx + 1, sum_left - arr[idx])
        # Don't pick current element
        not_pick = count(idx + 1, sum_left)
        
        return pick + not_pick
    
    return count(0, target)

print(count_subsequences([1, 1, 1, 2], 2))  # 3`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Exponential — O(2^n) — picking or not picking each element
public class Subsequences {
    public static int countSubsequences(int[] arr, int target) {
        return count(arr, 0, target);
    }
    
    static int count(int[] arr, int idx, int sum) {
        if (sum == 0) return 1;  // Found valid subsequence
        if (idx >= arr.length || sum < 0) return 0;  // Invalid state
        
        // Pick current element
        int pick = count(arr, idx + 1, sum - arr[idx]);
        // Don't pick current element
        int notPick = count(arr, idx + 1, sum);
        
        return pick + notPick;
    }
    
    public static void main(String[] args) {
        System.out.println(countSubsequences(new int[]{1, 1, 1, 2}, 2));  // 3
    }
}`} />
        )}

        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(n·sum) time, O(n·sum) space
function countSubsequences(arr, target) {
  const memo = {}
  
  function count(idx, sum) {
    if (sum === 0) return 1
    if (idx >= arr.length || sum < 0) return 0
    
    const key = \`\${idx},\${sum}\`
    if (key in memo) return memo[key]
    
    // Pick current element
    const pick = count(idx + 1, sum - arr[idx])
    // Don't pick current element
    const notPick = count(idx + 1, sum)
    
    return memo[key] = pick + notPick
  }
  
  return count(0, target)
}

console.log(countSubsequences([1, 1, 1, 2], 2))  // 3`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(n·sum) time, O(n·sum) space
def count_subsequences(arr, target):
    memo = {}
    
    def count(idx, sum_left):
        if sum_left == 0:
            return 1
        if idx >= len(arr) or sum_left < 0:
            return 0
        
        key = (idx, sum_left)
        if key in memo:
            return memo[key]
        
        # Pick current element
        pick = count(idx + 1, sum_left - arr[idx])
        # Don't pick current element
        not_pick = count(idx + 1, sum_left)
        
        memo[key] = pick + not_pick
        return memo[key]
    
    return count(0, target)

print(count_subsequences([1, 1, 1, 2], 2))  # 3`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(n·sum) time, O(n·sum) space
import java.util.HashMap;
import java.util.Map;

public class Subsequences {
    static Map<String, Integer> memo = new HashMap<>();
    
    public static int countSubsequences(int[] arr, int target) {
        memo.clear();
        return count(arr, 0, target);
    }
    
    static int count(int[] arr, int idx, int sum) {
        if (sum == 0) return 1;
        if (idx >= arr.length || sum < 0) return 0;
        
        String key = idx + "," + sum;
        if (memo.containsKey(key)) return memo.get(key);
        
        int pick = count(arr, idx + 1, sum - arr[idx]);
        int notPick = count(arr, idx + 1, sum);
        
        memo.put(key, pick + notPick);
        return memo.get(key);
    }
    
    public static void main(String[] args) {
        System.out.println(countSubsequences(new int[]{1, 1, 1, 2}, 2));  // 3
    }
}`} />
        )}

        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(n·sum) time, O(n·sum) space
function countSubsequences(arr, target) {
  const n = arr.length
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(0))
  
  // Base: sum = 0 is always possible (pick nothing)
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1
  }
  
  // Fill table: for each element and each sum
  for (let i = 1; i <= n; i++) {
    for (let s = 0; s <= target; s++) {
      // Don't pick arr[i-1]
      dp[i][s] = dp[i - 1][s]
      
      // Pick arr[i-1] if possible
      if (s >= arr[i - 1]) {
        dp[i][s] += dp[i - 1][s - arr[i - 1]]
      }
    }
  }
  
  return dp[n][target]
}

console.log(countSubsequences([1, 1, 1, 2], 2))  // 3`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(n·sum) time, O(n·sum) space
def count_subsequences(arr, target):
    n = len(arr)
    dp = [[0] * (target + 1) for _ in range(n + 1)]
    
    # Base: sum = 0 is always possible (pick nothing)
    for i in range(n + 1):
        dp[i][0] = 1
    
    # Fill table: for each element and each sum
    for i in range(1, n + 1):
        for s in range(target + 1):
            # Don't pick arr[i-1]
            dp[i][s] = dp[i - 1][s]
            
            # Pick arr[i-1] if possible
            if s >= arr[i - 1]:
                dp[i][s] += dp[i - 1][s - arr[i - 1]]
    
    return dp[n][target]

print(count_subsequences([1, 1, 1, 2], 2))  # 3`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(n·sum) time, O(n·sum) space
public class Subsequences {
    public static int countSubsequences(int[] arr, int target) {
        int n = arr.length;
        int[][] dp = new int[n + 1][target + 1];
        
        // Base: sum = 0 is always possible (pick nothing)
        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1;
        }
        
        // Fill table: for each element and each sum
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s <= target; s++) {
                // Don't pick arr[i-1]
                dp[i][s] = dp[i - 1][s];
                
                // Pick arr[i-1] if possible
                if (s >= arr[i - 1]) {
                    dp[i][s] += dp[i - 1][s - arr[i - 1]];
                }
            }
        }
        
        return dp[n][target];
    }
    
    public static void main(String[] args) {
        System.out.println(countSubsequences(new int[]{1, 1, 1, 2}, 2));  // 3
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Definition</strong>
              <p>Given array and target sum, count ways to pick elements that sum to target.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP State</strong>
              <p><code>dp[i][s]</code> = number of subsequences using first i elements with remaining sum s</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>DP Recurrence</strong>
              <p><code>dp[i][s] = dp[i-1][s] + dp[i-1][s-arr[i]]</code> (don't pick + pick)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Base Case</strong>
              <p><code>dp[i][0] = 1</code> for all i (one way to make sum 0: pick nothing)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Complexity</strong>
              <p><strong>Time:</strong> O(n·sum) — two nested loops, <strong>Space:</strong> O(n·sum) — 2D DP table</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Pick/Don't Pick Pattern:</strong> At each position, make independent choice to include or exclude</li>
          <li><strong>State definition:</strong> dp[i][...] tracks answer after deciding on first i elements</li>
          <li><strong>Transition:</strong> Combine results from both pick and don't-pick branches</li>
          <li><strong>Base case:</strong> Usually simple — 0 elements with constraint = 1 way or 0 ways</li>
          <li><strong>Similar problems:</strong> Coin Change (count ways), Number of Dice Rolls (count outcomes), Partition (subset sum)</li>
          <li><strong>Memoization key:</strong> Use (index, remaining_constraint) as key; always consider all parameters</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Pick/Don't Pick DP & Subsequences</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Subsequence Recursion Visualizer ─────────────────────────────────── */
function SubseqRecursionVisualizer({ arr, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `f(${c.idx},${c.sum})`,
    isBase: c.idx >= arr.length || c.sum === 0,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Calling <strong>f({step.idx},{step.sum})</strong> at depth {step.depth}</>}
        {step.type === 'return' && <>↩ f({step.idx},{step.sum}) returned <strong>{step.value}</strong></>}
      </div>

      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.id}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">f({c.idx},{c.sum})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Subsequence Memoization Visualizer ───────────────────────────────── */
function SubseqMemoVisualizer({ arr, target, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>f({step.idx},{step.sum})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored <strong>f({step.idx},{step.sum}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>f({step.idx},{step.sum}) = {step.value}</strong></>}
        {step.type === 'base'      && <>🟢 Base case — <strong>f({step.idx},{step.sum}) = {step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cached: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>({step.idx},{step.sum})</strong></span>
      </div>

      <div className="dp-memo-grid">
        {Array.from({ length: Math.min(arr.length + 1, 6) }, (_, i) => (
          Array.from({ length: Math.min(target + 1, 6) }, (_, j) => {
            const key = `${i},${j}`
            return (
              <div
                key={key}
                className={`dp-memo-cell ${key in memo ? 'filled' : ''} ${step.idx === i && step.sum === j ? 'active' : ''}`}
              >
                <span className="dp-memo-key">f({i},{j})</span>
                <span className="dp-memo-val">{key in memo ? memo[key] : '?'}</span>
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

/* ── Subsequence Tabulation Visualizer ────────────────────────────────── */
function SubseqTableVisualizer({ arr, target, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const table = step.table || []

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="dp-call-badge store">
        {step.message}
      </div>

      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.75rem', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid var(--color-border)', padding: '6px', background: 'var(--color-bg-darker)' }}>i \ s</th>
              {Array.from({ length: Math.min(target + 1, 8) }, (_, j) => (
                <th key={j} style={{ border: '1px solid var(--color-border)', padding: '6px', background: 'var(--color-bg-darker)', minWidth: '30px' }}>{j}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(0, Math.min(arr.length + 1, 6)).map((row, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid var(--color-border)', padding: '6px', fontWeight: 'bold', background: 'var(--color-bg-darker)' }}>
                  {i === 0 ? '-' : arr[i - 1]}
                </td>
                {row.slice(0, Math.min(target + 1, 8)).map((val, j) => (
                  <td
                    key={`${i},${j}`}
                    style={{
                      border: '1px solid var(--color-border)',
                      padding: '6px',
                      textAlign: 'center',
                      background: step.i === i && step.s === j ? 'var(--color-primary)' : i <= step.filled && j <= target ? 'var(--color-bg-darker)' : 'var(--color-bg-darkest)',
                      color: step.i === i && step.s === j ? 'white' : 'var(--color-text)',
                      fontWeight: step.i === i && step.s === j ? '700' : '400',
                    }}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   DP ON GRID PATTERN (Paths, Maximum Sum, etc.)
   ════════════════════════════════════════════════════════════════════════════ */
function GridPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Problem: Unique paths from top-left to bottom-right
  const grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
  const rows = grid.length
  const cols = grid[0].length

  const gridProblems = [
    {
      id: 'lc62',
      title: 'LC 62. Unique Paths',
      description: 'Count ways to reach bottom-right from top-left (right/down only).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/unique-paths/description/',
      topics: ['DP', 'Grid', 'Combinatorics'],
    },
    {
      id: 'lc63',
      title: 'LC 63. Unique Paths II',
      description: 'Count paths with obstacles — skip blocked cells.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/unique-paths-ii/description/',
      topics: ['DP', 'Grid'],
    },
    {
      id: 'lc64',
      title: 'LC 64. Minimum Path Sum',
      description: 'Find path with minimum sum from top-left to bottom-right.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/minimum-path-sum/description/',
      topics: ['DP', 'Grid', 'Optimization'],
    },
    {
      id: 'lc120',
      title: 'LC 120. Triangle',
      description: 'Find minimum path sum in a triangle (move to adjacent from top to bottom).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/triangle/description/',
      topics: ['DP', 'Grid', 'Triangle'],
    },
    {
      id: 'lc741',
      title: 'LC 741. Cherry Pickup',
      description: 'Pick cherries from grid going down, return up. Advanced 2D DP.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/cherry-pickup/description/',
      topics: ['DP', 'Grid', '2D'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-grid', gridProblems, user?.uid)

  /* ── Recursion ────────────────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const countPaths = (r, c, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, r, c, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, r, c, depth, parentId, callStack: calls.map(x => ({ ...x })) })

      // Base cases
      if (r < 0 || c < 0 || r >= rows || c >= cols) {
        calls[id].resolved = true
        calls[id].value = 0
        steps.push({ type: 'return', id, r, c, value: 0, depth, callStack: calls.map(x => ({ ...x })) })
        return 0
      }

      if (r === rows - 1 && c === cols - 1) {
        calls[id].resolved = true
        calls[id].value = 1
        steps.push({ type: 'return', id, r, c, value: 1, depth, callStack: calls.map(x => ({ ...x })) })
        return 1
      }

      // Move right or down
      const right = countPaths(r, c + 1, depth + 1, id)
      const down = countPaths(r + 1, c, depth + 1, id)
      
      const result = right + down
      calls[id].resolved = true
      calls[id].value = result
      steps.push({ type: 'return', id, r, c, value: result, depth, callStack: calls.map(x => ({ ...x })) })
      return result
    }

    const result = countPaths(0, 0)
    return { result, steps }
  }

  /* ── Memoization ──────────────────────────────────────────────────── */
  const computeMemoization = () => {
    const steps = []
    const memo = {}

    const countPaths = (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) {
        steps.push({ type: 'base', r, c, value: 0, memo: { ...memo } })
        return 0
      }

      if (r === rows - 1 && c === cols - 1) {
        steps.push({ type: 'base', r, c, value: 1, memo: { ...memo } })
        return 1
      }

      const key = `${r},${c}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', r, c, value: memo[key], memo: { ...memo } })
        return memo[key]
      }

      steps.push({ type: 'compute', r, c, memo: { ...memo } })
      const right = countPaths(r, c + 1)
      const down = countPaths(r + 1, c)
      memo[key] = right + down
      steps.push({ type: 'store', r, c, value: memo[key], memo: { ...memo } })
      return memo[key]
    }

    const result = countPaths(0, 0)
    return { result, steps, memo }
  }

  /* ── Tabulation ───────────────────────────────────────────────────── */
  const computeTabulation = () => {
    const steps = []
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0))

    // Initialize
    dp[rows - 1][cols - 1] = 1
    steps.push({ table: dp.map(r => [...r]), message: 'Base: dp[m-1][n-1] = 1 (destination)' })

    // Fill from bottom-right to top-left
    for (let r = rows - 1; r >= 0; r--) {
      for (let c = cols - 1; c >= 0; c--) {
        if (r === rows - 1 && c === cols - 1) continue

        steps.push({
          r, c,
          table: dp.map(x => [...x]),
          message: `Compute dp[${r}][${c}]...`,
        })

        // Paths from right + paths from down
        const fromRight = c + 1 < cols ? dp[r][c + 1] : 0
        const fromDown = r + 1 < rows ? dp[r + 1][c] : 0
        dp[r][c] = fromRight + fromDown

        steps.push({
          r, c,
          table: dp.map(x => [...x]),
          value: dp[r][c],
          message: `dp[${r}][${c}] = ${fromRight} (right) + ${fromDown} (down) = ${dp[r][c]}`,
        })
      }
    }

    return { result: dp[0][0], steps, table: dp }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memoization') {
        data = computeMemoization()
      } else {
        data = computeTabulation()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('Grid computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Grid DP</h2>
          <ul>
            <li>Navigate 2D grid with movement rules (right/down, 4-directions, etc.)</li>
            <li>Count paths, find minimum/maximum sum, pick/avoid cells</li>
            <li>State: <code>dp[r][c]</code> = answer considering cell (r,c)</li>
            <li>Transitions depend on <strong>adjacent cells</strong> (up, down, left, right)</li>
            <li>Problems: Unique Paths, Min Path Sum, Cherry Pickup, Best Time to Buy Stock IV</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> At each cell, combine results from reachable neighbors with transitions.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> {approach === 'recursion' ? 'O(2^(m+n))' : 'O(m·n)'}</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(m+n) — recursion depth' : approach === 'memoization' ? 'O(m·n) — memo' : 'O(m·n) — DP table'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m+n)' }, { name: 'Memoization', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Tabulation', time: 'O(m·n)', space: 'O(m·n)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Unique Paths in {rows}×{cols} Grid</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memoization', label: '💾 Memoization (Top-Down)' }, { id: 'tabulation', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title={`Grid DP — {${rows}×${cols}} grid (move right or down)`}>
          {approach === 'recursion' && <GridRecursionVisualizer rows={rows} cols={cols} visualization={visualization} />}
          {approach === 'memoization' && <GridMemoVisualizer rows={rows} cols={cols} visualization={visualization} />}
          {approach === 'tabulation' && <GridTableVisualizer rows={rows} cols={cols} visualization={visualization} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Result: <strong style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{result !== null ? result : '—'}</strong> unique paths
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Naive)' }, { id: 'memoization', label: '💾 Memoization (Top-Down)' }, { id: 'tabulation', label: '📊 Tabulation (Bottom-Up)' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ❌ Exponential — O(2^(m+n)) — exploring all paths
function uniquePaths(m, n) {
  function countPaths(r, c) {
    // Out of bounds or invalid
    if (r < 0 || c < 0 || r >= m || c >= n) return 0
    
    // Reached destination
    if (r === m - 1 && c === n - 1) return 1
    
    // Move right or down
    return countPaths(r, c + 1) + countPaths(r + 1, c)
  }
  
  return countPaths(0, 0)
}

console.log(uniquePaths(3, 3))  // 6`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ❌ Exponential — O(2^(m+n)) — exploring all paths
def unique_paths(m, n):
    def count_paths(r, c):
        # Out of bounds or invalid
        if r < 0 or c < 0 or r >= m or c >= n:
            return 0
        
        # Reached destination
        if r == m - 1 and c == n - 1:
            return 1
        
        # Move right or down
        return count_paths(r, c + 1) + count_paths(r + 1, c)
    
    return count_paths(0, 0)

print(unique_paths(3, 3))  # 6`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ❌ Exponential — O(2^(m+n)) — exploring all paths
public class GridDP {
    public static int uniquePaths(int m, int n) {
        return countPaths(m, n, 0, 0);
    }
    
    static int countPaths(int m, int n, int r, int c) {
        // Out of bounds or invalid
        if (r < 0 || c < 0 || r >= m || c >= n) return 0;
        
        // Reached destination
        if (r == m - 1 && c == n - 1) return 1;
        
        // Move right or down
        return countPaths(m, n, r, c + 1) + countPaths(m, n, r + 1, c);
    }
    
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 3));  // 6
    }
}`} />
        )}

        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Top-Down Memoization — O(m·n) time, O(m·n) space
function uniquePaths(m, n) {
  const memo = {}
  
  function countPaths(r, c) {
    if (r < 0 || c < 0 || r >= m || c >= n) return 0
    if (r === m - 1 && c === n - 1) return 1
    
    const key = \`\${r},\${c}\`
    if (key in memo) return memo[key]
    
    memo[key] = countPaths(r, c + 1) + countPaths(r + 1, c)
    return memo[key]
  }
  
  return countPaths(0, 0)
}

console.log(uniquePaths(3, 3))  // 6`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Top-Down Memoization — O(m·n) time, O(m·n) space
def unique_paths(m, n):
    memo = {}
    
    def count_paths(r, c):
        if r < 0 or c < 0 or r >= m or c >= n:
            return 0
        if r == m - 1 and c == n - 1:
            return 1
        
        key = (r, c)
        if key in memo:
            return memo[key]
        
        memo[key] = count_paths(r, c + 1) + count_paths(r + 1, c)
        return memo[key]
    
    return count_paths(0, 0)

print(unique_paths(3, 3))  # 6`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Top-Down Memoization — O(m·n) time, O(m·n) space
import java.util.HashMap;
import java.util.Map;

public class GridDP {
    static Map<String, Integer> memo = new HashMap<>();
    
    public static int uniquePaths(int m, int n) {
        memo.clear();
        return countPaths(m, n, 0, 0);
    }
    
    static int countPaths(int m, int n, int r, int c) {
        if (r < 0 || c < 0 || r >= m || c >= n) return 0;
        if (r == m - 1 && c == n - 1) return 1;
        
        String key = r + "," + c;
        if (memo.containsKey(key)) return memo.get(key);
        
        int result = countPaths(m, n, r, c + 1) + countPaths(m, n, r + 1, c);
        memo.put(key, result);
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 3));  // 6
    }
}`} />
        )}

        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// ✅ Bottom-Up Tabulation — O(m·n) time, O(m·n) space
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => Array(n).fill(0))
  
  // Base: destination
  dp[m - 1][n - 1] = 1
  
  // Fill from bottom-right to top-left
  for (let r = m - 1; r >= 0; r--) {
    for (let c = n - 1; c >= 0; c--) {
      if (r === m - 1 && c === n - 1) continue
      
      // Paths from right + paths from down
      const fromRight = c + 1 < n ? dp[r][c + 1] : 0
      const fromDown = r + 1 < m ? dp[r + 1][c] : 0
      dp[r][c] = fromRight + fromDown
    }
  }
  
  return dp[0][0]
}

console.log(uniquePaths(3, 3))  // 6`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# ✅ Bottom-Up Tabulation — O(m·n) time, O(m·n) space
def unique_paths(m, n):
    dp = [[0] * n for _ in range(m)]
    
    # Base: destination
    dp[m - 1][n - 1] = 1
    
    # Fill from bottom-right to top-left
    for r in range(m - 1, -1, -1):
        for c in range(n - 1, -1, -1):
            if r == m - 1 and c == n - 1:
                continue
            
            # Paths from right + paths from down
            from_right = dp[r][c + 1] if c + 1 < n else 0
            from_down = dp[r + 1][c] if r + 1 < m else 0
            dp[r][c] = from_right + from_down
    
    return dp[0][0]

print(unique_paths(3, 3))  # 6`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// ✅ Bottom-Up Tabulation — O(m·n) time, O(m·n) space
public class GridDP {
    public static int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        
        // Base: destination
        dp[m - 1][n - 1] = 1;
        
        // Fill from bottom-right to top-left
        for (int r = m - 1; r >= 0; r--) {
            for (int c = n - 1; c >= 0; c--) {
                if (r == m - 1 && c == n - 1) continue;
                
                // Paths from right + paths from down
                int fromRight = c + 1 < n ? dp[r][c + 1] : 0;
                int fromDown = r + 1 < m ? dp[r + 1][c] : 0;
                dp[r][c] = fromRight + fromDown;
            }
        }
        
        return dp[0][0];
    }
    
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 3));  // 6
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Setup</strong>
              <p>2D grid m×n. Start at (0,0), move right or down, reach (m-1,n-1). Count total unique paths.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP State</strong>
              <p><code>dp[r][c]</code> = number of ways to reach (r,c) from (0,0)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">3</div>
            <div className="dp-step-body">
              <strong>Recurrence</strong>
              <p><code>dp[r][c] = dp[r-1][c] + dp[r][c-1]</code> (from top + from left)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Base Cases</strong>
              <p><code>dp[0][0] = 1</code> (starting point), entire first row = 1, entire first col = 1</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Complexity</strong>
              <p><strong>Time:</strong> O(m·n) — fill entire grid, <strong>Space:</strong> O(m·n) — DP table</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Grid indexing:</strong> Always check bounds (r,c) before accessing or computing</li>
          <li><strong>Direction priority:</strong> For top-down, process ancestors before dependents</li>
          <li><strong>Base cases:</strong> Usually entire first row/column (can reach via only one path)</li>
          <li><strong>Recurrence:</strong> Combine paths from reachable neighbors (up/left for forward DP)</li>
          <li><strong>Space optimization:</strong> For single-direction DP, reduce space from O(m·n) to O(n) using 1D array</li>
          <li><strong>Similar problems:</strong> Min Path Sum, Cherry Pickup, Dungeon Game, Maximum Path Sum Triangle</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Grid DP & 2D Traversal</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Grid Recursion Visualizer ────────────────────────────────────────── */
function GridRecursionVisualizer({ rows, cols, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `f(${c.r},${c.c})`,
    isBase: c.r >= rows || c.c >= cols || (c.r === rows - 1 && c.c === cols - 1),
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Calling <strong>f({step.r},{step.c})</strong> at depth {step.depth}</>}
        {step.type === 'return' && <>↩ f({step.r},{step.c}) returned <strong>{step.value}</strong></>}
      </div>

      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.id}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">f({c.r},{c.c})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Grid Memoization Visualizer ──────────────────────────────────────── */
function GridMemoVisualizer({ rows, cols, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>f({step.r},{step.c})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored <strong>f({step.r},{step.c}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>f({step.r},{step.c}) = {step.value}</strong></>}
        {step.type === 'base'      && <>🟢 Base case — <strong>f({step.r},{step.c}) = {step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cached: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>({step.r},{step.c})</strong></span>
      </div>

      <div className="dp-memo-grid">
        {Array.from({ length: rows }, (_, r) => (
          Array.from({ length: cols }, (_, c) => {
            const key = `${r},${c}`
            return (
              <div
                key={key}
                className={`dp-memo-cell ${key in memo ? 'filled' : ''} ${step.r === r && step.c === c ? 'active' : ''}`}
              >
                <span className="dp-memo-key">({r},{c})</span>
                <span className="dp-memo-val">{key in memo ? memo[key] : '?'}</span>
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

/* ── Grid Tabulation Visualizer ───────────────────────────────────────── */
function GridTableVisualizer({ rows, cols, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const table = step.table || []

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="dp-call-badge store">
        {step.message}
      </div>

      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            {table.map((rowData, r) => (
              <tr key={r}>
                {rowData.map((val, c) => (
                  <td
                    key={`${r},${c}`}
                    style={{
                      border: '1px solid var(--color-border)',
                      padding: '8px',
                      textAlign: 'center',
                      minWidth: '40px',
                      background: step.r === r && step.c === c ? 'var(--color-primary)' : 'var(--color-bg-darker)',
                      color: step.r === r && step.c === c ? 'white' : 'var(--color-text)',
                      fontWeight: step.r === r && step.c === c ? '700' : '400',
                    }}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
        {step.r !== undefined && step.c !== undefined && (
          <>
            &nbsp;·&nbsp; Current: ({step.r}, {step.c}) = <strong>{table[step.r]?.[step.c] ?? '—'}</strong>
          </>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   DP ON TREES PATTERN (Subtree Sum, Tree Diameter, etc.)
   ════════════════════════════════════════════════════════════════════════════ */
function TreesPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Sample tree structure
  const tree = {
    val: 10,
    left: { val: 5, left: { val: 3 }, right: { val: 7 } },
    right: { val: 15, left: { val: 12 }, right: { val: 20 } }
  }

  const treeProblems = [
    {
      id: 'lc104',
      title: 'LC 104. Maximum Depth of Binary Tree',
      description: 'Find the maximum depth (height) of a binary tree using DFS.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/description/',
      topics: ['DP', 'Tree', 'DFS'],
    },
    {
      id: 'lc543',
      title: 'LC 543. Diameter of Binary Tree',
      description: 'Find the diameter (longest path) in a binary tree.',
      difficulty: 'Easy',
      leetcodeLink: 'https://leetcode.com/problems/diameter-of-binary-tree/description/',
      topics: ['DP', 'Tree', 'DFS'],
    },
    {
      id: 'lc124',
      title: 'LC 124. Binary Tree Maximum Path Sum',
      description: 'Find maximum sum of any path in a binary tree using DP.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/description/',
      topics: ['DP', 'Tree', 'DFS'],
    },
    {
      id: 'lc337',
      title: 'LC 337. House Robber III',
      description: 'Rob houses (tree nodes) — can\'t rob adjacent. Pick or skip each node.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/house-robber-iii/description/',
      topics: ['DP', 'Tree', 'Pick/Skip'],
    },
    {
      id: 'lc1372',
      title: 'LC 1372. Longest Zigzag Path in Binary Tree',
      description: 'Find longest alternating left-right path using tree DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/description/',
      topics: ['DP', 'Tree', 'DFS'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-trees', treeProblems, user?.uid)

  /* ── Recursion ────────────────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const getMaxDepth = (node, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, node: node?.val, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, node: node?.val, depth, parentId, callStack: calls.map(c => ({ ...c })) })

      if (!node) {
        calls[id].resolved = true
        calls[id].value = 0
        steps.push({ type: 'return', id, node: null, value: 0, depth, callStack: calls.map(c => ({ ...c })) })
        return 0
      }

      // Compute depth of left and right subtrees
      const leftDepth = getMaxDepth(node.left, depth + 1, id)
      const rightDepth = getMaxDepth(node.right, depth + 1, id)
      const maxDepth = Math.max(leftDepth, rightDepth) + 1

      calls[id].resolved = true
      calls[id].value = maxDepth
      steps.push({ type: 'return', id, node: node.val, value: maxDepth, depth, callStack: calls.map(c => ({ ...c })) })
      return maxDepth
    }

    const result = getMaxDepth(tree)
    return { result, steps }
  }

  /* ── Memoization ──────────────────────────────────────────────────── */
  const computeMemoization = () => {
    const steps = []
    const memo = {}

    const getMaxDepth = (node) => {
      if (!node) {
        steps.push({ type: 'base', node: null, value: 0, memo: { ...memo } })
        return 0
      }

      const key = String(node.val)
      if (key in memo) {
        steps.push({ type: 'cache-hit', node: node.val, value: memo[key], memo: { ...memo } })
        return memo[key]
      }

      steps.push({ type: 'compute', node: node.val, memo: { ...memo } })
      const leftDepth = getMaxDepth(node.left)
      const rightDepth = getMaxDepth(node.right)
      memo[key] = Math.max(leftDepth, rightDepth) + 1
      steps.push({ type: 'store', node: node.val, value: memo[key], memo: { ...memo } })
      return memo[key]
    }

    const result = getMaxDepth(tree)
    return { result, steps, memo }
  }

  /* ── Tabulation (Post-order DFS) ───────────────────────────────── */
  const computeTabulation = () => {
    const steps = []
    const visited = {}

    const postOrder = (node) => {
      if (!node) return 0

      steps.push({ 
        type: 'visit',
        node: node.val,
        message: `Visiting node ${node.val}...`,
        visited: { ...visited }
      })

      const leftDepth = postOrder(node.left)
      const rightDepth = postOrder(node.right)
      const depth = Math.max(leftDepth, rightDepth) + 1

      visited[node.val] = depth
      steps.push({
        type: 'compute',
        node: node.val,
        value: depth,
        message: `Node ${node.val}: max(${leftDepth}, ${rightDepth}) + 1 = ${depth}`,
        visited: { ...visited }
      })

      return depth
    }

    const result = postOrder(tree)
    return { result, steps }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memoization') {
        data = computeMemoization()
      } else {
        data = computeTabulation()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('Trees computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Tree DP</h2>
          <ul>
            <li>Compute properties of a <strong>tree or subtree</strong> (height, diameter, sum, count)</li>
            <li>State: <code>dp[node]</code> = answer for subtree rooted at node</li>
            <li>Post-order traversal: Compute children first, then combine for parent</li>
            <li>Problems: Max Depth, Tree Diameter, Max Path Sum, House Robber III, Leaf Sum Paths</li>
            <li>Avoid recomputation: Memoize or use bottom-up post-order DFS</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> Solve for left subtree, solve for right subtree, combine results for current node.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> O(n) where n = number of nodes (all approaches visit each node)</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(h) — recursion depth (tree height)' : approach === 'memoization' ? 'O(n) — memo + call stack' : 'O(h) — call stack only'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(n)', space: 'O(h)' }, { name: 'Memoization', time: 'O(n)', space: 'O(n)' }, { name: 'Tabulation', time: 'O(n)', space: 'O(h)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Maximum Depth of Binary Tree</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (DFS)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 Post-order' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title="Tree DP — Binary Tree">
          {approach === 'recursion' && <TreeRecursionVisualizer visualization={visualization} />}
          {approach === 'memoization' && <TreeMemoVisualizer visualization={visualization} />}
          {approach === 'tabulation' && <TreePostOrderVisualizer visualization={visualization} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Result: <strong style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{result !== null ? result : '—'}</strong> (max depth)
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (DFS)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 Post-order' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Tree DP — Recursion (DFS) — O(n) time, O(h) space
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

function maxDepth(node) {
  // Base case: null node has depth 0
  if (!node) return 0
  
  // Recursively compute depths of left and right subtrees
  const leftDepth = maxDepth(node.left)
  const rightDepth = maxDepth(node.right)
  
  // Current node's depth is 1 + max of children
  return Math.max(leftDepth, rightDepth) + 1
}

// Tree:     10
//          /  \\
//         5    15
//        / \\  / \\
//       3  7 12 20
// Result: 3`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Tree DP — Recursion (DFS) — O(n) time, O(h) space
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(node):
    # Base case: null node has depth 0
    if not node:
        return 0
    
    # Recursively compute depths of left and right subtrees
    left_depth = max_depth(node.left)
    right_depth = max_depth(node.right)
    
    # Current node's depth is 1 + max of children
    return max(left_depth, right_depth) + 1

# Tree:     10
#          /  \\
#         5    15
#        / \\  / \\
#       3  7 12 20
# Result: 3`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Tree DP — Recursion (DFS) — O(n) time, O(h) space
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDP {
    public static int maxDepth(TreeNode node) {
        // Base case: null node has depth 0
        if (node == null) return 0;
        
        // Recursively compute depths of left and right subtrees
        int leftDepth = maxDepth(node.left);
        int rightDepth = maxDepth(node.right);
        
        // Current node's depth is 1 + max of children
        return Math.max(leftDepth, rightDepth) + 1;
    }
    
    public static void main(String[] args) {
        // Tree:     10
        //          /  \\
        //         5    15
        //        / \\  / \\
        //       3  7 12 20
        // Result: 3
    }
}`} />
        )}

        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Tree DP — Memoization — O(n) time, O(n) space
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

function maxDepth(node, memo = {}) {
  if (!node) return 0
  
  // Check memo using node's value as key
  if (node.val in memo) return memo[node.val]
  
  // Compute recursively
  const leftDepth = maxDepth(node.left, memo)
  const rightDepth = maxDepth(node.right, memo)
  
  // Store and return
  memo[node.val] = Math.max(leftDepth, rightDepth) + 1
  return memo[node.val]
}

// Note: For tree problems, memoization is rarely needed
// since each node is visited once. Standard recursion is enough.`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Tree DP — Memoization — O(n) time, O(n) space
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(node, memo=None):
    if memo is None:
        memo = {}
    
    if not node:
        return 0
    
    # Check memo using node's value as key
    if node.val in memo:
        return memo[node.val]
    
    # Compute recursively
    left_depth = max_depth(node.left, memo)
    right_depth = max_depth(node.right, memo)
    
    # Store and return
    memo[node.val] = max(left_depth, right_depth) + 1
    return memo[node.val]

# Note: For tree problems, memoization is rarely needed
# since each node is visited once. Standard recursion is enough.`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Tree DP — Memoization — O(n) time, O(n) space
import java.util.HashMap;
import java.util.Map;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDP {
    static Map<Integer, Integer> memo = new HashMap<>();
    
    public static int maxDepth(TreeNode node) {
        return maxDepthHelper(node, memo);
    }
    
    static int maxDepthHelper(TreeNode node, Map<Integer, Integer> memo) {
        if (node == null) return 0;
        
        if (memo.containsKey(node.val)) return memo.get(node.val);
        
        int leftDepth = maxDepthHelper(node.left, memo);
        int rightDepth = maxDepthHelper(node.right, memo);
        
        int result = Math.max(leftDepth, rightDepth) + 1;
        memo.put(node.val, result);
        return result;
    }
    
    public static void main(String[] args) {
        memo.clear();
        // Usage...
    }
}`} />
        )}

        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Tree DP — Post-order DFS (Bottom-Up) — O(n) time, O(h) space
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

function maxDepth(node) {
  // Post-order: Process children first, then current
  return postOrder(node)
}

function postOrder(node) {
  // Base case
  if (!node) return 0
  
  // Process LEFT subtree
  const leftDepth = postOrder(node.left)
  
  // Process RIGHT subtree
  const rightDepth = postOrder(node.right)
  
  // Process CURRENT node (combine results)
  return Math.max(leftDepth, rightDepth) + 1
}

// Tree structure is implicit in the recursion
// No explicit DP table needed — values computed on-the-fly`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Tree DP — Post-order DFS (Bottom-Up) — O(n) time, O(h) space
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(node):
    # Post-order: Process children first, then current
    return post_order(node)

def post_order(node):
    # Base case
    if not node:
        return 0
    
    # Process LEFT subtree
    left_depth = post_order(node.left)
    
    # Process RIGHT subtree
    right_depth = post_order(node.right)
    
    # Process CURRENT node (combine results)
    return max(left_depth, right_depth) + 1

# Tree structure is implicit in the recursion
# No explicit DP table needed — values computed on-the-fly`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Tree DP — Post-order DFS (Bottom-Up) — O(n) time, O(h) space
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDP {
    public static int maxDepth(TreeNode node) {
        // Post-order: Process children first, then current
        return postOrder(node);
    }
    
    static int postOrder(TreeNode node) {
        // Base case
        if (node == null) return 0;
        
        // Process LEFT subtree
        int leftDepth = postOrder(node.left);
        
        // Process RIGHT subtree
        int rightDepth = postOrder(node.right);
        
        // Process CURRENT node (combine results)
        return Math.max(leftDepth, rightDepth) + 1;
    }
    
    public static void main(String[] args) {
        // Tree structure is implicit in the recursion
        // No explicit DP table needed — values computed on-the-fly
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Setup</strong>
              <p>Given a binary tree, compute property (height, sum, diameter, etc.) efficiently using DP.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP State</strong>
              <p><code>dp[node]</code> = property value for subtree rooted at node</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-body">
              <strong>Example: Max Depth</strong>
              <p><code>dp[node] = max(dp[left], dp[right]) + 1</code> (combine children, add current)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Post-order Traversal</strong>
              <p>Always compute children BEFORE parent (dependencies satisfied first)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Complexity</strong>
              <p><strong>Time:</strong> O(n) — visit each node once, <strong>Space:</strong> O(h) — recursion stack depth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Post-order:</strong> Always process left subtree, then right, then current node</li>
          <li><strong>Base case:</strong> Null node usually returns 0 (no height, no sum, no path)</li>
          <li><strong>Combination:</strong> Merge results from left and right subtrees (max, min, sum, etc.)</li>
          <li><strong>No memoization needed:</strong> Tree is acyclic — each node visited exactly once</li>
          <li><strong>Space:</strong> Recursion depth = tree height (h), not n nodes</li>
          <li><strong>Similar problems:</strong> Max/Min Depth, Tree Diameter, Max Path Sum, House Robber III, Count Paths</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Tree DP & Subtree Properties</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Tree Recursion Visualizer ────────────────────────────────────────── */
function TreeRecursionVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `f(${c.node ?? 'null'})`,
    isBase: c.node === null,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Calling <strong>f({step.node ?? 'null'})</strong> at depth {step.depth}</>}
        {step.type === 'return' && <>↩ f({step.node ?? 'null'}) returned <strong>{step.value}</strong></>}
      </div>

      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.id}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">f({c.node ?? 'null'})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Tree Memoization Visualizer ──────────────────────────────────────── */
function TreeMemoVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>f({step.node})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored <strong>f({step.node}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>f({step.node}) = {step.value}</strong></>}
        {step.type === 'base'      && <>🟢 Base case — <strong>f(null) = {step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cached nodes: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>node {step.node}</strong></span>
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Memo Table:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(memo).map(([key, val]) => (
            <div key={key} className={`dp-memo-cell ${step.node === parseInt(key) ? 'active' : ''}`} style={{ flex: '0 1 60px' }}>
              <span className="dp-memo-key">f({key})</span>
              <span className="dp-memo-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Tree Post-order Visualizer ───────────────────────────────────────── */
function TreePostOrderVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const visited = step.visited || {}

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className="dp-call-badge store">
        {step.message}
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontWeight: '600' }}>Post-order Traversal Order:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(visited).map(([node, depth], idx) => (
            <div
              key={node}
              style={{
                padding: '8px 12px',
                background: step.node === parseInt(node) ? 'var(--color-primary)' : 'var(--color-bg-darker)',
                color: step.node === parseInt(node) ? 'white' : 'var(--color-text)',
                borderRadius: '4px',
                border: `1px solid var(--color-border)`,
                fontWeight: step.node === parseInt(node) ? '700' : '400',
              }}
            >
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Node {node}</div>
              <div style={{ fontSize: '0.9rem' }}>Depth: {depth}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   DP ON GRAPHS PATTERN (Shortest Path, Reachability, etc.)
   ════════════════════════════════════════════════════════════════════════════ */
function GraphsPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Sample graph: DAG shortest path
  const graph = {
    0: [{ to: 1, cost: 1 }, { to: 2, cost: 4 }],
    1: [{ to: 2, cost: 2 }, { to: 3, cost: 5 }],
    2: [{ to: 3, cost: 1 }],
    3: [],
  }
  const start = 0
  const end = 3

  const graphProblems = [
    {
      id: 'lc787',
      title: 'LC 787. Cheapest Flights Within K Stops',
      description: 'Find cheapest flight from A to B with at most K stops using DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/description/',
      topics: ['DP', 'Graph', 'Shortest Path'],
    },
    {
      id: 'lc1462',
      title: 'LC 1462. Course Schedule IV',
      description: 'Determine if a course is a prerequisite of another (graph reachability).',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/course-schedule-iv/description/',
      topics: ['DP', 'Graph', 'Reachability'],
    },
    {
      id: 'lc1642',
      title: 'LC 1642. Furthest Building You Can Reach',
      description: 'Reach furthest building with limited ladders/bricks using DP on graph.',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/furthest-building-you-can-reach/description/',
      topics: ['DP', 'Graph', 'Memo'],
    },
    {
      id: 'lc1632',
      title: 'LC 1632. Rank Transform of a Matrix',
      description: 'Assign ranks to matrix elements using DP on DAG (directed acyclic graph).',
      difficulty: 'Hard',
      leetcodeLink: 'https://leetcode.com/problems/rank-transform-of-a-matrix/description/',
      topics: ['DP', 'Graph', 'Topo Sort'],
    },
    {
      id: 'lc1696',
      title: 'LC 1696. Jump Game VI',
      description: 'Reach last index with minimum cost; model as graph shortest path.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/jump-game-vi/description/',
      topics: ['DP', 'Graph', 'Path'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-graphs', graphProblems, user?.uid)

  /* ── Recursion ────────────────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const shortestPath = (node, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, node, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'visit', id, node, depth, parentId, callStack: calls.map(c => ({ ...c })) })

      if (node === end) {
        calls[id].resolved = true
        calls[id].value = 0
        steps.push({ type: 'base', id, node, value: 0, message: `Base case: reached target node ${end}`, callStack: calls.map(c => ({ ...c })) })
        return 0
      }

      if (!graph[node] || graph[node].length === 0) {
        calls[id].resolved = true
        calls[id].value = Infinity
        steps.push({ type: 'return', id, node, value: Infinity, message: `No path from ${node}`, callStack: calls.map(c => ({ ...c })) })
        return Infinity
      }

      let minCost = Infinity
      for (const edge of graph[node]) {
        const pathCost = shortestPath(edge.to, depth + 1, id)
        const totalCost = edge.cost + pathCost
        if (totalCost < minCost) minCost = totalCost
      }

      calls[id].resolved = true
      calls[id].value = minCost
      steps.push({ type: 'return', id, node, value: minCost, message: `Shortest from ${node}: ${minCost}`, callStack: calls.map(c => ({ ...c })) })
      return minCost
    }

    const result = shortestPath(start)
    return { result: result === Infinity ? -1 : result, steps }
  }

  /* ── Memoization ──────────────────────────────────────────────────── */
  const computeMemoization = () => {
    const steps = []
    const memo = {}

    const shortestPath = (node) => {
      if (node === end) {
        steps.push({ type: 'base', node, value: 0, memo: { ...memo } })
        return 0
      }

      if (node in memo) {
        steps.push({ type: 'cache-hit', node, value: memo[node], memo: { ...memo } })
        return memo[node]
      }

      steps.push({ type: 'compute', node, memo: { ...memo } })

      if (!graph[node] || graph[node].length === 0) {
        memo[node] = Infinity
        steps.push({ type: 'store', node, value: Infinity, memo: { ...memo } })
        return Infinity
      }

      let minCost = Infinity
      for (const edge of graph[node]) {
        const pathCost = shortestPath(edge.to)
        minCost = Math.min(minCost, edge.cost + pathCost)
      }

      memo[node] = minCost
      steps.push({ type: 'store', node, value: minCost, memo: { ...memo } })
      return minCost
    }

    const result = shortestPath(start)
    return { result: result === Infinity ? -1 : result, steps, memo }
  }

  /* ── Tabulation (Topological Sort + DP) ────────────────────────── */
  const computeTabulation = () => {
    const steps = []
    const dp = {}
    const visited = new Set()
    const recStack = new Set()

    // Topological sort using DFS
    const topo = []
    const dfs = (node) => {
      visited.add(node)
      recStack.add(node)

      if (graph[node]) {
        for (const edge of graph[node]) {
          if (!visited.has(edge.to)) {
            dfs(edge.to)
          }
        }
      }

      topo.push(node)
      recStack.delete(node)
    }

    for (let i = 0; i <= 3; i++) {
      if (!visited.has(i)) dfs(i)
    }

    topo.reverse()
    steps.push({ type: 'topo', topo, message: `Topological order: ${topo.join(' → ')}` })

    // DP in topological order
    for (let i = 0; i <= 3; i++) dp[i] = Infinity
    dp[end] = 0
    steps.push({ type: 'init', dp: { ...dp }, message: 'Initialize: target=0, others=∞' })

    for (const u of topo) {
      if (dp[u] === Infinity) continue
      steps.push({ type: 'visit', node: u, dp: { ...dp }, message: `Processing node ${u}...` })

      if (graph[u]) {
        for (const edge of graph[u]) {
          if (dp[u] + edge.cost < dp[edge.to]) {
            dp[edge.to] = dp[u] + edge.cost
            steps.push({ type: 'update', node: edge.to, value: dp[edge.to], dp: { ...dp }, message: `Updated dp[${edge.to}] = ${dp[edge.to]}` })
          }
        }
      }
    }

    return { result: dp[start] === Infinity ? -1 : dp[start], steps }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memoization') {
        data = computeMemoization()
      } else {
        data = computeTabulation()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('Graphs computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Graph DP</h2>
          <ul>
            <li>Find <strong>shortest/longest path</strong> in a DAG (directed acyclic graph)</li>
            <li>Compute <strong>reachability</strong> or <strong>connectivity</strong> between nodes</li>
            <li>Combine path DP with graph traversal (DFS, BFS, topological sort)</li>
            <li>State: <code>dp[node]</code> = shortest distance, max value, or count of paths to node</li>
            <li>Problems: Shortest flight cost, Matrix rank, Course prerequisites, Jump game, Building reach</li>
            <li>Avoid cycles: Use DAGs or detect + handle cycles separately</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> Process nodes in dependency order (topological sort), compute DP values iteratively.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> O(V + E) or O(V·E) depending on approach where V = vertices, E = edges</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(V) — call stack (tree height in DAG)' : approach === 'memoization' ? 'O(V) — memo table + call stack' : 'O(V) — DP array only'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(V+E)', space: 'O(V)' }, { name: 'Memoization', time: 'O(V+E)', space: 'O(V)' }, { name: 'Tabulation', time: 'O(V+E)', space: 'O(V)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Shortest Path in DAG</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🔄 Recursion (DFS)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 Topological' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title="Graph DP — Shortest Path">
          {approach === 'recursion' && <GraphRecursionVisualizer visualization={visualization} />}
          {approach === 'memoization' && <GraphMemoVisualizer visualization={visualization} />}
          {approach === 'tabulation' && <GraphTopoVisualizer visualization={visualization} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Result: <strong style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{result !== null ? result : '—'}</strong> (shortest path cost from {start} to {end})
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🔄 Recursion (DFS)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 Topological' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Graph DP — Recursion (DFS) — O(V+E) time, O(V) space
const graph = {
  0: [{to: 1, cost: 1}, {to: 2, cost: 4}],
  1: [{to: 2, cost: 2}, {to: 3, cost: 5}],
  2: [{to: 3, cost: 1}],
  3: [],
}

function shortestPath(node, target, graph) {
  // Base case: reached target
  if (node === target) return 0
  
  // No path (dead end)
  if (!graph[node] || graph[node].length === 0) return Infinity
  
  // Try all neighbors, take minimum
  let minCost = Infinity
  for (const edge of graph[node]) {
    const pathCost = shortestPath(edge.to, target, graph)
    minCost = Math.min(minCost, edge.cost + pathCost)
  }
  return minCost
}

const result = shortestPath(0, 3, graph)
console.log(result) // Output: 4 (0→2→3)`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Graph DP — Recursion (DFS) — O(V+E) time, O(V) space
graph = {
    0: [{'to': 1, 'cost': 1}, {'to': 2, 'cost': 4}],
    1: [{'to': 2, 'cost': 2}, {'to': 3, 'cost': 5}],
    2: [{'to': 3, 'cost': 1}],
    3: [],
}

def shortest_path(node, target, graph):
    # Base case: reached target
    if node == target:
        return 0
    
    # No path (dead end)
    if node not in graph or len(graph[node]) == 0:
        return float('inf')
    
    # Try all neighbors, take minimum
    min_cost = float('inf')
    for edge in graph[node]:
        path_cost = shortest_path(edge['to'], target, graph)
        min_cost = min(min_cost, edge['cost'] + path_cost)
    return min_cost

result = shortest_path(0, 3, graph)
print(result)  # Output: 4 (0→2→3)`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Graph DP — Recursion (DFS) — O(V+E) time, O(V) space
import java.util.*;

class Edge {
    int to, cost;
    Edge(int to, int cost) { this.to = to; this.cost = cost; }
}

public class GraphDP {
    static Map<Integer, List<Edge>> graph = new HashMap<>();
    
    public static int shortestPath(int node, int target) {
        // Base case: reached target
        if (node == target) return 0;
        
        // No path (dead end)
        if (!graph.containsKey(node) || graph.get(node).isEmpty())
            return Integer.MAX_VALUE / 2;
        
        // Try all neighbors, take minimum
        int minCost = Integer.MAX_VALUE / 2;
        for (Edge edge : graph.get(node)) {
            int pathCost = shortestPath(edge.to, target);
            minCost = Math.min(minCost, edge.cost + pathCost);
        }
        return minCost;
    }
    
    public static void main(String[] args) {
        graph.put(0, Arrays.asList(new Edge(1, 1), new Edge(2, 4)));
        graph.put(1, Arrays.asList(new Edge(2, 2), new Edge(3, 5)));
        graph.put(2, Arrays.asList(new Edge(3, 1)));
        graph.put(3, new ArrayList<>());
        
        System.out.println(shortestPath(0, 3)); // Output: 4
    }
}`} />
        )}

        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Graph DP — Memoization (DFS + Memo) — O(V+E) time, O(V) space
const graph = {
  0: [{to: 1, cost: 1}, {to: 2, cost: 4}],
  1: [{to: 2, cost: 2}, {to: 3, cost: 5}],
  2: [{to: 3, cost: 1}],
  3: [],
}

function shortestPath(node, target, graph, memo = {}) {
  if (node === target) return 0
  
  // Check cache
  if (node in memo) return memo[node]
  
  if (!graph[node] || graph[node].length === 0)
    return memo[node] = Infinity
  
  // Compute recursively
  let minCost = Infinity
  for (const edge of graph[node]) {
    const pathCost = shortestPath(edge.to, target, graph, memo)
    minCost = Math.min(minCost, edge.cost + pathCost)
  }
  
  // Store and return
  return memo[node] = minCost
}

const memo = {}
const result = shortestPath(0, 3, graph, memo)
console.log(result)    // Output: 4
console.log(memo)      // {1: 6, 2: 1, 3: 0, 0: 4}`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Graph DP — Memoization (DFS + Memo) — O(V+E) time, O(V) space
graph = {
    0: [{'to': 1, 'cost': 1}, {'to': 2, 'cost': 4}],
    1: [{'to': 2, 'cost': 2}, {'to': 3, 'cost': 5}],
    2: [{'to': 3, 'cost': 1}],
    3: [],
}

def shortest_path(node, target, graph, memo=None):
    if memo is None:
        memo = {}
    
    if node == target:
        return 0
    
    # Check cache
    if node in memo:
        return memo[node]
    
    if node not in graph or len(graph[node]) == 0:
        return memo.setdefault(node, float('inf'))
    
    # Compute recursively
    min_cost = float('inf')
    for edge in graph[node]:
        path_cost = shortest_path(edge['to'], target, graph, memo)
        min_cost = min(min_cost, edge['cost'] + path_cost)
    
    # Store and return
    memo[node] = min_cost
    return min_cost

memo = {}
result = shortest_path(0, 3, graph, memo)
print(result)   # Output: 4
print(memo)     # {1: 6, 2: 1, 3: 0, 0: 4}`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Graph DP — Memoization (DFS + Memo) — O(V+E) time, O(V) space
import java.util.*;

class Edge {
    int to, cost;
    Edge(int to, int cost) { this.to = to; this.cost = cost; }
}

public class GraphDP {
    static Map<Integer, List<Edge>> graph = new HashMap<>();
    static Map<Integer, Integer> memo = new HashMap<>();
    
    public static int shortestPath(int node, int target) {
        if (node == target) return 0;
        
        if (memo.containsKey(node))
            return memo.get(node);
        
        if (!graph.containsKey(node) || graph.get(node).isEmpty()) {
            memo.put(node, Integer.MAX_VALUE / 2);
            return Integer.MAX_VALUE / 2;
        }
        
        int minCost = Integer.MAX_VALUE / 2;
        for (Edge edge : graph.get(node)) {
            int pathCost = shortestPath(edge.to, target);
            minCost = Math.min(minCost, edge.cost + pathCost);
        }
        
        memo.put(node, minCost);
        return minCost;
    }
    
    public static void main(String[] args) {
        graph.put(0, Arrays.asList(new Edge(1, 1), new Edge(2, 4)));
        graph.put(1, Arrays.asList(new Edge(2, 2), new Edge(3, 5)));
        graph.put(2, Arrays.asList(new Edge(3, 1)));
        graph.put(3, new ArrayList<>());
        
        System.out.println(shortestPath(0, 3)); // Output: 4
    }
}`} />
        )}

        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Graph DP — Tabulation (Topological Sort) — O(V+E) time, O(V) space
function shortestPathDAG(graph, start, end, numNodes) {
  // Step 1: Topological sort (DFS-based)
  const visited = new Set()
  const topo = []
  
  const dfs = (node) => {
    visited.add(node)
    if (graph[node]) {
      for (const edge of graph[node]) {
        if (!visited.has(edge.to)) dfs(edge.to)
      }
    }
    topo.push(node)
  }
  
  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i)) dfs(i)
  }
  topo.reverse()  // Reverse for processing order
  
  // Step 2: Initialize DP
  const dp = Array(numNodes).fill(Infinity)
  dp[end] = 0
  
  // Step 3: Process in topological order
  for (const u of topo) {
    if (dp[u] === Infinity) continue
    if (graph[u]) {
      for (const edge of graph[u]) {
        dp[edge.to] = Math.min(dp[edge.to], dp[u] + edge.cost)
      }
    }
  }
  
  return dp[start] === Infinity ? -1 : dp[start]
}

const graph = {/* ... */}
const result = shortestPathDAG(graph, 0, 3, 4)
console.log(result) // Output: 4`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Graph DP — Tabulation (Topological Sort) — O(V+E) time, O(V) space
def shortest_path_dag(graph, start, end, num_nodes):
    # Step 1: Topological sort (DFS-based)
    visited = set()
    topo = []
    
    def dfs(node):
        visited.add(node)
        if node in graph:
            for edge in graph[node]:
                if edge['to'] not in visited:
                    dfs(edge['to'])
        topo.append(node)
    
    for i in range(num_nodes):
        if i not in visited:
            dfs(i)
    topo.reverse()  # Reverse for processing order
    
    # Step 2: Initialize DP
    dp = [float('inf')] * num_nodes
    dp[end] = 0
    
    # Step 3: Process in topological order
    for u in topo:
        if dp[u] == float('inf'):
            continue
        if u in graph:
            for edge in graph[u]:
                dp[edge['to']] = min(dp[edge['to']], dp[u] + edge['cost'])
    
    return -1 if dp[start] == float('inf') else dp[start]`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Graph DP — Tabulation (Topological Sort) — O(V+E) time, O(V) space
import java.util.*;

class Edge {
    int to, cost;
    Edge(int to, int cost) { this.to = to; this.cost = cost; }
}

public class GraphDP {
    static void dfs(int node, Map<Integer, List<Edge>> graph,
                    Set<Integer> visited, List<Integer> topo) {
        visited.add(node);
        if (graph.containsKey(node)) {
            for (Edge edge : graph.get(node)) {
                if (!visited.contains(edge.to)) {
                    dfs(edge.to, graph, visited, topo);
                }
            }
        }
        topo.add(node);
    }
    
    public static int shortestPath(Map<Integer, List<Edge>> graph,
                                   int start, int end, int numNodes) {
        // Step 1: Topological sort
        Set<Integer> visited = new HashSet<>();
        List<Integer> topo = new ArrayList<>();
        
        for (int i = 0; i < numNodes; i++) {
            if (!visited.contains(i)) {
                dfs(i, graph, visited, topo);
            }
        }
        Collections.reverse(topo);
        
        // Step 2: Initialize DP
        int[] dp = new int[numNodes];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[end] = 0;
        
        // Step 3: Process in topological order
        for (int u : topo) {
            if (dp[u] == Integer.MAX_VALUE / 2) continue;
            if (graph.containsKey(u)) {
                for (Edge edge : graph.get(u)) {
                    dp[edge.to] = Math.min(dp[edge.to], dp[u] + edge.cost);
                }
            }
        }
        
        return dp[start] == Integer.MAX_VALUE / 2 ? -1 : dp[start];
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Setup</strong>
              <p>Given a DAG, find shortest (or longest) path from source to target efficiently.</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>DP State</strong>
              <p><code>dp[node]</code> = shortest distance from node to target (or shortest from source to node)</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-body">
              <strong>Recurrence</strong>
              <p><code>dp[u] = min(cost[u→v] + dp[v]) for all edges u→v</code></p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Processing Order</strong>
              <p>Use topological sort to ensure all dependencies processed before a node</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Why It Works</strong>
              <p>DAG property ensures no cycles; topological order guarantees correctness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>DAGs only:</strong> Graph DP requires no cycles (topological order requirement)</li>
          <li><strong>Topological sort:</strong> Essential for processing nodes in correct dependency order</li>
          <li><strong>Base case:</strong> Initialize target node as 0, all others as ∞ (or source as 0 for backward)</li>
          <li><strong>Recurrence:</strong> Combine edge cost + DP value of next node</li>
          <li><strong>Cycle detection:</strong> If graph has cycles, use Bellman-Ford or 0-1 BFS instead</li>
          <li><strong>Similar problems:</strong> Shortest flight cost, Matrix rank transform, Course schedule, Building reach</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Graph DP & Shortest Paths</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Graph Recursion Visualizer ───────────────────────────────────────── */
function GraphRecursionVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `f(${c.node})`,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'visit'  && <>📍 Visiting node <strong>{step.node}</strong></>}
        {step.type === 'base'   && <>🟢 Base case: <strong>node {step.node} (target)</strong> = {step.value}</>}
        {step.type === 'return' && <>↩ Node {step.node} returned <strong>{step.value}</strong></>}
      </div>

      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree treeNodes={treeNodes} activeNodeId={step.id} />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">f({c.node})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Graph Memoization Visualizer ────────────────────────────────────── */
function GraphMemoVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing <strong>f({step.node})</strong>…</>}
        {step.type === 'store'     && <>💾 Stored: <strong>f({step.node}) = {step.value}</strong></>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT — <strong>f({step.node}) = {step.value}</strong></>}
        {step.type === 'base'      && <>🟢 Base — <strong>f({step.node}) = {step.value}</strong></>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cached nodes: <strong>{Object.keys(memo).length}</strong></span>
        <span className="dp-saved">Current: <strong>node {step.node}</strong></span>
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Memo Table:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(memo).map(([key, val]) => (
            <div key={key} className={`dp-memo-cell ${step.node === parseInt(key) ? 'active' : ''}`} style={{ flex: '0 1 60px' }}>
              <span className="dp-memo-key">f({key})</span>
              <span className="dp-memo-val">{val === Infinity ? '∞' : val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Graph Topological Sort Visualizer ────────────────────────────────── */
function GraphTopoVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'update' ? 'store' : step.type === 'topo' ? 'call' : 'visit'}`}>
        {step.type === 'topo'   && <>🔄 Topological Sort: <strong>{step.topo?.join(' → ') || 'Sorting…'}</strong></>}
        {step.type === 'init'   && <>📌 Initialize: <strong>target=0, others=∞</strong></>}
        {step.type === 'visit'  && <>🔍 {step.message}</> }
        {step.type === 'update' && <>✏ {step.message}</> }
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontWeight: '600' }}>DP Values (Distance to Target):</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[0, 1, 2, 3].map(node => {
            const entries = Object.entries(step)
            let value = '∞'
            for (const [key, val] of entries) {
              if (key === 'dp' && typeof val === 'object' && node in val) {
                value = val[node] === Infinity ? '∞' : val[node]
              }
            }
            return (
              <div
                key={node}
                style={{
                  padding: '8px 12px',
                  background: 'var(--color-bg-darker)',
                  color: 'var(--color-text)',
                  borderRadius: '4px',
                  border: `2px solid var(--color-border)`,
                }}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Node {node}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>dp[{node}] = {value}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PARTITION PATTERN (Equal Subset Sum Partition)
   ════════════════════════════════════════════════════════════════════════════ */
function PartitionPattern() {
  const { user } = useContext(AuthContext)
  const [approach, setApproach] = useState('recursion')
  const [codeLang, setCodeLang] = useState('javascript')
  const [result, setResult] = useState(null)
  const { visualization, setVisualization, isPaused, setIsPaused,
          speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback(60)

  // Sample array for partition
  const array = [1, 5, 11, 5]
  const sumTarget = array.reduce((a, b) => a + b, 0) / 2

  const partitionProblems = [
    {
      id: 'lc416',
      title: 'LC 416. Partition Equal Subset Sum',
      description: 'Can we partition array into two equal sum subsets? Use subset sum DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/partition-equal-subset-sum/description/',
      topics: ['DP', 'Partition', 'Subset Sum'],
    },
    {
      id: 'lc1049',
      title: 'LC 1049. Last Stone Weight II',
      description: 'Minimize weight difference after stone collisions using partition DP.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/last-stone-weight-ii/description/',
      topics: ['DP', 'Partition', 'Min Diff'],
    },
    {
      id: 'lc698',
      title: 'LC 698. Partition to K Equal Sum Subsets',
      description: 'Partition into k equal sum subsets using DP + backtracking.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/description/',
      topics: ['DP', 'Partition', 'Backtrack'],
    },
    {
      id: 'lc2305',
      title: 'LC 2305. Fair Distribution of Cookies',
      description: 'Distribute cookies to k children to minimize max difference.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/fair-distribution-of-cookies/description/',
      topics: ['DP', 'Partition', 'Distribution'],
    },
    {
      id: 'lc473',
      title: 'LC 473. Matchsticks to Square',
      description: 'Use matchsticks to form square perimeter; partition into 4 equal sides.',
      difficulty: 'Medium',
      leetcodeLink: 'https://leetcode.com/problems/matchsticks-to-square/description/',
      topics: ['DP', 'Partition', 'Geometry'],
    },
  ]

  const { problems, handleSaveNote: handleSave } = useProblemNotes('dp-partition', partitionProblems, user?.uid)

  /* ── Recursion ────────────────────────────────────────────────────── */
  const computeRecursion = () => {
    const steps = []
    const calls = []
    let callId = 0

    const canPartition = (index, remaining, depth = 0, parentId = null) => {
      const id = callId++
      calls.push({ id, index, remaining, depth, parentId, resolved: false, value: null })
      steps.push({ type: 'call', id, index, remaining, depth, callStack: calls.map(c => ({ ...c })) })

      // Base cases
      if (remaining === 0) {
        calls[id].resolved = true
        calls[id].value = true
        steps.push({ type: 'base', id, index, remaining, value: true, message: 'Found sum!', callStack: calls.map(c => ({ ...c })) })
        return true
      }

      if (index >= array.length || remaining < 0) {
        calls[id].resolved = true
        calls[id].value = false
        steps.push({ type: 'return', id, index, remaining, value: false, callStack: calls.map(c => ({ ...c })) })
        return false
      }

      // Include current element
      const includeResult = canPartition(index + 1, remaining - array[index], depth + 1, id)
      if (includeResult) {
        calls[id].resolved = true
        calls[id].value = true
        steps.push({ type: 'return', id, index, remaining, value: true, callStack: calls.map(c => ({ ...c })) })
        return true
      }

      // Exclude current element
      const excludeResult = canPartition(index + 1, remaining, depth + 1, id)
      calls[id].resolved = true
      calls[id].value = excludeResult
      steps.push({ type: 'return', id, index, remaining, value: excludeResult, callStack: calls.map(c => ({ ...c })) })
      return excludeResult
    }

    const result = sumTarget === Math.floor(sumTarget) && canPartition(0, sumTarget)
    return { result, steps }
  }

  /* ── Memoization ──────────────────────────────────────────────────── */
  const computeMemoization = () => {
    const steps = []
    const memo = {}

    const canPartition = (index, remaining) => {
      if (remaining === 0) {
        steps.push({ type: 'base', index, remaining, value: true, memo: { ...memo } })
        return true
      }

      if (index >= array.length || remaining < 0) {
        steps.push({ type: 'base', index, remaining, value: false, memo: { ...memo } })
        return false
      }

      const key = `${index},${remaining}`
      if (key in memo) {
        steps.push({ type: 'cache-hit', index, remaining, value: memo[key], memo: { ...memo } })
        return memo[key]
      }

      steps.push({ type: 'compute', index, remaining, memo: { ...memo } })

      const includeResult = canPartition(index + 1, remaining - array[index])
      if (includeResult) {
        memo[key] = true
        steps.push({ type: 'store', index, remaining, value: true, memo: { ...memo } })
        return true
      }

      const excludeResult = canPartition(index + 1, remaining)
      memo[key] = excludeResult
      steps.push({ type: 'store', index, remaining, value: excludeResult, memo: { ...memo } })
      return excludeResult
    }

    const result = sumTarget === Math.floor(sumTarget) && canPartition(0, sumTarget)
    return { result, steps, memo }
  }

  /* ── Tabulation ───────────────────────────────────────────────────── */
  const computeTabulation = () => {
    const steps = []

    // If sum is odd, partition impossible
    if (sumTarget !== Math.floor(sumTarget)) {
      steps.push({ type: 'base', message: 'Sum is odd — impossible to partition', dp: [] })
      return { result: false, steps }
    }

    const target = Math.floor(sumTarget)
    const dp = Array(array.length + 1).fill(null).map(() => Array(target + 1).fill(false))

    // Base: sum 0 is always possible (empty subset)
    for (let i = 0; i <= array.length; i++) {
      dp[i][0] = true
    }
    steps.push({ type: 'init', message: 'Initialize: dp[*][0] = true', dp })

    // Fill table
    for (let i = 1; i <= array.length; i++) {
      for (let j = 0; j <= target; j++) {
        dp[i][j] = dp[i - 1][j] // Exclude current

        if (j >= array[i - 1]) {
          dp[i][j] = dp[i][j] || dp[i - 1][j - array[i - 1]] // Include current
        }

        steps.push({
          type: 'fill',
          i,
          j,
          value: dp[i][j],
          element: array[i - 1],
          message: `dp[${i}][${j}] = ${dp[i][j]}`,
          dp: dp.map(row => [...row]),
        })
      }
    }

    return { result: dp[array.length][target], steps }
  }

  useEffect(() => {
    try {
      let data
      if (approach === 'recursion') {
        data = computeRecursion()
      } else if (approach === 'memoization') {
        data = computeMemoization()
      } else {
        data = computeTabulation()
      }
      setVisualization({ ...data, currentStep: 0 })
      setResult(data.result)
      setIsPaused(true)
    } catch (error) {
      console.error('Partition computation error:', error)
      setResult(null)
      setVisualization({ steps: [], currentStep: 0 })
    }
  }, [approach])

  return (
    <section className="dp-pattern-section">

      {/* When to Use + Complexity */}
      <div className="dp-grid-2">
        <div className="card">
          <h2>📋 When to Use Partition DP</h2>
          <ul>
            <li>Partition array into <strong>k subsets</strong> with specified properties (equal sum, min diff)</li>
            <li>State: <code>dp[i][s]</code> = can we make sum s using first i elements?</li>
            <li>Recurrence: Include element or exclude it (similar to 0/1 Knapsack)</li>
            <li>Base: Sum 0 always possible (empty set), sum negative or out of range impossible</li>
            <li>Problems: Equal Subset Sum, Min Partition Diff, K Equal Subsets, Matchsticks Square</li>
            <li>Optimization: If total sum is odd, answer is immediately false</li>
          </ul>
          <p className="dp-example-use">
            <strong>Pattern:</strong> Subset sum DP — for each element, decide include or skip to reach target sum.
          </p>
        </div>

        <div className="card">
          <h2>⚡ Complexity — {approach.charAt(0).toUpperCase() + approach.slice(1)}</h2>
          <p><strong>Time:</strong> O(n·s) where n = array length, s = target sum</p>
          <p><strong>Space:</strong> {approach === 'recursion' ? 'O(n) — recursion depth only' : approach === 'memoization' ? 'O(n·s) — memo table' : 'O(n·s) — DP table'}</p>
          <div className="dp-complexity-table">
            <div className="dp-cmp-row header">
              <span>Approach</span><span>Time</span><span>Space</span>
            </div>
            {[{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoization', time: 'O(n·s)', space: 'O(n·s)' }, { name: 'Tabulation', time: 'O(n·s)', space: 'O(n·s)' }].map(row => (
              <div key={row.name} className={`dp-cmp-row ${approach === row.name.toLowerCase() ? 'active' : ''}`}>
                <span>{row.name}</span>
                <span>{row.time}</span>
                <span>{row.space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Tabs + Live Visualizer */}
      <div className="card">
        <h2>🎬 Live Animation — Partition Equal Subset Sum: {JSON.stringify(array)}</h2>

        {/* Approach Tabs */}
        <div className="dp-approach-tabs" style={{ marginBottom: '16px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Backtrack)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 DP Table' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>

        <VisualizerWrapper title="Partition DP — Equal Subset Sum Decision Tree">
          {approach === 'recursion' && <PartitionRecursionVisualizer visualization={visualization} array={array} />}
          {approach === 'memoization' && <PartitionMemoVisualizer visualization={visualization} />}
          {approach === 'tabulation' && <PartitionTableVisualizer visualization={visualization} array={array} />}
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

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: '6px', textAlign: 'center' }}>
          Can Partition: <strong style={{ fontSize: '1.1em', color: result ? 'var(--color-success, #10b981)' : 'var(--color-error, #ef4444)' }}>{result !== null ? (result ? 'YES ✓' : 'NO ✗') : '—'}</strong>
        </div>
      </div>

      {/* Code Template */}
      <div className="card">
        <h2>💻 Code Template</h2>
        <div className="dp-approach-tabs" style={{ marginBottom: '8px' }}>
          {[{ id: 'recursion', label: '🌳 Recursion (Backtrack)' }, { id: 'memoization', label: '💾 Memoization' }, { id: 'tabulation', label: '📊 DP Table' }].map(({ id, label }) => (
            <button key={id} className={`dp-approach-tab ${approach === id ? 'active' : ''}`} onClick={() => setApproach(id)}>
              {label}
            </button>
          ))}
        </div>
        <CodeLangTabs containerClass="dp-lang-tabs" btnClass="dp-lang-btn" activeLang={codeLang} onChange={setCodeLang} />

        {approach === 'recursion' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Partition DP — Recursion — O(2ⁿ) time, O(n) space
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0)
  
  // If sum is odd, impossible to partition equally
  if (sum % 2 !== 0) return false
  
  const target = sum / 2
  
  function canPartitionHelper(index, remaining) {
    // Found sum
    if (remaining === 0) return true
    
    // Out of bounds or overshoot
    if (index >= nums.length || remaining < 0) return false
    
    // Try including current element
    if (canPartitionHelper(index + 1, remaining - nums[index]))
      return true
    
    // Try excluding current element
    return canPartitionHelper(index + 1, remaining)
  }
  
  return canPartitionHelper(0, target)
}

console.log(canPartition([1, 5, 11, 5])) // true (11 = 5+5+1)`} />
        )}
        {approach === 'recursion' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Partition DP — Recursion — O(2ⁿ) time, O(n) space
def can_partition(nums):
    total_sum = sum(nums)
    
    # If sum is odd, impossible to partition equally
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    
    def helper(index, remaining):
        # Found sum
        if remaining == 0:
            return True
        
        # Out of bounds or overshoot
        if index >= len(nums) or remaining < 0:
            return False
        
        # Try including current element
        if helper(index + 1, remaining - nums[index]):
            return True
        
        # Try excluding current element
        return helper(index + 1, remaining)
    
    return helper(0, target)

print(can_partition([1, 5, 11, 5]))  # True (11 = 5+5+1)`} />
        )}
        {approach === 'recursion' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Partition DP — Recursion — O(2ⁿ) time, O(n) space
public class Partition {
    public static boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        
        // If sum is odd, impossible to partition equally
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        return helper(nums, 0, target);
    }
    
    static boolean helper(int[] nums, int index, int remaining) {
        // Found sum
        if (remaining == 0) return true;
        
        // Out of bounds or overshoot
        if (index >= nums.length || remaining < 0) return false;
        
        // Try including current element
        if (helper(nums, index + 1, remaining - nums[index]))
            return true;
        
        // Try excluding current element
        return helper(nums, index + 1, remaining);
    }
}`} />
        )}

        {approach === 'memoization' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Partition DP — Memoization — O(n·s) time, O(n·s) space
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0)
  if (sum % 2 !== 0) return false
  
  const target = sum / 2
  const memo = {}
  
  function helper(index, remaining) {
    if (remaining === 0) return true
    if (index >= nums.length || remaining < 0) return false
    
    // Check memo
    const key = \`\${index},\${remaining}\`
    if (key in memo) return memo[key]
    
    // Try include or exclude
    const result = helper(index + 1, remaining - nums[index]) ||
                   helper(index + 1, remaining)
    
    memo[key] = result
    return result
  }
  
  return helper(0, target)
}

console.log(canPartition([1, 5, 11, 5])) // true`} />
        )}
        {approach === 'memoization' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Partition DP — Memoization — O(n·s) time, O(n·s) space
def can_partition(nums):
    total_sum = sum(nums)
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    memo = {}
    
    def helper(index, remaining):
        if remaining == 0:
            return True
        if index >= len(nums) or remaining < 0:
            return False
        
        # Check memo
        key = (index, remaining)
        if key in memo:
            return memo[key]
        
        # Try include or exclude
        result = helper(index + 1, remaining - nums[index]) or \
                 helper(index + 1, remaining)
        
        memo[key] = result
        return result
    
    return helper(0, target)

print(can_partition([1, 5, 11, 5]))  # True`} />
        )}
        {approach === 'memoization' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Partition DP — Memoization — O(n·s) time, O(n·s) space
import java.util.HashMap;
import java.util.Map;

public class Partition {
    public static boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        Map<String, Boolean> memo = new HashMap<>();
        return helper(nums, 0, target, memo);
    }
    
    static boolean helper(int[] nums, int index, int remaining,
                          Map<String, Boolean> memo) {
        if (remaining == 0) return true;
        if (index >= nums.length || remaining < 0) return false;
        
        String key = index + "," + remaining;
        if (memo.containsKey(key)) return memo.get(key);
        
        boolean result = helper(nums, index + 1, remaining - nums[index], memo) ||
                        helper(nums, index + 1, remaining, memo);
        
        memo.put(key, result);
        return result;
    }
}`} />
        )}

        {approach === 'tabulation' && codeLang === 'javascript' && (
          <ShikiCodeBlock language="javascript" code={`// Partition DP — Tabulation — O(n·s) time, O(n·s) space
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0)
  if (sum % 2 !== 0) return false
  
  const target = sum / 2
  
  // dp[i][j] = can we achieve sum j using first i elements?
  const dp = Array(nums.length + 1)
    .fill(null)
    .map(() => Array(target + 1).fill(false))
  
  // Base: sum 0 is always possible
  for (let i = 0; i <= nums.length; i++) {
    dp[i][0] = true
  }
  
  // Fill table
  for (let i = 1; i <= nums.length; i++) {
    for (let j = 0; j <= target; j++) {
      // Exclude current element
      dp[i][j] = dp[i - 1][j]
      
      // Include current element
      if (j >= nums[i - 1]) {
        dp[i][j] = dp[i][j] || dp[i - 1][j - nums[i - 1]]
      }
    }
  }
  
  return dp[nums.length][target]
}

console.log(canPartition([1, 5, 11, 5])) // true`} />
        )}
        {approach === 'tabulation' && codeLang === 'python' && (
          <ShikiCodeBlock language="python" code={`# Partition DP — Tabulation — O(n·s) time, O(n·s) space
def can_partition(nums):
    total_sum = sum(nums)
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    
    # dp[i][j] = can we achieve sum j using first i elements?
    dp = [[False] * (target + 1) for _ in range(len(nums) + 1)]
    
    # Base: sum 0 is always possible
    for i in range(len(nums) + 1):
        dp[i][0] = True
    
    # Fill table
    for i in range(1, len(nums) + 1):
        for j in range(target + 1):
            # Exclude current element
            dp[i][j] = dp[i-1][j]
            
            # Include current element
            if j >= nums[i-1]:
                dp[i][j] = dp[i][j] or dp[i-1][j - nums[i-1]]
    
    return dp[len(nums)][target]

print(can_partition([1, 5, 11, 5]))  # True`} />
        )}
        {approach === 'tabulation' && codeLang === 'java' && (
          <ShikiCodeBlock language="java" code={`// Partition DP — Tabulation — O(n·s) time, O(n·s) space
public class Partition {
    public static boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        
        // dp[i][j] = can we achieve sum j using first i elements?
        boolean[][] dp = new boolean[nums.length + 1][target + 1];
        
        // Base: sum 0 is always possible
        for (int i = 0; i <= nums.length; i++) {
            dp[i][0] = true;
        }
        
        // Fill table
        for (int i = 1; i <= nums.length; i++) {
            for (int j = 0; j <= target; j++) {
                // Exclude current element
                dp[i][j] = dp[i-1][j];
                
                // Include current element
                if (j >= nums[i-1]) {
                    dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
                }
            }
        }
        
        return dp[nums.length][target];
    }
}`} />
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="card">
        <h2>🔧 Algorithm Explanation</h2>
        <div className="dp-algo-steps">
          <div className="dp-step">
            <div className="dp-step-num">1</div>
            <div className="dp-step-body">
              <strong>Problem Setup</strong>
              <p>Can we partition array into two subsets with equal sum?</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">2</div>
            <div className="dp-step-body">
              <strong>Key Insight</strong>
              <p>If total sum is odd, impossible. Otherwise, find subset with sum = total/2</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-body">
              <strong>DP State</strong>
              <p><code>dp[i][s]</code> = can we achieve sum s using first i elements?</p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">4</div>
            <div className="dp-step-body">
              <strong>Recurrence</strong>
              <p><code>dp[i][s] = dp[i-1][s] (skip) OR dp[i-1][s - nums[i]] (take)</code></p>
            </div>
          </div>
          <div className="dp-step">
            <div className="dp-step-num">5</div>
            <div className="dp-step-body">
              <strong>Return</strong>
              <p><code>dp[n][target]</code> — can we make sum = total/2?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2>💡 Tips to Remember</h2>
        <ul className="dp-tips-list">
          <li><strong>Odd sum check:</strong> If total sum is odd, return false immediately (no partitioning possible)</li>
          <li><strong>Subset sum problem:</strong> Finding one partition is same as finding subset with sum = total/2</li>
          <li><strong>DP table:</strong> dp[i][j] represents subset sum possibility, not element counts</li>
          <li><strong>Base case:</strong> Sum 0 is possible with empty subset; negative sums impossible</li>
          <li><strong>Time optimization:</strong> Memoization avoids redundant subproblems (exponential → polynomial)</li>
          <li><strong>Similar patterns:</strong> K Equal Subsets, Min Partition Diff, Coin Change, Unbounded Knapsack</li>
        </ul>
      </div>

      {/* Practice Problems */}
      <div className="card">
        <h2>🎯 Practice Problems — Partition & Subset Sum DP</h2>
        <div className="dp-problems-grid">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} onSaveNote={handleSave} userId={user?.uid} />
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Partition Recursion Visualizer ───────────────────────────────────── */
function PartitionRecursionVisualizer({ visualization, array }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `f(${c.index}, ${c.remaining})`,
    returnValue: c.resolved ? (c.value ? '✓' : '✗') : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'base' ? 'call' : step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Call: f({step.index}, {step.remaining}) | Remaining to find: {step.remaining}</>}
        {step.type === 'base'   && <>🎯 {step.message}</>}
        {step.type === 'return' && <>↩ f({step.index}, {step.remaining}) = {step.value ? 'true ✓' : 'false ✗'}</>}
      </div>

      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree treeNodes={treeNodes} activeNodeId={step.id} />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', paddingBottom: '8px' }}>
            📚 Call Stack ({step.callStack?.length || 0})
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth">#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">f({c.index}, {c.remaining})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value ? '✓' : '✗'}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Partition Memoization Visualizer ─────────────────────────────────── */
function PartitionMemoVisualizer({ visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const memo = step.memo || {}

  return (
    <div className="dp-viz-memo">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'cache-hit' ? 'hit' : step.type === 'store' ? 'store' : 'call'}`}>
        {step.type === 'compute'   && <>🔄 Computing f({step.index}, {step.remaining})…</>}
        {step.type === 'store'     && <>💾 Storing: ({step.index}, {step.remaining}) = {step.value ? 'true ✓' : 'false ✗'}</>}
        {step.type === 'cache-hit' && <>⚡ Cache HIT: ({step.index}, {step.remaining}) = {step.value ? 'true ✓' : 'false ✗'}</>}
        {step.type === 'base'      && <>🟢 Base — {step.remaining === 0 ? 'Sum found ✓' : 'Out of bounds ✗'}</>}
      </div>

      <div className="dp-memo-stats" style={{ marginBottom: '12px' }}>
        <span>Cached: <strong>{Object.keys(memo).length}</strong> states</span>
        <span className="dp-saved">Current: <strong>({step.index}, {step.remaining})</strong></span>
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Memoization Table:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
          {Object.entries(memo).slice(0, 20).map(([key, val]) => (
            <div key={key} className={`dp-memo-cell ${key === `${step.index},${step.remaining}` ? 'active' : ''}`} style={{ flex: '0 1 70px', fontSize: '0.75rem' }}>
              <span className="dp-memo-key">{key}</span>
              <span className="dp-memo-val">{val ? '✓' : '✗'}</span>
            </div>
          ))}
          {Object.keys(memo).length > 20 && <div style={{ fontSize: '0.75rem', padding: '4px' }}>+{Object.keys(memo).length - 20} more</div>}
        </div>
      </div>
    </div>
  )
}

/* ── Partition Table Visualizer ────────────────────────────────────────── */
function PartitionTableVisualizer({ visualization, array }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const dp = step.dp || []

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'fill' ? 'store' : 'call'}`}>
        {step.type === 'init'  && <>📌 Initialize: dp[*][0] = true (empty subset)</>}
        {step.type === 'fill'  && <>✏ {step.message}</>}
      </div>

      {/* DP Table Preview */}
      {dp.length > 0 && (
        <div style={{ marginTop: '12px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px', overflowX: 'auto' }}>
          <table style={{ fontSize: '0.75rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid var(--color-border)', padding: '4px' }}>i</th>
                {[0, 1, 2, 3, 4, 5].map(j => (
                  <th key={j} style={{ border: '1px solid var(--color-border)', padding: '4px' }}>
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.slice(0, Math.min(5, dp.length)).map((row, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid var(--color-border)', padding: '4px', fontWeight: '600' }}>
                    {i}
                  </td>
                  {row.slice(0, 6).map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        border: '1px solid var(--color-border)',
                        padding: '4px',
                        background: step.i === i && step.j === j ? 'var(--color-primary)' : cell ? 'var(--color-success, #10b98120)' : 'transparent',
                        color: step.i === i && step.j === j ? 'white' : 'var(--color-text)',
                        fontWeight: cell ? '600' : '400',
                      }}
                    >
                      {cell ? 'T' : 'F'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
      </div>
    </div>
  )
}

/* ── MCM Recursion Visualizer ───────────────────────────────────────────── */
function MCMRecursionVisualizer({ p, visualization }) {
  if (!visualization?.steps?.length) return <div className="dp-viz-placeholder">Press Play to animate</div>

  const step = visualization.steps[visualization.currentStep]
  if (!step) return null

  const treeNodes = (step.callStack || []).map(c => ({
    id: c.id,
    parentId: c.parentId ?? null,
    label: `mcm(${c.i},${c.j})`,
    isBase: c.i === c.j,
    returnValue: c.resolved ? c.value : undefined,
  }))

  return (
    <div className="dp-viz-recursion">
      <ProgressBar current={visualization.currentStep} total={visualization.steps.length} />

      <div className={`dp-call-badge ${step.type === 'return' ? 'return' : 'call'}`}>
        {step.type === 'call'   && <>📞 Calling <strong>mcm({step.i},{step.j})</strong> at depth {step.depth}</>}
        {step.type === 'return' && <>↩ mcm({step.i},{step.j}) returned <strong>{step.value}</strong></>}
      </div>

      {/* Recursion Tree + Call Stack Side by Side */}
      <div className="dp-tree-and-stack">
        <div className="dp-tree-section">
          <RecursionTree
            treeNodes={treeNodes}
            activeNodeId={step.id}
          />
        </div>
        
        <div className="dp-stack-panel">
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-bg-darker)', paddingBottom: '8px' }}>
            📚 Call Stack
          </div>
          {step.callStack?.slice().reverse().map((c, idx) => (
            <div key={c.id} className={`dp-stack-entry ${c.id === step.id ? 'active' : ''} ${c.resolved ? 'resolved' : ''}`}>
              <span className="dp-stack-depth" style={{ fontSize: '0.75rem', opacity: 0.6 }}>#{step.callStack.length - idx}</span>
              <span className="dp-stack-call">mcm({c.i},{c.j})</span>
              {c.resolved && <span className="dp-stack-result">→ {c.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── MCM Memoization Visualizer ──────────────────────────────────────────── */
function MCMMemoVisualizer({ p, matrixNames, visualization }) {
  if (!visualization || !visualization.steps || visualization.steps.length === 0) {
    return <div className="dp-viz-empty">Press ▶ to start</div>
  }
  const step = visualization.steps[visualization.currentStep ?? 0]
  if (!step) return null

  const getBadgeClass = () => {
    switch (step.type) {
      case 'base': return 'call'
      case 'memo-hit': return 'from1'
      case 'try-split': return 'call'
      case 'merge-cost': return 'call'
      case 'store': return 'store'
      default: return 'call'
    }
  }

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep ?? 0} total={visualization.steps?.length ?? 0} />

      <div className={`dp-call-badge ${getBadgeClass()}`}>
        {step.message}
      </div>

      {/* Matrix dimensions */}
      {step.i !== undefined && step.j !== undefined && (
        <div style={{ marginTop: '16px', padding: '10px', background: 'var(--color-bg-darker)', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-accent)' }}>
            Matrices [{step.i}..{step.j}]:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Array.from({ length: step.j - step.i + 1 }).map((_, idx) => {
              const matIdx = step.i + idx
              return (
                <div key={idx} style={{ padding: '6px 10px', background: 'var(--color-bg-darkest)', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {matrixNames[matIdx]}({p[matIdx]}×{p[matIdx + 1]})
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0} {step.cost !== undefined && (<>·&nbsp; Cost: {step.cost}</>)}
      </div>
    </div>
  )
}

/* ── MCM Tabulation Visualizer ───────────────────────────────────────────── */
function MCMDPVisualizer({ p, matrixNames, visualization }) {
  if (!visualization || !visualization.steps || visualization.steps.length === 0) {
    return <div className="dp-viz-empty">Press ▶ to start</div>
  }
  const step = visualization.steps[visualization.currentStep ?? 0]
  if (!step) return null

  const getBadgeClass = () => {
    switch (step.type) {
      case 'init': return 'call'
      case 'start-len': return 'call'
      case 'try-split': return 'call'
      case 'update': return 'store'
      default: return 'call'
    }
  }

  const n = p.length - 1

  return (
    <div className="dp-viz-table">
      <ProgressBar current={visualization.currentStep ?? 0} total={visualization.steps?.length ?? 0} />

      <div className={`dp-call-badge ${getBadgeClass()}`}>
        {step.message}
      </div>

      {/* DP Table */}
      {step.dp && (
        <div style={{ marginTop: '16px', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '8px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px', border: '1px solid var(--color-border)', fontWeight: '600' }}>dp[i][j]</td>
                {Array.from({ length: n }).map((_, j) => (
                  <td key={j} style={{ padding: '4px', border: '1px solid var(--color-border)', fontWeight: '600', textAlign: 'center' }}>
                    {j}
                  </td>
                ))}
              </tr>
              {Array.from({ length: n }).map((_, i) => (
                <tr key={i}>
                  <td style={{ padding: '4px', border: '1px solid var(--color-border)', fontWeight: '600' }}>
                    {i}
                  </td>
                  {Array.from({ length: n }).map((_, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '4px',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                        background:
                          step.i !== undefined && step.j !== undefined && i === step.i && j === step.j
                            ? 'var(--color-primary)'
                            : i <= j
                            ? 'var(--color-bg-darker)'
                            : 'var(--color-bg-darkest)',
                        color: step.i !== undefined && step.j !== undefined && i === step.i && j === step.j ? 'white' : 'var(--color-text)',
                        fontWeight: step.i !== undefined && step.j !== undefined && i === step.i && j === step.j ? '700' : '400',
                      }}
                    >
                      {i <= j ? (step.dp[i]?.[j] ?? '—') : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Current computation details */}
      {step.i !== undefined && step.j !== undefined && (
        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(64, 138, 113, 0.1)', borderRadius: '6px', fontSize: '0.85rem' }}>
          <strong>Matrices [{step.i}..{step.j}]:</strong>
          <div style={{ marginTop: '4px' }}>
            {Array.from({ length: step.j - step.i + 1 }).map((_, idx) => {
              const matIdx = step.i + idx
              return (
                <span key={idx} style={{ marginRight: '8px' }}>
                  {matrixNames[matIdx]}({p[matIdx]}×{p[matIdx + 1]})
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="dp-table-progress" style={{ marginTop: '12px' }}>
        Step {(visualization.currentStep ?? 0) + 1} / {visualization.steps?.length ?? 0}
        {step.i !== undefined && step.j !== undefined && (
          <>
            &nbsp;·&nbsp; [{step.i}, {step.j}] = <strong>{step.dp?.[step.i]?.[step.j] ?? '—'}</strong>
          </>
        )}
      </div>
    </div>
  )
}
