import React, {useState} from 'react';
import {Building2, ChevronDown, LogOut, Shield, User} from 'lucide-react';
import {useAuth} from '../context/AuthContext';

const Header = ({currentView, setCurrentView}) => {
  const {user, logout} = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* ロゴとタイトル */}
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8"/>
              <h1 className="text-xl font-bold">Simple Isvest｜シンプル・インベスト</h1>
            </div>

            {/* ナビゲーションメニュー */}
            <div className="hidden md:flex space-x-1">
              <button
                  onClick={() => setCurrentView('search')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                      currentView === 'search'
                          ? 'bg-blue-800 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
              >
                物件検索
              </button>
              <button
                  onClick={() => setCurrentView('register')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                      currentView === 'register'
                          ? 'bg-blue-800 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
              >
                物件登録
              </button>
            </div>

            {/* ユーザーメニュー */}
            <div className="relative">
              <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-500 transition-colors"
              >
                <User className="w-5 h-5"/>
                <span className="hidden sm:block">{user?.displayName
                    || user?.username}</span>
                {isAdmin && (
                    <Shield className="w-4 h-4 text-yellow-300" title="管理者"/>
                )}
                <ChevronDown className="w-4 h-4"/>
              </button>

              {/* ドロップダウンメニュー */}
              {showUserMenu && (
                  <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.displayName}</div>
                      <div className="text-gray-500">{user?.email}</div>
                      {isAdmin && (
                          <div
                              className="flex items-center text-yellow-600 text-xs mt-1">
                            <Shield className="w-3 h-3 mr-1"/>
                            管理者
                          </div>
                      )}
                    </div>
                    <button
                        onClick={() => setCurrentView('profile')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2"/>
                      プロフィール編集
                    </button>

                    {isAdmin && (
                        <button
                            onClick={() => setCurrentView('admin')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Shield className="w-4 h-4 mr-2"/>
                          管理者パネル
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2"/>
                      ログアウト
                    </button>
                  </div>
              )}
            </div>
          </div>

          {/* モバイル用ナビゲーション */}
          <div className="md:hidden border-t border-blue-500 pt-4 pb-4">
            <div className="flex space-x-1">
              <button
                  onClick={() => setCurrentView('search')}
                  className={`flex-1 py-2 px-3 rounded-md text-center transition-colors ${
                      currentView === 'search'
                          ? 'bg-blue-800 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
              >
                物件検索
              </button>
              <button
                  onClick={() => setCurrentView('register')}
                  className={`flex-1 py-2 px-3 rounded-md text-center transition-colors ${
                      currentView === 'register'
                          ? 'bg-blue-800 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
              >
                物件登録
              </button>
            </div>

            {isAdmin && (
                <div className="mt-2">
                  <button
                      onClick={() => setCurrentView('admin')}
                      className={`w-full py-2 px-3 rounded-md text-center transition-colors flex items-center justify-center ${
                          currentView === 'admin'
                              ? 'bg-blue-800 text-white'
                              : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                      }`}
                  >
                    <Shield className="w-4 h-4 mr-2"/>
                    管理者パネル
                  </button>
                </div>
            )}

          </div>
        </div>

        {/* メニューの外側をクリックしたら閉じる */}
        {showUserMenu && (
            <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
            />
        )}
      </nav>
  );
};

export default Header;