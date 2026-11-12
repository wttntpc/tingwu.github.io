"""Regenerate the site icons (PNG and ICO) from the TW monogram.

Run from the repository root:  python tools/make-icons.py
Needs Pillow and the Georgia Bold font (Windows: C:/Windows/Fonts/georgiab.ttf).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
NAVY = (30, 58, 95)       # --accent
CREAM = (247, 243, 232)   # --theme
FONT = "C:/Windows/Fonts/georgiab.ttf"
SCALE = 4                 # draw large, then downsample for smooth edges


def tile(size, rounded):
    big = size * SCALE
    img = Image.new("RGBA", (big, big), NAVY + (255,))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, int(big * 0.46))
    box = draw.textbbox((0, 0), "TW", font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    draw.text(((big - w) / 2 - box[0], (big - h) / 2 - box[1]), "TW", font=font, fill=CREAM)
    # thin inner frame, same motif as the site's brand mark
    inset = int(big * 0.08)
    draw.rounded_rectangle([inset, inset, big - inset, big - inset], radius=int(big * 0.07),
                           outline=CREAM + (150,), width=max(2, int(big * 0.012)))
    if rounded:  # browser tabs / Android; iOS rounds the corners itself, so keep it square there
        mask = Image.new("L", (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, big, big], radius=int(big * 0.18), fill=255)
        img.putalpha(mask)
    return img.resize((size, size), Image.LANCZOS)


tile(180, rounded=False).convert("RGB").save(ROOT / "apple-touch-icon.png")
tile(192, rounded=True).save(ROOT / "icon-192.png")
tile(512, rounded=True).save(ROOT / "icon-512.png")
tile(256, rounded=True).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("icons written")
