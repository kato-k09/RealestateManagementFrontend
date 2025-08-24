import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  Calculator,
  Search,
  Shield,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';

const LandingPage = ({ onGoToLogin = () => {}, onGoToRegister = () => {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Building2 className="w-12 h-12 text-blue-600" />,
      title: "物件管理",
      description: "土地・建物情報の一元管理"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      title: "利回り計算",
      description: "表面・実質利回りの自動算出"
    },
    {
      icon: <Calculator className="w-12 h-12 text-purple-600" />,
      title: "収支管理",
      description: "詳細な収入・支出の考慮"
    },
    {
      icon: <Search className="w-12 h-12 text-orange-600" />,
      title: "検索",
      description: "物件検索・絞り込み"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <span className="block sm:inline">Simple Isvest</span>
                <span className="hidden sm:inline">｜</span>
                <span className="block sm:inline text-sm sm:text-xl">シンプル・インベスト</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={onGoToLogin}
                className="flex items-center space-x-1 sm:space-x-2 bg-white text-blue-600 px-2 sm:px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-blue-200 hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">ログイン</span>
                <span className="xs:hidden sm:hidden">ログイン</span>
              </button>
              <button
                onClick={onGoToRegister}
                className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 sm:px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">新規登録</span>
                <span className="xs:hidden sm:hidden">登録</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインビジュアル */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                不動産投資を
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                シンプルに管理
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              高機能はいらない。シンプルな管理ができればいい。<br />
              そんな方におすすめのシンプルisベストなソリューション。
            </p>
            <div className="flex justify-center">
              <button
                onClick={onGoToRegister}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
              >
                <span>無料で始める</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 浮遊する要素 */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* 主要機能 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              主要機能
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              投資物件の管理から分析まで、必要な機能をオールインワンで提供
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${
                  currentFeature === index ? 'border-blue-300 scale-105' : 'border-transparent'
                }`}
              >
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-center text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 詳細機能 */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              システム機能詳細
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 投資分析機能 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg mr-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800">投資分析機能</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>表面利回り計算</strong> - 年間賃料収入 ÷ 物件価格</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>実質利回り計算</strong> - 経費を考慮した実質的な収益率</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>月収支分析</strong> - 融資込み・除外での収支計算</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>ポートフォリオ分析</strong> - 複数物件の総合分析</span>
                </li>
              </ul>
            </div>

            {/* データ管理機能 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg mr-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800">データ管理機能</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>物件情報管理</strong> - 土地・建物の詳細情報</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>収支情報管理</strong> - 家賃・経費・融資の管理</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>物件検索</strong> - 融資の有無など便利な物件情報絞り込み</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>ユーザー管理</strong> - 登録後のユーザー情報の変更</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* サービスの特徴 */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-6">エクセル管理、面倒じゃないですか？</h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            パソコンに詳しくなくても大丈夫。あなたは画面に従って入力するだけ。<br />
            エクセルやワードを使った物件管理よりずっとシンプルになります。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">投資判断に嬉しい機能</h4>
              <p className="text-indigo-100">融資利用の不動産も融資無し扱いで収支を表示</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">直感的な操作性</h4>
              <p className="text-indigo-100">投資初心者から上級者まで、誰でも簡単に利用可能</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">高いセキュリティ</h4>
              <p className="text-indigo-100">業界標準の暗号化技術でお客様の資産情報を安全に保護</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Simple Isvest｜シンプル・インベスト</span>
            </div>
            <p className="text-gray-400 mb-4">
              不動産投資家のためのシンプルな不動産管理アプリ
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Simple Isvest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;