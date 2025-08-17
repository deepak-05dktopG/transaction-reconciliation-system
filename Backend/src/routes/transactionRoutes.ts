import { Router } from "express";
import { getTransactions, getTransactionDetail, getDashboardSummary } from "../controllers/transactionController";

const router = Router();

router.get("/", getTransactions);
router.get("/:id", getTransactionDetail);
router.get("/dashboard/summary", getDashboardSummary);

export default router;