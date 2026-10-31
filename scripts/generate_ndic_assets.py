#!/usr/bin/env python3
"""One-off: generate NDIC brand assets from the supplied logo JPG."""
from pathlib import Path

from PIL import Image

SRC = Path(
    "/Users/apple_trnc/.cursor/projects/Users-apple-trnc-Desktop-it-helpdesk-companion-mobile-NDIC/assets/"
    "WhatsApp_Image_2026-10-31_at_14.59.46-0fb1f67e-4c2c-409d-acde-08e7624efc77.jpg"
)
MOBILE_ASSETS = Path(__file__).resolve().parents[1] / "assets"
DESKTOP_ASSETS = Path("/Users/apple_trnc/Desktop/ItHelpDesk2 NDIC/src/assets")
DESKTOP_PUBLIC = Path("/Users/apple_trnc/Desktop/ItHelpDesk2 NDIC/public")
DESKTOP_TAURI = Path("/Users/apple_trnc/Desktop/ItHelpDesk2 NDIC/src-tauri")


def trim_white(im: Image.Image, threshold: int = 245) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r < threshold or g < threshold or b < threshold:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x <= min_x:
        return im
    return im.crop((min_x, min_y, max_x + 1, max_y + 1))


def make_transparent_bg(im: Image.Image, threshold: int = 240) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                px[x, y] = (255, 255, 255, 0)
    return im


def center_on_square(im: Image.Image, size: int, bg=(255, 255, 255, 255), padding_ratio=0.12) -> Image.Image:
    im = im.convert("RGBA")
    canvas = Image.new("RGBA", (size, size), bg)
    pad = int(size * padding_ratio)
    max_w = size - 2 * pad
    max_h = size - 2 * pad
    w, h = im.size
    scale = min(max_w / w, max_h / h)
    nw, nh = int(w * scale), int(h * scale)
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    w, h = src.size
    # Wordmark: left bar + NDIC (exclude long tagline for compact mark)
    mark_rgb = trim_white(src.crop((0, int(h * 0.22), int(w * 0.72), int(h * 0.58))))
    mark_rgba = make_transparent_bg(mark_rgb)
    full_rgb = trim_white(src)
    full_rgba = make_transparent_bg(full_rgb)

    MOBILE_ASSETS.mkdir(parents=True, exist_ok=True)
    DESKTOP_ASSETS.mkdir(parents=True, exist_ok=True)

    mark_rgba.save(MOBILE_ASSETS / "ndic-mark.png")
    mark_rgba.save(DESKTOP_ASSETS / "ndic-logo.png")

    icon_1024 = center_on_square(mark_rgba, 1024)
    icon_1024.save(MOBILE_ASSETS / "icon.png")
    icon_1024.save(DESKTOP_TAURI / "ndic-icon-1024.png")

    adaptive = center_on_square(mark_rgba, 1024, bg=(255, 255, 255, 0), padding_ratio=0.18)
    adaptive.save(MOBILE_ASSETS / "adaptive-icon.png")

    splash_fg = center_on_square(full_rgba, 1024, padding_ratio=0.08)
    splash_fg.save(MOBILE_ASSETS / "splash-icon.png")

    favicon = center_on_square(mark_rgba, 48)
    favicon.save(MOBILE_ASSETS / "favicon.png")
    favicon.save(DESKTOP_PUBLIC / "favicon.png")

    full_rgba.save(MOBILE_ASSETS / "ndic-logo-full.png")
    print("Generated NDIC assets in mobile assets/, desktop src/assets/, public/, src-tauri/")


if __name__ == "__main__":
    main()
