import React from 'react';
import { Order } from '../../../types/order';

interface Props {
  order: Order;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdateStatus: (newStatus: string) => void;
}

const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
};

const statusOptions = Object.keys(statusMap);

const OrderRow: React.FC<Props> = ({
  order,
  isSelected,
  onToggleSelect,
  onUpdateStatus,
}) => {
  const productNames = order.orderItems
    ?.map(
      (item) =>
        `${item.product_variant.Product.name} (${item.product_variant.variant_name}) x${item.quantity}`
    )
    .join(', ');

  const totalQuantity = order.orderItems?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const isCompleted = order.order_status === 'Hoàn thành';
  return (
    <tr className="text-sm border-b text-left">
      <td className="text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-8"
        />
      </td>
      <td>{order.id}</td>
      <td>{order.User?.full_name || 'N/A'}</td>
      <td>{productNames}</td>
      <td>{totalQuantity}</td>
      <td className="text-green-600">{statusMap[order.order_status] || order.order_status}</td>
      <td>{order.total_amount.toLocaleString()} đ</td>
      <td>
        {!isCompleted ? (
          <select
            className="border rounded px-2 py-1 text-sm"
            defaultValue=""
            onChange={(e) => onUpdateStatus(e.target.value)}
          >
            <option value="" disabled>
              Cập nhật trạng thái
            </option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusMap[status]}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-gray-500">Đã hoàn thành</span> // Hiển thị "Đã hoàn thành" khi không thể cập nhật trạng thái
        )}
      </td>
    </tr>
  );
};

export default OrderRow;
