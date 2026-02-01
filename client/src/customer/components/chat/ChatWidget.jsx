import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { useAuth } from "../../../contexts/AuthContext";
import { chatAPI, shopAPI } from "../../services/api"; // 🔥 Thêm shopAPI vào đây
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Image as ImageIcon,
  ChevronLeft,
  Store,
  ShoppingBag,
  Loader,
} from "lucide-react";

// --- COMPONENT CON: ShopAvatar (Giúp lấy logo xịn từ bảng Shop) ---
const ShopAvatar = ({ userId, className, showOnlineStatus }) => {
  const [logo, setLogo] = useState(null);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const fetchShopLogo = async () => {
      if (!userId) return;
      try {
        const res = await shopAPI.getPublicInfo(userId);
        const data = res.data || res;
        // Lấy trường logo từ dữ liệu trả về (Xử lý cả string và object)
        const logoUrl = data?.shop?.logo?.url || data?.shop?.logo;
        setLogo(logoUrl);
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
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
  );
};

const ChatWidget = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [attachedProduct, setAttachedProduct] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef();
  const fileInputRef = useRef(null);

  // Helper: Tìm ID đối phương
  const getPartnerId = (conversation) => {
    if (!conversation || !conversation.members) return null;
    const partner = conversation.members.find(
      (m) => String(m._id || m) !== String(user._id),
    );
    return partner?._id || partner;
  };

  // Helper: Lấy tên đối phương
  const getPartnerName = (conversation) => {
    if (!conversation || !conversation.members) return "Shop";
    const partner = conversation.members.find(
      (m) => String(m._id || m) !== String(user._id),
    );
    return partner?.name || partner?.username || "Cửa hàng";
  };

  useEffect(() => {
    const handleOpenChat = (event) => {
      const data = event.detail;
      setIsOpen(true);
      if (data.product) {
        setCurrentChat(data.conversation);
        setAttachedProduct(data.product);
      } else {
        setCurrentChat(data);
        setAttachedProduct(null);
      }
    };
    window.addEventListener("OPEN_CHAT_WIDGET", handleOpenChat);
    return () => window.removeEventListener("OPEN_CHAT_WIDGET", handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && user) fetchConversations();
  }, [isOpen, user]);

  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getUserConversations();
      setConversations(res.data || []);
    } catch (err) {
      console.error("Lỗi tải inbox:", err);
    }
  };

  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const res = await chatAPI.getMessages(currentChat._id);
          setMessages(res.data || []);
        } catch (err) {
          console.error("Lỗi tải tin nhắn:", err);
        }
      };
      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data) => {
      if (currentChat && data.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, data]);
      }
      fetchConversations();
    };
    socket.on("getMessage", handleReceiveMessage);
    return () => socket.off("getMessage", handleReceiveMessage);
  }, [socket, currentChat]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, previewImages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && selectedFiles.length === 0 && !attachedProduct)
      return;

    const receiverId = getPartnerId(currentChat);

    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append("conversationId", currentChat._id);
      formData.append("receiverId", receiverId);
      if (inputText.trim()) formData.append("text", inputText);
      if (attachedProduct) formData.append("productId", attachedProduct._id);

      selectedFiles.forEach((file) => formData.append("images", file));

      const res = await chatAPI.sendMessage(formData);
      const savedMsg = res.data;

      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        ...savedMsg,
      });

      setMessages((prev) => [...prev, savedMsg]);
      setInputText("");
      setSelectedFiles([]);
      setPreviewImages([]);
      setAttachedProduct(null);
    } catch (err) {
      console.error("Gửi tin thất bại:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white w-[380px] h-[550px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* HEADER */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between shrink-0">
            {currentChat ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentChat(null)}
                  className="hover:bg-white/20 p-1 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {/* 🔥 Dùng ShopAvatar để lấy logo cửa hàng */}
                  <ShopAvatar
                    userId={getPartnerId(currentChat)}
                    className="w-9 h-9 rounded-full object-cover border border-white bg-white"
                    showOnlineStatus={true}
                  />
                  <div className="text-sm">
                    <div className="font-bold truncate max-w-[150px]">
                      {getPartnerName(currentChat)}
                    </div>
                    <div className="text-[10px] text-blue-100 flex items-center gap-1">
                      <Store size={10} /> Cửa hàng
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageCircle size={22} />{" "}
                <span className="font-bold">Tin nhắn</span>
              </div>
            )}
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {currentChat ? (
              <div className="flex flex-col gap-3">
                {messages.map((m, i) => {
                  const isMe =
                    String(m.sender?._id || m.sender) === String(user._id);
                  return (
                    <div
                      key={i}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <ShopAvatar
                          userId={getPartnerId(currentChat)}
                          className="w-7 h-7 rounded-full mr-1.5 self-end mb-1 border shadow-sm"
                          showOnlineStatus={false}
                        />
                      )}
                      <div
                        className={`max-w-[85%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        {m.images?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1 justify-end">
                            {m.images.map((url, idx) => {
                              if (!url) return null;
                              const isVideo =
                                url.match(/\.(mp4|webm|ogg|mov)$/i) ||
                                m.type === "video";
                              return isVideo ? (
                                <video
                                  key={idx}
                                  src={url}
                                  controls
                                  className="max-w-[200px] rounded-lg border"
                                />
                              ) : (
                                <img
                                  key={idx}
                                  src={url}
                                  className="max-w-[150px] rounded-lg border shadow-sm cursor-pointer"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              );
                            })}
                          </div>
                        )}
                        {m.type === "product" && m.product && (
                          <div
                            className={`mb-1 p-2 rounded-xl flex gap-2 items-center border ${isMe ? "bg-blue-700 border-blue-800" : "bg-white"}`}
                          >
                            <img
                              src={
                                m.product.thumbnail?.url || m.product.thumbnail
                              }
                              className="w-10 h-10 rounded object-cover bg-white"
                            />
                            <div className="text-[10px]">
                              <p
                                className={`font-bold truncate max-w-[120px] ${isMe ? "text-white" : ""}`}
                              >
                                {m.product.name}
                              </p>
                              <p className="text-yellow-400 font-bold">
                                {m.product.price?.toLocaleString()}đ
                              </p>
                            </div>
                          </div>
                        )}
                        {m.text && (
                          <div
                            className={`p-2.5 text-sm rounded-2xl shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none"}`}
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
            ) : (
              /* DANH SÁCH HỘI THOẠI (INBOX) */
              <div className="flex flex-col gap-2">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => setCurrentChat(conv)}
                    className="p-3 bg-white rounded-xl border hover:shadow-md cursor-pointer flex items-center gap-3 transition-all"
                  >
                    {/* 🔥 Dùng ShopAvatar cho danh sách Inbox */}
                    <ShopAvatar
                      userId={getPartnerId(conv)}
                      className="w-12 h-12 rounded-full object-cover border"
                      showOnlineStatus={true}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm truncate">
                          {getPartnerName(conv)}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage?.text ||
                          (conv.lastMessage?.images?.length
                            ? "[Hình ảnh]"
                            : "Bắt đầu chat")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {currentChat && (
            <div className="p-3 bg-white border-t">
              {/* Preview ảnh/sản phẩm gửi kèm (giữ nguyên logic của bạn) */}
              {previewImages.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative group shrink-0">
                      <img
                        src={src}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {attachedProduct && (
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg mb-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        attachedProduct.thumbnail?.url ||
                        attachedProduct.thumbnail
                      }
                      className="w-8 h-8 rounded border bg-white"
                    />
                    <span className="font-medium text-blue-800 truncate max-w-[150px]">
                      {attachedProduct.name}
                    </span>
                  </div>
                  <button onClick={() => setAttachedProduct(null)}>
                    <X size={14} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <ImageIcon size={20} />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
                >
                  {isSending ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatWidget;
