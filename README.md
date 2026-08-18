# 🤝 Let's Meet — Event & Meetup Management Platform

**Let's Meet** is a full-featured backend application for organizing and joining local meetups. It handles the entire lifecycle of an event — from creation and geolocation-based discovery, through participant management and community moderation, to paid ticketing via Stripe. Built with **Django REST Framework**, it exposes a secure, JWT-authenticated API ready to power any frontend (SPA, mobile app, etc.).

> Backend project built to practice production-grade patterns: third-party API integrations, secure authentication, and payment processing. The project has since been split into a standalone DRF API and a separate **React (Vite)** frontend, connected via CORS — with real screens for auth (incl. OAuth), meeting creation with location autocomplete, an interactive map, search/filtering, star ratings, chat, and post-payment flow (see [Roadmap](#-roadmap)).
>
> **Note on the frontend:** the React app was built largely with AI assistance — prompting an AI tool to generate components, then reviewing and adjusting the output — since React isn't my main area of expertise. The Django/DRF backend, documented in detail above, is the part I designed and wrote myself.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| **Language / Framework** | Python 3, Django 5.1, Django REST Framework |
| **Authentication** | JWT (`djangorestframework-simplejwt`) via `dj-rest-auth`, delivered as **HttpOnly cookies** |
| **Social Login** | `django-allauth` (GitHub & Discord OAuth providers) |
| **Payments** | Stripe Checkout Sessions + Webhooks (event-driven payment confirmation), Stripe CLI for local webhook testing |
| **Transactional Email** | SendGrid (SMTP backend) |
| **Content Moderation** | **Groq API** (`llama-3.1-8b-instant`) — LLM-based toxicity detection for comments, returning structured JSON verdicts |
| **Geolocation** | Geoapify API — used both for meeting locations (backend key configured) and live address autocomplete in the frontend (`geocode/autocomplete` endpoint) |
| **Database** | **PostgreSQL** (`psycopg2-binary` + `dj-database-url`), SQLite as local fallback |
| **Config Management** | `python-dotenv` (`.env`-based settings) |
| **CORS** | `django-cors-headers` — API opened to the React (Vite) frontend origin |
| **Frontend** | React + Vite (SPA) — `react-router-dom` for routing, Context API for auth state, `react-leaflet` + MapTiler tiles for the interactive map, Tailwind CSS v4 for styling, Geoapify Autocomplete for location input |
| **Testing** | `pytest`, `pytest-django` |
| **Planned** | Docker / Docker Compose (containerization — see [Roadmap](#-roadmap)) |

---

## ✨ Key Features

- **📅 Meetings module** — full CRUD via `ModelViewSet`, with dynamic filtering (title, price range, seat availability), automatic exclusion of past events, and extra actions: `my_meetings` (events you created) and `close_meetings` (events near the current user's city). A lightweight `CutMeetingView`/`MeetingCutSerializer` also exposes a minimal payload (title, description, date, time) for cheaper list views. The main serializer enriches each meeting with `creator_name`, `is_participant`, and a computed average `rating`.
- **📍 Location as free-text fields** — meetings store `meeting_city`, `meeting_region`, and `street` as plain text (moved away from a rigid `cities_light` relational dataset), with a Geoapify key configured for geocoding.
- **✅ Participation system** — join/leave logic with real-time seat tracking (`number_of_seats`) and protection against duplicate sign-ups or joining your own event.
- **💳 Payments (Stripe)** — dynamic Stripe Checkout Session generation per meeting, returned to the client as JSON (`{"checkout_url": ...}`) rather than a server-side redirect, with success/cancel URLs pointing directly to the React frontend's routes. A signature-verified **webhook** (`/payment/webhook/`) confirms payment asynchronously and automatically creates the participation record.
- **💬 Comments with AI-powered moderation** — comment creation is validated in real time against the **Groq API** (`llama-3.1-8b-instant`): the serializer sends the comment text to the LLM, which returns a structured JSON verdict (`{"is_toxic": true/false}`), rejecting toxic comments before they're saved. Comments per meeting are also exposed via a dedicated list endpoint.
- **⭐ Rating system** — one rating per user/meeting (`unique_together`), values 1–6 (see `Rating.rating` choices), with average rating aggregation (`Avg` on related `Rating` objects).
- **💬 Real-time-style chat system** — replaced simple one-off messages with a proper `Chat`/`Message` model: two-participant chats are created (or reused, if one already exists between the same two users) via `ChatListCreateView`, messages are scoped to a chat and ordered chronologically, each message tracks `is_read`, and a custom `ChatManager` prefetches participants (`prefetch_related`) to avoid N+1 queries. Message deletion is restricted to the original sender.
- **🌐 Social authentication** — GitHub and Discord OAuth2 login implemented via `dj-rest-auth`'s `SocialLoginView` (`GitHubLoginView`, `DiscordLoginView`), with `django-allauth` as the OAuth2 client and callback URLs pointing to the React frontend (`localhost:5173/oauth/<provider>/callback`).
- **👤 Account management** — dedicated endpoints for changing email, username and password (`@action` routes on `UserViewSet`), each validated with a custom serializer, plus a `me` endpoint (`GET`/`PATCH`) for fetching and updating the current user's own profile.
- **📍 User geolocation fields** — `User` model now stores `city`, `region`, `lat`, and `lon` as free-text fields, laying the groundwork for the `close_meetings` action (meetings near the current user) and Geoapify-based geocoding.
- **🔐 JWT authentication (backend) vs. current frontend implementation** — `dj-rest-auth` is configured to issue tokens as **HttpOnly cookies** via `/auth/login/`, with a **custom token serializer** blocking login for banned users (`is_baned` flag). ⚠️ The current React client, however, authenticates against the raw SimpleJWT endpoint (`/users/api/token/`), which returns tokens in the JSON body, and stores them in `localStorage` — the more common but XSS-exposed pattern. See the note in [Roadmap](#-roadmap).
- **✉️ Transactional emails** — SendGrid integration for automated notifications.
- **🛡️ Custom permissions** — object-level `IsOwnerOrReadOnly` permission (read access for everyone, write access restricted to the meeting's creator).
- **🧩 API-first architecture** — the backend is a pure DRF API (no server-rendered templates for the app itself), decoupled from and consumed by a separate React (Vite) frontend via `django-cors-headers`.

---

## 🖥️ Frontend Features (React)

```
src/
├── components/
│   ├── meetingComponents/   # meeting-related pages (list, detail, map view, my/close/past meetings...)
│   └── ...                  # forms, auth screens, navbar, chat, shared widgets
├── context/
│   └── AuthContext.jsx      # global auth state, session check, login/logout
├── pages/
│   └── Home.jsx             # landing page
├── App.jsx                  # router setup
└── main.jsx                 # entry point
```

- **Auth screens & session handling** — login/registration forms with GitHub/Discord OAuth buttons (CSRF-protected via a `state` param checked against `sessionStorage`); `AuthContext` re-validates the stored token against `users/me/` on every app load, so a stale/invalid token logs the user out automatically instead of silently failing later.
- **Location-aware forms** — `LocationAutocomplete` debounces input and queries Geoapify directly from the browser, used both at registration and when creating a meeting (city, region, and precise lat/lon).
- **Meeting discovery, split by access level** — a public teaser list (`PublicMeetingList`, hitting the lightweight `cut_meetings` endpoint) hides exact locations and prompts sign-up, while the authenticated `MeetingsPage` shows a live-search list side-by-side with the interactive map, plus dedicated views for "my meetings", "close to you", and "past meetings".
- **Meeting detail page** — join/leave a meeting (redirecting to Stripe Checkout first if it's paid), start a 1-to-1 chat with the organizer, leave a star rating once you've joined, and browse/post moderated comments — all on one page.
- **Interactive map** — `react-leaflet` with MapTiler dark-mode tiles, showing meeting locations.
- **Comments UI with inline moderation feedback** — a collapsible discussion thread that surfaces the backend's Groq-based rejection message directly under the input if a comment is flagged as toxic.
- **Star rating widget** — a 1–6 star picker that posts directly to the rating endpoint and reflects success/already-rated/error states.
- **Chat interface** — a conversation list + message thread view that polls the backend every few seconds for new messages (a simple approach in place of WebSockets).
- **Post-payment flow** — a dedicated success screen after Stripe Checkout that auto-redirects back to the meeting page.
- **Protected routing** — a `ProtectedRoute` wrapper redirects unauthenticated users to `/login` for most of the app, plus a forced "complete your profile" step for OAuth users who haven't set a city yet.

---

Create a `.env` file in the project root with the following keys:

```env
# Core Django
SECRET_KEY=your-django-secret-key
DEBUG=1

# Database (PostgreSQL connection string)
DB_CONNECTION_STRING=postgres://user:password@host:port/dbname

# Social Auth — GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRETS=your-github-client-secret

# Social Auth — Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRETS=your-discord-client-secret

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
EMAIL_PORT=587
EMAIL_USE_TLS=True

# Payments (Stripe)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECREAT=whsec_xxx

# Content Moderation (Groq — LLM-based toxicity detection)
GROQ_API_KEY=your-groq-api-key

# Geolocation
GEOAPIFY_KEY=your-geoapify-api-key
```

> ⚠️ Never commit your `.env` file — make sure it's listed in `.gitignore`.
> ℹ️ `CORS_ALLOWED_ORIGINS` (currently `http://localhost:5173`, the default Vite dev server port) is set directly in `settings.py`, not via `.env` — update it there if your frontend runs on a different port/origin.

### Frontend (`.env`)

The React app reads its own environment variables (Vite requires the `VITE_` prefix):

```env
VITE_API_BASE_URL=http://localhost:8000/
VITE_GITHUB_CLIENT_ID=your-github-oauth-app-client-id
VITE_DISCORD_CLIENT_ID=your-discord-application-client-id
VITE_GEOAPIFY_KEY=your-geoapify-api-key
```

---

## 🛠️ Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lets-meet.git
cd lets-meet

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env          # then fill in the values (see above)

# 5. Make sure a PostgreSQL instance is running and DB_CONNECTION_STRING points to it
#    (locally via Docker, or a managed instance e.g. Render/ElephantSQL)

# 6. Apply database migrations
python manage.py migrate

# 7. Create a superuser (optional, for /admin access)
python manage.py createsuperuser

# 8. Run the development server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

### Testing Stripe payments locally

Stripe webhooks (`/payment/webhook/`) need a publicly reachable URL, which `localhost` isn't. Use the **Stripe CLI** (`stripe.exe` on Windows) to forward events to your local server:

```bash
# Log in once (opens a browser to link your Stripe account)
stripe login

# Forward webhook events to your local Django server
stripe listen --forward-to localhost:8000/payment/webhook/
```

The CLI prints a webhook signing secret (`whsec_...`) — put that value in `STRIPE_WEBHOOK_SECREAT` in your `.env` so `stripe.Webhook.construct_event()` can verify incoming events. Keep `stripe listen` running in a separate terminal while testing checkout flows; without it, Stripe has nowhere to deliver `checkout.session.completed` events, so a payment will succeed on Stripe's side but never mark the participation as confirmed locally.

### Frontend Setup

```bash
# From the frontend project's root (adjust the path to your actual folder)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env          # then fill in the values (see above)

# Run the Vite dev server
npm run dev
```

The frontend will be available at `http://localhost:5173/`. Make sure the Django API is running first, and that `CORS_ALLOWED_ORIGINS` in `settings.py` matches the port Vite prints.

**Useful endpoints:**

| Endpoint | Description |
|---|---|
| `POST /auth/login/` | Log in, receive JWT in HttpOnly cookies |
| `POST /users/api/token/` | Obtain JWT pair (blocks banned users) |
| `POST /users/api/token/refresh/` | Refresh the access token |
| `POST /users/api/auth/github/` | GitHub OAuth2 login |
| `POST /users/api/auth/discord/` | Discord OAuth2 login |
| `GET/PATCH /users/api/users/me/` | Get / update the current user's profile |
| `POST /auth/registration/` | Register a new account |
| `GET/POST /meetings/api/meetings/` | List / create meetings |
| `GET /meetings/api/meetings/my_meetings/` | List meetings created by the current user |
| `GET /meetings/api/meetings/close_meetings/` | List meetings near the current user's city |
| `GET /meetings/api/outdated_meetings/` | List meetings that have already taken place |
| `GET /meetings/api/cut_meetings/` | Lightweight meetings list (minimal payload) |
| `POST /meeting/<id>/participation/` | Join or leave a meeting |
| `POST /api/add_comment/<meeting_id>/` | Add a comment to a meeting (moderated via Groq) |
| `GET /api/comments_list/<meeting_id>/` | List all comments for a meeting |
| `POST /<meeting_id>/payment/` | Create a Stripe Checkout session (returns `checkout_url`) |
| `POST /payment/webhook/` | Stripe webhook — confirms payment, creates participation |
| `POST /rating/<meeting_id>/` | Rate a meeting (1–5, one rating per user) |
| `GET /user_messages/users_list` | List users available to start a chat with |
| `GET/POST /user_messages/api/chat/` | List your chats / create (or reuse) a 1-to-1 chat |
| `GET/POST /user_messages/api/chat/<chat_id>/messages/` | List messages in a chat / send a new message |
| `GET/DELETE /user_messages/api/chat/<chat_id>/messages/<id>/` | Retrieve or delete a single message (sender only) |
| `PUT /users/api/users/change_password/` | Change the current user's password |

---

## 📚 What I Learned From This Project

Building **Let's Meet** was primarily an exercise in connecting a Django backend to real external services and hardening it the way a production API should be:

- **Integrating third-party APIs end-to-end** — from Stripe's Checkout + signature-verified webhooks, through SendGrid transactional emails, to the Groq LLM API for automated content moderation and Geoapify for geocoding. Each integration meant handling external failures, API keys, and asynchronous confirmation flows (e.g. payment status arriving via webhook rather than the initial request).
- **Adapting a payment flow for a decoupled SPA** — moving Stripe Checkout from a server-side redirect to a JSON response (`checkout_url`) that the React frontend redirects to itself, with Stripe's `success_url`/`cancel_url` pointing straight at frontend routes instead of Django views.
- **Splitting a monolith into an API-first backend** — moving from Django templates to a pure DRF API consumed by a separate React (Vite) frontend, which meant configuring `django-cors-headers` correctly and rethinking auth (HttpOnly cookies) for a cross-origin setup.
- **Designing serializers for different client needs** — a full `MeetingSerializer` (with computed fields like `is_participant` and average `rating`) for detail views, and a trimmed-down `MeetingCutSerializer` for cheaper, high-frequency list requests.
- **Avoiding N+1 queries with a custom manager** — overriding `Chat.objects` to always `prefetch_related` participants, and using `select_related`/`prefetch_related`-friendly patterns so listing chats doesn't trigger a query per participant.
- **Building idempotent "get or create" logic for a resource** — `ChatListCreateView.create()` checks for an existing 1-to-1 chat between two users before creating a new one, returning `200` for an existing chat vs. `201` for a newly created one.
- **Using an LLM as a moderation layer** — prompting `llama-3.1-8b-instant` via Groq to return a strict, parseable JSON verdict on comment toxicity, and enforcing that verdict inside a DRF serializer's `validate_*` method rather than as a separate post-processing step.
- **Writing database-backed tests with `pytest-django`** — covering model creation and view behavior against a real test database, including fixtures for related models and mocked email sending.
- **Securing API endpoints with JWT stored in HttpOnly cookies** — configured the backend (`dj-rest-auth` + `SimpleJWT`) to issue access/refresh tokens as HttpOnly cookies instead of the common (but XSS-vulnerable) `localStorage` approach. I later realized the React client doesn't actually use this flow yet (it calls the raw token endpoint and stores tokens in `localStorage`) — a good example of a backend/frontend contract mismatch to reconcile next.
- **Extending SimpleJWT's authentication flow** — overriding `TokenObtainPairSerializer` to reject login attempts from banned users (`is_baned`) directly at the token-issuance stage, before any session is created.
- **Designing permission-aware, filterable REST APIs** — implementing object-level permissions (`IsOwnerOrReadOnly`) and query-parameter-driven filtering directly inside DRF `ViewSets`.
- **Managing configuration safely** — keeping all secrets and environment-specific values out of source control via `.env` + `python-dotenv`.

---

## 🗺️ Roadmap

**🔨 Currently in progress**
- **Transactional emails** — wiring up SendGrid (`services.py`) so key actions, like creating a meeting, trigger a confirmation email to the user.

**⏭️ Next steps**
- **Docker & Docker Compose** — containerize the app (Django + PostgreSQL) for a one-command local setup and easier deployment.
- A few additional user-facing features (details TBD as they're built).
- More automated tests, covering modules that are still light on coverage (payments, participations, ratings) with `pytest-django`.
- Query optimization pass across the API where it makes sense (e.g. further `select_related`/`prefetch_related` on list endpoints).

**🧹 Known cleanup items**
- **React frontend** — core screens are functional (auth, meetings, chat, ratings, payments). `App.jsx`'s router confirms `ChatRoom.jsx` and `OAuthCallback.jsx` are leftover files from AI-assisted scaffolding (superseded by `ChatPage.jsx` and the dedicated `GithubCallback`/`DiscordCallback`) — safe to delete.
- Reconsider making `/` (the marketing homepage) public — it's currently wrapped in `ProtectedRoute`, so logged-out visitors are redirected straight to `/login` instead of seeing it.
- Align frontend auth with the backend's HttpOnly-cookie JWT flow (currently the client uses `localStorage`, bypassing the more secure cookie-based endpoint).
- Confirm and document the Geoapify geocoding flow on the backend (currently only the API key is configured there; the frontend already calls Geoapify directly for autocomplete).

---

## 📄 License

This project is available for educational and portfolio purposes.