"""Regenerate one 1200x630 share card per article (og/<id>.png).

Run from the repository root:  python tools/make-share-cards.py
Needs Pillow and the Windows fonts Noto Serif TC and Georgia (C:/Windows/Fonts).

Each card shows only public information that is already on the article page: the article title, its English
title, the category and date, and the site name. Re-run it when a title changes, then run
`node tools/build-static.js` so the pages point at the new image.
"""
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "og"
NAVY = (30, 58, 95)
CREAM = (247, 243, 232)
MUTED = (190, 202, 220)
ACCENT = (226, 200, 140)
W, H, S = 1200, 630, 2
FONTS = Path("C:/Windows/Fonts")
ZH = str(FONTS / "NotoSerifTC-VF.ttf")
EN = str(FONTS / "georgia.ttf")
EN_BOLD = str(FONTS / "georgiab.ttf")
EN_ITALIC = str(FONTS / "georgiai.ttf")
CATEGORY = {
    "popular-science": "學術科普 Popular science",
    "research-methods": "研究方法 Research methods",
    "data-analysis": "數據分析 Data analysis",
    "ai-tools": "AI 工具與工作流 AI tools",
    "learning-foundations": "學習地圖 Learning map",
}
NO_START = set("，。、；：？！）」』》〉】〕…—,.;:?!)]}")  # may not begin a line
NO_END = set("（「『《〈【〔([{")                          # may not end a line


def zh_font(size, weight=600):
    f = ImageFont.truetype(ZH, size * S)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def en_font(path, size):
    return ImageFont.truetype(path, size * S)


def wrap_cjk(text, font, max_width):
    lines, line = [], ""
    for ch in text:
        trial = line + ch
        if font.getlength(trial) <= max_width * S or not line:
            line = trial
            continue
        # the line is full; keep punctuation rules
        if ch in NO_START and len(line) > 1:
            lines.append(line[:-1])
            line = line[-1] + ch
        elif line[-1] in NO_END and len(line) > 1:
            lines.append(line[:-1])
            line = line[-1] + ch
        else:
            lines.append(line)
            line = ch
    if line:
        lines.append(line)
    return lines


def wrap_words(text, font, max_width):
    lines, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if font.getlength(trial) <= max_width * S or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def card(post):
    img = Image.new("RGB", (W * S, H * S), NAVY)
    d = ImageDraw.Draw(img)
    pad = 80
    # brand row
    d.rounded_rectangle([pad * S, 58 * S, (pad + 52) * S, 110 * S], radius=6 * S, outline=CREAM, width=2 * S)
    mark = en_font(EN_BOLD, 24)
    d.text(((pad + 26) * S, 84 * S), "TW", font=mark, fill=CREAM, anchor="mm")
    d.text(((pad + 72) * S, 84 * S), "Ting-Ting Wu 吳亭葶", font=zh_font(28, 500), fill=CREAM, anchor="lm")
    # category and date
    label = f"{CATEGORY.get(post['category'], post['category'])}  ·  {post['date']}"
    d.text((pad * S, 170 * S), label, font=zh_font(24, 500), fill=ACCENT, anchor="lm")
    # title: shrink until it fits in three lines
    title = post["title"]
    en_lines = wrap_words(post["titleEn"], en_font(EN_ITALIC, 28), W - 2 * pad)[:2] if post.get("titleEn") else []
    room = 560 - 215 - 12  # from the title's top to just above the footer rule
    for size in (64, 58, 52, 46, 42, 38):
        f = zh_font(size, 650)
        lines = wrap_cjk(title, f, W - 2 * pad)
        need = len(lines) * int(size * 1.32) + (14 + 40 * len(en_lines) if en_lines else 0)
        if len(lines) <= 3 and need <= room:
            break
    y = 215
    lh = int(size * 1.32)
    for line in lines[:3]:
        d.text((pad * S, y * S), line, font=f, fill=CREAM, anchor="la")
        y += lh
    # English title
    if en_lines:
        ef = en_font(EN_ITALIC, 28)
        for line in en_lines:
            d.text((pad * S, (y + 14) * S), line, font=ef, fill=MUTED, anchor="la")
            y += 40
    # footer
    d.line([pad * S, 560 * S, (W - pad) * S, 560 * S], fill=(70, 98, 135), width=1 * S)
    d.text((pad * S, 592 * S), "wttntpc.github.io/tingwu.github.io", font=en_font(EN, 24), fill=MUTED, anchor="lm")
    out = img.resize((W, H), Image.LANCZOS).quantize(colors=32, method=Image.Quantize.MEDIANCUT)
    return out


def main():
    posts = json.loads((ROOT / "posts.json").read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    keep = set()
    for post in posts:
        name = f"{post['id']}.png"
        keep.add(name)
        card(post).save(OUT / name, optimize=True)
    for stale in OUT.glob("*.png"):
        if stale.name not in keep:
            stale.unlink()
    total = sum(p.stat().st_size for p in OUT.glob("*.png"))
    print(f"{len(keep)} cards, {total / 1024:.0f} KB in total")


if __name__ == "__main__":
    main()
