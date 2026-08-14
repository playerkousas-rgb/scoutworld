#!/usr/bin/env python3
"""Scout World 靜態資料品質檢查（無後台、無網絡請求）。

用法：python3 tools_data_quality.py
"""
import glob
import json
import os
import re
import sys
from datetime import date
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
URL_RE = re.compile(r"^https?://", re.I)
HIJACKED_DOMAINS = {
    "aeascout.org",
    "kenyascouts.org",
    "scoutismecongolais.org",
}
TODAY = date.today()
errors, warnings = [], []
seen = set()


def host_matches(host, domain):
    return host == domain or host.endswith("." + domain)


def validate_hijacked_links(row, where):
    """Reject every active URL to a domain known to have been hijacked."""
    for key, value in row.items():
        if not isinstance(value, str) or not URL_RE.match(value):
            continue
        host = (urlparse(value).hostname or "").lower()
        blocked = next(
            (domain for domain in HIJACKED_DOMAINS if host_matches(host, domain)),
            None,
        )
        if blocked:
            errors.append(
                f"{where}: {key} 仍連到已確認被騎劫網域：{blocked}"
            )


def validate_review_date(row, where):
    reviewed = row.get("lastReviewed")
    if not reviewed:
        return
    try:
        reviewed_date = date.fromisoformat(reviewed)
    except (TypeError, ValueError):
        errors.append(f"{where}: lastReviewed 日期格式錯誤：{reviewed}")
        return
    if reviewed_date > TODAY:
        errors.append(f"{where}: lastReviewed 不可為未來日期：{reviewed}")
    elif (TODAY - reviewed_date).days > 365:
        warnings.append(f"{where}: lastReviewed 已超過一年（{reviewed}）")


def validate_common(row, where):
    validate_hijacked_links(row, where)
    validate_review_date(row, where)


region_files = glob.glob(os.path.join(DATA, "*", "region.json"))
for path in sorted(region_files):
    rel = os.path.relpath(path, ROOT)
    try:
        with open(path, encoding="utf-8") as source:
            rows = json.load(source)
    except Exception as exc:
        errors.append(f"{rel}: JSON 無法讀取（{exc}）")
        continue
    if not isinstance(rows, list):
        errors.append(f"{rel}: 預期為陣列")
        continue
    for index, row in enumerate(rows, 1):
        where = f"{rel}#{index}"
        if not isinstance(row, dict):
            errors.append(f"{where}: 條目不是物件")
            continue
        ident = row.get("id")
        if not ident:
            errors.append(f"{where}: 缺少 id")
        elif ident in seen:
            errors.append(f"{where}: 重複 id：{ident}")
        else:
            seen.add(ident)
        if not row.get("country"):
            warnings.append(f"{where}: 缺少 country")
        if not row.get("countryEn"):
            warnings.append(f"{where}: 缺少 countryEn")
        for key in ("website", "wosmSource"):
            value = row.get(key)
            if value and not URL_RE.match(str(value)):
                warnings.append(f"{where}: {key} 不是 http(s) URL")
        validate_common(row, where)

files = glob.glob(os.path.join(DATA, "**", "local", "*.json"), recursive=True)
for path in sorted(files):
    rel = os.path.relpath(path, ROOT)
    try:
        with open(path, encoding="utf-8") as source:
            rows = json.load(source)
    except Exception as exc:
        errors.append(f"{rel}: JSON 無法讀取（{exc}）")
        continue
    if not isinstance(rows, list):
        errors.append(f"{rel}: 預期為陣列")
        continue
    code = os.path.splitext(os.path.basename(path))[0]
    for index, row in enumerate(rows, 1):
        where = f"{rel}#{index}"
        if not isinstance(row, dict):
            errors.append(f"{where}: 條目不是物件")
            continue
        ident = row.get("id")
        if not ident:
            errors.append(f"{where}: 缺少 id")
        elif ident in seen:
            errors.append(f"{where}: 重複 id：{ident}")
        else:
            seen.add(ident)
        if not row.get("name"):
            errors.append(f"{where}: 缺少 name")
        if not row.get("address") and not row.get("locationAccuracy"):
            warnings.append(f"{where}: 沒有 address，亦沒有 locationAccuracy 說明")
        if row.get("country") and row["country"] != code:
            warnings.append(f"{where}: country 與檔名不一致")
        for key in ("website", "verificationSource", "bookingUrl"):
            value = row.get(key)
            if value and not URL_RE.match(str(value)):
                warnings.append(f"{where}: {key} 不是 http(s) URL")
        lat, lng = row.get("lat"), row.get("lng")
        if lat is not None or lng is not None:
            if (
                not isinstance(lat, (int, float))
                or not isinstance(lng, (int, float))
                or not (-90 <= lat <= 90 and -180 <= lng <= 180)
            ):
                errors.append(f"{where}: 座標超出範圍")
        if (
            row.get("visitorNote", "").strip().startswith("✅")
            and not row.get("verificationSource")
        ):
            warnings.append(f"{where}: 對外開放提示沒有 verificationSource")
        if not row.get("verificationSource"):
            if row.get("sourceStatus") == "removed-hijacked-domain":
                warnings.append(
                    f"{where}: 被騎劫來源已移除，未有替代 verificationSource"
                )
            else:
                warnings.append(f"{where}: 沒有 verificationSource")
        validate_common(row, where)

print(f"掃描 {len(files)} 個資料檔、{len(seen)} 個條目")
print(f"❌ 錯誤：{len(errors)}    ⚠️ 提醒：{len(warnings)}")
for item in errors[:80]:
    print("ERROR", item)
for item in warnings[:40]:
    print("WARN ", item)
if len(errors) > 80 or len(warnings) > 40:
    print("（輸出已截取，請修正後再跑一次）")
sys.exit(1 if errors else 0)
