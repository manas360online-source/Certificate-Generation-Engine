import { GoogleGenAI } from "@google/genai";
import { CertificateType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCertificateCommendation = async (
  recipientName: string,
  programName: string,
  type: CertificateType
): Promise<string> => {
  try {
    let prompt = "";
    
    switch (type) {
      case CertificateType.PATIENT:
        prompt = `Write a short, heart-centered, and encouraging commendation (max 2 sentences) for a patient named ${recipientName} who has successfully completed the program "${programName}". Focus on wellness, resilience, and the strength it takes to prioritize mental health.`;
        break;
      case CertificateType.THERAPIST:
        prompt = `Write a professional, high-standard commendation (max 2 sentences) for a therapist named ${recipientName} who has completed the advanced certification "${programName}". Focus on clinical excellence, ethical dedication, and the impact on their community.`;
        break;
      case CertificateType.COACH:
        prompt = `Write a dynamic, powerful, and inspiring commendation (max 2 sentences) for a coach named ${recipientName} who has achieved the milestone "${programName}". Focus on leadership, transformative impact, and their ability to unlock potential in others.`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "For outstanding performance and dedication to excellence.";
  } catch (error) {
    console.error("Error generating commendation:", error);
    return "For successful completion of the requirements and demonstrated mastery of the subject matter.";
  }
};