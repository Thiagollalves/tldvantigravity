import { ConfigService } from '@nestjs/config';
import { AnalysisResult } from '../common/types';
export declare class AIService {
    private configService;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    summarize(transcript: string, template: string): Promise<AnalysisResult>;
    chat(transcript: string, question: string): Promise<string>;
}
