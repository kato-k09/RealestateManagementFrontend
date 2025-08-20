import React, {useEffect, useState} from 'react';
import './index.css';
import {AuthProvider, useAuth} from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage'; // 追加
import Header from './components/Header';
import RealEstateRegistrationForm
  from './components/RealEstateRegistrationForm';
import RealEstateSearch from './components/RealEstateSearch';
import UserProfile from "./components/UserProfile";
import AdminUserManagement from "./components/AdminUserManagement";

// メインアプリケーションコンポーネント（認証後）
const MainApp = () => {
  const {user} = useAuth();
  const [currentView, setCurrentView] = useState('search');

  useEffect(() => {
    if (currentView === 'admin' && user?.role !== 'ADMIN') {
      setCurrentView('search');
    }
  }, [currentView, user]);

  return (
      <div className="min-h-screen bg-gray-50">
        <Header currentView={currentView} setCurrentView={setCurrentView}/>

        <main className="py-6">
          {currentView === 'search' ? (
              <RealEstateSearch/>
          ) : currentView === 'register' ? (
              <RealEstateRegistrationForm/>
          ) : currentView === 'profile' ? (
              <UserProfile/>
          ) : currentView === 'admin' ? (
              <AdminUserManagement/>
          ) : (
              <RealEstateSearch/>
          )}
        </main>
      </div>
  );
};

// 認証管理コンポーネント
const AuthenticationManager = () => {
  const {isAuthenticated, isLoading, login, register} = useAuth();
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', 'register'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ログイン処理
  const handleLogin = async (credentials) => {
    try {
      setError('');
      await login(credentials);
    } catch (error) {
      setError(error.message || 'ログインに失敗しました');
    }
  };

  // ユーザー登録処理
  const handleRegister = async (registerData) => {
    try {
      setError('');
      setSuccessMessage('');

      const result = await register(registerData);

      if (result.success) {
        setSuccessMessage('ユーザー登録が完了しました。ログインしてください。');
        setAuthView('login');
      }
    } catch (error) {
      setError(error.message || 'ユーザー登録に失敗しました');
    }
  };

  // ランディングページに戻る
  const handleBackToLanding = () => {
    setAuthView('landing');
    setError('');
    setSuccessMessage('');
  };

  // ログイン画面に移動
  const handleGoToLogin = () => {
    setAuthView('login');
    setError('');
    setSuccessMessage('');
  };

  // 登録画面に移動
  const handleGoToRegister = () => {
    setAuthView('register');
    setError('');
    setSuccessMessage('');
  };

  // 認証中の場合はローディング表示
  if (isLoading) {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">認証情報を確認中...</p>
          </div>
        </div>
    );
  }

  // 認証済みの場合はメインアプリを表示
  if (isAuthenticated) {
    return <MainApp/>;
  }

  // 未認証の場合はランディング/ログイン/登録画面を表示
  return (
      <div>
        {/* エラーメッセージ */}
        {error && (
            <div
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md shadow-lg z-50">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            </div>
        )}

        {/* 成功メッセージ */}
        {successMessage && (
            <div
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-md shadow-lg z-50">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"/>
                </svg>
                {successMessage}
              </div>
            </div>
        )}

        {/* ランディング/ログイン/登録画面の切り替え */}
        {authView === 'landing' ? (
            <LandingPage onGoToLogin={handleGoToLogin}
             onGoToRegister={handleGoToRegister}/>
        ) : authView === 'login' ? (
            <Login
                onLogin={handleLogin}
                onSwitchToRegister={handleGoToRegister}
                onBackToLanding={handleBackToLanding}
                isLoading={isLoading}
            />
        ) : (
            <Register
                onRegister={handleRegister}
                onBackToLogin={handleGoToLogin}
                onBackToLanding={handleBackToLanding}
                isLoading={isLoading}
            />
        )}
      </div>
  );
};

// メインAppコンポーネント
function App() {
  return (
      <AuthProvider>
        <AuthenticationManager/>
      </AuthProvider>
  );
}

export default App;