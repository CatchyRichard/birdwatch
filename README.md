# BirdWatch

Your personal bird detection dashboard, powered by BirdWeather.

## What this does
- Pulls live data from your BirdWeather station every hour
- Shows top species, rare detections, activity chart, and first-of-year birds
- Runs entirely free on Netlify

## Setup (one time, ~10 minutes)

### Step 1 — Push this folder to GitHub
1. Go to github.com and create a new repository called `birdwatch`
2. Upload all these files to it (drag and drop works fine)

### Step 2 — Connect to Netlify
1. Go to netlify.com and sign up (free)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your `birdwatch` repository
4. Leave all build settings as default — Netlify will detect them automatically
5. Click **Deploy site**

### Step 3 — You're live!
Netlify will give you a URL like `https://your-site-name.netlify.app`

The app auto-refreshes every hour. You can also hit the Refresh button any time.

## Files
- `public/index.html` — the app
- `netlify/functions/birdweather.js` — the proxy that fetches from BirdWeather
- `netlify.toml` — Netlify configuration
