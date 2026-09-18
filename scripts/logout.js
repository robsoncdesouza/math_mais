import { supabase } from "./supabase.js";

document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Erro ao sair da conta:", error.message);
            }
        } catch (error) {
            console.error("Erro ao sair da conta:", error);
        } finally {
            window.location.href = "forms/login.html";
        }
    });
});
