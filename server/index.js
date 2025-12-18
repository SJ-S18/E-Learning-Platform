import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./database/db.js";
import Razorpay from 'razorpay'
import cors from "cors";

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});

const app = express();

//using middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT;;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/uploads", express.static("uploads"));

//importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import quizRoutes from "./routes/quiz.js";


//using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", quizRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); 
    connectDB();
})