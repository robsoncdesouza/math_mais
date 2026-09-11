import { supabase } from "./supabase.js";

export async function atualizarUsuario(id, dados) {
    return await supabase
        .from("users")
        .update(dados)
        .eq("id", id);
}

export async function concluirEtapa(idUser, idEtapa) {
    return await supabase
        .from("etapas_progresso")
        .insert({
            id_user: idUser,
            id_etapa: idEtapa,
            concluida: true,
            concluida_em: new Date().toISOString()
        });
}

export async function salvarResposta(usuarioId, questaoId, alternativaId) {
    return await supabase
        .from("respostas")
        .upsert({
            usuario_id: usuarioId,
            questao_id: questaoId,
            alternativa_id: alternativaId
        }, {
            onConflict: "usuario_id,questao_id"
        });
}

export async function excluirResposta(usuarioId, questaoId) {
    return await supabase
        .from("respostas")
        .delete()
        .eq("usuario_id", usuarioId)
        .eq("questao_id", questaoId);
}

export async function excluirProgresso(idUser, idEtapa) {
    return await supabase
        .from("etapas_progresso")
        .delete()
        .eq("id_user", idUser)
        .eq("id_etapa", idEtapa);
}