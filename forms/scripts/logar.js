import { logar } from "./auth.js";

const form = document.getElementById("login-form");
const mensagemDeErro = document.getElementById("mensagemDeErro");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { data, error } = await logar(email, senha);

    if (error.message == "Invalid login credentials") {
        mensagemDeErro.innerText = "Email ou senha incorretos, tente denovo";
    }
    else if (error) {
        alert(error.message);
        return;
    }

    console.log("Login realizado!", data);

    // window.location.href = "licoes.html";
});