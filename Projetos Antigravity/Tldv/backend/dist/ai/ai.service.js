"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let AIService = class AIService {
    configService;
    genAI;
    model;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey)
            throw new Error('GEMINI_API_KEY not found');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    async summarize(transcript, template) {
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
        return JSON.parse(text.replace(/```json|```/g, '').trim());
    }
    async chat(transcript, question) {
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
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map