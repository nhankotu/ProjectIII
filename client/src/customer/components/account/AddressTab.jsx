import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const AddressTab = ({ addresses = [] }) => {
  // Thêm default value cho addresses
  const [showAddForm, setShowAddForm] = useState(false);

  // Xử lý khi addresses là null hoặc undefined
  const addressList = addresses || [];

  const handleAddAddress = () => {
    // TODO: Xử lý thêm địa chỉ
    console.log("Thêm địa chỉ mới");
    setShowAddForm(false);
  };

  const handleEditAddress = (addressId) => {
    // TODO: Xử lý sửa địa chỉ
    console.log("Sửa địa chỉ:", addressId);
  };

  const handleDeleteAddress = (addressId) => {
    // TODO: Xử lý xóa địa chỉ
    console.log("Xóa địa chỉ:", addressId);
  };

  const handleSetDefault = (addressId) => {
    // TODO: Xử lý đặt làm mặc định
    console.log("Đặt làm mặc định:", addressId);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>

        {/* Form thêm địa chỉ mới */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-dashed border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-blue-800">
                Thêm địa chỉ mới
              </h4>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm font-medium">Tên địa chỉ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhà riêng, Công ty..."
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Địa chỉ</label>
                  <textarea
                    placeholder="Số nhà, đường, phường, quận, thành phố..."
                    className="w-full p-2 border rounded mt-1 h-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="default-address" />
                  <label htmlFor="default-address" className="text-sm">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAddress}>
                  Lưu địa chỉ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danh sách địa chỉ */}
        <div className="grid md:grid-cols-2 gap-4">
          {addressList.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <div className="text-gray-400 mb-2">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 mb-4">Chưa có địa chỉ nào được lưu</p>
              <Button onClick={() => setShowAddForm(true)}>
                Thêm địa chỉ đầu tiên
              </Button>
            </div>
          ) : (
            addressList.map((address) => (
              <Card
                key={address.id}
                className="relative hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      {address.isDefault && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAddress(address.id)}
                      >
                        Sửa
                      </Button>
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-lg mb-1">{address.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{address.phone}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {address.address}
                  </p>

                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Đặt làm mặc định
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Thông báo khi có nhiều địa chỉ */}
        {addressList.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Bạn có thể thêm tối đa 5 địa chỉ giao hàng. Địa chỉ mặc định sẽ
              được sử dụng cho các đơn hàng mới.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressTab;
