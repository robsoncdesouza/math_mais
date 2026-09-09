/* =========================================================
   MENU MOBILE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const burger = document.querySelector(".burger");

    const mobileMenu =
        document.querySelector(".mobile-menu");


    if (burger && mobileMenu) {

        burger.addEventListener("click", function () {

            mobileMenu.classList.toggle("open");

        });

    }


    /* =====================================================
       IDENTIFICA A PÁGINA
    ===================================================== */

    const page =
        document.body.dataset.page;


    if (page === "contents") {

        initContents();

    }


    if (page === "lesson") {

        initLesson();

    }


    if (page === "quiz") {

        initQuiz();

    }


    if (page === "result") {

        initResult();

    }

});


/* =========================================================
   CONTEÚDOS
========================================================= */

function initContents() {

    const search =
        document.querySelector("#search");

    const cards =
        document.querySelectorAll(".course-card");

    const filters =
        document.querySelectorAll(".filter");


    let selectedLevel = "Todos";


    function filterCards() {

        const searchValue =
            search.value.toLowerCase();


        cards.forEach(function (card) {

            const level =
                card.dataset.level;


            const text =
                card.innerText.toLowerCase();


            const levelOK =
                selectedLevel === "Todos" ||
                level === selectedLevel;


            const searchOK =
                text.includes(searchValue);


            if (levelOK && searchOK) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    }


    if (search) {

        search.addEventListener(
            "input",
            filterCards
        );

    }


    filters.forEach(function (filter) {

        filter.addEventListener(
            "click",
            function () {

                selectedLevel =
                    filter.dataset.filter;


                filters.forEach(function (item) {

                    item.classList.remove("active");

                });


                filter.classList.add("active");


                filterCards();

            }
        );

    });

}


/* =========================================================
   AULA
========================================================= */

function initLesson() {

    const tabs =
        document.querySelectorAll(".tab");

    const panels =
        document.querySelectorAll(
            "[data-tab-panel]"
        );


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const selectedTab =
                    tab.dataset.tab;


                tabs.forEach(function (item) {

                    item.classList.remove("active");

                });


                tab.classList.add("active");


                panels.forEach(function (panel) {

                    if (
                        panel.dataset.tabPanel ===
                        selectedTab
                    ) {

                        panel.classList.remove(
                            "hidden"
                        );

                    } else {

                        panel.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });

}


/* =========================================================
   BANCO DO QUIZ
========================================================= */

const quizData = [

    {

        question:
        "Se 30% de um número é 60, qual é esse número?",

        options:
        [
            "120",
            "150",
            "200",
            "180"
        ],

        correct: 2,

        explanation:
        "30% = 60 → 1% = 2 → 100% = 200. O número é 200."

    },


    {

        question:
        "Um produto custa R$ 250. Com desconto de 20%, qual é o valor final?",

        options:
        [
            "R$ 200",
            "R$ 210",
            "R$ 220",
            "R$ 230"
        ],

        correct: 0,

        explanation:
        "20% de 250 = 50. Valor final = 250 − 50 = R$ 200."

    },


    {

        question:
        "Qual é a área de um retângulo de 8m × 5m?",

        options:
        [
            "13 m²",
            "26 m²",
            "80 m²",
            "40 m²"
        ],

        correct: 3,

        explanation:
        "Área = base × altura = 8 × 5 = 40 m²."

    },


    {

        question:
        "A média aritmética de 4, 8, 12 e 16 é:",

        options:
        [
            "8",
            "9",
            "10",
            "12"
        ],

        correct: 2,

        explanation:
        "Média = (4+8+12+16) ÷ 4 = 40 ÷ 4 = 10."

    },


    {

        question:
        "Quanto é 2³ + √16?",

        options:
        [
            "10",
            "12",
            "14",
            "16"
        ],

        correct: 1,

        explanation:
        "2³ = 8 e √16 = 4. Portanto 8 + 4 = 12."

    }

];


/* =========================================================
   QUIZ
========================================================= */

function initQuiz() {

    let currentQuestion = 0;

    let selectedAnswer = null;

    let score = 0;


    const questionText =
        document.querySelector("#question-text");

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


    function loadQuestion() {

        const question =
            quizData[currentQuestion];


        selectedAnswer = null;


        questionText.textContent =
            question.question;


        questionNumber.textContent =
            `Questão ${currentQuestion + 1} de ${quizData.length}`;


        scoreDisplay.textContent =
            `${score} ${score === 1 ? "acerto" : "acertos"}`;


        xp.textContent =
            `◇ ${score * 10} XP`;


        feedback.innerHTML = "";


        nextButton.disabled = true;


        nextButton.textContent =
            currentQuestion <
            quizData.length - 1
                ? "Continuar →"
                : "Ver resultado";


        options.forEach(function (button, index) {

            button.className = "option";

            button.disabled = false;


            button.querySelector(
                ".option-letter"
            ).textContent =
                String.fromCharCode(65 + index);


            button.lastChild.textContent =
                " " + question.options[index];

        });


        steps.forEach(function (step, index) {

            step.classList.remove(
                "current",
                "done"
            );


            if (index < currentQuestion) {

                step.classList.add("done");

            }


            if (index === currentQuestion) {

                step.classList.add("current");

            }

        });

    }


    function answerQuestion(index) {

        if (selectedAnswer !== null) {

            return;

        }


        selectedAnswer = index;


        const question =
            quizData[currentQuestion];


        if (index === question.correct) {

            score++;

        }


        options.forEach(function (button, optionIndex) {

            button.disabled = true;


            if (
                optionIndex ===
                question.correct
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                optionIndex === index &&
                index !== question.correct
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        });


        const correct =
            index === question.correct;


        feedback.innerHTML = `

            <div class="feedback ${
                correct
                    ? "correct"
                    : "wrong"
            }">

                <strong>
                    ${
                        correct
                            ? "Correto!"
                            : "Incorreto."
                    }
                </strong>

                <span>
                    ${question.explanation}
                </span>

            </div>

        `;


        scoreDisplay.textContent =
            `${score} ${
                score === 1
                    ? "acerto"
                    : "acertos"
            }`;


        xp.textContent =
            `◇ ${score * 10} XP`;


        nextButton.disabled = false;

    }


    options.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                answerQuestion(
                    Number(button.dataset.option)
                );

            }
        );

    });


    nextButton.addEventListener(
        "click",
        function () {

            if (selectedAnswer === null) {

                return;

            }


            if (
                currentQuestion <
                quizData.length - 1
            ) {

                currentQuestion++;

                loadQuestion();

            } else {

                localStorage.setItem(
                    "mathplusScore",
                    score
                );


                window.location.href =
                    "resultado.html";

            }

        }
    );


    loadQuestion();

}


/* =========================================================
   RESULTADO
========================================================= */

function initResult() {

    const score =
        Number(
            localStorage.getItem(
                "mathplusScore"
            ) || 0
        );


    const total =
        quizData.length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const xp =
        score * 10;


    const pct =
        document.querySelector("#pct");


    const scoreElement =
        document.querySelector("#score");


    const scoreTotal =
        document.querySelector("#score-total");


    const pctTotal =
        document.querySelector("#pct-total");


    const xpElement =
        document.querySelector("#xp");


    const grade =
        document.querySelector("#grade");


    const notice =
        document.querySelector("#notice");


    const progress =
        document.querySelector("#progress");


    const progressText =
        document.querySelector(
            "#progress-text"
        );


    pct.textContent =
        percentage;


    scoreElement.textContent =
        score;


    scoreTotal.textContent =
        `${score}/${total}`;


    pctTotal.textContent =
        `${percentage}%`;


    xpElement.textContent =
        `+${xp}`;


    const currentXP =
        725 + xp;


    progressText.textContent =
        `${currentXP} / 1000 XP`;


    progress.style.width =
        `${Math.min(
            100,
            currentXP / 10
        )}%`;


    if (percentage >= 80) {

        grade.textContent =
            "Excelente";


        notice.className =
            "notice good";


        notice.textContent =
            "Parabéns! Você dominou Porcentagem. Que tal avançar para Geometria?";

    }

    else if (percentage >= 60) {

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
            "Não desanime. Acesse a aula, estude os exemplos e tente o quiz novamente.";

    }

}