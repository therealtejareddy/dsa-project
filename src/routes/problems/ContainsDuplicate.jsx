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
  const seen = new Set()
  
  steps.push({
    phase: 'init',
    description: `Initialize: nums=[${nums.join(',')}]. Using hash set to track seen values.`,
    idx: -1,
    currentNum: null,
    seen: new Set(),
    hasDuplicate: null,
  })

  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i]
    
    if (seen.has(currentNum)) {
      steps.push({
        phase: 'found',
        description: `✅ Duplicate found! ${currentNum} already exists in set at index ${Array.from(seen).indexOf(currentNum)}`,
        idx: i,
        currentNum,
        seen: new Set(seen),
        hasDuplicate: true,
      })
      return steps
    }
    
    steps.push({
      phase: 'check',
      description: `Iteration ${i}: Check nums[${i}] = ${currentNum}. Not in set yet.`,
      idx: i,
      currentNum,
      seen: new Set(seen),
      hasDuplicate: null,
    })
    
    steps.push({
      phase: 'add',
      description: `Add ${currentNum} to set. Set size: ${seen.size + 1}`,
      idx: i,
      currentNum,
      seen: new Set([...seen, currentNum]),
      hasDuplicate: null,
    })
    
    seen.add(currentNum)
  }

  steps.push({
    phase: 'complete',
    description: `Completed scan. No duplicates found. All ${nums.length} elements are unique.`,
    idx: -1,
    currentNum: null,
    seen,
    hasDuplicate: false,
  })

  return steps
}

export default function ContainsDuplicate() {
  const [input, setInput] = useState('1,2,3,1')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const nums = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).slice(0, 10)

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
  const phaseColors = {
    'init': 'info',
    'check': 'warning',
    'add': 'info',
    'found': 'match',
    'complete': 'info',
  }

  return (
    <div className="cs-container">
      <PageHeader
        title="217. Contains Duplicate"
        badges={[
          { label: 'Easy', className: 'difficulty-easy' },
          { label: 'Array', className: 'topic' },
          { label: 'Hash Table', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given an integer array <code>nums</code>, return <strong>true</strong> if any value appears at least twice in the array,
              and return <strong>false</strong> if every element is distinct.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ nums.length ≤ 10⁵</code>
              <span className="constraints-sep">·</span>
              <code>-10⁹ ≤ nums[i] ≤ 10⁹</code>
            </div>
          </div>
        </div>

        <div className="cs-full-width">
          <div className="card input-card">
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nums (comma-separated, max 10):</label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="1,2,3,1"
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
                <pre>{`Input:  nums = [1,2,3,1]
Output: true
Explanation: 1 appears at index 0 and 2`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  nums = [1,2,3,4]
Output: false
Explanation: All elements are unique`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition</h2>
            <p>
              To detect duplicates efficiently, use a <strong>hash set</strong> to track elements we've already seen.
              As we iterate through the array, check if the current element exists in the set.
            </p>
            <p>
              <strong>Key insight:</strong> Unlike sorting (O(n log n)), a hash set gives us O(1) lookups,
              making the entire algorithm O(n) with O(n) space.
            </p>
          </div>

        <div className="cs-right">
          <div className="card" style={{ minHeight: 400, background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ marginBottom: 16 }}>🔍 Hash Set Visualization</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Current Element */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Current Iteration:</p>
                {currentState.idx >= 0 && currentState.idx < nums.length ? (
                  <div style={{ padding: '12px 16px', background: currentState.hasDuplicate ? '#ef4444' : 'var(--color-primary)', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'var(--color-bg-darkest)', textAlign: 'center' }}>
                    nums[{currentState.idx}] = {currentState.currentNum}
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, fontSize: 12, color: 'rgba(176, 228, 204, 0.5)', textAlign: 'center' }}>
                    —
                  </div>
                )}
              </div>

              {/* Hash Set */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Set (Seen Elements):</p>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12, display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, alignContent: 'flex-start' }}>
                  {currentState.seen && currentState.seen.size > 0 ? (
                    Array.from(currentState.seen).map(val => (
                      <div key={val} style={{ padding: '6px 10px', background: 'var(--color-primary)', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>
                        {val}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.5)' }}>Empty</p>
                  )}
                </div>
              </div>

              {/* Result */}
              {currentState.hasDuplicate !== null && (
                <div style={{
                  padding: '12px 16px',
                  background: currentState.hasDuplicate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  border: `1px solid ${currentState.hasDuplicate ? '#ef4444' : '#10b981'}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: currentState.hasDuplicate ? '#ef4444' : '#10b981',
                  textAlign: 'center'
                }}>
                  {currentState.hasDuplicate ? '✓ true (Duplicate!)' : '✗ false (All unique)'}
                </div>
              )}
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

          <div className={`info-box ${phaseColors[currentState.phase] || 'info'}`}>
            <strong>Step {currentStep + 1} / {steps.length} — {currentState.phase?.toUpperCase()}</strong>
            <p>{currentState.description || 'Ready to start'}</p>
          </div>

          <div className="card">
            <h2>Code</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
              {[
                { id: 'brute', label: 'Brute Force O(n²)', time: 'O(n²)', space: 'O(1)' },
                { id: 'better', label: 'Sort O(n log n)', time: 'O(n log n)', space: 'O(1)' },
                { id: 'optimal', label: 'Hash Set O(n)', time: 'O(n)', space: 'O(n)' },
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
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Check each element against all others. Nested loops to find any match.</p>
                  <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(1)</p>
                </div>
                <ShikiCodeBlock code={`function containsDuplicate(nums) {
    // Check each element against all others
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) {
                return true;
            }
        }
    }
    return false;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'better' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Sort the array, then check adjacent elements for duplicates.</p>
                  <p><strong>Time:</strong> O(n log n) | <strong>Space:</strong> O(1)</p>
                </div>
                <ShikiCodeBlock code={`function containsDuplicate(nums) {
    // Sort array O(n log n)
    nums.sort((a, b) => a - b);
    
    // Check adjacent elements
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === nums[i + 1]) {
            return true;
        }
    }
    return false;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'optimal' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Hash set for O(1) lookups. Iterate once, check if element exists, then add it.</p>
                  <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true; // Found duplicate
        }
        seen.add(num);
    }
    return false;
}`} language="javascript" />
              </>
            )}
          </div>
        </div>
      </div>

      <Approaches
        approaches={[
          { type: 'choose', label: 'Hash Set (Optimal)', description: 'Iterate through array, check if element in set. O(1) lookup with O(n) space.' },
          { type: 'base', label: 'Found', description: 'When any duplicate detected, return true immediately.' },
        ]}
        complexity={{
          time: 'O(n) — single pass with O(1) set lookups',
          space: 'O(min(n, m)) — set stores at most n unique elements',
        }}
      />

      <InterviewNotes
        whatToLookFor={[
          'Understanding of hash set O(1) operations',
          'Recognizing when to use set vs sorting trade-off',
          'Early termination when duplicate is found',
        ]}
        commonTraps={[
          'Using list.count() which is O(n) — inefficient when called in loop',
          'Not considering space-time trade-offs',
          'Mutating input when sorting (not always allowed)',
        ]}
        followUps={[
          'What if memory is limited (O(1) space requirement)?',
          'Find Duplicate Number (LeetCode 287) — similar concept',
          'Permutation Sequence (find k-th permutation)',
        ]}
      />

      <PatternRecognition
        patternName="Hash Set / Hash Map Lookup"
        description="When checking membership or existence in O(1), use hash set. For duplicate detection problems, store seen values in a set and check before processing. Similar patterns: Valid Anagram, Happy Number, Isomorphic Strings."
      />
      </div>
    </div>
  )
}
