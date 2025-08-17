<h1 align="center">💳 Transaction Reconciliation System</h1>

<p align="center">
  Backend assignment for <b>OpenFabric</b><br/>
  A simple system to reconcile transactions & settlements with issue detection and summary APIs.
</p>

---

## ✨ Features
✅ Import transactions & settlements via CSV  
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
✅ Lightweight: TypeScript + Express + SQLite (no ORMs, no heavy deps)  

---

## 🛠️ Tech Stack
- [TypeScript](https://www.typescriptlang.org/)  
- [Express.js](https://expressjs.com/)  
- [SQLite](https://www.sqlite.org/) with `sqlite3` package  
- MVC structure (Models, Controllers, Routes, Utils)  

---

## 📂 Project Structure
```bash
src/
 ├─ controllers/    # Route handlers
 ├─ models/         # DB queries
 ├─ routes/         # API routes
 ├─ utils/          # Helpers (status, issues)
 └─ index.ts        # Entry point    
 <h2 align="center">👨‍💻 Author</h2>

<p align="center">
  <b>Deepakkumar</b> <br/>
  🎓 B.Tech AI & Data Science | 💻 Full-Stack & AI Agent Enthusiast
</p>

<p align="center">
  <a href="https://www.linkedin.com/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <a href="mailto:deepakkumar@example.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://your-portfolio.com" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white"/>
  </a>
</p>