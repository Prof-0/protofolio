
# Personal QR & Social Links Hub

> A professional, lightweight static web project that centralizes personal and professional social links with scannable QR codes for fast, reliable sharing.

> This project is designed with simplicity, performance, and clean presentation in mind, making it suitable for personal branding, developer portfolios, and offline sharing.

---

## 📖 Overview
> The **Personal QR & Social Links Hub** is a static landing page that displays a curated list of social or professional links, each paired with a high-quality QR code.
All QR codes are **generated locally using Python**, ensuring privacy, security, and full control over the content. The project does not rely on any backend services or external APIs.

---

## ✨ Features
* ✅ **Centralized Hub:** For social and professional links.
* 📱 **Local Generation:** High-resolution QR codes created locally.
* 🎨 **Modern UI:** Clean, dark-themed interface.
* ⚡ **Fully Static:** No frameworks, no backend, no trackers.
* 🖱️ **Interactive:** Click-to-preview QR modal view.

---

## 🛠 Technology Stack
```text
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
* ![Python](https://img.shields.io/badge/Python-3.7+-3776AB?style=flat-square&logo=python&logoColor=white)
* **Libraries:** `qrcode`, `Pillow`
```
---

## 📂 Project Structure
```text

├── index.html          # Main landing page
├── core/
│   └── style.css       # UI styling and theme
├── generate_qr.py      # QR code generation script
├── qrcodes/            # Generated QR code images
└── README.md
```
## ⚙️ Installation & Setup
### 1. Clone the Repository
```text

git clone [https://github.com/](https://github.com/)<username>/<repository>.git
cd <repository>
```
### 2. Install Dependencies

```text
pip install qrcode[pil]
```
### 3. Generate QR Codes

```text
python generate_qr.py
```
> All QR codes will be generated and saved inside the qrcodes/ directory.

### 🚀 Running the Project
> This is a fully static project. Simply open the main file:



# On Windows
> start index.html
### 🎨 Customization
> Editing Social Links
> Modify the links dictionary inside generate_qr.py:

## Python
```text
links = {
    "github": "[https://github.com/your-username](https://github.com/your-username)",
    "linkedin": "[https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)",
    "telegram": "[https://t.me/your-handle](https://t.me/your-handle)"
}
```
### Note:
> Re-run the script after editing to regenerate QR codes.

## 📄 License
> This project is licensed under the MIT License.

# 👤 Author
###      Eng Mahmoud Elgazar **"zero"**

## 🛡️ Cybersecurity

## 🎩 Ethical Hacking

## 💻 Software Engineering
