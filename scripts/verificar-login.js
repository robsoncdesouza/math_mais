import { supabase } from "./supabase.js";

async function verificarLogin() {

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        window.location.href = "./forms/cadastro.html";
        return;
    }

    // console.log("Usuário conectado:", data.user.email);
}

verificarLogin();