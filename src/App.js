import React, { useState } from 'react';
import './index.css';
import RealEstateRegistrationForm from './components/RealEstateRegistrationForm';
import RealEstateSearch from './components/RealEstateSearch';

function App() {
  const [currentView, setCurrentView] = useState('search'); // 'register' or 'search'

  return (
      <div className="App">
        {/* ナビゲーション */}
        <nav className="bg-blue-600 text-white p-4 mb-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">不動産投資管理システム</h1>
            <div className="space-x-4">
              <button
                  onClick={() => setCurrentView('search')}
                  className={`px-4 py-2 rounded ${
                      currentView === 'search' ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-400'
                  }`}
              >
                物件検索
              </button>
              <button
                  onClick={() => setCurrentView('register')}
                  className={`px-4 py-2 rounded ${
                      currentView === 'register' ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-400'
                  }`}
              >
                物件登録
              </button>
            </div>
          </div>
        </nav>

        {/* メインコンテンツ */}
        {currentView === 'search' ? (
            <RealEstateSearch />
        ) : (
            <RealEstateRegistrationForm />
        )}
      </div>
  );
}

export default App;