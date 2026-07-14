import React from 'react';

import AddressItem from './address-Item';  
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';

interface AddressListProps {
  fetchAddresses: () => void;  
  addresses: Address[];  
}
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
const AddressList: React.FC<AddressListProps> = ({ fetchAddresses, addresses}) => {

  const handleSetDefault = async (selectedAddress: Address) => {
    try {
      await axiosInstanceL.put(`/api/addresses/set-default/${selectedAddress.id}`);
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  // Delete an address
  const handleDelete = async (addressToDelete: Address) => {
    try {
      await axiosInstanceL.delete(`/api/addresses/${addressToDelete.id}`);
      fetchAddresses(); 
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };


  return (
    <div className='mt-10'>
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <AddressItem
            key={address.id}
            address={address}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p className="text-gray-500">Chưa có địa chỉ nào.</p>
      )}
    </div>
  );
};

export default AddressList;
