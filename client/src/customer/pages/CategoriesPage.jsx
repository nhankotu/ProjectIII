import React, { useState, useEffect } from "react";
import { productAPI as productService } from "../services/api";
import CategoryNode from "../components/product/CategoryNode";
import { FolderTree } from "lucide-react";
const CategoriesPage = () => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm chuyển đổi mảng phẳng thành cấu trúc cây
  const buildTree = (items) => {
    const map = {};
    const roots = [];

    // Bước 1: Khởi tạo bản đồ tham chiếu và chuẩn bị mảng children
    items.forEach((item) => {
      map[item._id] = { ...item, children: [] };
    });

    // Bước 2: Duyệt lại để móc nối Cha - Con
    items.forEach((item) => {
      const node = map[item._id];
      if (item.parentId && map[item.parentId]) {
        // Nếu có parentId và cha tồn tại trong mảng, đẩy vào con của cha
        map[item.parentId].children.push(node);
      } else {
        // Nếu không có parentId (null), đây là danh mục gốc
        roots.push(node);
      }
    });

    return roots;
  };

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const res = await productService.getCategories();

        // Lấy dữ liệu từ res.data và chuyển thành cây
        const rawData = res.data || [];
        const structuredTree = buildTree(rawData);

        setTreeData(structuredTree);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">
        Đang tạo sơ đồ danh mục...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header hiện đại */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-blue-600 font-black text-ms uppercase tracking-[0.2em] mb-3 block">
              Danh mục sản phẩm
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Khám phá thế giới <br /> mua sắm theo cách mới.
            </h1>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black text-blue-600">
                {treeData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FolderTree size={24} />
            </div>
          </div>
        </div>

        {/* Grid danh mục gốc */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treeData.map((rootNode) => (
            <CategoryNode key={rootNode._id} node={rootNode} />
          ))}
        </div>

        {treeData.length === 0 && !loading && (
          <div className="py-20 text-center text-gray-300 italic">
            Chưa có dữ liệu danh mục...
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
