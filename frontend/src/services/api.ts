import axios from 'axios';

// Point directly to the live backend URL
const API_URL = 'https://joya-backend-pcvr.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- User API ---
export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post('/users/login', { email, password });
  return data;
};

export const registerUser = async (userData: any) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateUserProfile = async (userData: any) => {
  const { data } = await api.put('/users/profile', userData);
  return data;
};

// --- Product API ---
export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// --- Category API ---
export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

// --- Order API ---
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data;
};

export const createOrder = async (order: any) => {
  const { data } = await api.post('/orders', order);
  return data;
};

// --- AdBanner API ---
export const getAdBanners = async () => {
  const { data } = await api.get('/adbanners');
  return data;
};

// --- Admin API ---
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateUser = async (user: any) => {
  const { data } = await api.put(`/users/${user._id}`, user);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await api.post('/products', product);
  return data;
};

export const updateProduct = async (product: any) => {
  const { data } = await api.put(`/products/${product._id}`, product);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export const createCategory = async (category: any) => {
  const { data } = await api.post('/categories', category);
  return data;
};

export const updateCategory = async (category: any) => {
  const { data } = await api.put(`/categories/${category._id}`, category);
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const updateOrderToPaid = async (id: string, paymentResult: any) => {
  const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
  return data;
};

export const updateOrderToDelivered = async (id: string) => {
  const { data } = await api.put(`/orders/${id}/deliver`);
  return data;
};

export const deleteAdBanner = async (id: string) => {
  const { data } = await api.delete(`/adbanners/${id}`);
  return data;
};

export const createAdBanner = async (banner: any) => {
  const { data } = await api.post('/adbanners', banner);
  return data;
};

export const updateAdBanner = async (banner: any) => {
  const { data } = await api.put(`/adbanners/${banner._id}`, banner);
  return data;
};

// --- Gift Card API ---
export const createGiftCard = async (giftCardData: { amount: number; recipientEmail: string }) => {
  const { data } = await api.post('/giftcards', giftCardData);
  return data;
};

export const getGiftCardByCode = async (code: string) => {
  const { data } = await api.get(`/giftcards/${code}`);
  return data;
};

// PRIZE API
export const getPrizes = async () => {
  const { data } = await api.get('/prizes');
  return data;
};

export const getAdminPrizes = async () => {
  const { data } = await api.get('/prizes/admin');
  return data;
};

export const createPrize = async (prizeData: any) => {
  const { data } = await api.post('/prizes', prizeData);
  return data;
};

export const updatePrize = async (prizeData: any) => {
  const { data } = await api.put(`/prizes/${prizeData._id}`, prizeData);
  return data;
};

export const deletePrize = async (id: string) => {
  const { data } = await api.delete(`/prizes/${id}`);
  return data;
};

export const recordSpin = async (prizeId: string) => {
  const { data } = await api.post('/prizes/spin', { prizeId });
  return data;
};

export default api;
