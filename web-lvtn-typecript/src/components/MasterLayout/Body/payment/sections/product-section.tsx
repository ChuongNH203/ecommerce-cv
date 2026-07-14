import React from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = "http://localhost:3000";

// Định nghĩa kiểu cho đối tượng sản phẩm
interface Product {
  id: number;
  product_variant_id: number;
  name: string;
  selectedClassify?: string;
  thumbnail: string;
  price: number;
  quantity: number; // Số lượng sản phẩm
}

interface ProductDetailsSectionProps {
  onTotalPriceChange: (totalPrice: number) => void;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ onTotalPriceChange }) => {
  // Sử dụng useLocation để lấy dữ liệu sản phẩm đã chọn
  const { state } = useLocation();
  const selectedItems = state?.selectedItems || []; // Dữ liệu sản phẩm đã chọn
  // Tính tổng tiền của tất cả sản phẩm
  const calculateTotalPrice = (): number => {
    return selectedItems.reduce((total: number, item: Product) => total + item.price * item.quantity, 0);
  };

  // Cập nhật tổng tiền khi component render
  React.useEffect(() => {
    const total = calculateTotalPrice();
    onTotalPriceChange(total); // Truyền tổng tiền lên PaymentForm
  }, [selectedItems, onTotalPriceChange]);

  return (
    <div className="pb-4 mb-5 border-b border-gray-200">
      <h3 className="flex text-base font-semibold mb-4">Sản phẩm</h3>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-11 font-bold border-b border-gray-100 pb-2 mb-2 text-sm">
        {/* Empty div for the product name column header */}
        <div></div>
        <div>Đơn giá</div>
        <div>Số lượng</div>
        <div className="text-right">Thành tiền</div>
      </div>

      {/* Loop over the selected items */}
      {selectedItems.length > 0 ? (
        selectedItems.map((item: Product) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center mb-3 text-sm">
            {/* Product Info */}
            <div className="flex items-center">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-12 h-12 mr-3 border border-gray-200 object-cover"
              />
              <div>
                <p className="m-0 w-full">{item.name}</p>
                <p className="mt-1 text-gray-500 text-xs">{item.selectedClassify || "Không có"}</p>
              </div>
            </div>
            {/* Product Price */}
            <div className="text-gray-800 w-30 mr-14 whitespace-nowrap">
              {item.price.toLocaleString("vi-VN")}₫
            </div>
            {/* Quantity */}
            <div className="text-gray-800 w-10">{item.quantity}</div>
            {/* Total Price */}
            <div className="text-right text-gray-800 whitespace-nowrap w-20">
              {(item.price * item.quantity).toLocaleString("vi-VN")}₫
            </div>
          </div>
        ))
      ) : (
        <p>Không có sản phẩm nào được chọn.</p>
      )}
    </div>
  );
};

export default ProductDetailsSection;
