"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Meeting } from "@/types";
import { useState } from "react";
import { Search, Filter, Calendar, Clock, Video, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDuration, cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingsPage() {
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"list" | "grid">("list");

    const { data: meetings, isLoading } = useQuery<Meeting[]>({
        queryKey: ["meetings", search],
        queryFn: async () => {
            const { data } = await apiClient.get(`/meetings?search=${search}`);
            return data;
        },
        initialData: [],
    });

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black">Minhas Reuniões</h1>
                    <p className="text-muted-foreground">Repositório de conhecimento coletivo do seu time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setView('grid')}
                        className={view === 'grid' ? "bg-white/5 text-primary" : "text-muted-foreground"}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setView('list')}
                        className={view === 'list' ? "bg-white/5 text-primary" : "text-muted-foreground"}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Link href="/meetings/new">
                        <Button className="font-bold">Nova Reunião</Button>
                    </Link>
                </div>
            </header>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Pesquisar por título ou conteúdo da transcrição..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-[58px] px-6 gap-2 border-white/5 bg-white/5 hover:bg-white/10 rounded-2xl text-muted-foreground">
                    <Filter className="h-4 w-4" /> Filtros
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : (
                <div className={view === 'grid' ? "grid md:grid-cols-3 gap-6" : "grid gap-3"}>
                    {meetings.length === 0 ? (
                        <div className="col-span-full py-24 text-center">
                            <Video className="h-16 w-16 mx-auto text-muted-foreground opacity-10 mb-4" />
                            <p className="text-muted-foreground font-medium">Nenhuma reunião encontrada.</p>
                        </div>
                    ) : (
                        meetings.map((meeting) => (
                            <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                                <Card className={cn(
                                    "group border-white/5 transition-all hover:bg-white/5 overflow-hidden",
                                    view === 'list' ? "p-0" : "flex flex-col"
                                )}>
                                    <CardContent className={view === 'list' ? "p-4 flex items-center gap-6" : "p-0"}>
                                        {view === 'grid' && (
                                            <div className="aspect-video bg-zinc-900 flex items-center justify-center border-b border-white/5">
                                                <Video className="h-10 w-10 text-white/10 group-hover:text-primary transition-colors" />
                                            </div>
                                        )}

                                        {view === 'list' && (
                                            <div className="h-14 w-14 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 border border-white/5">
                                                <Video className="h-6 w-6 text-white/20 group-hover:text-primary transition-colors" />
                                            </div>
                                        )}

                                        <div className={cn("flex-1", view === 'grid' && "p-6")}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors underline-offset-4 decoration-primary">{meeting.title}</h3>
                                                <StatusBadge status={meeting.status} />
                                            </div>
                                            <div className="flex gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(meeting.createdAt)}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {formatDuration(meeting.duration || 0)}</span>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter">
                                                    {meeting.template}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, string> = {
        READY: "text-green-500",
        FAILED: "text-red-500",
        RECEIVED: "text-blue-500",
    };
    return <span className={cn("text-[9px] font-black uppercase tracking-widest", configs[status] || "text-amber-500")}>{status}</span>;
}
