import express from "express";
import { dummyPayment } from "../controllers/payment.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/pay/:courseId", isAuth, dummyPayment);

export default router;
