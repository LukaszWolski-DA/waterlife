-- Add specifications column to products table
-- Stores an ordered array of {key, value} parameter pairs (e.g. Moc: 2000W)

ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]';
