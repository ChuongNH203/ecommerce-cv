import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hàm mở/đóng chat
  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState);
  };

    const redirectToZalo = () => {
        window.open('https://zalo.me/0387118144', '_blank'); // Thay số điện thoại Zalo của bạn ở đây
    };
      const redirectToMessenger = () => {
        window.open('https://m.me/100009780633491', '_blank'); 
    };

  return (
    <div>
      {/* Nút Chat */}
      <div
        className="fixed bottom-4 right-4 bg-[#28a745] text-white p-3 rounded-full cursor-pointer shadow-lg flex items-center z-50 hover:bg-[#218838]" // Changed to a specific green from the image
        onClick={toggleChat}
      >

        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold text-lg ml-1">CHAT NGAY</span>
      </div>


      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">

          <div className="bg-[#e6ffe6] text-[#28a745] p-3 flex justify-between items-center rounded-t-lg"> 
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <h3 className="font-semibold text-base">LIÊN HỆ ĐỂ ĐƯỢC TƯ VẤN</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700 p-1">
              <span className="text-2xl leading-none">&times;</span> 
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Zalo (Dùng hình ảnh SVG icon Zalo) */}
            <div onClick={redirectToZalo} className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-all duration-200">
              <div className=" p-0 rounded-full mr-3">
                {/* Zalo SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 48 48">
                  <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path>
                  <path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path>
                  <path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path>
                  <path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path>
                  <path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path>
                  <path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path>
                </svg>
              </div>
              <span className="text-gray-800 text-lg">Nhắn Zalo</span>
            </div>

            {/* Facebook Messenger (Dùng hình ảnh SVG icon Messenger) */}
            <div onClick={redirectToMessenger} className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-all duration-200">
              <div className=" p-0 rounded-full mr-3">
                {/* Messenger SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 48 48">
                  <path fill="#448AFF" d="M24,4C13.5,4,5,12.1,5,22c0,5.2,2.3,9.8,6,13.1V44l7.8-4.7c1.6,0.4,3.4,0.7,5.2,0.7c10.5,0,19-8.1,19-18C43,12.1,34.5,4,24,4z"></path>
                  <path fill="#FFF" d="M12 28L22 17 27 22 36 17 26 28 21 23z"></path>
                </svg>
              </div>
              <span className="text-gray-800 text-lg">Nhắn Facebook Messenger</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;