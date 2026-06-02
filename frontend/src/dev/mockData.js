// Dev-only fixture data. Loaded when ?dev=<view> is in the URL.
// Never imported in production paths — only used by App.jsx's URL-param check.

export const mockSessionData = {
  role: 'Senior Frontend Engineer',
  difficulty: 'Mid',
  interview_type: 'full',
  language: 'en-US',
  company: 'Acme Corp',
}

export const mockQaPairs = [
  {
    question: 'Tell me about yourself and why you are applying for this role.',
    answer_summary:
      'Candidate described 4 years of React experience, mentioned building a design system at their current company, and expressed interest in the team\'s open-source contributions.',
    score: 7,
    feedback:
      'Good structure and relevant experience mentioned. You connected your background to the role clearly. However, the answer ran a little long and could be tightened to 90 seconds.',
    tip: 'Practice a 90-second version: current role → key achievement → why this company specifically.',
    ideal_answer:
      'I\'m a frontend engineer with 4 years specialising in React and TypeScript. At my current role I led the migration of our legacy jQuery codebase to React, cutting bundle size by 40%. I\'m drawn to Acme Corp because of your investment in developer tooling — I follow your open-source work closely and see real alignment with the problems I want to solve.',
    analytics: {
      wpm: 142,
      durationSeconds: 95,
      totalFillers: 3,
      fillerCounts: { um: 2, like: 1 },
      wordCount: 224,
      star: { situation: true, task: false, action: true, result: false },
    },
  },
  {
    question: 'Describe a time you had to deal with a difficult technical decision under pressure.',
    answer_summary:
      'Candidate described a production incident where the team debated hotfixing vs rolling back. They chose rollback, communicated to stakeholders, and added a feature flag system afterwards.',
    score: 8,
    feedback:
      'Strong STAR structure. The result was quantified (30-minute recovery vs estimated 3-hour hotfix), and the follow-up action showed maturity. Minor gap: did not mention how you aligned the team on the rollback decision.',
    tip: 'Add one sentence about how you got buy-in quickly — this shows leadership under pressure, not just good instincts.',
    ideal_answer:
      'During a Black Friday deploy, our checkout service started throwing 500s. The team split between a hotfix and rollback. I pulled the error rates, saw 15% of transactions failing, and made the call to roll back — shared the data in Slack so everyone understood the reasoning. We were back in 30 minutes. Afterwards I introduced a feature flag system so we could safely ship incremental changes without full rollbacks.',
    analytics: {
      wpm: 158,
      durationSeconds: 112,
      totalFillers: 1,
      fillerCounts: { um: 1 },
      wordCount: 296,
      star: { situation: true, task: true, action: true, result: true },
    },
  },
  {
    question: 'How do you approach performance optimisation in a React application?',
    answer_summary:
      'Candidate mentioned React.memo, useMemo, useCallback, lazy loading routes, and code splitting. Referenced Chrome DevTools and Lighthouse for profiling.',
    score: 7,
    feedback:
      'Good breadth of techniques. You named the right tools but the answer stayed theoretical. Interviewers want a concrete example — a specific bottleneck you found and fixed.',
    tip: 'Always anchor performance answers with a real example: "I noticed the product grid was re-rendering 60× per scroll. I traced it to a missing key prop and added React.memo — rendering dropped to 3× and the frame rate recovered."',
    ideal_answer:
      'I start by profiling, not guessing. I use the React DevTools Profiler to find components that re-render unnecessarily, then check bundle size with source-map-explorer. On my last project I found a third-party analytics package adding 80 kB gzip to the critical path — I moved it behind a dynamic import and the LCP dropped by 1.2 seconds. For runtime perf, I use React.memo on expensive list items and make sure context values are memoised to avoid cascade renders.',
    analytics: {
      wpm: 135,
      durationSeconds: 88,
      totalFillers: 4,
      fillerCounts: { um: 2, basically: 1, you_know: 1 },
      wordCount: 198,
      star: { situation: false, task: false, action: true, result: false },
    },
  },
  {
    question: 'How do you ensure the quality of your code before it reaches production?',
    answer_summary:
      'Candidate mentioned TypeScript, ESLint, unit tests with Vitest, Playwright e2e tests, PR reviews, and a CI pipeline that blocks merges on failures.',
    score: 9,
    feedback:
      'Excellent answer. Covered the full quality pyramid — static analysis, unit, integration, e2e — and tied it to team process (CI gates, PR review). This is exactly the level of rigour a senior engineer should demonstrate.',
    tip: 'You could add one line about how you balance coverage vs velocity — e.g., "I don\'t chase 100% coverage; I focus tests on business-critical paths and regression cases."',
    ideal_answer:
      'Quality starts before I write code — TypeScript and ESLint catch whole categories of bugs at the editor level. I write unit tests for business logic with Vitest and keep them fast so they actually get run. For critical user flows I add Playwright e2e tests. Everything runs in CI on every PR, and the merge button is blocked until it\'s green. I treat code review as a knowledge-share, not a gatekeeping step — I try to give reviewers context on *why* I made a decision, not just what I changed.',
    analytics: {
      wpm: 162,
      durationSeconds: 104,
      totalFillers: 0,
      fillerCounts: {},
      wordCount: 277,
      star: { situation: false, task: false, action: true, result: true },
    },
  },
  {
    question: 'Where do you see yourself in three years?',
    answer_summary:
      'Candidate mentioned wanting to grow into a tech lead role, mentor junior engineers, and have more influence on architecture decisions.',
    score: 6,
    feedback:
      'The direction is right but the answer was vague. "Tech lead" is a goal, not a plan. The interviewer wants to know how you\'ll get there and how it aligns with what they can offer.',
    tip: 'Connect your goals to the specific role: "In this team I see an opportunity to X, which would help me build toward Y." That shows you\'ve thought about the fit, not just your own roadmap.',
    ideal_answer:
      'I\'d like to be the kind of engineer that a team leans on for tricky architectural decisions and who actively raises the skill level around them through mentorship and documentation. In three years I see myself in a staff or tech lead position — not necessarily managing people, but owning the technical direction of a product area. This role looks like a good step toward that: I\'d be working across a large codebase with experienced engineers, which is exactly the environment where I learn fastest.',
    analytics: {
      wpm: 118,
      durationSeconds: 75,
      totalFillers: 5,
      fillerCounts: { um: 3, like: 2 },
      wordCount: 147,
      star: { situation: false, task: false, action: false, result: false },
    },
  },
]

export const mockFaceMetrics = {
  eyeContactPct: 72,
  headStabilityPct: 85,
  confidenceScore: 7.7,
  samplesCount: 148,
}

// Public domain test video so the recording section renders in the debrief
export const mockRecording = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
