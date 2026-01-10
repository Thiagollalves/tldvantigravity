"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, Filter, Video, FileText, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
            <header className="space-y-4 md:space-y-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Busca Global</h1>
                    <p className="text-muted-foreground text-sm md:text-lg">Pesquise em transcrições, títulos e decisões.</p>
                </div>

                <div className="relative group w-full max-w-2xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <SearchIcon className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute right-2 top-1.5 md:top-2">
                        <Button size="sm" className="rounded-xl h-9 md:h-10 px-4 md:px-6 font-bold truncate max-w-[80px] md:max-w-none">
                            <span className="hidden sm:inline">Buscar</span>
                            <SearchIcon className="h-4 w-4 sm:hidden" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-bold gap-2">
                    <Video className="h-3 w-3" /> Reuniões
                </Button>
                <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-bold gap-2">
                    <FileText className="h-3 w-3" /> Transcrições
                </Button>
                <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-bold gap-2">
                    <Calendar className="h-3 w-3" /> Data
                </Button>
                <Button variant="ghost" className="rounded-full h-8 px-4 text-xs font-bold gap-2 text-primary">
                    <Filter className="h-3 w-3" /> Todos os Filtros
                </Button>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Resultados sugeridos</h2>
                </div>

                <div className="grid gap-4">
                    <Link href="/meeting/1">
                        <Card className="border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer group glass-hover-effect">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest mb-1">
                                            <span className="h-1 w-1 rounded-full bg-primary" /> Transcrição
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold truncate">&quot;sobre a integração com o **Google Calendar**...&quot;</h3>
                                        <p className="text-xs md:text-sm text-muted-foreground truncate">Encontrado em: **Mensal de Produto**</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>
        </div>
    );
}
