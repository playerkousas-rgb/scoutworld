# Scout World Data Policy

## Purpose

Scout World is a travel-planning reference for Hong Kong Scouts. It helps members quickly find public information about overseas Scouting before travel.

It is not a channel for formal overseas Scout communication. Formal overseas visits, exchanges, activities, or communication made in the name of Hong Kong Scouting must follow the Scout Association of Hong Kong procedure through the International Branch.

## Data levels

### L1 — Region

WOSM region / major Scout region, e.g. Asia-Pacific, Europe, Interamerica, Arab, Africa.

### L2 — Country / Territory / WOSM Member Organization

L2 records are based on WOSM official member organization listings. These are treated as the primary official baseline.

Required fields where possible:

- country / countryEn
- org / orgFull
- wosmRegion
- lat / lng
- wosmSource
- verificationStatus

### L3 — Local useful data

L3 may include:

- National HQ
- Member organization HQ under a federation
- Scout Shop
- Campsite / training centre / scout centre
- Group finder / local finder
- Council / region / branch
- Museum / heritage centre
- Activity network or official event location

L3 must have a reliable public source. Do not add L3 just to make a country look complete.

## Acceptable sources

Preferred:

1. WOSM official page
2. National Scout Organization official website
3. Official Scout Shop website
4. Official camp / centre website
5. Government / education / youth authority page
6. Official Facebook / Instagram / YouTube page
7. Official Linktree / BioLink / social landing page

Acceptable with caution:

- Reliable news article
- Partner organization page
- Government/NGO directory
- WOSM SDGs / Treehouse / Scout.org news article

If using a secondary source, set:

```json
"verificationStatus": "secondary-source; verify before travel"
```

Not acceptable as the only source:

- Wikipedia
- Wikiwand
- ScoutWiki / Scoutopedia
- Fandom wiki
- random travel listing with no official connection
- unverified personal blogs

## Email policy

Do not publish overseas official email addresses.

- `email` should be an empty string.
- Do not include email addresses in `description`.
- Use neutral wording such as `official contact details` or `official channels`.

Reason: formal overseas communication should go through the Scout Association of Hong Kong International Branch where applicable.

## Social platform policy

Facebook, Instagram and YouTube are allowed and encouraged when they are public information channels.

They are for:

- activity updates
- travel research
- informal international friendship
- public information discovery

They are not formal communication channels.

Use full URLs for:

- `facebook`
- `youtube`

Use handle only for:

- `instagram`

Examples:

```json
"facebook": "https://www.facebook.com/example/",
"instagram": "example_handle",
"youtube": "https://www.youtube.com/@example"
```

## Verification fields

Every L3 item should have:

```json
"verificationStatus": "...",
"verificationSource": "..."
```

If the item is a representative point / network entry rather than an exact physical location, add:

```json
"locationAccuracy": "representative-area-or-network-point; not an exact meeting place unless stated by source"
```

## When to remove data

Remove or downgrade data if:

- source is wiki-only
- source is dead and no alternative exists
- description sounds like a guessed location
- item is a generic city / capital council with no official source
- social page is clearly unrelated
- data may mislead members into thinking a representative point is an exact location

## When to add data

Add data when:

- it is useful for travel planning
- it has a source
- it is not already represented clearly
- it helps members find public Scouting information quickly

Good additions:

- official Scout Shop
- official camp / training centre
- official group finder
- national HQ
- federation member HQ
- official social channel
- public event / camp network with source

## Required checks

Before finishing any major update:

```bash
python3 - <<'PY'
import json, glob
for f in glob.glob('data/**/*.json', recursive=True):
    json.load(open(f, encoding='utf-8'))
print('JSON OK')
PY

grep -RInE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" data index.html *.md || true

grep -RInE "wikipedia|wikiwand|scoutwiki|維基" data || true
```
