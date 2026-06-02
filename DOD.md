# Definition of Done — MockMate MVP

Updated: 2026-05-01

## Core Functionality

- [x] User can paste a job description and generate 5 tailored interview questions
- [x] AI interviewer speaks questions aloud (TTS via SpeechSynthesis API)
- [x] User answers by voice using push-to-talk (STT via Web Speech API)
- [x] AI responds with intelligent follow-up questions or moves to next question
- [x] Full debrief generated at end of interview (scores, feedback, tips, summary)
- [x] Per-answer scores: relevance, use of examples, clarity
- [x] Overall score and top strength / top improvement area

## Extended Features

- [x] CV/Resume upload (PDF, DOCX, TXT) for personalized questions
- [x] Difficulty levels: Junior / Mid / Senior
- [x] Interview types: Full, Behavioral, Technical, Screening
- [x] Question bank mode (12 categories including System Design, React, Leadership)
- [x] Company name context for tailored questions
- [x] Real-time speech analytics (WPM, filler word count, STAR framework detection)
- [x] PDF export of debrief results
- [x] Session history stored in localStorage
- [x] Progress chart across sessions (line chart via Recharts)

## Technical Standards

- [x] Frontend runs on React + Tailwind CSS (Vite)
- [x] Backend runs on FastAPI (Python)
- [x] LLM calls use Claude Haiku via OpenRouter (cost-efficient)
- [x] Conversation history trimmed to last 6 messages (prevents token overflow)
- [x] CORS configured for local and deployed environments
- [x] `.env` files excluded from version control
- [x] `.env.example` files provided for both frontend and backend

## Documentation

- [x] README explains what the tool does, how to run it, and how to deploy it
- [x] Triage Log documents technical hurdles and solutions (TRIAGE.md)
- [x] Definition of Done with progress tracking (this file)

## Deployment

- [x] Backend deployed to Render — https://mockmate-1-hmpj.onrender.com/
- [ ] Frontend deployed to Vercel (optional — currently runs locally via `npm run dev`)

## Known Limitations (Out of Scope for MVP)

- [ ] No user authentication
- [ ] No persistent database (history lives in browser localStorage only)
- [ ] Web Speech API requires Chrome — not supported in Firefox or Safari
- [ ] No mobile support (push-to-talk optimized for desktop)
