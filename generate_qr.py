

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H


OUT_DIR = "qrcodes"
os.makedirs(OUT_DIR, exist_ok=True)


links = {
    "github": "https://github.com/eng-m7moud",
    "linkedin": "https://www.linkedin.com/in/m7moud9i",
    "twitter": "https://twitter.com/m7moud9i",
    "instagram": "https://instagram.com/m7oud9i",
    "facebook": "https://facebook.com/m7oud9i",
    "telegram": "https://t.me/m7moud9i",
    "email": "mailto:elgazar.m7moud@gmail.com"
}


img_size = 400 

for name, url in links.items():
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    img = img.resize((img_size, img_size))
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    img.save(out_path)
    print(f"Saved {out_path} -> {url}")

print("All QR codes generated in the 'qrcodes/' folder.")
