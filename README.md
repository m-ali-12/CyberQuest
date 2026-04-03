# 🛡️ CyberQuest — Cybersecurity Learning Platform

A full-stack gamified cybersecurity learning platform with courses, CTF challenges, exams, certifications, and a secure admin panel.

---

## ✨ Features

- 🎮 **Gamified Learning** — XP, levels, streaks, achievements
- 📚 **Multi-Level Courses** — Beginner → Expert roadmap
- 🔓 **CTF Challenges** — 200+ hands-on challenges
- 📝 **Timed Exams** — Auto-graded with review
- 🎓 **Certifications** — Verifiable certificates
- 🗺️ **Learning Roadmap** — Structured 6-phase path
- 🏆 **Leaderboard** — Compete with other hackers
- 🔐 **Secure Auth** — Session limits + auto-ban
- 👑 **Admin Panel** — Full user management
- 💳 **Free + Pro Plans** — Trial then paid

---

## 🗄️ Database — Neon (Free PostgreSQL)

**Neon is the recommended free database** (Supabase alternative):

1. Go to **https://neon.tech** → Create free account
2. Click **"New Project"** → Choose region
3. Copy the **Connection String** (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Paste it as `DATABASE_URL` in your `.env.local`

**Neon Free Tier:**
- 0.5 GB storage
- 1 project
- Serverless — scales to zero
- Perfect for Vercel

**Alternative Free Databases:**
| Database | Free Tier | Notes |
|----------|-----------|-------|
| **Neon** ✅ | 0.5GB PostgreSQL | Best for Vercel |
| **PlanetScale** | 5GB MySQL | Great free tier |
| **Railway** | $5 credit/mo | PostgreSQL |
| **Turso** | 500MB SQLite | Edge-optimized |
| **Aiven** | Trial PostgreSQL | 30 days |

---

## 🚀 Local Setup

```bash
# 1. Clone / extract this project
cd cyberquest

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Seed database (creates admin + courses + challenges)
npm run db:seed

# 6. Start dev server
npm run dev
```

Open **http://localhost:3000**

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cyberquest.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to **https://vercel.com** → New Project
2. Import your GitHub repo
3. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | (optional) From Google Console |
| `GOOGLE_CLIENT_SECRET` | (optional) |

4. Click **Deploy**

### Step 3: Run migrations on production
After first deploy, run in Vercel terminal or locally with production DB:
```bash
DATABASE_URL="your-neon-url" npx prisma db push
DATABASE_URL="your-neon-url" npm run db:seed
```

---

## 🔑 Admin Access

After seeding, login with:
- **Email:** `admin@cyberquest.io`
- **Password:** `Admin@CyberQuest2024`

⚠️ **Change the admin password immediately after first login!**

Admin panel: `/admin`

---

## 🔒 Security Features

### Session Limiting
- Max **3 active sessions** per account
- Detected on login — not per-request (efficient)

### Auto-Ban System
When a 4th session is attempted:
1. **First violation:** 40-minute ban
2. **Second violation:** 80-minute ban
3. **Third violation:** 160-minute ban
4. Each subsequent: doubles (max ~640 min / ~10 hours)

### Password Security
- bcrypt with 12 salt rounds
- Minimum 8 characters enforced
- Strength meter on registration

---

## 💰 Stripe Integration (Optional)

To enable Pro plan payments:

1. Create account at **https://stripe.com**
2. Create a product with monthly subscription
3. Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
```
4. Update the payment link in `/app/dashboard/upgrade/page.tsx`

---

## 🗂️ Project Structure

```
cyberquest/
├── app/
│   ├── (public)/          # Landing, login, register
│   ├── dashboard/         # Protected user area
│   │   ├── courses/       # Course browser + lesson viewer
│   │   ├── challenges/    # CTF challenges
│   │   ├── exams/         # Timed exams
│   │   ├── certifications/# Earned certs
│   │   ├── roadmap/       # Learning path
│   │   ├── leaderboard/   # Rankings
│   │   ├── stats/         # Analytics
│   │   └── settings/      # Profile
│   ├── admin/             # Admin panel (role-protected)
│   ├── api/               # API routes
│   └── verify/            # Public cert verification
├── components/
│   └── layout/            # Sidebar, TopBar
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # DB client
│   └── utils.ts           # Helpers
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Sample data
└── styles/
    └── globals.css        # Cyber theme CSS
```

---

## 🎨 Customization

### Changing colors
Edit `tailwind.config.js` → `theme.extend.colors.cyber`

### Adding courses
Use Prisma Studio: `npm run db:studio`
Or add to `prisma/seed.js` and re-run seed.

### Adding challenges
```js
await prisma.challenge.create({
  data: {
    title: "My Challenge",
    description: "Solve this...",
    category: "WEB",
    difficulty: "BEGINNER",
    points: 100,
    flag: "FLAG{answer}",
    hints: ["Hint 1"],
    isPremium: false,
  }
})
```

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Charts | Recharts |
| Animations | CSS + Framer Motion |
| Deploy | Vercel |

---

## 🤝 Support

If you encounter any issues:
1. Check that all env variables are set
2. Run `npx prisma generate` after any schema changes
3. Check Vercel function logs for API errors

**Common issues:**
- `PrismaClientInitializationError` → Check DATABASE_URL
- `NEXTAUTH_SECRET` missing → Add to env vars
- Images not loading → Check `next.config.js` domains
