import { supabase } from "./supabase.js";
import { pegarModulos, pegarEtapas, pegarProgresso, pegarQuizzesModulo, pegarQuestoes, pegarQuestoesModulo } from "./get.js";

const idUser = (await supabase.auth.getUser()).data.user.id;
const listaModulos = document.getElementById("lista-modulos");
const todasEtapasConcluidas = await pegarProgresso(idUser);
const modulos = await pegarModulos();
const questoes = (await supabase.from("questoes").select("*")).data;

const qtdModulos = document.getElementById("qtd-modulos");
qtdModulos.innerText = modulos.length;

const qtdQuestoes = document.getElementById("qtd-questoes");
qtdQuestoes.innerText = questoes.length - 10 + "+";


let i = 0;
for (const modulo of modulos) {
    if(i===4) break;
    const quizzes = await pegarQuizzesModulo(modulo.id);
    const xp = quizzes.reduce(
        (total, quiz) => total + quiz.xp,
        0
    );
    const etapas = await pegarEtapas(modulo.id);
    const etapasConcluidas = etapas.filter(etapa =>
        todasEtapasConcluidas.some(progresso =>
            progresso.id_etapa === etapa.id
        )
    );
    
    let porcentagem = 0;
    if (etapas.length > 0) {
        porcentagem = Math.round(
            (etapasConcluidas.length / etapas.length) * 100
        );
    }
    const card = document.createElement("a");
    card.href = `aula.html?id=${modulo.id}`
    card.classList.add("card");
    card.innerHTML = `

            <div class="icon-box purple">
                √
            </div>

            <div class="card-title">

                <h3>
                    ${modulo.titulo}
                </h3>

                <span class="level">
                    ${modulo.dificuldade}
                </span>

            </div>

            <p>
                ${modulo.descricao}
            </p>

            <div class="progress-info">

                <span>Progresso</span>

                <strong class="purple-text">
                    ${porcentagem}%
                </strong>

            </div>

            <div class="progress-line">
                <span
                    style="width: ${porcentagem}%;"
                    class="purple-bg">
                </span>
            </div>

            <div class="card-foot">

                <span class="xp">
                    ◇ ${xp} XP
                </span>

                <strong class="access">
                    Acessar →
                </strong>

            </div>
    `;

    listaModulos.appendChild(card);
    i++;
}