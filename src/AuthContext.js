import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', userData, {
        withCredentials: true
      });
      setUser(res.data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await axios.get('/api/auth/logout', { withCredentials: true });
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};