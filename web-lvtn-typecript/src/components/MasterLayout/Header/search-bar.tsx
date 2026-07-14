import React, { useState, useEffect } from 'react';
import { Input, Button, Dropdown, Menu, List } from 'antd';
import { MenuOutlined, SearchOutlined, RightOutlined } from '@ant-design/icons';
import { useSearchLogic } from './search-logic';
import { BrandAndPriceContent } from './brandAndPrice-content';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const BASE_URL = "http://localhost:3000";

const removeVietnameseTones = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

interface Product {
  id: number;
  name: string;
  brand: string;
  variants: {
    name: string;
    price: number;
    stock: number;
  }[];
  thumbnail: string;
  price: number;
}

const SearchBar: React.FC = () => {
  const {
    categories,
    hoveredCategory,
    setSelectedCategoryId,
    fetchProductsByCategory,
    handleBrandSelect,
    handlePriceSelect
  } = useSearchLogic();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false); 
  const navigate = useNavigate(); 

  const fetchProducts = async (query: string) => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/product/list', {
        params: { search: query }
      });
      setProducts(response.data.data); 
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500); 

    return () => clearTimeout(timer); 
  }, [searchTerm]);

  const handleProductClick = (id: number) => {
    setSearchTerm(''); 
    navigate(`/product/${id}`);
  };

  const handleSearchOnEnter = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const categoryName = removeVietnameseTones(searchTerm.toLowerCase().trim()); 
      const category = categories.find((cat) =>
        removeVietnameseTones(cat.name.toLowerCase()).includes(categoryName)
      );

      if (category) {
        const categoryId = category.id;
        setSearchTerm('');
        navigate(`/product/category/${categoryId}`); 
      } else {
        fetchProducts(searchTerm);
      }
    }
  };

  const categoryMenu = (
    <Menu>
      {categories.map((category) => (
        <Menu.SubMenu
          key={category.id}
          title={category.name}
          onMouseEnter={() => {
            fetchProductsByCategory(category.id); 
            setSelectedCategoryId(category.id); 
          }}
        >
          <Menu.Item key={`custom-content-${category.id}`} className="p-0 m-0">
            {hoveredCategory && (
              <BrandAndPriceContent
                products={hoveredCategory}
                handleBrandSelect={handleBrandSelect}
                categoryId={category.id}
                handlePriceSelect={handlePriceSelect}
              />
            )}
          </Menu.Item>
        </Menu.SubMenu>
      ))}
    </Menu>
  );



  const handleMouseEnter = () => {
    setIsSearchVisible(true); 
  };

  return (
    <div className="flex items-center relative"  onMouseEnter={handleMouseEnter}>
      <Dropdown overlay={categoryMenu} trigger={['hover']} placement="bottomLeft">
        <Button className="bg-red-600 text-white flex items-center rounded-lg px-4 py-3 mr-4 h-full">
          <MenuOutlined className="mr-2" />
          Danh mục
        </Button>
      </Dropdown>

      <div className="flex-1 bg-white rounded-lg p-2 h-full flex items-center">
        <Input
          placeholder="Nhập để tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchOnEnter}
          className="border-none h-full"
          suffix={<SearchOutlined />}
        />
      </div>

      {searchTerm && !loading && isSearchVisible && (
        <div className="search-results absolute top-full left-0 mt-2 w-full bg-white shadow-lg z-50">
          <List
            bordered
            dataSource={products.slice(0, 5)} 
            renderItem={(item: Product) => (
              <List.Item onClick={() => handleProductClick(item.id)} style={{ cursor: 'pointer' }}>
                <div className="product-item flex items-center">
                  <img 
                    src={`${BASE_URL}${item.thumbnail}`} 
                    alt={item.name} 
                    width={50} 
                  />
                  <div className="product-info ml-2">
                    <div>{item.name}</div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
