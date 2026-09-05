import { cadastrar } from "./auth.js";

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
    {
        if (error.message == "Invalid login credentials") {
            mensagemDeErro.innerText = "Email ou senha incorretos, tente denovo";
        }
        else {
            alert(error.message);
            return;
        }
    }
    else console.log("Cadastro realizado!", data);

    // window.location.href = "licoes.html";
});