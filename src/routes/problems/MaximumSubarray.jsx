import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

function generateSteps(nums) {
  const steps = []
  let maxSum = nums[0]
  let currentSum = nums[0]

  steps.push({
    phase: 'init',
    description: `Initialize: maxSum=${nums[0]}, currentSum=${nums[0]}. Apply Kadane's algorithm.`,
    idx: -1,
    currentSum,
    maxSum,
  })

  for (let i = 1; i < nums.length; i++) {
    const prevSum = currentSum
    const choice = `max(${nums[i]}, ${prevSum} + ${nums[i]})`
    currentSum = Math.max(nums[i], currentSum + nums[i])
    const isReset = currentSum === nums[i]

    steps.push({
      phase: 'deciding',
      description: `At index ${i}: ${choice} = ${currentSum}. Decision: ${isReset ? 'restart' : 'continue'}.`,
      idx: i,
      currentSum,
      maxSum,
      decision: { prevSum, nums_i: nums[i], choice: isReset ? 'restart' : 'continue' },
    })

    if (currentSum > maxSum) {
      maxSum = currentSum
      steps.push({
        phase: 'update',
        description: `✅ New maximum found: ${maxSum} (at index ${i})`,
        idx: i,
        currentSum,
        maxSum,
        isMaxUpdate: true,
      })
    }
  }

  steps.push({
    phase: 'complete',
    description: `✅ Algorithm complete. Maximum subarray sum: ${maxSum}`,
    idx: -1,
    currentSum,
    maxSum,
    result: maxSum,
  })

  return steps
}

export default function MaximumSubarray() {
  const [input, setInput] = useState('-2,1,-3,4,-1,2,1,-5,4')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const nums = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).slice(0, 20)

  useEffect(() => {
    const newSteps = nums.length > 0 ? generateSteps(nums) : []
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [nums])

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

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const currentState = steps[currentStep] || {}

  return (
    <div className="cs-container">
      <PageHeader
        title="53. Maximum Subarray"
        badges={[
          { label: 'Medium', className: 'difficulty-medium' },
          { label: 'Array', className: 'topic' },
          { label: 'Dynamic Programming', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an integer array <code>nums</code>, find the <strong>contiguous subarray</strong> which has the <strong>largest sum</strong>
              and return its sum. A subarray must contain at least one element.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ nums.length ≤ 10⁵</code>
              <span className="constraints-sep">·</span>
              <code>-10⁴ ≤ nums[i] ≤ 10⁴</code>
            </div>
          </div>
        </div>

        <div className="cs-full-width">
          <div className="card input-card">
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nums (comma-separated, max 20):</label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="-2,1,-3,4,-1,2,1,-5,4"
              style={{ width: '100%', padding: 10, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12, fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div className="cs-left">
          <div className="card">
            <h2>Examples</h2>
            <div className="examples-grid">
              <div className="example">
                <strong>Example 1</strong>
                <pre>{`Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has largest sum 6`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  nums = [5,4,-1,7,8]
Output: 23
Explanation: [5,4,-1,7,8] has largest sum`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition — Kadane's Algorithm</h2>
            <p>
              At each position, decide: <strong>continue the current subarray</strong> or <strong>restart a new one</strong>?
            </p>
            <p>
              Keep track of:
            </p>
            <ul>
              <li><code>currentSum</code> — sum of the best subarray ending at current index</li>
              <li><code>maxSum</code> — best answer found so far</li>
            </ul>
            <p>
              At index <code>i</code>, update current sum as: <code>currentSum = max(nums[i], currentSum + nums[i])</code>.
              This is the key greedy choice: extend or restart.
            </p>
          </div>

        <div className="cs-right">
          <div className="card" style={{ minHeight: 400, background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ marginBottom: 16 }}>📊 DP State Visualization</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Bar chart */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Array (with bars):</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 150, paddingBottom: 10, borderBottom: '1px solid var(--color-border)' }}>
                  {nums.map((num, idx) => {
                    const absVal = Math.abs(num)
                    const maxVal = Math.max(...nums.map(Math.abs))
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                        <div style={{
                          height: `${(absVal / maxVal) * 100}px`,
                          width: '100%',
                          background: num < 0 ? '#ef4444' : '#6366f1',
                          borderRadius: 2,
                          opacity: idx === currentState.idx ? 1 : 0.5,
                          transition: 'all 0.3s',
                        }} />
                        <span style={{ fontSize: 9, color: 'rgba(176, 228, 204, 0.7)' }}>{num}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* State values */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'rgba(176, 228, 204, 0.7)' }}>Current Sum:</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent)' }}>{currentState.currentSum}</p>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #10b981', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: '#10b981' }}>Max Sum:</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{currentState.maxSum}</p>
                </div>
              </div>
            </div>
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
            <h2>Code</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
              {[
                { id: 'brute', label: 'Brute Force O(n²)', time: 'O(n²)', space: 'O(1)' },
                { id: 'better', label: 'Divide & Conquer O(n log n)', time: 'O(n log n)', space: 'O(log n)' },
                { id: 'optimal', label: 'Kadane\'s O(n)', time: 'O(n)', space: 'O(1)' },
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
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Check all possible subarrays. For each start index, calculate sum of all subarrays starting there.</p>
                  <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(1)</p>
                </div>
                <ShikiCodeBlock code={`function maxSubArray(nums) {
    let maxSum = nums[0];
    
    // Try all possible subarrays
    for (let i = 0; i < nums.length; i++) {
        let currentSum = 0;
        // From start i, extend to all positions j
        for (let j = i; j < nums.length; j++) {
            currentSum += nums[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }
    return maxSum;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'better' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Divide and conquer. Split array in half, recursively solve left/right/crossing subarrays.</p>
                  <p><strong>Time:</strong> O(n log n) | <strong>Space:</strong> O(log n)</p>
                </div>
                <ShikiCodeBlock code={`function maxSubArray(nums) {
    function helper(nums, left, right) {
        if (left === right) return nums[left];
        
        const mid = Math.floor((left + right) / 2);
        const leftMax = helper(nums, left, mid);
        const rightMax = helper(nums, mid + 1, right);
        
        // Max crossing the midpoint
        let leftSum = 0, maxLeft = -Infinity;
        for (let i = mid; i >= left; i--) {
            leftSum += nums[i];
            maxLeft = Math.max(maxLeft, leftSum);
        }
        
        let rightSum = 0, maxRight = -Infinity;
        for (let i = mid + 1; i <= right; i++) {
            rightSum += nums[i];
            maxRight = Math.max(maxRight, rightSum);
        }
        
        return Math.max(leftMax, rightMax, maxLeft + maxRight);
    }
    return helper(nums, 0, nums.length - 1);
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'optimal' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Kadane's algorithm. Track best sum ending at current position. Extend or restart.</p>
                  <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(1)</p>
                </div>
                <ShikiCodeBlock code={`function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // At each position, decide: extend subarray or restart
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`} language="javascript" />
              </>
            )}
          </div>
        </div>
      </div>

      <Approaches
        approaches={[
          { type: 'choose', label: 'Iterate', description: 'Process each element, deciding to extend or restart subarray.' },
          { type: 'recurse', label: 'Compare', description: 'At each step: max(current + next, start fresh with next element).' },
          { type: 'undo', label: 'Track', description: 'Update both currentSum (local best) and maxSum (global best).' },
          { type: 'base', label: 'Return', description: 'After processing all elements, return maxSum.' },
        ]}
        complexity={{
          time: 'O(n) — single pass through array',
          space: 'O(1) — only track two variables',
        }}
      />

      <InterviewNotes
        whatToLookFor={[
          'Recognizing the problem as greedy + DP hybrid',
          'Understanding why we restart vs extend (key insight of Kadane)',
          'Handling arrays with all negative numbers',
        ]}
        commonTraps={[
          'Not initializing currentSum correctly',
          'Forgetting to update maxSum',
          'Confusing with maximum product subarray (overflow issues)',
        ]}
        followUps={[
          'Return the actual subarray [start, end] indices',
          'Maximum Product Subarray (LeetCode 152)',
          'Minimum Subarray Sum variant',
        ]}
      />

      <PatternRecognition
        patternName="Greedy + Dynamic Programming"
        description="Kadane's algorithm combines greedy choice (extend or restart) with DP tracking. At each position, keep the best sum ending at that position and compare with global best. Similar patterns: Best Time to Buy Stock, House Robber, Jump Game."
      />
      </div>
    </div>
  )
}
