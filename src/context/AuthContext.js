import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初期化時にトークン検証
  useEffect(() => {
    validateToken();
  }, []);

  // トークン検証処理（修正版）
  const validateToken = async () => {
    const savedToken = localStorage.getItem('authToken');

    if (!savedToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      // /api/auth/validate を使用（より安全）
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setToken(savedToken);
          setUser(data.userInfo);
          setIsAuthenticated(true);
        } else {
          // トークンが無効
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // エラーレスポンス
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 現在のユーザー情報を取得（必要に応じて使用）
  const getCurrentUser = async (tokenToUse) => {
    if (!tokenToUse) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Get current user error:', error);
    }
    return null;
  };

  // ログイン処理
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功
        const { token: newToken, userInfo } = data;

        setToken(newToken);
        setUser(userInfo);
        setIsAuthenticated(true);

        // ローカルストレージに保存
        localStorage.setItem('authToken', newToken);

        return { success: true, data };
      } else {
        // ログイン失敗
        const errorMessage = data.message || 'ログインに失敗しました';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      // サーバーにログアウト要求を送信（オプション）
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // クライアント側の状態をクリア
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    }
  };

  // ユーザー登録処理
  const register = async (registerData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'ユーザー登録が完了しました' };
      } else {
        const errorMessage = data.message || 'ユーザー登録に失敗しました';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // APIリクエスト用のヘッダーを取得
  const getAuthHeaders = () => {
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  };

  // 認証済みAPIリクエスト用のfetch関数
  const authenticatedFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    // トークンが無効な場合は自動的にログアウト
    if (response.status === 401) {
      await logout();
      throw new Error('認証が切れました。再度ログインしてください。');
    }

    return response;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    getAuthHeaders,
    authenticatedFetch,
    validateToken
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};