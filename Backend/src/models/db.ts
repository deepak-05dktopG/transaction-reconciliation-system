import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../../reconciliation.db");

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("Error opening database:", err);
});

export function initDb() {
  //creattransactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id TEXT PRIMARY KEY,
      lifecycle_id TEXT,
      account_id TEXT NOT NULL,
      merchant_name TEXT NOT NULL,
      transaction_date TEXT NOT NULL,
      transaction_amount REAL NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      settlement_status TEXT DEFAULT 'PENDING',
      total_settled_amount REAL DEFAULT 0.0,
      last_settlement_date TEXT
    )
  `);

  // Create settlement_history table
  db.run(`
    CREATE TABLE IF NOT EXISTS settlement_history (
      settlement_id TEXT PRIMARY KEY,
      transaction_id TEXT,
      lifecycle_id TEXT,
      settlement_date TEXT NOT NULL,
      settlement_amount REAL NOT NULL,
      settlement_type TEXT NOT NULL,
      currency TEXT NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
    )
  `);

  // Insert sample rows only if table is empty
  db.get("SELECT COUNT(*) as count FROM transactions", (err, row: any) => {
    if (err) return console.error("Count check failed:", err);
    if (row.count === 0) {
      const sampleData = [
  // Completed transactions pending settlement
  ["TXN001","LC001","ACC123","Amazon.com","2025-08-14",125.99,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN002","LC002","ACC124","Starbucks","2025-08-14",4.75,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN003","LC003","ACC125","Shell Gas","2025-08-14",45.30,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN004","LC004","ACC126","Best Buy","2025-08-14",899.99,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN005","LC005","ACC127","Home Depot","2025-08-14",234.50,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN006","LC006","ACC128","Target","2025-08-14",87.25,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN007","LC007","ACC129","Walmart","2025-08-14",156.78,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN008","LC008","ACC130","Apple","2025-08-05",1299.99,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN009","LC009","ACC131","Nike","2025-08-14",189.95,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN010","LC010","ACC132","Netflix","2025-08-07",15.99,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN013","LC011","ACC135","Corner Deli","2025-08-14",32.45,"USD","COMPLETED","PENDING",0.0,null],
  ["TXN014","LC012","ACC136","Shell Gas","2025-08-14",28.90,"USD","COMPLETED","PENDING",0.0,null],

  // Failed transactions (no settlements)
  ["TXN015","LC013","ACC137","Amazon.com","2025-08-14",199.99,"USD","FAILED","NOT_APPLICABLE",0.0,null],
  ["TXN016","LC014","ACC138","Uber Taxi","2025-08-14",75.25,"USD","DECLINED","NOT_APPLICABLE",0.0,null]
];

      const stmt = db.prepare(`
        INSERT INTO transactions (transaction_id,lifecycle_id,account_id,merchant_name,transaction_date,transaction_amount,currency,status,settlement_status,total_settled_amount,last_settlement_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const row of sampleData) stmt.run(row);
      stmt.finalize();
      console.log("Sample data inserted.");
    }
  });
}
