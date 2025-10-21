import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
