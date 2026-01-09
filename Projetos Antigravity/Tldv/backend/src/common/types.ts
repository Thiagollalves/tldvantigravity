export interface AnalysisResult {
  title: string;
  summary_bullets: string[];
  decisions: Array<{
    text: string;
    owner: string | null;
  }>;
  risks: Array<{
    text: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  next_steps: Array<{
    text: string;
    owner: string | null;
    due_date: string | null;
  }>;
}

export class UserContext {
  userId: string;
  email: string;
  teamId: string;
  role: string;
}

export interface PipelineJobData {
  meetingId: string;
  step: 'EXTRACT_AUDIO' | 'TRANSCRIBE' | 'SUMMARIZE';
}
