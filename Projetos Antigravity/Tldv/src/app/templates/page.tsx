"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Plus, Star, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
    { id: "1", name: "Daily Standup", description: "Focado em progresso, bloqueios e planos para o dia.", usage: 128, category: "Agile" },
    { id: "2", name: "Executive Review", description: "Resumo estratégico de alto nível para liderança.", usage: 45, category: "Business" },
    { id: "3", name: "Product Roadmap", description: "Alinhamento de visão e prioridades de produto.", usage: 82, category: "Product" },
    { id: "4", name: "Technical Specs", description: "Detalhamento técnico e decisões de arquitetura.", usage: 64, category: "Eng" },
];

export default function TemplatesPage() {
    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground text-sm md:text-lg">Padronize a extração de insights com modelos de IA.</p>
                </div>
                <Button className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    Novo Template
                </Button>
            </header>

            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="border-white/5 bg-white/2 hover:bg-white/5 transition-all group overflow-hidden border-t-2 border-t-primary/20 glass-hover-effect">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary mb-2">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-500">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{template.name}</CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                    <Clock className="h-3.5 w-3.5" />
                                    {template.usage} usos
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 gap-1 font-bold">
                                    <Copy className="h-3 w-3" />
                                    Usar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
