import React from 'react';
import { MdCheckCircle } from 'react-icons/md';

const OrderStatusTimeline: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const statuses = [
    { id: 'Pending', label: 'Đang Chờ Xử Lý' },
    { id: 'Processing', label: 'Đang Xử Lý'},
    { id: 'Shipping', label: 'Đang Vận Chuyển' },
    { id: 'Completed', label: 'Đã Hoàn Thành' },
    { id: 'Cancelled', label: 'Đã Huỷ' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'Cancelled':
        return 'bg-red-500 text-white'; 
      case 'Shipping':
        return 'bg-blue-500 text-white'; 
      case 'Processing':
        return 'bg-yellow-500 text-white'; 
      default:
        return 'bg-gray-500 text-white'; 
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
    <div className="bg-white p-4 shadow-sm rounded-lg mb-4">
      <div className="flex justify-between items-start text-center text-sm">
        {statuses.map((status) => (
            status.id !== 'Cancelled' && (
          <div key={status.id} className="flex-1 flex flex-col items-center relative">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 ${isCompleted(status.id) ? 'bg-green-500' : 'bg-gray-300'} -z-10`} />
            <div className={`w-12 h-12 flex items-center justify-center ${isCompleted(status.id) ? getStatusStyle(status.id) : 'border-2 border-gray-500'} text-white rounded-full mb-1`}>
              {isCompleted(status.id) ? (
                <MdCheckCircle className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6"></div> // Khoảng trống nếu chưa hoàn thành
              )}
            </div>
            <div className={`text-gray-700 ${isCompleted(status.id) ? 'font-semibold' : ''}`}>{status.label}</div>
          </div>
            )
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
