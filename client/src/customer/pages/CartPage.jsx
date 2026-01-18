import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import CartItem from "../components/cart/CartItem";
import EmptyState from "../components/common/EmptyState";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart(); // Bỏ cartTotal, cartCount từ context vì ta tự tính
  const { isAuthenticated } = useAuth();

  // ✅ STATE QUẢN LÝ SẢN PHẨM ĐƯỢC CHỌN (Lưu mảng các ID)
  const [selectedItems, setSelectedItems] = useState([]);

  // Hàm lấy ID chuẩn (giống bên CartItem)
  const getItemId = (item) => item.productId || item._id || item.id;

  // 1. Xử lý chọn/bỏ chọn một sản phẩm
  const handleSelect = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id); // Bỏ chọn
      } else {
        return [...prev, id]; // Chọn thêm
      }
    });
  };

  // 2. Xử lý "Chọn tất cả"
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Nếu đang chọn hết thì bỏ chọn hết
    } else {
      const allIds = cartItems.map((item) => getItemId(item));
      setSelectedItems(allIds); // Chọn hết
    }
  };

  // 3. Tính tổng tiền dựa trên sản phẩm ĐÃ CHỌN
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(getItemId(item)))
    .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // 4. Xử lý Checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    // Chuyển hướng sang Checkout và mang theo danh sách sản phẩm đã chọn
    // (Bạn cần sửa trang Checkout để nhận state này)
    const itemsToCheckout = cartItems.filter((item) =>
      selectedItems.includes(getItemId(item))
    );

    navigate("/checkout", {
      state: { items: itemsToCheckout, total: selectedTotal },
    });
  };

  // --- Render ---

  if (cartItems.length === 0) {
    return (
      <div className="py-12 bg-gray-50 min-h-[60vh]">
        <EmptyState
          title="Giỏ hàng trống"
          description="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
          icon="🛒"
        >
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tiếp tục mua sắm
          </button>
        </EmptyState>
      </div>
    );
  }

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng</h1>

        {/* ✅ Hiển thị số loại sản phẩm thay vì tổng số lượng */}
        <p className="text-gray-600 mb-8">
          Bạn có {cartItems.length} loại sản phẩm trong giỏ hàng
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Desktop với Checkbox Select All */}
              <div className="hidden md:flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold">
                <div className="w-8 flex justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex-grow">Sản phẩm</div>
                <div className="w-32 text-center">Đơn giá</div>
                <div className="w-32 text-center">Số lượng</div>
                <div className="w-32 text-center">Thành tiền</div>
                <div className="w-10"></div>
              </div>

              {/* Danh sách items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const id = getItemId(item);
                  return (
                    <CartItem
                      key={id}
                      item={item}
                      // Truyền trạng thái select xuống
                      isSelected={selectedItems.includes(id)}
                      onSelect={() => handleSelect(id)}
                    />
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  ← Tiếp tục mua sắm
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          {/* Cột phải: Summary (Đã sửa để tính theo selectedItems) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Tổng thanh toán
              </h3>

              <div className="flex justify-between mb-2 text-gray-600">
                <span>Số sản phẩm chọn:</span>
                <span>{selectedItems.length} loại</span>
              </div>

              <div className="flex justify-between mb-6 text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedTotal)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all 
                  ${
                    selectedItems.length > 0
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Mua hàng ({selectedItems.length})
              </button>

              <div className="mt-8">
                <div className="flex justify-between items-center text-gray-400 text-xs">
                  <span>🔒 SSL Secured</span>
                  <span>🛡️ Buyer Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
