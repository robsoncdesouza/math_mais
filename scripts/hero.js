import { supabase } from "./supabase.js";
import { pegarModulos, pegarEtapas, pegarProgresso, pegarQuizzesModulo, pegarProgressoConcluido } from "./get.js";
import { pegarNivel, pegarXpDoNivel, pegarPorcentagemXp } from "./xp.js";

const idUser = (await supabase.auth.getUser()).data.user.id;
const listaModulos = document.getElementById("lista-modulos");
const todasEtapasConcluidas = await pegarProgresso(idUser);
const modulos = await pegarModulos();
const questoes = (await supabase.from("questoes").select("*")).data;

const qtdModulos = document.getElementById("qtd-modulos");
qtdModulos.innerText = modulos.length;

const qtdQuestoes = document.getElementById("qtd-questoes");
qtdQuestoes.innerText = questoes.length - 10 + "+";

const topicos = document.querySelector(".topics");
topicos.innerHTML = "";

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

            <div class="icon-box ${modulo.cor}">
                ${modulo.logo}
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

                <strong class="${modulo.cor}-text">
                    ${porcentagem}%
                </strong>

            </div>

            <div class="progress-line">
                <span
                    style="width: ${porcentagem}%;"
                    class="${modulo.cor}-bg">
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

    
    let iEtapa = 0;

    for (const etapa of etapas){
        if(iEtapa===5)
            break;
        const topico = document.createElement("a");
        topico.classList.add("topic");
        topico.href = `aula.html?id=${modulo.id}&idet=${etapa.id}`;
        topico.innerHTML = 
        `
            <span class="topic-dot ${modulo.cor}-bg"></span>
            ${etapa.titulo}
        `
        topicos.appendChild(topico);
        iEtapa++;
    };

    i++;
}

const {modulosConcluidos, questoesConcluidas} = await pegarProgressoConcluido(idUser,modulos)

const xpAtual = (await supabase.from("users").select("xp").eq("id", idUser).maybeSingle()).data.xp;
const XpDoNivel = pegarXpDoNivel(xpAtual);
const porcentagemXp =  pegarPorcentagemXp(xpAtual);
const nivelAtual = pegarNivel(xpAtual);

document.getElementById('next-level').innerText = nivelAtual+1;
document.getElementById('current-level').innerText = nivelAtual;
document.getElementById('current-level-span').innerText = nivelAtual;
document.getElementById('xp-do-nivel').innerText = XpDoNivel;
document.getElementById('xp-total').innerText = xpAtual;
document.getElementById('qtd-modulos-concluidos').innerText = modulosConcluidos;
document.getElementById('qtd-questoes-concluidas').innerText = questoesConcluidas;
document.getElementById('nivel-progress').style.width = porcentagemXp,"%";

function pegarEtapaNaoConcluida(modulos, etapas, etapasProgresso) {
    const modulosEmbaralhados = [...modulos]
        .sort(() => Math.random() - 0.5);

    for (const modulo of modulosEmbaralhados) {
        const etapasDoModulo = etapas
            .filter(etapa => etapa.modulo_id === modulo.id)
            .sort(() => Math.random() - 0.5);

        for (const etapa of etapasDoModulo) {
            const concluida = etapasProgresso.some(
                progresso => progresso.id_etapa === etapa.id
            );

            if (!concluida) {
                return etapa;
            }
        }
    }

    return null;
}

const desafio = pegarEtapaNaoConcluida(modulos, (await supabase.from("etapas").select("*")).data, todasEtapasConcluidas);

document.getElementById('next-etapa').innerText = `${modulos.find(mod => mod.id == desafio.modulo_id).titulo} — ${desafio.titulo}`
document.getElementById('next-etapa-link').href = `./aula.html?id=${desafio.modulo_id}&idet=${desafio.id}`