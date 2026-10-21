"""Make a 1200x630 cover image for a post, in the AI Gurukool navy + gold style.

Usage: python3 _tools/make_cover.py "Post title" "Short subtitle" assets/posts/slug.jpg
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
W, H = 1200, 630
NAVY_TOP, NAVY_BOTTOM = (15, 29, 49), (29, 51, 80)
GOLD, GOLD_LIGHT = (201, 164, 92), (224, 194, 133)
WHITE, MUTED = (255, 255, 255), (207, 215, 227)


def font(name, size):
    return ImageFont.truetype(os.path.join(HERE, "fonts", name), size)


def wrap(draw, text, fnt, max_w):
    lines, line = [], ""
    for word in text.split():
        test = (line + " " + word).strip()
        if draw.textlength(test, font=fnt) <= max_w:
            line = test
        else:
            lines.append(line)
            line = word
    lines.append(line)
    return lines


def make(title, subtitle, out):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):  # vertical navy gradient
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(NAVY_TOP, NAVY_BOTTOM)))

    # Brand row: logo + label
    logo = Image.open(os.path.join(ROOT, "logo-mark.jpg")).convert("RGB").resize((56, 56))
    mask = Image.new("L", (56, 56), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 55, 55], 10, fill=255)
    img.paste(logo, (72, 64), mask)
    d.text((144, 78), "AI GURUKOOL", font=font("Inter-SemiBold.ttf", 22), fill=GOLD)

    # Title: shrink until it fits in 3 lines
    size = 66
    while True:
        f = font("Fraunces-SemiBold.ttf", size)
        lines = wrap(d, title, f, W - 144)
        if len(lines) <= 3 or size <= 44:
            break
        size -= 4
    y = 170
    for ln in lines:
        d.text((72, y), ln, font=f, fill=WHITE)
        y += int(size * 1.18)

    if subtitle:
        fs = font("Inter-Medium.ttf", 26)
        for ln in wrap(d, subtitle, fs, W - 144)[:2]:
            y += 18
            d.text((72, y), ln, font=fs, fill=MUTED)
            y += 34

    # Footer: gold rule with milestone dots, site name
    fy = H - 72
    d.line([(72, fy), (W - 300, fy)], fill=GOLD, width=2)
    for i in range(6):
        x = 72 + i * (W - 372) / 5
        d.ellipse([x - 7, fy - 7, x + 7, fy + 7], fill=GOLD_LIGHT if i == 5 else GOLD)
    d.text((W - 72, fy), "aigurukool.in", font=font("Inter-SemiBold.ttf", 24), fill=GOLD_LIGHT, anchor="rm")

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    img.save(out, "JPEG", quality=88, optimize=True)


if __name__ == "__main__":
    make(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "", sys.argv[3] if len(sys.argv) > 3 else "cover.jpg")
