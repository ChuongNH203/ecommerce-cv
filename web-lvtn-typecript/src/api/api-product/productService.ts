import axiosInstance from '../axiosInstance';

export const getAllProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data.products;
};