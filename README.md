# 🤝 Let's Meet — Event & Meetup Management Platform

**Let's Meet** is a full-featured backend application for organizing and joining local meetups. It handles the entire lifecycle of an event — from creation and geolocation-based discovery, through participant management and community moderation, to paid ticketing via Stripe. Built with **Django REST Framework**, it exposes a secure, JWT-authenticated API ready to power any frontend (SPA, mobile app, etc.).

> Backend project built to practice production-grade patterns: third-party API integrations, secure authentication, and payment processing. A React frontend is currently being developed alongside the API (early stage, see [Roadmap](#-roadmap)).

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| **Language / Framework** | Python 3, Django 5.1, Django REST Framework |
| **Authentication** | JWT (`djangorestframework-simplejwt`) via `dj-rest-auth`, delivered as **HttpOnly cookies** |
| **Social Login** | `django-allauth` (GitHub & Discord OAuth providers) |
| **Payments** | Stripe Checkout Sessions + Webhooks (event-driven payment confirmation) |
| **Transactional Email** | SendGrid (SMTP backend) |
| **Content Moderation** | Google Perspective API (toxicity/comment analysis) |
| **Geolocation** | OpenCage Geocoding API + `django-cities-light` (PL cities/regions/subregions dataset) |
| **Database** | **PostgreSQL** (`psycopg2-binary` + `dj-database-url`), SQLite as local fallback |
| **Config Management** | `python-dotenv`, `python-decouple` (`.env`-based settings) |
| **Frontend Rendering** | Django Templates + `django-crispy-forms` (Bootstrap 5) |
| **Frontend (in progress)** | React — early-stage integration, currently learning/experimenting, no complex logic yet |
| **Testing** | `pytest`, `pytest-django` |
| **Planned** | Docker / Docker Compose (containerization — see [Roadmap](#-roadmap)) |

---

## ✨ Key Features

- **📅 Meetings module** — full CRUD via `ModelViewSet`, with dynamic filtering (by title, price range, seat availability) and automatic exclusion of past events.
- **🗺️ Geolocation & maps** — meeting locations resolved and displayed on an interactive map using the OpenCage Geocoding API and `cities_light` region/city data.
- **✅ Participation system** — join/leave logic with real-time seat tracking (`number_of_seats`) and protection against duplicate sign-ups or joining your own event.
- **💳 Payments (Stripe)** — dynamic Stripe Checkout Session generation per meeting, with a signature-verified **webhook** that confirms payment and automatically creates the participation record.
- **💬 Comments with moderation** — comment endpoint integrated with the **Perspective API** to flag/filter toxic content before publication.
- **⭐ Rating system** — one rating per user/meeting (`unique_together`) with average rating aggregation (`Avg` on related `Rating` objects).
- **✉️ Direct messaging** — private user-to-user messages (`Message` model), with inbox filtering via `Q(receiver=user) | Q(sender=user)`.
- **👤 Account management** — dedicated endpoints for changing email, username and password (`@action` routes on `UserViewSet`), each validated with a custom serializer.
- **🔐 Secure JWT authentication** — access & refresh tokens issued as **HttpOnly cookies** (XSS-resistant), configured through `dj-rest-auth` + `SimpleJWT`, with a **custom token serializer** that blocks login for banned users (`is_baned` flag).
- **🌐 Social authentication** — login via GitHub and Discord (`django-allauth`).
- **✉️ Transactional emails** — SendGrid integration for automated notifications.
- **🛡️ Custom permissions** — object-level `IsOwnerOrReadOnly` permission ensuring only the meeting's creator can modify or delete it.

---

## ⚙️ Environment Variables (`.env`)

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
WEBHOOK_SECRET=whsec_xxx

# Content Moderation
PERSPECTIVE_API_KEY=your-perspective-api-key

# Geolocation
GEOCODING_API_KEY=your-opencage-api-key
```

> ⚠️ Never commit your `.env` file — make sure it's listed in `.gitignore`.

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

# 7. Load cities_light fixtures (regions/cities for Poland)
python manage.py cities_light

# 8. Create a superuser (optional, for /admin access)
python manage.py createsuperuser

# 9. Run the development server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

**Useful endpoints:**

| Endpoint | Description |
|---|---|
| `POST /auth/login/` | Log in, receive JWT in HttpOnly cookies |
| `POST /auth/registration/` | Register a new account |
| `GET/POST /meetings/api/meetings/` | List / create meetings |
| `POST /meeting/<id>/participation/` | Join or leave a meeting |
| `POST /add_comment/<meeting_id>/` | Add a comment to a meeting |
| `POST /<meeting_id>/payment/` | Create a Stripe Checkout session |
| `POST /rating/<meeting_id>/` | Rate a meeting (1–5, one rating per user) |
| `POST /messages/` | Send a direct message to another user |
| `GET /user_messages/` | List messages sent/received by the current user |
| `PUT /users/api/users/change_password/` | Change the current user's password |

---

## 📚 What I Learned From This Project

Building **Let's Meet** was primarily an exercise in connecting a Django backend to real external services and hardening it the way a production API should be:

- **Integrating third-party APIs end-to-end** — from Stripe's Checkout + signature-verified webhooks, through SendGrid transactional emails, to the Perspective API for automated content moderation and OpenCage for geocoding. Each integration meant handling external failures, API keys, and asynchronous confirmation flows (e.g. payment status arriving via webhook rather than the initial request).
- **Securing API endpoints with JWT stored in HttpOnly cookies** — instead of the common (but XSS-vulnerable) `localStorage` approach, tokens are issued and refreshed as HttpOnly cookies via `dj-rest-auth` + `SimpleJWT`, significantly reducing the attack surface for token theft.
- **Extending SimpleJWT's authentication flow** — overriding `TokenObtainPairSerializer` to reject login attempts from banned users (`is_baned`) directly at the token-issuance stage, before any session is created.
- **Designing permission-aware, filterable REST APIs** — implementing object-level permissions (`IsOwnerOrReadOnly`) and query-parameter-driven filtering directly inside DRF `ViewSets`.
- **Managing configuration safely** — keeping all secrets and environment-specific values out of source control via `.env` + `python-decouple`.

---

## 🗺️ Roadmap

- [ ] **Docker & Docker Compose** — containerize the app (Django + PostgreSQL) for a one-command local setup and easier deployment.
- [ ] **React frontend** — currently in early development as a separate client for the API; basic setup in place, UI and state management still to come.
- [ ] Expand automated test coverage with `pytest-django`.

---

## 📄 License

This project is available for educational and portfolio purposes.