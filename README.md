# Hexagone Talents Backend

Backend Python/FastAPI for the Hexagone Talents CVtheque MVP.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

The API is exposed under `http://localhost:8080/api`.

## React Frontend

The completed React interface lives in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5174/` and keep the FastAPI server running on port `8080`.
The frontend uses `VITE_API_BASE_URL` when provided, otherwise it calls `/api`.
In development, Vite proxies `/api` to `http://localhost:8080`, so an ngrok
tunnel to the Vite server can be used by other people without their browsers
calling their own `localhost`.

## Structure

```text
app/
  api/
    dependencies.py      # Role/header based access control
    router.py            # Central API router
    routes/              # REST controllers grouped by domain
  core/                  # Config, shared types, database connection
  db/                    # SQLite schema creation and demo seed data
  schemas/               # Pydantic request contracts
  services/              # Business rules and SQL use cases
  main.py                # FastAPI application factory
```

## Demo Accounts

Use `POST /api/auth/login` with one of these usernames. Password is accepted for the simulation.

- `antoine.dev` -> `ETUDIANT`, user id `12`
- `maxime.dev` -> `ETUDIANT`, user id `15`
- `tech.solutions` -> `ENTREPRISE`, user id `201`
- `staff` -> `STAFF`, user id `1`

For protected routes, send:

```http
X-User-Role: ETUDIANT | ENTREPRISE | STAFF
X-User-Id: <id>
```
