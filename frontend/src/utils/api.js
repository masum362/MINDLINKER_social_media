import axios from "axios";

const APP_URL = import.meta.env.VITE_BACKEND_URL;


const api = axios.create({
  baseURL: APP_URL,
});

// Request interceptor to add token dynamically
api.interceptors.request.use(
  (config) => {
    // Get token fresh from localStorage on each request
    const token = JSON.parse(localStorage.getItem("user"))?.token ?? "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const CommonPostUrl = async (url, data) => {
  try {
    const response = await api.post(`${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

const CommonGetUrl = async (url) => {
  try {
    const response = await api.get(`${url}`, {
      headers: {
        "Content-Type": "application/json",
        
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};
const CommonPutUrl = async (url, data) => {
  try {
    const response = await api.put(`${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

const CommonDeleteUrl = async (url) => {
  try {
    const response = await api.delete(`${url}`, {
      headers: {
        // "Content-Type": "application/json",
        
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

const CommonFileUpload = async (data) => {
  try {
    const response = await api.post(
      "https://api.imgbb.com/1/upload?expiration=63072000&key=7dfd97eb382b65ec8ec1a88ce98dfab1",
      data
    );

    console.log(response.data.data.url);
    return response.data.data.url;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export {
  CommonPostUrl,
  CommonGetUrl,
  CommonPutUrl,
  CommonDeleteUrl,
  CommonFileUpload,
};
