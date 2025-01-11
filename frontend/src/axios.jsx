import axios from 'axios';
import  store  from './store';
import { setToken } from './slices/userAuthSlice';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log(import.meta.env.VITE_BACKEND_URL);


// Add a request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      // Attach the token only if it's available
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle the token refresh if the error is 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('Error response intercepted:', error.response);
      originalRequest._retry = true;
      try {
        console.log('Attempting to refresh token...');
        const response = await api.post('/refresh-token', {}, { withCredentials: true });
        console.log('Received new access token:', response.data);
        const { accessToken } = response.data;
        // Store the new token in Redux
        store.dispatch(setToken({ token: accessToken }));
        // Set the Authorization header with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Retrying request with new access token:', originalRequest.headers);

        // Retry the original request with the new access token
        return api(originalRequest);
      } catch (err) {
        console.error('Error refreshing token:', err);
        store.dispatch(clearCredentials());  // Clear credentials on error
        return Promise.reject(err);
      }
    }

    // If the error is not a 401, reject the promise as usual
    return Promise.reject(error);
  }
);

export default api;

