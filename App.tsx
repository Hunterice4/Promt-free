
import React, { useState, useCallback, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { UpgradeModal } from './components/UpgradeModal';
import { generateViralScript, generateRandomObject } from './services/geminiService';
import { VisualStyle, ViralScript, CharacterEmotion } from './types';

const MAX_DAILY_LIMIT = 4;
const STORAGE_KEY = 'roast_master_usage';

const App: React.FC = () => {
  const [objectName, setObjectName] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [style, setStyle] = useState<VisualStyle>(VisualStyle.ThreeD);
  const [emotion, setEmotion] = useState<CharacterEmotion>(CharacterEmotion.Angry);
  const [sceneCount, setSceneCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralScript | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  // Helper to get current usage
  const getDailyUsage = (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { date, count } = JSON.parse(stored);
        const today = new Date().toDateString();
        // If it's a new day, reset logic effectively returns 0
        if (date === today) {
          return count;
        }
      }
    } catch (e) {
      console.error("Error reading storage", e);
    }
    return 0;
  };

  // Helper to increment usage
  const incrementUsage = () => {
    try {
      const currentCount = getDailyUsage();
      const data = {
        date: new Date().toDateString(),
        count: currentCount + 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error writing storage", e);
    }
  };

  const handleAutoGenObject = useCallback(async () => {
    try {
      const suggestedName = await generateRandomObject();
      setObjectName(suggestedName);
    } catch (error) {
      console.error("Auto Gen Failed", error);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!objectName.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateViralScript({
        objectName,
        additionalDetails,
        style,
        emotion,
        sceneCount
      });
      setResult(data);
      // Increment usage (optional, keeping it for stats/tracking if needed, but removed the block)
      incrementUsage();
    } catch (error) {
      console.error("Failed to generate script", error);
      alert("เกิดข้อผิดพลาดในการสร้างคอนเทนต์ กรุณาลองใหม่ หรือเช็ค API Key");
    } finally {
      setLoading(false);
    }
  }, [objectName, additionalDetails, style, emotion, sceneCount]);

  return (
    // Changed: Removed h-screen and overflow-hidden for mobile (only lg:h-screen lg:overflow-hidden)
    // Removed: Mobile header block to allow InputSection header to be the main one
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-background relative lg:overflow-hidden">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />

      <InputSection
        objectName={objectName}
        setObjectName={setObjectName}
        additionalDetails={additionalDetails}
        setAdditionalDetails={setAdditionalDetails}
        style={style}
        setStyle={setStyle}
        emotion={emotion}
        setEmotion={setEmotion}
        sceneCount={sceneCount}
        setSceneCount={setSceneCount}
        onGenerate={handleGenerate}
        onAutoGenObject={handleAutoGenObject}
        loading={loading}
      />
      
      <OutputSection
        data={result}
        loading={loading}
      />
    </div>
  );
};

export default App;
