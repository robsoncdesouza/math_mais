const menuToggles = document.querySelectorAll(".menu-toggle");

menuToggles.forEach((toggle) => {
    const header = toggle.closest("header");
    const menu = header.querySelector(".nav-center");

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            header.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Abrir menu");
        });
    });
});