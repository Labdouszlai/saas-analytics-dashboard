# Pulse — SaaS Analytics Dashboard

A full-stack analytics dashboard for tracking revenue, user growth, traffic, and
transactions in real time. Built and maintained by **Larbi Abdelkader**.

## Features

- Email + password authentication with secure sessions
- KPI cards with period-over-period comparisons (revenue, users, sessions, conversion)
- Revenue trend area chart and sessions/users bar chart
- Traffic-by-channel breakdown (donut chart)
- Recent transactions table
- Per-user data isolation — every account sees only its own metrics
- Responsive layout (desktop and mobile)

## Tech Stack

- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Auth:** Better Auth (email + password)
- **Charts:** Recharts
- **Styling:** Tailwind CSS

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   DATABASE_URL="your-postgres-connection-string"
   BETTER_AUTH_SECRET="a-random-string-at-least-32-characters"
   # Optional, only for custom domains:
   # BETTER_AUTH_URL="https://your-domain.com"
   ```

   Generate a secret with:

   ```bash
   openssl rand -base64 32
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), create an account at `/sign-up`,
   and your dashboard will be populated with sample analytics data.

## Project Structure

```
app/
  actions/        Server actions (data fetching + seeding)
  api/auth/       Better Auth handler
  sign-in/        Sign-in page
  sign-up/        Sign-up page
  page.tsx        Protected dashboard
components/
  dashboard/      Charts, KPI cards, sidebar, transactions table
lib/
  auth.ts         Better Auth server config
  db/             Drizzle client + schema
```

## License

MIT © Larbi Abdelkader
