#!/bin/bash
set -e

echo "🚀 Starting TRAC App (Embedded Mode)..."

# 1. Start PostgreSQL
# We are running as root in this container, but Postgres usually wants non-root.
# We will use 'su postgres' to run the DB commands.
echo "Initializing Database..."

# 0. Configure Postgres to listen on all interfaces
echo "Configuring Postgres listening..."
echo "listen_addresses = '*'" >> /etc/postgresql/*/main/postgresql.conf
echo "host all all 0.0.0.0/0 scram-sha-256" >> /etc/postgresql/*/main/pg_hba.conf

service postgresql start

# Wait for Postgres to be ready
echo "Waiting for Postgres to start..."
until su - postgres -c "pg_isready"; do
  sleep 1
done

# 2. Setup Database and User
# Create default user and db if they don't exist
echo "Setting up User and Database..."
su - postgres -c "psql -c \"CREATE USER trac_user WITH PASSWORD 'trac_password';\" || true"
su - postgres -c "psql -c \"CREATE DATABASE trac_db OWNER trac_user;\" || true"
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE trac_db TO trac_user;\""

# 3. schema Migrations
echo "Applying Schema..."
# Use postgres superuser to run scripts ON the trac_db
su - postgres -c "psql -d trac_db -f /app/table.sql"
su - postgres -c "psql -d trac_db -f /app/supabase_analytics_function.sql"

# Grant table permissions AFTER creating them
su - postgres -c "psql -d trac_db -c \"GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trac_user;\""
su - postgres -c "psql -d trac_db -c \"GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trac_user;\""

# 4. Seed Data
echo "Seeding Data..."
# Ensure env vars are set for seed script if they weren't passed in (though seed.py has defaults now)
export DB_HOST=localhost
export DB_NAME=trac_db
export DB_USER=trac_user
export DB_PASS=trac_password
python3 seed.py

# 5. Start Application
echo "Starting Application..."
# Run Gunicorn
exec gunicorn --bind 0.0.0.0:5000 app:app
