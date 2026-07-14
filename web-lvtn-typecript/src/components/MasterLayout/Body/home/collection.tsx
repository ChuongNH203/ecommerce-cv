import React from 'react';
import CollectionCard from './collection-cards';
const laptopImage = require('../../../../assets/asus.jpg');
const laptopImage1 = require('../../../../assets/iphone.jpg');
const laptopImage2 = require('../../../../assets/chuot.jpg');

const Collections: React.FC = () => (
  <div className="space-x-4 flex justify-between gap-5">
    <div className="w-1/3 bg-gray-100">
      {/* Laptop Collection */}
      <CollectionCard 
        title="Laptop Collection" 
        link="/product/category/1" 
        image={laptopImage} 
      />
    </div>

    <div className="w-1/3 bg-gray-100">
      {/* Accessories Collection */}
      <CollectionCard 
        title="Mobile Collection" 
        link="/product/category/9" 
        image={laptopImage1}  
      />
    </div>

    <div className="w-1/3 bg-gray-100">
      {/* Cameras Collection */}
      <CollectionCard 
        title="Mouse Collection" 
        link="/product/category/4" 
        image={laptopImage2} 
      />
    </div>
  </div>
);

export default Collections;