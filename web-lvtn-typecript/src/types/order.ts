// src/types/order.types.ts
export interface OrderItem {
    id: number;
    product_variant: {
      variant_name: string;
      price: number;
      Product: {
        images: { image_url: string }[];
        name: string;
        discount_percentage?: string | number;
      };
    };
    quantity: number;
    total_price: number;
  }
  
  export interface Order {
    id: number;
    total_amount: number;
    order_status: string;
    created_at?: string;
    payment_method?: string;
    voucher_code?: string;
    orderItems?: OrderItem[];
    User?: {
      full_name: string;
    };
  }
  