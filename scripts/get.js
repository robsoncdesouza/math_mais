import { supabase } from "./supabase.js";

// Pega os dados do usuário pelo ID
export async function pegarUsuario(id) {
    return (await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single()).data;
}

// Pega todos os módulos
export async function pegarModulos() {
    return (await supabase
        .from("modulos")
        .select("*, etapas(*)")
        .order("ordem")).data;
}

// Pega as etapas de um módulo
export async function pegarEtapas(idModulo) {
    return (await supabase
        .from("etapas")
        .select("*")
        .eq("modulo_id", idModulo)
        .order("ordem")).data;
}

// Pega os conteúdos de uma etapa
export async function pegarConteudos(idEtapa) {
    return (await supabase
        .from("conteudos")
        .select("*")
        .eq("etapa_id", idEtapa)
        .order("ordem")).data;
}

// Pega o quiz de uma etapa
export async function pegarQuiz(idEtapa) {
    return (await supabase
        .from("quizzes")
        .select("*")
        .eq("etapa_id", idEtapa)
        .single()).data;
}

// Pega as questões de um quiz
export async function pegarQuestoes(idQuiz) {
    return (await supabase
        .from("questoes")
        .select("*")
        .eq("quiz_id", idQuiz)
        .order("ordem")).data;
}

// Pega as alternativas de uma questão
export async function pegarAlternativas(idQuestao) {
    return (await supabase
        .from("alternativas")
        .select("*")
        .eq("questao_id", idQuestao)
        .order("ordem")).data;
}

// Pega a resposta do usuário em uma questão
export async function pegarResposta(usuarioId, questaoId) {
    return (await supabase
        .from("respostas")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("questao_id", questaoId)
        .maybeSingle()).data;
}

// Pega as etapas concluídas pelo usuário
export async function pegarProgresso(usuarioId) {
    return (await supabase
        .from("etapas_progresso")
        .select("*")
        .eq("id_user", usuarioId)).data;
}

export async function pegarProgressoConcluido(userId, modulos) {

    const { data: dados, error } = await supabase
        .from("etapas_progresso")
        .select(`
            id_etapa,
            etapas (
                modulo_id,
                quizzes (
                    questoes (
                        id
                    )
                )
            )
        `)
        .eq("id_user", userId);

    if (error) {
        console.error(error);
        return {
            modulosConcluidos: 0,
            questoesConcluidas: 0
        };
    }

    let modulosConcluidos = 0;
    let questoesConcluidas = 0;

    // Conta todas as questões das etapas concluídas
    dados.forEach(item => {

        const questoes = item.etapas.quizzes.questoes;

        questoesConcluidas += questoes.length;
    });

    // Verifica quais módulos foram totalmente concluídos
    modulos.forEach(modulo => {

        const quantidadeEtapas = modulo.etapas.length;

        const etapasConcluidas = dados.filter(item =>
            item.etapas.modulo_id === modulo.id
        ).length;

        if (etapasConcluidas === quantidadeEtapas) {
            modulosConcluidos++;
        }
    });

    return {
        modulosConcluidos,
        questoesConcluidas
    };
}

// pegar todas as questoes de um modulo
export async function pegarQuestoesModulo(idModulo) {
    const { data: etapas, error: erroEtapas } = await supabase
        .from("etapas")
        .select("id")
        .eq("modulo_id", idModulo);

    if (erroEtapas) {
        return { data: [], error: erroEtapas };
    }

    const idsEtapas = etapas.map(etapa => etapa.id);

    const { data: quizzes, error: erroQuizzes } = await supabase
        .from("quizzes")
        .select("id")
        .in("etapa_id", idsEtapas);

    if (erroQuizzes) {
        return { data: [], error: erroQuizzes };
    }

    const idsQuizzes = quizzes.map(quiz => quiz.id);

    const { data: questoes, error: erroQuestoes } = await supabase
        .from("questoes")
        .select("*")
        .in("quiz_id", idsQuizzes)
        .order("ordem");

    return {
        data: questoes,
        error: erroQuestoes
    };
}

export async function pegarQuizzesModulo(idModulo) {
    const { data: etapas, error: erroEtapas } = await supabase
        .from("etapas")
        .select("id")
        .eq("modulo_id", idModulo);

    if (erroEtapas) {
        console.error("Erro ao buscar etapas:", erroEtapas);
        return [];
    }

    if (etapas.length === 0) {
        return [];
    }

    const idsEtapas = etapas.map(etapa => etapa.id);

    const { data: quizzes, error: erroQuizzes } = await supabase
        .from("quizzes")
        .select("*")
        .in("etapa_id", idsEtapas);

    if (erroQuizzes) {
        console.error("Erro ao buscar quizzes:", erroQuizzes);
        return [];
    }

    return quizzes;
}