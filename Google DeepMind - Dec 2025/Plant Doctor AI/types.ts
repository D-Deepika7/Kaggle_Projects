export interface RecommendedStep {
  step: number;
  action: string;
  duration: string;
  tools: string[];
}

export interface Safety {
  recommendation_level: 'informational' | 'seek-expert' | 'emergency';
  safety_text: string;
  confidence: number;
  evidence: string[];
}

export interface PlantDiagnosis {
  diagnosis: string;
  confidence: number; // Keep for backward compatibility/top-level access
  safety: Safety; // New specific safety object
  causes: string[];
  severity: 'low' | 'medium' | 'high';
  recommended_steps: RecommendedStep[];
  seven_day_care_plan: {
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
    day6: string;
    day7: string;
  };
  preventive_tips: string[];
  follow_up_tests: string[];
  explanation_simple: string;
  visual_markup: string;
  evidence: string[]; // Keep for backward compatibility
  unclear?: boolean;
  advice?: string;
  // Included from metadata or inferred
  plant_name_identified?: string; 
}

export interface PlantMetadata {
  plantName: string;
  age: string;
  environment: string;
  sunlight: string;
  watering: string;
  fertilizer: string;
  soilType: string;
  potted: string;
  recentChanges: string;
  previousIssues: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  diagnosis: string;
  plantName: string;
  result: PlantDiagnosis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface AnalysisState {
  isLoading: boolean;
  result: PlantDiagnosis | null;
  error: string | null;
  imagePreview: string | null;
  metadata: PlantMetadata;
}
