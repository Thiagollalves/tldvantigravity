"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Meeting } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Clock, CheckCircle2, Play, PlusCircle, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { data: meetings, isLoading } = useQuery<Meeting[]>({
        queryKey: ["meetings", "recent"],
        queryFn: async () => {
            const { data } = await apiClient.get("/meetings");
            return data;
        },
        // fallback data for demo
        initialData: [],
    });

    const stats = [
        { label: "Total de Reuniões", value: meetings?.length || 0, icon: Video, color: "text-blue-500" },
        { label: "Horas Gravadas", value: "12.5h", icon: Clock, color: "text-purple-500" },
        { label: "Tasks Concluídas", value: "85%", icon: CheckCircle2, color: "text-green-500" },
    ];

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Gerencie o conhecimento das suas reuniões.</p>
                </div>
                <Link href="/meetings/new">
                    <button className="flex items-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                        <PlusCircle className="h-5 w-5 text-white" />
                        Nova Reunião
                    </button>
                </Link>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-white/5 bg-white/2 overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}>
                            <stat.icon className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                                {stat.label}
                            </CardDescription>
                            <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        Últimas Reuniões
                    </h2>
                    <Link href="/meetings" className="text-sm text-primary hover:underline font-medium">
                        Ver todas
                    </Link>
                </div>

                <div className="grid gap-4">
                    {meetings.length === 0 ? (
                        <Card className="p-12 text-center border-dashed border-white/10 bg-transparent">
                            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground">Nenhuma reunião encontrada. Vamos começar?</p>
                        </Card>
                    ) : (
                        meetings.slice(0, 5).map((meeting) => (
                            <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                                <Card className="hover:bg-white/5 transition-all cursor-pointer group border-white/5">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="h-12 w-20 rounded-lg bg-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                                            <Play className="h-4 w-4 text-white/50 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate text-lg">{meeting.title}</h3>
                                            <div className="flex gap-3 text-sm text-muted-foreground items-center">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(meeting.createdAt)}</span>
                                                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold tracking-tighter">
                                                    {meeting.template}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <StatusBadge status={meeting.status} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; class: string }> = {
        READY: { label: "Pronta", class: "bg-green-500/10 text-green-500" },
        FAILED: { label: "Erro", class: "bg-red-500/10 text-red-500" },
        RECEIVED: { label: "Iniciado", class: "bg-blue-500/10 text-blue-500" },
    };

    const config = configs[status] || { label: "Processando", class: "bg-amber-500/10 text-amber-500 animate-pulse" };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.class}`}>
            {config.label}
        </span>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-12 w-40" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </div>
        </div>
    );
}
