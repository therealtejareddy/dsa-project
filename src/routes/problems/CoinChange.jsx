import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import RecursionTree from '../../components/visualizers/RecursionTree'
import CallStackPanel from '../../components/CallStackPanel'
import DPTableVisualizer from '../../components/visualizers/DPTableVisualizer'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

// ─── Brute Force: Recursion with backtracking ───────────────────────────────
function generateBruteSteps(coins, amount) {
  const steps = []
  let nodeIdCounter = 0
  const treeNodes = []
  const nodeValueMap = {}
  let callStack = []
  let callCount = 0

  steps.push({
    phase: 'init',
    description: `Brute Force: Try all possible coin combinations recursively.`,
    treeNodes: [],
    callStack: [],
    activeNodeId: null,
  })

  function minCoins(remain, parentId = null, depth = 0) {
    if (callCount > 100) return Infinity // Limit for display

    const nodeId = `node-${nodeIdCounter++}`
    callCount++

    const node = {
      id: nodeId,
      label: remain,
      parentId,
      isBase: remain === 0,
    }
    treeNodes.push(node)

    const frame = {
      id: nodeId,
      funcName: `minCoins(${remain})`,
      vars: { amount: remain, depth },
    }
    callStack.push(frame)

    if (remain === 0) {
      nodeValueMap[nodeId] = 0
      steps.push({
        phase: 'base',
        description: `Base: remaining=0 → return 0 coins needed`,
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })
      callStack.pop()
      return 0
    }

    if (remain < 0) {
      nodeValueMap[nodeId] = Infinity
      callStack.pop()
      return Infinity
    }

    let minResult = Infinity

    for (const coin of coins) {
      steps.push({
        phase: 'try',
        description: `Try coin ${coin}: minCoins(${remain - coin})`,
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })

      const subResult = minCoins(remain - coin, nodeId, depth + 1)

      if (subResult !== Infinity) {
        minResult = Math.min(minResult, subResult + 1)
      }
    }

    nodeValueMap[nodeId] = minResult

    steps.push({
      phase: 'return',
      description: `Return: minCoins(${remain}) = ${minResult === Infinity ? '∞' : minResult}`,
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    callStack.pop()
    return minResult
  }

  const result = minCoins(amount)

  steps.push({
    phase: 'complete',
    description: `Complete! Made ${callCount} recursive calls. Minimum coins needed: ${result === Infinity ? 'impossible (-1)' : result}`,
    callCount,
    treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
    callStack: [],
    activeNodeId: null,
    result: result === Infinity ? -1 : result,
  })

  return steps
}

// ─── Better: Memoization ──────────────────────────────────────────────────────
function generateBetterSteps(coins, amount) {
  const steps = []
  const memo = {}
  let nodeIdCounter = 0
  const treeNodes = []
  const nodeValueMap = {}
  let callStack = []
  let callCount = 0

  steps.push({
    phase: 'init',
    description: `Memoization: Cache results to avoid recomputation.`,
    memo: { ...memo },
    callCount: 0,
    treeNodes: [],
    callStack: [],
    activeNodeId: null,
  })

  function minCoins(remain, parentId = null, depth = 0) {
    callCount++
    
    if (remain in memo) {
      const nodeId = `node-${nodeIdCounter++}`
      const node = {
        id: nodeId,
        label: remain,
        parentId,
        isBase: remain === 0,
        match: true,
      }
      treeNodes.push(node)
      nodeValueMap[nodeId] = memo[remain]

      const frame = {
        id: nodeId,
        funcName: `minCoins(${remain}) [cached]`,
        vars: { amount: remain, memoized: true },
      }
      callStack.push(frame)

      steps.push({
        phase: 'cached',
        description: `💾 Found in memo: minCoins(${remain}) = ${memo[remain]}`,
        memo: { ...memo },
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })

      callStack.pop()
      return memo[remain]
    }

    const nodeId = `node-${nodeIdCounter++}`

    const node = {
      id: nodeId,
      label: remain,
      parentId,
      isBase: remain === 0,
    }
    treeNodes.push(node)

    const frame = {
      id: nodeId,
      funcName: `minCoins(${remain})`,
      vars: { amount: remain, depth },
    }
    callStack.push(frame)

    if (remain === 0) {
      memo[0] = 0
      nodeValueMap[nodeId] = 0
      steps.push({
        phase: 'base',
        description: `Base: remaining=0 → return 0`,
        memo: { ...memo },
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })
      callStack.pop()
      return 0
    }

    if (remain < 0) {
      callStack.pop()
      return Infinity
    }

    let minResult = Infinity

    for (const coin of coins) {
      const subResult = minCoins(remain - coin, nodeId, depth + 1)

      if (subResult !== Infinity) {
        minResult = Math.min(minResult, subResult + 1)
      }
    }

    memo[remain] = minResult
    nodeValueMap[nodeId] = minResult

    steps.push({
      phase: 'store',
      description: `Store: memo[${remain}] = ${minResult === Infinity ? '∞' : minResult}. Memo size: ${Object.keys(memo).length}`,
      memo: { ...memo },
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    callStack.pop()
    return minResult
  }

  const result = minCoins(amount)

  steps.push({
    phase: 'complete',
    description: `Complete! With memoization: ${callCount} calls. Memo entries: ${Object.keys(memo).length}. Result: ${result === Infinity ? -1 : result}`,
    memo,
    callCount,
    treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
    callStack: [],
    activeNodeId: null,
    result: result === Infinity ? -1 : result,
  })

  return steps
}

// ─── Optimal: Dynamic Programming (Tabulation) ─────────────────────────────────
function generateOptimalSteps(coins, amount) {
  const steps = []
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0

  steps.push({
    phase: 'init',
    description: `DP Tabulation: Build table from amount=0 upward. dp[0]=0 (no coins for 0).`,
    dp: [...dp],
    idx: -1,
  })

  for (let i = 1; i <= amount; i++) {
    steps.push({
      phase: 'compute',
      description: `Computing dp[${i}]: try all coins...`,
      dp: [...dp],
      idx: i,
    })

    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        const newValue = dp[i - coin] + 1
        if (newValue < dp[i]) {
          dp[i] = newValue
          steps.push({
            phase: 'update',
            description: `dp[${i}] = min(${dp[i]}, dp[${i - coin}] + 1) = ${dp[i]}`,
            dp: [...dp],
            idx: i,
          })
        }
      }
    }

    if (dp[i] === Infinity) {
      steps.push({
        phase: 'unreachable',
        description: `dp[${i}] = ∞ (unreachable with given coins)`,
        dp: [...dp],
        idx: i,
      })
    }
  }

  steps.push({
    phase: 'complete',
    description: `Complete! dp[${amount}] = ${dp[amount] === Infinity ? -1 : dp[amount]}`,
    dp,
    idx: -1,
    result: dp[amount] === Infinity ? -1 : dp[amount],
  })

  return steps
}

export default function CoinChange() {
  const [amount, setAmount] = useState('5')
  const [coinsInput, setCoinsInput] = useState('1,2,5')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const parsedAmount = Math.max(1, Math.min(100, parseInt(amount) || 1))
  const parsedCoins = coinsInput
    .split(',')
    .map(c => parseInt(c))
    .filter(c => !isNaN(c) && c > 0)

  useEffect(() => {
    let newSteps = []
    if (selectedApproach === 'brute') {
      newSteps = generateBruteSteps(parsedCoins, parsedAmount)
    } else if (selectedApproach === 'better') {
      newSteps = generateBetterSteps(parsedCoins, parsedAmount)
    } else {
      newSteps = generateOptimalSteps(parsedCoins, parsedAmount)
    }
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [parsedAmount, parsedCoins, selectedApproach])

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    playIntervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000 / speed)
    return () => clearInterval(playIntervalRef.current)
  }, [isPlaying, steps, speed])

  const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1) }
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1) }
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false) }

  const currentState = steps[currentStep] || {}

  return (
    <div className="cc-container">
      <PageHeader
        title="322. Coin Change"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'DP', className: 'topic' },
          { label: 'Greedy', className: 'topic' },
        ]}
      />

      <div className="cc-main">
        <div className="cc-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an integer array <strong>coins</strong> representing coins of different denominations and an integer <strong>amount</strong> representing a total amount of money.
            </p>
            <p>
              Return the <strong>fewest number of coins</strong> that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return <strong>-1</strong>.
            </p>
            <p>You may assume that you have an infinite number of each kind of coin.</p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ coins.length ≤ 12</code> | <code>1 ≤ coins[i] ≤ 2³¹ - 1</code> | <code>0 ≤ amount ≤ 10⁴</code>
            </div>
          </div>
        </div>

        <div className="cc-full-width">
          <div className="card input-card">
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Coins:</label>
              <input
                type="text"
                value={coinsInput}
                onChange={e => setCoinsInput(e.target.value)}
                placeholder="e.g., 1,2,5"
                style={{ width: '100%', padding: 8, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Amount (0-100):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ width: '100%', padding: 8, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12 }}
              />
            </div>
          </div>
        </div>

        <div className="cc-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input: coins = [1,2,5], amount = 5
Output: 2
Explanation: 5 = 5 (1 coin) or
             5 = 2 + 2 + 1 (3 coins)`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input: coins = [2], amount = 3
Output: -1
Explanation: 3 cannot be made
with coin denomination 2`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              This is a classic unbounded knapsack problem. For each amount from 1 to target:
            </p>
            <ul>
              <li>Try using each coin denomination</li>
              <li>If coin ≤ current amount, check: <code>1 + dp[amount - coin]</code></li>
              <li>Take the minimum across all valid choices</li>
              <li>Base case: <code>dp[0] = 0</code> (zero coins for zero amount)</li>
            </ul>
            <p>
              Recurrence: <code>dp[i] = min(dp[i - coin] + 1) for all coins ≤ i</code>
            </p>
          </div>
        </div>

        <div className="cc-right">
          <div className="card" style={{ minHeight: 500, background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ marginBottom: 16 }}>📊 Visualization</h2>

            {/* Brute Force: Recursion Tree + Call Stack */}
            {selectedApproach === 'brute' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Recursion Tree */}
                  {(currentState.treeNodes || []).length > 0 && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 8,
                      padding: 12,
                      overflow: 'auto',
                      maxHeight: 400,
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'rgba(176, 228, 204, 0.7)' }}>
                        📌 Recursion Tree
                      </p>
                      <RecursionTree
                        treeNodes={currentState.treeNodes}
                        activeNodeId={currentState.activeNodeId}
                        activeNodeColor="#6366f1"
                        activeNodeDarkColor="#4f46e5"
                      />
                    </div>
                  )}

                  {/* Call Stack */}
                  {(currentState.callStack || []).length > 0 && (
                    <div style={{ maxHeight: 400, overflow: 'auto' }}>
                      <CallStackPanel
                        frames={currentState.callStack}
                        title="📚 Call Stack"
                        emptyText="Stack is empty"
                        renderFrame={(frame) => (
                          <div style={{ fontSize: 9 }}>
                            <div style={{ fontWeight: 700, color: '#6366f1', fontFamily: 'monospace', marginBottom: 3 }}>
                              {frame.funcName}
                            </div>
                            <div style={{ color: 'rgba(176, 228, 204, 0.7)' }}>
                              {Object.entries(frame.vars || {}).map(([k, v]) => (
                                <div key={k}>
                                  <span style={{ color: '#a855f7' }}>{k}</span>: {v}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Memoization: Recursion Tree + Call Stack */}
            {selectedApproach === 'better' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Recursion Tree (pruned) */}
                  {(currentState.treeNodes || []).length > 0 && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 8,
                      padding: 12,
                      overflow: 'auto',
                      maxHeight: 400,
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'rgba(176, 228, 204, 0.7)' }}>
                        📌 Pruned Tree (Cached)
                      </p>
                      <RecursionTree
                        treeNodes={currentState.treeNodes}
                        activeNodeId={currentState.activeNodeId}
                        activeNodeColor="#10b981"
                        activeNodeDarkColor="#059669"
                      />
                    </div>
                  )}

                  {/* Call Stack */}
                  {(currentState.callStack || []).length > 0 && (
                    <div style={{ maxHeight: 400, overflow: 'auto' }}>
                      <CallStackPanel
                        frames={currentState.callStack}
                        title="📚 Call Stack"
                        emptyText="Stack is empty"
                        renderFrame={(frame) => (
                          <div style={{ fontSize: 9 }}>
                            <div style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', marginBottom: 3 }}>
                              {frame.funcName}
                            </div>
                            <div style={{ color: 'rgba(176, 228, 204, 0.7)' }}>
                              {Object.entries(frame.vars || {}).map(([k, v]) => (
                                <div key={k}>
                                  <span style={{ color: '#a855f7' }}>{k}</span>: {String(v)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Optimal: DP Table */}
            {selectedApproach === 'optimal' && (
              <DPTableVisualizer
                dpTable={currentState.dp || []}
                currentIndex={currentState.idx || -1}
                n={parsedAmount}
                recurrence={`dp[i] = min(dp[i - coin] + 1) for each coin ≤ i`}
                description={currentState.description || 'Building DP table...'}
              />
            )}

            {/* Result */}
            {currentState.result !== undefined && currentState.result !== null && (
              <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #10b981', borderRadius: 8, textAlign: 'center', marginTop: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                  ✅ Result: {currentState.result === -1 ? 'Impossible (-1)' : `${currentState.result} coin(s)`}
                </p>
              </div>
            )}
          </div>

          <PlaybackControls
            isPaused={isPlaying === false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            disablePrev={currentStep <= 0}
            disableNext={currentStep >= steps.length - 1}
          />

          <ProgressBar current={currentStep + 1} total={steps.length} />

          <div className="info-box info">
            <strong>Step {currentStep + 1} / {steps.length} — {currentState.phase?.toUpperCase()}</strong>
            <p>{currentState.description || 'Ready to start'}</p>
          </div>

          <div className="card">
            <h2>Code Approaches</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
              {[
                { id: 'brute', label: 'Brute Force O(nᵐ)', time: 'O(nᵐ)', space: 'O(n)' },
                { id: 'better', label: 'Memoization O(n·m)', time: 'O(n·m)', space: 'O(n)' },
                { id: 'optimal', label: 'DP Tabulation O(n·m)', time: 'O(n·m)', space: 'O(n)' },
              ].map(approach => (
                <button
                  key={approach.id}
                  onClick={() => setSelectedApproach(approach.id)}
                  style={{
                    padding: '8px 12px',
                    background: selectedApproach === approach.id ? 'var(--color-primary)' : 'transparent',
                    border: `1px solid ${selectedApproach === approach.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 6,
                    color: selectedApproach === approach.id ? 'var(--color-accent)' : 'rgba(176, 228, 204, 0.7)',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  <div>{approach.label}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{approach.time}</div>
                </button>
              ))}
            </div>

            {selectedApproach === 'brute' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Exponential recursion exploring all coin combinations.</p>
                  <p><strong>Time:</strong> O(n^m) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function coinChange(coins, amount) {
    function minCoins(remain) {
        if (remain === 0) return 0;
        if (remain < 0) return Infinity;
        
        let min = Infinity;
        for (const coin of coins) {
            min = Math.min(min, minCoins(remain - coin) + 1);
        }
        return min;
    }
    
    const result = minCoins(amount);
    return result === Infinity ? -1 : result;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'better' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Memoization caching subproblem results.</p>
                  <p><strong>Time:</strong> O(n·m) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function coinChange(coins, amount) {
    const memo = {};
    
    function minCoins(remain) {
        if (remain in memo) return memo[remain];
        if (remain === 0) return 0;
        if (remain < 0) return Infinity;
        
        let min = Infinity;
        for (const coin of coins) {
            min = Math.min(min, minCoins(remain - coin) + 1);
        }
        memo[remain] = min;
        return min;
    }
    
    const result = minCoins(amount);
    return result === Infinity ? -1 : result;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'optimal' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Bottom-up DP table building.</p>
                  <p><strong>Time:</strong> O(n·m) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i && dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`} language="javascript" />
              </>
            )}
          </div>
        </div>
      </div>

      <Approaches
        approaches={[
          { type: 'choose', label: 'Subproblem', description: 'minCoins(i) = min coins needed to make amount i' },
          { type: 'recurse', label: 'Recurrence', description: 'For each coin c ≤ i: try 1 + minCoins(i - c)' },
          { type: 'base', label: 'Base Case', description: 'minCoins(0) = 0; minCoins(negative) = ∞' },
          { type: 'undo', label: 'Return', description: 'Return dp[amount] or -1 if impossible' },
        ]}
        complexity={{
          time: 'O(n · m) — n = amount, m = num coins',
          space: 'O(n) — for dp array or recursion depth',
        }}
      />

      <InterviewNotes
        whatToLookFor={[
          'Recognizing this as an unbounded knapsack (use each coin unlimited times)',
          'Understanding the recurrence relation: dp[i] depends on dp[i-coin]',
          'Base case: dp[0] = 0 (no coins for zero amount)',
          'Impossible amounts → initialize with Infinity',
        ]}
        commonTraps={[
          'Forgetting Infinity initialization for unreachable amounts',
          'Wrong recurrence order (iterating coins vs amounts)',
          'Not handling edge case: amount < min(coins)',
          'Returning 0 instead of -1 for impossible cases',
        ]}
        followUps={[
          'Coin Change II (LeetCode 518): count combinations',
          'Perfect Squares (LeetCode 279): use integers ≤ n',
          'Combination Sum (LeetCode 39): return actual coins used',
          'Space optimization: O(1) if only need last row',
        ]}
      />

      <PatternRecognition
        patternName="Unbounded Knapsack — DP"
        description="Item can be used unlimited times. Classic DP: build table where dp[i] = optimal solution for capacity/amount i. Each cell depends on: itself (skip item) and a previous cell (use item). Iterate amounts outer, items inner for unbounded. Non-0/1 knapsack means same index can be visited multiple times per amount."
      />
    </div>
  )
}
