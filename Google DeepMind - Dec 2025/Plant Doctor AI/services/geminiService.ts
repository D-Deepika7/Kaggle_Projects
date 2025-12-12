import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { PlantDiagnosis, PlantMetadata } from "../types";

// Define the schema for strict JSON generation
const diagnosisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: { type: Type.STRING, description: "Short diagnosis label (e.g., Fungal Leaf Spot)" },
    confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
    safety: {
      type: Type.OBJECT,
      properties: {
        recommendation_level: { type: Type.STRING, enum: ['informational', 'seek-expert', 'emergency'] },
        safety_text: { type: Type.STRING, description: "Safety instructions regarding treatments or handling." },
        confidence: { type: Type.NUMBER },
        evidence: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["recommendation_level", "safety_text", "confidence", "evidence"]
    },
    plant_name_identified: { type: Type.STRING, description: "The identified name of the plant (e.g., Ficus elastica)" },
    causes: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of potential causes"
    },
    severity: { 
      type: Type.STRING, 
      enum: ["low", "medium", "high"],
      description: "Severity level of the issue"
    },
    visual_markup: {
      type: Type.STRING,
      description: "Description of where the issue is located on the plant (e.g. 'lower left leaves')"
    },
    evidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of max 3 evidence sentences justifying the diagnosis"
    },
    explanation_simple: {
      type: Type.STRING,
      description: "One paragraph ELI5 explanation"
    },
    recommended_steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER },
          action: { type: Type.STRING },
          duration: { type: Type.STRING },
          tools: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["step", "action", "duration", "tools"]
      }
    },
    seven_day_care_plan: {
      type: Type.OBJECT,
      properties: {
        day1: { type: Type.STRING },
        day2: { type: Type.STRING },
        day3: { type: Type.STRING },
        day4: { type: Type.STRING },
        day5: { type: Type.STRING },
        day6: { type: Type.STRING },
        day7: { type: Type.STRING },
      },
      required: ["day1", "day2", "day3", "day4", "day5", "day6", "day7"]
    },
    preventive_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    follow_up_tests: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    unclear: { type: Type.BOOLEAN, description: "True if image is too blurry or not a plant" },
    advice: { type: Type.STRING, description: "Advice if image is unclear" }
  },
  required: [
    "diagnosis", "confidence", "safety", "plant_name_identified", "causes", "severity", "recommended_steps", 
    "seven_day_care_plan", "preventive_tips", "follow_up_tests", 
    "explanation_simple", "evidence", "visual_markup"
  ]
};

let chatSession: Chat | null = null;

export const analyzePlantImage = async (
  base64Image: string, 
  mimeType: string,
  metadata: PlantMetadata
): Promise<PlantDiagnosis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const metadataString = `
    User Provided Information (Optional):
    - Plant Name: ${metadata.plantName || "Unknown"}
    - Age: ${metadata.age || "Unknown"}
    - Environment: ${metadata.environment} (${metadata.sunlight})
    - Watering: ${metadata.watering || "Unknown"}
    - Soil/Pot: ${metadata.soilType}, ${metadata.potted}
    - Recent Changes: ${metadata.recentChanges}
    - Known History: ${metadata.previousIssues}
  `;

  const systemInstruction = `
    You are PlantDoctor, a world-class plant pathologist. 
    Analyze the provided plant image. 
    
    IMPORTANT: For every diagnosis response include a "safety" object with these fields:
    - "recommendation_level": "informational"|"seek-expert"|"emergency"
    - "safety_text": short safety instructions if treatment is suggested (include PPE, label-following reminder)
    - "confidence": integer 0-100
    - "evidence": max 3 concise evidence lines supporting the diagnosis

    If confidence < 60, include "follow_up_tests" as specific 1-2 short yes/no checks to disambiguate cause. 
    Always avoid providing dosages or specific chemicals unless commonly accepted names; if mentioning chemicals, include an instruction: "Always read product label and follow safety guidelines."

    Prioritize the largest visible plant.
    Incorporated the user's provided metadata to refine your diagnosis, but prioritize visual evidence if they contradict.
    Be scientific but accessible (ELI5).
    If the image is unclear or not a plant, set 'unclear' to true and provide advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: `Analyze this plant image for health issues. Provide a diagnosis, severity, treatment plan, and evidence. ${metadataString}`
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
        temperature: 0.4,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    // Initialize chat session for follow-up
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are PlantDoctor. The user has just uploaded an image of a plant. 
        Here is the diagnosis you provided: ${text}. 
        Answer follow-up questions about this specific plant, its condition, and care. 
        Keep answers helpful, encouraging, and concise.`
      }
    });

    try {
      const data = JSON.parse(text) as PlantDiagnosis;
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, text);
      throw new Error("Failed to parse diagnosis results.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized. Analyze a plant first.");
  }
  const result = await chatSession.sendMessage({ message });
  return result.text || "I'm sorry, I couldn't generate a response.";
};
