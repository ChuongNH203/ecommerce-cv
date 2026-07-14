import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import NewAddressModal from './new-address-modal';
import AddressList from './address-list';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';

export interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  district: string;
  ward: string;
  address_type: string;
  created_at: string;
  updated_at: string;
  isDefault: boolean;
}

const AddressForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openUpdateModal = (addressId: number) => {
    if (!addressId) {
      console.error("Address ID is missing when opening the update modal");
      return;
    }
    setSelectedAddressId(addressId); 
    setIsUpdateModalOpen(true);  
  };

  const closeUpdateModal = () => {
    setSelectedAddressId(null);
    setIsUpdateModalOpen(false);  
  };

  // Fetch addresses from the API
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstanceL.get('/api/addresses');
      setAddresses(response.data);  
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

 
  useEffect(() => {
    fetchAddresses();
  }, []); 

  return (
    <div className="bg-white p-6  w-full font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Địa Chỉ Của Bạn</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white text-sm py-2 px-4 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaPlus className="w-3 h-3" />
          Thêm địa chỉ mới
        </button>
      </div>

      {/* New Address Modal */}
      <NewAddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        fetchAddresses={fetchAddresses}  
      />

      {/* Address List */}
      <AddressList
        fetchAddresses={fetchAddresses}  
        addresses={addresses}  
      />
    </div>
  );
};

export default AddressForm;
