import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, User, School, MapPin, Mail, Phone, ShieldCheck, Download, Upload, Moon, Globe, Check, AlertCircle, Trash2, Save, Sparkles, Building2, ExternalLink, ChevronRight, Zap, MousePointer2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStorage } from '../imports/useStorage';

declare const chrome: any;

export default function SettingsPage() {
  const { data, saveData } = useStorage();
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'contact' | 'system'>('profile');
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });
  const isDark = data.settings?.darkMode === true;

  const [localProfile, setLocalProfile] = useState(data.profile || {});
  const [isSaved, setIsSaved] = useState(true);
  const isForeignMode = localProfile.isForeignMode || false;
  const vacationSameAsCurrent = localProfile.sameAddress === true;

  useEffect(() => {
    setLocalProfile(data.profile || {});
  }, [data.profile]);

  const handleInputChange = (field: string, value: any) => {
    setLocalProfile((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-sync duplicate/mismatched keys between Website settings and Dashboard
      if (field === 'univJoinYear') updated.enrollYear = value;
      if (field === 'univJoinMonth') updated.enrollMonth = value;
      if (field === 'univGradYear') updated.gradYear = value;
      if (field === 'univGradMonth') updated.gradMonth = value;
      if (field === 'highSchoolName') updated.hsName = value;
      if (field === 'highSchoolPref') updated.hsPref = value;
      if (field === 'highSchoolJoinYear') updated.hsEnrollYear = value;
      if (field === 'highSchoolJoinMonth') updated.hsEnrollMonth = value;
      if (field === 'highSchoolGradYear') updated.hsGradYear = value;
      if (field === 'highSchoolGradMonth') updated.hsGradMonth = value;
      if (field === 'univPref') updated.schoolPref = value;
      if (field === 'schoolName') updated.univName = value;
      
      // Auto-sync flat to nested for ProfilePage compatibility
      if (!updated.basic) updated.basic = {};
      if (!updated.contact) updated.contact = {};
      if (!updated.school) updated.school = {};
      
      if (field === 'lastName') updated.basic.lastName = value;
      if (field === 'firstName') updated.basic.firstName = value;
      if (field === 'lastNameKana') updated.basic.lastNameKana = value;
      if (field === 'firstNameKana') updated.basic.firstNameKana = value;
      if (field === 'gender') updated.basic.gender = value;
      if (field === 'birthYear') updated.basic.birthYear = value;
      if (field === 'birthMonth') updated.basic.birthMonth = value;
      if (field === 'birthDay') updated.basic.birthDay = value;
      
      if (field === 'zipCode') updated.contact.zip = value;
      if (field === 'pref') updated.contact.prefecture = value;
      if (field === 'city') updated.contact.city = value;
      if (field === 'address1') updated.contact.address1 = value;
      if (field === 'address2') updated.contact.address2 = value;
      if (field === 'email') updated.contact.email1 = value;
      if (field === 'mobileEmail') updated.contact.email2 = value;
      if (field === 'telMobile') updated.contact.telMobile = value;
      if (field === 'telHome') updated.contact.telHome = value;
      
      if (field === 'schoolName' || field === 'univName') updated.school.name = value;
      if (field === 'schoolType') updated.school.category = value;
      if (field === 'schoolCategory') updated.school.type = value;
      if (field === 'department') updated.school.department = value;
      if (field === 'univGradYear' || field === 'gradYear') updated.school.gradYear = value;
      if (field === 'univGradMonth' || field === 'gradMonth') updated.school.gradMonth = value;
      
      return updated;
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    saveData({ profile: localProfile });
    setIsSaved(true);
    const btn = document.getElementById('save-btn');
    if (btn) {
      btn.classList.add('scale-95', 'opacity-50');
      setTimeout(() => btn.classList.remove('scale-95', 'opacity-50'), 200);
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shukatsu-dash-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <>
    <div className={`h-full flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      <div className={`px-10 py-8 border-b transition-all ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-teal-500/10 text-teal-400 shadow-teal-500/5' : 'bg-teal-50 text-[#0d9488] shadow-teal-500/10'}`}>
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>情報入力・設定</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Profile & Preferences</p>
            </div>
          </div>
          <button 
            id="save-btn"
            onClick={handleSave}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all shadow-2xl ${
              isSaved 
                ? (isDark ? 'bg-white/5 text-gray-500' : 'bg-slate-100 text-slate-400')
                : 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-500/20'
            }`}
          >
            <Save className="w-5 h-5" />
            {isSaved ? '保存済み' : '変更を保存する'}
          </button>
        </div>
        
        <div className={`mt-6 flex items-center gap-3 px-6 py-4 rounded-2xl border ${isDark ? 'bg-teal-500/5 border-teal-500/10' : 'bg-teal-50 border-teal-100'}`}>
          <ShieldCheck className="w-5 h-5 text-teal-500" />
          <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-teal-400/70' : 'text-teal-700'}`}>
            <span className="font-black uppercase mr-2">Secure:</span> ご入力いただいた情報はブラウザ内にのみ保存され、外部通信は一切行われません。
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`w-72 border-r p-8 space-y-2 transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-white border-slate-100'}`}>
          {[
            { id: 'profile', label: '基本情報', icon: User, color: 'text-indigo-500' },
            { id: 'contact', label: '連絡先・住所', icon: Mail, color: 'text-rose-500' },
            { id: 'academic', label: '学歴・活動', icon: School, color: 'text-amber-500' },
            { id: 'system', label: 'システム管理', icon: SettingsIcon, color: 'text-teal-500' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-[13px] transition-all group ${
                activeTab === tab.id 
                  ? (isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-[#0d9488] shadow-sm') 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'opacity-40 group-hover:opacity-100'}`} />
                {tab.label}
              </div>
              {activeTab === tab.id && <div className={`w-1.5 h-1.5 rounded-full ${tab.color} shadow-lg`} />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="max-w-4xl space-y-12 pb-40"
            >
              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <h3 className={`text-2xl font-black tracking-tight flex items-center gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />基本情報
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <InputField label="姓" field="lastName" value={localProfile.lastName} onChange={handleInputChange} isDark={isDark} placeholder="山田" />
                    <InputField label="名" field="firstName" value={localProfile.firstName} onChange={handleInputChange} isDark={isDark} placeholder="太郎" />
                    <InputField label="セイ（フリガナ）" field="lastNameKana" value={localProfile.lastNameKana} onChange={handleInputChange} isDark={isDark} placeholder="ヤマダ" />
                    <InputField label="メイ（フリガナ）" field="firstNameKana" value={localProfile.firstNameKana} onChange={handleInputChange} isDark={isDark} placeholder="タロウ" />
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">性別</label>
                      <div className="flex items-center gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value="男" checked={localProfile.gender === '男'} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>男</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value="女" checked={localProfile.gender === '女'} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>女</span>
                        </label>
                        <button type="button" onClick={() => handleInputChange('gender', '')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                          リセット
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">生年月日</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <select value={localProfile.birthYear || ''} onChange={(e) => handleInputChange('birthYear', e.target.value)} className={`flex-1 px-3 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white text-center' : 'bg-white border border-slate-100 text-slate-900 text-center shadow-sm'}`}>
                            <option value="">[-▼-]</option>
                            {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          <span className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>年</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={localProfile.birthMonth || ''} onChange={(e) => handleInputChange('birthMonth', e.target.value)} className={`flex-1 px-3 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white text-center' : 'bg-white border border-slate-100 text-slate-900 text-center shadow-sm'}`}>
                            <option value="">[-▼-]</option>
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <span className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>月</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={localProfile.birthDay || ''} onChange={(e) => handleInputChange('birthDay', e.target.value)} className={`flex-1 px-3 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white text-center' : 'bg-white border border-slate-100 text-slate-900 text-center shadow-sm'}`}>
                            <option value="">[-▼-]</option>
                            {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <span className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>日</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-12">
                  <h3 className={`text-2xl font-black tracking-tight flex items-center gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <div className="w-1.5 h-8 bg-rose-500 rounded-full" />連絡先・住所
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 md:col-span-1"><InputField label="メールアドレス（メイン）" field="email" value={localProfile.email} onChange={handleInputChange} isDark={isDark} placeholder="example@univ.ac.jp" /></div>
                    <div className="col-span-2 md:col-span-1"><InputField label="メールアドレス（サブ）" field="mobileEmail" value={localProfile.mobileEmail} onChange={handleInputChange} isDark={isDark} placeholder="example@gmail.com" /></div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">携帯電話</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="text" value={localProfile.phone1_1 || ''} onChange={(e) => handleInputChange('phone1_1', e.target.value)} placeholder="090" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                        <input type="text" value={localProfile.phone1_2 || ''} onChange={(e) => handleInputChange('phone1_2', e.target.value)} placeholder="1234" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                        <input type="text" value={localProfile.phone1_3 || ''} onChange={(e) => handleInputChange('phone1_3', e.target.value)} placeholder="5678" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">自宅・固定電話</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="text" value={localProfile.phone2_1 || ''} onChange={(e) => handleInputChange('phone2_1', e.target.value)} placeholder="03" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                        <input type="text" value={localProfile.phone2_2 || ''} onChange={(e) => handleInputChange('phone2_2', e.target.value)} placeholder="1234" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                        <input type="text" value={localProfile.phone2_3 || ''} onChange={(e) => handleInputChange('phone2_3', e.target.value)} placeholder="5678" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                      </div>
                    </div>
                    <InputField label="郵便番号" field="zipCode" value={localProfile.zipCode} onChange={handleInputChange} isDark={isDark} placeholder="123-4567" />
                    <div className="space-y-3 col-span-2 md:col-span-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">都道府県</label>
                      <div className="flex items-center gap-3">
                        <select value={localProfile.pref || ''} onChange={(e) => handleInputChange('pref', e.target.value)} disabled={isForeignMode} className={`flex-1 px-6 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'} ${isForeignMode ? 'opacity-50' : ''}`}>
                          <option value="">[-▼-]</option>
                          {['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => handleInputChange('isForeignMode', !isForeignMode)} className={`px-4 py-4 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap ${isForeignMode ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : (isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}>
                          海外在住の方はこちら
                        </button>
                      </div>
                    </div>
                    {isForeignMode && (
                      <div className="col-span-2">
                        <InputField label="国・地域" field="country" value={localProfile.country} onChange={handleInputChange} isDark={isDark} placeholder="アメリカ合衆国" />
                      </div>
                    )}
                    <div className="col-span-2"><InputField label="市区町村" field="city" value={localProfile.city} onChange={handleInputChange} isDark={isDark} placeholder="渋谷区" /></div>
                    <InputField label="番地" field="address1" value={localProfile.address1} onChange={handleInputChange} isDark={isDark} placeholder="道玄坂1-2-3" />
                    <InputField label="建物名・部屋番号" field="address2" value={localProfile.address2} onChange={handleInputChange} isDark={isDark} placeholder="サクラマンション101" />
                  </div>

                  <div className={`w-full h-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                  
                  <div className="space-y-6">
                    <h4 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      休暇中の連絡先
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${vacationSameAsCurrent ? 'bg-teal-500 border-teal-500' : (isDark ? 'border-white/20 group-hover:border-white/40' : 'border-slate-300 group-hover:border-slate-400')}`}>
                          {vacationSameAsCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={vacationSameAsCurrent} onChange={(e) => handleInputChange('sameAddress', e.target.checked)} />
                        <div>
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>現住所と同じ場合はこちらにチェックしてください</span>
                          <p className="text-xs font-bold text-rose-500 mt-1">※チェックを入れる場合は休暇中住所は入力しないでください。</p>
                        </div>
                      </label>
                    </div>

                    <div className={`grid grid-cols-2 gap-8 transition-opacity duration-300 ${vacationSameAsCurrent ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                      <div className="col-span-2">
                        <InputField label="郵便番号 (休暇中)" field="vacationZipCode" value={localProfile.vacationZipCode} onChange={handleInputChange} isDark={isDark} placeholder="123-4567" disabled={vacationSameAsCurrent} />
                      </div>
                      <div className="space-y-3 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">都道府県 (休暇中)</label>
                        <select disabled={vacationSameAsCurrent || isForeignMode} value={localProfile.vacationPref || ''} onChange={(e) => handleInputChange('vacationPref', e.target.value)} className={`w-full px-6 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'} ${(vacationSameAsCurrent || isForeignMode) ? 'opacity-50' : ''}`}>
                          <option value="">[-▼-]</option>
                          {['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2"><InputField label="市区町村 (休暇中)" field="vacationCity" value={localProfile.vacationCity} onChange={handleInputChange} isDark={isDark} placeholder="渋谷区" disabled={vacationSameAsCurrent} /></div>
                      <InputField label="番地 (休暇中)" field="vacationAddress1" value={localProfile.vacationAddress1} onChange={handleInputChange} isDark={isDark} placeholder="道玄坂1-2-3" disabled={vacationSameAsCurrent} />
                      <InputField label="建物名・部屋番号 (休暇中)" field="vacationAddress2" value={localProfile.vacationAddress2} onChange={handleInputChange} isDark={isDark} placeholder="サクラマンション101" disabled={vacationSameAsCurrent} />
                      <div className="col-span-2">
                        <InputField label="電話番号 (休暇中)" field="vacationPhone" value={localProfile.vacationPhone} onChange={handleInputChange} isDark={isDark} placeholder="090-1234-5678" disabled={vacationSameAsCurrent} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-12">
                  <h3 className={`text-2xl font-black tracking-tight flex items-center gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full" />学歴・活動
                  </h3>
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <InputField label="出身高校名" field="highSchoolName" value={localProfile.highSchoolName} onChange={handleInputChange} isDark={isDark} placeholder="〇〇高等学校" />
                       <InputField label="高校所在地" field="highSchoolPref" value={localProfile.highSchoolPref ?? localProfile.schoolPref ?? ''} onChange={handleInputChange} isDark={isDark} placeholder="東京都" />
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">高校入学（年月）</label>
                         <div className="grid grid-cols-2 gap-2">
                           <input type="number" value={localProfile.highSchoolJoinYear || ''} onChange={(e) => handleInputChange('highSchoolJoinYear', e.target.value)} placeholder="2018" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`} />
                           <input type="number" value={localProfile.highSchoolJoinMonth || ''} onChange={(e) => handleInputChange('highSchoolJoinMonth', e.target.value)} placeholder="4" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`} />
                         </div>
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">高校卒業（年月）</label>
                         <div className="grid grid-cols-2 gap-2">
                           <input type="number" value={localProfile.highSchoolGradYear || ''} onChange={(e) => handleInputChange('highSchoolGradYear', e.target.value)} placeholder="2021" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`} />
                           <input type="number" value={localProfile.highSchoolGradMonth || ''} onChange={(e) => handleInputChange('highSchoolGradMonth', e.target.value)} placeholder="3" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`} />
                         </div>
                       </div>
                    </div>
                    <div className={`w-full h-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField label="大学名" field="schoolName" value={localProfile.schoolName} onChange={handleInputChange} isDark={isDark} placeholder="〇〇大学" />
                      <InputField label="大学名（フリガナ）" field="schoolNameKana" value={localProfile.schoolNameKana} onChange={handleInputChange} isDark={isDark} placeholder="マルマルダイガク" />
                      <InputField label="大学所在地" field="univPref" value={localProfile.univPref} onChange={handleInputChange} isDark={isDark} placeholder="東京都" />
                      <InputField label="学位" field="degree" value={localProfile.degree} onChange={handleInputChange} isDark={isDark} placeholder="学士" />
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">文理区分</label>
                         <select value={localProfile.schoolClass || '文系'} onChange={(e) => handleInputChange('schoolClass', e.target.value)} className={`w-full px-6 py-4 rounded-2xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`}>
                           <option value="文系" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>文系</option>
                           <option value="理系" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>理系</option>
                         </select>
                       </div>
                      <InputField label="学部名" field="faculty" value={localProfile.faculty} onChange={handleInputChange} isDark={isDark} placeholder="◯◯学部" />
                      <InputField label="学科名" field="department" value={localProfile.department} onChange={handleInputChange} isDark={isDark} placeholder="◯◯学科" />
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">大学入学（年月）</label>
                         <div className="grid grid-cols-2 gap-2">
                           <input type="number" value={localProfile.univJoinYear || ''} onChange={(e) => handleInputChange('univJoinYear', e.target.value)} placeholder="2021" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                           <input type="number" value={localProfile.univJoinMonth || ''} onChange={(e) => handleInputChange('univJoinMonth', e.target.value)} placeholder="4" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                         </div>
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">大学卒業予定（年月）</label>
                         <div className="grid grid-cols-2 gap-2">
                           <input type="number" value={localProfile.univGradYear || ''} onChange={(e) => handleInputChange('univGradYear', e.target.value)} placeholder="2025" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                           <input type="number" value={localProfile.univGradMonth || ''} onChange={(e) => handleInputChange('univGradMonth', e.target.value)} placeholder="3" className={`w-full px-4 py-4 rounded-2xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-white border border-slate-100 text-slate-900 shadow-sm'}`} />
                         </div>
                       </div>
                      <InputField label="ゼミ・研究室" field="seminar" value={localProfile.seminar} onChange={handleInputChange} isDark={isDark} placeholder="〇〇研究室" />
                      <InputField label="サークル・活動" field="club" value={localProfile.club} onChange={handleInputChange} isDark={isDark} placeholder="テニスサークル" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-12">
                   <h3 className={`text-2xl font-black tracking-tight flex items-center gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                     <div className="w-1.5 h-8 bg-teal-500 rounded-full" />システム管理
                   </h3>
                   <div className="space-y-6">
                     <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>データ管理</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <button onClick={exportData} className={`flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-black text-sm transition-all ${isDark ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-teal-50 text-[#0d9488] border border-teal-100 shadow-lg shadow-teal-500/5 hover:bg-teal-100'}`}>
                         <Download className="w-5 h-5" /> バックアップ出力 (JSON)
                       </button>
                       <label className={`flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-black text-sm transition-all cursor-pointer ${isDark ? 'bg-white/5 text-white border border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border border-slate-100 shadow-sm hover:bg-slate-50'}`}>
                         <Upload className="w-5 h-5" /> データのインポート
                         <input 
                           type="file" 
                           className="hidden" 
                           accept=".json"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onload = (ev) => {
                                 try {
                                   const imported = JSON.parse(ev.target?.result as string);
                                   setConfirmModal({
                                     show: true,
                                     title: 'データのインポート',
                                     message: 'データを上書きしてインポートしますか？現在のデータは消去されます。',
                                     onConfirm: () => {
                                       saveData(imported);
                                       setAlertModal({ show: true, title: '完了', message: 'インポートが完了しました。ページをリロードします。' });
                                       setTimeout(() => window.location.reload(), 1500);
                                     }
                                   });
                                 } catch (err) {
                                   setAlertModal({ show: true, title: 'エラー', message: '不正なファイル形式です。' });
                                 }
                               };
                               reader.readAsText(file);
                             }
                           }}
                         />
                       </label>
                     </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>通知テスト</h4>
                      <button 
                        onClick={() => {
                          chrome.runtime.sendMessage({ action: 'TEST_NOTIFICATION' }, (res) => {
                            if (res?.success) {
                              setAlertModal({ show: true, title: '通知テスト', message: 'テスト通知を送信しました。ブラウザの通知設定がONになっているか確認してください。' });
                            }
                          });
                        }}
                        className={`flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-black text-sm transition-all ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-lg shadow-indigo-500/5 hover:bg-indigo-100'}`}
                      >
                         <ShieldCheck className="w-5 h-5" /> 通知の動作確認をする
                      </button>
                   </div>

                   <div className="space-y-6">
                      <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>自動化設定 (BETA)</h4>
                      <div className="space-y-4">
                         <ToggleItem 
                            label="オートログイン支援" 
                            description="保存されたID/Passがある場合、ページを開いた時に自動入力します。"
                            icon={Zap}
                            value={data.settings?.autoLogin} 
                            onChange={(v) => saveData({ settings: { ...data.settings, autoLogin: v } })}
                            isDark={isDark}
                         />
                         <ToggleItem 
                            label="ログインボタン自動クリック" 
                            description="自動入力後、ログインボタンを自動的にクリックしてログインを完了します。"
                            icon={MousePointer2}
                            value={data.settings?.autoClickLogin} 
                            onChange={(v) => saveData({ settings: { ...data.settings, autoClickLogin: v } })}
                            isDark={isDark}
                         />
                      </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-red-500/10">
                       <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Danger Zone</h4>
                       <div className={`p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 flex items-center justify-between`}>
                          <div>
                            <h5 className="text-[15px] font-black text-red-500">全データの消去</h5>
                            <p className="text-[11px] font-bold text-red-400/80 mt-1">保存されている企業情報、ES、メモ、プロフィールを含む全てのデータを完全に削除します。</p>
                          </div>
                          <button 
                            onClick={() => {
                              setConfirmModal({
                                show: true,
                                title: '全データの消去',
                                message: '本当に全てのデータを削除しますか？この操作は取り消せません。',
                                onConfirm: () => {
                                  chrome.storage.local.clear(() => {
                                    setAlertModal({ show: true, title: '完了', message: '全てのデータが削除されました。' });
                                    setTimeout(() => window.location.reload(), 1500);
                                  });
                                }
                              });
                            }}
                            className="px-8 py-4 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                          >
                            データを完全に消去
                          </button>
                       </div>
                    </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
      </div>
    </div>

      <AnimatePresence>
        {alertModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAlertModal({ ...alertModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto text-teal-500">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{alertModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{alertModal.message}</p>
              </div>
              <button
                onClick={() => setAlertModal({ ...alertModal, show: false })}
                className="w-full py-4 bg-teal-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}

        {confirmModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{confirmModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{confirmModal.message}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                  className={`flex-1 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal({ ...confirmModal, show: false });
                  }}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all"
                >
                  確定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

function InputField({ label, field, value, onChange, isDark, placeholder, disabled }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(field, e.target.value)} 
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-6 py-4 rounded-2xl outline-none font-bold text-sm transition-opacity ${isDark ? 'bg-white/5 border border-white/5 text-white focus:border-indigo-500/50' : 'bg-white border border-slate-100 text-slate-900 focus:border-indigo-500/50 shadow-sm'} ${disabled ? 'opacity-50' : ''}`} 
      />
    </div>
  );
}

function ToggleItem({ label, description, icon: Icon, value, onChange, isDark }: any) {
  return (
    <div className={`p-6 rounded-[2rem] border flex items-center justify-between transition-all ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${value ? 'bg-teal-500/10 text-teal-500' : 'bg-slate-50 text-slate-300'}`}>
           <Icon className="w-5 h-5" />
        </div>
        <div>
          <h5 className={`text-[15px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</h5>
          <p className="text-[11px] font-bold text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => onChange(!value)}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${value ? 'bg-teal-600 shadow-lg shadow-teal-500/20' : 'bg-slate-200 dark:bg-white/5'}`}
      >
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
