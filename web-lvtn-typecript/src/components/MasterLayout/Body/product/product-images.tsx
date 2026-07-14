import React from "react";

interface Props {
  images: string[];
  selectedImage: string | null;
  setSelectedImage: (img: string) => void;
  visibleIndex: number;
  setVisibleIndex: (index: number) => void;
}

const ProductImages: React.FC<Props> = ({ images, selectedImage, setSelectedImage, visibleIndex, setVisibleIndex }) => {
  const prevImages = () => {
    if (visibleIndex > 0) setVisibleIndex(visibleIndex - 1);
  };

  const nextImages = () => {
    if (visibleIndex < images.length - 4) setVisibleIndex(visibleIndex + 1);
  };

  return (
    <div className="w-[600px] h-[600px] bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <div className="w-[400px] h-[400px] flex justify-center items-center rounded-lg overflow-hidden">
        <img src={selectedImage || images[0]} alt="Selected" className="w-full h-full object-contain" />
      </div>

      <div className="relative mt-4 flex justify-center items-center">
        <button
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md disabled:opacity-50"
          onClick={prevImages}
          disabled={visibleIndex === 0}
        >
          ❮
        </button>

        <div className="flex gap-2 overflow-hidden w-[300px] justify-center">
          {images.slice(visibleIndex, visibleIndex + 4).map((img, index) => (
            <img
              key={index}
              className={`w-16 h-16 object-contain rounded-md cursor-pointer border-2 ${
                selectedImage === img ? "border-red-500" : "border-transparent"
              }`}
              src={img}
              alt="Thumbnail"
              onMouseEnter={() => setSelectedImage(img)}
            />
          ))}
        </div>

        <button
          className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md disabled:opacity-50"
          onClick={nextImages}
          disabled={visibleIndex >= images.length - 4}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default ProductImages;