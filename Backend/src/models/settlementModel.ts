import { db } from "./db";

export type SettlementCsvRow = {
  settlement_id: string;
  lifecycle_id?: string;
  account_id?: string;
  merchant_name?: string;
  transaction_date?: string;
  settlement_date: string;
  settlement_amount: string | number;
  settlement_type: "DEBIT" | "CREDIT";
  currency: string;
};

export function insertSettlement(
  transaction_id: string,
  row: SettlementCsvRow
): Promise<void> {
  return new Promise((resolve, reject) => {
    const amt = typeof row.settlement_amount === "string"
      ? parseFloat(row.settlement_amount)
      : row.settlement_amount;

    const stmt = `
      INSERT OR IGNORE INTO settlement_history
        (settlement_id, transaction_id, lifecycle_id, settlement_date, settlement_amount, settlement_type, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      stmt,
      [
        row.settlement_id,
        transaction_id,
        row.lifecycle_id || null,
        row.settlement_date,
        amt,
        row.settlement_type,
        row.currency
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}
