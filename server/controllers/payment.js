export const dummyPayment = async (req, res) => {
  try {
    const { courseId } = req.params;

    res.status(200).json({
      success: true,
      orderId: "ORDER_" + Date.now(),
      courseId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
   

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
