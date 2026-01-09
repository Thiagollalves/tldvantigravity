"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay
        setTimeout(() => {
            if (email === "admin@novanote.ai") {
                localStorage.setItem("userRole", "ADMIN");
                localStorage.setItem("userName", "Admin Master");
                toast.success("Bem-vindo de volta, Admin!");
            } else {
                localStorage.setItem("userRole", "USER");
                localStorage.setItem("userName", "Rafael Silva");
                toast.success("Login realizado com sucesso!");
            }
            router.push("/dashboard");
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <Card className="w-full max-w-md bg-black/40 border-white/5 backdrop-blur-2xl shadow-2xl relative z-10 transition-all hover:border-white/10">
                <CardHeader className="space-y-4 text-center pb-8 border-b border-white/5">
                    <div className="flex justify-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Mic className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black italic tracking-tighter gradient-text">NovaNote</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium">Acesse sua inteligência em reuniões</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Senha</label>
                                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Esqueci a senha</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full h-12 rounded-xl font-bold gap-2 text-base group mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? "Autenticando..." : "Entrar no Workspace"}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-transparent px-2 text-muted-foreground">Teste com admin@novanote.ai</span></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
