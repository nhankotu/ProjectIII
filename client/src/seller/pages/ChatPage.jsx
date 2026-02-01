import React, { useState, useEffect, useRef } from "react";
import { useSellerChat } from "../hooks/useSellerChat";
import { useSocket } from "../../contexts/SocketContext";
import {
  Send,
  Search,
  User,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Loader,
  X,
} from "lucide-react";
import apiClient from "../services/apiClient";

const ChatPage = () => {
  const {
    conversations,
    currentChat,
    setCurrentChat,
    messages,
    sendMessage, // Vẫn dùng để cập nhật UI/Socket
    loading,
    user,
  } = useSellerChat();

  const { onlineUsers } = useSocket();
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSending, setIsSending] = useState(false); // Đổi tên cho đúng ý nghĩa

  const scrollRef = useRef();
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, previewImages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 🔥 HÀM GỬI TỔNG HỢP (GIỐNG ĐĂNG SẢN PHẨM)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && selectedFiles.length === 0) return;

    // Chỉ cần gọi hàm này, Hook sẽ lo hết việc Upload và Socket
    await sendMessage(inputText, selectedFiles);

    // Dọn dẹp UI sau khi gửi
    setInputText("");
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  const handleImageClick = () => fileInputRef.current.click();

  const getCustomerInfo = (conversation) => {
    if (!user || !conversation || !conversation.members) return {};
    return conversation.members.find((m) => m?._id !== user?._id) || {};
  };

  const checkOnline = (userId) => {
    if (!userId || !onlineUsers) return false;
    return onlineUsers.some((id) => String(id) === String(userId));
  };

  if (!user)
    return (
      <div className="p-10 text-center">
        <Loader className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* CỘT TRÁI */}
      <div className="w-1/3 min-w-[320px] border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Tin nhắn</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations?.map((c) => {
            const customer = getCustomerInfo(c);
            return (
              <div
                key={c._id}
                onClick={() => setCurrentChat(c)}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${currentChat?._id === c._id ? "bg-blue-50" : ""}`}
              >
                <div className="relative">
                  <img
                    src={customer?.avatar || "https://placehold.co/100"}
                    className="w-12 h-12 rounded-full border object-cover"
                    alt=""
                  />
                  {checkOnline(customer?._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {customer?.name || "Khách hàng"}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {c.lastMessage?.text || "[Hình ảnh/Video]"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="flex-1 flex flex-col bg-white">
        {currentChat ? (
          <>
            <div className="p-4 border-b flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={
                    getCustomerInfo(currentChat)?.avatar ||
                    "https://placehold.co/100"
                  }
                  className="w-10 h-10 rounded-full border object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {getCustomerInfo(currentChat)?.name || "Khách hàng"}
                  </h3>
                  <span
                    className={`text-xs ${checkOnline(getCustomerInfo(currentChat)?._id) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {checkOnline(getCustomerInfo(currentChat)?._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#f0f2f5] space-y-4">
              {messages?.map((m, index) => {
                const isMe = (m.sender?._id || m.sender) === user?._id;
                return (
                  <div
                    key={index}
                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
                    >
                      {m.images?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {m.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              className="max-w-[200px] rounded-lg border cursor-pointer"
                              onClick={() => window.open(img, "_blank")}
                              alt=""
                            />
                          ))}
                        </div>
                      )}
                      {m.text && (
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"}`}
                        >
                          {m.text}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              {previewImages.length > 0 && (
                <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative shrink-0">
                      <img
                        src={src}
                        className="w-20 h-20 object-cover rounded-lg border"
                        alt=""
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={isSending}
                  className="p-2 text-gray-500 hover:text-blue-600"
                >
                  <ImageIcon size={20} />
                </button>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                  placeholder="Nhập tin nhắn..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={
                    isSending ||
                    (!inputText.trim() && selectedFiles.length === 0)
                  }
                  className="p-2 bg-blue-600 text-white rounded-full"
                >
                  {isSending ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <User size={64} className="text-gray-300" />
            <p className="text-gray-500 mt-4">
              Chọn khách hàng để bắt đầu chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
