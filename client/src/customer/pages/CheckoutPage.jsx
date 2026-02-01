import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI, orderAPI } from "../services/api";
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Plus,
  Loader2,
} from "lucide-react";

// =============================================================================
// 1. COMPONENT FORM THÊM ĐỊA CHỈ (Dựa trên code AddressTab của bạn)
// =============================================================================
const QuickAddressForm = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // State chuẩn theo Backend của bạn
  const [formData, setFormData] = useState({
    label: "Nhà riêng",
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const { fullName, phone, province, district, ward, detailAddress } =
      formData;
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !province.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !detailAddress.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Gọi API thêm địa chỉ
      const res = await userAPI.addAddress(formData);
      // Giả sử API trả về list mới hoặc object địa chỉ mới
      onSuccess(res.data || res);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi khi lưu địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-4 animate-in fade-in zoom-in-95">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus size={18} /> Thêm địa chỉ giao hàng mới
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Loại địa chỉ */}
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="label"
              value="Nhà riêng"
              checked={formData.label === "Nhà riêng"}
              onChange={handleInputChange}
              className="text-blue-600"
            />
            <span className="text-sm">Nhà riêng</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="label"
              value="Văn phòng"
              checked={formData.label === "Văn phòng"}
              onChange={handleInputChange}
              className="text-blue-600"
            />
            <span className="text-sm">Văn phòng</span>
          </label>
        </div>

        {/* Tên & SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Họ và tên"
            className="input-field"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className="input-field"
          />
        </div>

        {/* Địa giới hành chính */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            placeholder="Tỉnh/Thành phố"
            className="input-field"
          />
          <input
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            placeholder="Quận/Huyện"
            className="input-field"
          />
          <input
            name="ward"
            value={formData.ward}
            onChange={handleInputChange}
            placeholder="Phường/Xã"
            className="input-field"
          />
        </div>

        {/* Chi tiết */}
        <input
          name="detailAddress"
          value={formData.detailAddress}
          onChange={handleInputChange}
          placeholder="Số nhà, tên đường..."
          className="input-field w-full"
        />

        {/* Mặc định */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="rounded text-blue-600"
          />
          Đặt làm địa chỉ mặc định
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />} Hoàn
            thành
          </button>
        </div>
      </form>

      {/* CSS Inline nhỏ cho input đẹp */}
      <style>{`
        .input-field { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; font-size: 14px; }
        .input-field:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
      `}</style>
    </div>
  );
};

// =============================================================================
// 2. CHECKOUT PAGE CHÍNH
// =============================================================================
const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeFromCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const checkoutItems = location.state?.items || [];
  const checkoutTotal = location.state?.total || 0;

  // State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // State bật tắt form thêm địa chỉ
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // --- VALIDATION & REDIRECT ---
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) return navigate("/login?redirect=/checkout");
      if (checkoutItems.length === 0 && !orderCompleted)
        return navigate("/cart");
    }
  }, [isAuthenticated, authLoading, checkoutItems, orderCompleted, navigate]);

  // --- FETCH ADDRESS ---
  const fetchAddress = async () => {
    try {
      const res = await userAPI.getAddresses();
      const list = Array.isArray(res) ? res : res.data || [];
      setAddresses(list);

      // Nếu chưa chọn, auto chọn mặc định hoặc cái đầu tiên
      if (!selectedAddressId && list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr._id);
      }
    } catch (err) {
      console.error("Lỗi lấy địa chỉ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchAddress();
  }, [isAuthenticated]);

  // --- CALLBACK KHI THÊM ĐỊA CHỈ THÀNH CÔNG ---
  const handleAddSuccess = async () => {
    setIsAddingAddress(false);
    // Reload lại danh sách
    try {
      const res = await userAPI.getAddresses();
      const list = Array.isArray(res) ? res : res.data || [];
      setAddresses(list);

      // Tự động chọn địa chỉ mới nhất (thường nằm cuối hoặc đầu tùy sort DB)
      // Ở đây ta chọn cái cuối cùng hoặc cái vừa set default
      if (list.length > 0) {
        // Giả sử cái mới nhất nằm cuối mảng (hoặc bạn có thể sort theo createdAt)
        // Hoặc đơn giản là chọn cái isDefault nếu vừa set
        const newSelected =
          list.find((a) => a.isDefault) || list[list.length - 1];
        setSelectedAddressId(newSelected._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- XỬ LÝ ĐẶT HÀNG ---
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ giao hàng!");

    const selectedAddr = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddr) return;

    try {
      setOrderProcessing(true);
      const orderPayload = {
        items: checkoutItems.map((item) => ({
          product: item.productId || item._id,
          name: item.name,
          thumbnail: item.thumbnail,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        totalAmount: checkoutTotal,
        shippingAddress: {
          fullName: selectedAddr.fullName,
          phone: selectedAddr.phone,
          address: selectedAddr.detailAddress, // Map đúng trường detailAddress
          city: selectedAddr.province, // Map province -> city
          district: selectedAddr.district,
          ward: selectedAddr.ward,
        },
        paymentMethod: paymentMethod.toUpperCase(),
        shippingFee: 0,
      };

      const res = await orderAPI.createOrder(orderPayload);
      checkoutItems.forEach((item) => removeFromCart(item._id));

      const displayOrderId = res.orderIds
        ? res.orderIds[0]
        : res.data?._id || res._id || "SUCCESS";
      setOrderId(displayOrderId);
      setOrderCompleted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(error.response?.data?.message || "Đặt hàng thất bại.");
    } finally {
      setOrderProcessing(false);
    }
  };

  // --- RENDER ---
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Mã đơn hàng:{" "}
            <span className="font-bold text-blue-600">{orderId}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/account/orders")}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tiếp tục mua
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto" /> Đang tải...
      </div>
    );

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. KHU VỰC ĐỊA CHỈ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={20} /> Địa chỉ nhận
                  hàng
                </h2>
                {/* Nút bật form thêm mới */}
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} /> Thêm địa chỉ
                  </button>
                )}
              </div>

              {/* Form Thêm Địa Chỉ (Ẩn/Hiện) */}
              {isAddingAddress ? (
                <QuickAddressForm
                  onCancel={() => setIsAddingAddress(false)}
                  onSuccess={handleAddSuccess}
                />
              ) : (
                /* Danh sách địa chỉ (Chỉ hiện khi KHÔNG thêm mới) */
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-4">
                      Chưa có địa chỉ nào. Hãy thêm mới.
                    </p>
                  ) : (
                    addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "hover:border-gray-300"}`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1.5 mr-3 w-4 h-4 text-blue-600 accent-blue-600"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">
                              {addr.fullName}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">{addr.phone}</span>
                            {/* Label Nhà riêng/Văn phòng */}
                            {addr.label && (
                              <span className="text-[10px] border border-gray-200 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {addr.label}
                              </span>
                            )}
                            {addr.isDefault && (
                              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
                            {addr.province}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
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
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === method.id ? "border-green-600 bg-green-50" : "hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-green-600 accent-green-600"
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

          {/* CỘT PHẢI: TỔNG KẾT */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">
                Đơn hàng ({checkoutItems.length} sản phẩm)
              </h3>
              <div className="max-h-80 overflow-y-auto mb-4 pr-1 divide-y divide-gray-100">
                {checkoutItems.map((item) => (
                  <div
                    key={item.productId || item._id}
                    className="flex gap-3 py-3"
                  >
                    <img
                      src={item.thumbnail || "https://placehold.co/100"}
                      alt=""
                      className="w-14 h-14 shrink-0 border rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800 line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          x{item.quantity}{" "}
                          {item.variant?.options &&
                            `(${Object.values(item.variant.options).join(", ")})`}
                        </p>
                        <span className="font-medium text-sm text-blue-600">
                          {((item.price || 0) * item.quantity).toLocaleString()}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{checkoutTotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">
                    {checkoutTotal.toLocaleString()}đ
                  </span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={orderProcessing || addresses.length === 0}
                className={`w-full mt-6 py-3.5 rounded-lg font-bold text-white shadow-md transition-all flex justify-center items-center gap-2 ${orderProcessing || addresses.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
              >
                {orderProcessing ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
              </button>
              <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800 flex items-start gap-2">
                <Truck size={16} className="mt-0.5 shrink-0" />
                <span>Đổi trả trong 7 ngày.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
