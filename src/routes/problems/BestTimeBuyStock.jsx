import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import PlaybackControls from '../../components/PlaybackControls'
import ProgressBar from '../../components/ProgressBar'
import CallStackPanel from '../../components/CallStackPanel'
import ShikiCodeBlock from '../../components/ShikiCodeBlock'
import Approaches from '../../components/Approaches'
import InterviewNotes from '../../components/InterviewNotes'
import PatternRecognition from '../../components/PatternRecognition'

function generateSteps(prices) {
  const steps = []
  
  steps.push({
    phase: 'init',
    idx: -1,
    minPrice: prices[0],
    maxProfit: 0,
    callStack: [],
    description: `Initialize: minPrice=${prices[0]}, maxProfit=0. Scan prices to find best buy/sell opportunity.`,
  })

  let minPrice = prices[0]
  let maxProfit = 0

  for (let i = 1; i < prices.length; i++) {
    const profit = prices[i] - minPrice
    
    const frame = {
      id: i,
      funcName: 'maxProfit',
      i,
      currentPrice: prices[i],
      minPrice,
      profit,
    }

    steps.push({
      phase: 'check',
      idx: i,
      minPrice,
      maxProfit,
      currentPrice: prices[i],
      profit,
      callStack: [frame],
      description: `Day ${i}: Price=${prices[i]}. Profit if sold today=${profit}. Current max=${maxProfit}.`,
    })

    if (profit > maxProfit) {
      maxProfit = profit
      steps.push({
        phase: 'update',
        idx: i,
        minPrice,
        maxProfit,
        currentPrice: prices[i],
        profit,
        callStack: [frame],
        description: `✅ New max profit: ${maxProfit} (buy @${minPrice}, sell @${prices[i]})`,
      })
    }

    if (prices[i] < minPrice) {
      minPrice = prices[i]
      steps.push({
        phase: 'newmin',
        idx: i,
        minPrice,
        maxProfit,
        currentPrice: prices[i],
        profit,
        callStack: [frame],
        description: `New min price: ${minPrice} at day ${i}`,
      })
    }
  }

  steps.push({
    phase: 'done',
    idx: -1,
    minPrice,
    maxProfit,
    callStack: [],
    result: maxProfit,
    description: `Complete! Maximum profit: ${maxProfit}`,
  })

  return steps
}

export default function BestTimeBuyStock() {
  const [input, setInput] = useState('7,1,5,3,6,4')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [steps, setSteps] = useState([])
  const [selectedApproach, setSelectedApproach] = useState('optimal')
  const playIntervalRef = useRef(null)

  const prices = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))

  useEffect(() => {
    const newSteps = prices.length > 0 ? generateSteps(prices) : []
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [prices])

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
  const phaseColors = { 'init': 'info', 'check': 'warning', 'update': 'match', 'newmin': 'info', 'done': 'match' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)' }}>
      <PageHeader num={121} title="Best Time to Buy and Sell Stock" badges={[
        { label: 'Easy', className: 'difficulty-easy' },
        { label: 'Array', className: 'topic' },
        { label: 'Greedy', className: 'topic' },
      ]} />
      
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 40 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Problem Statement */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>📋 Problem</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(176, 228, 204, 0.85)', marginBottom: 12 }}>
                You are given an array <code>prices</code> where <code>prices[i]</code> is the price on day <code>i</code>.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(176, 228, 204, 0.85)', marginBottom: 12 }}>
                Maximize profit by choosing one day to buy and a different future day to sell. Return maximum profit, or 0 if no profit possible.
              </p>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 12, marginTop: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Constraints:</p>
                <ul style={{ fontSize: 12, color: 'rgba(176, 228, 204, 0.7)', marginLeft: 20 }}>
                  <li>1 ≤ prices.length ≤ 10⁵</li>
                  <li>0 ≤ prices[i] ≤ 10⁴</li>
                </ul>
              </div>
            </div>

            {/* Examples */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>📝 Examples</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-warning)', marginBottom: 4 }}>Example 1:</p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-accent)', marginBottom: 4 }}>prices = [7,1,5,3,6,4]</p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-success)' }}>Output: 5 (buy @1, sell @6)</p>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-warning)', marginBottom: 4 }}>Example 2:</p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-accent)', marginBottom: 4 }}>prices = [7,6,4,3,1]</p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-success)' }}>Output: 0 (prices only decrease)</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>⚙️ Input</h2>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Prices (comma-separated):</label>
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                style={{ width: '100%', padding: 10, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--color-primary)', borderRadius: 6, color: 'var(--color-accent)', fontSize: 12, fontFamily: 'monospace' }}
                placeholder="7,1,5,3,6,4"
              />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Visualizer */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20, minHeight: 300 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--color-accent)' }}>📊 Price Chart</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 180, marginBottom: 20, paddingBottom: 10 }}>
                {prices.map((price, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                    <div style={{
                      height: `${(price / Math.max(...prices, 1)) * 140}px`,
                      background: idx === currentState.idx ? 'var(--color-warning)' : 'var(--color-primary)',
                      borderRadius: 4,
                      transition: 'all 0.3s',
                      minHeight: 15
                    }} />
                    <span style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.6)', fontWeight: 600 }}>{price}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(64, 138, 113, 0.2)', border: '1px solid var(--color-primary)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(176, 228, 204, 0.6)', marginBottom: 4 }}>Min Price</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent)' }}>{currentState.minPrice !== undefined ? currentState.minPrice : '—'}</p>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--color-success)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(176, 228, 204, 0.6)', marginBottom: 4 }}>Max Profit</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-success)' }}>{currentState.maxProfit !== undefined ? currentState.maxProfit : '—'}</p>
                </div>
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

            {/* Description */}
            <div style={{ background: phaseColors[currentState.phase] === 'match' ? 'rgba(34, 197, 94, 0.1)' : phaseColors[currentState.phase] === 'warning' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(64, 138, 113, 0.1)', border: `1px solid ${phaseColors[currentState.phase] === 'match' ? 'var(--color-success)' : phaseColors[currentState.phase] === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'}`, borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--color-accent)', lineHeight: 1.6 }}>{currentState.description || 'Ready to start'}</p>
            </div>

            {/* Call Stack */}
            {currentState.callStack && currentState.callStack.length > 0 && <CallStackPanel frames={currentState.callStack} />}

            {/* Code */}
            <div style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--color-accent)' }}>💻 Solutions</h2>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
                {[
                  { id: 'brute', label: 'Brute Force O(n²)', time: 'O(n²)', space: 'O(1)' },
                  { id: 'better', label: 'Greedy O(n)', time: 'O(n)', space: 'O(1)' },
                  { id: 'optimal', label: 'Optimal O(n)', time: 'O(n)', space: 'O(1)' },
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
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Check every pair of prices. For each buy day, try selling on all future days.</p>
                    <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(1)</p>
                  </div>
                  <ShikiCodeBlock code={`def maxProfit(prices):
    maxProfit = 0
    # Try all buy days
    for i in range(len(prices)):
        # Try all sell days after buy day
        for j in range(i + 1, len(prices)):
            profit = prices[j] - prices[i]
            maxProfit = max(maxProfit, profit)
    return maxProfit`} language="python" />
                </>
              )}

              {selectedApproach === 'better' && (
                <>
                  <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Single pass with greedy tracking. Keep running minimum price and calculate profit at each step.</p>
                    <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(1)</p>
                  </div>
                  <ShikiCodeBlock code={`def maxProfit(prices):
    minPrice = prices[0]
    maxProfit = 0
    # Single pass - at each price, compute profit if sold today
    for price in prices[1:]:
        profit = price - minPrice
        maxProfit = max(maxProfit, profit)
        minPrice = min(minPrice, price)
    return maxProfit`} language="python" />
                </>
              )}

              {selectedApproach === 'optimal' && (
                <>
                  <div style={{ fontSize: 12, marginBottom: 12, color: 'rgba(176, 228, 204, 0.8)' }}>
                    <p style={{ marginBottom: 8 }}><strong>Approach:</strong> Optimal greedy solution. Best profit = current price − minimum seen so far. Track both in one pass.</p>
                    <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(1)</p>
                  </div>
                  <ShikiCodeBlock code={`def maxProfit(prices):
    minPrice = prices[0]
    maxProfit = 0
    for price in prices[1:]:
        # Best profit possible if selling at current price
        profit = price - minPrice
        maxProfit = max(maxProfit, profit)
        # Update minimum only if current is lower
        if price < minPrice:
            minPrice = price
    return maxProfit`} language="python" />
                </>
              )}
            </div>
          </div>
        </div>

        <Approaches
          approaches={[
            {
              type: 'choose',
              label: 'Scan Left to Right',
              description: 'Track minimum price encountered so far.',
            },
            {
              type: 'recurse',
              label: 'Calculate Profit',
              description: 'At each price, compute potential profit (current - min) and update maximum.',
            },
            {
              type: 'base',
              label: 'Single Pass Complete',
              description: 'Return the maximum profit found in O(n) time.',
            },
          ]}
          complexity={{
            time: 'O(n) — single scan through prices',
            space: 'O(1) — only store two variables',
          }}
        />

        <InterviewNotes
          whatToLookFor={[
            'Identifying the greedy approach: track minimum as you scan',
            'Understanding why this works (best profit = current - global min so far)',
            'Handling edge cases: all decreasing, single element, empty array',
          ]}
          commonTraps={[
            'Trying to look ahead at future prices',
            'Not tracking minimum separately from profit calculation',
            'Forgetting that sell must happen after buy (later index)',
          ]}
          followUps={[
            'Best Time Buy Sell Stock II (122) — multiple transactions',
            'Best Time Buy Sell Stock III (123) — at most 2 transactions',
            'Best Time Buy Sell Stock IV (188) — at most k transactions',
            'Best Time Buy Sell Stock Cooldown (309) — with cooldown period',
          ]}
        />

        <PatternRecognition
          patternName="Greedy — One Pass with Running Minimum"
          description="Track a running minimum while scanning left-to-right. At each step, calculate result using current value and min. Update both as needed. Converts O(n²) comparison approach to O(n). Key insight: future profit = current price - minimum seen so far."
        />
      </div>
    </div>
  )
}
