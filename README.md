# Esoterica

The public catalog for Esoterica in Chiclayo, Peru. The site presents Tarot
decks, learning resources, and personalized readings, with purchasing and
booking handled transparently through WhatsApp and the linked marketplaces.

## Prerequisites

- Node.js `>=22.13.0`
- pnpm `11.7.0`

## Local development

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The smoke suite verifies that each public route exists and that canonical URLs,
search discovery files, and the production package-manager policy stay intact.

## Public routes

- `/` — home and featured offerings
- `/tarot` — Tarot and oracle catalog
- `/libros` — learning resources
- `/lecturas` — personalized readings and booking

Set `NEXT_PUBLIC_SITE_URL` when the production domain changes. If it is omitted,
metadata and search discovery use the current Esoterica Sites URL.

## Hosting

This project deploys through OpenAI Sites on Cloudflare Workers. Hosting
bindings stay declared in `.openai/hosting.json`; the current catalog does not
require D1 or R2 storage.

Do not place customer details, secrets, or API keys in browser code. Runtime
configuration belongs in the hosting environment.
