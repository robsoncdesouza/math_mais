import { logar } from "../scripts/auth.js";

const form = document.getElementById("login-form");
const mensagemDeErro = document.getElementById("mensagemDeErro");
const inputs = [...form.querySelectorAll("input")];

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        mensagemDeErro.innerText = "";
});
});
var user;
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (inputs.some(input => input.value == "" | input.value == null)) {
        mensagemDeErro.innerText = "Nenhum campo pode estar vazio";
        return;
    }

    const { data, error } = await logar(email, senha);
    if(error)
    switch(error.message)
    {
        case ("Invalid login credentials") :
            mensagemDeErro.innerText = "Email ou senha incorretos, tente novamente";
            return;
            
        default :
            alert(error.message);
            return;
    }
    else console.log("Login realizado!", data);
    user = data;
    window.location.href = "../index.html";
});