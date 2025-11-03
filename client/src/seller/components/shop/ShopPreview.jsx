import React from "react";

const ShopPreview = ({ shopData }) => {
  const {
    basicInfo = {},
    policies = {},
    shipping = {},
    contact = {},
    seo = {},
  } = shopData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Xem trước cửa hàng</h3>

      {/* Shop Header */}
      <div className="border rounded-lg overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 bg-gray-200 relative">
          {basicInfo.shopBanner ? (
            <img
              src={basicInfo.shopBanner}
              alt="Shop banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Banner cửa hàng
              </span>
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="p-4">
          <div className="flex items-start space-x-4">
            {/* Logo - ĐÃ SỬA KHOẢNG CÁCH VÀ HIỆU ỨNG */}
            <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg -mt-12 bg-white relative z-10">
              {basicInfo.shopLogo ? (
                <img
                  src={basicInfo.shopLogo}
                  alt="Shop logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">
                    LOGO
                  </span>
                </div>
              )}
            </div>
            {/* Shop Details */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {basicInfo.shopName || "Tên cửa hàng"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {basicInfo.category || "Danh mục"} •
                {basicInfo.establishedYear
                  ? ` Thành lập ${basicInfo.establishedYear}`
                  : ""}
              </p>

              {/* Rating & Followers */}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-600">4.8 (1.2k)</span>
                </div>
                <div className="text-sm text-gray-600">👥 5.4k followers</div>
                <div className="text-sm text-gray-600">
                  📍{" "}
                  {contact.address
                    ? contact.address.split(",")[0]
                    : "Đang cập nhật"}
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              Theo dõi
            </button>
          </div>

          {/* Description */}
          {basicInfo.description && (
            <div className="mt-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {basicInfo.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shop Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Shipping */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">🚚</span>
            <span className="font-semibold text-sm">Vận chuyển</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              • {shipping.nationwide ? "Giao toàn quốc" : "Khu vực giới hạn"}
            </div>
            {shipping.freeShippingThreshold && (
              <div>
                • Free ship đơn {formatCurrency(shipping.freeShippingThreshold)}
                +
              </div>
            )}
            {shipping.fixedShippingFee && (
              <div>• Phí ship: {formatCurrency(shipping.fixedShippingFee)}</div>
            )}
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">↩️</span>
            <span className="font-semibold text-sm">Đổi trả</span>
          </div>
          <div className="text-xs text-gray-600">
            {policies.returnPolicy ? (
              <div className="line-clamp-3">{policies.returnPolicy}</div>
            ) : (
              "Chính sách đổi trả sẽ hiển thị tại đây"
            )}
          </div>
        </div>

        {/* Support */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-600">💬</span>
            <span className="font-semibold text-sm">Hỗ trợ</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {contact.phone && <div>• 📞 {contact.phone}</div>}
            {policies.supportTime && <div>• 🕒 {policies.supportTime}</div>}
            {policies.processingTime && (
              <div>• ⚡ {policies.processingTime}</div>
            )}
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Liên hệ với chúng tôi</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          {contact.phone && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📞</span>
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📧</span>
              <span>{contact.email}</span>
            </div>
          )}
          {contact.socialMedia?.facebook && (
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">📘</span>
              <span>fb.com/{contact.socialMedia.facebook}</span>
            </div>
          )}
          {contact.socialMedia?.instagram && (
            <div className="flex items-center space-x-2">
              <span className="text-pink-500">📷</span>
              <span>@{contact.socialMedia.instagram}</span>
            </div>
          )}
        </div>
      </div>

      {/* SEO Preview */}
      {seo.metaTitle && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border">
          <h4 className="font-semibold text-sm mb-2">Xem trước trên Google</h4>
          <div className="space-y-1 text-sm">
            <div className="text-blue-600 font-medium hover:underline cursor-pointer">
              {seo.metaTitle}
            </div>
            <div className="text-green-600 text-xs">
              {seo.customDomain || "your-shop.shopee.vn"} › ...
            </div>
            <div className="text-gray-600 text-xs">{seo.metaDescription}</div>
          </div>
        </div>
      )}

      {/* Preview Note */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Đây là giao diện xem trước. Khách hàng sẽ thấy cửa hàng của bạn như
          thế này.
        </p>
      </div>
    </div>
  );
};

export default ShopPreview;
