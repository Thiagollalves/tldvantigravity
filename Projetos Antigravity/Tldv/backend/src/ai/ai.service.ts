import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AnalysisResult } from '../common/types';

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not found');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async summarize(
    transcript: string,
    template: string,
  ): Promise<AnalysisResult> {
    const prompt = `
      You are an expert meeting analyst. 
      Analyze the following transcript and generate a structured summary in JSON.
      Template: ${template}
      
      Transcript:
      ${transcript}
      
      Response MUST be a valid JSON with this exact structure:
      {
        "title": "Short title",
        "summary_bullets": ["point 1", "point 2"],
        "decisions": [{"text": "Decision text", "owner": "Name or null"}],
        "risks": [{"text": "Risk text", "severity": "low|medium|high"}],
        "next_steps": [{"text": "Action item", "owner": "Name or null", "due_date": "YYYY-MM-DD or null"}]
      }
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(
      text.replace(/```json|```/g, '').trim(),
    ) as AnalysisResult;
  }

  async chat(transcript: string, question: string) {
    const prompt = `
      Context (Meeting Transcript):
      ${transcript}
      
      User Question:
      ${question}
      
      Instructions:
      1. Answer ONLY based on the transcript.
      2. If not found, say "Informação não encontrada na reunião".
      3. For each fact, mention the speaker if known.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
