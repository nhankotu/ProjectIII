import React from "react";
import { ClipboardList } from "lucide-react";

const GeneralInfo = ({ product }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
      <ClipboardList size={20} className="text-blue-500" /> Mô tả chi tiết
    </h3>
    <div
      className="prose max-w-none text-gray-600 text-sm"
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
    <hr className="my-6" />
    <h3 className="font-bold text-gray-800 mb-4">Thông số kỹ thuật</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {product.specifications?.map((spec, index) => (
        <div
          key={index}
          className="flex justify-between p-3 bg-gray-50 rounded-lg text-xs"
        >
          <span className="text-gray-500">{spec.name}</span>
          <span className="font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GeneralInfo;
