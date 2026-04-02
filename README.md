# Movie Watchlist — PostgreSQL Backend Server

A RESTful API backend built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL** (via Neon serverless). It provides user authentication and a personal movie watchlist system.

---

## Why This Project Was Built

The goal was to learn and practise:

- Setting up a production-style Node.js backend with **ES Modules** (`"type": "module"`)
- Using **Prisma v7** with a driver adapter (`@prisma/adapter-pg`) — required in v7 since the built-in Rust query engine was removed
- Designing a **relational database schema** with proper foreign keys and cascade deletes
- Implementing **JWT authentication** securely (token in `httpOnly` cookie + `Authorization` header support)
- Validating request bodies with **Zod v4**
- Seeding a database with realistic data

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Runtime | Node.js v25 (ES Modules) |
| Framework | Express v5 |
| ORM | Prisma v7 |
| DB Driver | `pg` + `@prisma/adapter-pg` (required by Prisma v7) |
| Database | PostgreSQL (Neon serverless) |
| Auth | `jsonwebtoken` + `bcryptjs` |
| Validation | Zod v4 |
| Dev server | nodemon |

---

## Project Structure

```
postgress-backend-server/
├── prisma/
│   ├── schema.prisma        # Database models: User, Movie, WatchlistItem
│   ├── seed.js              # Seeds sample movies into the database
│   └── migrations/          # Auto-generated SQL migration files
├── src/
│   ├── server.js            # App entry point — express setup, routes, error handlers
│   ├── config/
│   │   └── db.js            # PrismaClient setup with pg adapter, connect/disconnect helpers
│   ├── controllers/
│   │   ├── authController.js      # register, login, logout
│   │   └── watchlistController.js # addWatchlist, removeFromWatchList, updateWatchlistItem
│   ├── routes/
│   │   ├── authRoute.js           # POST /auth/register, /auth/login, /auth/logout
│   │   ├── movieRoutes.js         # GET/POST/PUT/DELETE /movies
│   │   └── watchlistRoutes.js     # POST/DELETE/PUT /watchlist (protected)
│   ├── middleware/
│   │   ├── authMiddleware.js      # Verifies JWT, attaches req.user
│   │   └── validateRequest.js     # Generic Zod schema validator middleware
│   ├── validators/
│   │   └── watchlistValidator.js  # Zod schema for watchlist request body
│   └── utils/
│       └── generateToken.js       # Signs JWT and sets httpOnly cookie
├── prisma.config.ts         # Prisma v7 config — datasource URL lives here (not schema.prisma)
├── package.json
└── .env                     # Environment variables (never commit this)
```

---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| name | String | |
| email | String | Unique |
| password | String | Bcrypt hashed |
| createdAt | DateTime | Auto |

### Movie
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| title | String | |
| overview | String? | Optional |
| releaseYear | Int | |
| genres | String[] | Array of genre strings |
| runtime | Int? | Minutes, optional |
| posterUrl | String? | Optional |
| createdBy | String | FK → User.id (cascade delete) |
| createdAt | DateTime | Auto |

### WatchlistItem
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User.id (cascade delete) |
| movieId | String | FK → Movie.id (cascade delete) |
| status | Enum | PLANNED / WATCHING / COMPLETED / DROPPED |
| rating | Int? | 1–10, optional |
| notes | String? | Max 500 chars, optional |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

> `@@unique([userId, movieId])` — prevents a user from adding the same movie twice.

---

## Why Prisma v7 Needs an Adapter

In Prisma v6 and below, Prisma bundled its own Rust-based query engine binary. In **Prisma v7 this was removed**. You must now provide a driver adapter that connects Prisma to the database using a standard Node.js driver:

```js
// src/config/db.js
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

This also means the `url` field is **no longer placed in `schema.prisma`** — it lives in `prisma.config.ts`:

```ts
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

## Why ES Modules Require `.js` Extensions

`package.json` has `"type": "module"`, which activates Node's native ES Module loader. Unlike CommonJS, ESM does **not** automatically resolve extensions. Every local import must include `.js`:

```js
// ❌ Will crash with ERR_MODULE_NOT_FOUND
import { prisma } from "../config/db"

// ✅ Correct
import { prisma } from "../config/db.js"
```

---

## API Endpoints

### Auth — `/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create new user, returns JWT | No |
| POST | `/auth/login` | Login, returns JWT | No |
| POST | `/auth/logout` | Clear JWT cookie | No |

**Register / Login request body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "name": "Alice", "email": "alice@example.com" },
    "token": "<jwt>"
  }
}
```

---

### Movies — `/movies`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/movies` | List all movies | No |
| POST | `/movies` | Create a movie | No |
| PUT | `/movies` | Update a movie | No |
| DELETE | `/movies` | Delete a movie | No |

---

### Watchlist — `/watchlist`

All watchlist routes require a valid JWT — either via `Authorization: Bearer <token>` header or the `jwt` httpOnly cookie set at login.

| Method | Path | Description |
|---|---|---|
| POST | `/watchlist` | Add a movie to your watchlist |
| DELETE | `/watchlist/:id` | Remove a watchlist item (owner only) |
| PUT | `/watchlist/:id` | Update status / rating / notes |

**Add to watchlist request body:**
```json
{
  "movieId": "<uuid>",
  "status": "PLANNED",
  "rating": 8,
  "notes": "Want to rewatch this"
}
```

`status` must be one of: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPPED`.

---

## Authentication Flow

1. User registers → password is **bcrypt-hashed** before storage
2. On login → password is compared with `bcrypt.compare()`
3. A **JWT** is signed with `JWT_SECRET` and set as an `httpOnly` cookie **and** returned in the response body
4. Protected routes use `authMiddleware.js` which:
   - Reads the token from the `Authorization` header or cookie
   - Verifies it with `jwt.verify()`
   - Looks up the user in the DB and attaches them to `req.user`

---

## Request Validation

[Zod v4](https://zod.dev) is used for request body validation through a reusable middleware:

```js
// validateRequest middleware extracts errors from result.error.issues
// (Zod v4 — .issues is used instead of .format() which changed in v4)
router.post("/", validateRequest(adddToWatchlistSchema), addWatchlist)
```

**Error response format:**
```json
{
  "success": false,
  "errors": ["Status must be one of PLANNED, WATCHING, COMPLETED, DROPPED"]
}
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
NODE_ENV="development"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

---

## Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate dev

# 4. (Optional) Seed sample movies
npm run seed:movies

# 5. Start development server
npm run dev
```

Server starts at `http://localhost:5000`.

---

## Key Lessons Learned

| Problem | Root Cause | Fix |
|---|---|---|
| `PrismaClientInitializationError` | Prisma v7 removed built-in engine | Pass `adapter` to `PrismaClient` everywhere it is instantiated |
| `ERR_MODULE_NOT_FOUND` | ESM requires explicit `.js` extensions | Add `.js` to all local imports |
| Zod validation returning `undefined` | `error.format()` structure changed in Zod v4 | Use `error.issues.map(i => i.message)` |
| `TypeError: argument handler is required` | Empty route `router.delete("/", )` with no handler | Remove the route or add a handler |
| `DATABASE_URL` undefined at startup | ESM hoists imports before `config()` runs | Import `dotenv/config` at the top of `db.js` |
