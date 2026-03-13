# 🏆 KaunJeeta — PPT Analyzer

> **Ek hi click mein pata karo — kaun jeeta!**

AI-powered hackathon presentation analyzer. Upload karo presentations, reference se compare karo, aur winners instantly shortlist karo.

![MIT License](https://img.shields.io/badge/License-MIT-purple.svg)
![React](https://img.shields.io/badge/React-Vite-blue.svg)
![Python](https://img.shields.io/badge/Backend-Python-green.svg)

---

## ✨ Features

- 📊 **AI-Powered Analysis** — Gemini AI se presentations ka deep analysis
- 🎯 **Reference Comparison** — Ek reference PPT se baaki sab compare karo
- ⚡ **Instant Results** — Seconds mein 200+ presentations analyze karo
- 📈 **Detailed Scoring** — Har presentation ka breakdown milega
- 🕐 **History** — Purane comparisons save rehte hain (login required)
- 🆓 **Free to Use** — Pehli baar bina login ke try karo

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Gemini API Key ([Get here](https://makersuite.google.com/app/apikey))

### Installation
```bash
# Clone karo
git clone https://github.com/Purjeet979/PptAnalyzer.git
cd PptAnalyzer

# Frontend install karo
npm install

# Backend install karo
cd server
pip install -r requirements.txt
```

### Environment Setup

`.env` file banao root mein:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_flask_secret_key
```

### Run karo
```bash
# Frontend (Terminal 1)
npm run dev

# Backend (Terminal 2)
cd server
python app.py
```

App open hoga: `http://localhost:5173`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + Flask |
| AI | Google Gemini API |
| Database | SQLite |
| Auth | Google OAuth |

---

## 📖 How It Works

1. **Upload** — Reference PPT aur compare karne wali PPTs upload karo
2. **Analyze** — AI har presentation ko criteria ke basis pe judge karta hai
3. **Results** — Score, strengths, weaknesses aur shortlist milti hai

---

## 🤝 Contributing

Pull requests welcome hain! Koi bhi feature add karna ho ya bug fix karna ho:

1. Fork karo
2. Branch banao (`git checkout -b feature/AmazingFeature`)
3. Commit karo (`git commit -m 'Add AmazingFeature'`)
4. Push karo (`git push origin feature/AmazingFeature`)
5. Pull Request kholo

---

## 📄 License

MIT License — details ke liye [LICENSE](LICENSE) dekho.

---

## 👨‍💻 Author

**Purjeet** — [@Purjeet979](https://github.com/Purjeet979)

---

*Made with ❤️ for hackathon organizers across India 🇮🇳*
