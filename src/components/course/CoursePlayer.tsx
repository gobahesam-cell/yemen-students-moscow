"use client";

import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CoursePlayerProps {
    videoUrl: string;
    title: string;
    onComplete?: () => void;
    onProgress?: (seconds: number) => void;
}

export function CoursePlayer({ videoUrl, title, onComplete, onProgress }: CoursePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Detect if it's a YouTube/Vimeo URL
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");
    const isEmbed = isYouTube || isVimeo;

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
        return match ? match[1] : "";
    };

    // Extract Vimeo video ID
    const getVimeoId = (url: string) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : "";
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!videoRef.current || isEmbed) return;

        const video = videoRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
            onProgress?.(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            onComplete?.();
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("ended", handleEnded);
        };
    }, [isEmbed, onComplete, onProgress]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !videoRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    };

    const skip = (seconds: number) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime += seconds;
    };

    // Embed player for YouTube/Vimeo
    if (isEmbed) {
        const embedUrl = isYouTube
            ? `https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?rel=0&modestbranding=1`
            : `https://player.vimeo.com/video/${getVimeoId(videoUrl)}`;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10"
            >
                <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </motion.div>
        );
    }

    // Custom player for direct video files
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10 group"
        >
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Center Play Button */}
                {!isPlaying && (
                    <motion.button
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        onClick={togglePlay}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-yellow-400 transition-all"
                    >
                        <Play size={36} fill="currentColor" className="mr-[-4px]" />
                    </motion.button>
                )}

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden group/progress"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                        </motion.div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => skip(-10)}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <SkipBack size={20} />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                            </button>
                            <button
                                onClick={() => skip(10)}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <SkipForward size={20} />
                            </button>
                            <button
                                onClick={toggleMute}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <span className="text-white/60 text-sm font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-white/60 text-xs font-bold truncate max-w-[200px]">{title}</span>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
