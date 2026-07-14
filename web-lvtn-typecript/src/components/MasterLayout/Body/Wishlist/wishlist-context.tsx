import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { WishlistAPI } from "../../../../api/api-card/wishlist.api";

const BASE_URL = "http://localhost:3000";

export interface WishlistItem {
  wishlist_item_id: number;
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  selectedClassify?: string;
  variant_id?: number | null;
  product?: {
    variants?: any[];
  };
}


interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (payload: { product_id: number; variant_id?: number | null }) => Promise<void>;
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
  clearWishlist: () => void;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const items = await WishlistAPI.getWishlist();
      console.log(" Fetch được wishlist:", items);

      if (!Array.isArray(items)) return;

      const mapped = items
        .map((item: any) => {
          const product = item.product;
          if (!product) return null;

          const variant = product.variants?.find((v: any) => v.id === item.variant_id);

          return {
            wishlist_item_id: item.id,
            id: product.id,
            name: product.name,
            price: variant?.price ?? 0,
            thumbnail: product.thumbnail ? BASE_URL + product.thumbnail : "/no-image.jpg",
            selectedClassify: variant?.variant_name,
            variant_id: item.variant_id,
            product: {
              variants: product.variants || []
            }
          };
        })
        .filter(Boolean); // loại bỏ null nếu có

      setWishlistItems(mapped as WishlistItem[]);
    } catch (err) {
      console.error(" Lỗi fetch wishlist:", err);
    }
  };

  const addToWishlist = async (payload: { product_id: number; variant_id?: number | null }) => {
    try {
      await WishlistAPI.addToWishlist(payload);
      await fetchWishlist();
    } catch (err) {
      console.error("Lỗi khi thêm wishlist:", err);
    }
  };

  const removeFromWishlist = async (wishlistItemId: number) => {
    try {
      await WishlistAPI.removeFromWishlist(wishlistItemId);
      await fetchWishlist();
    } catch (err) {
      console.error("Lỗi khi xóa wishlist:", err);
    }
  };

  const clearWishlist = () => setWishlistItems([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
