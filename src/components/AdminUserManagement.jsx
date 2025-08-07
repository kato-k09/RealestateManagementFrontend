import React, {useEffect, useState} from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Lock,
  Shield,
  Users
} from 'lucide-react';
import {useAuth} from '../context/AuthContext';

const AdminUserManagement = () => {
  const {authenticatedFetch} = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');

  // モーダル用のフォーム状態
  const [formData, setFormData] = useState({
    role: 'USER',
    enabled: true,
    unlockAccount: false
  });

  // 初期データ取得
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUsers = async () => {
    try {
      const response = await authenticatedFetch(
          'http://localhost:8080/api/admin/users');

      if (!response.ok) {
        if (response.status === 403) {
          setError('管理者権限が必要です');
        } else {
          setError('ユーザー情報の取得に失敗しました');
        }
        return;
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      role: user.role || 'USER',
      enabled: user.enabled !== false,
      unlockAccount: false
    });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      role: 'USER',
      enabled: true,
      unlockAccount: false
    });
    // モーダルを閉じる時はモーダル内のエラーと成功メッセージをクリア
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      return;
    }

    setUpdating(true);
    setError('');

    try {
      const requestData = {
        role: formData.role,
        enabled: formData.enabled,
        loginFailedAttempts: formData.unlockAccount ? 0
            : (selectedUser.loginFailedAttempts || 0),
        accountLockedUntil: formData.unlockAccount ? null
            : selectedUser.accountLockedUntil
      };

      const response = await authenticatedFetch(
          `http://localhost:8080/api/admin/users/${selectedUser.id}/statusChange`,
          {
            method: 'PUT',
            body: JSON.stringify(requestData)
          });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'ステータスの更新に失敗しました');
        return;
      }

      // ユーザーリストを再取得
      await fetchUsers();

      // 即座にモーダルを閉じる
      closeModal();

      // メイン画面に成功メッセージを表示
      setSuccess('ユーザーステータスを更新しました');

    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleColor = (role) => {
    return role === 'ADMIN' ? 'text-red-600 bg-red-100'
        : 'text-blue-600 bg-blue-100';
  };

  const getStatusColor = (enabled) => {
    return enabled ? 'text-green-600 bg-green-100'
        : 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600"/>
              <h1 className="text-3xl font-bold text-gray-900">管理者パネル</h1>
            </div>
            <p className="mt-2 text-gray-600">システム内の全ユーザーを管理できます</p>
          </div>

          {/* エラー表示 */}
          {error && (
              <div
                  className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2"/>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
          )}
          {/* 成功メッセージ表示 */}
          {success && (
              <div
                  className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2"/>
                  <span className="text-green-700">{success}</span>
                </div>
              </div>
          )}

          {/* ユーザーテーブル */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-2"/>
                <h2 className="text-lg font-semibold text-gray-900">
                  ユーザー一覧 ({users.length}名)
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ロール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終ログイン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                              className="text-sm font-medium text-gray-900">{user.displayName}</div>
                          <div
                              className="text-sm text-gray-500">@{user.username}</div>
                          <div
                              className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                              user.role)}`}>
                        {user.role}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                        <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                user.enabled)}`}>
                          {user.enabled ? '有効' : '無効'}
                        </span>
                          {user.accountLockedUntil && new Date(
                              user.accountLockedUntil) > new Date() && (
                              <Lock className="h-4 w-4 text-red-500"
                                    title="アカウントロック中"/>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? new Date(
                                user.lastLoginAt).toLocaleString('ja-JP')
                            : '未ログイン'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                            onClick={() => openModal(user)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1"/>
                          編集
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ステータス変更モーダル */}
          {showModal && selectedUser && (
              <div
                  className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div
                    className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        ユーザーステータス変更
                      </h3>
                      <button
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-600"
                      >
                        <span className="sr-only">閉じる</span>
                        ×
                      </button>
                    </div>

                    {/* ユーザー情報表示 */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div
                          className="text-sm font-medium text-gray-900">{selectedUser.displayName}</div>
                      <div
                          className="text-sm text-gray-500">@{selectedUser.username}</div>
                      <div
                          className="text-sm text-gray-500">{selectedUser.email}</div>
                    </div>

                    {/* エラーメッセージ */}
                    {error && (
                        <div
                            className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <AlertTriangle
                                className="h-5 w-5 text-red-600 mr-2"/>
                            <span className="text-red-700">{error}</span>
                          </div>
                        </div>
                    )}
                    {/* フォーム */}
                    <div className="space-y-4">
                      {/* ロール選択 */}
                      <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">
                          ロール
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData(
                                {...formData, role: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="USER">USER</option>
                          <option value="GUEST">GUEST</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>

                      {/* 有効/無効選択 */}
                      <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">
                          ユーザーステータス
                        </label>
                        <select
                            value={formData.enabled ? 'enabled' : 'disabled'}
                            onChange={(e) => setFormData({
                              ...formData,
                              enabled: e.target.value === 'enabled'
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="enabled">有効</option>
                          <option value="disabled">無効</option>
                        </select>
                      </div>

                      {/* アカウントロック解除 */}
                      <div>
                        <label className="flex items-center">
                          <input
                              type="checkbox"
                              checked={formData.unlockAccount}
                              onChange={(e) => setFormData({
                                ...formData,
                                unlockAccount: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                        アカウントロックを解除する
                      </span>
                        </label>
                        {selectedUser.accountLockedUntil && new Date(
                            selectedUser.accountLockedUntil) > new Date() && (
                            <p className="mt-1 text-xs text-red-600">
                              現在ロック中: {new Date(
                                selectedUser.accountLockedUntil).toLocaleString(
                                'ja-JP')}まで
                            </p>
                        )}
                      </div>

                      {/* ボタン */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={updating}
                        >
                          キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={updating}
                        >
                          {updating ? (
                              <div className="flex items-center">
                                <div
                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                更新中...
                              </div>
                          ) : (
                              '更新'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdminUserManagement;