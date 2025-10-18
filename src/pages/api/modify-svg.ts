import type { APIRoute } from 'astro';
import pb from '../../utils/pb';
import { Collections } from '../../utils/pocketbase-types';
import { OpenAI } from 'openai';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { svgId, message, currentSvg } = await request.json();

        const client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: "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",
        });

        const chatCompletion = await client.chat.completions.create({
            model: "qwen/qwen3-coder:free",
            messages: [
                {
                    role: "system",
                    content: "You are an SVG code generator. Modify the following SVG according to the user's instructions. Make sure to preserve existing ids."
                },
                {
                    role: "user",
                    content: `Current SVG:\n${currentSvg}\n\nInstruction: ${message}\n\nRespond only with the modified SVG code.`
                }
            ]
        });

        const aiResponse = chatCompletion.choices[0].message;
        const svgMatch = aiResponse.content.match(/<svg[\s\S]*?<\/svg>/i);
        const newSvg = svgMatch ? svgMatch[0] : currentSvg;

        // Update SVG in PocketBase
        await pb.collection(Collections.Svg).update(svgId, {
            code_svg: newSvg
        });

        // Save chat history
        await pb.collection('chat_history').create({
            svg: svgId,
            role: 'user',
            content: message
        });

        await pb.collection('chat_history').create({
            svg: svgId,
            role: 'assistant',
            content: aiResponse.content
        });

        return new Response(
            JSON.stringify({
                success: true,
                newSvg: newSvg,
                assistantMessage: 'SVG modified successfully!'
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error modifying SVG:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
