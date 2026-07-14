import React, { useEffect } from 'react';
import Navigation from '../components/MasterLayout/Body/home/navigation';
import NewsletterSignup from '../components/MasterLayout/Body/home/news-letter-signup';
import Collections from '../components/MasterLayout/Body/home/collection';
import NewProducts from '../components/MasterLayout/Body/home/new-product';
import PromoBanner from '../components/MasterLayout/Body/home/promo-banner';
import TopSelling from '../components/MasterLayout/Body/home/top-selling';
import { useWishlist } from '../components/MasterLayout/Body/Wishlist/wishlist-context';

const Home: React.FC = () => {
    const {  fetchWishlist} = useWishlist();
    useEffect(() => {
        fetchWishlist(); 
    }, []);
    
  return (
    <div >
      <Navigation />
      <div className='bg-white flex-1 px-32 p-14'>
      <Collections/>
      <NewProducts/>
      </div>
      <PromoBanner/>
      <div className='bg-white flex-1 px-32 p-14'>

      <div className="bg-white  ">
    </div>
      </div>
      <NewsletterSignup/>
    </div>
  );
};

export default Home;