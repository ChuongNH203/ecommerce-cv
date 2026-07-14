import React, { useEffect, useState } from "react";
import { CartHeader } from "./sections/cart-header";
import { PromotionalBanner } from "./sections/promotional-banner";
import { StoreSection } from "./sections/store-section";
import { VoucherShippingSection } from "./sections/voucher-shipping-section";
import BottomBar from "./bottom-bar";
import axiosInstanceL from "../../../../api/api-login/axiosInstance-login";


interface CartFormProps {
  cartItems: any[];
  checkedItems: string[];
  getItemKey: (id: number, selectedClassify?: string) => string;
  getFullImageUrl: (thumbnail: string, images?: { image_url: string }[]) => string;
  isAllChecked: boolean;
  handleCheckAll: () => void;
  handleCheckItem: (key: string) => void;
  decreaseQuantity: (id: number, selectedClassify?: string) => void;
  increaseQuantity: (id: number, selectedClassify?: string) => void;
  removeFromCart: (id: number, selectedClassify?: string) => void;
  handleSaveToWishlist: () => void;
  setCheckedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CartForm: React.FC<CartFormProps> = ({
  cartItems,
  getItemKey,
  getFullImageUrl,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  handleSaveToWishlist,
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const isAllChecked = cartItems.length > 0 && checkedItems.length === cartItems.length;
const [isSinglePurchaseMode, setIsSinglePurchaseMode] = useState(false);
  const getPriceWithVariant = (product: any): number => {
    const variant = product.variants?.find(
      (v: any) => v.id === product.variant_id || v.variant_name === product.selectedClassify
    );
    return variant?.price ?? product.price ?? 0;
  };

  const handleCheckItem = (key: string) => {
    setCheckedItems(prevCheckedItems => {
      if (prevCheckedItems.includes(key)) {
        return prevCheckedItems.filter(itemKey => itemKey !== key);
      } else {
        return [...prevCheckedItems, key];
      }
    });
  };

  useEffect(() => {
    axiosInstanceL.get('/api/settings/limit-one-item')
      .then(res => {
        setIsSinglePurchaseMode(res.data?.value === true || res.data?.value === 'true');
      })
      .catch(err => {
        console.error("Lỗi lấy setting chế độ mua đơn:", err);
      });
  }, []);

  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      const allItemKeys = cartItems.map(item => getItemKey(item.id, item.selectedClassify));
      setCheckedItems(allItemKeys);
    }
  };

  return (
    <div className="w-full bg-white max-w-7xl mt-3 mx-auto shadow rounded-sm flex flex-col">
      <CartHeader isAllChecked={isAllChecked} handleCheckAll={handleCheckAll} />
      <PromotionalBanner />

      {Object.entries({ "BELO STORE": cartItems }).map(([storeName, items]) => (
        <StoreSection
          key={storeName}
          storeName={storeName}
          cartItems={items}
          isAllChecked={isAllChecked}
          handleCheckAll={handleCheckAll}
          getItemKey={getItemKey}
          getFullImageUrl={getFullImageUrl}
          handleCheckItem={handleCheckItem}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          removeFromCart={removeFromCart}
          checkedItems={checkedItems}
        />
      ))}
      <VoucherShippingSection />
      <BottomBar
        allChecked={isAllChecked}
        onCheckAll={handleCheckAll}
        onDeleteSelected={() => {
          const itemsToRemove = cartItems.filter(item => checkedItems.includes(getItemKey(item.id, item.selectedClassify)));
          itemsToRemove.forEach((item) => {
            removeFromCart(item.id, item.selectedClassify);
          });
          setCheckedItems([]);
        }}
        onSaveToWishlist={handleSaveToWishlist}
        totalSelected={checkedItems.length}
        totalPrice={cartItems
          .filter((item) => checkedItems.includes(getItemKey(item.id, item.selectedClassify)))
          .reduce((sum, item) => sum + getPriceWithVariant(item) * item.quantity, 0)}
        checkedItems={checkedItems}
        cartItems={cartItems} 
        isSinglePurchaseMode={isSinglePurchaseMode}
      />
    </div>
  );
};
