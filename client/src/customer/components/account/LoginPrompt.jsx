import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập để truy cập trang tài khoản
            </p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPrompt;
