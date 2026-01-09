import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeMeeting(transcript: string, template: string = "general") {
    const prompt = `
    Você é um analista de reuniões especialista. 
    Analise a transcrição abaixo e gere um resumo estruturado, extraia tarefas e decisões.
    Template: ${template}
    
    Transcrição:
    ${transcript}
    
    Responda EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
    {
      "summary": "Resumo executivo do que foi discutido",
      "keyPoints": ["Ponto 1", "Ponto 2"],
      "tasks": [{"description": "O que fazer", "assignee": "Quem", "priority": "Alta/Média/Baixa"}],
      "decisions": ["Decisão 1"],
      "risks": ["Risco 1"]
    }
  `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Limpar markdown se houver
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Summarization error:", error);
        throw error;
    }
}

export async function chatWithMeeting(transcript: string, userQuestion: string) {
    const prompt = `
    Você é um assistente útil. Baseie sua resposta APENAS na transcrição da reunião fornecida abaixo.
    Se a informação não estiver na transcrição, diga que não sabe.
    
    Conteúdo da Reunião:
    ${transcript}
    
    Pergunta do Usuário:
    ${userQuestion}
  `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Chat error:", error);
        throw error;
    }
}
