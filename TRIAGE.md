# Triage Log — MockMate

A record of technical hurdles encountered during development and how each was resolved independently.

---

## 1. Web Speech API only works in Chrome

**Problem:** The Web Speech API (both `SpeechRecognition` for STT and `SpeechSynthesis` for TTS) is not supported in Firefox or Safari. The app would silently fail to start the microphone on those browsers with no clear error shown to the user.

**Solution:** Added a browser detection check on mount in `useSTT.js`. If `window.SpeechRecognition` and `window.webkitSpeechRecognition` are both undefined, the hook returns an error state immediately and the UI surfaces a message telling the user to switch to Chrome. The README also explicitly states Chrome is required.

---

## 2. SpeechRecognition stops after a few seconds of silence

**Problem:** The browser's `SpeechRecognition` API automatically stops after a short period of silence, cutting off the user mid-answer. The push-to-talk model would drop the session before the user finished speaking.

**Solution:** Set `recognition.continuous = true` and `recognition.interimResults = true` in `useSTT.js`. This keeps the session alive while the user holds the push-to-talk button, and collects interim results incrementally until the button is released, at which point the final transcript is committed.

---

## 3. OpenRouter API returning 400 errors on long conversations

**Problem:** As the interview progressed, the conversation history passed to the `/respond` endpoint grew large. OpenRouter was returning 400 errors due to exceeding the context window for Claude Haiku.

**Solution:** Added history trimming in `backend/main.py` — only the last 6 messages are sent to the model on each `/respond` call. The full history is still kept on the frontend for the final `/debrief` call, which uses only the Q&A pairs, not the full chat log.

---

## 4. CV parsing failing on some PDF formats

**Problem:** Some PDFs (particularly scanned or password-protected ones) caused `pdfplumber` to return empty text or throw an exception, crashing the `/extract-cv` endpoint.

**Solution:** Wrapped the `pdfplumber` extraction in a try/except block. If extraction fails or returns fewer than 10 words, the endpoint returns an empty string with a warning flag rather than a 500 error. The frontend handles the empty response gracefully by skipping CV personalization and proceeding with the standard question flow.

---

## 5. CORS errors when frontend called the backend

**Problem:** The React frontend (Vite on port 5173) calling the FastAPI backend (port 8000) was blocked by the browser's CORS policy during local development. All API calls failed with `Access-Control-Allow-Origin` errors.

**Solution:** Added `CORSMiddleware` to `backend/main.py` with `allow_origins=["*"]` for development. For production on Render, this allows the deployed frontend origin to communicate with the backend without restriction.

---

## 6. Debrief scores returning as strings instead of integers

**Problem:** Claude occasionally returned JSON where score fields like `relevance` were strings (`"8"`) instead of integers (`8`), causing the frontend bar charts (Recharts) to render incorrectly or not at all.

**Solution:** Added explicit parsing in the `/debrief` endpoint — all score fields are cast with `int()` after JSON parsing. A fallback of `0` is used if the cast fails, so the debrief always renders even if the model returns unexpected types.

---

## 7. SpeechSynthesis cutting off on longer questions

**Problem:** The browser's `SpeechSynthesis` API would silently stop mid-sentence on questions longer than ~200 characters in some Chrome versions (a known Chrome bug with long utterances).

**Solution:** In `useTTS.js`, long text is split at sentence boundaries (`. `, `? `, `! `) into chunks of at most 200 characters. Each chunk is queued as a separate `SpeechSynthesisUtterance` and the `onend` event of each triggers the next chunk, producing seamless playback.

---

## 8. localStorage quota exceeded after many sessions

**Problem:** After many practice sessions, the app started throwing `QuotaExceededError` when trying to save new sessions to localStorage, crashing the session-save flow silently.

**Solution:** In `frontend/src/utils/history.js`, the `saveSession` function now catches `QuotaExceededError`, removes the oldest session from the stored list, and retries the save. This keeps the history within bounds automatically without user intervention.
