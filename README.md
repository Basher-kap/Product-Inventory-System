# Product-Inventory-System
after learning Git deeply, this is for educational project purposes for my ITE193 sub

## PostgreSQL migration
The application has been updated to use PostgreSQL instead of MongoDB.

### Local setup
1. Copy `.env.example` to `.env` and adjust values if needed.
2. Start a PostgreSQL server locally on `localhost:5432`.
3. Run `npm install`.
4. Run `npm start`.

### Docker setup
- `Dockerfile.postgres` builds a PostgreSQL image with schema and seed data.
- `docker-compose.yml` starts both PostgreSQL and the Node.js app.

Use:
```bash
docker compose up --build
```

### Notes
- PostgreSQL schema is defined in `db/init.sql`.
- PostgreSQL access is configured through `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.

