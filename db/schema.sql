-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Prompts Table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  preview TEXT NOT NULL,
  ai_agent VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  author_address VARCHAR(42) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Prompt Tags Table
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (prompt_id, tag)
);

-- Purchases Table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  buyer_address VARCHAR(42) NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  purchased_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Ratings Table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  rater_address VARCHAR(42) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (prompt_id, rater_address)
);

-- Indexes
CREATE INDEX idx_prompts_author ON prompts(author_address);
CREATE INDEX idx_purchases_buyer ON purchases(buyer_address);
CREATE INDEX idx_ratings_rater ON ratings(rater_address); 