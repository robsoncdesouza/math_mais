import { cadastrar } from "../scripts/auth.js";

const form = document.getElementById("cadastro-form");
const mensagemDeErro = document.getElementById("mensagemDeErro");
const inputs = [...form.querySelectorAll("input")];

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        mensagemDeErro.innerText = "";
});
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const senhaConfirmada = document.getElementById("senhaConfirmada").value;
    
    if (inputs.some(input => input.value == "" | input.value == null)) {
        mensagemDeErro.innerText = "Nenhum campo pode estar vazio";
        return
    }
    if (senha != senhaConfirmada) {
        mensagemDeErro.innerText = "Os dois campos de senha devem ser iguais";
        return;
    }

    const { data, error } = await cadastrar(email, senha);

    if(error)
    switch(error.message)
    {       
    case("User already registered"):
        mensagemDeErro.innerText = "Esse usuário já existe";
        return;

    case("Password should be at least 6 characters."):
        mensagemDeErro.innerText = "A senha deve ter 6 ou mais caracteres"
        return;
            
        default :
            alert(error.message);
            return;
    }

    console.log("Cadastro realizado!", data);
    window.location.href = "../index.html";
});