"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
    Type, Link as LinkIcon, Image as ImageIcon, Palette, Loader2
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("أدخل الرابط:");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            alert("نوع الملف غير مدعوم (JPEG, PNG, WebP, GIF فقط)");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("حجم الملف يتجاوز 10MB");
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
                alert(data.error || "فشل في رفع الصورة");
            }
        } catch {
            alert("فشل في رفع الصورة");
        } finally {
            setImageUploading(false);
            e.target.value = "";
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <Italic size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <ListOrdered size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <Quote size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
            <button
                type="button"
                onClick={addLink}
                className={`p-2 rounded-lg transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
                <LinkIcon size={18} />
            </button>
            <button
                type="button"
                onClick={addImage}
                disabled={imageUploading}
                className={`p-2 rounded-lg transition-colors ${imageUploading ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                title="إدراج صورة"
            >
                {imageUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
            />
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 outline-none',
            },
        },
        immediatelyRender: false,
    });

    // مزامنة المحتوى عندما يتغير من الخارج (مثلاً عند التوليد بالذكاء الاصطناعي)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
