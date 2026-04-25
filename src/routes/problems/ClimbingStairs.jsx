import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'
import CallStackPanel from '../../components/CallStackPanel'
import RecursionTree from '../../components/visualizers/RecursionTree'
import MemoizationCacheVisualizer from '../../components/visualizers/MemoizationCacheVisualizer'
import DPTableVisualizer from '../../components/visualizers/DPTableVisualizer'

// Brute Force: Exponential recursion tree with call stack
function generateBruteSteps(n) {
  const steps = []
  let callCount = 0
  let nodeIdCounter = 0
  const treeNodes = []
  const nodeValueMap = {} // Track return values for each node
  let callStack = []

  steps.push({
    phase: 'init',
    description: `Brute Force: Solve via recursion. At each step, try both 1-step and 2-step moves recursively.`,
    callCount: 0,
    treeNodes: [],
    callStack: [],
    activeNodeId: null,
  })

  function traverse(remaining, depth = 0, parentId = null) {
    if (callCount > 50) return // Limit for display

    const nodeId = `node-${nodeIdCounter++}`
    callCount++

    // Create tree node
    const node = {
      id: nodeId,
      label: remaining,
      parentId,
      isBase: remaining <= 2,
    }
    treeNodes.push(node)

    // Create call stack frame
    const frame = {
      id: nodeId,
      funcName: `climb(${remaining})`,
      vars: { n: remaining, depth },
    }
    callStack.push(frame)

    if (remaining <= 2) {
      const returnValue = remaining
      nodeValueMap[nodeId] = returnValue
      
      steps.push({
        phase: 'calculate',
        description: `Base case: climb(${remaining}) → return ${returnValue}`,
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack,
        activeNodeId: nodeId,
      })
      callStack.pop()
      return remaining
    }

    steps.push({
      phase: 'branch',
      description: `Branch: climb(${remaining}) splits into climb(${remaining-1}) + climb(${remaining-2})`,
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    const left = traverse(remaining - 1, depth + 1, nodeId)
    const right = traverse(remaining - 2, depth + 1, nodeId)
    const result = left + right
    nodeValueMap[nodeId] = result

    steps.push({
      phase: 'return',
      description: `Return: climb(${remaining}) = ${left} + ${right} = ${result}`,
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    callStack.pop()
    return result
  }

  traverse(n)

  steps.push({
    phase: 'complete',
    description: `Complete! Made ${callCount} recursive calls. Exponential branching (O(2ⁿ)).`,
    callCount,
    treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
    callStack: [],
    activeNodeId: null,
    result: n <= 2 ? n : n,
  })

  return steps
}

// Better: Memoization (top-down DP) with tree tracking
function generateBetterSteps(n) {
  const steps = []
  const memo = {}
  let callCount = 0
  let nodeIdCounter = 0
  const treeNodes = []
  const nodeValueMap = {} // Track return values for each node
  let callStack = []

  steps.push({
    phase: 'init',
    description: `Memoization: Use recursion with caching to avoid recalculating subproblems.`,
    memo: { ...memo },
    callCount: 0,
    treeNodes: [],
    callStack: [],
    activeNodeId: null,
  })

  function climb(remaining, depth = 0, parentId = null) {
    callCount++

    const nodeId = `node-${nodeIdCounter++}`
    const node = {
      id: nodeId,
      label: remaining,
      parentId,
      isBase: remaining <= 2,
      match: remaining in memo,
    }
    treeNodes.push(node)

    const frame = {
      id: nodeId,
      funcName: `climb(${remaining})`,
      vars: { n: remaining, memoized: remaining in memo },
    }
    callStack.push(frame)

    if (remaining in memo) {
      const returnValue = memo[remaining]
      nodeValueMap[nodeId] = returnValue
      
      steps.push({
        phase: 'cached',
        description: `💾 Found in memo! climb(${remaining}) = ${returnValue} (skip recalculation)`,
        memo: { ...memo },
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })
      callStack.pop()
      return returnValue
    }

    if (remaining <= 2) {
      memo[remaining] = remaining
      nodeValueMap[nodeId] = remaining
      
      steps.push({
        phase: 'calculate',
        description: `Base case: climb(${remaining}) = ${remaining}. Store in memo.`,
        memo: { ...memo },
        callCount,
        treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
        callStack: [...callStack],
        activeNodeId: nodeId,
      })
      callStack.pop()
      return remaining
    }

    steps.push({
      phase: 'compute',
      description: `Computing climb(${remaining}) = climb(${remaining-1}) + climb(${remaining-2})...`,
      memo: { ...memo },
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    const left = climb(remaining - 1, depth + 1, nodeId)
    const right = climb(remaining - 2, depth + 1, nodeId)
    const result = left + right
    memo[remaining] = result
    nodeValueMap[nodeId] = result

    steps.push({
      phase: 'store',
      description: `climb(${remaining}) = ${left} + ${right} = ${result}. Memo size: ${Object.keys(memo).length}`,
      memo: { ...memo },
      callCount,
      treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
      callStack: [...callStack],
      activeNodeId: nodeId,
    })

    callStack.pop()
    return result
  }

  climb(n)

  steps.push({
    phase: 'complete',
    description: `Complete! With memoization: ${callCount} calls vs ${Math.pow(2, n)} for brute force. Time saved: ${(100 - (callCount / Math.pow(2, n) * 100)).toFixed(1)}%`,
    memo,
    callCount,
    treeNodes: treeNodes.map(n => ({ ...n, returnValue: nodeValueMap[n.id] })),
    callStack: [],
    activeNodeId: null,
    result: memo[n] || n,
  })

  return steps
}

// Optimal: Tabulation (bottom-up DP)
function generateOptimalSteps(n) {
  const steps = []
  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1

  steps.push({
    phase: 'init',
    description: `Tabulation: Build DP table bottom-up. dp[0]=1 (1 way to stay), dp[1]=1 (1 way to climb 1 step).`,
    idx: -1,
    dp: [...dp],
  })

  for (let i = 2; i <= n; i++) {
    steps.push({
      phase: 'compute',
      description: `Step ${i}: dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]}`,
      idx: i,
      dp: [...dp],
      showing: 'compute',
    })

    dp[i] = dp[i - 1] + dp[i - 2]

    steps.push({
      phase: 'update',
      description: `✅ dp[${i}] = ${dp[i]} ways`,
      idx: i,
      dp: [...dp],
      showing: 'update',
    })
  }

  steps.push({
    phase: 'complete',
    description: `✅ Complete! Total ways: dp[${n}] = ${dp[n]}`,
    idx: -1,
    dp: [...dp],
    result: dp[n],
  })

  return steps
}

export default function ClimbingStairs() {
  const [input, setInput] = useState('4')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const n = Math.max(1, Math.min(15, parseInt(input) || 1))

  useEffect(() => {
    let newSteps = []
    if (selectedApproach === 'brute') {
      newSteps = generateBruteSteps(n)
    } else if (selectedApproach === 'better') {
      newSteps = generateBetterSteps(n)
    } else {
      newSteps = generateOptimalSteps(n)
    }
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [n, selectedApproach])

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
    <div className="cs-container">
      <PageHeader
        title="70. Climbing Stairs"
        badges={[
          { label: 'Easy', className: 'difficulty-easy' },
          { label: 'Math', className: 'topic' },
          { label: 'Dynamic Programming', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              You are climbing a staircase. It takes <strong>n</strong> steps to reach the top.
            </p>
            <p>
              Each time you can either climb <strong>1 or 2 steps</strong>. In how many <strong>distinct ways</strong> can you climb to the top?
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ n ≤ 45</code>
            </div>
          </div>
        </div>

        <div className="cs-full-width">
          <div className="card input-card">
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>n (1-15):</label>
            <input
              type="number"
              min="1"
              max="15"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', padding: 10, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12 }}
            />
          </div>
        </div>

        <div className="cs-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  n = 2
Output: 2
Explanation:
  1. 1 step + 1 step
  2. 2 steps`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  n = 3
Output: 3
Explanation:
  1. 1 + 1 + 1
  2. 1 + 2
  3. 2 + 1`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition — Fibonacci Recurrence</h2>
            <p>
              To reach stair <code>n</code>, you can arrive from:
            </p>
            <ul>
              <li><strong>Stair n-1</strong>: take 1 step (there are dp[n-1] ways to reach n-1)</li>
              <li><strong>Stair n-2</strong>: take 2 steps (there are dp[n-2] ways to reach n-2)</li>
            </ul>
            <p>
              Therefore: <code>dp[n] = dp[n-1] + dp[n-2]</code>
            </p>
            <p>
              This is the Fibonacci sequence! Base cases: dp[1]=1, dp[2]=2.
            </p>
          </div>

        <div className="cs-right">
          <div className="card" style={{ minHeight: 400, background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ marginBottom: 16 }}>📊 Visualization</h2>
            
            {/* Brute Force: Recursion Tree + Call Stack visualization */}
            {selectedApproach === 'brute' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Recursion Tree + Call Stack Side by Side */}
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
                      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: 'rgba(176, 228, 204, 0.7)' }}>
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
                          <div style={{ fontSize: 10 }}>
                            <div style={{ fontWeight: 700, color: '#6366f1', fontFamily: 'monospace', marginBottom: 4 }}>
                              {frame.funcName}
                            </div>
                            <div style={{ fontSize: 9, color: 'rgba(176, 228, 204, 0.8)' }}>
                              {Object.entries(frame.vars || {}).map(([k, v]) => (
                                <div key={k}>
                                  <span style={{ color: '#a855f7' }}>{k}</span> = {v}
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

            {/* Better: Memoization with Tree + Call Stack visualization */}
            {selectedApproach === 'better' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Recursion Tree + Call Stack Side by Side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Recursion Tree (pruned with caching) */}
                  {(currentState.treeNodes || []).length > 0 && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 8,
                      padding: 12,
                      overflow: 'auto',
                      maxHeight: 400,
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'rgba(176, 228, 204, 0.7)' }}>
                        📌 Recursion Tree (Pruned)
                      </p>
                      <p style={{ fontSize: 9, color: 'rgba(176, 228, 204, 0.5)', marginBottom: 8 }}>
                        🟢 Green = cached
                      </p>
                      <RecursionTree
                        treeNodes={currentState.treeNodes}
                        activeNodeId={currentState.activeNodeId}
                        activeNodeColor="#34d399"
                        activeNodeDarkColor="#10b981"
                      />
                    </div>
                  )}

                  {/* Call Stack */}
                  {(currentState.callStack || []).length > 0 && (
                    <div style={{ maxHeight: 400, overflow: 'auto' }}>
                      <CallStackPanel
                        frames={currentState.callStack}
                        title="📚 Call Stack (Memoized)"
                        emptyText="Stack is empty"
                        renderFrame={(frame) => (
                          <div style={{ fontSize: 10 }}>
                            <div style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', marginBottom: 4 }}>
                              {frame.funcName}
                            </div>
                            <div style={{ fontSize: 9, color: 'rgba(176, 228, 204, 0.8)' }}>
                              {Object.entries(frame.vars || {}).map(([k, v]) => (
                                <div key={k}>
                                  <span style={{ color: '#a855f7' }}>{k}</span> = {String(v)}
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

            {/* Optimal: DP Table visualization */}
            {selectedApproach === 'optimal' && (
              <DPTableVisualizer
                dpTable={currentState.dp || []}
                currentIndex={currentState.idx || -1}
                n={n}
                recurrence="dp[i] = dp[i-1] + dp[i-2]"
                description={currentState.description || 'Building DP table bottom-up...'}
              />
            )}

            {/* Result */}
            {currentState.result !== undefined && (
              <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #10b981', borderRadius: 8, textAlign: 'center', marginTop: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>✅ Result: {currentState.result} ways to climb {n} stairs</p>
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
                { id: 'brute', label: 'Brute Recursion O(2ⁿ)', time: 'O(2ⁿ)', space: 'O(n)' },
                { id: 'better', label: 'Memoization O(n)', time: 'O(n)', space: 'O(n)' },
                { id: 'optimal', label: 'Tabulation O(n)', time: 'O(n)', space: 'O(n)' },
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
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Exponential recursion. At each step, branch into two recursive calls (1-step + 2-step).</p>
                  <p><strong>Time:</strong> O(2ⁿ) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function climbStairs(n) {
    if (n <= 2) return n;
    
    // Exponential branching - solve overlapping subproblems repeatedly
    return climbStairs(n - 1) + climbStairs(n - 2);
    
    // Example for n=4:
    // climbStairs(4)
    //   = climbStairs(3) + climbStairs(2)
    //   = (climbStairs(2) + climbStairs(1)) + 2
    //   = (2 + 1) + 2 = 5
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'better' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Memoization (top-down DP). Cache results to avoid recomputing the same subproblems.</p>
                  <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function climbStairs(n) {
    const memo = {};
    
    function helper(n) {
        if (n <= 2) return n;
        if (n in memo) return memo[n];
        
        // Recurse, but cache the result
        memo[n] = helper(n - 1) + helper(n - 2);
        return memo[n];
    }
    
    return helper(n);
    
    // Each value computed only once due to memoization
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'optimal' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Tabulation (bottom-up DP). Build table iteratively from base cases upward.</p>
                  <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;  // 1 way to climb 1 stair
    dp[2] = 2;  // 2 ways to climb 2 stairs
    
    // Build up the table
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`} language="javascript" />
              </>
            )}
          </div>
        </div>
      </div>

      <Approaches
        approaches={[
          { type: 'choose', label: 'Subproblems', description: 'Recognize: ways(n) depends on ways(n-1) and ways(n-2).' },
          { type: 'recurse', label: 'Recurrence', description: 'dp[i] = dp[i-1] + dp[i-2]. Build from bottom-up.' },
          { type: 'undo', label: 'Fill Table', description: 'Compute dp[3], dp[4], ... up to dp[n] sequentially.' },
          { type: 'base', label: 'Return', description: 'dp[n] contains the answer: total distinct ways.' },
        ]}
        complexity={{
          time: 'O(n) — compute n values once',
          space: 'O(n) — DP array; can optimize to O(1) with two variables',
        }}
      />

      <InterviewNotes
        whatToLookFor={[
          'Recognizing the Fibonacci pattern in the problem',
          'Understanding base cases: dp[1]=1, dp[2]=2',
          'Identifying overlapping subproblems that justify memoization/DP',
        ]}
        commonTraps={[
          'Wrong base cases (treating as standard Fibonacci where F[1]=1, F[2]=1)',
          'Inefficient exponential recursion without memoization',
          'Off-by-one errors in loop bounds',
        ]}
        followUps={[
          'Min Cost Climbing Stairs (LeetCode 746) — add cost array',
          'Generalize: what if you can take 1, 2, or 3 steps?',
          'Space-optimized version using two variables',
        ]}
      />

      <PatternRecognition
        patternName="Dynamic Programming — Fibonacci Recurrence"
        description="Problems reducible to f(n) = f(n-1) + f(n-2) with base cases follow a Fibonacci pattern. Build bottom-up to avoid exponential recursion. Space can be optimized by tracking only the last two values instead of the full array. Similar: Fibonacci Number, House Robber, Max Sum Non-Adjacent Elements."
      />
      </div>
    </div>
  )
}
