#!/usr/bin/env python3
"""Paint stand-in 1536x1024 boards when accepted webps are not in img/scenes/.

These are temporary. The Sync workflow from hidden-gujarat replaces them
with the photoreal accepted districts.
"""
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("Pillow required: pip install pillow")

OUT = Path("img/scenes")
OUT.mkdir(parents=True, exist_ok=True)

BOARDS = [
    ("ahmedabad-district-1.webp", (244, 197, 106), (29, 78, 137), "Ahmedabad kite terrace"),
    ("ahmedabad-district-2.webp", (196, 154, 92), (46, 90, 64), "Pol rooftop pond"),
    ("ahmedabad-district-3.webp", (212, 164, 92), (122, 62, 28), "Patang workshop"),
    ("ahmedabad-district-4.webp", (232, 140, 72), (42, 48, 88), "Sunset chai terrace"),
    ("jamnagar-district-1.webp", (31, 77, 58), (194, 59, 74), "Bandhani courtyard"),
    ("jamnagar-district-2.webp", (90, 64, 40), (180, 150, 96), "Haveli well yard"),
    ("jamnagar-district-3.webp", (28, 56, 92), (72, 36, 96), "Indigo dye yard"),
    ("jamnagar-district-4.webp", (36, 48, 72), (212, 156, 72), "Lakhota evening bazaar"),
    ("kutch-district-1.webp", (232, 217, 176), (122, 74, 32), "Bhunga goat yard"),
    ("kutch-district-2.webp", (214, 186, 132), (61, 107, 79), "Rann potter yard"),
    ("kutch-district-3.webp", (186, 122, 58), (48, 72, 48), "Folk toy courtyard"),
    ("kutch-district-4.webp", (168, 96, 48), (232, 210, 160), "Weaver shade"),
    ("navratri-district-1.webp", (26, 16, 32), (196, 92, 38), "Navratri haveli night"),
    ("navratri-district-2.webp", (40, 18, 28), (210, 72, 46), "Garba night bazaar"),
    ("navratri-district-3.webp", (48, 28, 22), (243, 195, 107), "Garba terrace dusk"),
    ("navratri-district-4.webp", (32, 20, 28), (123, 30, 58), "Mandap toy courtyard"),
    ("surat-district-1.webp", (59, 29, 18), (226, 160, 74), "Surat food lane"),
    ("patan-district-1.webp", (43, 76, 62), (215, 181, 106), "Patola loom court"),
    ("junagadh-district-1.webp", (109, 122, 76), (201, 161, 91), "Uparkot market yard"),
    ("garba-district-1.webp", (20, 12, 24), (210, 75, 46), "Pol garba night"),
]


def paint(name, top, bot, title):
    dest = OUT / name
    if dest.exists() and dest.stat().st_size > 20_000:
        return False
    im = Image.new("RGB", (1536, 1024), top)
    d = ImageDraw.Draw(im)
    for y in range(1024):
        t = y / 1023
        col = tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3))
        d.line([(0, y), (1535, y)], fill=col)
    for i in range(16):
        x = (i * 173) % 1400
        w = 90 + (i * 37) % 160
        h = 180 + (i * 53) % 420
        shade = tuple(max(0, min(255, c + ((i % 3) - 1) * 18)) for c in bot)
        d.rectangle([x, 1024 - h - 40, x + w, 984], fill=shade)
        d.rectangle([x + 12, 1024 - h - 90, x + 12 + int(w * 0.45), 1024 - h - 40], fill=top)
    for i in range(36):
        x, y = 40 + (i * 41) % 1460, 240 + (i * 89) % 700
        d.ellipse([x - 8, y - 16, x + 8, y + 4], fill=bot)
        d.rectangle([x - 7, y, x + 7, y + 26], fill=top)
    d.rounded_rectangle([36, 32, 760, 128], radius=16, fill=(255, 250, 242))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except OSError:
        font = small = ImageFont.load_default()
    d.text((56, 50), "Khoj · board pending photoreal sync", fill=(22, 21, 19), font=font)
    d.text((56, 88), title, fill=(22, 21, 19), font=small)
    im.save(dest, "WEBP", quality=72, method=4)
    return True


def main():
    made = sum(1 for args in BOARDS if paint(*args))
    print(f"wrote {made} fallback boards into {OUT}")


if __name__ == "__main__":
    main()
