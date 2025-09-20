-- Drop all existing related tables (for reset)
drop table if exists feedback, analysis, articles, sources, users cascade;

-- ========================
-- 1. SOURCES
-- ========================
create table sources (
  source_id serial primary key,
  name text not null,
  url_text text unique not null,
  reliability_score real default 0.5 check (reliability_score between 0.0 and 1.0)
);

-- ========================
-- 2. ARTICLES
-- ========================
create table articles (
  article_id serial primary key,
  title text not null,
  url_text text unique not null,
  content text not null,
  publication_date timestamp default current_timestamp,
  source_id integer not null references sources(source_id)
);

-- ========================
-- 3. ANALYSIS (UPDATED)
-- ========================
CREATE TABLE analysis (
  analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  article_id INTEGER REFERENCES articles(article_id),
  prediction TEXT NOT NULL,
  confidence REAL NOT NULL CHECK (confidence BETWEEN 0.0 AND 1.0),
  analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 4. USERS (for auth)
-- ========================
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,                           
  email text unique not null,
  password text not null,
  created_at timestamp default now()
);

-- ========================
-- 5. FEEDBACK (linked to analysis + users)
-- ========================
CREATE TABLE feedback (
  feedback_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  analysis_id UUID NOT NULL REFERENCES analysis(analysis_id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);