import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, User, AlertCircle, UserCheck } from 'lucide-react';

const Login = ({ onLogin, onSwitchToRegister, error, loading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      // ゲストログイン用の固定クレデンシャル
      const guestCredentials = {
        username: 'guest',
        password: 'guest123'
      };

      await onLogin(guestCredentials);
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* ヘッダー */}
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              不動産管理システム
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              アカウントにログインしてください
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
          )}

          {/* ログインフォーム */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* ユーザー名 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザー名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ユーザー名を入力"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pr-10 px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="パスワードを入力"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ログインボタン */}
            <div className="space-y-4">
              <button
                  type="submit"
                  disabled={loading || guestLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      ログイン
                    </>
                )}
              </button>

              {/* ゲストログインボタン */}
              <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading || guestLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {guestLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                ) : (
                    <>
                      <UserCheck className="w-5 h-5 mr-2" />
                      ゲストとしてログイン
                    </>
                )}
              </button>
            </div>

            {/* ゲストログインの説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                ゲストログインについて
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• アカウント登録なしでシステムを体験できます</li>
                <li>• すべての機能を制限なく利用可能です</li>
                <li>• 他のゲストユーザーとデータを共有します</li>
                <li>• 重要なデータは個人アカウントで管理することをお勧めします</li>
              </ul>
            </div>

            {/* 新規登録リンク */}
            <div className="text-center">
              <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                アカウントをお持ちでない方はこちら
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;