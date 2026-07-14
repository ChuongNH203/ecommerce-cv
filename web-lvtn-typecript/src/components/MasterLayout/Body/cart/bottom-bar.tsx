import Item from "antd/es/list/Item";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:3000";

interface BottomBarProps {
  allChecked: boolean;
  onCheckAll: () => void;
  onDeleteSelected: () => void;
  onSaveToWishlist: () => void;
  totalSelected: number;
  totalPrice: number;
  checkedItems: string[]; // Thêm checkedItems
  cartItems: any[]; // Thêm cartItems
  isSinglePurchaseMode: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({
  allChecked,
  onCheckAll,
  onDeleteSelected,
  onSaveToWishlist,
  totalSelected,
  totalPrice,
  checkedItems,
  cartItems,
  isSinglePurchaseMode,
}) => {
  const navigate = useNavigate();

const handleCheckout = () => {
  const selectedItems = cartItems
    .filter(item =>
      checkedItems.includes(`${item.id}-${item.selectedClassify ?? 'none'}`)
    )
    .map(item => ({
      id: item.id,
      name: item.name,
      thumbnail: item.thumbnail?.startsWith("http")
        ? item.thumbnail
        : `${BASE_URL}${item.thumbnail}`,
      price: item.price,
      quantity: item.quantity,
      selectedClassify: item.selectedClassify,
      product_variant_id: item.variant_id,
      stock: item.stock,
    }));
    
    if (isSinglePurchaseMode) {
      const invalidItems = selectedItems.filter(item => item.quantity > 1);

      if (invalidItems.length > 0) {
        const overLimitNames = invalidItems.map(item => `${item.name} - ${item.selectedClassify ?? ''}`).join(', ');
        alert(`❌ Mỗi sản phẩm chỉ được mua 1 cái. Vui lòng giảm lại: ${overLimitNames}`);
        return;
      }
    }
  // ✅ Kiểm tra tồn kho
  const insufficientStockItems = selectedItems.filter(item => item.quantity > item.stock);
  if (insufficientStockItems.length > 0) {
    const outOfStockProducts = insufficientStockItems.map(item => item.name).join(', ');
    const outOfStockVariants = insufficientStockItems.map(item => item.selectedClassify).join(', ');
    alert(`❌ Sản phẩm ${outOfStockProducts} - ${outOfStockVariants} không đủ số lượng trong kho. Vui lòng chọn lại.`);
    return;
  }

  navigate("/payment", { state: { selectedItems } });
};

  return (
    <div className="bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between shadow-md z-50">
      <div className="flex items-center space-x-4">
        {/* Checkbox chọn tất cả */}
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600 rounded"
            checked={allChecked}
            onChange={onCheckAll}
          />
          <span className="ml-2 select-none text-sm">Chọn tất cả ({totalSelected})</span>
        </label>

        <button
          onClick={onSaveToWishlist}
          className="text-sm text-red-600 hover:underline truncate max-w-xs"
        >
          Lưu vào mục Đã thích
        </button>
        <button
          onClick={onDeleteSelected}
          className="text-sm text-gray-500 hover:underline"
        >
          Xóa
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-sm">Tổng cộng ({totalSelected} Sản phẩm):</span>
          <span className="text-xl font-bold text-red-600">
            ₫{totalPrice.toLocaleString("vi-VN")}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-red-600 text-white px-6 py-2 rounded-sm hover:bg-red-700 font-semibold min-w-[120px]"
        >
          Mua hàng
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
