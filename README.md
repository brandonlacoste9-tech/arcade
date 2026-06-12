# Hell Yeah Games

A React 19 + Vite game-streaming SPA with a ~860-game catalog. Browsing is free;
a **$9.99/mo PRO** subscription (Stripe) unlocks playing HTML5 games and
downloading desktop games. Auth, profiles, and favorites run on **Supabase**;
payments run through a small **Express + Stripe** backend.

## Stack

- **Frontend:** React 19, React Router 7, Vite 8, react-i18next, lucide-react
- **Backend:** `backend/server.js` — Express 5 + Stripe + Supabase service-role client
- **Data:** Supabase (`profiles`, `user_favorites`); schema in `database.sql` + `migration.sql`

## Local development

```bash
npm install
cp .env.example .env        # fill in the values (see below)
npm run dev                 # frontend on http://localhost:5173
npm run server              # backend on http://localhost:4242 (separate terminal)
```

## Environment variables

See `.env.example` for the full list. Summary:

**Frontend (Vite, public — set in Vercel):**
- `VITE_API_URL` — backend base URL (defaults to `http://localhost:4242` in dev)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project + anon key

**Backend (secret — set on the backend host):**
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS — never expose to the client)
- `VITE_SUPABASE_URL` (the backend reads the project URL from this var)
- `CLIENT_URL` — public frontend URL (Stripe redirects + CORS origin)
- `PORT` (defaults to 4242)

## Database setup (Supabase SQL Editor)

Run in this order:

1. `database.sql` — creates `profiles` (incl. `role`, `stripe_customer_id`,
   `stripe_subscription_id`) and `user_favorites`, RLS policies, and the
   entitlement-lockdown trigger.
2. `migration.sql` — for an existing DB created from an older `database.sql`:
   adds the `role` and Stripe columns and the `user_favorites` table.
3. `migration_entitlement_lockdown.sql` — for an existing DB: installs the
   trigger that prevents users from changing their own `plan`/`role`. **Required**
   on any deployment that predates the security fixes.

After setup, promote your owner account to admin (run once):

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

## Security model

- `plan` and `role` can **only** be changed by the backend (service-role key):
  the Stripe webhook and the admin endpoints. A trigger reverts any client-side
  attempt to change them.
- Admin endpoints (`/api/users*`) require a valid Supabase JWT **and**
  `role = 'admin'`, verified server-side.
- The Stripe webhook stores the customer/subscription IDs and downgrades the
  user to FREE on `customer.subscription.deleted`.

## Deployment

- **Frontend:** static build (`npm run build`) → Vercel. Set the `VITE_*` env vars.
- **Backend:** the Express app needs a host (Render/Railway/Fly/etc). Set the
  secret env vars there, point `VITE_API_URL` at it, and register the
  `/webhook` endpoint in the Stripe dashboard with `STRIPE_WEBHOOK_SECRET`.
