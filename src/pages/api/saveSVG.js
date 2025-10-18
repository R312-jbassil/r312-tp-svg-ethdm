import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
  const data = await request.json();
  console.log("Received data to save:", data);
  
  try {
    // Récupère l'ID de l'utilisateur connecté
    const userId = pb.authStore.record?.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Utilisateur non authentifié" }), 
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Ajoute l'ID utilisateur aux données
    const record = await pb.collection(Collections.Svg).create({
      ...data,
      user: userId, // Lie le SVG à l'utilisateur connecté
    });
    
    console.log("SVG saved with ID:", record.id);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving SVG:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
