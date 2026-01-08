import React from "react";
import PropTypes from "prop-types"; // 1. Import PropTypes
import Header from "./Header";
import Footer from "./Footer";

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content: flex-1 giúp nó đẩy Footer xuống đáy */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// 2. Validate props để tránh lỗi ESLint
CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomerLayout;
