import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  // Generate an image for a menu item
  generateMenuImage: async (itemName: string, description: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A professional food photography shot of ${itemName}. ${description}. High quality, appetizing, red theme accents.`,
            },
          ],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation failed:", error);
      return null;
    }
  },

  // AI Analysis of an order
  analyzeOrder: async (orderData: any) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this order and provide a short professional summary and a suggested rating (1-5) based on the order composition: ${JSON.stringify(orderData)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestedRating: { type: Type.NUMBER }
            },
            required: ["summary", "suggestedRating"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Order analysis failed:", error);
      return { summary: "Analysis unavailable.", suggestedRating: 5 };
    }
  },

  // Doubt Clear Chat
  clearDoubt: async (question: string, menuContext: any) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a helpful restaurant assistant. Use this menu context: ${JSON.stringify(menuContext)}. Question: ${question}`,
      });
      return response.text;
    } catch (error) {
      console.error("Doubt clear failed:", error);
      return "I'm sorry, I'm having trouble connecting to my AI brain right now.";
    }
  }
};
