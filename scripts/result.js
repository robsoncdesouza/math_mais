import { supabase } from "./supabase.js";
import { pegarQuiz } from "./get.js";

/* =========================================================
   PEGA OS DADOS SALVOS PELO QUIZ
========================================================= */
const parametros = new URLSearchParams(window.location.search);

const idQuiz = parametros.get("id");


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
    Number(localStorage.getItem("mathplusXp")) || 0;


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

const nixFinal = 
    document.getElementById("resulticon");
    
const tentarBtn = document.getElementById("retry-btn");
tentarBtn.href = `../quiz.html?id=${idQuiz}`

const btnRepetir = document.getElementById("rever-aula")
if (!idQuiz) 
    btnRepetir.href = "../conteudos.html";
else {
    const quizz = (await supabase.from("quizzes").select("etapas(id, modulo_id)").eq("id",idQuiz).single()).data;
    
    btnRepetir.href = `../aula.html?id=${quizz.etapas.modulo_id}&idet=${quizz.etapas.id}`;
}
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

    nixFinal.innerHTML =
        '<img class="nix-final teste" src="img/nix_mb.png" alt="">';

}

else if (porcentagem >= 60) {

    grade.textContent =
        "Bom trabalho";


    notice.className =
        "notice good";


    notice.textContent =
        "Bom resultado! Revise os pontos que errou e tente novamente.";

    nixFinal.innerHTML =
        '<img class="nix-final teste" src="img/nix_b.png" alt="">';
}

else {

    grade.textContent =
        "Continue praticando";


    notice.className =
        "notice warn";


    notice.textContent =
        "Não desanime. Revise a aula e tente o quiz novamente.";

    nixFinal.innerHTML =
        '<img class="nix-final teste" src="img/nix_i.png" alt="">';

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

const xpAtual = usuario?.xp || 0;
// const xpAtual = 7250 + xpGanho;

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


/* =========================================================
   NIX FINAL
========================================================= */