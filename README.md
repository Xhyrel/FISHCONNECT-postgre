# FishConnect

FishConnect is a seafood marketplace that connects fish vendors with buyers. The React frontend uses an Express API backed by PostgreSQL. Use DBngin to run PostgreSQL locally and TablePlus to connect to and manage the database.

## Features

- Buyer and seller registration and login
- Product listings, inventory, and image uploads
- Cart orders, payment proof, order status, and tracking history
- Product reviews and buyer wishlists

## Technology

- Frontend: React 19 and Vite
- Backend: Node.js and Express 5
- Database: PostgreSQL via `pg` (local DBngin or Supabase)
- Local database client: TablePlus

## Requirements

- Node.js 20 or later and npm
- DBngin and TablePlus for local PostgreSQL development
- A running PostgreSQL database

## Setup

### 1. Create the database

1. In DBngin, create and start a PostgreSQL server. Note its host, port, username, and password.
2. In TablePlus, create a PostgreSQL connection using those settings. Create a database named `fishconnect_db` if needed.
3. Open `fishconnect-backend/schema.sql` in TablePlus and run the complete file against `fishconnect_db`.

### 2. Configure environment variables

Copy `fishconnect-backend/.env.example` to `fishconnect-backend/.env` and set the local PostgreSQL password and a long, private `JWT_SECRET`.

| Variable | Purpose |
| --- | --- |
| `PGHOST` | PostgreSQL host, normally `127.0.0.1` locally |
| `PGPORT` | PostgreSQL port, normally `5432` locally |
| `PGDATABASE` | Database name, normally `fishconnect_db` |
| `PGUSER` / `PGPASSWORD` | Database credentials |
| `PGSSL` | Set `true` when connecting to Supabase |
| `DATABASE_URL` | Optional PostgreSQL connection string; takes precedence over individual connection fields |
| `JWT_SECRET` | Private signing secret for API authentication |
| `PORT` | Backend port; defaults to `5000` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |

The frontend defaults to `http://localhost:5000/api`. To change it, copy the root `.env.example` to `.env` and set `VITE_API_URL` to the API base URL, including `/api`.

### 3. Install dependencies

Run these commands from the project root:

```powershell
npm install
cd fishconnect-backend
npm install
```

### 4. Run the application

From the project root, open two terminals. Start the backend in the first:

```powershell
cd fishconnect-backend
npm start
```

In the second terminal, run the frontend from the project root:

```powershell
cd C:\path\to\FishConnect
npm run dev
```

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Supabase and Vercel deployment

1. Create a Supabase project and run `fishconnect-backend/schema.sql` in its SQL Editor.
2. Deploy the frontend as a Vercel project from the repository root.
3. Deploy the Express backend as a separate Vercel project with `fishconnect-backend` as its project root.
4. Set `DATABASE_URL`, `PGSSL=true`, `JWT_SECRET`, and `CORS_ORIGINS` in the backend's Vercel environment. Set the frontend's `VITE_API_URL` to the backend's deployed URL ending in `/api`.

Do not commit `.env` files, database credentials, JWT secrets, or Supabase service keys. Store deployment secrets in the hosting provider's environment settings.

**Image storage note:** Product and payment images currently use the backend's local `uploads` folder. This works locally but is not durable on Vercel. Move uploads to Supabase Storage before relying on image uploads in production. Vercel's Express deployment does not serve files through Express static middleware, and function request bodies have a 4.5 MB limit.

## Project structure

```text
src/                         React frontend
fishconnect-backend/
  config/db.js                PostgreSQL connection
  controllers/                API handlers
  routes/                     API route modules
  schema.sql                  PostgreSQL tables and indexes
  server.js                   Express API
```

## Useful commands

```powershell
npm run dev       # Start the frontend
npm run build     # Build the frontend for production
npm run preview   # Preview the frontend production build
npm run lint      # Lint the frontend source
```

Run `npm start` from `fishconnect-backend` to start the API.

