import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/main/Login";
import Register from "./pages/main/Register";
import NotFound from "./pages/main/NotFound";
import UserPage from "./pages/Home/UserPage";
import { CartProvider } from "./components/contexts/CartContext";

// Import Tailwind CSS
import "./style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <CartProvider>
        {/* Thêm flex và min-h-screen ở div ngoài cùng */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header: giữ chiều cao cố định */}
          <header className="h-16 bg-yellow-200 text-black p-4 shadow-md flex items-center justify-center">
            <h1 className="text-xl font-bold text-center">
              Welcome to Our Shop
            </h1>
          </header>

          {/* Main: flex-grow để chiếm phần còn lại, min-height đảm bảo tối thiểu đủ đẩy footer xuống */}
          <main className="flex-grow w-full max-w-full mx-auto flex flex-col">
            <Routes>
              <Route
                path="/login"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route
                path="/home/*"
                element={<Home setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer: chiều cao cố định */}
          <footer className="h-16 bg-gray-800 text-white text-center py-4">
            <p>© 2025 Our Shop - All Rights Reserved</p>
          </footer>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
