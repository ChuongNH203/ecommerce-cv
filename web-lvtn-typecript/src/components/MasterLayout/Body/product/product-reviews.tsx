import React, { useEffect, useState } from 'react';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';

const BASE_URL = "http://localhost:3000";
interface Review {
  id: number;
  product_id: number;
  rating: string;
  comment: string;
  date: string;
  images: string; 
  userDetail: {
    full_name: string;
    user_name: string;
    avatar: string;
  };
  variantDetail: {
    variant_name: string;
  };
  likes: number;
}

const ProductReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Hàm hiển thị đánh giá sao
  const StarRating = ({ rating, size, color }: { rating: number, size: string, color: string }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${i < rating ? color : 'text-gray-300'} fill-current`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .587l3.668 7.425L24 9.425l-6 5.86 1.414 8.261L12 18.295l-7.414 3.236L6 15.285l-6-5.86 8.332-1.413L12 .587z" />
        </svg>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstanceL.get(`/api/review/product-reviews`, {
          params: { product_id: productId }, // Truyền productId để lấy review cho sản phẩm này
        });
        setReviews(response.data.reviews || []); // Đảm bảo luôn trả về mảng rỗng nếu không có đánh giá
        setLoading(false);
      } catch (err) {
        setReviews( []);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

    const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0) / reviews.length
    : 0;



  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-white p-4 w-full font-sans flex justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">ĐÁNH GIÁ SẢN PHẨM</h1>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="mr-4 text-4xl font-bold text-orange-500">{averageRating.toFixed(1)}</div>
            <div className="text-gray-600 mr-4">trên 5</div>
            <StarRating rating={5} size="w-6 h-6" color="text-orange-500" />
          </div>
        </div>
        <div>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0">
                <div className="flex items-start mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm mr-3">
                      <img src={`${BASE_URL}${review.userDetail.avatar}`}/>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{review.userDetail.full_name}</div>
                    <StarRating rating={parseFloat(review.rating)} size="w-4 h-4" color="text-orange-500" />
                  </div>
                </div>
                <div className="ml-13 text-xs text-gray-500 mb-2">
                  {review.date} | {review.variantDetail.variant_name}
                </div>
                <p className="ml-13 text-gray-700 text-sm mb-3 whitespace-pre-wrap">{review.comment}</p>
                <div className="ml-13 mb-3">
                  {/* Kiểm tra xem `images` có tồn tại không trước khi hiển thị */}
                  {review.images ? (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={`${BASE_URL}${review.images}`} alt="Review media" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-gray-500">Không có hình ảnh</div> // Thông báo nếu không có hình ảnh
                  )}
                </div>

                <div className="ml-13 flex justify-between items-center text-gray-500 text-sm">
                  <div className="flex items-center">
                    <span>{review.likes}</span>
                  </div>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">Không có đánh giá nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
