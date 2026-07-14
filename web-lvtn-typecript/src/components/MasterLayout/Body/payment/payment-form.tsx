import React, { useState } from 'react';
import AddressSection from './sections/address-section';
import ProductDetailsSection from './sections/product-section';
import ShopVoucherSection from './sections/shop-voucher-section';
import DeliveryAndNotesSection from './sections/delivery-notes-section';
import VoucherSection from './sections/voucher-section';
import PaymentMethodSection from './sections/payment-method-section';
import OrderTotalSummary from './sections/order-total-summary';

interface PaymentFormProps {
  productPrice: number;
  standardShippingFee: number;
  selectedShippingOption: 'standard' | 'express';
  onShippingOptionChange: (option: 'standard' | 'express') => void;
  onMessageChange: (message: string) => void;
  isVoucherChecked: boolean;
  onVoucherChange: (checked: boolean, discount: number) => void;
  selectedPaymentMethod: 'COD' | 'Momo';
  onPaymentMethodChange: (method: 'COD' | 'Momo') => void;
  totalPrice: number; // Total price coming from PaymentPage
  setTotalPrice: (total: number) => void;
  setShippingAddressId: (id: string) => void; // Prop to set shipping address ID
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  productPrice,
  standardShippingFee,
  selectedShippingOption,
  onShippingOptionChange,
  onMessageChange,
  isVoucherChecked,
  onVoucherChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  totalPrice,
  setTotalPrice,
  setShippingAddressId,
}) => {
  const [voucherDiscount, setVoucherDiscount] = useState(0); // State to store the discount amount

  // Tính tổng tiền sau khi áp dụng voucher và cộng phí vận chuyển
  const calculateTotalPrice = (productTotal: number) => {
    let finalPrice = productTotal + standardShippingFee; // Cộng phí vận chuyển
    finalPrice -= voucherDiscount; // Trừ tiền voucher
    setTotalPrice(finalPrice); // Cập nhật tổng tiền
  };

  // Handle voucher changes (apply or remove discount)
  const handleVoucherChange = (checked: boolean, discount: number) => {
    onVoucherChange(checked, discount);

    if (checked) {
      // Apply voucher discount when checked
      setVoucherDiscount(discount); // Ví dụ: Giảm 10,000₫
    } else {
      // Remove voucher discount when unchecked
      setVoucherDiscount(0); // Không áp dụng giảm giá khi không tick
    }

    calculateTotalPrice(productPrice); // Tính lại tổng tiền mỗi khi voucher thay đổi
  };

  return (
    <div className="font-sans max-w-6xl mx-auto border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
      <AddressSection setShippingAddressId={setShippingAddressId} /> {/* Truyền hàm setShippingAddressId vào AddressSection */}
      <ProductDetailsSection
        onTotalPriceChange={calculateTotalPrice} // Pass the function to update the total price
      />
      <ShopVoucherSection />
      <DeliveryAndNotesSection
        standardShippingFee={standardShippingFee}
        selectedShippingOption={selectedShippingOption}
        onShippingOptionChange={onShippingOptionChange}
        onMessageChange={onMessageChange}
      />
      <VoucherSection
        isVoucherChecked={isVoucherChecked}
        onVoucherChange={handleVoucherChange} // Pass the handler for voucher change
      />
      <PaymentMethodSection
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
      <OrderTotalSummary
        productPrice={productPrice}
        shippingFee={standardShippingFee} // Assuming this is the current applied shipping fee
        totalPrice={totalPrice} // Pass the calculated total price
        voucherAmount={voucherDiscount}
      />
    </div>
  );
};

export default PaymentForm;
