import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate
import { useQuery } from "@tanstack/react-query";
import axiosInstanceL from "../../api/api-login/axiosInstance-login";
import { useCart } from "../../components/MasterLayout/Body/context";
import { Product } from "../../types/product";
import ProductImages from "../../components/MasterLayout/Body/product/product-images";
import ProductInfo from "../../components/MasterLayout/Body/product/product-info";
import ProductSpecs from "../../components/MasterLayout/Body/product/product-specs";
import ProductReviews from "../../components/MasterLayout/Body/product/product-reviews";
import ProductSpecifications from "../../components/MasterLayout/Body/product/product-specifications";
import ProductSpecificationsModal from "../../components/MasterLayout/Body/product/Product-spec-modal";

const BASE_URL = "http://localhost:3000";

const fetchProduct = async (productId: string | undefined): Promise<Product> => {
  if (!productId) throw new Error("productId undefined");
  const response = await axiosInstanceL.get(`/api/product/detail/${productId}`);
  return response.data.result;
};

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [selectedClassify, setSelectedClassify] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [specifications, setSpecifications] = useState<any[]>([]);  

  const { addToCart } = useCart();
  const navigate = useNavigate();  

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    staleTime: 5 * 60 * 1000,
  });

  const formattedImages = product?.images?.map((img: any) =>
    img.image_url?.startsWith("http") ? img.image_url : `${BASE_URL}${img.image_url}`
  ) || []; 

  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0; 
  const avgRating = product?.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + parseFloat(r.rating.toString()), 0) / product.reviews.length
    : 0;  

    useEffect(() => {
      const selectedVariant = product?.variants?.find(v => v.variant_name === selectedClassify);
      if (!selectedVariant) return;

      navigate(`/product/${productId}/variant/${selectedVariant.variant_name}`, { replace: true });
    
      const fetchSpecs = async () => {
        try {
          const response = await axiosInstanceL.get(`/api/specifications/variant/${selectedVariant.id}`);
          setSpecifications(response.data.data|| []);
        } catch (err) {
          console.error("Không thể tải thông số kỹ thuật", err);
          setSpecifications([]);
        }
      };
    
      fetchSpecs();
    }, [selectedClassify, product, productId, navigate]);
  useEffect(() => {
    if (formattedImages.length > 0) {
      setSelectedImage(formattedImages[0]);
    }
  }, [product]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) return <p className="text-center">Đang tải...</p>;
  if (error || !product) return <p className="text-center text-red-500">Lỗi tải sản phẩm</p>;

  return (
    <>
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages
          images={formattedImages}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
        />

        <ProductInfo
          product={{
            ...product,
            stock: totalStock || 0, 
            rating: avgRating || 0,  
            price: parseFloat(`${product.variants?.[0]?.price ?? "0"}`) || 0, 
          }}
          quantity={quantity}
          increase={() => {
            if (product?.variants?.length && quantity < totalStock) {
              setQuantity(quantity + 1);
            }
          }}
          decrease={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
          selectedClassify={selectedClassify}
          addToCart={addToCart}
          setSelectedClassify={setSelectedClassify}
        />
      </div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <ProductSpecs product={product} selectedClassify={selectedClassify} />
        </div>

        <div className="col-span-2">
          <ProductSpecifications specifications={specifications} openModal={openModal} />
        </div>
      </div>


      <ProductSpecificationsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        specifications={specifications}
      />
    </div>
    <div className="mx-32">
      <ProductReviews productId={product?.id}/> 
    </div>
    </>
  );
};

export default ProductDetailPage;