import React, { useEffect } from "react";
import { Product } from "../../../../types/product";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { CartItem } from "../context";

interface Props {
  product: Product;
  quantity: number;
  increase: () => void;
  decrease: () => void;
  selectedClassify: string;
  setSelectedClassify: (val: string) => void;
  addToCart: (product: CartItem) => void;
}

const ProductInfo: React.FC<Props> = ({
  product,
  quantity,
  increase,
  decrease,
  selectedClassify,
  setSelectedClassify,
  addToCart,
}) => {
  const ratings = product.reviews?.map(r => parseFloat(r.rating.toString())) || [];
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

  // Loại bỏ các variant trùng lặp theo variant_name
  const uniqueVariants = Array.from(
    new Map(product.variants?.map(variant => [variant.variant_name, variant])).values()
  );

  const selectedVariant = uniqueVariants.find(v => v.variant_name === selectedClassify);
  const price = selectedVariant ? parseFloat(selectedVariant.price?.toString() || '0') : (product.price ? parseFloat(product.price.toString()) : 0);

  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const originalPrice = Math.round(price / (1 - product.discount_percentage / 100));
  const isOutOfStock = stock === 0;

  useEffect(() => {
    if (!selectedClassify && uniqueVariants.length > 0) {
      setSelectedClassify(uniqueVariants[0].variant_name);
    }
  }, [product, selectedClassify, setSelectedClassify]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h1>

      <div className="flex items-center gap-2 text-sm mb-4">
        <div className="flex items-center text-yellow-500">
          <span className="mr-2 text-lg font-medium text-black underline">{averageRating.toFixed(1)}</span>
          {Array.from({ length: 5 }, (_, index) =>
            averageRating >= index + 1 ? (
              <FaStar key={index} />
            ) : averageRating >= index + 0.5 ? (
              <FaStarHalfAlt key={index} />
            ) : (
              <FaRegStar key={index} />
            )
          )}
        </div>
        <span>|</span>
        <span>{product.reviews?.length || 0} đánh giá</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <p className="text-3xl text-red-600 font-bold">{price.toLocaleString("vi-VN") || 0} đ</p>
        <p className="text-base text-gray-400 line-through">{originalPrice.toLocaleString("vi-VN")} đ</p>
        <p className="text-xs text-red-500 bg-rose-50 px-1 rounded-sm">-{product.discount_percentage}%</p>
      </div>

      <div className="p-3 bg-gray-100 rounded-md mb-4">
        <p className="text-sm font-semibold">0% TRẢ GÓP</p>
        <p className="text-sm">12 tháng x {(price / 12).toLocaleString("vi-VN")} đ (Lãi suất 0%)</p>
      </div>

      <div className="p-3 bg-gray-100 rounded-md mb-4">
        <p className="text-sm">🚚 Nhận từ 15 - 18 Th03, phí giao ₫0</p>
        <p className="text-xs text-gray-500">🎁 Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.</p>
      </div>

      <div className="flex gap-2 flex-wrap my-6">
        {uniqueVariants.map((variant) => (
          <span
            key={variant.variant_name}
            className={`px-6 py-4 rounded text-xs cursor-pointer hover:bg-gray-300 ${selectedClassify === variant.variant_name ? "bg-red-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedClassify(variant.variant_name)}
          >
            {variant.variant_name}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm font-semibold">Số lượng:</p>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button className="p-2 border-r border-gray-300" onClick={decrease}>-</button>
          <p className="p-2">{quantity}</p>
          <button
            className="p-2 border-l border-gray-300"
            onClick={() => {
              if (quantity < stock) increase();
            }}
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-500">Còn {stock} sản phẩm</p>
      </div>

      <div className="flex gap-3">
        {isOutOfStock ? (
          <div className="flex-1 p-3 border border-gray-300 rounded-md text-center text-gray-400 cursor-not-allowed">
            Hết hàng
          </div>
        ) : (
          <button
            className="flex-1 p-3 border border-red-600 text-red-600 rounded-md hover:bg-red-100"
            onClick={() => {
              const token = localStorage.getItem('accessToken');
              if (!token) {
                alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
                window.location.href = "/login"; // hoặc dùng navigate nếu có hook
                return;
              }
              addToCart({ ...product, quantity, selectedClassify, price });
            }}
          >
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
