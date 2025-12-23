\# 🌐 Personal Social Links \& QR Hub



> \*\*A clean, minimal personal landing page that showcases social links alongside scannable QR codes.\*\*

> Designed for fast sharing, professional presentation, and easy customization.



<div align="center">



!\[Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge\&logo=python)

!\[HTML5](https://img.shields.io/badge/HTML-5-orange?style=for-the-badge\&logo=html5)

!\[CSS3](https://img.shields.io/badge/CSS-3-blue?style=for-the-badge\&logo=css3)



</div>



---



\## ✨ Features

\* 📎 \*\*Centralized Hub:\*\* One page for all your social links.

\* 📱 \*\*Auto-Generated QRs:\*\* High-quality QR codes created automatically via Python.

\* 🎨 \*\*Modern Design:\*\* Dark UI with \*\*glassmorphism\*\* vibes.

\* ⚡ \*\*Blazing Fast:\*\* Fully static — no backend or database required.

\* 🖱️ \*\*Interactive:\*\* Click-to-expand QR preview (Modal View).

\* 🧩 \*\*Extensible:\*\* Easily add new platforms with just a few lines of code.



---



\## 🧱 Project Structure



```txt

.

├── assets/             # Place your profile image here (e.g., "profile.png")

├── core/

│   └── style.css       # UI styling \& theme

├── qrcodes/            # Generated QR images (Auto-saved here)

├── generate\_qr.py      # Python script to generate QR codes

├── index.html          # Main landing page

└── README.md

🚀 Getting Started

1️⃣ Clone the Repository

Bash

git clone \[https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

cd your-repo-name

2️⃣ Generate QR Codes

Make sure you have Python 3 installed.



First, install the required library:



Bash

pip install qrcode\[pil]

Then, run the generator script:



Bash

python generate\_qr.py

This will generate high-resolution QR images inside the qrcodes/ folder.



3️⃣ Open the Page

Simply double-click index.html or run via command line:



Bash

\# Windows

start index.html

You can also deploy it directly to GitHub Pages, Netlify, or Vercel.



🛠 Customization

🔗 Add / Edit Social Links

To change your links, open generate\_qr.py and edit the links dictionary:



Python

links = {

&nbsp;   "github": "\[https://github.com/ENG-M7MOUD](https://github.com/ENG-M7MOUD)",

&nbsp;   "linkedin": "\[https://linkedin.com/in/yourname](https://linkedin.com/in/yourname)",

&nbsp;   # Add more links here

}

Note: Re-run the script (python generate\_qr.py) after changing links to update the QR codes.



🎨 Styling

All visual styles live in core/style.css. You can easily tweak:



Color Palette (Glassmorphism effects)



Card Animations



Fonts \& Layout



🔐 Security Notes

✅ Fully Static: No trackers, no cookies, no JS frameworks.



✅ Offline Capable: QR codes are generated locally.



✅ Privacy Focused: Safe for personal branding.



📄 License

This project is open-source and free to use for personal or professional purposes.



👤 Author

Mahmoud Elgazar (Zero)



🛡️ Cybersecurity



🎩 Ethical Hacking



💻 Software Engineering

