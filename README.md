# TruthGuard - AI Fake News Detection Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.x](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-orange.svg)](https://scikit-learn.org/)

An end-to-end machine learning web application that analyzes news articles and classifies them as **FAKE** or **REAL** using Natural Language Processing. Built with a FastAPI backend, React/TypeScript frontend, and powered by a Logistic Regression classifier trained on the ISOT and LIAR fake news datasets.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Machine Learning Model](#machine-learning-model)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core
- **News Authenticity Analysis** -- Paste any news text (min. 50 words) and receive an instant FAKE/REAL classification with confidence score
- **RSS News Aggregation** -- Automatically fetches and stores articles from 5 major news feeds (BBC, CNN, NDTV, The Hindu, Google News) every 10 minutes
- **Feedback System** -- Authenticated users can rate prediction accuracy with 1-5 star ratings

### Authentication & Security
- JWT-based authentication with 30-minute token expiry
- bcrypt password hashing
- Strong password enforcement (12+ chars, uppercase, lowercase, number)
- Email-based password reset flow with time-limited tokens

### UI/UX
- Responsive mobile-first design (Bootstrap 5 + custom CSS)
- Animated transitions (Framer Motion, Headless UI)
- Toast notifications for user feedback
- Confidence bar visualization with color-coded indicators
- Dual-mode auth forms (modal overlays + dedicated pages)

### Guest Access
- Unauthenticated users can perform up to 3 predictions before signup prompt

---

## Architecture

```
+-----------------------+         +------------------------+
|   React Frontend      |  REST   |    FastAPI Backend      |
|   (port 3000)         | <-----> |    (port 8000)         |
+-----------------------+         +------------------------+
                                          |
                     +--------------------+--------------------+
                     |                    |                     |
              +------+------+    +-------+-------+    +--------+--------+
              | ML Model    |    | Supabase DB   |    | RSS Feeds       |
              | (joblib)    |    | (PostgreSQL)  |    | (5 sources)     |
              +-------------+    +---------------+    +-----------------+
```

- **Frontend** communicates with the backend exclusively through REST API calls (CORS configured for localhost:3000)
- **Backend** orchestrates authentication, ML predictions, database operations, RSS scraping, and email delivery
- **Supabase** serves as both the database (PostgreSQL) and managed backend service
- **Background thread** periodically fetches RSS news from configured feeds (configurable interval, default 600s)

---

## Tech Stack

### Backend
| Component | Technology |
|---|---|
| Framework | FastAPI 0.115 |
| Server | Uvicorn 0.34 |
| Database | Supabase (PostgreSQL) via `supabase-py` |
| Authentication | JWT (`python-jose`) + bcrypt |
| ML Framework | scikit-learn 1.6 |
| Model Persistence | joblib |
| Data Processing | pandas 2.2, numpy 2.2 |
| RSS Parsing | feedparser 6.0 |
| Email | SMTP (Gmail) via `fastapi-mail` |
| Validation | Pydantic v2 + pydantic[email] |
| Testing | pytest, pytest-mock, FastAPI TestClient |

### Frontend
| Component | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6.3 |
| Routing | react-router-dom v7 |
| HTTP Client | Axios |
| UI Framework | Bootstrap 5.3 + custom CSS |
| Icons | Font Awesome 6.7 |
| Animations | Framer Motion, Headless UI v2 |
| Notifications | react-toastify |
| Linting | ESLint 9 + typescript-eslint |

### Infrastructure
| Component | Technology |
|---|---|
| Database | Supabase (PostgreSQL) |
| Hosting | Supabase (BaaS) |
| License | MIT |

---

## Project Structure

```
fake-news-detection/
|
|-- config.json                          # Central configuration
|-- requirements.txt                     # Python dependencies
|-- LICENSE                              # MIT License
|
|-- docs/                                # Documentation
|   |-- README.md                        # Documentation index
|
|-- dataset/                             # Training data
|   |-- fake.csv                         # ISOT Fake News Dataset
|   |-- true.csv                         # ISOT Real News Dataset
|   |-- liar/                            # LIAR Dataset
|       |-- train.tsv
|       |-- test.tsv
|       |-- valid.tsv
|
|-- models/                              # Serialized ML artifacts
|   |-- fake_news_model.pkl              # Trained pipeline
|   |-- tfidf_vectorizer.pkl             # TF-IDF vectorizer
|   |-- decision_threshold.pkl           # Optimal decision threshold
|
|-- backend/                             # FastAPI application
|   |-- main.py                          # App entry point + routes
|   |-- models.py                        # Pydantic schemas + ML prediction
|   |-- database.py                      # Supabase client + DB operations
|   |-- config.py                        # Config loader
|   |-- utils.py                         # Text cleaning + password utils
|   |-- train_model.py                   # ML training pipeline
|   |-- analyze_misclassifications.py    # Error analysis + visualization
|   |-- rss_scraper.py                   # RSS feed fetcher
|   |-- email_utils.py                   # Password reset email sender
|   |-- cron_job.py                      # Background RSS scheduler
|   |
|   |-- database/
|   |   |-- schema.sql                   # Full database schema
|   |   |-- seeds.sql                    # Seed data
|   |   |-- README.md                    # Migration guide
|   |
|   |-- tests/                           # Backend tests
|       |-- test_api.py
|       |-- test_model.py
|       |-- test_utils.py
|
|-- frontend/                            # React application
    |-- index.html                       # Vite entry point
    |-- package.json                     # Frontend dependencies
    |-- vite.config.ts                   # Vite config (port 3000)
    |-- tsconfig.json                    # TypeScript config
    |
    |-- public/                          # Static assets
    |   |-- favicon.ico
    |   |-- icons/
    |   |-- image/
    |
    |-- src/
        |-- main.tsx                     # React entry point
        |-- App.tsx                      # Root component + routing
        |-- types.ts                     # TypeScript interfaces
        |
        |-- context/
        |   |-- AuthContext.tsx           # Auth state management
        |
        |-- services/
        |   |-- api.ts                   # Prediction API client
        |   |-- authService.ts           # Auth API client
        |   |-- FeedbackService.ts       # Feedback API client
        |
        |-- components/
        |   |-- NewsChecker.tsx           # News analysis input + results
        |   |-- AnalysisResults.tsx       # Prediction result display
        |   |-- FeedbackModel.tsx         # Star-rating feedback modal
        |   |-- Navbar.tsx               # Navigation bar
        |   |-- Footer.tsx               # Site footer
        |   |-- ProtectedRoute.tsx        # Auth route guard
        |   |-- forms/                   # Auth forms
        |   |-- modals/                  # Auth modals
        |
        |-- pages/
        |   |-- HomePage.tsx             # Landing page
        |   |-- LoginPage.tsx            # Login page
        |   |-- SignupPage.tsx           # Signup page
        |   |-- ForgotPasswordPage.tsx   # Password reset request
        |   |-- ResetPasswordPage.tsx    # Password reset confirm
        |   |-- PrivacyPage.tsx          # Privacy policy
        |   |-- TermsPage.tsx            # Terms of service
        |
        |-- styles/
        |   |-- skin.css                 # Custom stylesheet
        |
        |-- utils/
            |-- validators.ts            # Password validation
```

---

## Prerequisites

- **Python 3.9+**
- **Node.js 18+** and npm
- **Supabase account** (free tier works)
- **Gmail account** with App Password (for password reset emails)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fake-news-detection.git
cd fake-news-detection
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `backend/database/schema.sql`
3. Run `backend/database/seeds.sql` to populate initial data
4. Copy your Supabase URL and anon key into `config.json` (see [Configuration](#configuration))

### 5. Model Training (Optional)

Pre-trained models are included in `models/`. To retrain:

```bash
python -m backend.train_model
```

---

## Configuration

### `config.json`

```json
{
  "supabase": {
    "url": "https://your-project.supabase.co",
    "key": "your-supabase-anon-key"
  },
  "rss_feeds": [
    "https://feeds.bbci.co.uk/news/rss.xml",
    "http://rss.cnn.com/rss/edition.rss",
    "https://feeds.feedburner.com/ndtvnews-top-stories",
    "https://www.thehindu.com/feeder/default.rss",
    "https://news.google.com/rss?hl=en&gl=US&ceid=US:en"
  ],
  "model_path": "backend/fake_news_model.pkl"
}
```

### Environment Variables (`.env`)

```bash
# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
RSS_FEEDS=https://feeds.bbci.co.uk/news/rss.xml,...
FETCH_INTERVAL=600

# Email (for password reset)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com

# Frontend (create frontend/.env)
VITE_API_URL=http://localhost:8000/api
```

---

## Database Schema

Five tables in PostgreSQL (via Supabase):

### `sources`
| Column | Type | Description |
|---|---|---|
| `source_id` | SERIAL PK | Unique source identifier |
| `name` | TEXT | Source name |
| `url_text` | TEXT UNIQUE | Source RSS URL |
| `reliability_score` | REAL | Reliability score (0.0 - 1.0) |

### `articles`
| Column | Type | Description |
|---|---|---|
| `article_id` | SERIAL PK | Unique article identifier |
| `title` | TEXT | Article title |
| `url_text` | TEXT UNIQUE | Article URL |
| `content` | TEXT | Article content |
| `publication_date` | TIMESTAMP | Publication timestamp |
| `source_id` | INTEGER FK | References `sources(source_id)` |

### `analysis`
| Column | Type | Description |
|---|---|---|
| `analysis_id` | UUID PK | Unique analysis identifier |
| `text` | TEXT | Analyzed text |
| `article_id` | INTEGER FK | Nullable, references `articles(article_id)` |
| `prediction` | TEXT | "FAKE" or "REAL" |
| `confidence` | REAL | Confidence score (0.0 - 1.0) |
| `analysis_date` | TIMESTAMP | Analysis timestamp |

### `users`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Unique user identifier |
| `name` | TEXT | User's display name |
| `email` | TEXT UNIQUE | User's email address |
| `password` | TEXT | bcrypt-hashed password |
| `created_at` | TIMESTAMP | Account creation timestamp |

### `feedback`
| Column | Type | Description |
|---|---|---|
| `feedback_id` | SERIAL PK | Unique feedback identifier |
| `user_id` | UUID FK | References `users(id)` |
| `analysis_id` | UUID FK | References `analysis(analysis_id)` |
| `rating` | INTEGER | Star rating (1 - 5) |

---

## API Reference

Base URL: `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs` (Swagger UI)

### Health Check

```
GET /
```

**Response:**
```json
{
  "message": "Fake News Detection API is Running!"
}
```

### Predict News

```
POST /predict
```

**Request Body:**
```json
{
  "text": "Your news article text here (minimum 50 words recommended)..."
}
```

**Response:**
```json
{
  "predictionId": "550e8400-e29b-41d4-a716-446655440000",
  "prediction": "REAL",
  "confidence": 0.9234
}
```

### Authentication

#### Register

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST /auth/login
```

**Request Body** (form-data):
| Field | Type | Description |
|---|---|---|
| `username` | string | User's email address |
| `password` | string | User's password |

**Response:** Same as Register.

#### Request Password Reset

```
POST /auth/request-password-reset
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "If that email exists, a reset link has been sent."
}
```

#### Reset Password

```
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "jwt-reset-token",
  "new_password": "NewSecurePass123"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

### News

#### Get Stored News

```
GET /news
```

**Response:**
```json
{
  "news": [...]
}
```

#### Trigger RSS Fetch

```
POST /fetch_rss
```

**Response:**
```json
{
  "message": "RSS fetching triggered!"
}
```

### Feedback

#### Submit Feedback

```
POST /feedback
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "analysis_id": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5
}
```

---

## Machine Learning Model

### Training Pipeline

1. **Datasets:**
   - **ISOT Fake News Dataset** -- Large collection of real and fake news articles
   - **LIAR Dataset** -- 6-class political statement dataset, mapped to binary (FAKE/REAL)

2. **Preprocessing:**
   - Text cleaning (lowercase, remove URLs/HTML/special chars, normalize whitespace)
   - Class balancing via undersampling
   - Label mapping from 6-class to binary for LIAR dataset
   - Deduplication and shuffling

3. **Pipeline:**
   ```
   TfidfVectorizer (char_wb analyzer) --> LogisticRegression (liblinear solver)
   ```

4. **Hyperparameter Tuning:**
   - GridSearchCV with 5-fold cross-validation
   - Parameters: `ngram_range`, `max_features`, `C` (regularization)

### Model Artifacts

| File | Description |
|---|---|
| `models/fake_news_model.pkl` | Serialized trained pipeline |
| `models/tfidf_vectorizer.pkl` | Extracted TF-IDF vectorizer |
| `models/decision_threshold.pkl` | Optimal decision threshold |

### Retraining

```bash
python -m backend.train_model
```

### Misclassification Analysis

```bash
python -m backend.analyze_misclassifications
```

Generates: confusion matrix, classification report, Brier score, ROC curve, and per-source breakdown.

---

## Testing

```bash
# Run all tests
python -m pytest backend/tests/ -v

# Run specific test file
python -m pytest backend/tests/test_api.py -v
python -m pytest backend/tests/test_model.py -v
python -m pytest backend/tests/test_utils.py -v
```

### Test Coverage

| File | Tests |
|---|---|
| `test_api.py` | Health check endpoint, prediction endpoint |
| `test_model.py` | ML prediction function validation |
| `test_utils.py` | Text cleaning utility functions |

---

## Running the Application

### Start Backend

```bash
# From project root
uvicorn backend.main:app --reload --port 8000
```

### Start Frontend

```bash
# From frontend directory
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 vincenkaze

---

## Acknowledgments

- [ISOT Fake News Dataset](https://www.kaggle.com/c/fake-news) for training data
- [LIAR Dataset](https://www.cs.ucsb.edu/~william/data/liar_dataset/) for additional training data
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Supabase](https://supabase.com/) for database and backend services
- [scikit-learn](https://scikit-learn.org/) for machine learning tools
