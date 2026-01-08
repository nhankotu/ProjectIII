import React from "react";

const ErrorMessage = ({
  message = "Something went wrong",
  title = "Error",
  showRetry = false,
  onRetry,
  variant = "error",
}) => {
  const variants = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const currentVariant = variants[variant] || variants.error;

  return (
    <div
      className={`${currentVariant.bg} ${currentVariant.border} border rounded-xl p-6`}
    >
      <div className="flex items-start">
        <div className={`${currentVariant.text} mr-4`}>
          {currentVariant.icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="mb-4">{message}</p>

          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                variant === "error"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : variant === "warning"
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
