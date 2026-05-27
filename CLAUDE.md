# Poetry Generator — Project Context

## What This Project Is
A portfolio/showcase web app that generates original poetry in classic styles, paired with thematically matched public domain artwork from The Metropolitan Museum of Art.

## Monorepo Structure
```
/
├── client/          # React frontend
├── server/          # Node.js + Express backend
├── package.json     # Root-level scripts only (no shared code)
└── CLAUDE.md
```

## Tech Stack
- **Frontend:** React (in `/client`)
- **Backend:** Node.js + Express (in `/server`)
- **Package manager:** npm
- **Poetry generation:** Anthropic API (server-side only)
- **Art source:** Met Museum Open Access API (no key required)

## Environment Variables
Store in `/server/.env` — never commit this file.
- `ANTHROPIC_API_KEY` — required for poetry generation
- `PORT` — backend port (default: 3001)

The React dev server proxies API requests to the Express backend. Configure this in `/client/package.json` under `"proxy"`.

## Core Features

### Poetry Generation
- User selects a **style** (required): Haiku, Sonnet, Limerick, Villanelle, Ode
- User selects a **mood** (required): Whimsical, Jubilant, Wistful, Unmoored, Reverie
- User selects a **tone** (optional): Formal, Intimate, Ironic
- Poems are always original, generated fresh per request
- Style must emulate pre-1927 poets/movements only
- No explicit violence or sexual content
- Each form must strictly observe its structural rules (syllable counts, rhyme schemes, stanza structure)

### Artwork Pairing
- Fetched from the Met Open Access API based on mood metadata
- Each mood maps to primary and fallback search terms:

| Mood | Primary | Fallback |
|---|---|---|
| Whimsical | fantasy, fable | garden, fairy |
| Jubilant | celebration, feast | dance, festival |
| Wistful | longing, twilight | window, solitude |
| Unmoored | storm, vast sea | fog, wanderer |
| Reverie | dream, contemplation | mist, reflection |

- Filter Met results by `isPublicDomain: true`
- If no suitable result found, fall back to a curated list of known Met accession numbers
- Always display full attribution: artist, title, date, museum, accession number

### User Actions
- **Regenerate** — new poem with same style/mood/tone settings
- **Save as image** — exports poem + artwork as a single image (client-side)
- **Share via link** — shareable URL encoding the current poem and artwork

## Known Technical Risks
- **CORS on Met artwork images:** Client-side canvas export (for save-as-image) will fail if the Met's image CDN does not send permissive CORS headers. Test this early. If blocked, a server-side image proxy will be needed in `/server`.
- **Anthropic key must stay server-side** — never expose it to the React client.

## Content Rules (enforce in all prompts)
- Original poems only — do not quote or reproduce existing works
- Pre-1927 styles only — no contemporary influences
- No explicit violence or sexual content
- Strict adherence to each form's structural requirements

## What This Project Is Not
- Not a database-backed app — no persistence layer needed for v1
- Not authenticated — fully public, no user accounts
