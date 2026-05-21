import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, MapPin, GraduationCap, Mail, Phone, Calendar, 
  ChevronRight, Save, Info, Building2, BookOpen, 
  Map as MapIcon, Home, Smartphone, Globe, Bell, Send
} from 'lucide-react';
import { useStorage } from '../imports/useStorage';

declare const chrome: any;

export default function ProfilePage() {
  const { data, saveData } = useStorage();
  const [profile, setProfile] = useState<any>(data.profile || {});
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const isDark = data.settings?.darkMode === true;

  useEffect(() => {
    if (data.profile) {
      setProfile(data.profile);
    }
  }, [data.profile]);

  const handleChange = (section: string, field: string, value: any) => {
    const updated = {
      ...profile,
      [section]: {
        ...(profile[section] || {}),
        [field]: value
      }
    };
    
    // Auto-sync nested keys to flat keys for complete backward compatibility
    if (section === 'basic') {
      if (field === 'lastName') updated.lastName = value;
      if (field === 'firstName') updated.firstName = value;
      if (field === 'lastNameKana') updated.lastNameKana = value;
      if (field === 'firstNameKana') updated.firstNameKana = value;
      if (field === 'gender') updated.gender = value;
      if (field === 'birthYear') updated.birthYear = value;
      if (field === 'birthMonth') updated.birthMonth = value;
      if (field === 'birthDay') updated.birthDay = value;
    }
    if (section === 'contact') {
      if (field === 'zip') updated.zipCode = value;
      if (field === 'prefecture') updated.pref = value;
      if (field === 'city') updated.city = value;
      if (field === 'address1') updated.address1 = value;
      if (field === 'address2') updated.address2 = value;
      if (field === 'email1') updated.email = value;
      if (field === 'email2') updated.mobileEmail = value;
      if (field === 'telMobile') updated.telMobile = value;
      if (field === 'telHome') updated.telHome = value;
    }
    if (section === 'school') {
      if (field === 'name') updated.schoolName = updated.univName = value;
      if (field === 'category') updated.schoolType = value;
      if (field === 'type') updated.schoolCategory = value;
      if (field === 'department') updated.department = value;
      if (field === 'gradYear') updated.gradYear = updated.univGradYear = value;
      if (field === 'gradMonth') updated.gradMonth = updated.univGradMonth = value;
    }

    setProfile(updated);
    saveData({ profile: updated });
  };

  const handleHolidaySameAsCurrent = (checked: boolean) => {
    if (checked) {
      const updated = {
        ...profile,
        holidayContact: { ...profile.contact },
        settings: { ...profile.settings, holidaySameAsCurrent: true }
      };
      setProfile(updated);
      saveData({ profile: updated });
    } else {
      handleChange('settings', 'holidaySameAsCurrent', false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, description }: any) => (
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
        isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{description}</p>
      </div>
    </div>
  );

  const InputField = ({ label, section, field, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
        {label}
        {required && <span className="text-rose-500 text-[8px] px-1.5 py-0.5 bg-rose-500/10 rounded-md">必須</span>}
      </label>
      <input
        type={type}
        value={profile[section]?.[field] || ''}
        onChange={(e) => handleChange(section, field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${
          isDark 
            ? 'bg-[#1a1d23] border-white/5 text-white focus:border-indigo-500/50' 
            : 'bg-white border-slate-100 text-slate-900 focus:border-indigo-500/50 shadow-sm'
        } outline-none`}
      />
    </div>
  );

  return (
    <div className={`p-10 min-h-full flex flex-col transition-all duration-700 relative overflow-hidden ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      {/* Background Accents */}
      <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-100/40'}`} />
      <div className={`absolute -left-40 -bottom-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-teal-500/5' : 'bg-teal-100/40'}`} />

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <span className="text-[11px] font-black text-indigo-600/80 tracking-[0.5em] uppercase">User Profile</span>
            </div>
            <h1 className={`text-5xl font-black tracking-tighter mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              自動入力<span className="text-indigo-600">情報</span>
            </h1>
          </div>
          <div className={`px-6 py-4 rounded-3xl border shadow-sm flex items-center gap-3 ${
            isDark ? 'bg-[#14171c] border-white/5 text-gray-400' : 'bg-white border-slate-100 text-slate-500'
          }`}>
            <Info className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-bold">入力した情報は暗号化されずローカルに保存されます</span>
          </div>
        </div>

        <div className="space-y-10 pb-20">
          {/* Basic Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#14171c]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}
          >
            <SectionHeader icon={User} title="基本情報" description="Your Identity" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="漢字姓" section="basic" field="lastName" placeholder="姓" required />
                <InputField label="漢字名" section="basic" field="firstName" placeholder="名" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="カナ姓" section="basic" field="lastNameKana" placeholder="セイ" required />
                <InputField label="カナ名" section="basic" field="firstNameKana" placeholder="メイ" required />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">性別</label>
                <div className="flex gap-4">
                  {['男性', '女性', 'その他'].map(gender => (
                    <button
                      key={gender}
                      onClick={() => handleChange('basic', 'gender', gender)}
                      className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                        profile.basic?.gender === gender
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                          : (isDark ? 'bg-[#1a1d23] border-white/5 text-gray-500 hover:border-white/10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200')
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="生年月日 (年)" section="basic" field="birthYear" placeholder="YYYY" required />
                <InputField label="月" section="basic" field="birthMonth" placeholder="MM" required />
                <InputField label="日" section="basic" field="birthDay" placeholder="DD" required />
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#14171c]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}
          >
            <SectionHeader icon={MapPin} title="現住所・連絡先" description="Current Residence & Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <InputField label="郵便番号" section="contact" field="zip" placeholder="000-0000" required />
                <InputField label="都道府県" section="contact" field="prefecture" placeholder="東京都" required />
                <InputField label="市区郡町村" section="contact" field="city" placeholder="千代田区" required />
              </div>
              <div className="md:col-span-2">
                <InputField label="町域・番地" section="contact" field="address1" placeholder="3-3-3" required />
              </div>
              <div className="md:col-span-2">
                <InputField label="建物名・部屋番号" section="contact" field="address2" placeholder="マンション名・号室" />
              </div>
              <InputField label="自宅電話番号" section="contact" field="telHome" placeholder="03-XXXX-XXXX" />
              <InputField label="携帯電話番号" section="contact" field="telMobile" placeholder="090-XXXX-XXXX" required />
              <InputField label="メインメール" section="contact" field="email1" placeholder="example@gmail.com" required />
              <InputField label="予備メール" section="contact" field="email2" placeholder="example2@gmail.com" />
            </div>
          </motion.div>

          {/* Holiday Contact Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#14171c]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}
          >
            <div className="flex items-center justify-between mb-8">
              <SectionHeader icon={Home} title="休暇中連絡先" description="Secondary Residence" />
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>現住所と同じ</span>
                <button
                  onClick={() => handleHolidaySameAsCurrent(!profile.settings?.holidaySameAsCurrent)}
                  className={`w-14 h-8 rounded-full transition-all relative ${
                    profile.settings?.holidaySameAsCurrent ? 'bg-indigo-600' : (isDark ? 'bg-white/5' : 'bg-slate-200')
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${
                    profile.settings?.holidaySameAsCurrent ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
            {!profile.settings?.holidaySameAsCurrent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="grid grid-cols-3 gap-4 md:col-span-2">
                  <InputField label="郵便番号" section="holidayContact" field="zip" placeholder="000-0000" />
                  <InputField label="都道府県" section="holidayContact" field="prefecture" placeholder="東京都" />
                  <InputField label="市区郡町村" section="holidayContact" field="city" placeholder="千代田区" />
                </div>
                <div className="md:col-span-2">
                  <InputField label="町域・番地" section="holidayContact" field="address1" placeholder="3-3-3" />
                </div>
                <div className="md:col-span-2">
                  <InputField label="建物名・部屋番号" section="holidayContact" field="address2" placeholder="マンション名・号室" />
                </div>
                <InputField label="電話番号" section="holidayContact" field="tel" placeholder="03-XXXX-XXXX" />
              </div>
            )}
          </motion.div>

          {/* School Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#14171c]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}
          >
            <SectionHeader icon={GraduationCap} title="学校情報" description="Education History" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* High School Sub-section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>高校・中等教育</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="高校名" section="school" field="highSchoolName" placeholder="〇〇高等学校" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="入学年月 (例: 2020/04)" section="school" field="highSchoolEntry" placeholder="YYYY/MM" />
                    <InputField label="卒業年月 (例: 2023/03)" section="school" field="highSchoolGrad" placeholder="YYYY/MM" />
                  </div>
                </div>
              </div>

              {/* University Sub-section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>大学・大学院・高専</h4>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">学校区分</label>
                <div className="grid grid-cols-3 gap-2">
                  {['大学院', '大学', '高専'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleChange('school', 'category', cat)}
                      className={`py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                        profile.school?.category === cat
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : (isDark ? 'bg-[#1a1d23] border-white/5 text-gray-500' : 'bg-slate-50 border-slate-100 text-slate-500')
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">設置区分</label>
                <div className="grid grid-cols-4 gap-2">
                  {['国立', '公立', '私立', '国外'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleChange('school', 'type', type)}
                      className={`py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                        profile.school?.type === type
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : (isDark ? 'bg-[#1a1d23] border-white/5 text-gray-500' : 'bg-slate-50 border-slate-100 text-slate-500')
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="学校名" section="school" field="name" placeholder="〇〇大学" required />
                <InputField label="学部・学科" section="school" field="department" placeholder="工学部 情報工学科" required />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="入学年月 (例: 2023/04)" section="school" field="entryDate" placeholder="YYYY/MM" />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="卒業予定 (年)" section="school" field="gradYear" placeholder="YYYY" required />
                    <InputField label="月" section="school" field="gradMonth" placeholder="MM" required />
                  </div>
                </div>
                <InputField label="学位" section="school" field="degree" placeholder="学士" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="ゼミ・研究室" section="school" field="seminar" placeholder="AI研究室" />
                <InputField label="クラブ・サークル" section="school" field="club" placeholder="テニス部" />
              </div>
            </div>
          </motion.div>

          {/* Settings & Testing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#14171c]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}
          >
            <SectionHeader icon={Bell} title="通知・動作確認" description="System Verification" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`p-6 rounded-[2rem] border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <div>
                   <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>通知テスト</h4>
                   <p className="text-[10px] font-bold text-gray-500 mt-1">デスクトップ通知が届くか確認します</p>
                 </div>
                 <button
                   onClick={() => {
                     if (typeof chrome !== 'undefined' && chrome.runtime) {
                       chrome.runtime.sendMessage({ action: 'TEST_NOTIFICATION' }, (res: any) => {
                         if (res?.success) alert('テスト通知を送信しました');
                         else alert('通知の送信に失敗しました。ブラウザの設定で通知を許可しているか確認してください。');
                       });
                     } else {
                       alert('この環境では通知テストを実行できません');
                     }
                   }}
                   className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Custom Modal */}
        <AnimatePresence>
          {alertModal.show && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAlertModal({ ...alertModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-500">
                  <Info className="w-8 h-8" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{alertModal.title}</h2>
                  <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{alertModal.message}</p>
                </div>
                <button
                  onClick={() => setAlertModal({ ...alertModal, show: false })}
                  className="w-full py-4 bg-indigo-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
                >
                  OK
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
