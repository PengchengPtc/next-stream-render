import axios from "axios";

const requestInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    timeout: 5000,
  });

requestInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

requestInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return {
        code: -1,
        msg: "未知错误",
        data: null,
      };
    }
  },
  (error) => Promise.reject(error)
);

export default requestInstance;
