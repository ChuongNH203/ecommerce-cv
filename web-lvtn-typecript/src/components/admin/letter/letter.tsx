import React, { useState } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';


const AdminSendNewsletter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>(''); 
  const [content, setContent] = useState<string>('');

  const handleSendNewsletter = async () => {
    if (!subject || !content) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung bản tin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstanceL.post('/api/newsletter/send-newsletter', {
        subject,
        content,
      });


      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setSubject(''); 
        setContent('');
      }
    } catch (err) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gửi Bản Tin</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold">Tiêu đề</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Nhập tiêu đề bản tin"
          className="w-full px-4 py-2 border rounded-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">Nội dung</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bản tin"
          rows={5}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleSendNewsletter}
        disabled={isLoading}
      >
        {isLoading ? 'Đang gửi...' : 'Gửi bản tin'}
      </button>

      {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default AdminSendNewsletter;
