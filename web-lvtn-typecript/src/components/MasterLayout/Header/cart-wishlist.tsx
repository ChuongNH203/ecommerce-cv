import React from 'react';
import { Badge } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../Body/context';
import { useWishlist } from '../Body/Wishlist/wishlist-context';  // import hook wishlist
import { Link } from 'react-router-dom';

const CartWishlist: React.FC = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist(); 

 
  const totalQuantity = cartItems.length;

  
  const wishlistCount = wishlistItems.length;

  return (
    <div className="flex gap-8 items-center">
  
      <div className="flex flex-col items-center">
        <Link to="/wish-list">
          <Badge count={wishlistCount} className="text-white">
            <HeartOutlined className="text-white text-xl cursor-pointer" />
          </Badge>
        </Link>
        <div className="text-xs ml-2 cursor-pointer">Mục yêu thích</div>
      </div>

      {/* Cart */}
      <div className="flex flex-col items-center">
        <Link to="/cart-list">
          <Badge count={totalQuantity} className="text-white">
            <ShoppingCartOutlined className="text-white text-xl cursor-pointer" />
          </Badge>
        </Link>
        <div className="text-xs ml-2 cursor-pointer">Giỏ hàng</div>
      </div>
    </div>
  );
};

export default CartWishlist;
