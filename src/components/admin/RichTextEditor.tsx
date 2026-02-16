"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
    Type, Link as LinkIcon, Image as ImageIcon, Palette, Loader2,
    Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
    Youtube as YoutubeIcon, Video, Globe
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const t = useTranslations("Admin.forms");

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt(t("enterUrl") || "Enter URL:");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    };

    const addExternalImage = () => {
        const url = window.prompt("Enter Image URL (e.g. from Telegram):");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addYoutubeVideo = () => {
        const url = window.prompt("Enter YouTube URL:");
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            alert(t("uploadInvalidType") || "Unsupported file type");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert(t("uploadTooLarge") || "File too large");
            return;
        }

        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "yemen_students/content");

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
            } else {
                alert(data.error || t("uploadError") || "Upload failed");
            }
        } catch {
            alert(t("uploadError") || "Upload failed");
        } finally {
            setImageUploading(false);
            e.target.value = "";
        }
    };

    const EditorButton = ({
        onClick,
        isActive,
        disabled,
        children,
        title
    }: {
        onClick: () => void,
        isActive?: boolean,
        disabled?: boolean,
        children: React.ReactNode,
        title?: string
    }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                ${isActive
                    ? "bg-slate-900 dark:bg-yellow-500 text-white dark:text-black shadow-lg shadow-black/5 dark:shadow-yellow-500/20"
                    : "bg-white/50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {children}
        </motion.button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-1">
                <EditorButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}>
                    <Bold size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}>
                    <Italic size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")}>
                    <UnderlineIcon size={16} />
                </EditorButton>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-1">
                <EditorButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
                    <AlignLeft size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
                    <AlignCenter size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
                    <AlignRight size={16} />
                </EditorButton>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-1">
                <EditorButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}>
                    <List size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}>
                    <ListOrdered size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")}>
                    <Quote size={16} />
                </EditorButton>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-1">
                <EditorButton onClick={addLink} isActive={editor.isActive("link")}>
                    <LinkIcon size={16} />
                </EditorButton>
                <EditorButton onClick={() => fileInputRef.current?.click()} disabled={imageUploading} title="Upload Local Image">
                    {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                </EditorButton>
                <EditorButton onClick={addExternalImage} title="Add Image from URL (Telegram, etc.)">
                    <Globe size={16} />
                </EditorButton>
                <EditorButton onClick={addYoutubeVideo} title="Embed YouTube Video">
                    <YoutubeIcon size={16} />
                </EditorButton>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-1">
                <EditorButton onClick={() => editor.chain().focus().undo().run()} title={t("undo") || "Undo"}>
                    <Undo size={16} />
                </EditorButton>
                <EditorButton onClick={() => editor.chain().focus().redo().run()} title={t("redo") || "Redo"}>
                    <Redo size={16} />
                </EditorButton>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Youtube.configure({
                controls: true,
                nocookie: true,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm md:prose-base dark:prose-invert max-w-none min-h-[400px] p-6 outline-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="w-full border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/5 focus-within:ring-4 focus-within:ring-yellow-500/10 focus-within:border-yellow-500/50 transition-all duration-500">
            <MenuBar editor={editor} />
            <div className="bg-white/30 dark:bg-transparent">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
