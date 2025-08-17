import { Router } from "express";
import multer from "multer";
import reconcileController from "../controllers/reconcileController";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("file"), reconcileController.reconcileCsv);

export default router;
