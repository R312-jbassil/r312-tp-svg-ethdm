import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

/**
 * Endpoint pour mettre à jour les données dans PocketBase
 * @param {Object} updatedData - Contient l'id et les champs modifiés (code_svg, chat_history)
 */
export async function POST({ request }) {
    try {
        // Récupérer les données envoyées dans le body de la requête
        const updatedData = await request.json();

        // Vérifier que l'id est présent
        if (!updatedData.id) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: "ID manquant" 
                }), 
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Mettre à jour l'enregistrement dans PocketBase
        const response = await pb.collection(Collections.Svg).update(
            updatedData.id, 
            {
                code_svg: updatedData.code_svg,
                chat_history: updatedData.chat_history
            }
        );

        // Retourner une réponse de succès
        return new Response(
            JSON.stringify({ 
                success: true,
                data: response
            }), 
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: error.message || "Erreur lors de la mise à jour du SVG" 
            }), 
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
