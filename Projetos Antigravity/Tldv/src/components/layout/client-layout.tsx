"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Menu, X, Mic } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="w-64 h-full animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between px-4 border-b bg-background/50 backdrop-blur-md md:hidden shrink-0">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Mic className="h-5 w-5 text-white" />
                        </div>
                        <span className="gradient-text text-sm">NovaNote</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
