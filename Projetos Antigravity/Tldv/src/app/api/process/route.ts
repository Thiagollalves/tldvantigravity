import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { summarizeMeeting } from "@/lib/gemini"

export async function POST(req: Request) {
    try {
        const { meetingId } = await req.json()

        // 1. Update status to PROCESSING
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { status: "PROCESSING" }
        })

        // 2. Simulate Video Processing (In a real app, this would be a background worker)
        // We'll simulate some delay
        console.log(`Starting processing for meeting: ${meetingId}`)

        // 3. Mock Transcription (Simulating Whisper output)
        const mockTranscript = [
            { startTime: 0, endTime: 5, speakerName: "Speaker 1", text: "Welcome to the project kickoff." },
            { startTime: 5, endTime: 12, speakerName: "Speaker 2", text: "Thanks, excited to be here." }
        ]

        // Save segments
        await prisma.transcriptSegment.createMany({
            data: mockTranscript.map(s => ({ ...s, meetingId }))
        })

        // 4. Real AI Analysis using Google Gemini
        const transcriptText = mockTranscript.map(s => `${s.speakerName}: ${s.text}`).join("\n")
        const analysis = await summarizeMeeting(transcriptText, "PROJECT_KICKOFF")

        await prisma.summary.create({
            data: {
                content: analysis.summary,
                keyPoints: JSON.stringify(analysis.keyPoints),
                risks: JSON.stringify(analysis.risks),
                templateUsed: "PROJECT_KICKOFF",
                meetingId
            }
        })

        // Create tasks from analysis
        if (analysis.tasks && analysis.tasks.length > 0) {
            await prisma.task.createMany({
                data: analysis.tasks.map((t: Record<string, unknown>) => ({
                    description: t.description,
                    assignee: t.assignee,
                    meetingId
                }))
            })
        }

        // 5. Update Status to COMPLETED
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { status: "COMPLETED" }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Processing error:", error)
        return NextResponse.json({ error: "Failed to process meeting" }, { status: 500 })
    }
}
