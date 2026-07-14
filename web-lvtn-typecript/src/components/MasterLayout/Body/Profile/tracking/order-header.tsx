import React from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const OrderHeader: React.FC<{ orderId: string, orderStatus: string }> = ({ orderId, orderStatus }) => {
  let statusText = '';
  
  switch (orderStatus) {
    case 'Completed':
      statusText = 'ĐƠN HÀNG ĐÃ HOÀN THÀNH';
      break;
    case 'Processing':
      statusText = 'ĐƠN HÀNG ĐANG XỬ LÝ';
      break;
    case 'Shipping':
      statusText = 'ĐƠN HÀNG ĐANG VẬN CHUYỂN';
      break;
    case 'Cancelled':
      statusText = 'ĐƠN HÀNG ĐÃ BỊ HỦY';
      break;
    case 'Refunded':
      statusText = 'ĐƠN HÀNG ĐÃ HOÀN TIỀN';
      break;
    case 'Failed':
      statusText = 'ĐƠN HÀNG GẶP LỖI';
      break;
    default:
      statusText = 'ĐƠN HÀNG ĐANG CHỜ XỬ LÝ';
      break;
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-sm rounded-lg mb-4">
    <Link to={"/account/order"} >
        <button className="text-gray-600 font-bold flex items-center">
            <IoMdArrowBack className="w-5 h-5 mr-1" />
            TRỞ LẠI
        </button>
    </Link>
        

      <div className="text-sm">
        MÃ ĐƠN HÀNG: <span className="font-semibold">{orderId}</span>
      </div>
      <button className={`px-4 py-2 rounded-md text-sm font-semibold ${orderStatus === 'Completed' ? 'bg-green-500' : orderStatus === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
        {statusText}
      </button>
    </div>
  );
};

export default OrderHeader;