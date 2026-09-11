
import { supabase } from "./supabase.js";
import { pegarQuestoes, pegarAlternativas } from "./get.js";


/* =========================================================
   PEGA O QUIZ DA URL
========================================================= */

const parametros = new URLSearchParams(window.location.search);

const idQuiz = parametros.get("id");


if (!idQuiz) {

    console.error("ID do quiz não encontrado na URL.");

    throw new Error("Quiz não encontrado.");

}


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const questionText =
    document.querySelector("#question-text");

const questionLabel =
    document.querySelector("#question-label");

const questionNumber =
    document.querySelector("#question-number");

const scoreDisplay =
    document.querySelector("#score-display");

const options =
    document.querySelectorAll(".option");

const feedback =
    document.querySelector("#feedback");

const nextButton =
    document.querySelector("#next-question");

const xp =
    document.querySelector("#quiz-xp");

const steps =
    document.querySelectorAll(".quiz-step");


/* =========================================================
   VARIÁVEIS DO QUIZ
========================================================= */

let quiz = null;

let questoes = [];

let questaoAtual = 0;

let acertos = 0;

let respondeu = false;


/* =========================================================
   BUSCA O QUIZ
========================================================= */

async function carregarQuiz() {

    const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", idQuiz)
        .single();


    if (error) {

        console.error("Erro ao buscar quiz:", error);

        return;

    }


    quiz = data;


    /* Busca as questões desse quiz */

    questoes = await pegarQuestoes(quiz.id);


    if (!questoes || questoes.length === 0) {

        console.error("Esse quiz não possui questões.");

        return;

    }


    console.log("Quiz:", quiz);

    console.log("Questões:", questoes);


    mostrarQuestao();

}


/* =========================================================
   MOSTRA A QUESTÃO ATUAL
========================================================= */

async function mostrarQuestao() {

    const questao =
        questoes[questaoAtual];


    respondeu = false;


    /* Texto da questão */

    questionText.textContent =
        questao.enunciado;


    /* Número */

    questionNumber.textContent =
        `Questão ${questaoAtual + 1} de ${questoes.length}`;


    /* Label */

    if (questionLabel) {

        questionLabel.textContent =
            `Quiz · Questão ${questaoAtual + 1}`;

    }


    /* Pontuação */

    scoreDisplay.textContent =
        `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;


    /* XP */

    xp.textContent =
        `◇ ${acertos * 10} XP`;


    /* Limpa feedback */

    feedback.innerHTML = "";


    /* Desabilita próximo */

    nextButton.disabled = true;


    /* Texto do botão */

    if (questaoAtual === questoes.length - 1) {

        nextButton.textContent =
            "Ver resultado";

    } else {

        nextButton.textContent =
            "Continuar →";

    }


    /* =====================================================
       BUSCA AS ALTERNATIVAS
    ===================================================== */

    const alternativas =
        await pegarAlternativas(questao.id);


    console.log(
        "Alternativas da questão:",
        alternativas
    );


    /* =====================================================
       PREENCHE OS 4 BOTÕES
    ===================================================== */

    options.forEach(function (button, index) {

        const alternativa =
            alternativas[index];


        /* Limpa classes antigas */

        button.classList.remove(
            "correct",
            "wrong"
        );


        button.disabled = false;


        /* Se não existir alternativa, esconde */

        if (!alternativa) {

            button.style.display =
                "none";

            return;

        }


        button.style.display =
            "";


        /* Letra */

        const letra =
            button.querySelector(
                ".option-letter"
            );


        letra.textContent =
            String.fromCharCode(65 + index);


        /*
         * Remove o texto antigo do botão.
         *
         * O span da letra continua existindo.
         */

        button.childNodes.forEach(function (node) {

            if (node.nodeType === Node.TEXT_NODE) {

                node.remove();

            }

        });


        /* Coloca o texto da alternativa */

        button.appendChild(
            document.createTextNode(
                " " + alternativa.texto
            )
        );


        /*
         * Guarda o ID da alternativa.
         *
         * Isso será usado para salvar
         * a resposta no Supabase.
         */

        button.dataset.alternativaId =
            alternativa.id;


        /*
         * Guarda se ela é correta.
         */

        button.dataset.correta =
            alternativa.correta;


    });


    /* =====================================================
       ATUALIZA A BARRA DE QUESTÕES
    ===================================================== */

    steps.forEach(function (step, index) {

        step.classList.remove(
            "current",
            "done"
        );


        if (index < questaoAtual) {

            step.classList.add("done");

        }


        if (index === questaoAtual) {

            step.classList.add("current");

        }

    });

}


/* =========================================================
   RESPONDER QUESTÃO
========================================================= */

async function responderQuestao(button) {

    if (respondeu) {

        return;

    }


    respondeu = true;


    const alternativaId =
        Number(button.dataset.alternativaId);


    const correta =
        button.dataset.correta === "true";


    /* Soma o acerto */

    if (correta) {

        acertos++;

    }


    /* =====================================================
       MOSTRA CORRETA / ERRADA
    ===================================================== */

    options.forEach(function (item) {

        item.disabled = true;


        const itemCorreta =
            item.dataset.correta === "true";


        if (itemCorreta) {

            item.classList.add("correct");

        }

    });


    if (!correta) {

        button.classList.add("wrong");

    }


    /* =====================================================
       FEEDBACK
    ===================================================== */

    if (correta) {

        feedback.innerHTML = `
            <div class="feedback correct">
                <strong>Correto!</strong>
            </div>
        `;

    } else {

        feedback.innerHTML = `
            <div class="feedback wrong">
                <strong>Incorreto.</strong>
            </div>
        `;

    }


    /* Atualiza pontuação */

    scoreDisplay.textContent =
        `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;


    xp.textContent =
        `◇ ${acertos * 10} XP`;


    /* =====================================================
       SALVA A RESPOSTA
    ===================================================== */

    const { data: usuarioData, error: usuarioError } =
        await supabase.auth.getUser();


    if (usuarioError || !usuarioData.user) {

        console.error(
            "Usuário não encontrado:",
            usuarioError
        );

        return;

    }


    const usuarioId =
        usuarioData.user.id;


    const questao =
        questoes[questaoAtual];


    const { error } =
        await supabase
            .from("respostas")
            .upsert(
                {
                    usuario_id: usuarioId,
                    questao_id: questao.id,
                    alternativa_id: alternativaId
                },
                {
                    onConflict:
                        "usuario_id,questao_id"
                }
            );


    if (error) {

        console.error(
            "Erro ao salvar resposta:",
            error
        );

    }


    /* Agora pode continuar */

    nextButton.disabled = false;

}


/* =========================================================
   CLIQUE NAS ALTERNATIVAS
========================================================= */

options.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            responderQuestao(button);

        }
    );

});


/* =========================================================
   PRÓXIMA QUESTÃO
========================================================= */

nextButton.addEventListener(
    "click",
    async function () {

        if (!respondeu) {

            return;

        }


        /* Se ainda existem questões */

        if (
            questaoAtual <
            questoes.length - 1
        ) {

            questaoAtual++;

            await mostrarQuestao();

            return;

        }


        /* Terminou o quiz */

        await finalizarQuiz();

    }
);


/* =========================================================
   FINALIZA O QUIZ
========================================================= */

async function finalizarQuiz() {

    const usuarioData =
        await supabase.auth.getUser();


    if (!usuarioData.data.user) {

        console.error(
            "Usuário não está logado."
        );

        return;

    }


    /* Marca a etapa como concluída */

    const { error } =
        await supabase
            .from("etapas_progresso")
            .upsert(
                {
                    id_user:
                        usuarioData.data.user.id,

                    id_etapa:
                        quiz.etapa_id,

                    concluida:
                        true,

                    concluida_em:
                        new Date().toISOString()
                },
                {
                    onConflict:
                        "id_user,id_etapa"
                }
            );


    if (error) {

        console.error(
            "Erro ao salvar progresso:",
            error
        );

    }


    /* Guarda o resultado */

    localStorage.setItem(
        "mathplusScore",
        acertos
    );


    localStorage.setItem(
        "mathplusTotal",
        questoes.length
    );


    /* Vai para o resultado */

    window.location.href =
        `resultado.html?id=${idQuiz}`;

}


/* =========================================================
   INICIA
========================================================= */

carregarQuiz();

