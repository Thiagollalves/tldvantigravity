"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Meeting, TranscriptSegment, Summary } from "@/types";
import { useState, useRef, useEffect } from "react";
import {
    Play, Pause, SkipBack, SkipForward, FileText,
    ClipboardList, Target, MessageSquare, Send,
    Share2, Download, MoreVertical, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function MeetingDetailsPage() {
    const { id } = useParams();
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const queryClient = useQueryClient();

    const { data: meeting, isLoading } = useQuery<Meeting>({
        queryKey: ["meetings", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/meetings/${id}`);
            return data;
        },
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return (status && status !== 'READY' && status !== 'FAILED') ? 3000 : false;
        }
    });

    const chatMutation = useMutation({
        mutationFn: async (question: string) => {
            const { data } = await apiClient.post(`/meetings/${id}/chat`, { question });
            return data;
        },
    });

    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ia', content: string }[]>([]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const q = chatInput;
        setChatInput("");
        setMessages(prev => [...prev, { role: 'user', content: q }]);

        const res = await chatMutation.mutateAsync(q);
        setMessages(prev => [...prev, { role: 'ia', content: res }]);
    };

    if (isLoading || !meeting) return <div className="p-8 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Top Bar */}
            <header className="flex h-16 items-center justify-between border-b px-8 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black">{meeting.title}</h1>
                    <StatusBadge status={meeting.status} />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2"><Share2 className="h-4 w-4" /> Compartilhar</Button>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /> Deletar</Button>
                    <Button size="sm" variant="primary">Exportar PDF</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Col: Player & Transcript */}
                <div className="flex-1 flex flex-col border-r bg-black/20 overflow-hidden">
                    {/* Player Wrapper */}
                    <div className="bg-black aspect-video relative group flex items-center justify-center">
                        {meeting.videoUrl ? (
                            <video
                                ref={videoRef}
                                src={meeting.videoUrl}
                                className="w-full h-full object-contain"
                                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                            />
                        ) : (
                            <div className="text-muted-foreground flex flex-col items-center">
                                <Video className="h-12 w-12 opacity-20 mb-2" />
                                <span className="text-xs uppercase tracking-widest font-black">Vídeo indisponível</span>
                            </div>
                        )}

                        {/* Custom Controls (Simplified for UI Demo) */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4 text-white">
                                <Button variant="ghost" size="icon" onClick={() => {
                                    if (isPlaying) videoRef.current?.pause(); else videoRef.current?.play();
                                    setIsPlaying(!isPlaying);
                                }}>
                                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                </Button>
                                <div className="flex-1 h-1 bg-white/20 rounded-full">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${(currentTime / (meeting.duration || 1)) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono">{formatTime(currentTime)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Transcript Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <h2 className="text-lg font-bold sticky top-0 bg-background/50 backdrop-blur pb-4">Transcrição</h2>
                        {meeting.transcript?.segments?.map((seg: any, i: number) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-6 p-3 rounded-xl transition-all cursor-pointer",
                                    currentTime >= seg.start_ms / 1000 && currentTime < seg.end_ms / 1000 ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-white/2"
                                )}
                                onClick={() => {
                                    if (videoRef.current) videoRef.current.currentTime = seg.start_ms / 1000;
                                }}
                            >
                                <span className="w-12 text-[10px] font-black font-mono text-muted-foreground mt-1 opacity-50">
                                    {formatTime(seg.start_ms / 1000)}
                                </span>
                                <div className="flex-1">
                                    <span className="text-xs font-black text-primary uppercase tracking-tighter mb-1 block">{seg.speaker || "Participante"}</span>
                                    <p className="text-sm leading-relaxed text-foreground/80">{seg.text}</p>
                                </div>
                            </div>
                        ))}
                        {!meeting.transcript && (
                            <div className="p-12 text-center opacity-40">Transcrição sendo gerada...</div>
                        )}
                    </div>
                </div>

                {/* Right Col: Insights */}
                <div className="w-[500px] flex flex-col bg-black/10">
                    <Tabs defaultValue="summary" className="flex-1 flex flex-col">
                        <TabsList className="bg-transparent border-b h-14 w-full justify-start px-4 gap-4">
                            <TabsTrigger value="summary" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-none">
                                <FileText className="h-4 w-4 mr-2" /> Resumo
                            </TabsTrigger>
                            <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-none">
                                <ClipboardList className="h-4 w-4 mr-2" /> Tarefas
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-none">
                                <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto p-6">
                            <TabsContent value="summary" className="m-0 space-y-8">
                                {meeting.summaries?.[0] ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">{meeting.summaries[0].summaryJson.title}</h3>
                                            <div className="space-y-3">
                                                {meeting.summaries[0].summaryJson.summary_bullets.map((b: string, i: number) => (
                                                    <div key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                                                        <span className="text-primary font-black">•</span>
                                                        {b}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="bg-green-500/5 border-green-500/10">
                                                <CardContent className="p-4">
                                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase text-green-500 mb-2">
                                                        <Target className="h-3 w-3" /> Decisões
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {meeting.summaries[0].summaryJson.decisions.map((d: any, i: number) => (
                                                            <li key={i} className="text-[11px] leading-tight text-green-200/70 border-l border-green-500/30 pl-2">
                                                                {d.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-amber-500/5 border-amber-500/10">
                                                <CardContent className="p-4">
                                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase text-amber-500 mb-2">
                                                        <AlertCircle className="h-3 w-3" /> Riscos
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {meeting.summaries[0].summaryJson.risks.map((r: any, i: number) => (
                                                            <li key={i} className="text-[11px] leading-tight text-amber-200/70 border-l border-amber-500/30 pl-2">
                                                                {r.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center opacity-40">Resumo IA está sendo construído...</div>
                                )}
                            </TabsContent>

                            <TabsContent value="tasks" className="m-0 space-y-4">
                                {meeting.tasks?.map((task, i) => (
                                    <Card key={i} className="bg-white/2 border-white/5">
                                        <CardContent className="p-4 flex gap-4">
                                            <div className="h-5 w-5 rounded-full border border-primary/40 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold">{task.text}</p>
                                                <div className="flex gap-3 mt-1 opacity-50 text-[10px] uppercase font-bold tracking-widest">
                                                    <span>Atribuído: {task.owner || "Indefinido"}</span>
                                                    {task.dueDate && <span>Prazo: {formatDate(task.dueDate)}</span>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="chat" className="m-0 flex flex-col h-[calc(100vh-200px)]">
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                                    {messages.length === 0 && (
                                        <div className="text-center p-8 opacity-30 mt-12">
                                            <MessageSquare className="h-10 w-10 mx-auto mb-4" />
                                            <p className="text-sm">Faça perguntas sobre esta reunião.<br />Ex: "O que ficou decidido sobre o prazo?"</p>
                                        </div>
                                    )}
                                    {messages.map((m, i) => (
                                        <div key={i} className={cn("max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed", m.role === 'user' ? "bg-primary text-white ml-auto rounded-tr-none" : "bg-white/5 text-foreground rounded-tl-none")}>
                                            {m.content}
                                        </div>
                                    ))}
                                    {chatMutation.isPending && (
                                        <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-xs flex gap-2 items-center text-muted-foreground">
                                            <Loader2 className="h-3 w-3 animate-spin" /> IA está analisando a reunião...
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/5 ring-1 ring-white/5">
                                    <input
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
                                        placeholder="Pergunta..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button size="icon" className="rounded-xl h-10 w-10" onClick={handleSendMessage}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        READY: "bg-green-500 text-white",
        FAILED: "bg-red-500 text-white",
        RECEIVED: "bg-blue-500 text-white",
    }[status] || "bg-amber-500 text-white animate-pulse";
    return <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg shadow-white/5", config)}>{status}</span>;
}

function Loader2({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}

function AlertCircle({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('pt-BR');
}
