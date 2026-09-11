import { supabase } from "./supabase.js";
import { pegarQuiz } from "./get.js";

/* =========================================================
   PEGA OS DADOS SALVOS PELO QUIZ
========================================================= */
const parametros = new URLSearchParams(window.location.search);

const idQuiz = parametros.get("id");


const btnRepetir = document.getElementById("rever-aula")
// if (!idQuiz) {
//     btnRepetir.href = "../conteudos.html";
// }
// else btnRepetir.href = `../aula.html?id=${idQuiz}`
btnRepetir.href = "../conteudos.html";

const acertos =
    Number(
        localStorage.getItem("mathplusScore") || 0
    );


const total =
    Number(
        localStorage.getItem("mathplusTotal") || 0
    );


/* =========================================================
   CALCULA O RESULTADO
========================================================= */

let porcentagem = 0;

if (total > 0) {

    porcentagem =
        Math.round(
            (acertos / total) * 100
        );

}


const xpGanho =
    acertos * 10;


/* =========================================================
   PEGA OS ELEMENTOS DA PÁGINA
========================================================= */

const pct =
    document.querySelector("#pct");

const score =
    document.querySelector("#score");

const totalQuestions =
    document.querySelector("#total-questions");

const scoreTotal =
    document.querySelector("#score-total");

const pctTotal =
    document.querySelector("#pct-total");

const xp =
    document.querySelector("#xp");

const grade =
    document.querySelector("#grade");

const notice =
    document.querySelector("#notice");

const progress =
    document.querySelector("#progress");

const progressText =
    document.querySelector("#progress-text");


/* =========================================================
   COLOCA OS DADOS NA TELA
========================================================= */

pct.textContent =
    porcentagem;


score.textContent =
    acertos;


totalQuestions.textContent =
    total;


scoreTotal.textContent =
    `${acertos}/${total}`;


pctTotal.textContent =
    `${porcentagem}%`;


xp.textContent =
    `+${xpGanho}`;


/* =========================================================
   MENSAGEM DO RESULTADO
========================================================= */

if (porcentagem >= 80) {

    grade.textContent =
        "Excelente";


    notice.className =
        "notice good";


    notice.textContent =
        "Parabéns! Você foi muito bem nesse quiz.";

}

else if (porcentagem >= 60) {

    grade.textContent =
        "Bom trabalho";


    notice.className =
        "notice good";


    notice.textContent =
        "Bom resultado! Revise os pontos que errou e tente novamente.";

}

else {

    grade.textContent =
        "Continue praticando";


    notice.className =
        "notice warn";


    notice.textContent =
        "Não desanime. Revise a aula e tente o quiz novamente.";

}


/* =========================================================
   PEGA O XP REAL DO USUÁRIO
========================================================= */

const { data: usuario, error } =
    await supabase
        .from("users")
        .select("xp")
        .eq("id", (await supabase.auth.getUser()).data.user.id)
        .single();

if (error) {
    console.error("Erro ao pegar XP:", error);
}

// const xpAtual = usuario?.xp || 0;
const xpAtual = 725 + xpGanho;

/* =========================================================
   MOSTRA O PROGRESSO
========================================================= */

const xpNivel = xpAtual % 1000;

progressText.textContent =
    `${xpNivel} / 1000 XP`;

progress.style.width =
    `${Math.min(100, (xpNivel / 1000) * 100)}%`;

const nivel = Math.floor(xpAtual / 1000) + 1;
document.querySelector(".result-progress .progress-info span").textContent =
    `Progresso — Nível ${nivel}`;

const xpNoNivel = xpAtual % 1000;

progressText.textContent =
    `${xpNoNivel} / 1000 XP`;

progress.style.width =
    `${(xpNoNivel / 1000) * 100}%`;