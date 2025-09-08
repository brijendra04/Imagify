import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  timeout: 120000, 
});

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  axiosInstance.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  useEffect(() => {
    const loadUserSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const { data } = await axiosInstance.get('/api/users/me');
          if (data.success) {
            setUser(data.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Session load error:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUserSession();
  }, [logout]);

  const loginUser = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/users/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.data.user);
        setShowLogin(false);
        toast.success('Login successful!');
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/users/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.data.user);
        setShowLogin(false);
        toast.success('Registration successful!');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during registration.');
    }
  };

  const generateImage = async (prompt) => {
    if (!prompt?.trim()) {
        toast.error("Prompt cannot be empty.");
        return null;
    }
    
    if (!user || !token) {
        toast.error("Please log in to generate images.");
        setShowLogin(true); 
        return null;
    }
    
    try {
        const { data } = await axiosInstance.post('/api/images/generate', { prompt });
        if (data.success) {
            setUser(prevUser => ({ ...prevUser, creditBalance: data.creditBalance }));
            toast.success('Image generated!');
            return data.image; 
        } else {
            toast.error(data.message || 'Image generation failed.');
            return null;
        }
    } catch (error) {
        console.error('Image generation error:', error);
        if (error.code === 'ECONNABORTED') {
            toast.error('Request timed out. The server is taking too long to respond. Please try again later.');
        } else if (error.response?.status === 401) {
            toast.error('Your session has expired. Please log in again.');
            setShowLogin(true);
        } else if (error.response?.status === 403) {
            toast.error('Insufficient credits. Please purchase more credits.');
        } else if (error.response?.status === 502 || error.response?.status === 503) {
            toast.error('The AI service is currently unavailable. Please try again later.');
        } else if (error.response?.status === 429) {
            toast.error('Too many requests. Please try again later.');
        } else {
            toast.error(error.response?.data?.message || 'An error occurred during image generation.');
        }
        return null;
    }
  };

  const contextValue = useMemo(() => ({
    user,
    token,
    showLogin,
    isLoading,
    setUser,
    setToken,
    setShowLogin,
    loginUser,
    registerUser,
    logout,
    generateImage,
  }), [user, token, showLogin, isLoading, logout]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

