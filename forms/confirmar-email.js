import { supabase } from "../scripts/supabase.js";

const email = sessionStorage.getItem("emailConfirmacao");
const reenvio = document.getElementById("reenvio");
const mensagemDeErro = document.getElementById("mensagemDeErro");

reenvio.addEventListener("click", async () =>
{
    const {data, error} = await supabase.auth.resend(
        {
            type: "signup",
            email: email
        }
    );
    console.log(data);
    
    if(error)
        switch (error.message) {

            default:
                mensagemDeErro.innerText = error.message;
                return;
        }
    else if(data.session)
        alert("Email enviado com sucesso");
    else mensagemDeErro.innerText = "Algo deu errado. Tente novamente mais tarde.";
});