import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        })
        return NextResponse.json(meetings)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { title, videoUrl, meetingType, userId } = await req.json()

        const meeting = await prisma.meeting.create({
            data: {
                title,
                videoUrl,
                meetingType,
                userId, // In a real app, get this from session
                status: "PENDING"
            }
        })

        return NextResponse.json(meeting)
    } catch (error) {
        console.error("Create meeting error:", error)
        return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 })
    }
}
