import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Category {
  id: number;
  name: string;

}
const Navigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  useEffect(()=>{
    const fetchCategories = async() =>{
      try{
        const res = await axios.get("http://localhost:3000/api/category/list", {
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data.data.items);
      }catch (error){
          console.error("Lỗi lấy danh mục: ", error);
      }
    };
    fetchCategories();
  },[]);

  const isCategorySelected = (categoryId: number) => {
    return location.pathname.includes(`/product/category/${categoryId}`);
  };
  return (
    <nav className="bg-white border-t-4 border-b border-red-600 py-4">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-red-600 font-semibold text-lg">
              Trang chủ
            </Link>
            <Link to="/product" className="text-red-600 font-sans text-lg">
              Tất cả sản phẩm
            </Link>
            {categories.map((cat)=>(
              <Link
                key={cat.id}
                to={`/product/category/${cat.id}`}
                className={`text-gray-600 hover:text-red-600 ${isCategorySelected(cat.id) ? 'font-bold' : ''}`}
              >
              {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;