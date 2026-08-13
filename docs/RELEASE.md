# v0.1 — Initial Public Portfolio

Release-candidate scope:
- responsive single-page portfolio
- interactive 3D knowledge graph with a non-WebGL fallback
- curated, retrieval-first portfolio answers
- optional server-generated spoken answers with mute and stop controls

## Vercel deployment

1. Import the existing GitHub repository into Vercel; do not create a second project for the same repository.
2. Set `OPENAI_API_KEY` as an encrypted Production environment variable.
3. Optionally override `OPENAI_MODEL`, `TTS_PROVIDER`, `TTS_MODEL`, and `TTS_VOICE`.
4. Use the standard build command: `npm run build`.
5. Add `snapbiz.ai` and `www.snapbiz.ai` in the Vercel project's Domains settings.
6. Set `snapbiz.ai` as the primary domain and redirect `www.snapbiz.ai` to it.
7. Copy the exact DNS records shown by Vercel into Spaceship without changing nameservers or unrelated mail records.

No database, persistent storage, or custom Vercel configuration is required. The chat and speech endpoints run as Node.js route handlers. Rate limiting is in-memory and instance-local, so it is a lightweight abuse safeguard rather than a globally durable quota.

The canonical application URL is `https://snapbiz.ai`. Vercel should provision and renew HTTPS certificates automatically after both domain records verify successfully.

## Content required before broad promotion

The current CV, LinkedIn, and email values intentionally route to the contact section until approved public URLs are supplied. Replace those canonical values in `src/data/portfolio.ts` before advertising those controls as direct download/contact links.
