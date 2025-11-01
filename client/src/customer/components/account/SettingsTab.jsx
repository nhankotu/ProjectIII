import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, LogOut } from "lucide-react";

const SettingsTab = ({ onLogout }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Cài đặt</h3>

        {/* Notifications */}
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

        {/* Payment Methods */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <div>
              <p className="font-medium">Phương thức thanh toán</p>
              <p className="text-sm text-gray-600">Quản lý thẻ và ví điện tử</p>
            </div>
          </div>
          <Button variant="outline">Quản lý</Button>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
