import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";

const SupportPage = () => {
  const supportTopics = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Gọi hỗ trợ",
      description: "1900 1234",
      action: "Gọi ngay",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat trực tuyến",
      description: "Hỗ trợ 24/7",
      action: "Bắt đầu chat",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email hỗ trợ",
      description: "support@yourshop.com",
      action: "Gửi email",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Trung tâm hỗ trợ</h1>
        <p className="text-gray-600 mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {supportTopics.map((topic, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${topic.color}`}
                >
                  {topic.icon}
                </div>
                <h3 className="font-semibold mb-2">{topic.title}</h3>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <Button variant="outline">{topic.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Gửi yêu cầu hỗ trợ</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Họ và tên" required />
                <Input type="email" placeholder="Email" required />
              </div>
              <Input placeholder="Tiêu đề" required />
              <Textarea
                placeholder="Mô tả chi tiết vấn đề của bạn..."
                rows={5}
                required
              />
              <Button type="submit" className="w-full md:w-auto">
                Gửi yêu cầu
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {[
              "Làm thế nào để đổi trả sản phẩm?",
              "Thời gian giao hàng bao lâu?",
              "Phương thức thanh toán nào được chấp nhận?",
              "Làm sao để theo dõi đơn hàng?",
            ].map((question, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="font-medium">{question}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
