"use client";

import { useRef } from "react";

interface CertificateProps {
    studentName: string;
    courseName: string;
    completedAt: Date;
    locale: "ar" | "ru";
}

export default function Certificate({ studentName, courseName, completedAt, locale }: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const isArabic = locale === "ar";

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    const texts = {
        ar: {
            org: "الجالية اليمنية في موسكو",
            title: "شـهـادة إتـمـام",
            subtitle: "CERTIFICATE OF COMPLETION",
            certify: "تشهد بأن",
            student: "الطالب / الطالبة",
            completed: "قد أتم بنجاح جميع متطلبات دورة",
            course: "الدورة التدريبية",
            date: "تاريخ الإصدار",
            signature: "التوقيع والختم",
            director: "مدير البرامج التعليمية",
            print: "طباعة الشهادة",
        },
        ru: {
            org: "Йеменская община в Москве",
            title: "СЕРТИФИКАТ",
            subtitle: "CERTIFICATE OF COMPLETION",
            certify: "Настоящим удостоверяется, что",
            student: "Студент",
            completed: "успешно завершил(а) обучение по курсу",
            course: "Учебный курс",
            date: "Дата выдачи",
            signature: "Подпись и печать",
            director: "Директор учебных программ",
            print: "Печать сертификата",
        },
    };

    const t = texts[locale];

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const certificateHtml = `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${locale}">
<head>
    <meta charset="UTF-8">
    <title>${t.title} - ${studentName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 landscape; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Cairo', sans-serif;
            background: #1a1a2e;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 15px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .certificate {
            width: 297mm;
            height: 210mm;
            background: linear-gradient(145deg, #fffef5 0%, #faf8f0 50%, #f5f3e8 100%);
            position: relative;
            box-shadow: 0 25px 80px rgba(0,0,0,0.4);
        }
        
        /* Ornate Border */
        .border-outer {
            position: absolute;
            inset: 8mm;
            border: 3px solid #1a365d;
        }
        
        .border-inner {
            position: absolute;
            inset: 12mm;
            border: 1px solid #b8860b;
        }
        
        .border-innermost {
            position: absolute;
            inset: 14mm;
            border: 1px solid rgba(184, 134, 11, 0.4);
        }
        
        /* Corner Ornaments */
        .corner {
            position: absolute;
            width: 50px;
            height: 50px;
            border: 2px solid #b8860b;
        }
        
        .corner-tl { top: 16mm; left: 16mm; border-right: none; border-bottom: none; }
        .corner-tr { top: 16mm; right: 16mm; border-left: none; border-bottom: none; }
        .corner-bl { bottom: 16mm; left: 16mm; border-right: none; border-top: none; }
        .corner-br { bottom: 16mm; right: 16mm; border-left: none; border-top: none; }
        
        /* Content */
        .content {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 22mm 35mm;
            text-align: center;
        }
        
        /* Header */
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 12px;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #1a365d;
        }
        
        .logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .org-name {
            font-size: 22px;
            font-weight: 700;
            color: #1a365d;
            letter-spacing: 1px;
        }
        
        /* Main Title */
        .main-title {
            font-size: 56px;
            font-weight: 900;
            color: #1a365d;
            margin: 15px 0 5px;
            letter-spacing: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .subtitle {
            font-size: 12px;
            color: #b8860b;
            letter-spacing: 6px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        /* Decorative Line */
        .decorative-line {
            width: 400px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #b8860b, #1a365d, #b8860b, transparent);
            margin: 10px 0 25px;
            position: relative;
        }
        
        .decorative-line::before {
            content: '❖';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #b8860b;
            font-size: 16px;
            background: #faf8f0;
            padding: 0 15px;
        }
        
        /* Certification Text */
        .certify-text {
            font-size: 16px;
            color: #4a5568;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        /* Student Name */
        .student-name {
            font-size: 44px;
            font-weight: 800;
            color: #1a365d;
            margin: 8px 0 15px;
            border-bottom: 3px solid #b8860b;
            padding-bottom: 8px;
            min-width: 350px;
        }
        
        /* Completion Text */
        .completion-text {
            font-size: 15px;
            color: #4a5568;
            font-weight: 400;
            margin-bottom: 10px;
        }
        
        /* Course Name */
        .course-name {
            font-size: 30px;
            font-weight: 700;
            color: #2c5282;
            margin: 10px 0 25px;
            position: relative;
        }
        
        .course-name::before,
        .course-name::after {
            content: '✦';
            color: #b8860b;
            font-size: 12px;
            margin: 0 15px;
        }
        
        /* Bottom Section */
        .bottom-section {
            position: absolute;
            bottom: 28mm;
            left: 35mm;
            right: 35mm;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        
        .date-box, .signature-box {
            text-align: center;
            min-width: 150px;
        }
        
        .box-value {
            font-size: 14px;
            font-weight: 600;
            color: #1a365d;
            border-bottom: 1px solid #1a365d;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        
        .box-label {
            font-size: 11px;
            color: #718096;
            font-weight: 500;
        }
        

        
        @media print {
            body { background: white; padding: 0; }
            .certificate { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="border-outer"></div>
        <div class="border-inner"></div>
        <div class="border-innermost"></div>
        
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
        
        <div class="content">
            <div class="header">
                <div class="logo"><img src="/logo.png" alt="Logo" /></div>
                <div class="org-name">${t.org}</div>
            </div>
            
            <h1 class="main-title">${t.title}</h1>
            <div class="subtitle">${t.subtitle}</div>
            
            <div class="decorative-line"></div>
            
            <p class="certify-text">${t.certify}</p>
            
            <h2 class="student-name">${studentName}</h2>
            
            <p class="completion-text">${t.completed}</p>
            
            <h3 class="course-name">${courseName}</h3>
            
            <div class="bottom-section">
                <div class="date-box">
                    <div class="box-value">${formatDate(completedAt)}</div>
                    <div class="box-label">${t.date}</div>
                </div>
                

                
                <div class="signature-box">
                    <div class="box-value">_______________</div>
                    <div class="box-label">${t.signature}</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        window.onload = function() { setTimeout(function() { window.print(); }, 500); };
    </script>
</body>
</html>
        `;

        printWindow.document.write(certificateHtml);
        printWindow.document.close();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-white">
                        {isArabic ? "🎓 شهادة إتمام الدورة" : "🎓 Сертификат об окончании"}
                    </h1>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        {t.print}
                    </button>
                </div>

                {/* Certificate Preview */}
                <div
                    ref={certificateRef}
                    className="relative rounded-lg overflow-hidden shadow-2xl aspect-[297/210]"
                    style={{
                        background: "linear-gradient(145deg, #fffef5 0%, #faf8f0 50%, #f5f3e8 100%)"
                    }}
                >
                    {/* Borders */}
                    <div className="absolute inset-4 border-2 border-slate-800" />
                    <div className="absolute inset-6 border border-amber-600" />
                    <div className="absolute inset-7 border border-amber-600/40" />

                    {/* Corner Ornaments */}
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
                    <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
                    <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center px-16 py-10 text-center">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-800">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-lg font-bold text-slate-800">{t.org}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-widest my-2">
                            {t.title}
                        </h1>
                        <p className="text-[10px] text-amber-700 tracking-[4px] font-semibold mb-3">
                            {t.subtitle}
                        </p>

                        {/* Decorative Line */}
                        <div className="w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-3 relative">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 text-xs bg-[#faf8f0] px-2">❖</span>
                        </div>

                        {/* Certification */}
                        <p className="text-slate-600 text-sm mt-3">{t.certify}</p>

                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 my-2 border-b-2 border-amber-600 pb-1 min-w-[200px]">
                            {studentName}
                        </h2>

                        <p className="text-slate-600 text-sm">{t.completed}</p>

                        <h3 className="text-xl md:text-2xl font-bold text-slate-700 my-2 flex items-center gap-2">
                            <span className="text-amber-600 text-xs">✦</span>
                            {courseName}
                            <span className="text-amber-600 text-xs">✦</span>
                        </h3>

                        {/* Bottom Section */}
                        <div className="absolute bottom-10 left-16 right-16 flex items-end justify-between">
                            <div className="text-center">
                                <div className="text-sm font-semibold text-slate-800 border-b border-slate-800 pb-1 mb-1 min-w-[120px]">
                                    {formatDate(completedAt)}
                                </div>
                                <div className="text-[10px] text-slate-500">{t.date}</div>
                            </div>



                            <div className="text-center">
                                <div className="text-sm font-semibold text-slate-800 border-b border-slate-800 pb-1 mb-1 min-w-[120px]">
                                    _______________
                                </div>
                                <div className="text-[10px] text-slate-500">{t.signature}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tip */}
                <p className="text-center text-slate-400 text-sm mt-6">
                    💡 {isArabic ? "اختر Save as PDF من نافذة الطباعة للحفظ" : "Выберите Save as PDF для сохранения"}
                </p>
            </div>
        </div>
    );
}
