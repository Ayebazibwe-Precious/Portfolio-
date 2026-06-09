# Mary Precious Ayebazibwe — Portfolio

Professional portfolio website built with Node.js + Express.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Gmail App Password

# 3. Run (development)
npm run dev

# 4. Run (production)
npm start
```

Visit `http://localhost:3000`

## Email Setup (Gmail App Password)

1. Go to your Google Account → Security → 2-Step Verification (enable it)
2. Then go to: https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Paste it into `.env` as `EMAIL_PASS`

## Project Structure

```
portfolio/
├── index.js          ← Express server + email API
├── package.json
├── .env              ← Your secrets (never commit this)
├── .env.example      ← Template
└── public/
    ├── index.html    ← Portfolio page
    ├── css/style.css
    └── js/main.js
```

## Deploying

Works on **Railway**, **Render**, **Heroku**, or any Node.js host.
Set `EMAIL_USER` and `EMAIL_PASS` as environment variables on the platform.
