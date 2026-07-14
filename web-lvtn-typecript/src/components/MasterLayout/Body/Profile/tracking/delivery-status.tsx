import React from 'react';
import { MdCheckCircle } from 'react-icons/md';

interface DeliveryStatusProps {
  currentStatus: string; 
    order: {
    shipping_method: string
  }| null;
}

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ currentStatus, order }) => {
  const statuses = [
    { id: 'Cancelled', label: 'Đã Huỷ' },
    { id: 'Completed', label: 'Giao hàng thành công' },
    { id: 'Shipping', label: 'Đang Vận Chuyển' },
    { id: 'Processing', label: 'Đang được chuẩn bị' }, 
    { id: 'Pending', label: 'Đặt hàng thành công' },
  ];


  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white'; 
      case 'Cancelled':
        return 'bg-green-500 text-white'; 
      case 'Shipping':
        return 'bg-green-500 text-white'; 
      case 'Processing':
        return 'bg-green-500 text-white'; 
      default:
        return 'bg-green-500 text-white'; 
    }
  };


  const isCompleted = (status: string) => {
    const orderStatusOrder = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];
    return orderStatusOrder.indexOf(status) <= orderStatusOrder.indexOf(currentStatus);
  };

  if (currentStatus === 'Cancelled') {
    return (
      <div className="bg-white p-4 shadow-sm rounded-lg mb-4">
        <div className="flex justify-center items-center text-center text-sm">
          <div className="text-red-500 font-semibold text-lg">Đơn Hàng Đã Bị Hủy</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg relative">
      <div className="absolute top-4 right-4 text-gray-500 text-xs">
        {order?.shipping_method}
        <br />
        SPEVN25609002073
      </div>
      <h2 className="text-lg font-semibold mb-4">Trạng thái giao hàng</h2>

      <div className="relative pl-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 ml-2"></div>
        {/* Hiển thị các bước giao hàng theo thứ tự từ dưới lên */}
        {statuses.reverse().map((status) => (
          isCompleted(status.id) && (
            <div key={status.id} className="mb-4 relative">
              <div className={`absolute left-0 w-4 h-4 ${isCompleted(status.id) ? getStatusStyle(status.id) : 'bg-gray-400'} rounded-full -ml-1 top-0`}></div>
              <div className="ml-6">
                <div className="text-sm text-gray-700 font-semibold">{status.label}</div>
                <div className="text-xs text-gray-600">Thời gian: {status.id}</div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default DeliveryStatus;
