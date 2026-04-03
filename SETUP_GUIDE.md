# CyberQuest Setup Guide

## Quick Start (Local)
```bash
npm install
# Create .env.local (see below)
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

## .env.local Template (Create this file yourself — never commit it!)
```
DATABASE_URL=your_neon_postgresql_url
NEXTAUTH_SECRET=any_random_32_char_string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ANTHROPIC_API_KEY=your_anthropic_key
```

## Vercel Deploy
1. Push code to GitHub (no .env files!)
2. Import repo on vercel.com
3. Add environment variables in Vercel dashboard
4. Set NEXTAUTH_URL to your vercel domain
5. Deploy!

## Admin Login
Email: admin@cyberquest.io
Password: Admin@CyberQuest2024

## SEO
- Sitemap: yourdomain.com/sitemap.xml
- Robots: yourdomain.com/robots.txt
- Submit to Google Search Console
- Submit to Bing Webmaster Tools
