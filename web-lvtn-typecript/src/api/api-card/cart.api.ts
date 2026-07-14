import axiosInstanceL from "../api-login/axiosInstance-login";

export interface AddToCartPayload {
  product_id: number;
  variant_id?: number | null;
  quantity: number;
}

export interface UpdateCartPayload {
  cart_item_id: number;
  quantity: number;
}

export const CartAPI = {
  getCart: async () => {
    const res = await axiosInstanceL.get("/api/cart");
    return res.data.items || [];
  },

  addToCart: async (data: AddToCartPayload) => {
    await axiosInstanceL.post("/api/cart/add", data);
  },

  updateQuantity: async (data: UpdateCartPayload) => {
    await axiosInstanceL.put("/api/cart/update", data);
  },

  removeFromCart: async (cart_item_id: number) => {
    await axiosInstanceL.delete(`/api/cart/remove/${cart_item_id}`);
  },
  updateVariantInCart: async (cart_item_id: number, variant_id: number) => {
    const res = await axiosInstanceL.put("/api/cart/update-variant", {
      cart_item_id,
      variant_id,
    });
    return res.data;
  },
};
