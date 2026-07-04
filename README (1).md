<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-blueviolet" alt="status" />
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black" alt="next" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="license" />
</p>

<h1 align="center">🤝 BroHelp</h1>
<p align="center"><b>"Trade Skills. Not Stress."</b></p>
<p align="center">A peer-powered micro-economy platform where students help students — securely, anonymously, and with real returns.</p>

---

## 📖 About the Project

Campuses are full of talent — coders, designers, writers, and subject experts — but that talent has nowhere to go. There is no official way for a skilled student to earn from helping a peer, no dedicated space to request or offer academic help, and no safe way to turn a bit of spare time into flexible, legitimate income. AI tools can answer basic questions, but complex assignments and projects still need human insight, context, and creativity that only another student can provide.

**BroHelp** is a Next.js web platform built to close that gap. Students post tasks they need help with, other students browse and apply, and once both sides agree, the platform handles the rest — secure escrow for payment, encrypted private chat, delivery/handover tracking, and a rating system that builds trust over time. Every interaction is anonymous and privacy-first by design: no public profiles, no exposed identities, just a safe space to get work done.

In short, BroHelp turns the informal, invisible peer-help economy that already exists on every campus into something structured, trusted, and rewarding for everyone involved.

## 🚩 The Problem

| Pain Point | Description |
|---|---|
| **Untapped skills** | Talented students in coding, design, writing, and academics have no platform to monetize or officially share their expertise. |
| **No peer-help ecosystem** | Unlike tutoring or placement cells, there's no dedicated space bridging "I need help" with "I can help." |
| **No safe micro-income** | Students want flexible, skill-based earning opportunities alongside their studies, but no structured system exists on campus. |
| **AI isn't enough** | AI tools handle basic tasks, but complex projects need human insight, experience, and creativity — something only real peers can offer. |

## ✨ Key Features

- **Anonymous Task Marketplace** — Post any task → browse & apply → mutual acceptance → secure escrow.
- **Privacy-First Design** — Anonymous help, private encrypted chat, no public profiles.
- **Real-Time Logistics** — File sharing, physical delivery tracking, location coordination, and delivery confirmation for handovers.
- **Skill Monetization & Earnings** — Help Score system, flexible micro-income, and college event access as you build reputation.
- **Expert Guidance Requests** — Get pointed toward subject experts and senior students for deeper help.
- **Schedule Coordination** — Built-in tools to align timelines between poster and helper.
- **Ratings & Reviews** — Trust-building feedback loop after every completed task.
- **College Event Integration** — Ties platform activity into campus events and engagement.
- **Smart Notifications** — Real-time alerts for task updates, chats, and deadlines.
- **Analytics Dashboard** — Help Score, user insights, and audit logs for transparency.

## 🔄 How It Works — User Journey

| Stage | Poster (Needy) | Helper (Doer) | Platform |
|---|---|---|---|
| 1. Discover | Sign up, scroll, decide to post | Sign up, browse personalized feed | Smart algorithm tracks behavior |
| 2. Coin Purchase | Buy coins to post/boost | Buy coins to apply | Secure payment + wallet |
| 3. Create & Match | Create task (details, reward) | Find task, show interest | Smart matching (tags, boost) |
| 4. Agreement | Chat privately, confirm helper | Chat, agree, deposit coins | Encrypted chat, escrow holds |
| 5. Execution | Track progress & updates | Complete work, upload/ship | Logistics + timeline tracking |
| 6. Review & Pay | Review, rate, release payment | Get deposit + earn reward | Manual/AI quality check |
| 7. Repeat / Redeem | Post again, convert coins | New tasks, withdraw earnings | Wallet update + payout |

**Flywheel:** Help delivered → Skills rewarded → Trust built → Collaboration grows → Repeat.

## 🏗️ Technology Stack

BroHelp is built using **Next.js** and **React** for the frontend, **PostgreSQL** for the database (hosted on **Supabase**), **Google** and **GitHub** for authentication, and deployed on **Vercel**.

| Layer | Technologies |
|---|---|
| **Frontend** | React, Next.js (Mobile-First UI, PWA), Tailwind CSS |
| **Backend** | Next.js API routes, WebSockets, RESTful APIs, Microservices |
| **Database** | PostgreSQL, Prisma ORM, Supabase, Google Cloud |
| **Security** | Google & GitHub OAuth, JWT Authentication, End-to-End Encryption, Data Anonymization |
| **Fintech** | UPI Gateway, Escrow System, Wallet Integration, Redeem Fee (3–5%) |
| **Real-Time** | Socket.io, Pusher, Push Notifications, Live Tracking, Status Updates |
| **AI & Smart Systems** | Smart Matching, AI Quality Checks, Personalized Feed, Behavior Tracking |
| **DevOps** | Docker, CI/CD Pipeline, Auto-scaling |
| **Analytics** | Dashboard, Help Score, User Insights, Audit Logs |

### Core Dependencies

- [`next`](https://nextjs.org) — App framework
- [`next-auth`](https://authjs.dev) (v5 beta) + [`@auth/prisma-adapter`](https://authjs.dev/reference/adapter/prisma) — Authentication (Google, GitHub, Credentials)
- [`prisma`](https://www.prisma.io) + [`@prisma/adapter-pg`](https://www.prisma.io) — Database ORM on PostgreSQL
- [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) — Password hashing
- [`pusher`](https://pusher.com) / [`pusher-js`](https://pusher.com) — Real-time messaging & notifications
- [`date-fns`](https://date-fns.org) — Date utilities
- [`lucide-react`](https://lucide.dev) — Icon set
- [`tailwindcss`](https://tailwindcss.com) — Styling

## 💰 Business Model

BroHelp runs on **6 revenue streams**: transaction fees, coin margin, featured listings, premium profiles, logistics commission, and event partnerships — a small percentage cut, micro-markup, booster packs, verified fees, delivery cuts, and event commissions.

**Value delivered:**
- **For Students** — Earn while learning, save time & effort, build a peer network, access micro-employment.
- **For Campus** — Fosters a peer-learning culture, skill monetization, reduced student stress, and collaboration.

More users → more tasks → more helpers → more transactions & coins → more revenue → platform reinvests in UX → more trust — a self-reinforcing network effect.

## 🔐 Security & Trust Foundations

- 100% anonymous interaction
- Complete transaction tracking & audit logs
- Secure escrow protection for every task
- Behavior-based smart feed
- Manual → AI quality monitoring pipeline
- Private, end-to-end encrypted communication

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (e.g. via [Supabase](https://supabase.com))
- npm (or yarn/pnpm/bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-org>/brohelp.git
cd brohelp

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Auth.js
AUTH_SECRET="your-auth-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Pusher (real-time)
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Run Prisma generate + build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## 📁 Project Structure (key files)

```
├── app/                    # Next.js app router pages
├── lib/
│   └── prisma.ts           # Prisma client instance
├── auth.ts                 # NextAuth.js configuration (Google, GitHub, Credentials)
├── proxy.ts                # Middleware — route protection & session checks
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration history
├── prisma.config.ts        # Prisma CLI configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
└── postcss.config.mjs      # PostCSS / Tailwind configuration
```

## 🗺️ Roadmap

- [ ] Expand AI-assisted quality checks for submitted work
- [ ] Add in-app dispute resolution flow
- [ ] Launch college event partnership integrations
- [ ] Mobile app (PWA → native wrapper)
- [ ] Multi-campus expansion

## 👥 Team

Built at **Walchand Institute of Technology, Solapur** (S.A.P.D. Jain Pathshala) for **WITchar 2026 — Project Competition**.

- **Pruthviraj S. Birajdar**
- **Shouryapalsingh S. Varma**

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Help when you need. Earn when you help. Privacy always.</p>
