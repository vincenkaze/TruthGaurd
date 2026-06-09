# Database Setup & Migration Guide

## Overview

TruthGuard uses **Supabase** (PostgreSQL) for data storage. The database schema consists of 5 tables: `sources`, `articles`, `analysis`, `users`, and `feedback`.

---

## Initial Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** (found in Settings > API)

### 2. Apply the Schema

1. Navigate to the **SQL Editor** in your Supabase dashboard
2. Open `backend/database/schema.sql` and copy its contents
3. Paste into the SQL Editor and click **Run**

This creates all 5 tables with proper constraints and foreign keys.

### 3. Seed Initial Data

1. Open `backend/database/seeds.sql`
2. Run it in the SQL Editor to populate the `sources` table with sample news sources

### 4. Configure the Backend

Update `config.json` or set environment variables:

```json
{
  "supabase": {
    "url": "https://your-project.supabase.co",
    "key": "your-supabase-anon-key"
  }
}
```

---

## Schema Reference

### `sources`
News source registry with reliability scores.

```sql
CREATE TABLE sources (
  source_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url_text TEXT UNIQUE NOT NULL,
  reliability_score REAL DEFAULT 0.5
    CHECK (reliability_score BETWEEN 0.0 AND 1.0)
);
```

### `articles`
Scraped news articles from RSS feeds.

```sql
CREATE TABLE articles (
  article_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_text TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source_id INTEGER NOT NULL REFERENCES sources(source_id)
);
```

### `analysis`
ML prediction results. Each row represents one analysis.

```sql
CREATE TABLE analysis (
  analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  article_id INTEGER REFERENCES articles(article_id),
  prediction TEXT NOT NULL,  -- "FAKE" or "REAL"
  confidence REAL NOT NULL CHECK (confidence BETWEEN 0.0 AND 1.0),
  analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `users`
Registered user accounts.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  created_at TIMESTAMP DEFAULT now()
);
```

### `feedback`
User ratings for prediction accuracy.

```sql
CREATE TABLE feedback (
  feedback_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  analysis_id UUID NOT NULL REFERENCES analysis(analysis_id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);
```

---

## Entity Relationship Diagram

```
sources  1---<  articles  1---<  analysis  >---1  users
                                            >---<  feedback
                                            (via analysis_id)
                         feedback  >---1  users
```

- A **source** can have many **articles**
- An **article** can have many **analyses**
- A **user** can submit many **feedbacks**
- An **analysis** can receive many **feedbacks**

---

## Migrations

### Migration Folder Structure

```
backend/database/
|-- schema.sql      # Initial schema (run first)
|-- seeds.sql       # Seed data
|-- README.md       # This file
```

### Applying Migrations

1. **Always backup your database before running migrations**
2. Apply schema files in order: `schema.sql` first, then any future migration files
3. Use `seeds.sql` to populate initial/reference data

### Creating New Migrations

1. Create a new SQL file in `backend/database/` (e.g., `002_add_column.sql`)
2. Use `ALTER TABLE` statements for schema changes
3. Test on a development database before applying to production

---

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon/public key |

---

## Backup

Before any schema changes:

```bash
# Using Supabase CLI
supabase db dump > backup.sql

# Or export from Supabase dashboard
# Database > Backups > Create backup
```
