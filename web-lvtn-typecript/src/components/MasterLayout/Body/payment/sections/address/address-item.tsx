import React from 'react';

// Định nghĩa kiểu dữ liệu của props mà AddressItem mong đợi
interface AddressItemProps {
  full_name: string;
  phone_number: string;
  street_address: string;
  district: string;
  city: string;
  ward: string;
  postal_code: string;
  address_type: string;
  isDefault: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
  full_name,
  phone_number,
  street_address,
  district,
  city,
  ward,
  isDefault,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const fullAddress = `${street_address}, ${ward}, ${district}, ${city}`; // Ghép các phần của địa chỉ lại

  return (
    <div className={`flex items-start p-4 border-b border-gray-200 ${isSelected ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center mr-4">
        <input
          type="radio"
          name="addressSelection"
          checked={isSelected}
          onChange={onSelect}
          className="form-radio h-5 w-5 text-red-500 focus:ring-red-500"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">{full_name}</p>
          <span className="text-gray-600 ml-2">{phone_number}</span>

        </div>
        <p className="text-gray-700 mt-1">{fullAddress}</p> {/* Hiển thị địa chỉ đã được ghép */}
        {isDefault && (
          <span className="mt-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
            Mặc định
          </span>
        )}
      </div>
    </div>
  );
};

export default AddressItem;
