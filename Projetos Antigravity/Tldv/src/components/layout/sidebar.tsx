"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Video,
    Users,
    Settings,
    FileText,
    PlusCircle,
    LogOut,
    Mic,
    Search,
    Columns
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Video, label: "Reuniões", href: "/meetings" },
    { icon: Columns, label: "Kanban", href: "/kanban" },
    { icon: Users, label: "Time", href: "/team", adminOnly: true },
    { icon: FileText, label: "Templates", href: "/templates" },
    { icon: Search, label: "Busca", href: "/search" },
    { icon: Settings, label: "Configurações", href: "/settings", adminOnly: true },
]

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname()
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Enforce CSR-only role detection
        const storedRole = localStorage.getItem("userRole")
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (storedRole) setUserRole(storedRole)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("userRole")
        localStorage.removeItem("userName")
        router.push("/login")
        if (onItemClick) onItemClick()
    }

    const filteredItems = menuItems.filter(item => !item.adminOnly || userRole === "ADMIN")

    return (
        <div className="flex h-full w-full flex-col border-r bg-black/50 backdrop-blur-xl md:w-64 md:bg-black/50">
            <div className="flex h-20 items-center px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl" onClick={onItemClick}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Mic className="h-5 w-5 text-white" />
                    </div>
                    <span className="gradient-text">NovaNote</span>
                </Link>
            </div>

            <div className="flex-1 space-y-2 p-4">
                <Button variant="primary" className="w-full justify-start gap-2 mb-6 shadow-indigo-500/20 transition-all active:scale-95 hover:shadow-indigo-500/40">
                    <PlusCircle className="h-4 w-4" />
                    Nova Reunião
                </Button>

                <nav className="space-y-1">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t p-4">
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </div>
            </div>
        </div>
    )
}
