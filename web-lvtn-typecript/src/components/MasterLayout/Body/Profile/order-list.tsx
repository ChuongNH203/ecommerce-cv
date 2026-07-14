import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../../../types/order';

const BASE_URL = 'http://localhost:3000';
const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
};
const statusStyles: Record<string, string> = {
  Pending: 'text-yellow-500',
  Processing: 'text-blue-500',
  Shipping: 'text-orange-500',
  Completed: 'text-green-600',
  Cancelled: 'text-gray-500',
};
interface Props {
  orders: Order[];
  loading: boolean;
  lastOrderRef?: (node: HTMLLIElement) => void; 
}

const OrderList: React.FC<Props> = ({ orders, loading, lastOrderRef }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 max-h-[460px] overflow-y-auto border border-gray-200 rounded-md p-4">
      {loading && orders.length === 0 ? (
        <p className="text-center text-gray-500">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order, index) => {
            const isLast = index === orders.length - 1;
            return (
              <li
                key={order.id}
                ref={isLast ? lastOrderRef : undefined}
                className="bg-white rounded-md border p-4 shadow"
              >
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">Mall</span>
                    <span>Express Center</span>
                  </div>
                  <div className={`text-sm font-medium ${statusStyles[order.order_status] || 'text-gray-600'}`}>
                    {statusMap[order.order_status] || order.order_status}
                  </div>
                </div>

                {order.orderItems?.map((item) => {
                  const variant = item.product_variant;
                  const product = variant?.Product;
                  const imageUrl = product?.images?.[0]?.image_url;
                  const discountedPrice = Number(variant?.price || 0);
                  const discount = Number(product?.discount_percentage || 0);
                  const price_variant = Number(variant.price);
                  const originalPrice = discount > 0
                    ? Math.round(discountedPrice / (1 - discount / 100))
                    : 0;
                  //  Log tên sản phẩm và ảnh đầu tiên
                  console.log('Sản phẩm:', product?.name);
                  console.log('Hình ảnh:', imageUrl ? `${BASE_URL}${imageUrl}` : 'Không có ảnh');
                  console.log('Full item:', item);
                  return (
                    <div key={item.id} className="flex items-start gap-4 py-4 border-b">
                      <img
                        src={imageUrl ? `${BASE_URL}${imageUrl}` : '/placeholder.png'}
                        alt="product"
                        className="w-20 h-20 object-cover rounded border"
                      />

                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {product?.name || 'Tên sản phẩm'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Phân loại: {variant?.variant_name || variant?.variant_name} x{item.quantity}
                        </p>
                      </div>

                      <div className="text-right text-sm">
                        {discount > 0 && (
                          <p className="text-gray-400 line-through">
                            ₫ {originalPrice.toLocaleString()}
                          </p>
                        )}
                        <p className="text-red-500 font-semibold">
                          ₫ {price_variant.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end items-center pt-4">
                  <span className="mr-2 text-gray-700">Thành tiền:</span>
                  <span className="text-red-500 text-xl font-semibold">
                    ₫{order.total_amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => navigate(`/account/order-tracking?orderId=${order.id}`)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {loading && orders.length > 0 && (
        <p className="text-center text-gray-500 mt-4">Đang tải thêm...</p>
      )}
    </div>
  );
};

export default OrderList;
