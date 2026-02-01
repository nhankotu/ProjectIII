import React, { useState, useEffect, useRef } from "react";
import { useCustomerChat } from "../hooks/useCustomerChat";
import { useSocket } from "../../contexts/SocketContext";
import { shopAPI } from "../services/api";
import {
  Send,
  Search,
  Store,
  Image as ImageIcon,
  MoreVertical,
  ShoppingBag,
  Loader,
  X,
} from "lucide-react";

// --- COMPONENT CON: ShopAvatar (Giữ nguyên) ---
const ShopAvatar = ({ userId, className, showOnlineStatus }) => {
  const [logo, setLogo] = useState(null);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const fetchShopLogo = async () => {
      if (!userId) return;
      try {
        const res = await shopAPI.getPublicInfo(userId);
        const data = res.data || res;
        if (data && data.shop) setLogo(data.shop.logo);
      } catch (error) {
        setLogo(null);
      }
    };
    fetchShopLogo();
  }, [userId]);

  const isOnline =
    showOnlineStatus && onlineUsers.some((id) => String(id) === String(userId));

  return (
    <div className="relative shrink-0">
      <img
        src={logo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        className={className}
        alt="Shop Logo"
        onError={(e) => {
          e.target.src =
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        }}
      />
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const CustomerChatPage = () => {
  const {
    conversations,
    currentChat,
    messages,
    loading,
    setCurrentChat,
    sendMessage,
    user,
  } = useCustomerChat();

  const { onlineUsers } = useSocket();
  const [inputText, setInputText] = useState("");

  // 🔥 STATE MỚI CHO ẢNH
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef();
  const fileInputRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, previewImages]);

  // --- XỬ LÝ ẢNH ---
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && selectedFiles.length === 0) return;

    setIsSending(true);
    // 🔥 sendMessage bây giờ sẽ nhận cả text và mảng file
    // Bạn cần cập nhật hàm sendMessage trong useCustomerChat để nhận files
    await sendMessage(inputText, selectedFiles);

    setInputText("");
    setSelectedFiles([]);
    setPreviewImages([]);
    setIsSending(false);
  };

  const getPartnerId = (conversation) => {
    if (!conversation || !conversation.members || !user) return null;
    const partner = conversation.members.find(
      (m) => String(m._id || m) !== String(user._id),
    );
    return partner?._id || partner;
  };

  const getPartnerName = (conversation) => {
    if (!conversation || !conversation.members || !user) return "Shop";
    const partner = conversation.members.find(
      (m) => String(m._id || m) !== String(user._id),
    );
    return partner?.name || partner?.username || "Shop";
  };

  if (!user)
    return (
      <div className="p-10 text-center text-gray-500">
        Vui lòng đăng nhập để tiếp tục.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-140px)] min-h-[500px]">
      <div className="flex h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* === CỘT TRÁI === */}
        <div className="w-1/3 min-w-[300px] border-r border-gray-100 flex flex-col bg-gray-50 h-full">
          <div className="p-4 bg-white border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tin nhắn</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm shop..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setCurrentChat(conv)}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${currentChat?._id === conv._id ? "bg-blue-600 text-white shadow-md" : "hover:bg-white text-gray-700"}`}
              >
                <ShopAvatar
                  userId={getPartnerId(conv)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white bg-white"
                  showOnlineStatus={true}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-bold text-sm truncate ${currentChat?._id === conv._id ? "text-white" : "text-gray-800"}`}
                  >
                    {getPartnerName(conv)}
                  </h4>
                  <p
                    className={`text-xs truncate ${currentChat?._id === conv._id ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {conv.lastMessage?.text ||
                      (conv.lastMessage?.images?.length
                        ? "[Hình ảnh]"
                        : "Bắt đầu trò chuyện")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === CỘT PHẢI === */}
        <div className="flex-1 flex flex-col bg-[#f8f9fa] h-full">
          {currentChat ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <ShopAvatar
                    userId={getPartnerId(currentChat)}
                    className="w-10 h-10 rounded-full border object-cover bg-white"
                    showOnlineStatus={false}
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-1">
                      {getPartnerName(currentChat)}{" "}
                      <Store size={14} className="text-blue-500" />
                    </h3>
                    <p className="text-xs text-gray-400">Shop chính thức</p>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, index) => {
                  const isMe =
                    String(m.sender?._id || m.sender) === String(user._id);
                  return (
                    <div
                      key={index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <ShopAvatar
                          userId={getPartnerId(currentChat)}
                          className="w-8 h-8 rounded-full mr-2 self-end mb-1 object-cover bg-white border"
                          showOnlineStatus={false}
                        />
                      )}
                      <div
                        className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        {/* HIỂN THỊ ẢNH TRONG TIN NHẮN */}
                        {m.images?.length > 0 && (
                          <div
                            className={`flex flex-wrap gap-1 mb-1 ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            {m.images.map((url, i) => {
                              // 🔥 BƯỚC QUAN TRỌNG: Nếu url là null hoặc undefined, bỏ qua không render
                              if (!url) return null;

                              // Kiểm tra định dạng video an toàn
                              const isVideo =
                                (typeof url === "string" &&
                                  url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                                m.type === "video";

                              return isVideo ? (
                                <video
                                  key={i}
                                  src={url}
                                  controls
                                  className="max-w-[200px] rounded-lg border shadow-sm"
                                />
                              ) : (
                                <img
                                  key={i}
                                  src={url}
                                  alt="chat-media"
                                  className="max-w-[180px] rounded-lg border shadow-sm cursor-pointer"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              );
                            })}
                          </div>
                        )}
                        {m.text && (
                          <div
                            className={`p-3 text-sm shadow-sm ${isMe ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none"}`}
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
              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                {/* Preview ảnh trước khi gửi */}
                {previewImages.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative group shrink-0">
                        <img
                          src={src}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                          alt="preview"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-3 bg-gray-50 p-2 rounded-full border border-gray-200"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSending}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isSending}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                  />
                  <button
                    type="submit"
                    disabled={
                      isSending ||
                      (!inputText.trim() && selectedFiles.length === 0)
                    }
                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
                  >
                    {isSending ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag size={64} className="text-gray-200 mb-4" />
              <p>Chọn một Shop để bắt đầu tư vấn mua hàng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerChatPage;
