const ShopPreview = ({ data }) => {
  const { basicInfo, policies, shipping, contact } = data;

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold">👁️ Xem trước cửa hàng</h2>

      {basicInfo?.banner && (
        <img
          src={basicInfo.banner}
          alt="Banner"
          className="w-full h-48 object-cover rounded"
        />
      )}

      <div className="flex items-center gap-4">
        {basicInfo?.logo && (
          <img
            src={basicInfo.logo}
            alt="Logo"
            className="w-20 h-20 rounded-full"
          />
        )}

        <div>
          <h3 className="text-lg font-bold">{basicInfo?.name}</h3>
          <p className="text-gray-600">{basicInfo?.description}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold">📜 Chính sách</h4>
        <p>{policies?.returnPolicy}</p>
      </div>

      <div>
        <h4 className="font-semibold">🚚 Vận chuyển</h4>
        <p>{shipping?.estimatedTime}</p>
      </div>

      <div>
        <h4 className="font-semibold">📞 Liên hệ</h4>
        <p>{contact?.phone}</p>
        <p>{contact?.address}</p>
      </div>
    </div>
  );
};

export default ShopPreview;
