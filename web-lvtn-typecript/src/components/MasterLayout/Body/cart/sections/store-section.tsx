import React from 'react';
import { CartItem } from './cart-item';


interface StoreSectionProps {
  storeName: string; // Assuming a store name prop
  cartItems: any[]; // Items specific to this store
  isAllChecked: boolean;
  handleCheckAll: () => void; // For checking all items in this store
  getItemKey: (id: number, selectedClassify?: string) => string;
  getFullImageUrl: (thumbnail: string, images?: { image_url: string }[]) => string;
  handleCheckItem: (key: string) => void;
  decreaseQuantity: (id: number, selectedClassify?: string) => void;
  increaseQuantity: (id: number, selectedClassify?: string) => void;
  removeFromCart: (id: number, selectedClassify?: string) => void;

  checkedItems: string[];
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  storeName,
  cartItems,
  getItemKey,
  getFullImageUrl,
  handleCheckItem,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  checkedItems,
}) => {
  // NOTE: For simplicity, `isAllChecked` and `handleCheckAll` are passed from parent CartForm
  // In a multi-store setup, you'd calculate and manage these specifically for each store.

  return (
    <div className="p-4 border-b">
      <div className="flex items-center mb-3">

        <span className="text-orange-500 text-xs font-semibold mr-2">Yêu thích</span>
        <span className="font-bold mr-2">{storeName}</span>
        <button className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer flex items-center gap-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7zm-8-3a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Chat ngay
        </button>
      </div>
      {/* Specific Products List */}
      {cartItems.length > 0 ? (
        cartItems.map((product, index) => (
          <CartItem
            key={index}
            product={product}
            checked={checkedItems.includes(getItemKey(product.id, product.selectedClassify))} // Passed from CartForm
            getItemKey={getItemKey}
            getFullImageUrl={getFullImageUrl}
            handleCheckItem={handleCheckItem}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            removeFromCart={removeFromCart}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">🛍️ Giỏ hàng trống</p>
      )}
    </div>
  );
};