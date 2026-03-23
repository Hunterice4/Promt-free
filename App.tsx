
import React, { useState, useEffect } from 'react';
import { ObjectMode } from './components/ObjectMode';
import { CharacterMode } from './components/CharacterMode';
import { StoryMode } from './components/StoryMode';
import { setCustomApiKey } from './services/geminiService';
import { CubeIcon, UserIcon, BookOpenIcon, Cog6ToothIcon, XMarkIcon, KeyIcon, PhotoIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'object' | 'character' | 'story'>('object');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [skipImages, setSkipImages] = useState(localStorage.getItem('skip_images') === 'true');

  useEffect(() => {
    setCustomApiKey(apiKey);
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('skip_images', skipImages.toString());
  }, [skipImages]);

  // Security: Disable Right Click & F12
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-24 bg-[#0a0a14] border-r border-border flex flex-col items-center py-8 space-y-6 z-50 shrink-0">
        <div className="text-[#0066ff] font-black text-2xl mb-4">AP</div>
        
        <button 
          onClick={() => setActiveTab('object')}
          className={`p-4 rounded-2xl transition-all ${activeTab === 'object' ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          title="ปลุกเสกสิ่งของ"
        >
          <CubeIcon className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>

        <button 
          onClick={() => setActiveTab('character')}
          className={`p-4 rounded-2xl transition-all ${activeTab === 'character' ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          title="สร้างตัวละคร"
        >
          <UserIcon className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>

        <button 
          onClick={() => setActiveTab('story')}
          className={`p-4 rounded-2xl transition-all ${activeTab === 'story' ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          title="แต่งเนื้อเรื่อง"
        >
          <BookOpenIcon className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>

        <div className="mt-auto pb-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            title="ตั้งค่า"
          >
            <Cog6ToothIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a14] border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-[#0066ff]" /> ตั้งค่า (Settings)
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* API Key Input */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <KeyIcon className="w-4 h-4" /> Gemini API Key
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="ใส่ API Key ของคุณที่นี่..."
                    className="w-full bg-card border border-border rounded-xl p-4 text-white focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  * หากไม่ใส่ จะใช้ Key ส่วนกลางของระบบ (ถ้ามี)
                </p>
              </div>

              {/* Skip Images Toggle */}
              <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0066ff]/10 flex items-center justify-center">
                    <PhotoIcon className="w-6 h-6 text-[#0066ff]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">ไม่สร้างรูปภาพ</h4>
                    <p className="text-[10px] text-gray-500">เจนเฉพาะข้อความ (เร็วขึ้นมาก)</p>
                  </div>
                </div>
                <button
                  onClick={() => setSkipImages(!skipImages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    skipImages ? 'bg-[#0066ff]' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      skipImages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 rounded-xl font-black bg-[#0066ff] text-white hover:bg-[#0055dd] transition-all active:scale-95"
              >
                บันทึกและปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden relative bg-background">
        {activeTab === 'object' && <ObjectMode />}
        {activeTab === 'character' && <CharacterMode />}
        {activeTab === 'story' && <StoryMode />}
      </div>
    </div>
  );
};

export default App;
