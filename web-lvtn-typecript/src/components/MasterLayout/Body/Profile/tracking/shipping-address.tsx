import React from 'react';

interface ShippingAddressProps {
  address: {
    full_name: string;
    phone_number: string;
    street_address: string;
    ward: string;
    district: string;
    city: string;
  }| null;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ address }) => {
      if (!address) {
    return <div>Đang tải thông tin địa chỉ...</div>;
  }
  return (
    <div className="bg-white p-4 shadow-sm rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Địa Chỉ Nhận Hàng</h2>
      <div className="text-gray-800 font-bold">{address.full_name}</div>
      <div className="text-gray-600">({address.phone_number})</div>
      <div className="text-gray-600">{address.street_address}</div>
      <div className="text-gray-600">
        {address.ward}, {address.district}, {address.city}
      </div>
    </div>
  );
};

export default ShippingAddress;
