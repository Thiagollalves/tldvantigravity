"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
            <header className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter">Configurações</h1>
                <p className="text-muted-foreground text-sm md:text-lg">Personalize sua experiência e o time.</p>
            </header>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-white/5 p-1 rounded-2xl h-14 w-full md:w-auto mb-8 grid md:flex grid-cols-3">
                    <TabsTrigger value="profile" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-12">
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="team" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-12">
                        Equipe
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-12">
                        Integrações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 m-0">
                    <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="gradient-text">Dados Pessoais</CardTitle>
                            <CardDescription>Como você aparece para o seu time.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-4xl font-black">R</div>
                                <div className="space-y-1">
                                    <Button size="sm" variant="outline">Mudar Avatar</Button>
                                    <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 1MB.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome Completo</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" defaultValue="Rafael" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">E-mail</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" defaultValue="rafael@exemplo.com" disabled />
                                </div>
                            </div>
                            <Button>Salvar Alterações</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6 m-0">
                    <Card className="bg-black/40 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="gradient-text">Membros da Equipe</CardTitle>
                                <CardDescription>Pessoas que têm acesso a este workspace.</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">Convidar</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-white/5">
                                {[
                                    { name: "Rafael", role: "Owner", email: "rafael@exemplo.com" },
                                    { name: "Ana Beatriz", role: "Admin", email: "ana@exemplo.com" },
                                    { name: "Bruno Silva", role: "Member", email: "bruno@exemplo.com" },
                                ].map((m, i) => (
                                    <div key={i} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold">{m.name[0]}</div>
                                            <div>
                                                <p className="font-bold">{m.name}</p>
                                                <p className="text-xs text-muted-foreground">{m.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md">{m.role}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6 m-0">
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { name: "Notion", desc: "Sincronize resumos e tarefas em suas bases de dados.", icon: "N", status: "Conectado" },
                            { name: "Slack", desc: "Receba alertas e resumos em canais específicos.", icon: "#", status: "Disponível" },
                            { name: "Google Drive", desc: "Backup automático dos arquivos de vídeo e áudio.", icon: "G", status: "Disponível" },
                            { name: "WhatsApp", desc: "Envie resumos executivos direto para o seu celular.", icon: "W", status: "Disponível" },
                        ].map((integration, i) => (
                            <Card key={i} className="bg-white/2 border-white/5 hover:bg-white/5 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-xl font-bold">{integration.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{integration.name}</h3>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-primary">{integration.status}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{integration.desc}</p>
                                    <Button variant={integration.status === 'Conectado' ? 'ghost' : 'outline'} className="w-full">
                                        {integration.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
