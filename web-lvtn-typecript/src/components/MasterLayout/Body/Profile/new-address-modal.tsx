import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5'; 
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login'; 

interface NewAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchAddresses: () => void; 
}

interface Location {
  id: string;
  full_name: string;
}

const NewAddressModal: React.FC<NewAddressModalProps> = ({ isOpen, onClose, fetchAddresses }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressType, setAddressType] = useState(''); 

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [districtName, setDistrictName] = useState(''); 

  useEffect(() => {
    // Fetch provinces
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (province) {

      fetch(`https://esgoo.net/api-tinhthanh/2/${province}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setDistricts(data.data);
            setDistrictName(''); 
          }
        });
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      // Fetch wards when district changes
      fetch(`https://esgoo.net/api-tinhthanh/3/${district}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setWards(data.data);
          }
        });
    }
  }, [district]);

  useEffect(() => {
    const selectedDistrict = districts.find(d => d.id === district);
    if (selectedDistrict) {
      setDistrictName(selectedDistrict.full_name);
    }
  }, [district, districts]);

  if (!isOpen) return null; 

  const handleComplete = async () => {
    const newAddress = {
      full_name: fullName,
      phone_number: phoneNumber,
      street_address: streetAddress,
      city: province, 
      district: districtName, 
      ward: ward, 
      postal_code: '', 
      address_type: addressType,
    };

    try {
      await axiosInstanceL.post('/api/addresses', newAddress);
      fetchAddresses(); 
      onClose(); 
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto">
        {/* Modal Header */}
        <div className="relative flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">ĐỊA CHỈ MỚI</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <IoCloseOutline className="w-7 h-7" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
          <div>
            <input
              type="text"
              placeholder="Nhập Họ Tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Nhập Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-6">Địa chỉ</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.full_name}
                </option>
              ))}
            </select>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.full_name}
                </option>
              ))}
            </select>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.full_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Số nhà, địa chỉ"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-6">Loại địa chỉ</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setAddressType('Văn phòng')}
              className={`py-2 px-6 rounded-md border ${
                addressType === 'Văn phòng'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150`}
            >
              Văn phòng
            </button>
            <button
              onClick={() => setAddressType('Nhà riêng')}
              className={`py-2 px-6 rounded-md border ${
                addressType === 'Nhà riêng'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150`}
            >
              Nhà riêng
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0 flex justify-center">
          <button
            onClick={handleComplete}
            className="bg-red-500 text-white font-semibold py-3 px-12 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full max-w-xs"
          >
            HOÀN THÀNH
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAddressModal;
