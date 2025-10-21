import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Shield,
  Truck,
  HeadphonesIcon,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Về YourShop",
      links: [
        { name: "Giới thiệu", href: "/about" },
        { name: "Chính sách bảo mật", href: "/privacy" },
        { name: "Điều khoản sử dụng", href: "/terms" },
      ],
    },
    {
      title: "Dịch vụ khách hàng",
      links: [
        { name: "Trung tâm hỗ trợ", href: "/help" },
        { name: "Hướng dẫn mua hàng", href: "/shopping-guide" },
        { name: "Chính sách đổi trả", href: "/return-policy" },
        { name: "Chính sách vận chuyển", href: "/shipping-policy" },
      ],
    },
    {
      title: "Liên hệ",
      links: [
        { name: "Hotline: 1900 1234", href: "tel:19001234" },
        {
          name: "Email: support@yourshop.com",
          href: "mailto:support@yourshop.com",
        },
        { name: "Địa chỉ: 123 Trần Duy Hưng, Hà Nội", href: "#" },
      ],
    },
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng từ 300K",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bảo hành chính hãng",
      description: "Sản phẩm chất lượng",
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: "Hỗ trợ 24/7",
      description: "1900 1234",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="text-blue-400">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold">YourShop</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Mang đến trải nghiệm mua sắm trực tuyến tốt nhất với hàng ngàn sản
              phẩm chất lượng.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} YourShop. Tất cả các quyền được bảo lưu.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Phương thức thanh toán:</span>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded px-2 py-1 text-xs font-semibold">
                  COD
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-semibold">
                  VISA
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-semibold">
                  MOMO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
