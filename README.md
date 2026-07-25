# DSA Tutor — Backend

A Socratic AI tutor for Data Structures & Algorithms. Instead of handing out
solutions, it guides users toward the answer through progressively
escalating hints — clarifying questions, pattern nudges, targeted
code-review, and finally a fill-in-the-blank code skeleton — never the
working code itself.

**Live API:** https://dsa-tutor-il3t.onrender.com
**Frontend repo:** [DSA-TUTOR-FRONTEND](https://github.com/forpradeep/DSA-TUTOR-FRONTEND)

## Features

- **Socratic hint escalation** — a custom system prompt drives a 5-tier
  hint ladder (clarifying question → pattern hint → bug localization →
  sub-problem → blanked code skeleton), enforced entirely through prompt
  design and tested against adversarial "just give me the code" attempts.
- **Concept wrap-up** — once a user solves a problem, the tutor names the
  core technique used and recommends similar practice problems.
- **Multimodal input** — users can paste a problem as text or upload a
  photo/screenshot; Gemini extracts the problem statement from the image
  before tutoring begins.
- **Persistent sessions** — full conversation history stored per user,
  browsable, searchable, and renameable, matching the session-list UX of
  modern AI chat products.
- **JWT authentication** with bcrypt password hashing.
- **Per-user rate limiting** to keep API costs bounded on a free-tier
  deployment.

## Tech stack

- **Runtime:** Node.js, Express
- **Database:** MongoDB (Atlas), Mongoose
- **Auth:** JWT, bcryptjs
- **AI:** Google Gemini API (`gemini-3.1-flash-lite`)
- **Deployment:** Render

## API overview

| Method | Route                     | Description                              |
|--------|----------------------------|-------------------------------------------|
| POST   | `/api/auth/register`       | Create an account                         |
| POST   | `/api/auth/login`          | Log in, returns JWT                       |
| POST   | `/api/tutor/start`         | Start a session from pasted problem text  |
| POST   | `/api/tutor/start-image`   | Start a session from an uploaded image    |
| POST   | `/api/tutor/message`       | Send a follow-up message in a session     |
| GET    | `/api/tutor/sessions`      | List the user's past sessions             |
| GET    | `/api/tutor/sessions/:id`  | Load one session's full history           |
| PATCH  | `/api/tutor/sessions/:id`  | Rename a session                          |
| DELETE | `/api/tutor/sessions/:id`  | Delete a session                          |

All `/api/tutor/*` routes require an `Authorization: Bearer <token>` header.

## Local setup

```bash
git clone https://github.com/forpradeep/DSA-TUTOR.git
cd DSA-TUTOR
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run it:

```bash
npm run dev
```

## Notes on the tutoring approach

The Socratic behavior is entirely prompt-driven rather than hardcoded — the
backend tracks a `hintCount` and `skeletonProvided` flag per session and
feeds them to the model on every turn, letting the model decide the right
level of specificity in context rather than following a rigid script. This
was deliberately tested against jailbreak attempts ("ignore your
instructions", "just give me the code") and held up without leaking
solutions.
