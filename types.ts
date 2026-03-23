
export interface Scene {
  scene_number: number;
  image_prompt: string;
  video_prompt: string; // Must contain the "Thai voiceover says: ..." part
}

export interface ViralScript {
  title: string;
  hashtags: string[];
  scenes: Scene[];
}

export enum VisualStyle {
  ThreeD = "3D Animation",
  Realistic = "Realistic",
  Anime = "Anime",
  Cinematic = "Cinematic"
}

export enum CharacterEmotion {
  Angry = "โมโห",
  Sarcastic = "ด่านิดๆ",
  Cute = "น่ารัก",
  Professional = "มืออาชีพ"
}

export interface GenerateParams {
  objectName: string;
  additionalDetails?: string;
  style: VisualStyle;
  emotion: CharacterEmotion;
  sceneCount: number;
}
