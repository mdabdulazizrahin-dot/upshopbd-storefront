const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('auth_token');
const setToken = (token: string) => localStorage.setItem('auth_token', token);
const removeToken = () => localStorage.removeItem('auth_token');

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }
  return response.json();
};

const uploadImage = async (file: File): Promise<{ url: string; path: string }> => {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_URL}/upload-image`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }
  return response.json();
};

const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data?: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  uploadImage,
};

export { getToken, setToken, removeToken };
export default api;