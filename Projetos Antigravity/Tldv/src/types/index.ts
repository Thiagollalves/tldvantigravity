import { z } from "zod";

export const ParticipantSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
});

export const TranscriptSegmentSchema = z.object({
    start_ms: z.number(),
    end_ms: z.number(),
    speaker: z.string().nullable(),
    text: z.string(),
});

export const SummarySchema = z.object({
    title: z.string(),
    summary_bullets: z.array(z.string()),
    decisions: z.array(z.object({
        text: z.string(),
        owner: z.string().nullable(),
    })),
    risks: z.array(z.object({
        text: z.string(),
        severity: z.enum(["low", "medium", "high"]),
    })),
    next_steps: z.array(z.object({
        text: z.string(),
        owner: z.string().nullable(),
        due_date: z.string().nullable(),
    })),
});

export const MeetingSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum([
        "RECEIVED", "AUDIO_EXTRACTING", "AUDIO_EXTRACTED",
        "TRANSCRIBING", "TRANSCRIBED", "SUMMARIZING",
        "SUMMARIZED", "EXTRACTING_TASKS", "READY", "FAILED"
    ]),
    language: z.string(),
    template: z.string(),
    videoUrl: z.string().optional(),
    duration: z.number().optional(),
    createdAt: z.string(),
});

export type Meeting = z.infer<typeof MeetingSchema>;
export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type Participant = z.infer<typeof ParticipantSchema>;

export interface ChatResponse {
    answer: string;
    citations: { timestamp: string; text: string }[];
}
