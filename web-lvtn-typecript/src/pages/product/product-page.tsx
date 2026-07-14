import React, { useState, useEffect, useCallback, useRef } from "react";
import axiosInstanceL from "../../api/api-login/axiosInstance-login";
import Product_total from "../../components/MasterLayout/Body/product/product";
import "../../styles/custom-product.css";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { debounce } from "lodash";

const BASE_URL = "http://localhost:3000";

const OuterContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      style={{ ...props.style, overflowY: "auto" }}
      className="hide-scrollbar"
    >
      {children}
    </div>
  )
);

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

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { categoryId, brand, price } = useParams<{ categoryId: string; brand: string; price: string }>();


  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axiosInstanceL.get("/api/product/list", {
        params: {
          category_id: categoryId,
          brand: brand || "", 
          price: price || "",
        },
      });

      const items = res.data?.data || [];
      const newProducts: Product[] = items.map((item: any) => {
        const reviews = item.reviews || [];
        const variants = item.variants || [];

        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + parseFloat(r.rating), 0) / reviews.length
            : 0;

        const totalStock =
          variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);

        return {
          id: item.id,
          title: item.name,
          price: variants[0]?.price ? parseFloat(variants[0].price) : 0,
          stock: totalStock,
          rating: parseFloat(averageRating.toFixed(1)),
          thumbnail: item.thumbnail?.startsWith("http") ? item.thumbnail : `${BASE_URL}${item.thumbnail}`,
          images: [],
          variants: variants,
        };
      });

      const updatedProducts = newProducts.filter((newProduct) => 
        !products.some((product) => product.id === newProduct.id)
      );

      if (updatedProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prevProducts) => [...prevProducts, ...updatedProducts]);
      console.log('New Products:', updatedProducts);
      if (updatedProducts.length < 10) {
        setHasMore(false); 
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, brand, price, loading, hasMore, products]);


  useEffect(() => {
    setProducts([]); 
    setHasMore(true);  
    fetchProducts();
    
  }, [categoryId, brand, price]);

    fetchProducts();

  const onScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 150) {

    }
  }, [loading, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", onScroll);
    }

    return () => {
      if (container) container.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <OuterContainer
      ref={containerRef}
      style={{ height: "80vh" }}
      className="mx-32"
    >
      <Product_total filterItems={products} />
      {loading && <p className="text-center mt-4">Đang tải...</p>}
      {!hasMore && <p className="text-center mt-4 text-gray-500">Không còn sản phẩm nào.</p>}
    </OuterContainer>
  );
};

export default ProductPage;
