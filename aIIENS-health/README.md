# AIIENS HEALTH

> **Healthcare Public-Benefit Platform** — A production-quality MERN stack application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| State/Data | TanStack Query, React Hook Form, Zod |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), HTTP-only cookies, bcrypt |
| Logging | Pino + pino-http |
| Security | Helmet, CORS, express-rate-limit |
| Uploads | Multer |

---

## Project Structure

```
aIIENS-health/
├── client/                  # Vite + React + TypeScript frontend
│   └── src/
│       ├── api/             # Axios instance & typed API functions
│       ├── assets/
│       ├── components/      # Reusable UI components
│       ├── context/         # React contexts (Auth, etc.)
│       ├── features/        # Feature modules (auth, fundraising, blood, …)
│       ├── hooks/           # Custom React hooks
│       ├── layouts/         # Page shell layouts
│       ├── pages/           # Route-level page components
│       ├── routes/          # React Router configuration
│       ├── services/        # API service layer + error helpers
│       ├── types/           # Shared TypeScript types
│       ├── utils/           # Utility helpers
│       └── validators/      # Zod schemas
│
└── server/                  # Express + TypeScript backend
    └── src/
        ├── config/          # env, db, logger
        ├── controllers/     # Route handlers
        ├── events/          # EventEmitter-based domain events
        ├── jobs/            # Scheduled background jobs
        ├── middleware/      # Express middleware
        ├── models/          # Mongoose models
        ├── repositories/    # DB access layer
        ├── routes/          # Express routers
        ├── services/        # Business logic
        ├── types/           # TypeScript augmentations & shared types
        ├── uploads/         # Multer storage config
        ├── utils/           # Utility helpers
        ├── validators/      # Zod request validators
        ├── app.ts           # Express app factory
        └── server.ts        # Entry point
```

---

## Prerequisites

- Node.js ≥ 18
- MongoDB (local instance or Atlas URI)
- npm ≥ 9

---

## Quick Start

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd aIIENS-health

# Install root dev tools (concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure environment

```bash
# Copy the example and fill in your values
cp .env.example server/.env
```

Required variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | ≥32-char random string for access tokens |
| `JWT_REFRESH_SECRET` | ≥32-char random string for refresh tokens |
| `CLIENT_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |
| `PORT` | Express port (default: `5000`) |

### 3. Start development servers

```bash
# Start both client (port 5173) and server (port 5000)
npm run dev
```

### 4. Verify

| Check | URL |
|---|---|
| React frontend | http://localhost:5173 |
| Health endpoint | http://localhost:5000/api/health |
| Health check page | http://localhost:5173/health-check |

---

## API Reference

### `GET /api/health`

Returns server status.

**Response**
```json
{
  "success": true,
  "message": "AIIENS Health API is running"
}
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start client + server in parallel |
| `npm run dev:server` | Start server only |
| `npm run dev:client` | Start client only |
| `npm run build` | Build both for production |
| `npm run lint` | Lint both client and server |
| `npm run typecheck` | TypeScript check both |

---

## Security Notes

- **Never commit** `.env` files — only `.env.example` is tracked.
- JWT secrets must be **cryptographically random** strings ≥ 32 characters.
- All cookies use `httpOnly`, `sameSite`, and `secure` flags in production.
- Sensitive documents and uploads are **never publicly accessible** without authentication.

---

## Roadmap (Foundation → Modules)

- [x] Project scaffold, tooling, environment config
- [x] Express app with security middleware
- [x] MongoDB connection with retry
- [x] JWT auth skeleton (access + refresh tokens)
- [x] Health endpoint
- [x] React app with routing
- [ ] Auth module (register, login, refresh, logout)
- [ ] User profiles
- [ ] Fundraising campaigns
- [ ] Donor management
- [ ] Blood bank (pending regulatory review)
- [ ] Health camps scheduling
- [ ] Impact dashboard

---

## License

MIT — See [LICENSE](LICENSE)
