"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    date: string;
}

const initialTasks: Task[] = [
    { id: "1", title: "Revisar integração Notion", status: "TODO", priority: "High", assignee: "Rafael", date: "Jan 12" },
    { id: "2", title: "Ajustar prompt de resumo", status: "TODO", priority: "Medium", assignee: "Ana", date: "Jan 15" },
    { id: "3", title: "Otimizar extração FFmpeg", status: "IN_PROGRESS", priority: "High", assignee: "Rafael", date: "Jan 10" },
    { id: "4", title: "Refatorar Tabs Context", status: "DONE", priority: "Low", assignee: "Lucas", date: "Jan 08" },
    { id: "5", title: "Implementar Mobile Drawer", status: "DONE", priority: "Medium", assignee: "Rafael", date: "Jan 09" },
];

const columns = [
    { id: "TODO", title: "Para Fazer", color: "bg-blue-500/20 text-blue-400" },
    { id: "IN_PROGRESS", title: "Em Progresso", color: "bg-amber-500/20 text-amber-400" },
    { id: "DONE", title: "Concluído", color: "bg-green-500/20 text-green-400" },
];

function SortableTaskCard({ task }: { task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="bg-white/5 border-white/5 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group glass-hover-effect touch-none">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter",
                            task.priority === "High" ? "bg-red-500/20 text-red-400" :
                                task.priority === "Medium" ? "bg-amber-500/20 text-amber-400" :
                                    "bg-zinc-500/20 text-zinc-400"
                        )}>
                            {task.priority}
                        </span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="text-sm font-medium leading-tight">{task.title}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{task.date}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function KanbanPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Minimum distance before drag starts
                delay: 250, // 250ms delay for mobile long-press (reduced from 2s for better UX)
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        const overTask = tasks.find((t) => t.id === over.id);

        if (!activeTask) return;

        // If dragging over a column (not a task)
        if (columns.some((col) => col.id === over.id)) {
            const newStatus = over.id as string;
            if (activeTask.status !== newStatus) {
                setTasks((tasks) =>
                    tasks.map((t) =>
                        t.id === activeTask.id ? { ...t, status: newStatus } : t
                    )
                );
            }
            return;
        }

        // If dragging over another task
        if (overTask && activeTask.status !== overTask.status) {
            setTasks((tasks) =>
                tasks.map((t) =>
                    t.id === activeTask.id ? { ...t, status: overTask.status } : t
                )
            );
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        const overTask = tasks.find((t) => t.id === over.id);

        if (!activeTask) return;

        // Handle dropping on a column
        if (columns.some((col) => col.id === over.id)) {
            const newStatus = over.id as string;
            if (activeTask.status !== newStatus) {
                setTasks((tasks) =>
                    tasks.map((t) =>
                        t.id === activeTask.id ? { ...t, status: newStatus } : t
                    )
                );
            }
            return;
        }

        // Handle reordering within the same column
        if (overTask && activeTask.status === overTask.status) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over.id);
            setTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    };

    const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="p-4 md:p-8 space-y-8 min-h-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quadro Kanban</h1>
                        <p className="text-muted-foreground">Gerencie as tarefas extraídas das suas reuniões.</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            💡 <strong>Mobile:</strong> Segure o card por 250ms para arrastar
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Nova Tarefa
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
                    {columns.map((column) => {
                        const columnTasks = tasks.filter((t) => t.status === column.id);

                        return (
                            <div key={column.id} className="flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest", column.color)}>
                                            {column.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-bold">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>

                                <SortableContext
                                    items={columnTasks.map((t) => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div
                                        className="space-y-3 min-h-[200px] rounded-2xl bg-black/20 p-2 border border-white/5 backdrop-blur-sm"
                                        data-column-id={column.id}
                                    >
                                        {columnTasks.map((task) => (
                                            <SortableTaskCard key={task.id} task={task} />
                                        ))}
                                        {columnTasks.length === 0 && (
                                            <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-muted-foreground text-[10px] font-medium">
                                                Arraste aqui
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        );
                    })}
                </div>
            </div>

            <DragOverlay>
                {activeTask ? (
                    <Card className="bg-white/10 border-white/20 shadow-2xl rotate-3 scale-105 cursor-grabbing">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter",
                                    activeTask.priority === "High" ? "bg-red-500/20 text-red-400" :
                                        activeTask.priority === "Medium" ? "bg-amber-500/20 text-amber-400" :
                                            "bg-zinc-500/20 text-zinc-400"
                                )}>
                                    {activeTask.priority}
                                </span>
                            </div>
                            <p className="text-sm font-medium leading-tight">{activeTask.title}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span className="text-[10px] font-medium">{activeTask.assignee}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px] font-medium">{activeTask.date}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
