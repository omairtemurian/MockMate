import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { fetchSessions, fetchSessionDetail } from '../utils/api'
import { durationLabel } from '../utils/speechAnalytics'

// ── Background orbs (same style as other pages) ────────────────────────────────
function BgOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="animate-orb absolute -top-20 right-0 w-96 h-96 rounded-full bg-emerald-500/8 blur-3xl" />
      <div className="animate-orb-r absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-cyan-500/6 blur-3xl" />
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function scoreColor(s) {
  return s >= 8 ? 'text-emerald-400' : s >= 5 ? 'text-yellow-400' : 'text-red-400'
}
function scoreBg(s) {
  return s >= 8
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : s >= 5
    ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30'
}
function scoreGradient(s) {
  return s >= 8 ? '#10b981' : s >= 5 ? '#f59e0b' : '#ef4444'
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function difficultyBadge(d) {
  const map = { Junior: 'text-sky-400 bg-sky-500/10', Mid: 'text-violet-400 bg-violet-500/10', Senior: 'text-amber-400 bg-amber-500/10' }
  return map[d] || 'text-slate-400 bg-slate-500/10'
}
function typeBadge(t) {
  const map = {
    full:       '🎯 Full',
    behavioral: '🌟 Behavioral',
    technical:  '⚡ Technical',
    screening:  '📞 Screening',
    practice:   '🎯 Practice',
  }
  return map[t] || t || '🎯 Full'
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, color = 'text-white', delay = 0 }) {
  return (
    <div className="glass border border-slate-700/40 rounded-2xl p-5 flex flex-col items-center gap-1 animate-fade-up"
      style={{ animationDelay: `${delay}s` }}>
      <span className={`text-3xl font-black ${color}`}>{value}</span>
      <span className="text-slate-500 text-xs font-medium text-center">{label}</span>
    </div>
  )
}

// ── Score over time chart ─────────────────────────────────────────────────────
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  border: '1px solid rgba(51,65,85,0.6)',
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
}

function ScoreChart({ sessions }) {
  // sessions are newest-first from API — reverse for the chart
  const data = [...sessions]
    .reverse()
    .filter(s => s.overall_score != null)
    .map(s => ({
      date:  new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: parseFloat(parseFloat(s.overall_score).toFixed(1)),
      role:  s.role || '',
    }))

  if (data.length < 2) {
    return (
      <div className="glass border border-slate-700/40 rounded-3xl p-6 flex items-center justify-center h-40 animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <p className="text-slate-600 text-sm">Complete at least 2 interviews to see your progress chart.</p>
      </div>
    )
  }

  const avg = (data.reduce((s, d) => s + d.score, 0) / data.length).toFixed(1)

  return (
    <div className="glass border border-slate-700/40 rounded-3xl p-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-bold">📈 Score Over Time</p>
          <p className="text-slate-500 text-xs">{data.length} sessions · avg {avg}/10</p>
        </div>
        <span className={`text-sm font-black px-3 py-1 rounded-full border ${scoreBg(parseFloat(avg))}`}>
          {avg}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
          <ReferenceLine y={7} stroke="rgba(16,185,129,0.2)" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: '#e2e8f0', fontWeight: 700, fontSize: 11 }}
            itemStyle={{ color: '#94a3b8', fontSize: 11 }}
            formatter={(v, _, props) => [`${v}/10 — ${props.payload?.role || ''}`, 'Score']}
          />
          <Line
            type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5}
            dot={({ cx, cy, payload, key }) => (
              <circle key={key} cx={cx} cy={cy} r={4}
                fill={scoreGradient(payload.score)} stroke="#020617" strokeWidth={2} />
            )}
            activeDot={{ r: 6, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Expanded session detail ───────────────────────────────────────────────────
function SessionDetail({ sessionId }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessionDetail(sessionId).then(d => { setDetail(d); setLoading(false) })
  }, [sessionId])

  if (loading) return (
    <div className="flex justify-center py-6">
      <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-emerald-500 animate-spin" />
    </div>
  )
  if (!detail) return <p className="text-slate-600 text-sm py-4 text-center">Could not load details.</p>

  return (
    <div className="mt-4 space-y-3 border-t border-slate-700/40 pt-4">

      {/* Summary + strengths */}
      {detail.summary && (
        <p className="text-slate-400 text-sm leading-relaxed">{detail.summary}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {detail.top_strength && (
          <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-3">
            <p className="text-emerald-400 text-xs font-bold mb-1">🏆 Top Strength</p>
            <p className="text-emerald-200/80 text-xs leading-relaxed">{detail.top_strength}</p>
          </div>
        )}
        {detail.top_improvement && (
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-3">
            <p className="text-amber-400 text-xs font-bold mb-1">🎯 Top Improvement</p>
            <p className="text-amber-200/80 text-xs leading-relaxed">{detail.top_improvement}</p>
          </div>
        )}
      </div>

      {/* Per-question scores */}
      {detail.answers?.length > 0 && (
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Answer Breakdown</p>
          {detail.answers.map((a, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-3">
              <div className="flex items-start gap-3">
                {/* Score bubble */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  a.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                  a.score >= 5 ? 'bg-yellow-400/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                }`}>{a.score != null ? Math.round(a.score) : '–'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-semibold leading-snug mb-1 truncate">{a.question}</p>
                  {/* Speech stats row */}
                  <div className="flex flex-wrap gap-2">
                    {a.wpm > 0 && (
                      <span className={`text-xs font-medium ${a.wpm >= 110 && a.wpm <= 170 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {a.wpm} wpm
                      </span>
                    )}
                    {a.total_fillers != null && (
                      <span className={`text-xs ${a.total_fillers === 0 ? 'text-emerald-400' : a.total_fillers <= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {a.total_fillers} fillers
                      </span>
                    )}
                    {a.word_count > 0 && (
                      <span className="text-xs text-slate-600">{a.word_count} words</span>
                    )}
                    {/* STAR dots */}
                    {[['S', a.star_s], ['T', a.star_t], ['A', a.star_a], ['R', a.star_r]].some(([, v]) => v != null) && (
                      <span className="flex gap-1 items-center">
                        {[['S', a.star_s], ['T', a.star_t], ['A', a.star_a], ['R', a.star_r]].map(([label, val]) => (
                          <span key={label} className={`text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full ${val ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                            {label}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  {a.feedback && <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{a.feedback}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Session card ──────────────────────────────────────────────────────────────
function SessionCard({ session, index }) {
  const [open, setOpen] = useState(false)
  const score = session.overall_score

  return (
    <div className="glass border border-slate-700/40 rounded-2xl overflow-hidden animate-fade-up hover:border-slate-600/60 transition-all duration-300"
      style={{ animationDelay: `${index * 0.05}s` }}>

      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Score badge */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border ${scoreBg(score)}`}>
          {score != null ? parseFloat(score).toFixed(1) : '–'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 text-sm font-semibold truncate">{session.role || 'Interview'}</p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-slate-500 text-xs">{formatDate(session.created_at)}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${difficultyBadge(session.difficulty)}`}>
              {session.difficulty || 'Mid'}
            </span>
            <span className="text-slate-600 text-xs">{typeBadge(session.interview_type)}</span>
            {session.duration_seconds > 0 && (
              <span className="text-slate-600 text-xs">⏱ {durationLabel(session.duration_seconds)}</span>
            )}
          </div>
        </div>

        {/* Expand arrow */}
        <span className="text-slate-600 text-xs flex-shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {/* Expandable detail */}
      {open && (
        <div className="px-4 pb-4">
          <SessionDetail sessionId={session.id} />
        </div>
      )}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="glass border border-slate-700/40 rounded-3xl p-12 flex flex-col items-center gap-4 text-center animate-fade-up">
      <span className="text-5xl">🎙</span>
      <p className="text-white font-bold text-lg">No interviews yet</p>
      <p className="text-slate-500 text-sm max-w-xs">
        Complete your first interview and your results will appear here automatically.
      </p>
    </div>
  )
}

// ── Main Dashboard component ──────────────────────────────────────────────────
export default function Dashboard() {
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')   // All | Junior | Mid | Senior

  useEffect(() => {
    fetchSessions().then(data => { setSessions(data); setLoading(false) })
  }, [])

  // ── Derived stats ────────────────────────────────────────────────────────────
  const scored       = sessions.filter(s => s.overall_score != null)
  const avgScore     = scored.length
    ? (scored.reduce((a, s) => a + s.overall_score, 0) / scored.length).toFixed(1)
    : '—'
  const bestScore    = scored.length
    ? Math.max(...scored.map(s => s.overall_score)).toFixed(1)
    : '—'
  const totalSeconds = sessions.reduce((a, s) => a + (s.duration_seconds || 0), 0)

  // ── Filtered list ────────────────────────────────────────────────────────────
  const visible = filter === 'All' ? sessions : sessions.filter(s => s.difficulty === filter)

  return (
    <div className="min-h-screen bg-slate-950 py-6 sm:py-10 px-3 sm:px-4 relative overflow-hidden">
      <BgOrbs />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="animate-fade-up">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-1">Progress</p>
          <h1 className="text-3xl font-black text-white">Your Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{sessions.length} interview{sessions.length !== 1 ? 's' : ''} recorded</p>
        </div>

        {loading ? (
          /* Loading spinner */
          <div className="flex justify-center py-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard value={sessions.length}              label="Total Sessions"      color="text-white"        delay={0.05} />
              <StatCard value={avgScore !== '—' ? `${avgScore}/10` : '—'} label="Avg Score" color={scoreColor(parseFloat(avgScore))} delay={0.1} />
              <StatCard value={bestScore !== '—' ? `${bestScore}/10` : '—'} label="Best Score" color={scoreColor(parseFloat(bestScore))} delay={0.15} />
              <StatCard value={totalSeconds > 0 ? durationLabel(totalSeconds) : '—'} label="Practice Time" color="text-cyan-400" delay={0.2} />
            </div>

            {/* ── Score chart ── */}
            <ScoreChart sessions={sessions} />

            {/* ── Sessions list ── */}
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* Filter bar */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold">🕐 Past Sessions</p>
                <div className="flex gap-1.5">
                  {['All', 'Junior', 'Mid', 'Senior'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        filter === f
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'glass border border-slate-700/40 text-slate-500 hover:text-slate-300'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              {visible.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-8">No {filter} sessions yet.</p>
              ) : (
                <div className="space-y-3">
                  {visible.map((s, i) => <SessionCard key={s.id} session={s} index={i} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
