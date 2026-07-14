import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';
import OrderList from './order-list';
import { Order } from '../../../../types/order';

const tabToStatusMap: Record<string, string> = {
  'ĐANG XỬ LÝ': 'Processing',
  'ĐANG VẬN CHUYỂN': 'Shipping',
  'HOÀN THÀNH': 'Completed',
  'HUỶ': 'Cancelled',
};

const OrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('TẤT CẢ');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const limit = 5;
  const tabs = ['TẤT CẢ', 'ĐANG XỬ LÝ', 'ĐANG VẬN CHUYỂN', 'HOÀN THÀNH', 'HUỶ'];
  const [resetKey, setResetKey] = useState(0);
  
const fetchOrders = useCallback(async () => {
  if (!hasMore || loading) return;
  setLoading(true);

  try {
    const res = await axiosInstanceL.get('/api/orders', {
      params: {
        status: activeTab !== 'TẤT CẢ' ? tabToStatusMap[activeTab] : undefined,
        search: searchTerm || undefined,
        limit,
        offset: (page - 1) * limit,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    const newOrders: Order[] = res.data.orders || res.data || [];
    setOrders((prev) => {
      // Lọc ra các đơn hàng chưa có trong danh sách trước
      const newUniqueOrders = newOrders.filter(
        (order) => !prev.some((existingOrder) => existingOrder.id === order.id)
      );
      return [...prev, ...newUniqueOrders];
    });

    if (newOrders.length < limit) setHasMore(false);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
  } finally {
    setLoading(false);
  }
}, [activeTab, searchTerm, page, hasMore, loading]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const momoOrderId = params.get('orderId');
    const resultCode = params.get('resultCode');

    if (momoOrderId && resultCode === '0') {
      axiosInstanceL.post('/api/payments/update-status', {
        momo_order_id: momoOrderId,
        status: 'Success',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        setOrders([]);
        setPage(1);
        setHasMore(true);
        fetchOrders();
      }).catch(console.error);
    }
  }, [location.search]);



// Khi tab/search thay đổi
useEffect(() => {
  setOrders([]);
  setPage(1);
  setHasMore(true);
  setResetKey((prev) => prev + 1); // trigger mới
}, [activeTab, searchTerm]);

// Khi reset xong, thực hiện fetchhh
useEffect(() => {
  fetchOrders();
}, [resetKey, page]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderRef = useCallback((node: HTMLLIElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleSearch = () => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn Hàng Của Bạn</h1>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-3 px-4 text-sm font-semibold transition-colors duration-200
              ${activeTab === tab
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-600 hover:text-red-500 hover:border-b-2 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center border border-gray-300 rounded-md p-2 mb-8">
        <FaSearch className="text-gray-400 ml-2 mr-3" />
        <input
          type="text"
          placeholder="Tìm đơn hàng theo Mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-1 text-gray-700 outline-none"
        />
        <button
          onClick={handleSearch}
          className="text-blue-500 text-sm font-semibold py-1 px-3 hover:text-blue-600 focus:outline-none"
        >
          Tìm đơn hàng
        </button>
      </div>

      <OrderList orders={orders} loading={loading} lastOrderRef={lastOrderRef} />
    </div>
  );
};

export default OrderManagement;
