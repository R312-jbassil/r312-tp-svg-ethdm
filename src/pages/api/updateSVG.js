import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
    const data = await request.json();
    console.log("Received data to update:", data);

    try {
        const { id, ...updateData } = data;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "ID de l'enregistrement requis"
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                }
            );
        }

        const record = await pb
            .collection(Collections.Svg)
            .update(id, updateData);

        console.log("SVG updated with ID:", record.id);

        return new Response(
            JSON.stringify({
                success: true,
                id: record.id,
                updated: record.updated
            }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating SVG:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
}

async function update(updatedData) {
    const response = await fetch("/api/updateSVG", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    return response;
};