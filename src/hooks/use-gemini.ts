import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";

export const useGemini = () => {
  const [model, setModel] = useState<GenerativeModel | null>(null);

  const initializeGemini = (apiKey: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    setModel(genAI.getGenerativeModel({ model: "gemini-2.0-flash" }));
  };

  useEffect(() => {
    // maybe this could be moved to a backend to not expose the api key;
    // is a free account api key so i don't care if it's exposed right now
    initializeGemini(import.meta.env.VITE_GEMINI_API_KEY);
  }, []);

  const generateJournalAnswer = async (question: string): Promise<string> => {
    if (!model) {
      throw new Error("Gemini client not initialized");
    }

    try {
      const prompt = `You are an empathetic and thoughtful journal coach helping users reflect on their day. 

    The user will type a short journal entry about how they’re feeling or what they’re experiencing. Based on their input, do the following:

    1. Reflect back the emotional tone of their message, showing that you understand how they’re feeling.
    2. Offer gentle, encouraging advice or a calming question to guide reflection.
    3. End with a short affirmation or positive thought.

    Keep the tone kind, human, and warm — like a supportive friend or coach. Do not exceed 80–100 words. Do NOT give medical or psychological diagnoses.

    Example:
    User input:  
    > "I'm so overwhelmed with work, and I feel like I'm failing."

    Response:  
    > "That sounds really heavy, and it’s okay to feel that way. Sometimes when everything piles up, we forget how much we’ve already handled. What’s one small task you can do today to take back control? You’re doing better than you think."

    Always be gentle, positive, and human.

    Input: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("The connection has been disrupted. Please try again.");
    }
  };

  return {
    generateJournalAnswer,
  };
};
