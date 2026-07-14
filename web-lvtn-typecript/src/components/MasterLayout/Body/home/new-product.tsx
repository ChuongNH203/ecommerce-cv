import React, { useState, useEffect, useRef } from 'react';

import Slider from 'react-slick';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Product } from '../../../../types/product';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';
import { useNavigate } from "react-router-dom";
import ProductCard from './new-product-card';

const BASE_URL = 'http://localhost:3000';
const getFullImageUrl = (img: string | { image_url: string }) => {
  let url = "";
  if (typeof img === "string") {
    url = img;
  } else if (img && typeof img === "object" && "image_url" in img) {
    url = img.image_url;
  }
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

const categoryToIdMap: Record<string, number | undefined> = {
  'Laptop': 1,
  'Màn hình': 2,
  'Bàn phím': 3,
  'Điện thoại': 9,
};

const NewProducts: React.FC = () => {
  const navigate = useNavigate();  // Khởi tạo useNavigate hook
  const [category, setCategory] = useState('Laptops');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<Slider>(null);

  const handleProductClick = (productId: number, variantId: string) => {
    // Điều hướng đến trang chi tiết sản phẩm, truyền productId và variantId qua URL
    navigate(`/product/${productId}/variant/${variantId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category_id = categoryToIdMap[category];
        const params: any = { page: 1, limit: 20 };
        if (category_id) params.category_id = category_id;

        const response = await axiosInstanceL.get("/api/product/list", { params });
        const items = response.data?.data || [];

        const mappedProducts: Product[] = items.map((item: any) => {
          const variants = item.variants || [];
          const reviews = item.reviews || [];
          const averageRating = reviews.length
            ? reviews.reduce((sum: number, r: any) => sum + parseFloat(r.rating), 0) / reviews.length
            : 0;

          const images = item.images?.length
            ? item.images.map((img: any) => getFullImageUrl(img))
            : [getFullImageUrl(item.thumbnail)];

          return {
            id: item.id,
            name: item.name,
            category: item.category,
            category_id: item.category_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            images: images,
            price: parseFloat(variants[0]?.price || '0'),
            discount_percentage: parseFloat(item.discount_percentage || '0'),
            rating: parseFloat(averageRating.toFixed(1)),
            description: item.description,
            stock: variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0),
            brand: item.brand,
            thumbnail: getFullImageUrl(item.thumbnail),
            reviews: reviews,
            variants: variants
          };
        });

        setProducts(mappedProducts);
        setError(null);
      } catch (err) {
        setError('Đã có lỗi xảy ra khi tải sản phẩm!');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <></>,
    prevArrow: <></>,
    cssEase: 'linear',
  };

  if (loading) return <div className="text-center py-4">Đang tải sản phẩm...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className='my-20'>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">SẢN PHẨM HOT</h2>
        <div className="flex gap-8">
          {Object.keys(categoryToIdMap).map((cat) => (
            <button
              key={cat}
              className={`text-gray-600 hover:text-red-600 ${category === cat ? 'underline font-semibold' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <Slider {...settings} ref={sliderRef}>
        {products.map((product) => (
          <div key={product.id} className="px-4" onClick={() => handleProductClick(product.id, product.variants[0]?.variant_name || "")}>
            <ProductCard
              id={product.id}
              name={product.name}
              category={product.category}
              images={product.images}
              price={product.price}
              discount_percentage={product.discount_percentage}
              rating={product.rating}
            />
          </div>
        ))}
      </Slider>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => sliderRef.current?.slickPrev()}
          className="p-1 cursor-pointer rounded-full text-gray-400 hover:bg-red-600 hover:text-white"
        >
          <LeftOutlined className="text-xl" />
        </Button>
        <Button
          onClick={() => sliderRef.current?.slickNext()}
          className="p-1 cursor-pointer rounded-full text-gray-400 hover:bg-red-600 hover:text-white"
        >
          <RightOutlined className="text-xl" />
        </Button>
      </div>
    </div>
  );
};

export default NewProducts;
