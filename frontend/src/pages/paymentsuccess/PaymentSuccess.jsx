import React from "react";

const PaymentSuccess = () => {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "green" }}>✅ Payment Successful</h1>
      <p>You have successfully enrolled in the course.</p>
    </div>
  );
};

export default PaymentSuccess;
