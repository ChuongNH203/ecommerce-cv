import React from 'react';
import TopInformationBar from './top-information-bar';
import SearchBar from './search-bar';
import UserAccountMenu from './cart-wishlist';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <div className="bg-dark text-white">
    <TopInformationBar />

    <div className="flex items-center justify-between px-8 py-4 bg-black">

    <Link to="/home"> 
      <div className="text-4xl font-bold">
        BELO STORE.
      </div>
    </Link>
      <SearchBar />
      <UserAccountMenu />
    </div>
  </div>
);

export default Header;
