import React, { useEffect, useState } from 'react';
import TopProductCard from './top-product-card';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';

const BASE_URL = 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discount_percentage: number;
  rating: number;
  images: { image_url: string }[]; // mảng ảnh từ API
  description?: string;
  stock?: number;
  brand?: string;
  thumbnail?: string;
}

interface TopProductProps {
  title: string;
}

const TopProduct: React.FC<TopProductProps> = ({ title }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category_id = 1;
        const params = { page: 1, limit: 20, category_id };
        const response = await axiosInstanceL.get("/api/product/list", { params });
        setProducts(response.data?.data || []);
        setError(null);
      } catch {
        setError('Đã có lỗi xảy ra khi tải sản phẩm!');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-4">Đang tải sản phẩm...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  const displayedProducts = products.slice(currentIndex * productsPerPage, (currentIndex + 1) * productsPerPage);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 uppercase">{title}</h2>
          <div className="space-x-2">
            <button
              className="bg-white text-gray-600 border-2 hover:bg-red-600 hover:text-white rounded-full px-2 py-1 disabled:opacity-50"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <LeftOutlined />
            </button>
            <button
              className="bg-white text-gray-600 border-2 hover:bg-red-600 hover:text-white rounded-full px-2 py-1 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentIndex === totalPages - 1}
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {displayedProducts.map(product => {
            // Chuyển mảng ảnh object thành mảng string URL đầy đủ
            const imagesFull = product.images?.map(img =>
              img.image_url.startsWith("http") ? img.image_url : `${BASE_URL}/${img.image_url}`
            ) || [];

            return (
              <TopProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                images={imagesFull}
                price={product.price}
                discount_percentage={product.discount_percentage}
                rating={product.rating}
                description={product.description}
                stock={product.stock}
                brand={product.brand}
                thumbnail={product.thumbnail}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
