"""Render a 1600x900 AI Gurukool thumbnail from template.html.

Usage: python3 _tools/thumb/render.py spec.json out.jpg
spec.json keys: tag, l1, pre, l2, sub, steps (list, optional)
"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))


def render(spec, out):
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.add_init_script("window.THUMB = " + json.dumps(spec) + ";")
        pg.goto("file://" + os.path.join(HERE, "template.html"))
        pg.evaluate("document.fonts.ready")
        pg.screenshot(path=out, type="jpeg", quality=88)
        b.close()


if __name__ == "__main__":
    render(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2])
