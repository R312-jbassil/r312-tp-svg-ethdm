import pb from "../../utils/pb.js";

export const POST = async ({ request, cookies }) => {
    try {
        // Récupérer le FormData avec les fichiers
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm');
        const username = formData.get('username');
        const name = formData.get('name');
        const avatar = formData.get('avatar'); // Le fichier

        // Validation basique côté serveur
        if (!email || !password || !passwordConfirm) {
            return new Response(JSON.stringify({ 
                error: "L'email et les mots de passe sont requis" 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (password !== passwordConfirm) {
            return new Response(JSON.stringify({ 
                error: "Les mots de passe ne correspondent pas" 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Préparation des données pour PocketBase
        const userData = new FormData();
        userData.append('email', email);
        userData.append('password', password);
        userData.append('passwordConfirm', passwordConfirm);
        userData.append('username', username || email.split('@')[0]);
        
        // Ajouter le name si fourni
        if (name) {
            userData.append('name', name);
        }
        
        // Ajouter l'avatar si fourni
        if (avatar && avatar.size > 0) {
            userData.append('avatar', avatar);
        }

        // Création de l'utilisateur dans PocketBase
        const record = await pb.collection('users').create(userData);

        // Authentification automatique après inscription
        const authData = await pb.collection('users').authWithPassword(email, password);

        // Stockage du cookie d'authentification
        const cookie = pb.authStore.exportToCookie({ httpOnly: true });
        cookies.set('pb_auth', cookie, { 
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        return new Response(JSON.stringify({ 
            success: true,
            user: authData.record 
        }), { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription";
        
        if (error.data?.data) {
            const fields = error.data.data;
            if (fields.email) {
                errorMessage = "Cet email est déjà utilisé";
            } else if (fields.password) {
                errorMessage = "Le mot de passe doit contenir au moins 8 caractères";
            } else if (fields.avatar) {
                errorMessage = "Le fichier avatar n'est pas valide (vérifiez la taille et le format)";
            }
        }

        return new Response(JSON.stringify({ 
            error: errorMessage,
            details: error.message 
        }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
