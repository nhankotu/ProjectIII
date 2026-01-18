import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI, orderAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { MapPin, CreditCard, Truck, CheckCircle } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook lấy dữ liệu truyền từ CartPage

  // Lấy các hàm từ Context
  const { removeFromCart, clearCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // --- 1. XÁC ĐỊNH SẢN PHẨM MUA ---
  // Ưu tiên lấy từ location.state (khi bấm Mua từ Cart), nếu không có thì lấy mảng rỗng
  const checkoutItems = location.state?.items || [];
  const checkoutTotal = location.state?.total || 0;

  // State logic
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // --- 2. VALIDATION & REDIRECT ---
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login?redirect=/checkout");
        return;
      }

      // Nếu không có sản phẩm nào được chọn (refresh trang hoặc vào trực tiếp) -> Quay về giỏ
      if (checkoutItems.length === 0 && !orderCompleted) {
        alert("Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán.");
        navigate("/cart");
      }
    }
  }, [isAuthenticated, authLoading, checkoutItems, orderCompleted, navigate]);

  // --- 3. FETCH USER ADDRESSES ---
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getAddresses();

        const list = Array.isArray(res) ? res : res.data || [];

        console.log("Dữ liệu địa chỉ sau khi xử lý:", list);
        setAddresses(list);

        // Auto chọn địa chỉ mặc định
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        console.error("Lỗi lấy địa chỉ:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchAddress();
  }, [isAuthenticated]);
  // --- 4. XỬ LÝ ĐẶT HÀNG
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const selectedAddr = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddr) return;

    try {
      setOrderProcessing(true);

      // 1. Chuẩn bị payload: Gửi chính xác danh sách items đang hiển thị trên trang checkout
      const orderPayload = {
        // Gộp sản phẩm trùng ID nếu có và chuẩn bị cấu trúc gửi lên
        items: checkoutItems.map((item) => ({
          product: item.productId || item._id, // ID sản phẩm gốc
          name: item.name,
          thumbnail: item.thumbnail?.url || item.thumbnail || "",
          price: item.price,
          quantity: item.quantity,
          // Đảm bảo gửi kèm sellerId để backend tách đơn theo shop
          sellerId: item.sellerId || item.product?.sellerId,
        })),
        totalAmount: checkoutTotal,
        shippingAddress: {
          fullName: selectedAddr.fullName,
          phone: selectedAddr.phone,
          address: selectedAddr.address,
          city: selectedAddr.name || "N/A", // Label địa chỉ
        },
        paymentMethod: paymentMethod.toUpperCase(), // "COD" hoặc "BANKING"
      };

      console.log("Dữ liệu gửi lên server:", orderPayload);

      // 2. Gọi API tạo đơn hàng
      const res = await orderAPI.createOrder(orderPayload);

      // 3. Xử lý sau khi thành công
      // Không cần gọi api xóa từng món (removeFromCart) vì Backend đã $pull rồi
      // Chúng ta chỉ cần clear state giỏ hàng cục bộ ở FE để đồng bộ hiển thị
      if (clearCart) clearCart();

      // Lấy ID đơn hàng để hiển thị (Backend trả về mảng orderIds)
      const displayOrderId = res.orderIds
        ? res.orderIds[0]
        : res._id || "ORD-SUCCESS";

      setOrderId(displayOrderId);
      setOrderCompleted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Đặt hàng thất bại.";
      alert(errorMsg);
    } finally {
      setOrderProcessing(false);
    }
  };
  // --- RENDER TRANG SUCCESS ---
  if (orderCompleted) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Mã đơn hàng:{" "}
            <span className="font-bold text-blue-600">{orderId}</span>
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/account/orders")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || loading)
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  // --- RENDER FORM CHECKOUT ---
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. ĐỊA CHỈ - BẢN FIX LỖI HIỂN THỊ */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAddressId === addr._id
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1.5 mr-3 w-4 h-4 text-blue-600"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">
                        {/* Dùng fullName và phone từ log của bạn */}
                        {addr.fullName} | {addr.phone}
                      </p>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                          Mặc định
                        </span>
                      )}
                    </div>

                    {/* Nhãn địa chỉ (Ví dụ: Thời Trang Sara) */}
                    <p className="text-xs font-semibold text-indigo-500 uppercase mt-0.5">
                      {addr.name}
                    </p>

                    {/* Hiển thị trường address duy nhất chứa '12 12 abc abc' */}
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* 2. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" size={20} /> Phương thức
                thanh toán
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "cod",
                    label: "Thanh toán khi nhận hàng (COD)",
                    desc: "Thanh toán tiền mặt khi shipper giao đến.",
                  },
                  {
                    id: "banking",
                    label: "Chuyển khoản ngân hàng",
                    desc: "Quét mã QR VietQR Pro.",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === method.id
                        ? "border-green-600 bg-green-50"
                        : "hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">
                Tổng đơn hàng ({checkoutItems.length} món)
              </h3>

              <div className="max-h-60 overflow-y-auto mb-4 pr-1 divide-y">
                {checkoutItems.map((item) => (
                  <div
                    key={item.productId || item._id || item.id}
                    className="flex justify-between text-sm py-3 first:pt-0"
                  >
                    <div className="flex gap-3">
                      {/* Hiển thị ảnh nhỏ nếu muốn */}
                      <img
                        src={
                          item.thumbnail?.url ||
                          item.thumbnail ||
                          "https://via.placeholder.com/50"
                        }
                        alt=""
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div>
                        <p
                          className="font-medium text-gray-800 line-clamp-2 w-32"
                          title={item.name}
                        >
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {((item.price || 0) * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{checkoutTotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">
                    {checkoutTotal.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderProcessing}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  orderProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }`}
              >
                {orderProcessing ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
              </button>

              <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-blue-800 flex items-start gap-2">
                <Truck size={16} className="mt-0.5 shrink-0" />
                <span>
                  Miễn phí vận chuyển cho đơn hàng này. Giao hàng dự kiến 3-5
                  ngày.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
