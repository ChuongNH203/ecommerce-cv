import React, { useState, useEffect, useMemo } from 'react';
import VariantRow from './variant-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const VariantList = ({ searchQuery, variants, onDeleted, onUpdated }: { searchQuery: string, variants: any[], onDeleted: () => void, onUpdated: () => void }) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Lọc danh sách hình ảnh theo searchQuery
  const filteredVariants = useMemo(() => {
    return variants.filter(variants =>
      variants.product_id.toString().includes(searchQuery)
    );
  }, [variants, searchQuery]);

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-zinc-100 text-neutral-800 text-sm font-semibold border-b border-zinc-300 text-left">
            <th className="text-center py-3 px-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
            </th>
            <th className="py-3 px-2">Mã biến thể</th>
            <th className="py-3 px-2">Mã sản phẩm</th>
            <th className="py-3 px-2">Tên biến thể</th>
            <th className="py-3 px-2">Màu</th>
            <th className="py-3 px-2">Size</th>
            <th className="py-3 px-2">Tồn kho</th>
            <th className="py-3 px-2">Giá</th>
            <th className="py-3 px-2">SKU</th>
            <th className="py-3 px-2">Khối lượng</th>
            <th className="py-3 px-2">Kích thước (D x R x C)</th>
            <th className="py-3 px-2">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredVariants.length > 0 ? (
            filteredVariants.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                selectAll={selectAll}
                onDeleted={onDeleted}
                onUpdated={onUpdated}
              />
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center py-4 text-gray-500">
                Không có phân loại nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VariantList;
