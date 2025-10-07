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
        model: "qwen/qwen3-coder:free",
        messages: [SystemMessage, ...messages]
    });

    const message = chatCompletion.choices[0].message || "";

    console.log("Generated SVG:", message);

    const svgMatch = message.content.match(/<svg[\s\S]*?<\/svg>/i);

    message.content = svgMatch ? svgMatch[0] : "";

    return new Response(JSON.stringify({ svg: message }), {
        headers: { "Content-Type": "application/json" },
    });

    const user = JSON.parse(localStorage.getItem("user"));

    saveButton.addEventListener("click", async () => {
        const name = prompt("Enter a name for the SVG:");
        const svgOutput = document.getElementById("svg-output")?.textContent;
        console.log("Saving SVG: ", JSON.stringify(svgOutput));

        const params: Collection.Svg = {
            nom: name,
            code_svg: svgOutput || "<svg></svg>",
            chat_history: JSON.stringify(promptList),
            user: user.id
        };
        await saveSVG(params);
    });
};
