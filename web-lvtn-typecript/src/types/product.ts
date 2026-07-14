export interface Dimension {
  width: number;
  height: number;
  depth: number; // <- sửa từ "length" thành "depth" theo usage thực tế
}

export interface Variant {
  id: number;
  product_id: number;
  variant_name: string;
  color: string;
  size: string | null;
  price: number;
  stock: number;
  sku: string;
  weight: string;
  dimensions: Dimension;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  rating: string | number;
  comment: string;
  date: string;
}

export interface CategoryDetail {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  discount_percentage: number;
  brand: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  specifications?: { 
    id: number;
    spec_name: string;
    spec_value: string;
    spec_group: string;
    created_at: string;
    updated_at: string;
  }[];
  reviews: Review[];
  variants: Variant[];
  categoryDetail?: CategoryDetail;

  // Bắt buộc (để tránh lỗi truyền props)
  price: number;
  stock: number;
  rating: number;
  category: string;
  images: string[];
  sku?: string;
  weight?: string;
  dimensions?: Dimension;
}
export interface ProductImage {
  image_url: string;
}
export interface Variant {
  id: number;
  product_id: number;
  variant_name: string;
  color: string;
  size: string | null;
  price: number;
  stock: number;
  sku: string;
  weight: string;
  dimensions: Dimension;
  created_at: string;
  updated_at: string;
  specifications?: {   // Đảm bảo specifications có thể tồn tại trong variant
    id: number;
    spec_name: string;
    spec_value: string;
    spec_group: string;
    created_at: string;
    updated_at: string;
  }[];
}