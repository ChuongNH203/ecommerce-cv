import React from 'react';

interface Product {
  id: number;
  brand: string;
  variants: {
    price: number;
  }[];
}

interface BrandAndPriceContentProps {
  products: Product[];
  handleBrandSelect: (brand: string) => void;
  categoryId: number;
  handlePriceSelect: (price: string) => void;
}

export const BrandAndPriceContent: React.FC<BrandAndPriceContentProps> = ({
  products,
  handleBrandSelect,
  categoryId,
  handlePriceSelect,
}) => {

  const getMinPrice = () => {
    let minPrice = Number.MAX_VALUE;
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.price < minPrice) {
          minPrice = variant.price;
        }
      });
    });
    return minPrice;
  };


  const categorizePrice = (minPrice: number) => {
    if (minPrice >= 10000000) {
      return ['Dưới 15 triệu', 'Từ 15 đến 20 triệu', 'Trên 20 triệu'];
    } else {
      return ['Dưới 5 triệu', 'Từ 2 đến 5 triệu', 'Trên 5 triệu'];
    }
  };

  // Lấy giá thấp nhất và phân loại giá
  const minPrice = getMinPrice();
  const priceCategories = categorizePrice(minPrice);

  const uniqueBrands = Array.from(new Set(products.map((product) => product.brand)));

  return (
    <div className="flex p-2" style={{ minWidth: '400px' }}>
      {['Thương hiệu', 'Giá bán'].map((title, index) => (
        <div key={index} className={`${index > 0 ? 'border-l border-gray-200 pl-4' : ''} flex-1`}>
          <p className="font-bold text-gray-700 mb-2">{title}</p>
          <ul className="list-none p-0 m-0">
            {title === 'Thương hiệu'
              ? uniqueBrands.map((brand, index) => (
                  <li
                    key={index}
                    className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    {brand}
                  </li>
                ))
              : priceCategories.map((price, index) => (
                  <li
                    key={index}
                    className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePriceSelect(price)}
                  >
                    {price}
                  </li>
                ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
