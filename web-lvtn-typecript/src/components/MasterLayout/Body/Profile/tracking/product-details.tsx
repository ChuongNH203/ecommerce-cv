import React from 'react';

const BASE_URL = 'http://localhost:3000';

const ProductDetails: React.FC<{ orderItems: any[], totalAmount: number, shippingMethod: string, discountAmount: number, paymentMethod: string,  paymentStatus: string }> = 
({ orderItems, totalAmount,shippingMethod, discountAmount, paymentMethod, paymentStatus }) => {
  const formatCurrency = (value: number | null | undefined) => {
    return value ? value.toLocaleString() : '0';
  };

  const getShippingFee = (method: string) => {
    if (method === 'standard') {
      return 20000; 
    } else if (method === 'express') {
      return 50000;
    }
    return 0; 
  };

    // Hàm hiển thị trạng thái thanh toán
  const getPaymentStatusText = (status: string) => {
    if (status === 'Success') {
      return 'Đã thanh toán';
    } else if (status === 'Pending') {
      return 'Đang chờ thanh toán';
    }
    return 'Chưa có thông tin';
  };

  const shippingFee = getShippingFee(shippingMethod);
console.log("trangtahi",paymentStatus)
  return (
    <div className="bg-white p-4 shadow-sm rounded-lg mt-4">
      <div className="flex items-center mb-4">
        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">Mall</span>
        <span className="font-semibold text-gray-800 ml-2">Belo Store</span>
      </div>

      {orderItems.map((item) => {
        // Lấy thông tin từ item và product liên quan
        const product = item.product_variant.Product;
        const variant = item.product_variant;
        const imageUrl = product?.images?.[0]?.image_url || '/placeholder.png'; // Lấy ảnh sản phẩm nếu có
        const productName = product?.name || 'Tên sản phẩm';
        const variantName = variant?.variant_name || 'Không có phân loại';

        return (
          <div key={item.id} className="flex items-center mb-4">
            <img src={`${BASE_URL}${imageUrl}`} alt="Product" className="w-20 h-20 object-cover mr-4 rounded-md" />
            <div className="flex-1">
              <div className="text-gray-800 font-semibold">{productName}</div>
              <div className="text-gray-600 text-sm">Phân loại hàng: {variantName}</div>
              <div className="text-gray-600 text-sm">x{item.quantity}</div>
            </div>
            <div className="text-gray-800 font-semibold">₫{formatCurrency(item.price)}</div>
          </div>
        );
      })}

      <hr className="my-4 border-gray-200" />

      {/* Tổng tiền hàng, phí vận chuyển, giảm giá, thành tiền */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-700">Tổng tiền hàng</div>
        <div className="text-gray-800 font-semibold">
          ₫{formatCurrency(orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0))}
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-700">Phí vận chuyển</div>
        <div className="text-gray-800">₫{formatCurrency(shippingFee)}</div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-700 flex items-center">Voucher từ shop </div>
        <div className="text-green-600">-₫{formatCurrency(discountAmount)}</div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-700 font-bold">Thành tiền</div>
        <div className="text-red-500 text-xl font-bold">
          ₫ {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>Phương thức Thanh toán</div>
        <div>
          {paymentMethod === 'Momo' ? 'Thanh toán qua MoMo' : 'Thanh toán khi nhận hàng'}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
