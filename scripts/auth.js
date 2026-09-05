import { supabase } from "./supabase.js";

export async function cadastrar(email, senha) {
    return await supabase.auth.signUp({
    email: email, 
    password: senha
});
}

export async function logar(email, senha) {
    return await supabase.auth.signInWithPassword({
    email: email, 
    password: senha
});
}