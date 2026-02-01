import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

const PoliciesSection = forwardRef(({ data, onSave, isSaving }, ref) => {
  const [policies, setPolicies] = useState({
    returnPolicy: "",
    warrantyPolicy: "",
    supportTime: "",
  });

  useEffect(() => {
    setPolicies({
      returnPolicy: data?.returnPolicy || "",
      warrantyPolicy: data?.warrantyPolicy || "",
      supportTime: data?.supportTime || "",
    });
  }, [data]);

  useImperativeHandle(ref, () => ({
    submit: () => policies,
  }));

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">📜 Chính sách cửa hàng</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Đổi trả
      </label>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Chính sách đổi trả"
        value={policies.returnPolicy}
        onChange={(e) =>
          setPolicies({ ...policies, returnPolicy: e.target.value })
        }
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bảo hành
      </label>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Chính sách bảo hành"
        value={policies.warrantyPolicy}
        onChange={(e) =>
          setPolicies({ ...policies, warrantyPolicy: e.target.value })
        }
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Thời gian hỗ trợ
      </label>
      <textarea
        className="w-full border rounded p-2"
        rows={2}
        placeholder="Thời gian hỗ trợ khách hàng"
        value={policies.supportTime}
        onChange={(e) =>
          setPolicies({ ...policies, supportTime: e.target.value })
        }
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

export default PoliciesSection;
