import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { name: "All Products", path: "/products" },
      { name: "Featured", path: "/featured" },
      { name: "New Arrivals", path: "/new" },
      { name: "Flash Sale", path: "/flash-sale" },
      { name: "Best Sellers", path: "/best-sellers" },
    ],
    Help: [
      { name: "Customer Service", path: "/support" },
      { name: "Shipping Info", path: "/shipping" },
      { name: "Returns & Exchanges", path: "/returns" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact Us", path: "/contact" },
    ],
    About: [
      { name: "Our Story", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
    Account: [
      { name: "My Account", path: "/account" },
      { name: "Order History", path: "/orders" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Newsletter", path: "/newsletter" },
      { name: "Rewards", path: "/rewards" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-white">NTShop</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your one-stop destination for quality products at amazing prices.
              We deliver happiness right to your doorstep.
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-semibold mb-6">We Accept</h4>
          <div className="flex flex-wrap gap-4">
            {["visa", "mastercard", "paypal", "apple-pay", "google-pay"].map(
              (method) => (
                <div
                  key={method}
                  className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  <span className="text-sm font-medium">{method}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            {["facebook", "twitter", "instagram", "youtube", "linkedin"].map(
              (social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social}
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="font-semibold">
                      {social.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </a>
              )
            )}
          </div>

          {/* App Download */}
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.1 12.9h-4.8v-4.8h-2.4v4.8H5.1v2.4h4.8v4.8h2.4v-4.8h4.8z" />
              </svg>
              <span>App Store</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Google Play</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {currentYear} NTShop. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Made with ❤️ for shopping enthusiasts worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
