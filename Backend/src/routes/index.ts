import { Router } from "express";
import importRoutes from "./importRoutes";
import reconcileRoutes from "./reconcileRoutes";
import transactionRoutes from "./transactionRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/import", importRoutes);            
router.use("/reconcile", reconcileRoutes);    
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
