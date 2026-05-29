# Pulse Analytics

A modern analytics dashboard built to explore how SaaS platforms track business performance, user activity, and revenue metrics in real time.

This project was developed as a full-stack application using Next.js, PostgreSQL, and TypeScript, with a focus on clean architecture, authentication, data visualization, and responsive user experience.

## Overview

Pulse Analytics provides a centralized dashboard where users can monitor key business metrics through interactive charts and reports. Each account has its own isolated data, making the application behave like a real multi-user SaaS product.

## Features

* Secure email and password authentication
* User-specific analytics and dashboard data
* Revenue tracking and growth monitoring
* KPI cards with period-over-period comparisons
* Interactive charts for revenue, traffic, and user activity
* Traffic source breakdown by channel
* Recent transactions overview
* Responsive design for desktop and mobile devices

## Technology Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Server Actions
* Better Auth

### Database

* PostgreSQL
* Drizzle ORM
* Neon Database

### Data Visualization

* Recharts

## What I Built

This project demonstrates several important full-stack development concepts:

* Authentication and session management
* Database design and ORM integration
* Server-side data fetching
* Analytics dashboard development
* Data visualization
* Responsive UI implementation
* Multi-user application architecture

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` file:

```env
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_secret_key
```

Start the development server:

```bash
pnpm dev
```

Then visit:

```text
http://localhost:3000
```

Create an account and explore the dashboard.

## Project Structure

```text
app/
components/
hooks/
lib/
public/
```

The project follows a modular structure to keep authentication, database access, business logic, and UI components organized and maintainable.

## Future Improvements

Planned enhancements include:

* Settings page
* CSV export
* Advanced filtering
* Pagination
* Landing page
* Enhanced analytics reports

## Author

Larbi Abdelkader

Full Stack Developer focused on building SaaS applications, web platforms, and lightweight tools.

## License

MIT
