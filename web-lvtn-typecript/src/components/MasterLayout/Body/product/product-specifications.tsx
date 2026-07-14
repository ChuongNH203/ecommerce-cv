import React from "react";

interface ProductSpecificationsProps {
  specifications: any[];   
  openModal: () => void;   // Hàm để mở modal khi nhấn
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications, openModal }) => {
  const [showFullSpecs, setShowFullSpecs] = React.useState<boolean>(false); // Hiển thị toàn bộ thông số

  return (
    <div className="w-full p-4 rounded-lg shadow-md bg-white">
      <div className="bg-gray-100 p-3 font-semibold mt-4">Cấu hình</div>
      <div className="p-3 text-gray-700 space-y-2">
        {/* Sử dụng div với display: table-row và table-cell để tạo cấu trúc bảng */}
        <div className="w-full">
          {specifications.slice(0, showFullSpecs ? specifications.length : 5).map((spec: any, index: number) => (
            <div key={spec.id || index} className="flex border-b border-gray-200 py-2"> {/* flexbox for each row */}
              <div className="w-1/3 text-gray-500 font-normal pr-4"> {/* Left column */}
                {spec.spec_name}
              </div>
              <div className="w-2/3 pl-4"> {/* Right column */}
                {spec.spec_value}
              </div>
            </div>
          ))}
        </div>

        {/* Hiển thị nút "Xem cấu hình chi tiết" nếu số lượng thông số > 5 */}
        {!showFullSpecs && specifications.length > 3 && (
          <button
            onClick={openModal} // Mở modal khi nhấn
            className="text-blue-500 mt-4" // Added some top margin for spacing
          >
            Xem cấu hình chi tiết
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;