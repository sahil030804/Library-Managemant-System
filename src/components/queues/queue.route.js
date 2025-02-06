import express from "express";
import queueController from "./queue.controller.js";

const router = express.Router();

router.get("/import/:jobId/status", queueController.checkImportStatus);

export default router;
