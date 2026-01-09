import React from "react";

const LoadingSpinner = ({
  fullScreen = false,
  size = "md",
  color = "blue",
}) => {
  // Cấu hình kích thước
  const sizes = {
    sm: "h-5 w-5 border-2", // Dùng cho button
    md: "h-8 w-8 border-4", // Mặc định
    lg: "h-12 w-12 border-4", // Dùng cho loading trang
    xl: "h-16 w-16 border-4",
  };

  // Cấu hình màu sắc
  const colors = {
    blue: "border-blue-600",
    white: "border-white", // Dùng trên nền tối/button xanh
    gray: "border-gray-600",
  };

  const spinnerClass = `animate-spin rounded-full border-t-transparent ${sizes[size]} ${colors[color]} border-opacity-75`;

  // Nếu là chế độ Full màn hình (dùng khi tải trang lần đầu)
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`${sizes.lg} border-4 border-blue-600 border-t-transparent animate-spin rounded-full`}
          ></div>
          <span className="text-gray-500 font-medium text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Mặc định: Căn giữa khung chứa nó
  return (
    <div className="flex justify-center items-center w-full py-4">
      <div className={spinnerClass}></div>
    </div>
  );
};

export default LoadingSpinner;
