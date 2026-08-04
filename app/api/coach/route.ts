import { NextRequest, NextResponse } from "next/server";

// Groq — OpenAI-compatible chat completions endpoint.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // swap here if you want a different Groq model

interface CoachRequestBody {
  question: string;
  repoData?: Record<string, any>;
  languageData?: Record<string, any>;
  contributors?: any[];
  readme?: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Missing GROQ_API_KEY on the server." },
        { status: 500 }
      );
    }

    const body: CoachRequestBody = await req.json();
    const { question, repoData, languageData, contributors, readme } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, message: "Question is required." },
        { status: 400 }
      );
    }

    // Trim the README so we don't blow the context window on huge repos.
    const trimmedReadme = (readme || "").slice(0, 6000);

    const systemPrompt = `You are an expert software architect and senior interviewer acting as AI Coach inside CodeScope AI.

You will be given repository metadata, language breakdown, contributors, and the README. Answer the user's question using only this context — do not invent details you weren't given.

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "score": number,            // overall repo quality/health, 0-10 (can be decimal, e.g. 8.5)
  "answer": string,           // a clear, direct answer to the user's question, 2-6 sentences, plain language
  "improvements": string[],   // 3-6 short, concrete, actionable improvement suggestions relevant to the question and repo
  "recommendation": string    // one short closing recommendation, 1-2 sentences
}`;

    const userPrompt = `Repository metadata:
${JSON.stringify(repoData || {}, null, 2)}

Language breakdown:
${JSON.stringify(languageData || {}, null, 2)}

Contributors:
${JSON.stringify(contributors || [], null, 2)}

README (may be truncated):
${trimmedReadme || "No README available."}

Question: ${question}`;

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { success: false, message: "AI Coach failed to get a response." },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();
    const rawContent: string = groqData?.choices?.[0]?.message?.content ?? "";

    // Strip accidental ```json fences before parsing.
    const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", rawContent);
      return NextResponse.json(
        { success: false, message: "AI Coach returned an unreadable response." },
        { status: 502 }
      );
    }

    const data = {
      score: typeof parsed.score === "number" ? parsed.score : 0,
      answer: typeof parsed.answer === "string" ? parsed.answer : "",
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      recommendation:
        typeof parsed.recommendation === "string" ? parsed.recommendation : "",
    };

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("AI Coach error:", err);
    return NextResponse.json(
      { success: false, message: "AI Coach failed." },
      { status: 500 }
    );
  }
}