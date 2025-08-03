import React, { useState, useEffect } from 'react';
import { User, Mail, Eye, EyeOff, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // ユーザー情報をフォームに設定
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        displayName: user.displayName || ''
      }));
    }
  }, [user]);

  // フォーム入力の変更処理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

    // メッセージをクリア
    if (message.content) {
      setMessage({ type: '', content: '' });
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors = {};

    // ユーザー名のバリデーション
    if (!formData.username.trim()) {
      newErrors.username = 'ユーザー名を入力してください';
    } else if (formData.username.length < 3) {
      newErrors.username = 'ユーザー名は3文字以上で入力してください';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用可能です';
    }

    // メールアドレスのバリデーション
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // 表示名のバリデーション
    if (!formData.displayName.trim()) {
      newErrors.displayName = '表示名を入力してください';
    }

    // パスワード変更の場合のバリデーション
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '現在のパスワードを入力してください';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = '新しいパスワードを入力してください';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'パスワードは6文字以上で入力してください';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワード確認を入力してください';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // 送信データの準備
      const updateData = {
        username: formData.username,
        email: formData.email,
        displayName: formData.displayName
      };

      // パスワード変更がある場合は追加
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await authenticatedFetch('/changeUserInfo', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          content: 'ユーザー情報が正常に更新されました'
        });

        // パスワードフィールドをクリア
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // 必要に応じてユーザー情報を再取得
        // await refreshUserInfo();

      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          content: errorData.message || '更新に失敗しました'
        });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setMessage({
        type: 'error',
        content: '通信エラーが発生しました'
      });
    } finally {
      setLoading(false);
    }
  };

  // フォームリセット
  const handleReset = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        displayName: user.displayName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setErrors({});
    setMessage({ type: '', content: '' });
  };

  return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md">
          {/* ヘッダー */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <User className="mr-3 text-blue-600" size={28} />
              ユーザー情報変更
            </h1>
            <p className="text-gray-600 mt-2">
              プロフィール情報とパスワードを変更できます
            </p>
          </div>

          {/* メッセージ表示 */}
          {message.content && (
              <div className={`mx-6 mt-6 p-4 rounded-md ${
                  message.type === 'success'
                      ? 'bg-green-100 border border-green-400 text-green-700'
                      : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                  )}
                  {message.content}
                </div>
              </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本情報セクション */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                基本情報
              </h2>

              {/* ユーザー名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザー名 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
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
                      disabled={loading}
                  />
                </div>
                {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="メールアドレスを入力"
                      disabled={loading}
                  />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* 表示名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示名 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.displayName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="表示名を入力"
                      disabled={loading}
                  />
                </div>
                {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                )}
              </div>
            </div>

            {/* パスワード変更セクション */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                パスワード変更（任意）
              </h2>
              <p className="text-sm text-gray-600">
                パスワードを変更しない場合は空欄のままにしてください
              </p>

              {/* 現在のパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在のパスワード
                </label>
                <div className="relative">
                  <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`block w-full pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="現在のパスワードを入力"
                      disabled={loading}
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={loading}
                  >
                    {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              {/* 新しいパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード
                </label>
                <div className="relative">
                  <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`block w-full pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="新しいパスワードを入力（6文字以上）"
                      disabled={loading}
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                  >
                    {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* パスワード確認 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード確認
                </label>
                <div className="relative">
                  <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="新しいパスワードを再入力"
                      disabled={loading}
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                  >
                    {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                リセット
              </button>
              <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      更新中...
                    </>
                ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      更新
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UserProfile;