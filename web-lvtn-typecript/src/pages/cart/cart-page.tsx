import React, { useState, useEffect } from "react";
import { useWishlist } from "../../components/MasterLayout/Body/Wishlist/wishlist-context";
import { useCart } from "../../components/MasterLayout/Body/context";
import { CartForm } from "../../components/MasterLayout/Body/cart/cart-form";
import { useNavigate } from "react-router-dom"; // Để chuyển hướng sang trang thanh toán


const BASE_URL = "http://localhost:3000";

export interface WishlistItem {
  wishlist_item_id?: number;
  id: number;
  name: string;
  price: number;
  images: string[];
  selectedClassify?: string;
  variant_id?: number;
  [key: string]: any;
}

const CartPage: React.FC = () => {
  const { cartItems, setCartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate(); // Hook để chuyển hướng

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const getItemKey = (id: number, selectedClassify?: string) =>
    `${id}-${selectedClassify ?? "none"}`;

  const getFullImageUrl = (thumbnail: string, images?: { image_url: string }[]) => {
    const url = images?.[0]?.image_url || thumbnail;
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const handleSaveToWishlist = async () => {
    for (const key of checkedItems) {
      const [idStr, classify] = key.split("-");
      const product = cartItems.find(
        (item) => item.id === Number(idStr) && (item.selectedClassify ?? "none") === classify
      );

      if (!product) continue;

      const selectedVariant = product.variants?.find(
        (v: any) =>
          v.variant_name === product.selectedClassify ||
          v.id === product.variant_id
      );

      await addToWishlist({
        product_id: product.product_id || product.id,
        variant_id: selectedVariant?.id ?? null,
      });
    }

    alert("✅ Đã lưu sản phẩm vào mục Đã thích!");
  };

  const handleCheckItem = (key: string) => {
    setCheckedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };


  const handleCheckAll = () => {
    if (checkedItems.length === cartItems.length) setCheckedItems([]);
    else setCheckedItems(cartItems.map((item) => getItemKey(item.id, item.selectedClassify)));
  };


  useEffect(() => {
    const allKeys = cartItems.map((item) => getItemKey(item.id, item.selectedClassify));
    setCheckedItems(allKeys);
  }, [cartItems]);

  const isAllChecked = cartItems.length > 0 && checkedItems.length === cartItems.length;



  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-2 lg:px-4">
      <CartForm
        cartItems={cartItems}
        checkedItems={checkedItems}
        getItemKey={getItemKey}
        getFullImageUrl={getFullImageUrl}
        isAllChecked={isAllChecked}
        handleCheckAll={handleCheckAll}
        handleCheckItem={handleCheckItem}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        removeFromCart={removeFromCart}
        handleSaveToWishlist={handleSaveToWishlist}
        setCheckedItems={setCheckedItems}
      />
    </div>
  );
};

export default CartPage;
