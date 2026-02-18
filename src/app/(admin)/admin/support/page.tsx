"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import {
    Plus, Trash2, Save, X, CreditCard, QrCode,
    GripVertical, Eye, EyeOff, Upload, Loader2
} from "lucide-react";

interface PaymentMethod {
    id: string;
    name: string;
    nameRu: string | null;
    accountNumber: string;
    holderName: string | null;
    holderNameRu: string | null;
    qrCodeImage: string | null;
    sortOrder: number;
    isActive: boolean;
}

export default function AdminSupportPage() {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [uploadingQr, setUploadingQr] = useState<string | null>(null);

    // حقول النموذج الجديد
    const [newMethod, setNewMethod] = useState({
        name: "",
        nameRu: "",
        accountNumber: "",
        holderName: "",
        holderNameRu: "",
        qrCodeImage: "",
    });

    // جلب البيانات
    const fetchMethods = async () => {
        try {
            const res = await fetch("/api/admin/payment-methods");
            if (res.ok) {
                const data = await res.json();
                setMethods(data);
            }
        } catch (error) {
            console.error("Error fetching methods:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    // إضافة وسيلة جديدة
    const handleAdd = async () => {
        if (!newMethod.name || !newMethod.accountNumber) return;
        setSaving("new");
        try {
            const res = await fetch("/api/admin/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMethod),
            });
            if (res.ok) {
                setNewMethod({ name: "", nameRu: "", accountNumber: "", holderName: "", holderNameRu: "", qrCodeImage: "" });
                setShowForm(false);
                fetchMethods();
            }
        } catch (error) {
            console.error("Error adding method:", error);
        } finally {
            setSaving(null);
        }
    };

    // تحديث وسيلة
    const handleUpdate = async (id: string, data: Partial<PaymentMethod>) => {
        setSaving(id);
        try {
            await fetch(`/api/admin/payment-methods/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            fetchMethods();
        } catch (error) {
            console.error("Error updating method:", error);
        } finally {
            setSaving(null);
        }
    };

    // حذف وسيلة
    const handleDelete = async (id: string) => {
        const confirmed = confirm(isRTL ? "هل أنت متأكد من حذف وسيلة الدفع هذه؟" : "Удалить этот способ оплаты?");
        if (!confirmed) return;
        try {
            await fetch(`/api/admin/payment-methods/${id}`, { method: "DELETE" });
            fetchMethods();
        } catch (error) {
            console.error("Error deleting method:", error);
        }
    };

    // رفع صورة QR Code
    const handleQrUpload = async (id: string | "new", file: File) => {
        setUploadingQr(id);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                const imageUrl = data.url || data.secure_url;
                if (id === "new") {
                    setNewMethod(prev => ({ ...prev, qrCodeImage: imageUrl }));
                } else {
                    await handleUpdate(id, { qrCodeImage: imageUrl });
                }
            }
        } catch (error) {
            console.error("Error uploading QR:", error);
        } finally {
            setUploadingQr(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-yellow-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isRTL ? "إدارة الدعم ووسائل الدفع" : "Управление поддержкой"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {isRTL ? "أضف وعدّل أرقام الحسابات وصور QR Code" : "Добавляйте и редактируйте реквизиты и QR-коды"}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-colors"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm
                        ? (isRTL ? "إلغاء" : "Отмена")
                        : (isRTL ? "إضافة وسيلة دفع" : "Добавить способ")}
                </button>
            </div>

            {/* نموذج إضافة جديد */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                        {isRTL ? "إضافة وسيلة دفع جديدة" : "Новый способ оплаты"}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* اسم البنك بالعربية */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {isRTL ? "اسم البنك (عربي) *" : "Название банка (ар.) *"}
                            </label>
                            <input
                                value={newMethod.name}
                                onChange={e => setNewMethod(p => ({ ...p, name: e.target.value }))}
                                placeholder={isRTL ? "مثال: سبيربانك" : "Например: Сбербанк"}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* اسم البنك بالروسية */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {isRTL ? "اسم البنك (روسي)" : "Название банка (рус.)"}
                            </label>
                            <input
                                value={newMethod.nameRu}
                                onChange={e => setNewMethod(p => ({ ...p, nameRu: e.target.value }))}
                                placeholder={isRTL ? "مثال: Сбербанк" : "Например: Сбербанк"}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* رقم الحساب */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {isRTL ? "رقم الحساب / البطاقة *" : "Номер счёта / карты *"}
                            </label>
                            <input
                                value={newMethod.accountNumber}
                                onChange={e => setNewMethod(p => ({ ...p, accountNumber: e.target.value }))}
                                placeholder="40703810601300001225"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 font-mono"
                                dir="ltr"
                            />
                        </div>

                        {/* اسم صاحب الحساب بالعربية */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {isRTL ? "اسم صاحب الحساب (عربي)" : "Владелец счёта (ар.)"}
                            </label>
                            <input
                                value={newMethod.holderName}
                                onChange={e => setNewMethod(p => ({ ...p, holderName: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* اسم صاحب الحساب بالروسية */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {isRTL ? "اسم صاحب الحساب (روسي)" : "Владелец счёта (рус.)"}
                            </label>
                            <input
                                value={newMethod.holderNameRu}
                                onChange={e => setNewMethod(p => ({ ...p, holderNameRu: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>
                    </div>

                    {/* رفع QR Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {isRTL ? "صورة QR Code" : "QR-код"}
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                {uploadingQr === "new" ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Upload size={18} className="text-slate-500" />
                                )}
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {isRTL ? "رفع صورة" : "Загрузить"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => {
                                        if (e.target.files?.[0]) handleQrUpload("new", e.target.files[0]);
                                    }}
                                />
                            </label>
                            {newMethod.qrCodeImage && (
                                <div className="relative w-16 h-16">
                                    <Image src={newMethod.qrCodeImage} alt="QR" fill className="object-contain rounded-lg" />
                                    <button
                                        onClick={() => setNewMethod(p => ({ ...p, qrCodeImage: "" }))}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={saving === "new" || !newMethod.name || !newMethod.accountNumber}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
                    >
                        {saving === "new" ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isRTL ? "إضافة" : "Добавить"}
                    </button>
                </div>
            )}

            {/* قائمة وسائل الدفع */}
            {methods.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <CreditCard className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                    <p className="text-slate-500">
                        {isRTL ? "لا توجد وسائل دفع بعد. أضف واحدة!" : "Нет способов оплаты. Добавьте первый!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {methods.map(method => (
                        <PaymentMethodCard
                            key={method.id}
                            method={method}
                            isRTL={isRTL}
                            saving={saving === method.id}
                            uploadingQr={uploadingQr === method.id}
                            onUpdate={(data) => handleUpdate(method.id, data)}
                            onDelete={() => handleDelete(method.id)}
                            onQrUpload={(file) => handleQrUpload(method.id, file)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// مكون بطاقة وسيلة الدفع
function PaymentMethodCard({
    method,
    isRTL,
    saving,
    uploadingQr,
    onUpdate,
    onDelete,
    onQrUpload,
}: {
    method: PaymentMethod;
    isRTL: boolean;
    saving: boolean;
    uploadingQr: boolean;
    onUpdate: (data: Partial<PaymentMethod>) => void;
    onDelete: () => void;
    onQrUpload: (file: File) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: method.name,
        nameRu: method.nameRu || "",
        accountNumber: method.accountNumber,
        holderName: method.holderName || "",
        holderNameRu: method.holderNameRu || "",
    });

    const handleSave = () => {
        onUpdate(form);
        setEditing(false);
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${method.isActive ? "border-slate-200 dark:border-slate-800" : "border-red-200 dark:border-red-800/30 opacity-60"} p-6 transition-all`}>
            <div className="flex items-start gap-4">
                {/* الأيقونة + الترتيب */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <GripVertical size={18} className="text-slate-400" />
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <CreditCard size={20} className="text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                {/* المحتوى */}
                <div className="flex-1 min-w-0">
                    {editing ? (
                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder={isRTL ? "اسم البنك (عربي)" : "Название (ар.)"}
                                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-yellow-500"
                            />
                            <input
                                value={form.nameRu}
                                onChange={e => setForm(p => ({ ...p, nameRu: e.target.value }))}
                                placeholder={isRTL ? "اسم البنك (روسي)" : "Название (рус.)"}
                                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-yellow-500"
                            />
                            <input
                                value={form.accountNumber}
                                onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))}
                                placeholder={isRTL ? "رقم الحساب" : "Номер счёта"}
                                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-yellow-500 font-mono"
                                dir="ltr"
                            />
                            <input
                                value={form.holderName}
                                onChange={e => setForm(p => ({ ...p, holderName: e.target.value }))}
                                placeholder={isRTL ? "صاحب الحساب (عربي)" : "Владелец (ар.)"}
                                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-yellow-500"
                            />
                            <input
                                value={form.holderNameRu}
                                onChange={e => setForm(p => ({ ...p, holderNameRu: e.target.value }))}
                                placeholder={isRTL ? "صاحب الحساب (روسي)" : "Владелец (рус.)"}
                                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-yellow-500"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">
                                    {isRTL ? method.name : (method.nameRu || method.name)}
                                </h3>
                                {method.nameRu && isRTL && (
                                    <span className="text-xs text-slate-400">({method.nameRu})</span>
                                )}
                                {!isRTL && method.name !== method.nameRu && (
                                    <span className="text-xs text-slate-400">({method.name})</span>
                                )}
                                {!method.isActive && (
                                    <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full">
                                        {isRTL ? "معطّل" : "Скрыт"}
                                    </span>
                                )}
                            </div>
                            <div className="text-lg font-mono text-slate-600 dark:text-slate-400" dir="ltr">
                                {method.accountNumber}
                            </div>
                            {(method.holderName || method.holderNameRu) && (
                                <div className="text-sm text-slate-400 mt-0.5">
                                    {isRTL ? method.holderName : (method.holderNameRu || method.holderName)}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    {method.qrCodeImage ? (
                        <div className="relative w-20 h-20 group">
                            <Image src={method.qrCodeImage} alt="QR" fill className="object-contain rounded-lg border border-slate-200 dark:border-slate-700" />
                            <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                {uploadingQr ? (
                                    <Loader2 size={16} className="text-white animate-spin" />
                                ) : (
                                    <Upload size={16} className="text-white" />
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onQrUpload(e.target.files[0]); }} />
                            </label>
                        </div>
                    ) : (
                        <label className="w-20 h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            {uploadingQr ? (
                                <Loader2 size={16} className="text-slate-400 animate-spin" />
                            ) : (
                                <>
                                    <QrCode size={20} className="text-slate-400 mb-1" />
                                    <span className="text-[10px] text-slate-400">QR</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onQrUpload(e.target.files[0]); }} />
                        </label>
                    )}
                </div>

                {/* الأزرار */}
                <div className="flex flex-col gap-2 shrink-0">
                    {editing ? (
                        <>
                            <button onClick={handleSave} disabled={saving} className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            </button>
                            <button onClick={() => setEditing(false)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors">
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)} className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title={isRTL ? "تعديل" : "Редактировать"}>
                                <Save size={16} />
                            </button>
                            <button onClick={() => onUpdate({ isActive: !method.isActive })} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors" title={method.isActive ? (isRTL ? "إخفاء" : "Скрыть") : (isRTL ? "إظهار" : "Показать")}>
                                {method.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button onClick={onDelete} className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title={isRTL ? "حذف" : "Удалить"}>
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
