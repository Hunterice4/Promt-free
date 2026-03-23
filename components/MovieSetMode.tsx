
import React, { useState } from 'react';
import { generateMovieSetPrompt, generateImage, generateVideo } from '../services/geminiService';
import { SparklesIcon, TrashIcon, PhotoIcon, VideoCameraIcon, UserIcon, UsersIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export const MovieSetMode: React.FC = () => {
  const [char1, setChar1] = useState('Harry Potter');
  const [char2, setChar2] = useState('Hermione Granger');
  const [mode, setMode] = useState<'1char' | '2chars'>('1char');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState<string | null>(null);
  const [hasPaidKey, setHasPaidKey] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio?.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setHasPaidKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      await aistudio.openSelectKey();
      setHasPaidKey(true);
    }
  };

  const handleGenerateImage = async () => {
    if (!char1 || (mode === '2chars' && !char2)) return;
    setLoading(true);
    setImageResult(null);
    setVideoResult(null);
    try {
      const concept = mode === '1char' ? char1 : `${char1} and ${char2}`;
      // Get a detailed prompt for the image
      const prompts = await generateMovieSetPrompt(concept, true); // true for full object
      const parsed = JSON.parse(prompts);
      setImagePrompt(parsed.image_prompt);
      setVideoPrompt(parsed.video_prompt);
      
      const imageUrl = await generateImage(parsed.image_prompt);
      setImageResult(imageUrl);
    } catch (error: any) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเจนรูป: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!imageResult || !videoPrompt) return;
    setVideoLoading(true);
    try {
      const videoUrl = await generateVideo(videoPrompt, imageResult);
      setVideoResult(videoUrl);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("PERMISSION_DENIED")) {
        // Show key selector if permission denied
        const aistudio = (window as any).aistudio;
        if (aistudio?.openSelectKey) {
          if (confirm("คุณยังไม่ได้เชื่อมต่อ Paid API Key หรือ Key ของคุณไม่มีสิทธิ์ใช้งานฟีเจอร์นี้ ต้องการเชื่อมต่อตอนนี้เลยไหม? (จำเป็นสำหรับการสร้างวิดีโอ)")) {
            await aistudio.openSelectKey();
            setHasPaidKey(true);
          }
        } else {
          alert(error.message);
        }
      } else {
        alert("เกิดข้อผิดพลาดในการเจนวิดีโอ: " + error.message);
      }
    } finally {
      setVideoLoading(false);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row w-full lg:h-full bg-background">
      {/* Input Section */}
      <div className="w-full lg:w-1/3 p-6 space-y-8 flex flex-col lg:h-full lg:overflow-y-auto bg-[#0a0a14] border-r border-border">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Abandoned <span className="text-[#0066ff]">Movie</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            สร้างคลิปไวรัลกองถ่ายหนังร้างสุดหลอน
          </p>
        </div>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-card border border-border rounded-xl">
            <button 
              onClick={() => setMode('1char')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${mode === '1char' ? 'bg-[#0066ff] text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <UserIcon className="w-4 h-4" /> 1 ตัวละคร
            </button>
            <button 
              onClick={() => setMode('2chars')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${mode === '2chars' ? 'bg-[#0066ff] text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <UsersIcon className="w-4 h-4" /> 2 ตัวละคร
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                👤 ชื่อตัวละคร {mode === '2chars' ? '1' : ''} / ชื่อเรื่อง
              </label>
              <input 
                type="text"
                value={char1}
                onChange={(e) => setChar1(e.target.value)}
                placeholder="เช่น Harry Potter"
                className="w-full bg-card border border-border rounded-xl p-4 text-white focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            {mode === '2chars' && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  👤 ชื่อตัวละคร 2
                </label>
                <input 
                  type="text"
                  value={char2}
                  onChange={(e) => setChar2(e.target.value)}
                  placeholder="เช่น Hermione Granger"
                  className="w-full bg-card border border-border rounded-xl p-4 text-white focus:outline-none focus:border-[#0066ff]"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={loading || videoLoading || !char1 || (mode === '2chars' && !char2)}
            className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
              loading || videoLoading
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-[#0066ff] text-white hover:bg-[#0055dd] active:scale-95'
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PhotoIcon className="w-6 h-6" />
            )}
            <span>{loading ? 'กำลังเจนรูป...' : '1. เจนรูปภาพ'}</span>
          </button>

          {imageResult && (
            <button
              onClick={handleGenerateVideo}
              disabled={videoLoading || loading}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl animate-fade-in ${
                videoLoading
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
              }`}
            >
              {videoLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <VideoCameraIcon className="w-6 h-6" />
              )}
              <span>{videoLoading ? 'กำลังเจนวิดีโอ...' : '2. เจนวิดีโอ (Veo)'}</span>
            </button>
          )}

          {hasPaidKey === false && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl space-y-3 animate-fade-in mt-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5">⚠️</div>
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  <strong>จำเป็นต้องใช้ Paid API Key:</strong> ฟีเจอร์สร้างรูปภาพคุณภาพสูง ต้องใช้ API Key จากโปรเจกต์ Google Cloud ที่เปิดการเรียกเก็บเงินแล้ว
                </p>
              </div>
              <button 
                onClick={handleOpenKeySelector}
                className="w-full py-2 bg-yellow-500 text-black rounded-lg text-xs font-black hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
              >
                <span>🔑</span>
                เชื่อมต่อ Paid API Key
              </button>
            </div>
          )}

          {/* Example Section */}
          <div className="pt-6 border-t border-border">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">ตัวอย่างผลลัพธ์ (Example)</h4>
            <div className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer" onClick={() => {
              setChar1('Harry Potter');
              setMode('1char');
            }}>
              <img 
                src="https://picsum.photos/seed/abandoned-movie/400/225" 
                alt="Example" 
                className="w-full aspect-video object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="p-3">
                <p className="text-[10px] text-gray-400 font-bold">Abandoned Harry Potter Set</p>
                <p className="text-[9px] text-gray-600 mt-1 italic line-clamp-2">"A hyper-realistic, cinematic wide shot of an abandoned movie set for Harry Potter..."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 bg-[#05050a] lg:h-full lg:overflow-y-auto p-8 flex flex-col items-center">
        {!imageResult && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50">
            <div className="w-32 h-32 bg-card rounded-3xl flex items-center justify-center border-2 border-dashed border-border transform rotate-3">
              <SparklesIcon className="w-16 h-16 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500">พร้อมเนรมิตความหลอน</h3>
            <p className="text-gray-400 max-w-sm">
              ใส่ชื่อตัวละครที่คุณชอบ <br />แล้วผมจะพาพวกเขาไปอยู่ในกองถ่ายหนังร้าง
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-bold animate-pulse">กำลังเจนรูปภาพสไตล์ Abandoned Movie...</p>
          </div>
        )}

        {(imageResult || videoResult) && (
          <div className="w-full max-w-4xl space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Result */}
              {imageResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5 text-[#0066ff]" /> รูปภาพตั้งต้น
                    </h3>
                    <button 
                      onClick={() => handleDownload(imageResult, 'movie-set-image.png')}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="aspect-[9/16] bg-card rounded-3xl overflow-hidden border border-border shadow-2xl">
                    <img src={imageResult} className="w-full h-full object-cover" alt="Generated Movie Set" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              {/* Video Result */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <VideoCameraIcon className="w-5 h-5 text-purple-500" /> วิดีโอไวรัล (Veo)
                </h3>
                {videoLoading ? (
                  <div className="aspect-[9/16] bg-card rounded-3xl border border-border flex flex-col items-center justify-center space-y-4 p-8 text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">กำลังประมวลผลวิดีโอ... <br />อาจใช้เวลา 1-2 นาที</p>
                  </div>
                ) : videoResult ? (
                  <div className="space-y-4">
                    <div className="aspect-[9/16] bg-card rounded-3xl overflow-hidden border border-border shadow-2xl relative group">
                      <video src={videoResult} className="w-full h-full object-cover" controls autoPlay loop />
                      <button 
                        onClick={() => handleDownload(videoResult, 'movie-set-video.mp4')}
                        className="absolute top-4 right-4 p-3 rounded-xl bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowDownTrayIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[9/16] bg-card rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-8 opacity-30">
                    <VideoCameraIcon className="w-12 h-12 text-gray-700 mb-2" />
                    <p className="text-sm text-gray-500">เจนรูปภาพก่อน <br />เพื่อเริ่มสร้างวิดีโอ</p>
                  </div>
                )}
              </div>
            </div>

            {imagePrompt && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-2">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Prompt ที่ใช้</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{imagePrompt}"</p>
              </div>
            )}

            <div className="bg-[#0066ff]/5 border border-[#0066ff]/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-400">
                <strong className="text-[#0066ff]">Tip:</strong> นำ Prompt นี้ไปใช้ใน <span className="font-bold">Luma Dream Machine</span> หรือ <span className="font-bold">Kling AI</span> เพื่อผลลัพธ์ที่ดีที่สุด!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
