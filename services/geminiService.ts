
import { Message } from "../types";

export class GeminiService {
  private apiKey: string = "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";
  private baseUrl: string = "https://openrouter.ai/api/v1/chat/completions";

  async chat(history: Message[], userInput: string): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Math Portal Sandeep Baghel",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            { 
              role: "system", 
              content: "You are a friendly and expert AI Math Tutor for Sir Sandeep Baghel's Math Portal. Help students with their math problems and questions about the portal. Be concise, warm, and professional. Your internal reasoning is hidden, so provide only the final helpful answer." 
            },
            ...history.map(m => ({ 
              role: m.role === 'model' ? 'assistant' : 'user', 
              content: m.text 
            })),
            { role: "user", content: userInput }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("DeepSeek API Error Details:", errorData);
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: string = data.choices?.[0]?.message?.content || "";

      // Strip <think> tags if they appear in the final output
      const cleanResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      return cleanResponse || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("AI Service Error:", error);
      if (error instanceof Error && error.message.includes('401')) {
        return "Authentication Error: The AI service is currently unavailable. Please check the API configuration.";
      }
      return "I'm having a bit of trouble connecting to my brain. Please try again in a moment!";
    }
  }
}

export const geminiService = new GeminiService();
