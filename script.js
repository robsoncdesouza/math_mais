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
});


/* =========================================================
   CONTEÚDOS
========================================================= */

function initContents() {

    const search = document.querySelector("#search");

    const filters = document.querySelectorAll(".filter");

    let selectedLevel = "Todos";


    function filterCards() {

        // Busca os cards novamente toda vez que o filtro é executado
        const cards = document.querySelectorAll(".course-card");

        const searchValue = search
            ? search.value.toLowerCase()
            : "";


        cards.forEach(function (card) {

            const level = card.dataset.level;

            const text = card.innerText.toLowerCase();


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