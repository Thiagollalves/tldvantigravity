"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Loader2, CheckCircle2, FileVideo } from "lucide-react";
import { useDropzone } from "react-dropzone";
import apiClient from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewMeetingPage() {
    const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Get pre-signed URL
            const { data: { meetingId, uploadUrl } } = await apiClient.post("/meetings", {
                title: file.name.split('.')[0],
                fileName: file.name,
                mimeType: file.type,
            });

            // 2. Upload to S3 (using standard XHR for progress)
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);

            xhr.upload.onprogress = (evt) => {
                if (evt.lengthComputable) {
                    setProgress(Math.round((evt.loaded / evt.total) * 100));
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    await apiClient.post(`/meetings/${meetingId}/complete-upload`);
                    toast.success("Upload concluído! Processando sua reunião...");
                    router.push(`/meetings/${meetingId}`);
                } else {
                    toast.error("Falha no upload");
                    setIsUploading(false);
                }
            };

            xhr.send(file);
        } catch (err) {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.avi'],
            'audio/*': ['.mp3', '.wav', '.m4a']
        },
        multiple: false,
        disabled: isUploading
    });

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-black">Nova Reunião</h1>
                <p className="text-muted-foreground">Escolha como deseja importar o conhecimento da sua conversa.</p>
            </header>

            <div className="flex p-1 bg-white/5 rounded-xl gap-2">
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'upload' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                    <Upload className="h-4 w-4" /> Upload
                </button>
                <button
                    onClick={() => setActiveTab("record")}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'record' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                    <Mic className="h-4 w-4" /> Gravar Agora
                </button>
            </div>

            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-8">
                    {activeTab === "upload" ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'} ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <div className="space-y-4">
                                {isUploading ? (
                                    <div className="space-y-6">
                                        <div className="relative h-20 w-20 mx-auto">
                                            <Loader2 className="h-20 w-20 text-primary animate-spin" />
                                            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs">{progress}%</span>
                                        </div>
                                        <p className="font-bold">Subindo seu arquivo...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FileVideo className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Arraste ou clique para selecionar</h3>
                                            <p className="text-sm text-muted-foreground mt-2">Suporta MP4, MOV, MP3, WAV (Máx 2GB)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 py-12">
                            <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Mic className="h-10 w-10 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Gravação Web</h3>
                                <p className="text-sm text-muted-foreground px-8 mt-2">Grave o áudio diretamente do seu navegador. Ideal para reuniões presenciais ou feedbacks rápidos.</p>
                            </div>
                            <Button size="lg" className="px-12 py-7 text-lg bg-red-600 hover:bg-red-700">Começar Gravação</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">i</div>
                <p className="text-xs text-blue-200">Seu arquivo será processado e transcrito em poucos minutos. Você receberá uma notificação quando estiver pronto.</p>
            </div>
        </div>
    );
}
