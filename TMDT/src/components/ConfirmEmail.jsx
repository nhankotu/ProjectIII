import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Lấy thông tin user từ local storage hoặc state management
      const userId = localStorage.getItem("userId");

      const response = await fetch("/api/confirm-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          verificationCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.message === "Xác nhận email thành công!") {
        // Xác nhận thành công, chuyển hướng đến trang đăng nhập
        navigate("/login");
      } else {
        setError(data.message || "Có lỗi xảy ra khi xác nhận email");
      }
    } catch (error) {
      console.error("Lỗi xác nhận email:", error);
      setError("Có lỗi xảy ra khi xác nhận email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="confirm-email-container">
      <h1>Xác nhận Email</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="verificationCode">Mã xác nhận:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Nhập mã xác nhận"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xác nhận..." : "Xác nhận"}
        </button>
      </form>
    </div>
  );
};

export default ConfirmEmail;
