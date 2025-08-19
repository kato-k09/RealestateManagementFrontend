import React, {useState} from 'react';
import {
  Building2,
  Eye,
  EyeOff,
  Info,
  Lock,
  LogIn,
  User,
  UserCheck
} from 'lucide-react';

const Login = ({onLogin, onSwitchToRegister, onBackToLanding, isLoading}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [guestLoading, setGuestLoading] = useState(false);

  // フォームの入力変更処理
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'ユーザー名を入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 通常ログイン送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onLogin(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // ゲストログイン処理
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
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
      <div
          className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
               <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
               Simple Isvest
              </span>
            </div>
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              ユーザーログイン
            </h1>
            <p className="text-gray-600">
              ログインしてご利用ください
            </p>
            <div className="text-center mb-6">
              <button
                onClick={onBackToLanding}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                ← トップページに戻る
              </button>
            </div>
          </div>

          {/* ログインフォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ユーザー名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <div className="relative">
                <div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400"/>
                </div>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="ユーザー名を入力"
                    disabled={isLoading || guestLoading}
                />
              </div>
              {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400"/>
                </div>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="パスワードを入力"
                    disabled={isLoading || guestLoading}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || guestLoading}
                >
                  {showPassword ? (
                      <EyeOff
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
                  ) : (
                      <Eye
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
                  )}
                </button>
              </div>
              {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* ログインボタン */}
            <button
                type="submit"
                disabled={isLoading || guestLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || guestLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isLoading ? (
                  <>
                    <div
                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ログイン中...
                  </>
              ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2"/>
                    ログイン
                  </>
              )}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"/>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>
          </div>

          {/* ゲストログインボタン */}
          <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading || guestLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  isLoading || guestLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {guestLoading ? (
                <>
                  <div
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ゲストログイン中...
                </>
            ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2"/>
                  ゲストとしてログイン
                </>
            )}
          </button>

          {/* ゲストログインの説明 */}
          <div
              className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-start">
              <Info
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"/>
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  ゲストログインについて
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• アカウント登録なしで体験できます</li>
                  <li>• すべての機能を利用可能です</li>
                  <li>• データは他のゲストユーザーと共有されます</li>
                  <li>• 重要なデータは個人アカウントで管理を推奨</li>
                </ul>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">アカウントをお持ちでない場合</p>
            <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none focus:underline"
                disabled={isLoading || guestLoading}
            >
              新規登録はこちら
            </button>
          </div>
        </div>
      </div>
  );
};

export default Login;