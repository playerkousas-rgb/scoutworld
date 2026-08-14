#!/usr/bin/env python3
"""Deterministic tests for monthly source-link classifications."""
import socket
import unittest
import urllib.error
from unittest.mock import patch

import tools_link_check as checker


class FakeResponse:
    def __init__(self, status, url="https://example.org/final"):
        self.status = status
        self.url = url

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def geturl(self):
        return self.url


class LinkClassificationTests(unittest.TestCase):
    def test_social_domains_are_identified_without_requesting_them(self):
        for url in (
            "https://www.facebook.com/scouts",
            "https://m.youtube.com/watch?v=example",
            "https://news.x.com/scouts",
            "https://www.instagram.com/scouts/",
        ):
            with self.subTest(url=url):
                self.assertEqual(checker.classify_domain(url), "social")
                self.assertEqual(
                    checker.social_warning(url)["class"],
                    "WARN_SOCIAL_SKIPPED",
                )

    @patch("tools_link_check.urllib.request.urlopen")
    def test_success_and_redirect_are_ok(self, urlopen):
        for status in (200, 301):
            with self.subTest(status=status):
                urlopen.return_value = FakeResponse(status)
                self.assertEqual(
                    checker.check_one("https://example.org")["class"], "OK"
                )

    @patch("tools_link_check.urllib.request.urlopen")
    def test_404_and_410_are_confirmed_dead(self, urlopen):
        for status in (404, 410):
            with self.subTest(status=status):
                urlopen.side_effect = urllib.error.HTTPError(
                    "https://example.org/missing", status, "missing", {}, None
                )
                self.assertEqual(
                    checker.check_one("https://example.org/missing")["class"],
                    "BAD_NOT_FOUND",
                )

    @patch("tools_link_check.urllib.request.urlopen")
    def test_bot_blocking_is_warning_only(self, urlopen):
        for status in (401, 403, 406, 429):
            with self.subTest(status=status):
                urlopen.side_effect = urllib.error.HTTPError(
                    "https://example.org/blocked", status, "blocked", {}, None
                )
                self.assertEqual(
                    checker.check_one("https://example.org/blocked")["class"],
                    "WARN_BLOCKED",
                )

    @patch("tools_link_check.urllib.request.urlopen")
    def test_other_http_status_is_warning_only(self, urlopen):
        urlopen.side_effect = urllib.error.HTTPError(
            "https://example.org/unavailable", 503, "unavailable", {}, None
        )
        self.assertEqual(
            checker.check_one("https://example.org/unavailable")["class"],
            "WARN_STATUS",
        )

    @patch("tools_link_check.urllib.request.urlopen")
    def test_network_error_is_warning_only(self, urlopen):
        urlopen.side_effect = socket.timeout("temporary timeout")
        self.assertEqual(
            checker.check_one("https://example.org/slow")["class"],
            "WARN_ERROR",
        )


if __name__ == "__main__":
    unittest.main()
