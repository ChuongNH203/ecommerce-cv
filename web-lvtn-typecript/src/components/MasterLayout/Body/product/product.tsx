import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, message } from "antd";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useWishlist } from "../../../../components/MasterLayout/Body/Wishlist/wishlist-context";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  images: string[];
  tags?: string[];
  variants?: {
    id: number;
    variant_name: string;
    price: number;
    stock: number;
    [key: string]: any;
  }[]; 
}
interface CardsProps {
  filterItems: Product[];
}

const Product_total = ({ filterItems }: CardsProps) => {
  const tagColors = ["bg-green-700", "bg-red-600", "bg-yellow-500", "bg-red-500"];
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const isInWishlist = (productId: number) =>
    wishlistItems.some((item) => item.id === productId);
  const handleAddToWishlist = async (product: Product) => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      message.warning("🔐 Bạn cần đăng nhập để sử dụng danh sách yêu thích!");
      setTimeout(() => navigate("/login"), 1500); 
      return;
    }
  
    const firstVariant = product.variants?.[0];
    const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  
    try {
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.wishlist_item_id);
        message.success("💔 Đã xoá khỏi danh sách yêu thích");
      } else {
        await addToWishlist({
          product_id: product.id,
          variant_id: firstVariant?.id || null,
        });
        message.success("💖 Đã thêm vào danh sách yêu thích!");
      }
    } catch (err) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="mx-32">
      <div className="max-w-screen-2xl container mx-auto text-center">
        <h2 className="inline-block m-8 px-4 py-2 text-lg text-white bg-gradient-to-b from-red-500 to-orange-500 rounded-md">
          GỢI Ý HÔM NAY
        </h2>
      </div>

      <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center">
        {filterItems.map((item) => (
          <div
            key={item.id}
            className="bg-white relative p-4 text-center border border-gray-200 m-3 hover:scale-105 transition-all duration-200"
          >
            <button
              className="absolute right-2 top-2 text-red-500 text-xl hover:scale-110 transition"
              onClick={() => handleAddToWishlist(item)}
              title="Thêm vào danh sách yêu thích"
            >
              {isInWishlist(item.id) ? "💖" : "🤍"}
            </button>

            <Link to={`/product/${item.id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="mx-auto w-48 h-40 object-contain rounded-lg"
              />
            </Link>

            <div className="flex absolute top-48 left-0 overflow-hidden">
              {item.tags?.map((tag, index) => (
                <Tag
                  key={index}
                  className={`border border-green-200 text-white ${tagColors[index % tagColors.length]} text-xs py-1 rounded-none mb-0`}
                >
                  {tag}
                </Tag>
              ))}
            </div>

            <h4 className="text-base mt-16 font-medium h-14 text-left line-clamp-2">
              {item.title}
            </h4>

            <div className="mt-4">
              <div className="flex items-center text-yellow-500 text-sm mt-1 h-5">
                {item.rating > 0 ? (
                  <>
                    {Array.from({ length: 5 }, (_, index) => {
                      return item.rating >= index + 1 ? (
                        <FaStar key={index} fill="currentColor" size={16} />
                      ) : item.rating >= index + 0.5 ? (
                        <FaStarHalfAlt key={index} size={16} />
                      ) : (
                        <FaRegStar key={index} stroke="gray" fill="none" size={16} />
                      );
                    })}
                    <span className="ml-1 text-gray-600">({item.rating})</span>
                  </>
                ) : (
                  <span className="text-gray-400 italic">Chưa có đánh giá</span>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="text-red-500">{item.price.toLocaleString("vi-VN")} đ</p>
                <span className="text-xs font-medium">Tồn kho: {item.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Product_total);
