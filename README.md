<h1 align="center">💳 Transaction Reconciliation System</h1>

<p align="center">
  A system to reconcile transactions & settlements with issue detection, summary APIs, and a clean UI.
  <br/>
  🌍 Live Demo
🚀 The project is live here:  
👉 [Transaction Reconciliation System](https://transaction-reconciliation-system.netlify.app)  
</p>
 <h3 align="center">☁️ Frontend & Backend are deployed on : </h3>
<p align="center">
  <a href="https://transaction-reconciliation-system.netlify.app/">
    <img src="https://img.shields.io/badge/Frontend-Netlify-blue?style=for-the-badge&logo=netlify" alt="Frontend on Netlify"/>
  </a>
  &nbsp;
  <a href="https://reconciliation-backend-8idg.onrender.com">
    <img src="https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render" alt="Backend on Render"/>
  </a>
</p>


---

## ✨ Features
✅ Import settlements via CSV  
✅ Automatic reconciliation with statuses:  
- **PENDING** → No settlement received  
- **PARTIAL** → Settled < transaction amount  
- **FULLY_SETTLED** → Settled = transaction amount  
- **OVER_SETTLED** → Settled > transaction amount  
- **REFUNDED** → Settled < 0 (refund)  

✅ Issue flags:  
- 🔴 **CRITICAL** → Over-settled OR pending > 7 days  
- 🟡 **WARNING** → Partial settlement  
- 🟢 **NONE** → Healthy transaction  

✅ APIs for detail view & dashboard summary  
✅ Lightweight: TypeScript + Express + SQLite 
✅ React frontend with summary cards, transaction table & CSV upload  

---
## 🎥 Demo Video
[![Click to Watch]()](https://www.youtube.com/watch?v=YOUR_VIDEO_ID](https://github.com/deepak-05dktopG/transaction-reconciliation-system/blob/main/Demo%20Video.mp4))

## 🛠️ Tech Stack
- TypeScript 
- Express.js  
- SQLite  
- React + Vite  
- MVC structure (Models, Controllers, Routes, Utils)  

---

## 📂 Project Structure
```bash
.
├── backend/
│   ├─ src/
│   │   ├─ controllers/    # Route handlers
│   │   ├─ models/         # DB queries + seeding
│   │   ├─ routes/         # API routes
│   │   ├─ utils/          # Helpers (status, issues)
│   │   └─ index.ts        # Entry point
│   └─ database.sqlite     # Local SQLite database
│
├── frontend/
│   ├─ src/                # React components
│   ├─ public/             # Static assets
│   └─ vite.config.ts      # Vite config
│
└── README.md

```
## Clone Repo
```bash
git clone https://github.com/deepak-05dktopG/transaction-reconciliation-system.git
cd transaction-reconciliation
```
## 🚀 Backend Setup
```bash
cd backend
npm install
npm run dev

Backend Dependencies - express, sqlite3, csv-parser, multer, ts-node, typescript

API Runs on 👉 http://localhost:3000
GET /transactions → all transactions
GET /transactions/:id → single transaction
GET /transactions/dashboard/summary → summary metrics
POST /import/transactions → upload transaction CSV
POST /import/settlements → upload settlement CSV
POST /reconcile → reconcile settlement CSV

```
## 🎨 Frontend Setup

```bash
cd transaction-reconciliation/frontend
npm install
npm run dev

Frontend Dependencies - react, react-dom, vite, axios, bootstrap

📊 Dashboard with summary cards
📋 Table showing all transactions with reconciliation status
📈 Chart visualization for settlements
```
## 📦 Requirements

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18 or higher**
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Git (for cloning the repository)

Each project folder (`backend/` and `frontend/`) has its own `package.json` file which defines the dependencies.  
Run `npm install` inside each folder to install the required packages.

---

<h2 align="center">🙋 About Me</h2>

<p align="center">
  Hi, I'm <b>Deepak Kumar</b> 👋 <br/>
  💻 Passionate about <b>Full-Stack Development</b> & <b>AI Agents</b><br/>
  🚀 Skilled in <b>MERN Stack, Express.js, TypeScript, SQLite, React, and AI Tools</b><br/>
  🎯 Focused on building <i>clean, beginner-friendly, and interview-ready projects</i>
</p>

<p align="center">
  <a href="https://deepakdigitalcraft.tech"><img src="https://img.shields.io/badge/🌐 Portfolio-blue?style=for-the-badge" /></a>
  <a href="https://www.linkedin.com/in/deepak-05dktopg/"><img src="https://img.shields.io/badge/💼 LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
  <a href="https://github.com/deepak-05dktopG"><img src="https://img.shields.io/badge/🐙 GitHub-181717?style=for-the-badge&logo=github" /></a>
  <a href="mailto:kumardeepak59422@gmail.com"><img src="https://img.shields.io/badge/📧 Email-red?style=for-the-badge" /></a>
</p>

<p align="center">
 ⭐ If you found this project helpful, don’t forget to **star the repo** and support my journey!  
</p>

