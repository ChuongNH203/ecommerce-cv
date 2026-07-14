import React from 'react';
import { Address } from './address-list';

interface AddressItemProps {
  address: Address;
  onSetDefault: (address: Address) => void;
  onDelete: (address: Address) => void;

}

const AddressItem: React.FC<AddressItemProps> = ({ address, onSetDefault, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-grow mb-4 md:mb-0">
        <div className="flex items-center mb-1">
          <span className="font-semibold text-lg mr-2">{address.full_name}</span>
          <div className="border-l-2 pl-2 text-gray-600">{address.phone_number}</div>
        </div>
        <div className="text-gray-700">{address.street_address}</div>
        <div className="text-gray-700">
          {address.ward}, {address.district}, {address.city}
        </div>
        {address.address_type && (
          <p className="text-gray-700">Loại địa chỉ: {address.address_type}</p>
        )}
        {address.isDefault && (
          <span className="mt-2 inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Mặc định
          </span>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">

        {!address.isDefault && onDelete && (
          <button
            onClick={() => onDelete(address)}
            className="text-red-600 hover:text-red-800 font-medium py-1 px-3 rounded"
          >
            Xóa
          </button>
        )}
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address)}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-1 px-3 rounded"
          >
            Thiết lập mặc định
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressItem;
