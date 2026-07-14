import React from "react";
import BottomBar from "../cart/bottom-bar";
import WishlistBottomBar from "./wishlist-bottom-bar";

interface WishlistFormProps {
  wishlistItems: any[];
  checkedItems: number[];
  onCheckItem: (id: number) => void;
  onCheckAll: () => void;
  onRemove: (id: number) => void;
  onAddToCart: () => void;
}

const BASE_URL = "http://localhost:3000";

const getFullImageUrl = (thumbnail: string, images?: { image_url: string }[]) => {
  const url = images?.[0]?.image_url || thumbnail;
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

const WishlistForm: React.FC<WishlistFormProps> = ({
  wishlistItems,
  checkedItems,
  onCheckItem,
  onCheckAll,
  onRemove,
  onAddToCart,
}) => {
  const totalPrice = wishlistItems
    .filter((item) => checkedItems.includes(item.id))
    .reduce((sum, item) => {
      const price = item.product?.variants?.find((v: any) => v.id === item.variant_id)?.price || 0;
      return sum + price;
    }, 0);

  return (
    <div className="w-full bg-white max-w-7xl mt-3 mx-auto shadow rounded-sm p-4 space-y-4">
      <h2 className="text-xl font-semibold">Sản phẩm yêu thích</h2>

      {wishlistItems.length > 0 && (
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={checkedItems.length === wishlistItems.length}
            onChange={onCheckAll}
            id="check-all"
          />
          <label htmlFor="check-all" className="ml-2 font-semibold">
            Chọn tất cả
          </label>
        </div>
      )}

      {wishlistItems.length > 0 ? (
        wishlistItems.map((item, index) => {
          const variant = item.product.variants?.find((v: any) => v.id === item.variant_id);
          const imageUrl = getFullImageUrl(item.product.thumbnail, item.product.images);
          const checked = checkedItems.includes(item.id);

          return (
            <div key={index} className="flex items-center space-x-4 border-b py-3">
              <input type="checkbox" checked={checked} onChange={() => onCheckItem(item.id)} />
              <img className="w-20 h-20 object-cover rounded-md" src={imageUrl} alt={item.product.name} />
              <div className="flex-1">
                <p className="text-sm text-black/90 truncate">{item.product.name}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Phân loại: <span className="font-semibold">{variant?.variant_name || "Không có"}</span>
                </p>
              </div>
              <button
                className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                onClick={() => onRemove(item.id)}
              >
                Xóa
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">💔 Chưa có sản phẩm yêu thích</p>
      )}

      <WishlistBottomBar
        allChecked={checkedItems.length === wishlistItems.length && wishlistItems.length > 0}
        onCheckAll={onCheckAll}
        onDeleteSelected={() => checkedItems.forEach((id) => onRemove(id))}
        onAddToCart={onAddToCart}
        totalSelected={checkedItems.length}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default WishlistForm;
