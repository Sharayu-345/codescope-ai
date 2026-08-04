import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { repository } = await req.json();

    const prompt = `
You are a Senior Software Engineer.

Analyze the following GitHub repository.

Repository:
${JSON.stringify(repository, null, 2)}

Generate ONLY valid JSON.

Rules:
- Do NOT explain anything.
- Do NOT use markdown.
- Do NOT wrap JSON inside \`\`\`.
- Every string array must contain exactly 4 short bullet points.
- All quality scores must be integers between 0 and 100.
- Base the scores on real signals in the repository data (stars, forks, open issues ratio, license presence, description quality, language, topics, activity). Do not just return round numbers like 80 or 90 -- vary them realistically based on the actual repo.

Return exactly this structure:

{
  "architecture": ["...", "...", "...", "..."],
  "codeQuality": ["...", "...", "...", "..."],
  "suggestions": ["...", "...", "...", "..."],
  "interviewQuestions": ["...", "...", "...", "..."],
  "codeQualityScore": {
    "overall": 0,
    "maintainability": 0,
    "readability": 0,
    "security": 0,
    "performance": 0,
    "bestPractices": 0
  }
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    let text = completion.choices[0]?.message?.content?.trim() || "";

    // Remove markdown if the model returns it
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const aiResult = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Groq API Error",
      },
      { status: 500 }
    );
  }
}