\##🌐 Personal Social Links \& QR Hub



A clean, minimal personal landing page that showcases social links alongside scannable QR codes.

Designed for fast sharing, professional presentation, and easy customization.



\##✨ Features



📎 Centralized page for all social links



📱 Auto-generated high-quality QR codes for each platform



🎨 Modern dark UI with glassmorphism vibes



⚡ Fully static — no backend required



🖱️ Click-to-expand QR preview (modal view)



🧩 Easy to extend with new platforms



\##🧱 Project Structure

.

├──assests/"your image".png #edit the name in code

├── index.html          # Main landing page

├── core/

│   └── style.css       # UI styling \& theme

├── generate\_qr.py      # QR code generator script

├── qrcodes/            # Generated QR images (PNG)

└── README.md



\##🚀 Getting Started

1️⃣ Clone the repository

git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name



\##2️⃣ Generate QR Codes



Make sure Python 3 is installed, then:



pip install qrcode\[pil]

python generate\_qr.py





This will generate high-resolution QR images inside the qrcodes/ folder.



\##3️⃣ Open the Page



Just open index.html in your browser:



start index.html   # Windows





Or deploy it directly using GitHub Pages, Netlify, or Vercel.



\##🛠 Customization

\##🔗 Add / Edit Social Links



Edit the links dictionary inside generate\_qr.py:



links = {

&nbsp;   "github": "https://github.com/yourname",

&nbsp;   "linkedin": "https://linkedin.com/in/yourname",

}





Re-run the script to regenerate QR codes.



\##🎨 Styling



UI styles live in:



core/style.css





You can easily tweak:



Colors



Card animations



Layout spacing



Fonts



\##📸 Preview Behavior



Clicking any QR image opens it in a fullscreen modal



Click anywhere outside to close



\##🔐 Security Notes



Fully static (no trackers, no JS frameworks)



No external APIs



QR codes are generated locally



Safe for personal branding \& offline sharing



\##📄 License



This project is open-source and free to use for personal or professional purposes.



\##👤 Author



Mahmoud Elgazar - "Zero"

Cybersecurity • Ethical Hacking • Software Engineering

