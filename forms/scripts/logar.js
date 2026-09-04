import { logar } from "./auth.js";

const form = document.getElementById("login-form");
const mensagemDeErro = document.getElementById("mensagemDeErro");
const inputs = form.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        mensagemDeErro.innerText = "";
});
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { data, error } = await logar(email, senha);
    if(error)
    {
        if (error.message == "Invalid login credentials") {
            mensagemDeErro.innerText = "Email ou senha incorretos, tente denovo";
        }
        else {
            alert(error.message);
            return;
        }
    }
    else console.log("Login realizado!", data);

    // window.location.href = "licoes.html";
});