import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Settings,
  ShoppingBag,
  MapPin,
  Shield,
  LogOut,
} from "lucide-react";

import ProfileTab from "../components/account/ProfileTab";
import OrdersTab from "../components/account/OrdersTab";
import AddressTab from "../components/account/AddressTab";
import SecurityTab from "../components/account/SecurityTab";
import SettingsTab from "../components/account/SettingsTab";
import LoginPrompt from "../components/account/LoginPrompt";

const API_BASE = import.meta.env.VITE_API_URL;

const AccountPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]); // THÊM STATE CHO ADDRESSES
  const [addressesLoading, setAddressesLoading] = useState(true);

  // Hàm fetch addresses từ API
  const fetchAddresses = async () => {
    console.log("🔄 fetchAddresses called");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/users/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Fetch addresses response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Fetched addresses:", data);
        setAddresses(data);
      } else {
        console.log("❌ Failed to fetch addresses");
        setAddresses([]); // Fallback về mảng rỗng
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]); // Fallback về mảng rỗng
    } finally {
      setAddressesLoading(false);
    }
  };

  // Fetch addresses khi component mount hoặc khi tab address được active
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  // Dữ liệu mẫu tạm thời
  const sampleUser = {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    avatar: "/api/placeholder/100/100",
  };

  const orders = [
    {
      id: "DH001",
      date: "15/01/2024",
      status: "completed",
      total: "12.990.000₫",
      items: 2,
    },
    {
      id: "DH002",
      date: "10/01/2024",
      status: "shipping",
      total: "8.490.000₫",
      items: 1,
    },
    {
      id: "DH003",
      date: "05/01/2024",
      status: "cancelled",
      total: "5.990.000₫",
      items: 1,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Hiển thị trang đăng nhập nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  // Sử dụng user từ auth context hoặc sampleUser nếu user null
  const currentUser = user || sampleUser;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="profile">
            <ProfileTab user={currentUser} />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab orders={orders} />
          </TabsContent>

          <TabsContent value="address">
            {addressesLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải địa chỉ...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AddressTab
                addresses={addresses}
                onAddressUpdate={fetchAddresses} // QUAN TRỌNG: TRUYỀN CALLBACK
              />
            )}
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
