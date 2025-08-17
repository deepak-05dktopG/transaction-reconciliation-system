import { Request, Response } from "express";
import { parseCsvFile } from "../utils/csvHelper";
import { insertSettlement, SettlementCsvRow } from "../models/settlementModel";
import {
  findTransactionIdForSettlement,
  recalcOne
} from "../models/transactionModel";

//CSV columns
//backend requirement: POST /reconcile
export default {
  async reconcileCsv(req: Request, res: Response) {
    if (!req.file) return res.status(400).json({ error: "CSV file is required (field name: file)" });

    try {
      const rows = (await parseCsvFile(req.file.path)) as SettlementCsvRow[];
      let processed = 0;
      let matched = 0;

      for (const r of rows) {
        const txnId = await findTransactionIdForSettlement(
          r.lifecycle_id,
          r.account_id,
          r.merchant_name,
          r.transaction_date
        );

        if (!txnId) {
          //skip if no match
          continue;
        }

        await insertSettlement(txnId, r);
        await recalcOne(txnId);
        processed++;
        matched++;
      }

      res.json({ message: "Reconcile completed", rows: rows.length, processed, matched });
    } catch (e) {
      console.error("reconcileCsv error:", e);
      res.status(500).json({ error: "Failed to reconcile" });
    }
  }
};
