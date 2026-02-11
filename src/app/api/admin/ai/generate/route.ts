import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { prompt, bilingual } = await req.json();
        const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
        const GOOGLE_KEY = process.env.GOOGLE_AI_API_KEY;

        if (!prompt) {
            return NextResponse.json({ error: "الرجاء إدخال فكرة المقال" }, { status: 400 });
        }

        let titleText = prompt.trim();
        const commandPattern = /^(اكتب|أكتب|أريد|اريد|سوي|إعمل|اعمل|حدثني|تكلم|تقرير|خبر|مقال|موضوع|مقالة|مقالات|قصة|أخبار|عن|حول|بخصوص|بشأن|لـ|مباشر)\s+/gi;
        let prevTitle;
        do {
            prevTitle = titleText;
            titleText = titleText.replace(commandPattern, "").trim();
        } while (titleText !== prevTitle);

        const cleanTopic = titleText || prompt;
        const imageUrl = "/logo.png";

        const systemPrompt = bilingual
            ? "أنت صحفي خبير ثنائي اللغة (عربي وروسي). اكتب مقالاً إخبارياً منظماً. يجب أن يكون الرد بصيغة JSON حصراً بالتنسيق التالي: { \"titleAr\": \"...\", \"titleRu\": \"...\", \"contentAr\": \"...\", \"contentRu\": \"...\" }. استخدم HTML داخل المحتوى (h2, p)."
            : "أنت صحفي خبير. اكتب مقالاً إخبارياً بتنسيق HTML فقط.";

        const userPrompt = bilingual
            ? `اكتب خبراً عن الموضوع التالي بالعربية والروسية: "${prompt}"`
            : `الموضوع: ${prompt}`;

        // Helper function to clean JSON response
        const cleanJson = (text: string) => {
            try {
                // Strip markdown code blocks if present
                const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                const jsonStr = match ? match[1] : text;
                return JSON.parse(jsonStr);
            } catch (e) {
                console.error("Failed to parse AI JSON:", text);
                return null;
            }
        };

        // try DeepSeek
        if (DEEPSEEK_KEY && DEEPSEEK_KEY !== "MOCK") {
            try {
                console.log("DeepSeek bilingual request...");
                const response = await fetch("https://api.deepseek.com/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${DEEPSEEK_KEY}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        response_format: bilingual ? { type: "json_object" } : undefined,
                        temperature: 0.7,
                        max_tokens: 4000
                    }),
                    signal: AbortSignal.timeout(20000)
                });

                if (response.ok) {
                    const data = await response.json();
                    let text = data.choices[0].message.content;

                    if (bilingual) {
                        const parsed = cleanJson(text);
                        if (parsed) {
                            return NextResponse.json({ ...parsed, image: imageUrl, provider: "deepseek" });
                        }
                    } else {
                        return NextResponse.json({
                            titleAr: cleanTopic,
                            contentAr: text,
                            image: imageUrl,
                            provider: "deepseek"
                        });
                    }
                }
            } catch (err) {
                console.error("DeepSeek Error:", err);
            }
        }

        // try Gemini
        if (GOOGLE_KEY && GOOGLE_KEY !== "MOCK") {
            try {
                console.log("Gemini bilingual request...");
                const genAI = new GoogleGenerativeAI(GOOGLE_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    generationConfig: {
                        responseMimeType: bilingual ? "application/json" : "text/plain",
                        temperature: 0.7
                    }
                });

                const fullPrompt = bilingual
                    ? `Create a bilingual news article in Arabic and Russian about: "${prompt}". Return JSON with exactly these keys: titleAr, titleRu, contentAr (HTML), contentRu (HTML).`
                    : `اكتب موضوع إخباري منظم وعصري حول: "${prompt}". ارجع HTML فقط (h2, p, blockquote).`;

                const result = await model.generateContent(fullPrompt);
                const res = await result.response;
                const text = res.text();

                if (bilingual) {
                    const parsed = cleanJson(text);
                    if (parsed) {
                        return NextResponse.json({ ...parsed, image: imageUrl, provider: "gemini" });
                    }
                } else {
                    return NextResponse.json({
                        titleAr: cleanTopic,
                        contentAr: text,
                        image: imageUrl,
                        provider: "gemini"
                    });
                }
            } catch (err: any) {
                console.error("Gemini Error:", err.message || err);
            }
        }

        // Final Mock Fallback
        return NextResponse.json({
            titleAr: cleanTopic,
            titleRu: "Новость: " + cleanTopic,
            contentAr: `<p>تم توليد هذا المحتوى بشكل آلي مؤقت لـ: ${cleanTopic}. نعتذر عن انقطاع الخدمة اللحظي.</p>`,
            contentRu: `<p>Это временно сгенерированное содержание для: ${cleanTopic}. Извините за временные неудобства.</p>`,
            image: imageUrl,
            isMock: true,
            provider: "universal-mock"
        });

    } catch (error: any) {
        console.error("Route Error:", error);
        return NextResponse.json({ error: "خطأ في معالجة الطلب الذكي" }, { status: 500 });
    }
}
