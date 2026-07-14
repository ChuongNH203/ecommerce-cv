import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

const calculateTimeLeft = () => {
  const targetDate = new Date("2025-12-31T23:59:59");
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) return { days:0, hours:0, minutes:0, seconds:0 };

  return {
    days: Math.floor(difference / (1000 * 3600 * 24)),
    hours: Math.floor((difference % (1000 * 3600 * 24)) / (1000 * 3600)),
    minutes: Math.floor((difference % (1000 * 3600)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
};

const getFullImageUrl = (img: string | { image_url: string }) => {
  let url = '';
  if (typeof img === 'string') {
    url = img;
  } else if (img && typeof img === 'object' && 'image_url' in img) {
    url = img.image_url;
  }
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
};

const PromoBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [leftImage, setLeftImage] = useState<string>('');
  const [rightImage, setRightImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchImagesFromProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstanceL.get('/api/product/list', {
          params: { page: 1, limit: 10, category_id: 1 }
        });
        const items = res.data?.data || [];

        const img1 = getFullImageUrl(items[0]?.images?.[0] || items[0]?.thumbnail || '');
        const img2 = getFullImageUrl(items[1]?.images?.[0] || items[1]?.thumbnail || '');

        setLeftImage(img1);
        setRightImage(img2);
        setError(null);
      } catch (err) {
        setError('Lỗi tải ảnh từ sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchImagesFromProducts();
  }, []);

  if (loading) return <div className="text-center p-8">Đang tải banner...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="flex justify-between items-center p-1 bg-gray-300 h-auto shadow-lg">
      <div className="flex-1 p-4">
        <img src={leftImage} alt="Sản phẩm trái" className="w-full h-auto object-cover rounded-md" />
      </div>
      <div className="flex-1 text-center">
        <div className="flex justify-center gap-6 mb-4">
          {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
            <div key={unit} className="flex flex-col items-center justify-center bg-red-600 rounded-full w-24 h-24 px-4 py-5">
              <div className="text-3xl font-bold text-white">
                {timeLeft[unit as keyof typeof timeLeft]}
              </div>
              <div className="text-sm text-white">{unit.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4">ƯU ĐÃI HOT TUẦN NÀY</h2>
        <p className="text-xl text-gray-600 mb-4">BỘ SƯU TẬP MỚI GIẢM LÊN ĐẾN 50%</p>
        
        <Link to="/product">
          <Button
            type="primary"
            size="large"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full mt-4"
          >
            MUA NGAY
          </Button>
        </Link>
      </div>
      <div className="flex-1 p-4">
        <img src={rightImage} alt="Sản phẩm phải" className="w-full h-auto object-cover rounded-md" />
      </div>
    </div>
  );
};

export default PromoBanner;
