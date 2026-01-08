import React from "react";
import { AlertTriangle, Info, CheckCircle, X, Loader2 } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "danger", // 'danger', 'warning', 'info', 'success'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  // Cấu hình giao diện dựa trên type
  const config = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      bgIcon: "bg-red-100",
      btnColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      bgIcon: "bg-orange-100",
      btnColor: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      bgIcon: "bg-blue-100",
      btnColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgIcon: "bg-green-100",
      btnColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
  };

  const currentConfig = config[type] || config.info;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    // Container chính với z-index cao nhất
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        {/* 1. Lớp nền tối (Overlay) */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={handleBackdropClick}
        ></div>

        {/* 2. Nội dung Modal Panel */}
        <div className="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
          {/* Nút đóng (X) */}
          {!isLoading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={20} />
            </button>
          )}

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* Vòng tròn Icon */}
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${currentConfig.bgIcon}`}
              >
                {currentConfig.icon}
              </div>

              {/* Văn bản nội dung */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 leading-6">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Phần nút bấm (Footer) */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              disabled={isLoading}
              className={`inline-flex w-full justify-center rounded-lg border border-transparent px-4 py-2 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentConfig.btnColor}`}
              onClick={onConfirm}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Đang xử lý...
                </span>
              ) : (
                confirmText
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
