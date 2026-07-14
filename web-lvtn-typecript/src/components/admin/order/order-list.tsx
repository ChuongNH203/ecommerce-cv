import React, { useEffect, useState, useRef } from 'react';
import OrderRow from './order-row';
import { Order } from '../../../types/order';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const LIMIT = 10;

const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ'
};

interface OrderListProps {
  searchQuery: string;  // Nhận giá trị tìm kiếm từ cha
}

const OrderList: React.FC<OrderListProps> = ({ searchQuery }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders); // Lưu đơn hàng đã lọc
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchOrders = async (currentPage: number) => {
    try {
      const res = await axiosInstanceL.get(`/api/orders/all`);
      const newOrders = res.data.orders || [];
      
      setOrders((prev) => {
        const allOrders = [...prev, ...newOrders];
        const uniqueOrders = Array.from(new Set(allOrders.map(order => order.id)))
          .map(id => allOrders.find(order => order.id === id));
        return uniqueOrders || [];
      });

      if (newOrders.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // Lọc đơn hàng theo mã đơn hàng
  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter((order) =>
        order.id.toString().includes(searchQuery)
      );
      setFilteredOrders(filtered); 
    } else {
      setFilteredOrders(orders);  // Nếu không có tìm kiếm, hiển thị tất cả đơn hàng
    }
  }, [searchQuery, orders]);  // Gọi lại khi searchQuery hoặc orders thay đổi

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore]);

  const handleSelectAll = () => {
    const allIds = orders.map((o) => o.id);
    setSelectedOrders(selectedOrders.length === allIds.length ? [] : allIds);
  };

  const handleToggleSelect = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    console.log('Gửi cập nhật trạng thái:', { orderId, status });
    try {
      const res = await axiosInstanceL.patch(`/api/orders/${orderId}/status`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: status } : order
        )
      );
  
      console.log('Cập nhật trạng thái thành công:', res.data.message);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật trạng thái:', error?.response?.data?.message || error.message);
      alert(error?.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-fixed w-full">
          <thead>
            <tr className="bg-zinc-100 text-sm font-semibold border-b text-left">
              <th className="text-center">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={handleSelectAll}
                  className="w-4 h-8"
                />
              </th>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Đơn hàng</th>
              <th>Số lượng</th>
              <th>Tình trạng</th>
              <th>Giá tiền</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={{ ...order, order_status: statusMap[order.order_status] || order.order_status }}
                isSelected={selectedOrders.includes(order.id)}
                onToggleSelect={() => handleToggleSelect(order.id)}
                onUpdateStatus={(status) => handleUpdateStatus(order.id, status)}
              />
            ))}
          </tbody>
        </table>
        {hasMore && <div ref={loaderRef} className="text-center "></div>}
        {!hasMore && <div className="text-center py-4 text-gray-500">Không còn đơn hàng</div>}
      </div>
    </div>
  );
};

export default OrderList;
