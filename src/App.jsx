import React, { useState, useMemo, useRef } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

const QUESTIONS = [
  { id: 1, text: 'I can clearly state what my specific goal is.', category: 'vision' },
  { id: 2, text: 'I know exactly how I will measure success once I reach it.', category: 'vision' },
  { id: 3, text: 'I understand the deeper purpose or value this goal serves in my life.', category: 'vision' },
  { id: 4, text: 'I know which areas of my life will be most impacted by achieving this goal.', category: 'vision' },

  { id: 5, text: 'I am aware of my strengths and skills that will help me succeed.', category: 'start' },
  { id: 6, text: 'I know where I have gaps in knowledge, experience, or resources.', category: 'start' },
  { id: 7, text: 'I reflect on past successes and failures to guide my current approach.', category: 'start' },

  { id: 8, text: 'I know what motivates me most (growth, mastery, recognition, financial, etc.).', category: 'mindset' },
  { id: 9, text: 'I stay committed to my goals even when faced with doubts or setbacks.', category: 'mindset' },
  { id: 10, text: "I can reframe 'failure' as feedback rather than a final judgment.", category: 'mindset' },

  { id: 11, text: 'I have broken down my big goal into smaller milestones.', category: 'plan' },
  { id: 12, text: 'I track my progress regularly against those milestones.', category: 'plan' },
  { id: 13, text: 'I follow daily or weekly habits directly connected to my goal.', category: 'plan' },
  { id: 14, text: 'I can translate big tasks into smaller, manageable steps.', category: 'plan' },

  { id: 15, text: 'I have mentors, peers, or experts who can guide me.', category: 'support' },
  { id: 16, text: 'I know what tools, courses, or communities I can use to grow faster.', category: 'support' },
  { id: 17, text: 'I allocate my time, energy, and money effectively toward my goal.', category: 'support' },

  { id: 18, text: 'I recognize my internal obstacles (procrastination, fear, self-doubt).', category: 'risks' },
  { id: 19, text: 'I anticipate external obstacles (lack of resources, competing priorities).', category: 'risks' },
  { id: 20, text: 'I have backup plans in case things go wrong.', category: 'risks' },

  { id: 21, text: 'I have regular self-care practices (exercise, rest, mindfulness).', category: 'resilience' },
  { id: 22, text: 'I celebrate small wins to keep myself motivated.', category: 'resilience' },
  { id: 23, text: 'I use mental strategies (visualization, affirmations, reframing) to stay strong when facing challenges.', category: 'resilience' },

  { id: 24, text: "I use clear metrics or indicators to track whether I'm improving.", category: 'reflect' },
  { id: 25, text: "I review my progress regularly and reflect on what's working.", category: 'reflect' },
  { id: 26, text: 'I know when to adjust my strategy versus when to stay consistent.', category: 'reflect' },
]

const CATEGORY_META = {
  vision: { label: 'Clarify Vision' },
  start: { label: 'Assess Starting Point' },
  mindset: { label: 'Motivation & Mindset' },
  plan: { label: 'Action Plan' },
  support: { label: 'Resources & Support' },
  risks: { label: 'Obstacles & Risks' },
  resilience: { label: 'Resilience & Toughness' },
  reflect: { label: 'Reflect & Adjust' },
}

export default function App() {
  const initialAnswers = useMemo(() => {
    const m = {}
    QUESTIONS.forEach((q) => (m[q.id] = 0))
    return m
  }, [])

  const [answers, setAnswers] = useState(initialAnswers)
  const [showResults, setShowResults] = useState(false)
  const printableRef = useRef(null)

  function handleAnswer(qId, value) {
    setAnswers((s) => ({ ...s, [qId]: value }))
  }

  function calculateScores() {
    const catTotals = {}
    Object.keys(CATEGORY_META).forEach((k) => (catTotals[k] = { total: 0, count: 0 }))

    QUESTIONS.forEach((q) => {
      const v = Number(answers[q.id] || 0)
      catTotals[q.category].total += v
      catTotals[q.category].count += 1
    })

    const catScores = Object.entries(catTotals).map(([key, { total, count }]) => {
      const max = count * 5
      const pct = max === 0 ? 0 : Math.round((total / max) * 100)
      return { key, label: CATEGORY_META[key].label, score: pct }
    })

    const overall = Math.round(catScores.reduce((acc, c) => acc + c.score, 0) / catScores.length)

    let readinessLabel = 'Not Ready'
    if (overall >= 80) readinessLabel = 'Highly Prepared & Goal-Ready'
    else if (overall >= 60) readinessLabel = 'Prepared, needs refinement'
    else if (overall >= 40) readinessLabel = 'Building Awareness'

    return { catScores, overall, readinessLabel }
  }

  const results = useMemo(() => calculateScores(), [answers])

  function handleSubmit(e) {
    e.preventDefault()
    setShowResults(true)
    setTimeout(() => {
      const el = document.getElementById('results-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }

  function handleReset() {
    setAnswers(initialAnswers)
    setShowResults(false)
  }

  function exportScorecard() {
    const originalTitle = document.title
    document.title = `Self-Assessment Scorecard - ${new Date().toLocaleString()}`
    window.print()
    document.title = originalTitle
  }

  const radarData = results.catScores.map((c) => ({ subject: c.label, A: c.score }))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <header className="mb-6 text-center">
  {/* logo from public/logo.png */}
  <img src="/logo.png" alt="Your Goal Scorecard" className="mx-auto w-48" />
  <p className="text-xs text-gray-600 mt-1">
    Designed &amp; Developed by <strong>Mara Mareeswaran @indiamarees</strong>
  </p>
</header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Q{q.id}. {q.text}</div>
                    <div className="text-xs text-gray-500 mt-1">Category: {CATEGORY_META[q.category].label}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {[1,2,3,4,5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleAnswer(q.id, n)}
                        className={`w-8 h-8 rounded-full text-sm font-medium border flex items-center justify-center focus:outline-none ${answers[q.id]===n ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                        aria-label={`Select ${n}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-md border text-sm">Reset</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">See Scorecard</button>
          </div>
        </form>

        {showResults && (
          <section id="results-section" className="mt-8" ref={printableRef}>
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Your Scorecard</h2>
                  <p className="text-sm text-gray-600 mt-1">Overall readiness: <span className="font-medium">{results.overall}%</span> — {results.readinessLabel}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={exportScorecard} className="px-3 py-2 rounded-md border text-sm">Print / Export</button>
                  <button onClick={() => navigator.clipboard?.writeText(JSON.stringify({ answers }))} className="px-3 py-2 rounded-md border text-sm">Copy responses JSON</button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="You" dataKey="A" stroke="#3182CE" fill="#3182CE" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <div className="space-y-3">
                    {results.catScores.map((c) => (
                      <div key={c.key} className="p-3 rounded-md border bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{c.label}</div>
                          <div className="text-sm font-semibold">{c.score}%</div>
                        </div>
                        <Progress percent={c.score} />
                        <CategoryInsight categoryKey={c.key} score={c.score} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold">Personalized Action Tips</h3>
                <ul className="list-disc ml-5 mt-2 text-sm space-y-1 text-gray-700">
                  {generateTips(results.catScores)}
                </ul>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

function Progress({ percent = 0 }) {
  return (
    <div className="w-full bg-white border rounded-full h-3 mt-2 overflow-hidden">
      <div style={{ width: `${percent}%` }} className="h-3 bg-blue-500" />
    </div>
  )
}

function CategoryInsight({ categoryKey, score }) {
  const low = score < 50
  const mid = score >= 50 && score < 75

  let text = ''
  switch (categoryKey) {
    case 'vision':
      text = low ? 'Clarify your goal — write a specific statement and measurable success criteria.'
        : mid ? 'Your vision is OK. Make it more specific and tie it to personal values.'
        : 'Clear vision. Keep revisiting it as you make progress.'
      break
    case 'start':
      text = low ? 'Map your current skills vs required skills; identify one quick learning step.'
        : mid ? 'You have useful strengths — focus on closing the top 1-2 gaps.'
        : 'Strong starting point — leverage your strengths to accelerate progress.'
      break
    case 'mindset':
      text = low ? 'Work on reframing setbacks and building intrinsic motivation (journaling, purpose).'
        : mid ? 'Keep strengthening growth mindset; practice reflection after setbacks.'
        : 'Healthy mindset — use it to push through friction points.'
      break
    case 'plan':
      text = low ? 'Break your goal into two concrete milestones you can start this week.'
        : mid ? 'Good planning — add weekly rituals that map to milestones.'
        : 'Excellent planning — focus on disciplined execution and habit maintenance.'
      break
    case 'support':
      text = low ? 'Find one mentor or community; even informal accountability helps a lot.'
        : mid ? 'You have some resources — consider investing in one curated course or tool.'
        : 'Strong support network — delegate or collaborate to multiply impact.'
      break
    case 'risks':
      text = low ? 'List your top 3 risks and a 1-line contingency for each.'
        : mid ? 'You anticipate risks — test the most likely one fast to reduce uncertainty.'
        : 'Well prepared for risks — keep reviewing contingencies as new info appears.'
      break
    case 'resilience':
      text = low ? 'Start with one self-care habit (sleep or short daily walk) and celebrate tiny wins.'
        : mid ? 'Good resilience practices — add a recovery ritual after stressful periods.'
        : 'High resilience — consider mentoring others to reinforce habits.'
      break
    case 'reflect':
      text = low ? 'Pick one metric to track weekly and review it every Sunday for 15 minutes.'
        : mid ? 'Regular reviews help — add a quick retrospective with at least one experiment per month.'
        : 'Strong reflection practice — use insights to accelerate your next iteration.'
      break
    default:
      text = ''
  }
  return <div className="text-xs text-gray-600 mt-2">{text}</div>
}

function generateTips(catScores) {
  const sorted = [...catScores].sort((a, b) => a.score - b.score)
  const tips = []
  for (let i = 0; i < Math.min(6, sorted.length); i++) {
    const c = sorted[i]
    tips.push(
      <li key={c.key}><strong>{c.label} ({c.score}%):</strong> {getActionableTip(c.key, c.score)}</li>
    )
  }
  return tips
}

function getActionableTip(key, score) {
  if (score < 50) return 'Focus on one small, concrete step this week to improve this area (start small, show consistency).'
  if (score < 75) return 'Refine and systematize what works — set a 30-day experiment to push this area higher.'
  return 'Maintain and scale — consider teaching or documenting your approach to lock learning in.'
}
