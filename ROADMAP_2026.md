# Scout World Roadmap 2026

## Phase 1 — Global baseline completion ✅

Status: Completed on 2026-06-11.

Completed:

- All five regions have L2 data based on WOSM member organization entries.
- All regions have local JSON files.
- Empty local JSONs were given HQ entries where needed.
- Overseas official email addresses were removed.
- Generic unsourced L3 entries were removed from multiple regions.
- Verification metadata was added.
- Reports were created for APAC, Europe, Americas, Arab and Africa.

## Phase 2 — Global deep enrichment 🔄

Status: In progress.

Completed so far:

- Europe received extensive social enrichment.
- Americas received US/Canada high-value L3 entries, Latin America social links and some group finders / shops.
- Africa received priority social links and several official camps / shops / training centres.
- Arab received several official social links and Oman official camps/training information entry.

Next targets:

1. Americas
   - HT, LC, SR reliable social / website
   - Latin America Scout Shops
   - Brazil / Argentina / Mexico / Chile / Colombia official camps and group finders
2. Africa
   - remaining countries without social / website
   - national training centres
   - Scout Shops
3. Arab
   - MR and SD official social
   - Gulf official Scout Shops / camps
4. APAC
   - small states, Central Asia, Pacific islands
5. Europe
   - remaining L3 social and source precision

## Phase 3 — Link checking 🔄

Initial scan completed on 2026-06-11. See `LINK_CHECK_REPORT_2026-06-11.md` and `LINK_CHECK_RESULTS_2026-06-11.csv`.

Tasks:

- scan all website / facebook / instagram / youtube links
- identify 404 / dead domains
- identify HTTP only but HTTPS-capable URLs
- mark temporarily unreachable but credible sources as verify-before-travel

## Phase 4 — Map and coordinate refinement 🔄

Initial audit completed on 2026-06-11. See `COORDINATE_AUDIT_REPORT_2026-06-11.md`.

Tasks:

- refine exact HQ coordinates
- refine Scout Shop coordinates
- refine campsite entrances
- distinguish representative points from exact locations

## Phase 5 — UI clarity improvements 🔄

Initial verification badges added on 2026-06-11. Static UI QA completed; see `UI_QA_REPORT_2026-06-11.md`. Badge legend modal, L3 type filters and universal Scout emblem placeholder added.

Suggested front-end badges:

- WOSM L2 official
- Official website source
- Official social source
- Secondary source
- Verify before travel
- Representative point, not exact location

## Phase 5b — Official logo / emblem enrichment

Planned.

Tasks:

- Add optional `logoUrl` fields for NSO/member organization official logos where source permits.
- Use WOSM / NSO official logo URLs only.
- Keep universal ⚜️ fallback when official logo is unavailable.

## Phase 6 — Contribution workflow

Planned.

Create:

- GitHub issue template for data correction
- GitHub issue template for new Scout Shop / campsite
- PR checklist
- required source field
- no-email reminder

## Phase 7 — Annual review

Planned.

Every 6–12 months:

- scan links
- check WOSM member changes
- check social channels
- check camps and Scout Shops
- update reports

## World resources layer

- Initial layer completed: WSB, KISC, SCENES directory, WOSM Services, JOTA-JOTI, World Scout Foundation.
- Future: add selected SCENES centre deep links by country only if official and useful for travel planning.
