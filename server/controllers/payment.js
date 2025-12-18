import Course from "../models/Courses.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";

export const dummyPayment = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // create fake payment id
  const fakePaymentId = "PAY_" + Date.now();

  // save payment
  await Payment.create({
    user: userId,
    course: courseId,
    amount: course.price,
    paymentId: fakePaymentId,
    status: "success",
  });

  // add course to user's subscriptions
  await User.findByIdAndUpdate(userId, {
    $addToSet: { subscriptions: courseId },
  });

  res.status(200).json({
    success: true,
    message: "Payment successful (Dummy)",
    paymentId: fakePaymentId,
  });
};


