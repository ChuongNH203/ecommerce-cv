import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://new-api-url.com', // Thay API URL đúng ở đây
    withCredentials: true,
  });
export default axiosInstance;
