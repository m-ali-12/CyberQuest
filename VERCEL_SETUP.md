# Vercel Environment Variables Setup

Go to: vercel.com → Your Project → Settings → Environment Variables

Add these variables (get values from your .env.local file):

| Key | Value Source |
|-----|-------------|
| DATABASE_URL | Your Neon connection string |
| NEXTAUTH_SECRET | Any random 32+ char string |
| NEXTAUTH_URL | https://your-app.vercel.app |
| NEXT_PUBLIC_APP_URL | https://your-app.vercel.app |
| GOOGLE_CLIENT_ID | From Google Cloud Console |
| GOOGLE_CLIENT_SECRET | From Google Cloud Console |
| ANTHROPIC_API_KEY | From console.anthropic.com |

After adding all variables → Click **Redeploy**
