# TruthGuard Documentation

Welcome to the TruthGuard documentation. TruthGuard is an AI-powered fake news detection web application that analyzes news articles and classifies them as FAKE or REAL using machine learning.

---

## Documentation Index

### Getting Started
- **[Main README](../README.md)** -- Project overview, features, architecture, installation, and configuration
- **[Backend README](../backend/README.md)** -- Backend setup, API routes, modules, and testing
- **[Frontend README](../frontend/README.md)** -- Frontend setup, components, routing, and services

### Architecture
- **[Database Schema](../backend/database/schema.sql)** -- Full PostgreSQL schema (5 tables)
- **[Database Migration Guide](../backend/database/README.md)** -- How to apply schema and migrations

### Machine Learning
- **[Model Training](../backend/train_model.py)** -- ML pipeline: TF-IDF + LogisticRegression with GridSearchCV
- **[Misclassification Analysis](../backend/analyze_misclassifications.py)** -- Error analysis and visualization

### API
- **Swagger UI** -- `http://localhost:8000/docs` (when server is running)
- **ReDoc** -- `http://localhost:8000/redoc` (when server is running)

---

## Project Overview

TruthGuard is a full-stack web application that uses natural language processing and machine learning to detect fake news articles. Users can paste news text and receive an instant classification with a confidence score.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Bootstrap 5 |
| Backend | FastAPI 0.115, Python 3.x |
| ML | scikit-learn 1.6 (LogisticRegression + TF-IDF) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (python-jose) + bcrypt |

### Key Features

- News authenticity analysis with confidence scores
- RSS news aggregation from 5 major sources
- JWT-based user authentication
- Guest prediction limit (3 free predictions)
- Star-rating feedback system
- Responsive mobile-first design
- Password reset via email

---

## Quick Reference

### Running the Application

```bash
# Backend (from project root)
uvicorn backend.main:app --reload --port 8000

# Frontend (from frontend/ directory)
npm run dev
```

### Access Points

| URL | Description |
|---|---|
| `http://localhost:3000` | Frontend application |
| `http://localhost:8000` | Backend API |
| `http://localhost:8000/docs` | Swagger API docs |
| `http://localhost:8000/redoc` | ReDoc API docs |

### Testing

```bash
python -m pytest backend/tests/ -v
```

---

## License

MIT License -- Copyright (c) 2025 vincenkaze
