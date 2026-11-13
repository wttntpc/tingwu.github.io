"""Regenerate the 1200x630 social share card (og-image.png).

Run from the repository root:  python tools/make-og-image.py
Needs Pillow and the Georgia fonts (Windows: C:/Windows/Fonts/georgia*.ttf).
The card shows only what the site header already shows publicly: the site name, its tagline
and the three research keywords.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
NAVY = (30, 58, 95)
CREAM = (247, 243, 232)
MUTED = (200, 210, 224)
BOLD = "C:/Windows/Fonts/georgiab.ttf"
REGULAR = "C:/Windows/Fonts/georgia.ttf"
W, H, SCALE = 1200, 630, 2


def font(path, size):
    return ImageFont.truetype(path, size * SCALE)


def main():
    img = Image.new("RGB", (W * SCALE, H * SCALE), NAVY)
    d = ImageDraw.Draw(img)
    s = lambda v: int(v * SCALE)

    # thin inner frame, the same motif as the site icon
    d.rectangle([s(36), s(36), s(W - 36), s(H - 36)], outline=CREAM, width=s(2))

    # monogram tile
    d.rounded_rectangle([s(84), s(84), s(184), s(184)], radius=s(14), outline=CREAM, width=s(3))
    mono = font(BOLD, 46)
    box = d.textbbox((0, 0), "TW", font=mono)
    d.text((s(134) - (box[2] - box[0]) / 2 - box[0], s(134) - (box[3] - box[1]) / 2 - box[1]), "TW", font=mono, fill=CREAM)

    d.text((s(84), s(250)), "Ting-Ting Wu", font=font(BOLD, 92), fill=CREAM)
    d.text((s(88), s(372)), "Exploring how physical activity shapes the mind.", font=font(REGULAR, 38), fill=MUTED)

    d.line([s(88), s(468), s(188), s(468)], fill=CREAM, width=s(3))
    d.text((s(88), s(494)), "Exercise  ·  Emotion  ·  Cognitive neuroscience", font=font(REGULAR, 30), fill=CREAM)

    out = ROOT / "og-image.png"
    img.resize((W, H), Image.LANCZOS).save(out, optimize=True)
    print(f"wrote {out.name} {W}x{H}, {out.stat().st_size} bytes")


if __name__ == "__main__":
    main()
