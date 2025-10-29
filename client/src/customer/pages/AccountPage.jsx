import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  ShoppingBag,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";

const AccountPage = () => {
  const { user, logout, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Dữ liệu mẫu cho đăng nhập
  const loginCredentials = {
    email: "nguyenvana@email.com",
    password: "password123",
  };

  // Dữ liệu mẫu cho user (nếu cần cho demo)
  const sampleUser = {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    avatar: "/api/placeholder/100/100",
    addresses: [
      {
        id: 1,
        name: "Nhà riêng",
        phone: "0123456789",
        address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
        isDefault: true,
      },
    ],
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

  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      shipping: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={variants[status]}>
        {status === "completed"
          ? "Hoàn thành"
          : status === "shipping"
          ? "Đang giao"
          : "Đã hủy"}
      </Badge>
    );
  };

  const handleLogin = async () => {
    // Sử dụng hàm login từ useAuth với email và password
    const result = await login(
      loginCredentials.email,
      loginCredentials.password
    );
    if (result.success) {
      console.log("Đăng nhập thành công");
    } else {
      console.error("Đăng nhập thất bại:", result.error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Hiển thị trang đăng nhập nếu chưa đăng nhập

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
              <p className="text-gray-600 mb-6">
                Vui lòng đăng nhập để truy cập trang tài khoản
              </p>

              {/* 👇 CHỈ CẦN NÚT ĐĂNG NHẬP DUY NHẤT */}
              <Button onClick={() => navigate("/login")} className="w-full">
                Đăng nhập
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sử dụng user từ auth context hoặc sampleUser nếu user null
  const currentUser = user || sampleUser;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
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

        <Tabs defaultValue="profile" className="space-y-6">
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

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <Button variant="outline" className="w-full mt-4">
                    Đổi ảnh đại diện
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin cá nhân
                  </h3>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" defaultValue={currentUser.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" defaultValue={currentUser.phone} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={currentUser.email}
                      />
                    </div>
                    <Button type="submit">Cập nhật thông tin</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold">#{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          <p className="text-sm">{order.items} sản phẩm</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.total}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
                  <Button>Thêm địa chỉ mới</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentUser.addresses?.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          {address.isDefault && <Badge>Mặc định</Badge>}
                          <Button variant="ghost" size="sm">
                            Sửa
                          </Button>
                        </div>
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm mt-2">{address.address}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Bảo mật tài khoản</h3>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Đổi mật khẩu</p>
                    <p className="text-sm text-gray-600">
                      Cập nhật mật khẩu mới cho tài khoản
                    </p>
                  </div>
                  <Button variant="outline">Đổi mật khẩu</Button>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Xác thực 2 bước</p>
                    <p className="text-sm text-gray-600">
                      Bảo vệ tài khoản an toàn hơn
                    </p>
                  </div>
                  <Button variant="outline">Bật</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cài đặt</h3>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Thông báo</p>
                      <p className="text-sm text-gray-600">
                        Nhận thông báo về đơn hàng và khuyến mãi
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Cài đặt</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Phương thức thanh toán</p>
                      <p className="text-sm text-gray-600">
                        Quản lý thẻ và ví điện tử
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Quản lý</Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50 w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
