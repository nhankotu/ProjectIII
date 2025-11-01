import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key } from "lucide-react";

const SecurityTab = () => {
  const [changingPassword, setChangingPassword] = useState(false);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Bảo mật tài khoản</h3>

        {/* Change Password */}
        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Đổi mật khẩu</p>
              <p className="text-sm text-gray-600">
                Cập nhật mật khẩu mới cho tài khoản
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setChangingPassword(true)}>
            Đổi mật khẩu
          </Button>
        </div>

        {/* Two Factor Authentication */}
        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Xác thực 2 bước</p>
              <p className="text-sm text-gray-600">
                Bảo vệ tài khoản an toàn hơn
              </p>
            </div>
          </div>
          <Button variant="outline">Bật</Button>
        </div>

        {/* Change Password Modal */}
        {changingPassword && (
          <Card className="mt-4 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Đổi mật khẩu</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Cập nhật</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChangingPassword(false)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
