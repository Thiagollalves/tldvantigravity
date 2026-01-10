"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Shield, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
    { id: "1", name: "Rafael Silva", email: "rafael@novanote.ai", role: "Owner", avatar: "RS" },
    { id: "2", name: "Ana Paula", email: "ana@novanote.ai", role: "Admin", avatar: "AP" },
    { id: "3", name: "Lucas Melo", email: "lucas@novanote.ai", role: "Member", avatar: "LM" },
];

export default function TeamPage() {
    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Time</h1>
                    <p className="text-muted-foreground text-sm md:text-lg">Gerencie os membros da sua equipe e permissões.</p>
                </div>
                <Button className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                    <UserPlus className="h-5 w-5" />
                    Convidar
                </Button>
            </header>

            <div className="grid gap-6">
                <Card className="border-white/5 bg-white/2 glass-hover-effect">
                    <CardHeader>
                        <CardTitle className="text-xl">Membros Ativos</CardTitle>
                        <CardDescription>Pessoas com acesso ao workspace da equipe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-white/5">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shrink-0">
                                            {member.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold truncate">{member.name}</h3>
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
                                                <Mail className="h-3 w-3" />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] md:text-[10px] uppercase font-black tracking-widest text-primary">
                                            <Shield className="h-3 w-3" />
                                            {member.role}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
