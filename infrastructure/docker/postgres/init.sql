-- eRevive NW database initialization
-- This runs on first container start when postgres-data volume is empty

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE erevive TO erevive_app;

-- Anonymous donor user for public donations (no login)
-- Created after migrations run; this is a fallback
-- INSERT INTO users (id, email, password_hash, full_name, role)
-- VALUES ('anonymous', 'anonymous@erevivenw.local', 'nologin', 'Anonymous Donor', 'anonymous')
-- ON CONFLICT DO NOTHING;
