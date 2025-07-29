import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, Home, MapPin, Calendar, DollarSign, X, Save } from 'lucide-react';

const RealEstateSearch = () => {
  const [realEstateList, setRealEstateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    searchProjectName: '',
    searchParcelAddress: '',
    searchBuildingType: '',
    searchBuildingStructure: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState(null);

  // コンポーネント読み込み時に全データを取得
  useEffect(() => {
    fetchRealEstateList();
  }, []);

  // 物件一覧を取得する関数
  const fetchRealEstateList = async (params = {}) => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();

      // 検索パラメータがある場合はクエリパラメータに追加
      Object.keys(params).forEach(key => {
        if (params[key] && params[key].toString().trim() !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = queryParams.toString()
          ? `/searchRealestate?${queryParams.toString()}`
          : '/searchRealestate';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRealEstateList(data);
      } else {
        setError('データの取得に失敗しました。');
      }
    } catch (error) {
      setError('通信エラーが発生しました。');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 検索実行
  const handleSearch = () => {
    fetchRealEstateList(searchParams);
  };

  // 検索リセット
  const handleReset = () => {
    setSearchParams({
      searchProjectName: '',
      searchParcelAddress: '',
      searchBuildingType: '',
      searchBuildingStructure: ''
    });
    fetchRealEstateList();
  };

  // 詳細表示
  const handleShowDetail = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  // 編集モーダルを開く
  const handleEdit = (property) => {
    // ディープコピーを作成
    const copiedProperty = {
      ...property,
      project: property.project ? {...property.project} : {projectName: '', isDeleted: false},
      parcel: property.parcel ? {...property.parcel} : {
        parcelPrice: 0,
        parcelAddress: '',
        parcelCategory: '',
        parcelSize: 0,
        parcelRemark: '',
        isDeleted: false
      },
      building: property.building ? {...property.building} : {
        buildingPrice: 0,
        buildingType: '',
        buildingStructure: '',
        buildingSize: 0,
        buildingDate: '',
        buildingRemark: '',
        isDeleted: false
      },
      incomeAndExpenses: property.incomeAndExpenses ? {...property.incomeAndExpenses} : {
        rent: 0,
        managementFee: 0,
        repairFund: 0,
        maintenanceCost: 0,
        principal: 0,
        interest: 0,
        tax: 0,
        waterBill: 0,
        electricBill: 0,
        gasBill: 0,
        fireInsurance: 0,
        other: '',
        isDeleted: false
      }
    };
    setEditingProperty(copiedProperty);
    setShowEditModal(true);
  };

  // 編集内容を保存
  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/updateRealestate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProperty)
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchRealEstateList(); // リストを再取得
        alert('更新が完了しました。');
      } else {
        alert('更新に失敗しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('通信エラーが発生しました。');
    }
  };

  // 削除確認モーダルを開く
  const handleDeleteClick = (property) => {
    setDeletingProperty(property);
    setShowDeleteConfirm(true);
  };

  // 削除実行
  const handleDelete = async () => {
    if (!deletingProperty) return;

    try {
      // プロジェクトIDまたは他の一意の識別子を使用
      const projectId = deletingProperty.project?.id || deletingProperty.id;

      const response = await fetch(`/deleteRealestate/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setShowDeleteConfirm(false);
        setDeletingProperty(null);
        fetchRealEstateList(); // リストを再取得
        alert('削除が完了しました。');
      } else {
        alert('削除に失敗しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('通信エラーが発生しました。');
    }
  };

  // 築年数を計算する関数
  const calculateBuildingAge = (buildingDate) => {
    if (!buildingDate) return null;

    const building = new Date(buildingDate);
    const now = new Date();

    let years = now.getFullYear() - building.getFullYear();
    const monthDiff = now.getMonth() - building.getMonth();

    // 月日を考慮して正確な年数を計算
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < building.getDate())) {
      years--;
    }

    return years;
  };

  // 月収支を計算
  const calculateMonthlyProfit = (incomeAndExpenses) => {
    if (!incomeAndExpenses) return 0;

    const income = incomeAndExpenses.rent || 0;
    const expenses = (incomeAndExpenses.managementFee || 0) +
        (incomeAndExpenses.repairFund || 0) +
        (incomeAndExpenses.maintenanceCost || 0) +
        (incomeAndExpenses.principal || 0) +
        (incomeAndExpenses.interest || 0) +
        (incomeAndExpenses.tax || 0) +
        (incomeAndExpenses.waterBill || 0) +
        (incomeAndExpenses.electricBill || 0) +
        (incomeAndExpenses.gasBill || 0) +
        (incomeAndExpenses.fireInsurance || 0);

    return income - expenses;
  };

  // 表面利回りを計算（年間家賃収入 ÷ 物件購入価格 × 100）
  const calculateGrossYield = (property) => {
    if (!property || !property.incomeAndExpenses || !property.incomeAndExpenses.rent) return 0;

    const annualRent = property.incomeAndExpenses.rent * 12;
    const totalPrice = (property.parcel?.parcelPrice || 0) + (property.building?.buildingPrice || 0);

    if (totalPrice === 0) return 0;

    return (annualRent / totalPrice) * 100;
  };

  // 実質利回りを計算（（年間家賃収入 - 年間経費） ÷ 物件購入価格 × 100）
  const calculateNetYield = (property) => {
    if (!property || !property.incomeAndExpenses || !property.incomeAndExpenses.rent) return 0;

    const annualRent = property.incomeAndExpenses.rent * 12;
    const annualExpenses = ((property.incomeAndExpenses.managementFee || 0) +
        (property.incomeAndExpenses.repairFund || 0) +
        (property.incomeAndExpenses.maintenanceCost || 0) +
        (property.incomeAndExpenses.principal || 0) +
        (property.incomeAndExpenses.interest || 0) +
        (property.incomeAndExpenses.tax || 0) +
        (property.incomeAndExpenses.waterBill || 0) +
        (property.incomeAndExpenses.electricBill || 0) +
        (property.incomeAndExpenses.gasBill || 0) +
        (property.incomeAndExpenses.fireInsurance || 0)) * 12;

    const totalPrice = (property.parcel?.parcelPrice || 0) + (property.building?.buildingPrice || 0);

    if (totalPrice === 0) return 0;

    return ((annualRent - annualExpenses) / totalPrice) * 100;
  };

  // 利回りフォーマット
  const formatYield = (yieldValue) => {
    if (!yieldValue || yieldValue === 0) return '0.00%';
    return yieldValue.toFixed(2) + '%';
  };

  // 価格フォーマット
  const formatPrice = (price) => {
    if (!price) return '0円';
    return new Intl.NumberFormat('ja-JP').format(price) + '円';
  };

  // 検索結果の合計を計算する関数
  const calculateTotals = () => {
    const totals = {
      acquisitionPrice: 0,
      rent: 0,
      expenses: 0,
      monthlyProfit: 0,
      count: realEstateList.length
    };

    realEstateList.forEach(property => {
      // 取得価格の合計
      totals.acquisitionPrice += (property.parcel?.parcelPrice || 0) + (property.building?.buildingPrice || 0);

      // 家賃収入の合計
      totals.rent += property.incomeAndExpenses?.rent || 0;

      // 支出の合計
      const propertyExpenses = (property.incomeAndExpenses?.managementFee || 0) +
          (property.incomeAndExpenses?.repairFund || 0) +
          (property.incomeAndExpenses?.maintenanceCost || 0) +
          (property.incomeAndExpenses?.principal || 0) +
          (property.incomeAndExpenses?.interest || 0) +
          (property.incomeAndExpenses?.tax || 0) +
          (property.incomeAndExpenses?.waterBill || 0) +
          (property.incomeAndExpenses?.electricBill || 0) +
          (property.incomeAndExpenses?.gasBill || 0) +
          (property.incomeAndExpenses?.fireInsurance || 0);

      totals.expenses += propertyExpenses;

      // 月収支の合計
      totals.monthlyProfit += calculateMonthlyProfit(property.incomeAndExpenses);
    });

    return totals;
  };

  // 編集用の入力値更新関数
  const updateEditingProperty = (category, field, value) => {
    if (!editingProperty) return;

    setEditingProperty(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          不動産物件検索・一覧
        </h1>

        {/* 検索フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <Search className="mr-2" size={20} />
            検索条件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクト名
              </label>
              <input
                  type="text"
                  value={searchParams.searchProjectName}
                  onChange={(e) => setSearchParams({...searchParams, searchProjectName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="プロジェクト名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                住所
              </label>
              <input
                  type="text"
                  value={searchParams.searchParcelAddress}
                  onChange={(e) => setSearchParams({...searchParams, searchParcelAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="住所を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                種別
              </label>
              <select
                  value={searchParams.searchBuildingType}
                  onChange={(e) => setSearchParams({...searchParams, searchBuildingType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="マンション">マンション</option>
                <option value="アパート">アパート</option>
                <option value="戸建て">戸建て</option>
                <option value="店舗">店舗</option>
                <option value="事務所">事務所</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                構造
              </label>
              <select
                  value={searchParams.searchBuildingStructure}
                  onChange={(e) => setSearchParams({...searchParams, searchBuildingStructure: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="鉄筋コンクリート造">鉄筋コンクリート造</option>
                <option value="鉄骨造">鉄骨造</option>
                <option value="木造">木造</option>
                <option value="軽量鉄骨造">軽量鉄骨造</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? '検索中...' : '検索'}
            </button>
            <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              リセット
            </button>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
        )}

        {/* 物件一覧 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">
              検索結果: {realEstateList.length}件
            </h2>
          </div>

          {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
          ) : realEstateList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                物件が見つかりませんでした。
              </div>
          ) : (
              <div className="divide-y divide-gray-200">
                {realEstateList.map((property, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Home className="mr-2 text-blue-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-800">
                              {property.project?.projectName || '名称未設定'}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="mr-1" size={16} />
                              <span>{property.parcel?.parcelAddress || '住所未設定'}</span>
                            </div>

                            <div className="flex items-center">
                              <Home className="mr-1" size={16} />
                              <span>{property.building?.buildingType || property.parcel?.parcelCategory || '種別未設定'}</span>
                            </div>

                            <div className="flex items-center">
                              <Calendar className="mr-1" size={16} />
                              <span>
                          {property.building?.buildingDate
                              ? `築${calculateBuildingAge(property.building.buildingDate)}年`
                              : '築年月日未設定'}
                        </span>
                            </div>

                            <div className="flex items-center">
                              <DollarSign className="mr-1" size={16} />
                              <span className={calculateMonthlyProfit(property.incomeAndExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          月収支: {formatPrice(calculateMonthlyProfit(property.incomeAndExpenses))}
                        </span>
                            </div>

                            <div className="flex items-center">
                        <span className="text-blue-600 font-medium">
                          表面利回り: {formatYield(calculateGrossYield(property))}
                        </span>
                            </div>

                            <div className="flex items-center">
                        <span className="text-purple-600 font-medium">
                          実質利回り: {formatYield(calculateNetYield(property))}
                        </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                              onClick={() => handleShowDetail(property)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                              title="詳細表示"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                              onClick={() => handleEdit(property)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                              title="編集"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                              onClick={() => handleDeleteClick(property)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="削除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="font-medium text-blue-800">取得価格</div>
                          <div className="text-blue-600">{formatPrice((property.parcel?.parcelPrice || 0) + (property.building?.buildingPrice || 0))}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="font-medium text-green-800">家賃収入</div>
                          <div className="text-green-600">{formatPrice(property.incomeAndExpenses?.rent)}</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <div className="font-medium text-purple-800">支出</div>
                          <div className="text-purple-600">
                            {formatPrice(
                                (property.incomeAndExpenses?.managementFee || 0) +
                                (property.incomeAndExpenses?.repairFund || 0) +
                                (property.incomeAndExpenses?.maintenanceCost || 0) +
                                (property.incomeAndExpenses?.principal || 0) +
                                (property.incomeAndExpenses?.interest || 0) +
                                (property.incomeAndExpenses?.tax || 0) +
                                (property.incomeAndExpenses?.waterBill || 0) +
                                (property.incomeAndExpenses?.electricBill || 0) +
                                (property.incomeAndExpenses?.gasBill || 0) +
                                (property.incomeAndExpenses?.fireInsurance || 0)
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* 合計表示 */}
          {!loading && realEstateList.length > 0 && (() => {
            const totals = calculateTotals();
            return (
                <div className="p-6 bg-gray-100 border-t-2 border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">検索結果の合計</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">物件数</div>
                      <div className="text-2xl font-bold text-gray-800">{totals.count}件</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">取得価格合計</div>
                      <div className="text-2xl font-bold text-blue-600">{formatPrice(totals.acquisitionPrice)}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">家賃収入合計</div>
                      <div className="text-2xl font-bold text-green-600">{formatPrice(totals.rent)}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">支出合計</div>
                      <div className="text-2xl font-bold text-red-600">{formatPrice(totals.expenses)}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">月収支合計</div>
                      <div className={`text-2xl font-bold ${totals.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPrice(totals.monthlyProfit)}
                      </div>
                    </div>
                  </div>

                  {/* 平均値表示 */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">平均取得価格</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatPrice(Math.round(totals.acquisitionPrice / totals.count))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">平均表面利回り</div>
                      <div className="text-xl font-bold text-indigo-600">
                        {totals.acquisitionPrice > 0
                            ? ((totals.rent * 12 / totals.acquisitionPrice) * 100).toFixed(2) + '%'
                            : '0.00%'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-600">平均実質利回り</div>
                      <div className="text-xl font-bold text-purple-600">
                        {totals.acquisitionPrice > 0
                            ? (((totals.rent - totals.expenses) * 12 / totals.acquisitionPrice) * 100).toFixed(2) + '%'
                            : '0.00%'}
                      </div>
                    </div>
                  </div>
                </div>
            );
          })()}
        </div>

        {/* 詳細モーダル */}
        {showDetailModal && selectedProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedProperty.project?.projectName || '物件詳細'}
                    </h2>
                    <button
                        onClick={() => setShowDetailModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* プロジェクト情報 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">プロジェクト情報</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">プロジェクト名:</span> {selectedProperty.project?.projectName || '未設定'}</div>
                    </div>
                  </div>

                  {/* 土地情報 */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">土地情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><span className="font-medium">価格:</span> {formatPrice(selectedProperty.parcel?.parcelPrice)}</div>
                      <div><span className="font-medium">住所:</span> {selectedProperty.parcel?.parcelAddress || '未設定'}</div>
                      <div><span className="font-medium">地目:</span> {selectedProperty.parcel?.parcelCategory || '未設定'}</div>
                      <div><span className="font-medium">面積:</span> {selectedProperty.parcel?.parcelSize ? `${selectedProperty.parcel.parcelSize}㎡` : '未設定'}</div>
                      <div className="md:col-span-2"><span className="font-medium">備考:</span> {selectedProperty.parcel?.parcelRemark || '未設定'}</div>
                    </div>
                  </div>

                  {/* 建物情報 */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">建物情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><span className="font-medium">価格:</span> {formatPrice(selectedProperty.building?.buildingPrice)}</div>
                      <div><span className="font-medium">種別:</span> {selectedProperty.building?.buildingType || '未設定'}</div>
                      <div><span className="font-medium">構造:</span> {selectedProperty.building?.buildingStructure || '未設定'}</div>
                      <div><span className="font-medium">面積:</span> {selectedProperty.building?.buildingSize ? `${selectedProperty.building.buildingSize}㎡` : '未設定'}</div>
                      <div><span className="font-medium">築年月日:</span> {selectedProperty.building?.buildingDate ? new Date(selectedProperty.building.buildingDate).toLocaleDateString('ja-JP') : '未設定'}</div>
                      <div className="md:col-span-2"><span className="font-medium">備考:</span> {selectedProperty.building?.buildingRemark || '未設定'}</div>
                    </div>
                  </div>

                  {/* 収支情報 */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">収支情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><span className="font-medium">家賃収入:</span> {formatPrice(selectedProperty.incomeAndExpenses?.rent)}</div>
                      <div><span className="font-medium">管理費:</span> {formatPrice(selectedProperty.incomeAndExpenses?.managementFee)}</div>
                      <div><span className="font-medium">修繕積立金:</span> {formatPrice(selectedProperty.incomeAndExpenses?.repairFund)}</div>
                      <div><span className="font-medium">管理委託費:</span> {formatPrice(selectedProperty.incomeAndExpenses?.maintenanceCost)}</div>
                      <div><span className="font-medium">元本返済:</span> {formatPrice(selectedProperty.incomeAndExpenses?.principal)}</div>
                      <div><span className="font-medium">利息:</span> {formatPrice(selectedProperty.incomeAndExpenses?.interest)}</div>
                      <div><span className="font-medium">税金:</span> {formatPrice(selectedProperty.incomeAndExpenses?.tax)}</div>
                      <div><span className="font-medium">水道代:</span> {formatPrice(selectedProperty.incomeAndExpenses?.waterBill)}</div>
                      <div><span className="font-medium">電気代:</span> {formatPrice(selectedProperty.incomeAndExpenses?.electricBill)}</div>
                      <div><span className="font-medium">ガス代:</span> {formatPrice(selectedProperty.incomeAndExpenses?.gasBill)}</div>
                      <div><span className="font-medium">火災保険:</span> {formatPrice(selectedProperty.incomeAndExpenses?.fireInsurance)}</div>
                      <div className="md:col-span-3"><span className="font-medium">その他:</span> {selectedProperty.incomeAndExpenses?.other || '未設定'}</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white rounded border-2 border-purple-200">
                        <div className="text-lg font-bold">
                          <span className="text-purple-800">月間収支: </span>
                          <span className={calculateMonthlyProfit(selectedProperty.incomeAndExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPrice(calculateMonthlyProfit(selectedProperty.incomeAndExpenses))}
                      </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-indigo-200">
                        <div className="text-lg font-bold">
                          <span className="text-indigo-800">表面利回り: </span>
                          <span className="text-indigo-600">
                        {formatYield(calculateGrossYield(selectedProperty))}
                      </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-pink-200">
                        <div className="text-lg font-bold">
                          <span className="text-pink-800">実質利回り: </span>
                          <span className="text-pink-600">
                        {formatYield(calculateNetYield(selectedProperty))}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* 編集モーダル */}
        {showEditModal && editingProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      物件情報編集
                    </h2>
                    <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* プロジェクト情報編集 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">プロジェクト情報</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          プロジェクト名
                        </label>
                        <input
                            type="text"
                            value={editingProperty.project?.projectName || ''}
                            onChange={(e) => updateEditingProperty('project', 'projectName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 土地情報編集 */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">土地情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">価格 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.parcel?.parcelPrice || ''}
                            onChange={(e) => updateEditingProperty('parcel', 'parcelPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
                        <input
                            type="text"
                            value={editingProperty.parcel?.parcelAddress || ''}
                            onChange={(e) => updateEditingProperty('parcel', 'parcelAddress', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">地目</label>
                        <input
                            type="text"
                            value={editingProperty.parcel?.parcelCategory || ''}
                            onChange={(e) => updateEditingProperty('parcel', 'parcelCategory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="地目を入力"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">面積 (㎡)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editingProperty.parcel?.parcelSize || ''}
                            onChange={(e) => updateEditingProperty('parcel', 'parcelSize', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                        <textarea
                            value={editingProperty.parcel?.parcelRemark || ''}
                            onChange={(e) => updateEditingProperty('parcel', 'parcelRemark', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 建物情報編集 */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">建物情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">価格 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.building?.buildingPrice || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">種別</label>
                        <select
                            value={editingProperty.building?.buildingType || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="">選択してください</option>
                          <option value="マンション">マンション</option>
                          <option value="アパート">アパート</option>
                          <option value="戸建て">戸建て</option>
                          <option value="店舗">店舗</option>
                          <option value="事務所">事務所</option>
                          <option value="その他">その他</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">構造</label>
                        <select
                            value={editingProperty.building?.buildingStructure || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingStructure', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="">選択してください</option>
                          <option value="鉄筋コンクリート造">鉄筋コンクリート造</option>
                          <option value="鉄骨造">鉄骨造</option>
                          <option value="木造">木造</option>
                          <option value="軽量鉄骨造">軽量鉄骨造</option>
                          <option value="その他">その他</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">面積 (㎡)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editingProperty.building?.buildingSize || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingSize', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">築年月日</label>
                        <input
                            type="date"
                            value={editingProperty.building?.buildingDate || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                        <textarea
                            value={editingProperty.building?.buildingRemark || ''}
                            onChange={(e) => updateEditingProperty('building', 'buildingRemark', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 収支情報編集 */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">収支情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">家賃収入 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.rent || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'rent', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">管理費 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.managementFee || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'managementFee', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">修繕積立金 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.repairFund || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'repairFund', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">管理委託費 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.maintenanceCost || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'maintenanceCost', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">元本返済 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.principal || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'principal', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">利息 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.interest || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'interest', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">税金 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.tax || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'tax', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">水道代 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.waterBill || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'waterBill', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">電気代 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.electricBill || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'electricBill', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ガス代 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.gasBill || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'gasBill', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">火災保険 (円)</label>
                        <input
                            type="number"
                            value={editingProperty.incomeAndExpenses?.fireInsurance || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'fireInsurance', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">その他</label>
                        <textarea
                            value={editingProperty.incomeAndExpenses?.other || ''}
                            onChange={(e) => updateEditingProperty('incomeAndExpenses', 'other', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 保存・キャンセルボタン */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      キャンセル
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                    >
                      <Save className="mr-2" size={18} />
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* 削除確認モーダル */}
        {showDeleteConfirm && deletingProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md m-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">削除の確認</h3>
                <p className="text-gray-600 mb-6">
                  「{deletingProperty.project?.projectName || '名称未設定'}」を削除してよろしいですか？
                  <br />
                  この操作は取り消すことができません。
                </p>
                <div className="flex justify-end gap-4">
                  <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletingProperty(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    キャンセル
                  </button>
                  <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RealEstateSearch;