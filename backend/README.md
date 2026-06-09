# TruthGuard Backend

FastAPI-based backend for the TruthGuard Fake News Detection application.

## Quick Start

```bash
# Activate virtual environment
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn backend.main:app --reload --port 8000
```

API documentation available at `http://localhost:8000/docs`

---

## Project Structure

```
backend/
|-- main.py                  # FastAPI application entry point + all route handlers
|-- models.py                # Pydantic schemas + ML prediction logic
|-- database.py              # Supabase client + database operations
|-- config.py                # Configuration loader (reads config.json)
|-- utils.py                 # Text cleaning + password hashing utilities
|-- train_model.py           # ML model training pipeline
|-- analyze_misclassifications.py  # Model error analysis + visualization
|-- rss_scraper.py           # RSS feed fetcher
|-- email_utils.py           # Password reset email sender (SMTP)
|-- cron_job.py              # Background RSS fetch scheduler
|
|-- database/
|   |-- schema.sql           # Full database schema (5 tables)
|   |-- seeds.sql            # Seed data for sources table
|   |-- README.md            # Migration guide
|
|-- tests/
    |-- test_api.py          # API endpoint tests
    |-- test_model.py        # ML prediction unit test
    |-- test_utils.py        # Text cleaning unit test
```

---

## Modules

### `main.py` - Application Entry Point

- Initializes FastAPI app with CORS middleware (allows `localhost:3000`)
- Configures JWT authentication (HS256, 30-minute expiry)
- Implements all route handlers (see [API Routes](#api-routes))
- Password validation: min 12 chars, uppercase, lowercase, number
- Password reset tokens: 15-minute expiry with `password_reset` scope

### `models.py` - ML Prediction & Schemas

- Loads the trained model from `backend/fake_news_model.pkl` at import time
- `predict_fake_news(text)` -- cleans input text, returns `{"prediction": "FAKE"|"REAL", "confidence": float}`
- Pydantic schemas: `NewsText`, `UserCreate`, `UserOut`, `TokenWithUser`, `FeedbackInput`, `PasswordResetRequest`, `PasswordResetConfirm`

### `database.py` - Supabase Integration

- Initializes Supabase client using `config.json` or environment variables
- Functions: `get_news()`, `create_user()`, `verify_user()`, `store_analysis()`, `store_feedback()`
- All database operations go through the Supabase Python client

### `utils.py` - Utilities

- `clean_text(text)` -- Lowercase, remove URLs, HTML tags, special characters, normalize whitespace
- `hash_password(password)` -- bcrypt hashing
- `verify_password(plain, hashed)` -- bcrypt verification

### `train_model.py` - Model Training

- Combines ISOT and LIAR datasets
- Balances classes via undersampling
- Trains TF-IDF + LogisticRegression pipeline with GridSearchCV (5-fold CV)
- Saves model to `backend/fake_news_model.pkl`
- Run: `python -m backend.train_model`

### `rss_scraper.py` - RSS Feed Fetcher

- Fetches news from configured RSS feeds using `feedparser`
- Extracts title, link, description from each feed entry
- Stores articles in the `articles` database table

### `cron_job.py` - Background Scheduler

- Runs RSS fetch in a background thread
- Default interval: 600 seconds (configurable via `FETCH_INTERVAL` env var)

### `email_utils.py` - Email Service

- Sends password reset emails via Gmail SMTP
- Requires `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_PORT`, `MAIL_SERVER` env vars

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | Health check |
| `GET` | `/news` | No | Fetch stored news articles |
| `POST` | `/fetch_rss` | No | Manually trigger RSS scraping |
| `POST` | `/predict` | No | Analyze news text (core endpoint) |
| `POST` | `/auth/register` | No | Register new user |
| `POST` | `/auth/login` | No | Login (OAuth2 form) |
| `POST` | `/auth/request-password-reset` | No | Request password reset email |
| `POST` | `/auth/reset-password` | No | Reset password with JWT token |
| `POST` | `/feedback` | **JWT** | Submit prediction feedback (1-5 stars) |

### Request/Response Examples

**POST /predict**
```json
// Request
{ "text": "Your news article text here..." }

// Response
{
  "predictionId": "uuid",
  "prediction": "REAL",
  "confidence": 0.9234
}
```

**POST /auth/register**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" }
}
```

**POST /feedback** (requires `Authorization: Bearer <token>`)
```json
// Request
{
  "analysis_id": "uuid",
  "rating": 5
}
```

---

## Testing

```bash
# Run all tests
python -m pytest backend/tests/ -v

# Run specific test
python -m pytest backend/tests/test_api.py -v
python -m pytest backend/tests/test_model.py -v
python -m pytest backend/tests/test_utils.py -v
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SUPABASE_URL` | Yes | -- | Supabase project URL |
| `SUPABASE_KEY` | Yes | -- | Supabase anon/public key |
| `SECRET_KEY` | Yes | -- | JWT signing secret |
| `FETCH_INTERVAL` | No | `600` | RSS fetch interval (seconds) |
| `MAIL_USERNAME` | Yes* | -- | SMTP username (*for password reset) |
| `MAIL_PASSWORD` | Yes* | -- | SMTP password (*for password reset) |
| `MAIL_FROM` | Yes* | -- | Sender email address |
| `MAIL_PORT` | No | `587` | SMTP port |
| `MAIL_SERVER` | No | `smtp.gmail.com` | SMTP server |

---

## Database

See [database/README.md](database/README.md) for migration instructions.

Schema: `database/schema.sql`
Seeds: `database/seeds.sql`

### Tables
- `sources` -- News source registry with reliability scores
- `articles` -- Scraped news articles from RSS feeds
- `analysis` -- ML prediction results (text, prediction, confidence)
- `users` -- Registered users (bcrypt-hashed passwords)
- `feedback` -- User ratings linked to analyses

---

## Common Tasks

### Retrain the Model
```bash
python -m backend.train_model
```

### Analyze Misclassifications
```bash
python -m backend.analyze_misclassifications
```

### Trigger RSS Fetch Manually
```bash
curl -X POST http://localhost:8000/fetch_rss
```
