#!/usr/bin/env python3
"""Scout World link checker.

Checks non-social HTTP(S) URLs from data/**/*.json and reports status.
Social platforms are intentionally skipped because they often block automated checks.
"""
import concurrent.futures as cf
import csv
import glob
import json
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "LINK_CHECK_REPORT_2026-08-10.md"
CSVOUT = ROOT / "LINK_CHECK_RESULTS_2026-08-10.csv"
SOCIAL_DOMAINS = {
    "www.facebook.com", "facebook.com", "m.facebook.com", "web.facebook.com",
    "www.instagram.com", "instagram.com",
    "www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be",
    "twitter.com", "x.com", "www.tiktok.com", "tiktok.com",
}
KEYS = ["website", "facebook", "youtube", "verificationSource", "wosmSource", "logoUrl", "logoSource"]
HEADERS = {"User-Agent": "Mozilla/5.0 ScoutWorldLinkCheck/1.0"}
TIMEOUT = 8


def collect_urls():
    refs = {}
    for f in glob.glob(str(ROOT / "data/**/*.json"), recursive=True):
        try:
            data = json.load(open(f, encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for item in data:
            item_id = item.get("id", "?")
            for k in KEYS:
                v = item.get(k)
                if isinstance(v, str) and v.startswith("http"):
                    refs.setdefault(v, []).append((str(Path(f).relative_to(ROOT)), item_id, k))
    return refs


def classify_domain(url):
    host = urlparse(url).netloc.lower()
    if host in SOCIAL_DOMAINS or any(host.endswith("." + d) for d in SOCIAL_DOMAINS):
        return "social"
    return "web"


def check_one(url):
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            status = getattr(resp, "status", 200)
            final = resp.geturl()
            if 200 <= status < 400:
                cls = "OK"
            elif status in (401, 403, 406, 429):
                cls = "WARN_BLOCKED"
            else:
                cls = "BAD_STATUS"
            return {"url": url, "status": status, "class": cls, "final": final, "error": ""}
    except urllib.error.HTTPError as e:
        status = e.code
        if status in (401, 403, 406, 429):
            cls = "WARN_BLOCKED"
        elif status in (404, 410):
            cls = "BAD_NOT_FOUND"
        else:
            cls = "BAD_STATUS"
        return {"url": url, "status": status, "class": cls, "final": getattr(e, "url", ""), "error": str(e)[:200]}
    except Exception as e:
        return {"url": url, "status": "", "class": "ERROR", "final": "", "error": type(e).__name__ + ": " + str(e)[:200]}


def main():
    start = time.time()
    refs = collect_urls()
    social = sorted([u for u in refs if classify_domain(u) == "social"])
    web = sorted([u for u in refs if classify_domain(u) == "web"])
    results = []
    with cf.ThreadPoolExecutor(max_workers=20) as ex:
        futs = [ex.submit(check_one, u) for u in web]
        for fut in cf.as_completed(futs):
            results.append(fut.result())
    results.sort(key=lambda r: (r["class"], str(r["status"]), r["url"]))

    with CSVOUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["class", "status", "url", "final", "error", "refs"])
        w.writeheader()
        for r in results:
            r2 = dict(r)
            r2["refs"] = " | ".join(f"{a}:{b}:{c}" for a, b, c in refs[r["url"]][:6])
            w.writerow(r2)

    counts = {}
    for r in results:
        counts[r["class"]] = counts.get(r["class"], 0) + 1
    lines = [
        "# Scout World Link Check Report — 2026-08-10",
        "",
        "## Scope",
        "",
        f"- Unique URLs collected: {len(refs)}",
        f"- Non-social URLs checked: {len(web)}",
        f"- Social URLs skipped: {len(social)}",
        "- Social platforms are skipped because Facebook/Instagram/YouTube frequently block automated checks; these should be checked manually if needed.",
        "",
        "## Result summary",
        "",
    ]
    for k in ["OK", "WARN_BLOCKED", "BAD_NOT_FOUND", "BAD_STATUS", "ERROR"]:
        lines.append(f"- {k}: {counts.get(k, 0)}")
    lines += ["", f"Runtime: {time.time() - start:.1f}s", "", f"CSV detail: `{CSVOUT.name}`", ""]

    def add_section(title, classes, limit=80):
        rows = [r for r in results if r["class"] in classes]
        lines.extend([f"## {title}", ""])
        if not rows:
            lines.extend(["None.", ""])
            return
        for r in rows[:limit]:
            ref = refs[r["url"]][0]
            lines.append(f"- **{r['class']} {r['status']}** {r['url']}")
            lines.append(f"  - First ref: `{ref[0]}` / `{ref[1]}` / `{ref[2]}`")
            if r["final"] and r["final"] != r["url"]:
                lines.append(f"  - Final: {r['final']}")
            if r["error"]:
                lines.append(f"  - Error: {r['error']}")
        if len(rows) > limit:
            lines.append(f"- ... {len(rows) - limit} more in CSV")
        lines.append("")

    add_section("Likely broken / needs manual fix", {"BAD_NOT_FOUND", "BAD_STATUS", "ERROR"})
    add_section("Reachable but blocked / manual browser check", {"WARN_BLOCKED"}, limit=60)

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", OUT)
    print("Wrote", CSVOUT)
    print(counts)


if __name__ == "__main__":
    main()
