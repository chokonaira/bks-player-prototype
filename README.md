# BKS Player Prototype

A mobile-first player & discovery concept for Best Kept Secret, built in the
production stack (Next.js App Router + TypeScript + Tailwind, deploy on Vercel).

**This is a standalone hypothesis prototype.** It uses mock data and royalty-free
placeholder audio — no BKS content, artwork, or backend.

## What it demonstrates
- **Persistent mini-player** that survives route changes (expandable to full screen)
- **Mobile bottom-tab navigation** (the current site isn't responsive on phones)
- **Continue Listening / resume** and a **For You** rail (personalization stub)
- **Sleep timer with fade-out**, playback speed, skip ±15/30s

## Run locally
```bash
npm install
npm run dev   # http://localhost:3000
```

## Placeholder audio
`public/audio/sample-1.mp3` and `sample-2.mp3` are locally generated ambient
tones (no third-party content). Swap in any royalty-free clips if preferred:
Pixabay Audio, Free Music Archive, or any CC0 clip.

## Deploy
```bash
npx vercel     # or push to GitHub and import at vercel.com
```

## How it maps to production
- Player state → React context here; in prod, lift to a store + persist resume
  points via an events API (also feeds the analytics/event layer).
- Audio source → swap mock `src` for CloudFront signed URLs; progressive MP3 today,
  HLS-ready via `<audio>` / hls.js on the roadmap.
- `For You` → currently static; wire to mood/VA affinity + play-history signals.
