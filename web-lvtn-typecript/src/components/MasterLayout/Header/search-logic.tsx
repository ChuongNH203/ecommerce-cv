import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  brand: string;
  variants: {
    name: string;
    price: number;
    stock: number;
  }[];
}

export const useSearchLogic = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/category/list');
        setCategories(response.data.data.items);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsByCategory = async (categoryId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/category/${categoryId}/products`);
      setHoveredCategory(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    }
  };

  const handleBrandSelect = (brand: string) => {
    if (selectedCategoryId) {
      window.location.href = `/product/category/${selectedCategoryId}/brand/${brand}`;
    }
  };

  const handlePriceSelect = (price: string) => {
    if (selectedCategoryId) {
      window.location.href = `/product/category/${selectedCategoryId}/price/${price}`;
    }
  };

  return {
    categories,
    hoveredCategory,
    loading,
    selectedCategoryId,
    setSelectedCategoryId,
    fetchProductsByCategory,
    handleBrandSelect,
    handlePriceSelect
  };
};
