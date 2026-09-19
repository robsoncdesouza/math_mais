import { supabase } from "./supabase.js";

import {
    pegarModulos,
    pegarEtapas,
    pegarConteudos,
    pegarProgresso,
    pegarQuiz
} from "./get.js";


// ========================================
// ELEMENTOS DA PÁGINA
// ========================================

const params = new URLSearchParams(window.location.search);
const idModulo = params.get("id");
const idEtapa = params.get("idet");

const sidebar = document.querySelector(".lesson-sidebar");
const painel = document.querySelector('[data-tab-panel="0"]');

const breadcrumb = document.querySelector(".breadcrumb");

const moduloTitulo = document.querySelector(".module-title strong");
const progressoTexto = document.querySelector(".progress-info strong");
const progressoBarra = document.querySelector(".progress-line span");

const botaoQuiz = document.querySelector(".lesson-nav .btn-filled");


// ========================================
// USUÁRIO LOGADO
// ========================================

const { data, error } = await supabase.auth.getUser();

if (error || !data.user) {
    window.location.href = "cadastro.html";
}

const idUsuario = data.user.id;


// ========================================
// CARREGA O MÓDULO
// ========================================

const modulos = await pegarModulos();

const modulo = modulos.find(function (item) {
    return String(item.id) === String(idModulo);
});

if (!modulo) {
    console.error("Módulo não encontrado.");
    throw new Error("Módulo não encontrado.");
}


// Coloca o nome do módulo no menu
moduloTitulo.textContent = modulo.titulo;


// ========================================
// BREADCRUMB
// ========================================

const linksBreadcrumb = breadcrumb.querySelectorAll("span");


// O HTML original tem:
// Conteúdos → Porcentagem → Conceito de Porcentagem
//
// Vamos trocar os textos sem criar novas classes.

if (linksBreadcrumb.length >= 3) {
    linksBreadcrumb[1].textContent = modulo.titulo;
}


// ========================================
// CARREGA ETAPAS
// ========================================

const etapas = await pegarEtapas(modulo.id);

const progresso = await pegarProgresso(idUsuario) || [];


// ========================================
// CALCULA PROGRESSO DO MÓDULO
// ========================================

let etapasConcluidas = 0;

for (const etapa of etapas) {

    const concluida = progresso.some(function (item) {
        return Number(item.id_etapa) === Number(etapa.id);
    });

    if (concluida) {
        etapasConcluidas++;
    }
}

let porcentagem = 0;

if (etapas.length > 0) {
    porcentagem = Math.round(
        (etapasConcluidas / etapas.length) * 100
    );
}

progressoTexto.textContent = `${porcentagem}%`;
progressoBarra.style.width = `${porcentagem}%`;


// ========================================
// CRIA O MENU DAS ETAPAS
// ========================================

function montarMenu(etapaAtual) {

    // Remove somente os itens das etapas.
    // Não mexe no module-head.

    const itensAntigos = sidebar.querySelectorAll(".module-item");

    itensAntigos.forEach(function (item) {
        item.remove();
    });


    etapas.forEach(function (etapa, index) {

        const concluida = progresso.some(function (item) {
            return Number(item.id_etapa) === Number(etapa.id);
        });


        const item = document.createElement("div");

        // Mantém a mesma classe que já existia
        item.classList.add("module-item");


        // Mantém o current da sua estrutura
        if (Number(etapa.id) === Number(etapaAtual.id)) {
            item.classList.add("current");
        }


        // Cria exatamente o elemento .check
        const check = document.createElement("span");

        check.classList.add("check");


        if (concluida) {
            check.classList.add("done");
            check.textContent = "✓";
        } else {
            check.textContent = index + 1;
        }


        item.appendChild(check);


        // Nome da etapa
        item.appendChild(
            document.createTextNode(etapa.titulo)
        );


        // Clica na etapa
        item.addEventListener("click", function () {
            carregarEtapa(etapa);
        });


        sidebar.appendChild(item);
    });
}


// ========================================
// CARREGA UMA ETAPA
// ========================================

async function carregarEtapa(etapa) {

    montarMenu(etapa);


    // ------------------------------------
    // BREADCRUMB
    // ------------------------------------

    const elementos = breadcrumb.querySelectorAll("span, strong");

    if (elementos.length >= 4) {
        elementos[1].textContent = modulo.titulo;
        elementos[3].textContent = etapa.titulo;
    }


    // ------------------------------------
    // CONTEÚDOS
    // ------------------------------------
    const quiz = await pegarQuiz(etapa.id);
    const conteudos = await pegarConteudos(etapa.id) || [];

    painel.innerHTML = "";


    // Título da aula
    const tituloAula = document.createElement("div");

    tituloAula.classList.add("lesson-title");

    tituloAula.innerHTML = `
        <div>
            <span class="label">
                ${modulo.titulo} · Aula ${etapa.ordem}
            </span>

            <h1>
                ${etapa.titulo}
            </h1>

        </div>

        <span class="xp">
            ◇ ${quiz.xp} XP
        </span>
        `;

    painel.appendChild(tituloAula);


    // Área do conteúdo
    const areaConteudo = document.createElement("div");

    areaConteudo.classList.add("lesson-content");


    // Renderiza cada conteúdo vindo do banco
    for (const conteudo of conteudos) {

        const elemento = criarConteudo(conteudo);

        if (elemento) {
            areaConteudo.appendChild(elemento);
        }
    }


    painel.appendChild(areaConteudo);


    // ------------------------------------
    // QUIZ
    // ------------------------------------

    //const quiz = await pegarQuiz(etapa.id); na linha 212


    if (quiz) {

        // Usa o botão que JÁ EXISTE no HTML
        if (botaoQuiz) {
            botaoQuiz.href = `quiz.html?id=${quiz.id}`;
            botaoQuiz.textContent = "Próximo: Quiz →";
        }
    }
}


// ========================================
// CRIA CADA TIPO DE CONTEÚDO
// ========================================

function criarConteudo(conteudo) {

    // ------------------------------------
    // TÍTULO
    // ------------------------------------

    if (conteudo.tipo === "titulo") {

        const titulo = document.createElement("h3");

        titulo.textContent = conteudo.texto;

        return titulo;
    }


    // ------------------------------------
    // TEXTO
    // ------------------------------------

    if (conteudo.tipo === "texto") {

        const texto = document.createElement("p");

        texto.textContent = conteudo.texto;

        return texto;
    }


    // ------------------------------------
    // DESTAQUE
    // ------------------------------------

    if (conteudo.tipo === "destaque") {

        const destaque = document.createElement("div");

        destaque.classList.add("destaque");

        destaque.innerHTML = `
            <span class="label">
                Destaque
            </span>

            <p>
                ${conteudo.texto}
            </p>
        `;

        return destaque;
    }


    // ------------------------------------
    // FÓRMULA
    // ------------------------------------

    if (conteudo.tipo === "formula") {

    const formula = document.createElement("div");

    formula.classList.add("formula");

    formula.innerHTML = `
        <span class="label">Fórmula</span>

        <div class="formula-conteudo">
            <strong>${conteudo.texto}</strong>
        </div>
    `;

    return formula;
}


    // ------------------------------------
    // EXEMPLO
    // ------------------------------------

    if (conteudo.tipo === "exemplo") {

        const exemplo = document.createElement("div");

        exemplo.classList.add("example");

        exemplo.textContent = conteudo.texto;

        return exemplo;
    }


    // ------------------------------------
    // TABELA
    // ------------------------------------

    if (conteudo.tipo === "tabela") {
        
        return criarTabela(conteudo.dados);
    }


    return null;
}


// ========================================
// CRIA TABELA
// ========================================

function criarTabela(dados) {

    const tabela = document.createElement("div");

    tabela.classList.add("table");


    // Cabeçalho
    const cabecalho = document.createElement("div");

    cabecalho.classList.add("table-row", "head");


    dados.colunas.forEach(function (coluna) {

        const celula = document.createElement("span");

        celula.textContent = coluna;

        cabecalho.appendChild(celula);
    });


    tabela.appendChild(cabecalho);


    // Linhas
    dados.linhas.forEach(function (linha) {

        const linhaElemento = document.createElement("div");

        linhaElemento.classList.add("table-row");


        linha.forEach(function (valor, index) {

            const celula = document.createElement(
                index === 0 ? "strong" : "span"
            );


            if (index === 0) {
                celula.classList.add("primary-text");
            }


            celula.textContent = valor;

            linhaElemento.appendChild(celula);
        });


        tabela.appendChild(linhaElemento);
    });


    return tabela;
}


// ========================================
// INICIA NA PRIMEIRA ETAPA
// ========================================
if(idEtapa){
    console.log(idEtapa);
    const etapaUrl = etapas.find(et => et.id == idEtapa);
    if(etapaUrl) carregarEtapa(etapaUrl);
    else carregarEtapa(etapas[0]);
}
else if (etapas.length > 0) {
    carregarEtapa(etapas[0]);
}