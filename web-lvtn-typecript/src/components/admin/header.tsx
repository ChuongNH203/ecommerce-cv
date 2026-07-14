import React, { useEffect, useState } from 'react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  const formatVietnameseTime = (date: Date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${day}, ${dd}/${mm}/${yyyy} - ${hh} giờ ${min} phút ${ss} giây`;
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatVietnameseTime(now));
    };

    updateTime(); 
    const interval = setInterval(updateTime, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="bg-white p-3 shadow-sm border-l-8 border-yellow-300 rounded-lg m-6 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sky-950 text-sm font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-black text-xs font-semibold">{currentTime}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
