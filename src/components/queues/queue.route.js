import express from "express";
import queueController from "./queue.controller.js";

const router = express.Router();

router.get("/import/:jobId/status", queueController.checkImportStatus);
router.get("/export/:jobId/status", queueController.checkExportStatus);
router.get("/export/:jobId/download", queueController.downloadExportFile);

export default router;
