# Syncscope Frontend

The **Syncscope Frontend** is the administrative interface for Syncscope, designed for organizations to view key metrics, integrations, and usage data. This dashboard is exclusively for admins of paying organizations.

---

## 🧩 Overview

This frontend provides:

- A landing page tailored for organizational admins
- A metrics dashboard to monitor platform activity
- UI for managing and visualizing integrated services
- Secure access restricted to administrators only

---

## ⚙️ Architecture

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State/Form Handling**: React Hook Form, Zod
- **Authentication**: JWT-based auth with admin-only access
- **Charts**: [Recharts](https://recharts.org/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- [PNPM](https://pnpm.io/) installed globally

### Setup

```bash
git clone <repo-url>
cd syncscope-frontend
pnpm install
pnpm dev
```


## 🌐 Environment Variables

The following environment variables are used in development and production:

| Variable                  | Description                          |
|---------------------------|--------------------------------------|
| `NEXT_PUBLIC_API_URL`     | Base URL for the Management API      |
| `NEXT_PUBLIC_AUTH_URL`    | URL to the Auth Service              |
| `NEXT_PUBLIC_JWT_SECRET`  | (Optional) For local dev auth mocks  |

> ⚠️ **Note:** Never expose sensitive secrets in frontend code. All `NEXT_PUBLIC_` vars are publicly exposed at build time.

---

## 🚢 Vercel Deployment (Recommended)

Deploy directly from GitHub with [Vercel](https://vercel.com/):

1. Push the repo to GitHub
2. Import the project in Vercel
3. Add environment variables under **Project Settings → Environment Variables**
4. Deploy!

Production builds run `pnpm build` and use **Next.js optimizations** for static + dynamic content.

---

## 🧪 CI/CD (Optional)

If using CI/CD (e.g., GitHub Actions, Vercel, or Railway):

- Run tests in CI using:

```bash
pnpm test:ci
```

- Ensure coverage thresholds before deployment

- Validate linting with:

```bash
pnpm lint
```