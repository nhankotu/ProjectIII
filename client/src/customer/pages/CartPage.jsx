import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import CartItem from "../components/cart/CartItem";
import EmptyState from "../components/common/EmptyState";
import { ShoppingBag, ArrowRight, Trash2, Loader2 } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart, loading, updateQuantity, removeFromCart } =
    useCart();
  const { isAuthenticated } = useAuth();

  const [selectedItems, setSelectedItems] = useState([]);

  // Hàm helper lấy ID
  const getItemId = (item) => item._id;

  // 1. Xử lý chọn/bỏ chọn
  const handleSelect = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) return prev.filter((itemId) => itemId !== id);
      return [...prev, id];
    });
  };

  // 2. Xử lý "Chọn tất cả"
  // Chỉ chọn những item hợp lệ (không bị isInvalid)
  const validItems = cartItems.filter((item) => !item.isInvalid);

  const handleSelectAll = () => {
    if (selectedItems.length === validItems.length) {
      setSelectedItems([]);
    } else {
      const allIds = validItems.map((item) => getItemId(item));
      setSelectedItems(allIds);
    }
  };

  // 3. Tính tổng tiền (Chỉ tính item được chọn và hợp lệ)
  const selectedTotal = cartItems
    .filter(
      (item) => selectedItems.includes(getItemId(item)) && !item.isInvalid,
    )
    .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // 4. Checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    // Lọc item hợp lệ để checkout
    const itemsToCheckout = cartItems.filter(
      (item) => selectedItems.includes(getItemId(item)) && !item.isInvalid,
    );

    navigate("/checkout", {
      state: { items: itemsToCheckout, total: selectedTotal },
    });
  };

  // --- TRẠNG THÁI LOADING ---
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
        <p className="text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // --- GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="py-12 bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Giỏ hàng trống"
          description="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
          icon={
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          }
        >
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            Tiếp tục mua sắm <ArrowRight size={18} />
          </button>
        </EmptyState>
      </div>
    );
  }

  const isAllSelected =
    validItems.length > 0 && selectedItems.length === validItems.length;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Giỏ hàng
        </h1>
        <p className="text-gray-600 mb-8">
          Bạn có{" "}
          <span className="font-bold text-blue-600">{cartItems.length}</span>{" "}
          sản phẩm
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: DANH SÁCH */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="hidden md:flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold">
                <div className="w-8 flex justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={validItems.length === 0}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex-grow">Sản phẩm</div>
                <div className="w-32 text-center">Đơn giá</div>
                <div className="w-32 text-center">Số lượng</div>
                <div className="w-32 text-center">Thành tiền</div>
                <div className="w-10"></div>
              </div>

              {/* LIST ITEMS */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const id = getItemId(item);
                  return (
                    <CartItem
                      key={id}
                      item={item}
                      isSelected={selectedItems.includes(id)}
                      // 👇 Truyền các hàm xử lý xuống CartItem
                      onSelect={() => !item.isInvalid && handleSelect(id)}
                      onIncrease={() => updateQuantity(id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(id, item.quantity - 1)}
                      onRemove={() => removeFromCart(id)}
                      // 👇 Disable checkbox nếu item lỗi
                      isDisabled={item.isInvalid}
                    />
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <ArrowRight size={16} className="rotate-180" /> Tiếp tục mua
                  sắm
                </Link>
                <button
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                >
                  <Trash2 size={16} /> Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG TIỀN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b">
                Thanh toán
              </h3>

              <div className="flex justify-between mb-3 text-gray-600 text-sm">
                <span>Đã chọn:</span>
                <span className="font-medium text-gray-900">
                  {selectedItems.length} sản phẩm
                </span>
              </div>

              <div className="flex justify-between mb-6 text-gray-600 text-sm">
                <span>Tạm tính:</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedTotal)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`w-full py-3.5 rounded-lg font-bold text-base shadow-sm transition-all flex justify-center items-center gap-2
                  ${
                    selectedItems.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Mua hàng ({selectedItems.length})
              </button>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span>🛡️</span> <span>Bảo mật thanh toán 100%</span>
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
