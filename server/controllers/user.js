import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: "User already exists, please login",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });
  const otp = Math.floor(100000 + Math.random() * 900000);

  const activationToken = jwt.sign(
    { userId: user._id, otp },
    process.env.Activation_Secret,
    { expiresIn: "5m" }
  );

  await sendMail(email, "E Learning", { name, otp });

  return res.status(200).json({
    message: "Otp sent to your email",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { activationToken, otp } = req.body;

  const verify = jwt.verify(
    activationToken,
    process.env.Activation_Secret
  );

  if (!verify) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (verify.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }


  return res.status(200).json({
    message: "User verified successfully",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user with this email",
    });

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword)
    return res.status(400).json({
      message: "Incorrect Password",
    });

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_Sec,
    { expiresIn: "7d" }
  );

  res.json({
    message: `Welcome back, ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    user,
  });
});
