import { db } from "./db";
import { computeStatus } from "../utils/calc";

export type TxnRow = {
  transaction_id: string;
  lifecycle_id: string | null;
  account_id: string;
  merchant_name: string;
  transaction_date: string;
  transaction_amount: number;
  currency: string;
  status: string;
  settlement_status: string;
  total_settled_amount: number;
  last_settlement_date: string | null;
};

export function getAllTxns(): Promise<TxnRow[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM transactions ORDER BY transaction_date DESC",
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows as TxnRow[]);
      }
    );
  });
}

export function getTxnById(id: string): Promise<TxnRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM transactions WHERE transaction_id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row as TxnRow | undefined);
      }
    );
  });
}

export function getSettlementsForTxn(id: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM settlement_history WHERE transaction_id = ? ORDER BY settlement_date ASC",
      [id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows as any[]);
      }
    );
  });
}

//lifecycle_id,fallback: account_id + merchant_name + transaction_date
export function findTransactionIdForSettlement(
  lifecycle_id: string | undefined,
  account_id: string | undefined,
  merchant_name: string | undefined,
  transaction_date: string | undefined
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (lifecycle_id) {
      db.get(
        "SELECT transaction_id FROM transactions WHERE lifecycle_id = ?",
        [lifecycle_id],
        (e, row) => {
          if (e) return reject(e);
          if ((row as any)?.transaction_id)
            return resolve((row as any).transaction_id);
          fallback();
        }
      );
    } else {
      fallback();
    }

    function fallback() {
      if (!account_id || !merchant_name || !transaction_date)
        return resolve(null);
      db.get(
        `SELECT transaction_id FROM transactions
         WHERE account_id = ? AND merchant_name = ? AND transaction_date = ?`,
        [account_id, merchant_name, transaction_date],
        (err2, row2) =>
          err2 ? reject(err2) : resolve((row2 as any)?.transaction_id || null)
      );
    }
  });
}

//recalclate trasaction settlement fields
export function recalcOne(transaction_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT settlement_amount, settlement_date FROM settlement_history WHERE transaction_id = ?`,
      [transaction_id],
      (e, settlements) => {
        if (e) return reject(e);

        const list = (settlements as any[]) || [];
        const total = list.reduce(
          (sum: number, s: any) => sum + parseFloat(s.settlement_amount),
          0
        );
        const lastDate =
          list
            .map((s: any) => s.settlement_date)
            .sort()
            .slice(-1)[0] || null;

        db.get(
          "SELECT transaction_amount FROM transactions WHERE transaction_id = ?",
          [transaction_id],
          (e2, row: any) => {
            if (e2) return reject(e2);
            const newStatus = computeStatus(
              total,
              parseFloat(row.transaction_amount)
            );
            db.run(
              `UPDATE transactions
               SET total_settled_amount = ?, last_settlement_date = ?, settlement_status = ?
               WHERE transaction_id = ?`,
              [total, lastDate, newStatus, transaction_id],
              (e3) => (e3 ? reject(e3) : resolve())
            );
          }
        );
      }
    );
  });
}

export default {
  getAllTxns,
  getTxnById,
  getSettlementsForTxn,
  findTransactionIdForSettlement,
  recalcOne,
};
