"use client"

import { useState } from "react"
import {
    Play,
    SkipBack,
    SkipForward,
    Download,
    Share2,
    MessageSquare,
    ClipboardList,
    Target,
    FileText,
    Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const mockTranscript = [
    { time: 0, speaker: "Rafael", text: "Bom dia pessoal, vamos começar o daily de hoje." },
    { time: 5, speaker: "Ana", text: "Bom dia! Eu terminei a integração com a API do Whisper ontem." },
    { time: 12, speaker: "Rafael", text: "Excelente Ana. Algum impedimento?" },
    { time: 15, speaker: "Ana", text: "Apenas um detalhe na formatação do JSON, mas já estou resolvendo." },
    { time: 25, speaker: "Bruno", text: "Eu estou trabalhando no layout da página de reunião, falta apenas o chat." },
]

export default function MeetingDetailsPage() {
    const [currentTime, setCurrentTime] = useState(0)
    const [activeTab, setActiveTab] = useState<"summary" | "tasks" | "decisions" | "chat">("summary")

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row h-auto md:h-16 items-start md:items-center justify-between border-b p-4 md:px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10 gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-base md:text-lg font-bold truncate max-w-[200px] md:max-w-none">Daily Standup - Time de Produto</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground uppercase font-bold tracking-wider">Daily</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Exportar</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                        <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Compartilhar</span>
                    </Button>
                    <Button size="sm" className="flex-1 md:flex-none truncate">Notion</Button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:overflow-hidden">
                {/* Left: Player & Transcript */}
                <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r bg-zinc-950/50 min-h-[50vh] md:min-h-0">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black relative flex items-center justify-center group shrink-0">
                        <div className="text-zinc-600 flex flex-col items-center gap-2">
                            <Play className="h-10 md:h-12 w-10 md:w-12" />
                            <span className="text-xs md:text-sm font-medium">Clique para reproduzir</span>
                        </div>

                        {/* Custom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-1 w-full bg-white/20 rounded-full mb-4">
                                <div className="h-full bg-primary w-1/3 rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" className="text-white hover:text-primary"><SkipBack className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="text-white hover:text-primary"><Play className="h-6 w-6" /></Button>
                                    <Button variant="ghost" size="icon" className="text-white hover:text-primary"><SkipForward className="h-5 w-5" /></Button>
                                    <span className="text-sm text-white font-mono">02:14 / 15:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transcript */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {mockTranscript.map((segment, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-6 group cursor-pointer transition-all p-3 rounded-xl border border-transparent hover:border-white/5 active:scale-[0.99]",
                                    currentTime >= segment.time && currentTime < (mockTranscript[idx + 1]?.time || 999)
                                        ? "bg-white/5 border-white/10 shadow-lg"
                                        : "hover:bg-white/2"
                                )}
                                onClick={() => setCurrentTime(segment.time)}
                            >
                                <span className="w-12 text-sm text-muted-foreground font-mono mt-1">
                                    {Math.floor(segment.time / 60)}:{(segment.time % 60).toString().padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                    <span className="text-sm font-bold block mb-1 text-primary/80">{segment.speaker}</span>
                                    <p className="text-foreground/90 leading-relaxed">{segment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Insights Panel */}
                <div className="w-full md:w-[450px] flex flex-col bg-zinc-900/30 border-t md:border-t-0 shrink-0">
                    <div className="flex border-b overflow-x-auto scrollbar-hide">
                        {(["summary", "tasks", "decisions", "chat"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-1 min-w-[80px] py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-all",
                                    activeTab === tab
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab === "summary" && <FileText className="h-4 w-4 mx-auto mb-1" />}
                                {tab === "tasks" && <ClipboardList className="h-4 w-4 mx-auto mb-1" />}
                                {tab === "decisions" && <Target className="h-4 w-4 mx-auto mb-1" />}
                                {tab === "chat" && <MessageSquare className="h-4 w-4 mx-auto mb-1" />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div key={activeTab} className="tab-content-animate h-full">
                            {activeTab === "summary" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-purple-400" /> Resumo Executivo
                                        </h3>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                            navigator.clipboard.writeText("A reunião focou na atualização diária do time de tecnologia...");
                                            alert("Resumo copiado!");
                                        }}>
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        A reunião focou na atualização diária do time de tecnologia. Os principais tópicos foram a integração bem-sucedida do sistema de transcrição e o progresso no front-end.
                                    </p>
                                    <div>
                                        <h3 className="font-bold mb-3">Principais Pontos</h3>
                                        <ul className="space-y-2">
                                            {["Integração com Whisper finalizada por Ana", "Bruno focado no player de vídeo e chat", "Formatos JSON estão sendo ajustados"].map((point, i) => (
                                                <li key={i} className="text-sm flex gap-2 text-muted-foreground">
                                                    <span className="text-primary">•</span> {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === "tasks" && (
                                <div className="space-y-4">
                                    {[
                                        { desc: "Ajustar formatação do JSON", user: "Ana", status: "TODO" },
                                        { desc: "Finalizar interface do chat", user: "Bruno", status: "TODO" },
                                        { desc: "Configurar deploy no Vercel", user: "Rafael", status: "DONE" },
                                    ].map((task, i) => (
                                        <Card key={i} className="border-none bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                                        task.status === "DONE" ? "bg-green-500 border-green-500" : "border-zinc-700 group-hover:border-primary"
                                                    )}>
                                                        {task.status === "DONE" && <CheckCircle2 className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className={cn("text-sm font-medium", task.status === "DONE" && "line-through text-muted-foreground")}>{task.desc}</p>
                                                        <span className="text-[10px] text-muted-foreground uppercase">{task.user}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {activeTab === "chat" && (
                                <div className="flex flex-col h-full gap-4">
                                    <div className="flex-1 space-y-4">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm relative group overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
                                            <span className="font-black text-[10px] uppercase tracking-widest text-primary block mb-2">IA NovaNote</span>
                                            <p className="text-foreground/90 leading-relaxed">Olá! Eu li toda a transcrição desta reunião. Posso te ajudar a identificar decisões, extrair datas importantes ou resumir a fala de alguém específico. O que vamos analisar agora?</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Pergunte sobre a reunião..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                        />
                                        <div className="absolute right-2 top-2">
                                            <Button size="icon" className="rounded-xl h-10 w-10 shadow-lg shadow-primary/20"><Send className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "decisions" && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                        <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold text-sm">
                                            <Target className="h-4 w-4" /> Ponto Crítico Decidido
                                        </div>
                                        <p className="text-sm text-foreground/80">O time concordou em priorizar a estabilidade do player antes de escalar para novos usuários.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CheckCircle2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
