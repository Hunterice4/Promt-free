
import { GoogleGenAI, Type } from "@google/genai";
import { GenerateParams, ViralScript, CharacterEmotion } from "../types";

const RANDOM_OBJECTS = [
  "ทุเรียนหลงฤดู", "ยาดมหมดอายุ", "หมอนข้างเน่า", "พัดลมเสียงดัง", 
  "ล้อรถซิ่ง", "ส้มตำปูปลาร้า", "รองเท้าแตะขาด", "กระทะไหม้", 
  "สายชาร์จแบตพัง", "หูฟังข้างเดียว", "กาแฟเย็นที่ละลายแล้ว",
  "แบตสำรองบวม", "ไม้แขวนเสื้อเบี้ยว", "ถุงเท้าคู่ไม่เหมือน",
  "ร่มรั่วตอนฝนตก", "กระเป๋าตังค์ใบเก่า", "คีย์บอร์ดปุ่มหาย",
  "มาม่ารสเผ็ดจัด", "แอร์ที่มีแต่ลมร้อน", "รีโมททีวีที่กดยาก",
  "แปรงสีฟันขนบาน", "เสื้อแถมจากปั๊มน้ำมัน", "น้ำพริกนรก"
];

export const generateRandomObject = async (): Promise<string> => {
  const randomIndex = Math.floor(Math.random() * RANDOM_OBJECTS.length);
  return RANDOM_OBJECTS[randomIndex];
};

export const generateViralScript = async (params: GenerateParams): Promise<ViralScript> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  // Check if user provided additional details
  const userContext = params.additionalDetails && params.additionalDetails.trim() !== ""
    ? `\n    SPECIFIC USER CONTEXT (YOU MUST INCORPORATE THIS): "${params.additionalDetails}"\n    (The script/roast must revolve around this specific context provided by the user.)`
    : `\n    CONTEXT: Invent a creative situation where the object is complaining about its life or boasting about its greatness.`;

  const prompt = `
    คุณคือ Creative Director มือหนึ่งของ TikTok/Reels ที่เชี่ยวชาญการทำคลิปไวรัลสายปั่น
    
    Task: สร้างสคริปต์วิดีโอสั้นสำหรับสิ่งของ: "${params.objectName}"
    จำนวนฉาก: ${params.sceneCount} ฉาก
    สไตล์ภาพ: ${params.style}
    อารมณ์หลักของตัวละคร: ${params.emotion}
    ${userContext}
    
    Personality (สำคัญมาก):
    - สิ่งของนี้ "มีชีวิต" และกำลัง "ด่า" หรือ "ขิง (Flex)" ใส่คนดู/เจ้าของ โดยตรง
    - Tone of Voice: กวนประสาท (Sarcastic), ดุดัน (Aggressive), ขวานผ่าซาก, หลงตัวเองขั้นสุด
    - ภาษา: ต้องใช้คำแสลงวัยรุ่นไทย (Slang Thai) เพื่อความ Viral
    - เนื้อหา: พูดถึงข้อดี/ข้อเสียของตัวเองแบบหลงตัวเอง หรือด่าคนใช้ที่ไม่ดูแลรักษา
    - **ข้อห้ามเด็ดขาด (Strict Constraint): ห้ามใช้คำว่า "ทาส" (Slave) ในบทพูดทุกกรณี**
    
    การปรับบุคลิกและคำสรรพนามตามอารมณ์ (Emotion Alignment Rules):
    - "${CharacterEmotion.Angry}" (โมโห): ด่ากราดเหมือนระเบิดลง อนุญาตให้ใช้คำหยาบแบบวัยรุ่นได้ (เช่น กู, มึง, ไอ้...) เน้นอารมณ์เกรี้ยวกราด
    - "${CharacterEmotion.Sarcastic}" (ด่านิดๆ): เน้นจิกกัดแบบกวนๆ **ต้องใช้สรรพนามแทนตัวว่า "ข้า" และแทนคนดูว่า "เอ็ง" เท่านั้น**
    - "${CharacterEmotion.Cute}" (น่ารัก): พูดเสียงสอง ทำตัวแบ๊วๆ แต่ปากแจ๋ว **ห้ามใช้คำหยาบคาย (ห้ามใช้ กู/มึง)** ให้ใช้คำแทนตัวว่า หนู/เค้า/น้อง แทน
    - "${CharacterEmotion.Professional}" (มืออาชีพ): พูดเหมือนกูรูที่มีอีโก้สูงเสียดฟ้า มั่นหน้า **ห้ามใช้คำหยาบคาย (ห้ามใช้ กู/มึง)** ใช้ภาษาสุภาพที่ดูหยิ่งๆ
    
    VISUAL REQUIREMENT (IMPORTANT):
    The object MUST be ANTHROPOMORPHIC (Have a FACE, EYES, and a MOUTH). 
    It must look like a character from a Pixar/Disney movie.
    It needs to express emotions through facial expressions.
    
    **CRITICAL CONSISTENCY RULE (MUST FOLLOW):**
    - You MUST design ONE consistent character appearance for this "${params.objectName}" (e.g., specific color, material, wear & tear).
    - You MUST use the **EXACT SAME** physical description phrases in EVERY scene's 'image_prompt' and 'video_prompt'.
    - The character must NOT change appearance between scenes.
    - Example: If Scene 1 is "A rusty blue fan with a cracked blade...", Scene 2 MUST be "The same rusty blue fan with a cracked blade...".

    **CRITICAL RULE FOR VEHICLES (Cars, Trucks, Bikes, etc.):**
    - If the object is a vehicle: The EYES MUST BE ON THE WINDSHIELD (Pixar Cars style). 
    - DO NOT place eyes on the headlights.
    - The MOUTH should be on the front bumper or grill area.

    Critical Formatting Rules:
    1. Output must be strictly JSON.
    2. "image_prompt": MUST START with the consistent character description defined above. Then describe the action/emotion for this scene. IF VEHICLE: Specifiy "Eyes located on the windshield". Emotion: ${params.emotion}. Style: ${params.style}. MUST end with "--ar 9:16".
    3. "video_prompt": COMBINE the consistent visual description (anthropomorphic object) AND movement in English, AND THEN append the Thai voiceover line exactly in this format:
       [Consistent Visual Description of Anthropomorphic Object & Movement]
       Thai voiceover says: "[Thai dialogue here]"
    
    Example of video_prompt format:
    "Close-up of the same anthropomorphic Red Car character with eyes on the windshield narrowing in anger, mouth on the bumper moving.
    Thai voiceover says: \"ขับเบาๆ หน่อยสิโว้ย! ช่วงล่างข้าจะพังหมดแล้ว\""

    4. "hashtags": Must contain EXACTLY 5 viral Thai hashtags starting with '#'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, viral Thai headline" },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Viral hashtags, MUST have EXACTLY 5 items and start with #"
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  scene_number: { type: Type.INTEGER },
                  image_prompt: { type: Type.STRING, description: "Consistent visual description + scene action. If Vehicle: Eyes on Windshield. MUST end with --ar 9:16" },
                  video_prompt: { type: Type.STRING, description: "Combined Master Prompt (Consistent Visuals + Movement + Thai Voiceover says: ...)" },
                },
                propertyOrdering: ["scene_number", "image_prompt", "video_prompt"]
              }
            }
          },
          propertyOrdering: ["title", "hashtags", "scenes"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as ViralScript;
      // Double check hashtags have #
      data.hashtags = data.hashtags.map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`);
      return data;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
