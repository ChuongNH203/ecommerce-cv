export interface OrderAdminItem {
    id: number;
    name: string;
    quantity: number;
  }
  
  export interface OrderAdmin {
    id: number;
    customer_name: string;
    items: OrderAdminItem[];
    order_status: string;
    total_amount: number;
  }
  