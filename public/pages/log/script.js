let btn1 = document.querySelector("#btn1");
let side = true;
btn1.addEventListener("click", function() {
    let desliz = document.querySelector("#desliz");
    let content = document.querySelector("#descontent");
    if(side){
       desliz.style.transform = "translateX(-100%)";
       content.innerHTML = `
  <h1>Bem-vindo de volta</h1>
  <p>Faça login para continuar</p>
  <p>Seu aprendizado está a um clique de distância. Continue sua jornada com nossos cursos!</p>
  <p>Não tem uma conta? Cadastre agora!</p>
  
`;
         btn1.innerHTML = "Cadastrar";
        side = false;
    }else{
        content.innerHTML = `
  <h1>Crie sua conta</h1>
  <p>Junte-se a nós e comece sua jornada de aprendizado</p>
  <p>Desbloqueie acesso a cursos, projetos e uma comunidade pronta para te ajudar a crescer.</p>
  <p>Já tem uma conta? Faça login!</p>
`;

        desliz.style.transform = "translateX(0%)";
        btn1.innerHTML = "Logar";
        side = true;
    }
});

document.getElementById("forgotpass").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Um email foi enviado para você!");
    fetch('/recpass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: document.getElementById("email1").value })
    })
    .then(response => response.json());
});
