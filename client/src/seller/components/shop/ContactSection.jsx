import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

const ContactSection = forwardRef(({ data, onSave, isSaving }, ref) => {
  const [contact, setContact] = useState(data || {});

  useEffect(() => {
    setContact(data || {});
  }, [data]);

  useImperativeHandle(ref, () => ({
    submit: () => contact,
  }));

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">📞 Thông tin liên hệ</h2>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Số điện thoại
      </label>
      <input
        className="w-full border rounded p-2"
        placeholder="Số điện thoại"
        value={contact.phone || ""}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        className="w-full border rounded p-2"
        placeholder="Email"
        value={contact.email || ""}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ghi chú
      </label>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Địa chỉ"
        value={contact.address || ""}
        onChange={(e) => setContact({ ...contact, address: e.target.value })}
      />
      {/* 👇 THÊM NÚT LƯU Ở CUỐI COMPONENT */}
      <div className="flex justify-end pt-4 border-t mt-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2 text-sm font-medium"
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Đang lưu...
            </>
          ) : (
            "💾 Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
});

export default ContactSection;
