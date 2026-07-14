import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressSection from '../../components/MasterLayout/Body/payment/sections/address-section';
import ProductDetailsSection from '../../components/MasterLayout/Body/payment/sections/product-section';
import ShopVoucherSection from '../../components/MasterLayout/Body/payment/sections/shop-voucher-section';
import DeliveryAndNotesSection from '../../components/MasterLayout/Body/payment/sections/delivery-notes-section';
import VoucherSection from '../../components/MasterLayout/Body/payment/sections/voucher-section';
import PaymentMethodSection from '../../components/MasterLayout/Body/payment/sections/payment-method-section';
import OrderTotalSummary from '../../components/MasterLayout/Body/payment/sections/order-total-summary';
import axiosInstanceL from '../../api/api-login/axiosInstance-login';

interface Product {
  id: number;
  product_variant_id: number;
  name: string;
  selectedClassify?: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedItems: Product[] = state?.selectedItems || [];

  //  Nếu người dùng truy cập trực tiếp mà không có selectedItems → quay lại giỏ hàng
  useEffect(() => {
    if (!state?.selectedItems || state.selectedItems.length === 0) {
      alert("Bạn chưa chọn sản phẩm nào để thanh toán.");
      navigate("/cart-list");
    }
  }, [state, navigate]);

  const [selectedShippingOption, setSelectedShippingOption] = useState<'standard' | 'express'>('standard');
  const [messageToSeller, setMessageToSeller] = useState('');
  const [isVoucherChecked, setIsVoucherChecked] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'COD' | 'Momo'>('COD');
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState(20000);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const calculateTotalPrice = (): number => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalProductPrice = calculateTotalPrice();
  const finalTotalPrice = totalProductPrice + shippingFee - voucherDiscount;

  const handleShippingOptionChange = (option: 'standard' | 'express') => {
    setSelectedShippingOption(option);
    setShippingFee(option === 'express' ? 50000 : 20000);
  };

  const handleMessageChange = (message: string) => {
    setMessageToSeller(message);
  };

  const handleVoucherChange = (checked: boolean, discount: number, code: string) => {
    setIsVoucherChecked(checked);
    setVoucherDiscount(checked ? discount : 0);
    setVoucherCode(checked ? code : '');
  };

  const handlePaymentMethodChange = (method: 'COD' | 'Momo') => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmitPayment = async () => {
    if (!shippingAddressId) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    try {
      // 1. Tạo đơn hàng
      const orderRes = await axiosInstanceL.post('/api/orders', {
        shipping_address_id: shippingAddressId,
        payment_method: selectedPaymentMethod,
        shipping_method: selectedShippingOption,
        shipping_fee: shippingFee,
        voucher_code: isVoucherChecked ? voucherCode : null,
        total_amount: finalTotalPrice,
        items: selectedItems.map((item) => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const order = orderRes.data.order;
      console.log('✅ Order created:', order);

      // 2. Nếu chọn Momo, gửi request tới API thanh toán
      if (selectedPaymentMethod === 'Momo') {
        const paymentRes = await axiosInstanceL.post('/api/payments', {
          order_id: order.id,
          payment_method: 'Momo',
          amount: finalTotalPrice,
        });

        const { payUrl } = paymentRes.data;
        window.location.href = payUrl; // Chuyển người dùng đến trang thanh toán Momo
        return;
      }

      // 3. Nếu COD
      alert(`Đặt hàng thành công! Tổng tiền: ₫${finalTotalPrice.toLocaleString('vi-VN')}`);
      navigate('/account/order');

    } catch (error: any) {
      console.error('❌ Lỗi khi gửi đơn hàng:', error);
      alert(error?.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn hàng hoặc thanh toán');
    }
  };

  useEffect(() => {
    console.log("📦 selectedItems từ CartPage:", selectedItems);
  }, [selectedItems]);

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-2 lg:px-4">
      <div className="font-sans max-w-6xl mx-auto border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
        <AddressSection setShippingAddressId={setShippingAddressId} />
        <ProductDetailsSection onTotalPriceChange={calculateTotalPrice} />
        <ShopVoucherSection />
        <DeliveryAndNotesSection
          standardShippingFee={shippingFee}
          selectedShippingOption={selectedShippingOption}
          onShippingOptionChange={handleShippingOptionChange}
          onMessageChange={handleMessageChange}
        />
        <VoucherSection
          isVoucherChecked={isVoucherChecked}
          onVoucherChange={handleVoucherChange}
        />
        <PaymentMethodSection
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodChange={handlePaymentMethodChange}
        />
        <OrderTotalSummary
          productPrice={totalProductPrice}
          shippingFee={shippingFee}
          totalPrice={finalTotalPrice}
          voucherAmount={voucherDiscount}
        />
      </div>

      {/* Nút đặt hàng */}
      <div className="max-w-6xl mx-auto text-right mt-6">
        <p className="text-sm text-gray-600 mb-4">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <a href="#" className="text-blue-600 hover:underline">Điều khoản Shop</a>
        </p>
        <button
          onClick={handleSubmitPayment}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md text-lg cursor-pointer transition-colors shadow-lg"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
