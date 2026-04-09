-- eRevive NW database initialization
-- This runs on first container start when postgres-data volume is empty

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE erevive TO erevive_app;
