#!/usr/bin/env python3
"""Scout World source-link checker.

Checks HTTP(S) URLs from data/**/*.json. Social platforms and responses that
commonly indicate bot blocking are warnings only. Only HTTP 404/410 is treated
as a confirmed dead link for the monthly GitHub Issue automation.
"""
import concurrent.futures as cf
import csv
import glob
import json
import ssl
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
OUT = ROOT / f"LINK_CHECK_REPORT_{RUN_DATE}.md"
CSVOUT = ROOT / f"LINK_CHECK_RESULTS_{RUN_DATE}.csv"
SOCIAL_DOMAINS = {
    "www.facebook.com", "facebook.com", "m.facebook.com", "web.facebook.com",
    "www.instagram.com", "instagram.com",
    "www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be",
    "twitter.com", "x.com", "www.tiktok.com", "tiktok.com",
}
KEYS = [
    "website", "facebook", "youtube", "verificationSource", "wosmSource",
    "logoUrl", "logoSource",
]
HEADERS = {"User-Agent": "Mozilla/5.0 ScoutWorldLinkCheck/1.0"}
TIMEOUT = 8
WARNING_CLASSES = {
    "WARN_BLOCKED", "WARN_STATUS", "WARN_ERROR", "WARN_SOCIAL_SKIPPED",
}


def collect_urls():
    refs = {}
    for filename in glob.glob(str(ROOT / "data/**/*.json"), recursive=True):
        try:
            with open(filename, encoding="utf-8") as source:
                data = json.load(source)
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for item in data:
            if not isinstance(item, dict):
                continue
            item_id = item.get("id", "?")
            for key in KEYS:
                value = item.get(key)
                if isinstance(value, str) and value.startswith(("http://", "https://")):
                    refs.setdefault(value, []).append(
                        (str(Path(filename).relative_to(ROOT)), item_id, key)
                    )
    return refs


def classify_domain(url):
    host = (urlparse(url).hostname or "").lower()
    if host in SOCIAL_DOMAINS or any(
        host.endswith("." + domain) for domain in SOCIAL_DOMAINS
    ):
        return "social"
    return "web"


def result(url, status, classification, final="", error=""):
    return {
        "url": url,
        "status": status,
        "class": classification,
        "final": final,
        "error": error,
    }


def classify_http_status(status):
    if 200 <= status < 400:
        return "OK"
    if status in (401, 403, 406, 429):
        return "WARN_BLOCKED"
    if status in (404, 410):
        return "BAD_NOT_FOUND"
    return "WARN_STATUS"


def check_one(url):
    request = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        context = ssl.create_default_context()
        with urllib.request.urlopen(
            request, timeout=TIMEOUT, context=context
        ) as response:
            status = getattr(response, "status", 200)
            return result(
                url,
                status,
                classify_http_status(status),
                response.geturl(),
            )
    except urllib.error.HTTPError as error:
        return result(
            url,
            error.code,
            classify_http_status(error.code),
            getattr(error, "url", ""),
            str(error)[:200],
        )
    except Exception as error:
        # DNS, TLS, timeout and connection failures may be transient. They need
        # a browser check, but must not automatically create a dead-link Issue.
        return result(
            url,
            "",
            "WARN_ERROR",
            "",
            type(error).__name__ + ": " + str(error)[:200],
        )


def social_warning(url):
    return result(
        url,
        "SKIPPED",
        "WARN_SOCIAL_SKIPPED",
        "",
        "Social platform skipped because automated requests are often blocked",
    )


def main():
    start = time.time()
    refs = collect_urls()
    social = sorted(url for url in refs if classify_domain(url) == "social")
    web = sorted(url for url in refs if classify_domain(url) == "web")
    results = [social_warning(url) for url in social]

    with cf.ThreadPoolExecutor(max_workers=20) as executor:
        futures = [executor.submit(check_one, url) for url in web]
        for future in cf.as_completed(futures):
            results.append(future.result())
    results.sort(key=lambda row: (row["class"], str(row["status"]), row["url"]))

    with CSVOUT.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(
            output,
            fieldnames=["class", "status", "url", "final", "error", "refs"],
        )
        writer.writeheader()
        for row in results:
            csv_row = dict(row)
            csv_row["refs"] = " | ".join(
                f"{path}:{item_id}:{key}"
                for path, item_id, key in refs[row["url"]][:6]
            )
            writer.writerow(csv_row)

    counts = {}
    for row in results:
        counts[row["class"]] = counts.get(row["class"], 0) + 1
    lines = [
        f"# Scout World Link Check Report — {RUN_DATE}",
        "",
        "## Scope",
        "",
        f"- Unique URLs collected: {len(refs)}",
        f"- Non-social URLs checked: {len(web)}",
        f"- Social URLs listed as warnings without an automated request: {len(social)}",
        "- Social platforms are not treated as dead because automated requests are frequently blocked.",
        "- Only HTTP 404/410 is eligible for an automatic GitHub Issue; all other failures require manual review.",
        "",
        "## Result summary",
        "",
    ]
    for classification in [
        "OK",
        "BAD_NOT_FOUND",
        "WARN_BLOCKED",
        "WARN_STATUS",
        "WARN_ERROR",
        "WARN_SOCIAL_SKIPPED",
    ]:
        lines.append(f"- {classification}: {counts.get(classification, 0)}")
    lines += [
        "",
        f"Runtime: {time.time() - start:.1f}s",
        "",
        f"CSV detail: `{CSVOUT.name}`",
        "",
    ]

    def add_section(title, classes, limit=80):
        rows = [row for row in results if row["class"] in classes]
        lines.extend([f"## {title}", ""])
        if not rows:
            lines.extend(["None.", ""])
            return
        for row in rows[:limit]:
            ref = refs[row["url"]][0]
            lines.append(
                f"- **{row['class']} {row['status']}** {row['url']}"
            )
            lines.append(
                f"  - First ref: `{ref[0]}` / `{ref[1]}` / `{ref[2]}`"
            )
            if row["final"] and row["final"] != row["url"]:
                lines.append(f"  - Final: {row['final']}")
            if row["error"]:
                lines.append(f"  - Error: {row['error']}")
        if len(rows) > limit:
            lines.append(f"- ... {len(rows) - limit} more in CSV")
        lines.append("")

    add_section("Confirmed dead (HTTP 404/410)", {"BAD_NOT_FOUND"})
    add_section("Warnings requiring manual review", WARNING_CLASSES, limit=100)

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", OUT)
    print("Wrote", CSVOUT)
    print(counts)


if __name__ == "__main__":
    main()
