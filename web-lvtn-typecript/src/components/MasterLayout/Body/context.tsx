import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartAPI } from "../../../api/api-card/cart.api";

interface ProductVariant {
  id: number;
  variant_name: string;
  price: number;
  stock: number;
  [key: string]: any;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  variant_id?: number;
  selectedClassify?: string;
  images: string[];
  thumbnail?: string;
  [key: string]: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  removeFromCart: (cartItemId: number) => void;
  increaseQuantity: (cartItemId: number) => void;
  decreaseQuantity: (cartItemId: number) => void;
  fetchCart: () => void;
  message: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchCart = async () => {
    try {
      const rawItems = await CartAPI.getCart();

      const parsed = rawItems.map((item: any) => {
        const product = item.product || {};
        const variant = product.variants?.find((v: any) => v.id === item.variant_id);

        return {
          id: item.id,
          quantity: item.quantity,
          name: product.name || "Không rõ",
          price: parseFloat(variant?.price || product.price || 0),
          variant_id: item.variant_id,
          selectedClassify: variant?.variant_name || "Không có",
          images: product.images?.map((img: any) => img.image_url) || [],
          stock: variant?.stock || product.stock || 0,
          thumbnail: product.thumbnail || "",
        };
      });

      setCartItems(parsed);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchCart(); // gọi 1 lần duy nhất
  }, []);

  const addToCart = async (product: CartItem, quantity: number = 1) => {
    try {
      const variant = product.variants?.find((v: ProductVariant) => v.variant_name === product.selectedClassify);
      const variantId = variant?.id ?? null;

      await CartAPI.addToCart({
        product_id: product.id,
        variant_id: variantId,
        quantity,
      });

      setMessage("Đã thêm vào giỏ hàng");
      setTimeout(() => setMessage(""), 1500);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm giỏ hàng:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await CartAPI.removeFromCart(cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("Lỗi xóa giỏ hàng:", err);
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;
    const newQty = item.quantity + 1;
    await CartAPI.updateQuantity({ cart_item_id: cartItemId, quantity: newQty });
    setCartItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const decreaseQuantity = async (cartItemId: number) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    await CartAPI.updateQuantity({ cart_item_id: cartItemId, quantity: newQty });
    setCartItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        setCartItems,
        decreaseQuantity,
        message,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
