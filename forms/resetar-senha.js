import { supabase } from "../scripts/supabase.js";

const mensagemDeErro = document.getElementById("mensagemDeErro");
const form = document.getElementById("resetar-senha-form");
const inputs = [...form.querySelectorAll("input")];

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        mensagemDeErro.innerText = "";
});
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const senha = document.getElementById("senha").value;
    const senhaConfirmada = document.getElementById("confirmar-senha").value;
    
    if (inputs.some(input => input.value == "" | input.value == null)) {
        mensagemDeErro.innerText = "Nenhum campo pode estar vazio";
        return
    }
    if (senha != senhaConfirmada) {
        mensagemDeErro.innerText = "Os dois campos devem ser iguais";
        return;
    }
    if (senha.length < 6) {
        mensagemDeErro.innerHTML = "A senha dever ter no mínimo 6 caracteres";
        return;
    }

    const {error} = await supabase.auth.updateUser(
        {
            password: senha
        }
    );

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

    window.location.href = "../index.html";
});