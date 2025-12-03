
import { GoogleGenAI } from "@google/genai";
import { AiReport, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchLocationReport = async (location: string, lang: Language): Promise<AiReport> => {
  const model = "gemini-2.5-flash";
  const languageInstruction = lang === 'BN' 
    ? "Provide the response in Bengali language." 
    : "Provide the response in English.";
  
  try {
    // 1. Get News Report (Search Grounding)
    const newsResponse = await ai.models.generateContent({
      model,
      contents: `Provide a concise bullet-point summary of the last 7 days of weather, heatwave, and climate-related news for ${location}. If no major events, summarize general seasonal climate trends. Focus on facts. ${languageInstruction}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search grounding metadata
    const groundingChunks = newsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const newsSources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((item: any) => item !== null);

    // 2. Get Nearby Relief Centers (Maps Grounding)
    const mapsResponse = await ai.models.generateContent({
      model,
      contents: `List 3-4 nearby cooling centers, large public parks, or hospitals in ${location} that would be useful during a heatwave. Briefly mention why each is relevant. ${languageInstruction}`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const mapsChunks = mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const reliefSources = mapsChunks
      .map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title || "Maps Location", uri: chunk.maps.uri };
        return null;
      })
      .filter((item: any) => item !== null);

    return {
      newsSummary: newsResponse.text || (lang === 'BN' ? "কোন খবর পাওয়া যায়নি।" : "No news data available."),
      newsSources: newsSources as { title: string; uri: string }[],
      reliefCenters: mapsResponse.text || (lang === 'BN' ? "কোন অবস্থান তথ্য পাওয়া যায়নি।" : "No location data available."),
      reliefSources: reliefSources as { title: string; uri: string }[]
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      newsSummary: lang === 'BN' 
        ? "এই মুহূর্তে এআই রিপোর্ট তৈরি করা সম্ভব হচ্ছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।" 
        : "Unable to generate AI report at this time. Please try again later.",
      newsSources: [],
      reliefCenters: lang === 'BN' 
        ? "অবস্থান তথ্য আনা সম্ভব হয়নি।" 
        : "Unable to fetch location data.",
      reliefSources: []
    };
  }
};

export const generateCustomerResponse = async (name: string, location: string, question: string, lang: Language): Promise<string> => {
  const model = "gemini-2.5-flash";
  const userLang = lang === 'BN' ? 'Bengali' : 'English';
  
  const prompt = `
    You are an AI Climate Support Agent named "HeatWatch AI". 
    A user named "${name}" has subscribed to alerts for "${location}".
    
    They asked this question: "${question || "No specific question, just subscribing."}"

    Task: Write a polite, helpful, and professional email response body.
    - If they asked a question, provide a comprehensive answer based on heatwave safety protocols.
    - If no question, confirm their subscription and provide 1-2 general safety tips.
    - Tone: Professional, Empathetic, Informative.
    - Language: ${userLang}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || (lang === 'BN' ? "আপনার বার্তা গৃহীত হয়েছে।" : "Message received.");
  } catch (error) {
    console.error("AI Reply Generation Error:", error);
    return lang === 'BN' ? "যান্ত্রিক ত্রুটির কারণে উত্তর দেওয়া যাচ্ছে না।" : "Unable to generate reply due to error.";
  }
};
