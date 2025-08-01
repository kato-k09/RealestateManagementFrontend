import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RealEstateRegistrationForm = () => {
  const { authenticatedFetch } = useAuth(); // 認証付きfetch関数を取得

  // 各DTOに対応したstate
  const [projectData, setProjectData] = useState({
    projectName: '',
    isDeleted: false
  });

  const [parcelData, setParcelData] = useState({
    parcelPrice: '',
    parcelAddress: '',
    parcelCategory: '',
    parcelSize: '',
    parcelRemark: '',
    isDeleted: false
  });

  const [buildingData, setBuildingData] = useState({
    buildingPrice: '',
    buildingType: '',
    buildingStructure: '',
    buildingSize: '',
    buildingDate: '',
    buildingRemark: '',
    isDeleted: false
  });

  const [incomeExpensesData, setIncomeExpensesData] = useState({
    rent: '',
    maintenanceCost: '',
    repairFund: '',
    managementFee: '',
    principal: '',
    interest: '',
    tax: '',
    waterBill: '',
    electricBill: '',
    gasBill: '',
    fireInsurance: '',
    other: '',
    isDeleted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // フォーム送信処理（認証対応）
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // 数値フィールドの変換
      const formattedData = {
        project: {
          ...projectData
        },
        parcel: {
          ...parcelData,
          parcelPrice: parseInt(parcelData.parcelPrice) || 0,
          parcelSize: parseFloat(parcelData.parcelSize) || 0.0
        },
        building: {
          ...buildingData,
          buildingPrice: parseInt(buildingData.buildingPrice) || 0,
          buildingSize: parseFloat(buildingData.buildingSize) || 0.0
        },
        incomeAndExpenses: {
          ...incomeExpensesData,
          rent: parseInt(incomeExpensesData.rent) || 0,
          maintenanceCost: parseInt(incomeExpensesData.maintenanceCost) || 0,
          repairFund: parseInt(incomeExpensesData.repairFund) || 0,
          managementFee: parseInt(incomeExpensesData.managementFee) || 0,
          principal: parseInt(incomeExpensesData.principal) || 0,
          interest: parseInt(incomeExpensesData.interest) || 0,
          tax: parseInt(incomeExpensesData.tax) || 0,
          waterBill: parseInt(incomeExpensesData.waterBill) || 0,
          electricBill: parseInt(incomeExpensesData.electricBill) || 0,
          gasBill: parseInt(incomeExpensesData.gasBill) || 0,
          fireInsurance: parseInt(incomeExpensesData.fireInsurance) || 0
        }
      };

      // 認証付きfetchを使用
      const response = await authenticatedFetch('/registerRealestate', {
        method: 'POST',
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        setSubmitMessage('不動産情報が正常に登録されました。');

        // フォームをリセット
        setProjectData({ projectName: '', isDeleted: false });
        setParcelData({
          parcelPrice: '',
          parcelAddress: '',
          parcelCategory: '',
          parcelSize: '',
          parcelRemark: '',
          isDeleted: false
        });
        setBuildingData({
          buildingPrice: '',
          buildingType: '',
          buildingStructure: '',
          buildingSize: '',
          buildingDate: '',
          buildingRemark: '',
          isDeleted: false
        });
        setIncomeExpensesData({
          rent: '',
          maintenanceCost: '',
          repairFund: '',
          managementFee: '',
          principal: '',
          interest: '',
          tax: '',
          waterBill: '',
          electricBill: '',
          gasBill: '',
          fireInsurance: '',
          other: '',
          isDeleted: false
        });
      } else {
        setSubmitMessage('登録に失敗しました。再試行してください。');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('認証')) {
        setSubmitMessage('ログインが必要です。');
      } else {
        setSubmitMessage('通信エラーが発生しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProjectData({ projectName: '', isDeleted: false });
    setParcelData({
      parcelPrice: '', parcelAddress: '', parcelCategory: '',
      parcelSize: '', parcelRemark: '', isDeleted: false
    });
    setBuildingData({
      buildingPrice: '',
      buildingType: '', buildingStructure: '', buildingSize: '',
      buildingDate: '', buildingRemark: '', isDeleted: false
    });
    setIncomeExpensesData({
      rent: '', maintenanceCost: '', repairFund: '', managementFee: '',
      principal: '', interest: '', tax: '', waterBill: '',
      electricBill: '', gasBill: '', fireInsurance: '', other: '', isDeleted: false
    });
  };

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          不動産登録フォーム
        </h1>

        <div className="space-y-8">
          {/* プロジェクト情報 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">プロジェクト情報</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プロジェクト名 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={projectData.projectName}
                    onChange={(e) => setProjectData({...projectData, projectName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="プロジェクト名を入力してください"
                />
              </div>
            </div>
          </div>

          {/* 土地情報 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">土地情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  土地価格 (円)
                </label>
                <input
                    type="number"
                    value={parcelData.parcelPrice}
                    onChange={(e) => setParcelData({...parcelData, parcelPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  土地住所
                </label>
                <input
                    type="text"
                    value={parcelData.parcelAddress}
                    onChange={(e) => setParcelData({...parcelData, parcelAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="土地住所を入力してください"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地目
                </label>
                <input
                    type="text"
                    value={parcelData.parcelCategory}
                    onChange={(e) => setParcelData({...parcelData, parcelCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="地目を入力してください（例：宅地、田、畑、山林など）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  土地面積 (㎡)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={parcelData.parcelSize}
                    onChange={(e) => setParcelData({...parcelData, parcelSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  土地備考
                </label>
                <textarea
                    value={parcelData.parcelRemark}
                    onChange={(e) => setParcelData({...parcelData, parcelRemark: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="土地に関する備考を入力してください"
                />
              </div>
            </div>
          </div>

          {/* 建物情報 */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">建物情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物価格 (円)
                </label>
                <input
                    type="number"
                    value={buildingData.buildingPrice}
                    onChange={(e) => setBuildingData({...buildingData, buildingPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物種別
                </label>
                <select
                    value={buildingData.buildingType}
                    onChange={(e) => setBuildingData({...buildingData, buildingType: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物構造
                </label>
                <select
                    value={buildingData.buildingStructure}
                    onChange={(e) => setBuildingData({...buildingData, buildingStructure: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物面積 (㎡)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={buildingData.buildingSize}
                    onChange={(e) => setBuildingData({...buildingData, buildingSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建築年月日
                </label>
                <input
                    type="date"
                    value={buildingData.buildingDate}
                    onChange={(e) => setBuildingData({...buildingData, buildingDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物備考
                </label>
                <textarea
                    value={buildingData.buildingRemark}
                    onChange={(e) => setBuildingData({...buildingData, buildingRemark: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows="3"
                    placeholder="建物に関する備考を入力してください"
                />
              </div>
            </div>
          </div>

          {/* 収支情報 */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">収支情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  家賃収入 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.rent}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, rent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理費 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.managementFee}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, managementFee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  修繕積立金 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.repairFund}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, repairFund: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理委託費 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.maintenanceCost}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, maintenanceCost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  元本返済 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.principal}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, principal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利息 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.interest}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, interest: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  税金 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.tax}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, tax: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  水道代 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.waterBill}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, waterBill: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電気代 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.electricBill}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, electricBill: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ガス代 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.gasBill}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, gasBill: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  火災保険 (円)
                </label>
                <input
                    type="number"
                    value={incomeExpensesData.fireInsurance}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, fireInsurance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  その他費用
                </label>
                <textarea
                    value={incomeExpensesData.other}
                    onChange={(e) => setIncomeExpensesData({...incomeExpensesData, other: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="その他の費用について入力してください"
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="text-center">
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-md text-white font-semibold ${
                    isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
            >
              {isSubmitting ? '登録中...' : '不動産情報を登録'}
            </button>
          </div>

          {/* メッセージ表示 */}
          {submitMessage && (
              <div className={`text-center p-4 rounded-md ${
                  submitMessage.includes('正常')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage}
              </div>
          )}
        </div>
      </div>
  );
};

export default RealEstateRegistrationForm;