import express from "express";
import { generateQuiz } from "../controllers/quiz.js";


const router = express.Router();

router.post("/quiz", generateQuiz);

export default router;
