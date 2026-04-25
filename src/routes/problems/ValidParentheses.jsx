import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import CallStackPanel from '../../components/CallStackPanel'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

function generateSteps(s) {
  const steps = []
  const stack = []
  const pairs = { '(': ')', '[': ']', '{': '}' }

  steps.push({
    phase: 'init',
    description: `Initialize: s="${s}". Using stack to match brackets.`,
    char: null,
    stack: [],
    idx: -1,
    isValid: null,
  })

  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    
    if ('([{'.includes(char)) {
      steps.push({
        phase: 'push',
        description: `Push opening bracket '${char}' onto stack`,
        char,
        stack: [...stack],
        idx: i,
        isValid: null,
      })
      stack.push(char)
      steps.push({
        phase: 'pushed',
        description: `${char} added. Stack: [${stack.join(', ')}]`,
        char,
        stack: [...stack],
        idx: i,
        isValid: null,
      })
    } else {
      if (stack.length === 0) {
        steps.push({
          phase: 'invalid',
          description: `❌ Closing bracket '${char}' found but stack is empty — mismatch!`,
          char,
          stack: [...stack],
          idx: i,
          isValid: false,
        })
        return steps
      }
      
      const top = stack[stack.length - 1]
      if (pairs[top] !== char) {
        steps.push({
          phase: 'invalid',
          description: `❌ Top of stack is '${top}' (matches '${pairs[top]}'), but found '${char}' — mismatch!`,
          char,
          stack: [...stack],
          idx: i,
          isValid: false,
        })
        return steps
      }
      
      steps.push({
        phase: 'match',
        description: `Match found! Pop '${top}' and match with '${char}'`,
        char,
        stack: [...stack],
        idx: i,
        isValid: null,
      })
      stack.pop()
      steps.push({
        phase: 'popped',
        description: `${char} matched. Stack: [${stack.length > 0 ? stack.join(', ') : 'empty'}]`,
        char,
        stack: [...stack],
        idx: i,
        isValid: null,
      })
    }
  }

  const finalIsValid = stack.length === 0
  steps.push({
    phase: 'complete',
    description: finalIsValid ? `✅ Valid! All ${s.length} brackets matched. Stack is empty.` : `❌ Invalid. Stack not empty: [${stack.join(', ')}]`,
    char: null,
    stack: [...stack],
    idx: -1,
    isValid: finalIsValid,
  })

  return steps
}

export default function ValidParentheses() {
  const [input, setInput] = useState('()')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  useEffect(() => {
    const newSteps = input.length > 0 ? generateSteps(input) : []
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [input])

  function renderStackFrame(frame) {
    return (
      <>
        <div className="csp-frame-name">isValid()</div>
        <div className="csp-frame-vars">
          <span className="csp-var"><span className="csp-var-k">idx</span>={frame.idx}</span>
          <span className="csp-var"><span className="csp-var-k">char</span>='{frame.char}'</span>
          <span className="csp-var"><span className="csp-var-k">stack.size</span>={frame.stackSize}</span>
        </div>
      </>
    )
  }

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
        title="20. Valid Parentheses"
        badges={[
          { label: 'Easy', className: 'difficulty-easy' },
          { label: 'String', className: 'topic' },
          { label: 'Stack', className: 'topic' },
        ]}
      />

      <div className="cs-main">
        <div className="cs-full-width">
          <div className="card">
            <h2>Problem Statement</h2>
            <p>
              Given a string <code>s</code> containing just the characters <strong>'(', ')', '{', '}', '[' and ']'</strong>,
              determine if the input string is <strong>valid</strong>.
            </p>
            <p>
              An input string is valid if every <strong>opening bracket</strong> has a corresponding <strong>closing bracket</strong> in the correct order.
            </p>
            <div className="constraints-line">
              <span className="constraints-title">Constraints:</span>
              <code>1 ≤ s.length ≤ 10⁴</code>
              <span className="constraints-sep">·</span>
              <code>s contains only: ( ) [ ] {'{'} {'}'}</code>
            </div>
          </div>
        </div>

        <div className="cs-full-width">
          <div className="card input-card">
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>String (brackets only):</label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value.replace(/[^()\[\]{}]/g, ''))}
              placeholder="()[]"
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
                <pre>{`Input:  s = "()"
Output: true`}</pre>
              </div>
              <div className="example">
                <strong>Example 2</strong>
                <pre>{`Input:  s = "()[]{}"
Output: true`}</pre>
              </div>
              <div className="example">
                <strong>Example 3</strong>
                <pre>{`Input:  s = "(]"
Output: false
Explanation: Type mismatch`}</pre>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Intuition — Stack Strategy</h2>
            <p>
              Use a <strong>stack</strong> to track opening brackets:
            </p>
            <ul>
              <li><strong>Opening bracket</strong> → push onto stack</li>
              <li><strong>Closing bracket</strong> → must match the top of stack</li>
            </ul>
            <p>
              At the end, the stack must be empty (all brackets matched).
            </p>
            <p>
              Key insight: Brackets must close in the reverse order they opened (LIFO — Last In, First Out).
            </p>
          </div>

        <div className="cs-right">
          <div className="card" style={{ minHeight: 400, background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ marginBottom: 16 }}>🔤 String & Stack</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* String characters */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>String:</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                  {input.split('').map((char, idx) => (
                    <div key={idx} style={{
                      padding: '8px 10px',
                      background: idx === currentState.idx ? '#ea8c55' : '#6366f1',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      opacity: idx <= (currentState.idx || -1) ? 1 : 0.5,
                      transition: 'all 0.3s',
                    }}>
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack visualization */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(176, 228, 204, 0.7)' }}>Stack (LIFO):</p>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12, minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 4, border: '1px solid var(--color-border)' }}>
                  {(currentState.stack || []).length > 0 ? (
                    (currentState.stack || []).map((item, idx) => (
                      <div key={idx} style={{
                        padding: '8px 12px',
                        background: '#6366f1',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#000',
                      }}>
                        {item}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.5)', textAlign: 'center', paddingTop: 20 }}>Empty</p>
                  )}
                </div>
              </div>

              {/* Result */}
              {currentState.isValid !== null && (
                <div style={{
                  padding: '12px 16px',
                  background: currentState.isValid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${currentState.isValid ? '#10b981' : '#ef4444'}`,
                  borderRadius: 8,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: currentState.isValid ? '#10b981' : '#ef4444',
                  fontSize: 13,
                }}>
                  {currentState.isValid ? '✅ Valid' : '❌ Invalid'}
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

          <div className="info-box info">
            <strong>Step {currentStep + 1} / {steps.length} — {currentState.phase?.toUpperCase()}</strong>
            <p>{currentState.description || 'Ready to start'}</p>
          </div>

          <div className="card">
            <h2>Code</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
              {[
                { id: 'brute', label: 'Brute Recursion O(n³)', time: 'O(n³)', space: 'O(n)' },
                { id: 'better', label: 'Memoized Recursion O(n²)', time: 'O(n²)', space: 'O(n²)' },
                { id: 'optimal', label: 'Stack LIFO O(n)', time: 'O(n)', space: 'O(n)' },
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
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Recursion with string replacement. Find and remove matching pairs repeatedly.</p>
                  <p><strong>Time:</strong> O(n³) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function isValid(s) {
    // Keep removing matching pairs until none left
    while (s.includes('()') || 
           s.includes('[]') || 
           s.includes('{}')) {
        s = s.replace('()', '')
              .replace('[]', '')
              .replace('{}', '');
    }
    return s.length === 0;
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'better' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Recursion with memoization. Cache results for subproblems to avoid recomputation.</p>
                  <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(n²)</p>
                </div>
                <ShikiCodeBlock code={`function isValid(s) {
    const memo = {};
    
    function helper(str) {
        if (str in memo) return memo[str];
        if (str.length === 0) return true;
        
        for (let i = 0; i < str.length - 1; i++) {
            const pair = str[i] + str[i + 1];
            if (pair === '()' || pair === '[]' || pair === '{}') {
                const newStr = str.slice(0, i) + str.slice(i + 2);
                if (helper(newStr)) {
                    memo[str] = true;
                    return true;
                }
            }
        }
        memo[str] = false;
        return false;
    }
    return helper(s);
}`} language="javascript" />
              </>
            )}

            {selectedApproach === 'optimal' && (
              <>
                <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Stack LIFO. Push opening brackets, pop and match on closing. Empty stack at end = valid.</p>
                  <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
                </div>
                <ShikiCodeBlock code={`function isValid(s) {
    const stack = [];
    const pairs = {'(': ')', '[': ']', '{': '}'};
    
    for (const char of s) {
        if (char in pairs) {
            // Opening bracket - push
            stack.push(char);
        } else {
            // Closing bracket - must match top
            if (stack.length === 0 || 
                pairs[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`} language="javascript" />
              </>
            )}
          </div>
        </div>
      </div>

      <Approaches
        approaches={[
          { type: 'choose', label: 'Scan', description: 'Iterate through each character in the string.' },
          { type: 'recurse', label: 'Push/Match', description: 'Opening → push to stack. Closing → check & pop from top.' },
          { type: 'undo', label: 'Validate', description: 'Ensure closing bracket matches the opening bracket type.' },
          { type: 'base', label: 'Finish', description: 'After scan, stack must be empty for valid result.' },
        ]}
        complexity={{
          time: 'O(n) — single pass through string',
          space: 'O(n) — stack can store up to n/2 opening brackets',
        }}
      />

      <InterviewNotes
        whatToLookFor={[
          'Understanding LIFO (Last In, First Out) principle of stacks',
          'Checking both type matching AND order correctness',
          'Handling empty stack edge case',
        ]}
        commonTraps={[
          'Popping from empty stack without checking',
          'Only checking if brackets match, not their type',
          'Forgetting to verify empty stack at the end',
        ]}
        followUps={[
          'Generate All Valid Parentheses Combinations (LeetCode 22)',
          'Remove Invalid Parentheses (LeetCode 301)',
          'Minimum Remove to Make Valid Parentheses',
        ]}
      />

      <PatternRecognition
        patternName="Stack — Matching Pairs / Nested Structures"
        description="Use stack for problems requiring LIFO matching: nested brackets, function calls, undo/redo operations. Push elements when opening tokens arrive, pop and validate when closing tokens arrive. The stack ensures correct nesting order (innermost closes first)."
      />
      </div>
    </div>
  )
}
