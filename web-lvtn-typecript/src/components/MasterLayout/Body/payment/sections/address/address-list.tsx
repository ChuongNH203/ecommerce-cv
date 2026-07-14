import React, { useEffect, useState } from 'react';
import AddressItem from './address-item';
import axiosInstanceL from '../../../../../../api/api-login/axiosInstance-login';

interface Address {
  id: string;
  full_name: string;
  phone_number: string;
  street_address: string;
  district: string;
  city: string;
  ward: string;
  postal_code: string;
  address_type: string;
  isDefault: boolean;
}

interface AddressListProps {
  onSelect: (address: Address) => void; // Hàm chọn địa chỉ được truyền từ AddressSection
}

const AddressList: React.FC<AddressListProps> = ({ onSelect }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstanceL.get('/api/addresses');
        setAddresses(response.data); // Lưu danh sách địa chỉ vào state
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id); // Lưu ID của địa chỉ đã chọn, nhưng không cập nhật ngay trong AddressSection
  };

  const handleUpdateAddress = (id: string) => {
    alert(`Cập nhật địa chỉ với ID: ${id}`);
  };


  const handleConfirm = () => {
    const confirmedAddress = addresses.find((addr) => addr.id === selectedAddressId);
    if (confirmedAddress) {
      onSelect(confirmedAddress); // Chỉ gọi onSelect khi người dùng bấm "Xác nhận"
    } else {
      alert('Vui lòng chọn một địa chỉ để xác nhận.');
    }
  };

  return (
    <div className="flex justify-center py-4">
      <div className="w-full max-w-3xl bg-white overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-800 p-4 border-b border-gray-200">Địa Chỉ Của Tôi</h1>

        <div className="bg-white max-h-[50vh] overflow-y-auto">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressItem
                key={address.id}
                full_name={address.full_name}
                phone_number={address.phone_number}
                street_address={address.street_address}
                district={address.district}
                city={address.city}
                ward={address.ward}
                postal_code={address.postal_code} // Đảm bảo có trường postal_code
                address_type={address.address_type} // Đảm bảo có trường address_type
                isDefault={address.isDefault}
                isSelected={selectedAddressId === address.id} // Kiểm tra nếu địa chỉ này đã được chọn
                onSelect={() => handleSelectAddress(address.id)}
                onUpdate={() => handleUpdateAddress(address.id)}
              />
            ))
          ) : (
            <p>Không có địa chỉ nào để hiển thị.</p>
          )}
        </div>
        <div className="flex justify-end p-4 space-x-4">
        <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
            Xác nhận
        </button>
        </div>
      </div>
    </div>
  );
};

export default AddressList;
