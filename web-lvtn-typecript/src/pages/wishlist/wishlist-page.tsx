import React, { useEffect, useState } from "react";
import { useWishlist } from "../../components/MasterLayout/Body/Wishlist/wishlist-context";
import { message, Select } from "antd";
import { CartAPI } from "../../api/api-card/cart.api";
import {  useCart } from "../../components/MasterLayout/Body/context";

const { Option } = Select;
const BASE_URL = "http://localhost:3000";

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();
    const { fetchCart } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<{
    [wishlistId: number]: number;
  }>({});

  const handleSelectVariant = (wishlistItemId: number, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [wishlistItemId]: variantId }));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = async (item: any) => {
    try {
      const variants = item.product?.variants || [];
      const selectedVariantId =
        selectedVariants[item.wishlist_item_id] ??
        item.variant_id ??
        variants[0]?.id ??
        null;
      const selectedVariant = variants.find((v: any) => v.id === selectedVariantId);

      await CartAPI.addToCart({
        product_id: item.id,
        variant_id: selectedVariant?.id || null,
        quantity: 1,
      });

      message.success("Đã chuyển sang giỏ hàng!");
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      message.error("Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">💖 SẢN PHẨM YÊU THÍCH</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const variants = item.product?.variants || [];
            const currentSelectedId =
              selectedVariants[item.wishlist_item_id] ??
              item.variant_id ??
              variants[0]?.id;

            const currentVariant = variants.find((v: any) => v.id === currentSelectedId);

            // Lọc các variant có tên trùng nhau
            const uniqueVariants: any[] = [];
            const variantNames = new Set();

            for (const variant of variants) {
              if (!variantNames.has(variant.variant_name)) {
                variantNames.add(variant.variant_name);
                uniqueVariants.push(variant);
              }
            }


            return (
              <div
                key={item.wishlist_item_id}
                className="border rounded-lg p-4 shadow-sm relative bg-white"
              >
                <button
                  onClick={() => removeFromWishlist(item.wishlist_item_id)}
                  className="absolute top-2 right-2 text-red-500 text-lg hover:text-red-700"
                  title="Xoá khỏi yêu thích"
                >
                  ✕
                </button>

                <img
                  src={
                    item.thumbnail?.startsWith("http")
                      ? item.thumbnail
                      : BASE_URL + item.thumbnail
                  }
                  alt={item.name}
                  className="w-full h-40 object-contain mb-3"
                />

                <h3 className="text-base font-semibold truncate">{item.name}</h3>

                {variants.length > 0 && (
                  <div className="mb-2">
                    {uniqueVariants.length > 1 ? (

                      <Select
                        value={currentSelectedId}
                        onChange={(value) => handleSelectVariant(item.wishlist_item_id, value)}
                        style={{ width: "100%" }}
                        size="small"
                      >
                        {uniqueVariants.map((variant: any) => (
                          <Option key={variant.id} value={variant.id}>
                            {variant.variant_name}
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      // Hiển thị tên variant nếu chỉ có một variant duy nhất
                      <p className="text-sm text-gray-700">{uniqueVariants[0]?.variant_name}</p>
                    )}
                  </div>
                )}

                {/* Giá */}
                <p className="text-red-500 font-medium mb-3">
                <p className="text-red-500 font-medium mb-3">
                  {Number(currentVariant?.price || 0).toLocaleString('vi-VN')} đ
                </p>
                </p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
                >
                  Chuyển sang giỏ hàng
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
