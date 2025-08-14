import express from "express";
import { sql } from "../config/db.js";
import {createTransaction, deleteTransaction, getSummary, getTransactionsByUserId} from "../controllers/transactionsController.js"

const router = express.Router();


router.get("/:userId", getTransactionsByUserId);


router.post("/", createTransaction);

router.delete("/api/transactions/:id",deleteTransaction);

router.get("/:userId", getSummary);



export default router;