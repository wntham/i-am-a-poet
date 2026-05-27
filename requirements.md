# Poetry Generator — Requirements

## Purpose

A portfolio/showcase web app that generates original poetry in classical forms, paired with thematically matched public domain artwork from The Metropolitan Museum of Art.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Poetry generation | Anthropic API (`claude-opus-4-7`) |
| Artwork source | Met Museum Open Access API (no key required) |
| Package manager | npm |
| Deployment | Vercel |

---

## Poetry Generation

### Styles (user picks one, required)

| Style | Structural rules |
|-------|-----------------|
| Haiku | 3 lines — 5 / 7 / 5 syllables |
| Sonnet | 14 lines, iambic pentameter, ABAB CDCD EFEF GG rhyme |
| Limerick | 5 lines, AABBA rhyme, anapestic meter |
| Villanelle | 19 lines, 5 tercets + closing quatrain, alternating A1bA2 refrains |
| Ode | 10+ lines, elevated diction, apostrophe address to subject |

### Moods (user picks one, required)

Whimsical · Jubilant · Wistful · Unmoored · Reverie

### Tone (deferred to v2)

Optional Formal / Intimate / Ironic tone not included in v1.

### Content rules (enforced in system prompt)

- All poems are wholly original — no quotation of existing works
- Style emulates pre-1927 poets/movements only (Romantics, Imagists, Victorian, Classical Japanese)
- No explicit violence or sexual content
- Each form strictly observes its structural requirements

---

## Artwork Pairing

**Source:** Met Museum Open Access API — public domain only (`isPublicDomain: true`).

**Mood → search term mapping:**

| Mood | Primary terms | Fallback terms |
|------|--------------|----------------|
| Whimsical | fantasy, fable | garden, fairy |
| Jubilant | celebration, feast | dance, festival |
| Wistful | longing, twilight | window, solitude |
| Unmoored | storm, sea | fog, wanderer |
| Reverie | dream, contemplation | mist, reflection |

**Fallback:** If both search attempts fail, a curated list of known Met public domain accession numbers is used.

**Mandatory attribution (displayed in UI and exported image):**
- Artist name
- Artwork title
- Date / period
- "The Metropolitan Museum of Art" (linked to object page)
- Accession number

---

## User Actions

### Generate
- User selects Style + Mood, submits form
- Poem and artwork fetch in parallel (`Promise.allSettled`)
- Artwork failure is non-fatal — poem displays with an artwork-unavailable notice

### Regenerate
- Re-navigates to homepage with same Style + Mood pre-selected
- Produces a new poem and new artwork match

### Save as image
- Downloads a PNG of the ResultCard (artwork + poem + attribution)
- Client-side via `html-to-image` at 2× pixel ratio
- Artwork loaded through server-side image proxy to prevent canvas CORS tainting
- Filename: `poem-[style]-[mood].png`
- Artwork must be fully loaded before export triggers

### Share via link
- Encodes poem text + Met objectID as base64 in `?share=` query param (no database)
- Copies URL to clipboard; shows "Link copied!" confirmation for 2.5 seconds
- On page load with `?share=`: poem decoded from URL, artwork re-fetched by ID
- Max URL length for longest form (Villanelle): ~600 characters

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/poem` | Generate poem — body: `{ style, mood }` |
| GET | `/api/artwork?mood=` | Fetch artwork by mood |
| GET | `/api/artwork/:id` | Fetch artwork by Met object ID (share link reconstruction) |

---

## Out of Scope (v1)

- User accounts or save history
- Tone selector (Formal / Intimate / Ironic) — v2
- Contemporary poetry styles (post-1926)
- AI-generated artwork
- Explicit violence or sexual content
- Line count customisation beyond form requirements
- App branding in exported images
- Database or persistent storage

---

## Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Met image CORS blocking client-side canvas export | ~~High~~ | **Resolved** — Met CDN returns permissive CORS headers; `crossOrigin="anonymous"` on the `<img>` tag is sufficient |
| Met API returning poor mood matches | Medium | Hand-tuned keyword lists with primary + fallback; curated ID list as last resort |
| Pre-1927 constraint ignored by model | Medium | System prompt names specific poets per style; rule stated explicitly |
| Anthropic response time for complex forms | Medium | `maxDuration: 30` on Vercel function; loading spinner with cycling copy |

---

## Deployment

**Platform:** Vercel (single project, monorepo)

**Strategy:** Express server deployed as a single Vercel Function via `server/index.vercel.js` adapter. All `/api/*` traffic routed to Express; SPA catch-all routes remaining paths to `index.html`.

**Required environment variables (Vercel dashboard):**

| Variable | Required for |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Poem generation |
| `NODE_ENV=production` | Production builds |
| `CLIENT_ORIGIN` | CORS (set to Vercel deployment URL) |

**Vercel function settings:** 512 MB memory, 30-second timeout.

---

## Design

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F7F4EF` | Page background (parchment) |
| `--color-surface` | `#FFFFFF` | Cards |
| `--color-accent` | `#7C5C3E` | Headings, CTAs (antique bronze) |
| `--color-text-primary` | `#1C1917` | Body text |
| `--color-text-secondary` | `#6B6560` | Labels, attribution |

### Typography

- **Poem text + headings:** IM Fell English (Google Fonts, serif)
- **UI / labels:** Inter (Google Fonts, sans-serif)

### Layout

- **Desktop (≥768px):** Two-column ResultCard — artwork left, poem right. Max width 1100px.
- **Mobile:** Stacked — artwork (max-height 320px) above poem.
- **Form:** Single column, max-width 520px.
