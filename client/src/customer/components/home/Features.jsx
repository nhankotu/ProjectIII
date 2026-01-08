import { Truck, Shield, Clock, Award } from "lucide-react";

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureItem
          icon={<Truck size={32} />}
          title="Miễn phí vận chuyển"
          desc="Đơn hàng từ 300.000đ"
        />
        <FeatureItem
          icon={<Shield size={32} />}
          title="Bảo hành chính hãng"
          desc="12 tháng toàn quốc"
        />
        <FeatureItem
          icon={<Clock size={32} />}
          title="Hỗ trợ 24/7"
          desc="Hotline: 1900 1234"
        />
        <FeatureItem
          icon={<Award size={32} />}
          title="Chất lượng đảm bảo"
          desc="Cam kết chính hãng"
        />
      </div>
    </section>
  );
};

export default Features;
