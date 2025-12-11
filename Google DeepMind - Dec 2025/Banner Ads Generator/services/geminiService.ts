import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BannerSpec, BannerRequest } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-pro-preview";

// Schema for Banner Generation
const bannerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "Catchy main headline for the ad." },
    subheadline: { type: Type.STRING, description: "Supporting text or value prop." },
    cta: { type: Type.STRING, description: "Call to action button text." },
    body: { type: Type.STRING, description: "Main body copy (short and punchy)." },
    visualDirection: {
      type: Type.OBJECT,
      properties: {
        colorPalette: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of hex codes or color names."
        },
        layoutDescription: { type: Type.STRING, description: "Description of how elements are arranged." },
        imageryDescription: { type: Type.STRING, description: "What images/icons should be used." },
        typography: { type: Type.STRING, description: "Font style suggestions." },
        backgroundColorHex: { type: Type.STRING, description: "Main background hex code for preview." },
        textColorHex: { type: Type.STRING, description: "Main text hex code for preview." },
      },
      required: ["colorPalette", "layoutDescription", "imageryDescription", "backgroundColorHex", "textColorHex"],
    },
    rationale: { type: Type.STRING, description: "Why this design works for the audience/goal." },
  },
  required: ["headline", "subheadline", "cta", "body", "visualDirection", "rationale"],
};

export const generateBannerStrategy = async (req: BannerRequest): Promise<BannerSpec> => {
  const prompt = `
    You are BannerCraft AI, a world-class creative director.
    Create a detailed banner ad specification.
    
    Brand: ${req.brandName}
    Product: ${req.productName}
    Goal: ${req.campaignGoal}
    Audience: ${req.targetAudience}
    Dimensions: ${req.dimensions}
    Tone: ${req.tone}

    Think deeply about the psychology of the audience and the constraints of the size.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: bannerSchema,
        // Thinking budget set to max for deep creative strategy
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as BannerSpec;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Banner Generation Error:", error);
    throw error;
  }
};

export const analyzeImageForAds = async (base64Image: string, mimeType: string, promptText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `As an advertising expert, analyze this image. ${promptText}. Suggest how this asset could be used in a banner ad campaign.`,
          },
        ],
      },
      config: {
         // Using thinking budget for deep visual analysis
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};

export const chatWithCreativeDirector = async (history: {role: string, parts: {text: string}[]}[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
        model: MODEL_NAME,
        history: history,
        config: {
            systemInstruction: "You are BannerCraft AI, a helpful, witty, and professional creative director helping a user design ad campaigns.",
        }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I'm speechless (literally). Try again?";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};