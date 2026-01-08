import express from "express";
import { sql } from "../config/db.js";
import {createTransaction, deleteTransaction, getTransactionByUserId, getUserSummary} from "../controllers/transactionsController.js"
const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id",deleteTransaction);

router.get("/summary/:userId",getUserSummary);

export default router;