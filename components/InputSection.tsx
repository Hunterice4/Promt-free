
import React, { useState } from 'react';
import { VisualStyle, CharacterEmotion } from '../types';
import { SparklesIcon, FaceSmileIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

interface InputSectionProps {
  objectName: string;
  setObjectName: (val: string) => void;
  additionalDetails: string;
  setAdditionalDetails: (val: string) => void;
  style: VisualStyle;
  setStyle: (val: VisualStyle) => void;
  emotion: CharacterEmotion;
  setEmotion: (val: CharacterEmotion) => void;
  sceneCount: number;
  setSceneCount: (val: number) => void;
  onGenerate: () => void;
  onAutoGenObject: () => Promise<void>;
  loading: boolean;
}

const emotionOptions = [
  { type: CharacterEmotion.Angry, label: 'โมโห', icon: '😡' },
  { type: CharacterEmotion.Sarcastic, label: 'ด่านิดๆ', icon: '😏' },
  { type: CharacterEmotion.Cute, label: 'น่ารัก', icon: '🥰' },
  { type: CharacterEmotion.Professional, label: 'มืออาชีพ', icon: '🧐' },
];

export const InputSection: React.FC<InputSectionProps> = ({
  objectName,
  setObjectName,
  additionalDetails,
  setAdditionalDetails,
  style,
  setStyle,
  emotion,
  setEmotion,
  sceneCount,
  setSceneCount,
  onGenerate,
  onAutoGenObject,
  loading
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    await onAutoGenObject();
    setIsSuggesting(false);
  };

  return (
    <div className="w-full lg:w-1/3 p-6 space-y-8 flex flex-col lg:h-full lg:overflow-y-auto bg-[#0a0a14] border-r border-border lg:custom-scrollbar">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
          Roast <span className="text-[#0066ff]">Master</span> AI
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          เปลี่ยนของกินของใช้ ให้ปากแจ๋วด้วยพลัง AI
        </p>
      </div>

      <div className="space-y-6">
        {/* Object Input */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
            👻 สิ่งของที่ต้องการปลุกเสก
          </label>
          <div className="relative group">
            <input
              type="text"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              placeholder="เช่น ทุเรียน, ล้อรถยนต์..."
              className="w-full bg-card border border-border rounded-xl p-4 pr-14 text-white focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all placeholder-gray-600"
            />
            <button
              onClick={handleSuggest}
              disabled={isSuggesting}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all ${
                isSuggesting 
                ? 'bg-gray-800 text-gray-600' 
                : 'bg-[#0066ff]/10 text-[#0066ff] hover:bg-[#0066ff] hover:text-white'
              }`}
              title="สุ่มไอเดียสิ่งของ"
            >
              <SparklesIcon className={`w-5 h-5 ${isSuggesting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Additional Details Input (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <PencilSquareIcon className="w-4 h-4" /> รายละเอียดเพิ่มเติม (Optional)
          </label>
          <input
            type="text"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="เช่น พูดถึงวิธีการดูแลรักษา, บ่นเจ้าของ..."
            className="w-full bg-card border border-border rounded-xl p-4 text-white focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all placeholder-gray-600"
          />
        </div>

        {/* Character Emotion Selection */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <FaceSmileIcon className="w-4 h-4" /> อารมณ์ตัวละคร
          </label>
          <div className="grid grid-cols-2 gap-3">
            {emotionOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setEmotion(opt.type)}
                className={`p-4 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center gap-3 ${
                  emotion === opt.type
                    ? 'bg-[#0066ff]/10 border-[#0066ff] text-white blue-glow'
                    : 'bg-card border-border text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
            🎨 สไตล์ภาพ
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(VisualStyle).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`p-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  style === s
                    ? 'bg-[#0066ff]/10 border-[#0066ff] text-white blue-glow'
                    : 'bg-card border-border text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Scene Count */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
            🎬 จำนวนฉาก (Max 4)
          </label>
          <div className="flex gap-2 bg-card p-1.5 rounded-xl border border-border w-fit">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setSceneCount(num)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-black transition-all duration-300 ${
                  sceneCount === num
                    ? 'bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-auto">
        <button
          onClick={onGenerate}
          disabled={loading || !objectName.trim()}
          className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-[#0066ff]/20 ${
            loading || !objectName.trim()
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-[#0066ff] text-white hover:bg-[#0055dd] active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>กำลังสร้างเนื้อหา...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6" />
              <span>สร้างคอนเทนต์สุดเดือด</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
