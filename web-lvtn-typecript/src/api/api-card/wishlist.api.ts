import axiosInstance from "../../api/api-login/axiosInstance-login";

export const WishlistAPI = {
  getWishlist: async () => {
    const res = await axiosInstance.get("/api/wishlist");
    return res.data.items;
  },
  addToWishlist: async (data: { product_id: number; variant_id?: number | null }) => {
    return axiosInstance.post("/api/wishlist", data);
  },
  removeFromWishlist: async (id: number) => {
    return axiosInstance.delete(`/api/wishlist/${id}`);
  },
};