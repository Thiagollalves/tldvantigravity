"use client";

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Video,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Play,
  ArrowRight
} from "lucide-react"
import { formatDate, formatDuration } from "@/lib/utils"
import Link from "next/link"

const stats = [
  { label: "Total de Reuniões", value: "24", icon: Video, color: "text-blue-500" },
  { label: "Horas Gravadas", value: "12.5h", icon: Clock, color: "text-purple-500" },
  { label: "Tasks Concluídas", value: "85%", icon: CheckCircle2, color: "text-green-500" },
]

const recentMeetings = [
  {
    id: "1",
    title: "Daily Standup - Time de Produto",
    date: "2026-01-08T10:00:00",
    duration: 900,
    status: "COMPLETED",
    type: "DAILY"
  },
  {
    id: "2",
    title: "Planejamento Trimestral Q1",
    date: "2026-01-07T14:30:00",
    duration: 3600,
    status: "COMPLETED",
    type: "EXECUTIVE"
  },
  {
    id: "3",
    title: "Sincronização com Client X",
    date: "2026-01-07T16:00:00",
    duration: 1800,
    status: "PROCESSING",
    type: "COMMERCIAL"
  }
]

export default function DashboardPage() {
  const [userName, setUserName] = useState("Rafael")

  useEffect(() => {
    const savedName = localStorage.getItem("userName")
    if (savedName) setUserName(savedName)
  }, [])

  function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bem-vindo, {userName}</h1>
          <p className="text-sm md:text-base text-muted-foreground">Aqui está o que aconteceu nas suas últimas reuniões.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Importar Vídeo</Button>
          <Button className="flex-1 md:flex-none">Gravar Tela</Button>
        </div>
      </header>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Reuniões Recentes</h2>
        <div className="grid gap-4">
          {recentMeetings.map((meeting) => (
            <Card key={meeting.id} className="hover:bg-white/5 transition-all cursor-pointer group glass-hover-effect">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                  <div className="h-24 w-full sm:h-12 sm:w-20 rounded-md bg-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-700 transition-colors shrink-0">
                    {meeting.status === "PROCESSING" ? (
                      <div className="loading-gradient absolute inset-0" />
                    ) : (
                      <Play className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-medium truncate">{meeting.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground mt-1">
                      <span>{formatDate(meeting.date)}</span>
                      <span>{formatDuration(meeting.duration)}</span>
                      <span className="flex items-center gap-1 uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/5">
                        {meeting.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:ml-auto">
                    {meeting.status === "PROCESSING" ? (
                      <span className="text-xs text-amber-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Processando...
                      </span>
                    ) : (
                      <span className="text-xs text-green-500">Pronta</span>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
