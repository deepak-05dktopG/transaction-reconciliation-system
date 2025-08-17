import { Router } from "express";
import multer from "multer";
import importController from "../controllers/importController";

const upload = multer({ dest: "uploads/" });
const router = Router();

//transactions CSV upload
router.post(
  "/transactions",
  upload.single("file"),
  importController.importTransactions
);

//settlements CSV upload
router.post(
  "/settlements",
  upload.single("file"),
  importController.importSettlements
);

export default router;
