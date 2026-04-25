import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import CallStackPanel from '../../components/CallStackPanel'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

function generateOptimalSteps(nums, target) {
  const steps = []
  const seen = {}
  
  steps.push({
    phase: 'init',
    idx: -1,
    currentNum: null,
    complement: null,
    seen: {},
    callStack: [],
    description: `Initialize: nums=[${nums.join(',')}], target=${target}. Using hash map to store seen values.`,
  })
  
  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i]
    const complementNeeded = target - currentNum
    
    const frame = {
      id: i,
      funcName: 'twoSum',
      i,
      currentNum,
      complement: complementNeeded,
      seenSize: Object.keys(seen).length,
    }
    
    steps.push({
      phase: 'check',
      idx: i,
      currentNum,
      complement: complementNeeded,
      seen: { ...seen },
      callStack: [frame],
      description: `Iteration ${i}: num=${currentNum}. Need complement=${complementNeeded}. Hash map size=${Object.keys(seen).length}.`,
    })
    
    if (complementNeeded in seen) {
      steps.push({
        phase: 'found',
        idx: i,
        currentNum,
        complement: complementNeeded,
        seen: { ...seen },
        callStack: [frame],
        result: [seen[complementNeeded], i],
        description: `✅ Found! Complement ${complementNeeded} exists at index ${seen[complementNeeded]}. Result: [${seen[complementNeeded]}, ${i}]`,
      })
      return steps
    }
    
    steps.push({
      phase: 'store',
      idx: i,
      currentNum,
      complement: null,
      seen: { ...seen },
      callStack: [frame],
      description: `Store: map[${currentNum}] = ${i}`,
    })
    
    seen[currentNum] = i
  }
  
  steps.push({
    phase: 'no-solution',
    idx: -1,
    currentNum: null,
    complement: null,
    seen: { ...seen },
    callStack: [],
    description: `No solution found. Completed iteration through all elements.`,
  })
  
  return steps
}

export default function TwoSum() {
  const [input, setInput] = useState('2,7,11,15')
  const [targetInput, setTargetInput] = useState('9')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const nums = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
  const target = parseInt(targetInput)

  useEffect(() => {
    const newSteps = nums.length > 0 ? generateOptimalSteps(nums, target) : []
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [nums, target])

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
    'store': 'info',
    'found': 'match',
    'no-solution': 'warning',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)' }}>
      <PageHeader num={1} title="Two Sum" badges={[{ label: 'Easy', className: 'difficulty-easy' },
          { label: 'Array', className: 'topic' },]} />
      
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 40 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Problem Statement */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>📋 Problem</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(176, 228, 204, 0.85)', marginBottom: 12 }}>
                Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to the target.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(176, 228, 204, 0.85)', marginBottom: 12 }}>
                You may assume each input has exactly one solution, and you cannot use the same element twice.
              </p>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 12, marginTop: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Constraints:</p>
                <ul style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.7)', marginLeft: 20 }}>
                  <li>2 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>-10⁹ ≤ target ≤ 10⁹</li>
                </ul>
              </div>
            </div>

            {/* Examples */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>📝 Examples</h2>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                <p style={{ fontSize: 12, color: 'var(--color-warning)', marginBottom: 6 }}>Input:</p>
                <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-accent)' }}>nums = [2,7,11,15], target = 9</p>
                <p style={{ fontSize: 12, color: 'var(--color-warning)', marginTop: 8, marginBottom: 6 }}>Output:</p>
                <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-success)' }}>[0,1]</p>
              </div>
            </div>

            {/* Input */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>⚙️ Input</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nums (comma-separated):</label>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{ width: '100%', padding: 10, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12, fontFamily: 'monospace' }}
                    placeholder="2,7,11,15"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Target:</label>
                  <input
                    type="text"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    style={{ width: '100%', padding: 10, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12, fontFamily: 'monospace' }}
                    placeholder="9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Visualizer */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20, minHeight: 300 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--color-accent)' }}>🔍 Hash Map Visualization</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Array */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Array:</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                    {nums.map((num, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          padding: '8px 12px',
                          background: idx === currentState.idx ? 'var(--color-warning)' : 'var(--color-primary)',
                          borderRadius: 6,
                          fontWeight: 700,
                          color: 'var(--color-bg-darkest)',
                          fontSize: 12,
                          transition: 'all 0.3s'
                        }}>
                          {num}
                        </div>
                        <span style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.6)' }}>i={idx}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hash Map */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Hash Map (value → index):</p>
                  <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12, minHeight: 60, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start' }}>
                    {Object.entries(currentState.seen || {}).length > 0 ? (
                      Object.entries(currentState.seen).map(([k, v]) => (
                        <div key={k} style={{
                          padding: '6px 10px',
                          background: 'var(--color-primary)',
                          borderRadius: 4,
                          fontSize: 11,
                          fontFamily: 'monospace',
                          fontWeight: 600
                        }}>
                          {k} → {v}
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.5)' }}>Empty</p>
                    )}
                  </div>
                </div>

                {/* Result */}
                {currentState.result && (
                  <div style={{ padding: 12, background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--color-success)', borderRadius: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>✅ Result: [{currentState.result.join(', ')}]</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <PlaybackControls
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
              canNext={currentStep < steps.length - 1}
              canPrev={currentStep > 0}
            />

            <ProgressBar current={currentStep + 1} total={steps.length} />

            {/* Description/Info */}
            <div style={{ background: phaseColors[currentState.phase] === 'match' ? 'rgba(34, 197, 94, 0.1)' : phaseColors[currentState.phase] === 'warning' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(64, 138, 113, 0.1)', border: `1px solid ${phaseColors[currentState.phase] === 'match' ? 'var(--color-success)' : phaseColors[currentState.phase] === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'}`, borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--color-accent)', lineHeight: 1.6 }}>
                {currentState.description || 'Ready to start'}
              </p>
            </div>

            {/* Call Stack */}
            {currentState.callStack && currentState.callStack.length > 0 && (
              <CallStackPanel frames={currentState.callStack} />
            )}

            {/* Code */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>💻 Solutions</h2>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
                {[
                  { id: 'brute', label: 'Brute Force O(n²)', time: 'O(n²)', space: 'O(1)' },
                  { id: 'better', label: 'Two Pointers O(n log n)', time: 'O(n log n)', space: 'O(1)' },
                  { id: 'optimal', label: 'Hash Map O(n)', time: 'O(n)', space: 'O(n)' },
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
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Check every pair of numbers</p>
                    <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(1)</p>
                  </div>
                  <ShikiCodeBlock code={`def twoSum(nums, target):
    # Check every pair
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`} language="python" />
                </>
              )}

              {selectedApproach === 'better' && (
                <>
                  <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Sort + Two Pointers</p>
                    <p><strong>Time:</strong> O(n log n) | <strong>Space:</strong> O(1)</p>
                  </div>
                  <ShikiCodeBlock code={`def twoSum(nums, target):
    # Create array of (value, original_index)
    indexed = [(val, idx) for idx, val in enumerate(nums)]
    indexed.sort()
    
    left, right = 0, len(indexed) - 1
    while left < right:
        total = indexed[left][0] + indexed[right][0]
        if total == target:
            return [indexed[left][1], indexed[right][1]]
        elif total < target:
            left += 1
        else:
            right -= 1
    return []`} language="python" />
                </>
              )}

              {selectedApproach === 'optimal' && (
                <>
                  <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Hash Map with O(1) Lookup</p>
                    <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
                  </div>
                  <ShikiCodeBlock code={`def twoSum(nums, target):
    # Store value -> index in map
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        # Check if complement exists
        if complement in seen:
            return [seen[complement], i]
        # Store current number
        seen[num] = i
    return []`} language="python" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Approaches */}
        <Approaches
          approaches={[
            {
              type: 'choose',
              label: 'Brute Force',
              description: 'Check every pair of numbers. Nested loops iterate through all combinations.',
            },
            {
              type: 'recurse',
              label: 'Hash Map (Optimal)',
              description: 'For each number, check if complement exists in hash map. Store seen numbers for O(1) lookup.',
            },
          ]}
          complexity={{
            time: 'Brute: O(n²) | Hash Map: O(n)',
            space: 'Brute: O(1) | Hash Map: O(n)',
          }}
        />

        <InterviewNotes
          whatToLookFor={[
            'Understanding of hash map lookups and O(1) retrieval',
            'Ability to identify complement value (target − current)',
            'Knowledge of trade-off between time and space complexity',
          ]}
          commonTraps={[
            'Not checking if complement exists before accessing hash map',
            'Using the same element twice (must ensure different indices)',
            'Modifying map during iteration',
          ]}
          followUps={[
            'What if there are multiple solutions?',
            'How would you handle duplicates in the array?',
            '3Sum problem (find three numbers equal to target)',
            'Two Sum II (sorted array variant)',
          ]}
        />

        <PatternRecognition
          patternName="Hash Map / Complementary Lookup"
          description="When searching for pairs with a target sum, use a hash map to store seen values. For each number, calculate the complement needed and check if it exists in O(1) time. This transforms the problem from O(n²) to O(n). Similar patterns: 3Sum, 4Sum, Two Sum II, Valid Anagram."
        />
      </div>
    </div>
  )
}
