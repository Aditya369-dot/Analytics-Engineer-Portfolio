# Secret configuration

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` only in `.env.local`.
3. Optionally set `OPENAI_MODEL` to an approved server-side model identifier.
4. Never put a real value in `.env.example`, source code, logs, screenshots, issues, or chat messages.

`.env.local` and other secret-bearing environment variants are ignored by Git. `.env.example` is intentionally trackable and must contain variable names and safe defaults only.

## Production

Configure `OPENAI_API_KEY` in the deployment platform's encrypted environment-variable settings. Do not place it in repository files, build arguments, or client-visible configuration.

The key must never use a `NEXT_PUBLIC_` prefix. Next.js exposes variables with that prefix to browser bundles. Only modules under `src/server/` may read provider credentials, and client components must communicate through the server API route.

## Incident response

If a key appears in source control, logs, screenshots, issues, or chat history, revoke it immediately and create a replacement. Removing a key from the latest commit does not remove it from Git history.
