# Europe L3 QA Report

Scope: `scoutworld_europe_subset/index.html` + `data/europe/**` only.

## Summary

- Europe region countries checked: **47 / 47**
- Local JSON arrays valid: **47 / 47**
- Missing local JSON: **0**
- Invalid / malformed JSON: **0**
- Total L3 entries: **678**

### Entry totals by type

- `Headquarters`: **95**
- `Shop`: **40**
- `Campsite`: **164**
- `Council`: **368**
- `Branch`: **11**

## QA checks performed

- Top-level JSON is an array for every `data/europe/local/XX.json`.
- No duplicate IDs within each country file.
- Required core fields present: `id`, `parentCountry`, `level`, `type`, `flag`, `category`, `name`, `nameEn`, `subregion`, `lat`, `lng`, `address`, `description`.
- `parentCountry` matches the file ISO code.
- `level` is `3` for all entries.
- `type` is one of: `Headquarters`, `Campsite`, `Shop`, `Council`, `Branch`.
- `lat` / `lng` are numeric and within global coordinate bounds.
- Every entry has at least one contact route (`website`, `email`, or `phone`).
- All `flag` fields were normalised to the country / territory flag for consistency.
- Broad coordinate review completed. Representative coordinates remain for network/finder/programme entries where no single fixed site exists, with descriptions explaining their role.

## Country-by-country counts

| Code | Total | Headquarters | Shop | Campsite | Council | Branch |
|---|---:|---:|---:|---:|---:|---:|
| `AL` | 9 | 1 | 0 | 1 | 7 | 0 |
| `AM` | 9 | 1 | 0 | 2 | 6 | 0 |
| `AT` | 8 | 1 | 1 | 6 | 0 | 0 |
| `AZ` | 15 | 1 | 1 | 4 | 9 | 0 |
| `BA` | 16 | 1 | 0 | 4 | 11 | 0 |
| `BE` | 13 | 6 | 1 | 6 | 0 | 0 |
| `BG` | 25 | 1 | 0 | 3 | 21 | 0 |
| `BY` | 10 | 2 | 0 | 3 | 5 | 0 |
| `CH` | 14 | 3 | 2 | 6 | 3 | 0 |
| `CY` | 17 | 1 | 1 | 5 | 10 | 0 |
| `CZ` | 19 | 2 | 1 | 2 | 14 | 0 |
| `DE` | 12 | 6 | 2 | 4 | 0 | 0 |
| `DK` | 12 | 6 | 2 | 4 | 0 | 0 |
| `EE` | 15 | 1 | 1 | 1 | 12 | 0 |
| `ES` | 15 | 4 | 2 | 5 | 4 | 0 |
| `FI` | 14 | 1 | 1 | 1 | 11 | 0 |
| `FR` | 11 | 7 | 1 | 3 | 0 | 0 |
| `GB` | 13 | 1 | 2 | 7 | 0 | 3 |
| `GE` | 9 | 1 | 0 | 1 | 7 | 0 |
| `GR` | 9 | 1 | 1 | 1 | 6 | 0 |
| `HR` | 13 | 1 | 0 | 1 | 11 | 0 |
| `HU` | 16 | 1 | 0 | 3 | 12 | 0 |
| `IE` | 12 | 1 | 0 | 4 | 7 | 0 |
| `IL` | 14 | 7 | 0 | 2 | 5 | 0 |
| `IS` | 9 | 1 | 1 | 2 | 5 | 0 |
| `IT` | 13 | 4 | 1 | 5 | 3 | 0 |
| `LI` | 13 | 1 | 1 | 2 | 9 | 0 |
| `LT` | 15 | 1 | 1 | 2 | 11 | 0 |
| `LU` | 12 | 3 | 2 | 4 | 3 | 0 |
| `LV` | 15 | 2 | 1 | 1 | 11 | 0 |
| `MC` | 8 | 1 | 0 | 2 | 0 | 5 |
| `MD` | 10 | 1 | 0 | 1 | 8 | 0 |
| `ME` | 12 | 1 | 0 | 2 | 9 | 0 |
| `MK` | 25 | 1 | 1 | 2 | 21 | 0 |
| `MT` | 15 | 2 | 1 | 2 | 10 | 0 |
| `NL` | 15 | 1 | 4 | 7 | 3 | 0 |
| `NO` | 15 | 3 | 1 | 5 | 6 | 0 |
| `PL` | 24 | 1 | 1 | 4 | 18 | 0 |
| `PT` | 26 | 3 | 1 | 9 | 13 | 0 |
| `RO` | 18 | 2 | 1 | 3 | 12 | 0 |
| `RS` | 15 | 1 | 0 | 7 | 7 | 0 |
| `SE` | 16 | 1 | 1 | 9 | 5 | 0 |
| `SI` | 18 | 1 | 1 | 3 | 13 | 0 |
| `SK` | 20 | 1 | 1 | 5 | 13 | 0 |
| `SM` | 11 | 1 | 1 | 1 | 5 | 3 |
| `TR` | 18 | 2 | 0 | 4 | 12 | 0 |
| `UA` | 15 | 2 | 0 | 3 | 10 | 0 |

## Notes

- `PT.json` was previously a GitHub API error object; it has been replaced with a valid L3 array.
- Some entries intentionally represent official networks, group finders, emergency support/camp programmes or regional structures rather than fixed public venues. These are typed as `Council` or `Campsite` and described clearly in `description`.
- Data source priority remains WOSM plus official national/local Scout association sources.
