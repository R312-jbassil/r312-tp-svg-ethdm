import { OpenAI } from 'openai';

const HF_TOKEN = import.meta.env.HF_TOKEN;

export const POST = async ({ request }) => {
    console.log(request);

    const messages = await request.json();

    const client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: "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",
    });

    let SystemMessage =
    {
        role: "system",
        content: "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
    };

    const chatCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [SystemMessage, ...messages]
    });

    const message = chatCompletion.choices[0].message || "";

    console.log("Generated SVG:", message);

    const svgMatch = message.content.match(/<svg[\s\S]*?<\/svg>/i);

    message.content = svgMatch ? svgMatch[0] : "";

    return new Response(JSON.stringify({ svg: message }), {
        headers: { "Content-Type": "application/json" },
    });
};
