import express from "express";
import { dummyPayment, verifyPayment } from "../controllers/payment.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/pay/:courseId", isAuth, dummyPayment);

router.post("/verification", isAuth, verifyPayment);

export default router;
