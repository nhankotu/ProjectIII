import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi ứng dụng:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Đã xảy ra lỗi!
          </h1>
          <p className="text-gray-600 mb-4">
            Vui lòng tải lại trang hoặc quay lại sau.
          </p>
          <button
            onClick={() => globalThis.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
