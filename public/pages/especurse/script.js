let courseinf = localStorage.getItem('selectedCourse');

if(courseinf !== null){
    fetch("../../jsoncursos/cursos.json").then(response => response.json()).then(data => {    
        let course = data.cursos.find(c => c.titulo === courseinf);
        if(course){
            document.querySelector('#Titulo').innerText = course.titulo;
            document.querySelector('#DescCurse').innerText = course.descricao;
            let modulacord = document.querySelector('#modulacord');
            document.querySelector('#classtitle').innerText = course.modulos[0].aulas[0].titulo;
            document.querySelector('#videoPlayer').src = `../../media/${course.modulos[0].aulas[0].video}`;
            document.querySelector('#classdesc').innerText = course.modulos[0].aulas[0].descricao;
            document.querySelector('#videoPlayer').load();
            course.modulos.forEach(modulo => {
                modulacord.innerHTML += `
                <div class="modulacord" >
                <button class="accordbtn">${modulo.titulo}</button>
                    <div class="accordcontent">
                        <ul>
                            ${modulo.aulas.map(aula => `<li class="classti">${aula.titulo}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                `;
                addeventofclickaccord();
                updatevideo(course);
            });
        } else {
            console.error("Curso não encontrado");
        }
    });
}
function addeventofclickaccord(){
    let acordbtn = document.querySelectorAll('.accordbtn');
    acordbtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            let content = btn.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                btn.classList.remove('active');
            } else {
                document.querySelectorAll('.accordcontent').forEach(el => el.style.maxHeight = null);
                content.style.maxHeight = content.scrollHeight + "px";
                btn.classList.add('active');
            }
        });
    });
}
function updatevideo(course){
     let classlinks = document.querySelectorAll('.classti');
    classlinks.forEach((link) => {
    link.addEventListener('click', () => {
        course.modulos.forEach(modulo => {
            modulo.aulas.forEach(aula => {
                if(aula.titulo === link.innerText){
                    document.querySelector('#classtitle').innerText = aula.titulo;
                    document.querySelector('#videoPlayer').src = `../../media/${aula.video}`;
                    document.querySelector('#classdesc').innerText = aula.descricao;
                    document.querySelector('#videoPlayer').load();
                }
            });
        });
        
    });
});
}

function nextvideo(btn){
    let currentTitle = document.querySelector('#classtitle').innerText;
    fetch("../../jsoncursos/cursos.json").then(response => response.json()).then(data => {    
         
        let course = data.cursos.find(c => c.titulo === courseinf);
        if(course){
            let found = false;
            for(let i = 0; i < course.modulos.length; i++){
                for(let j = 0; j < course.modulos[i].aulas.length; j++){
                    if(found){
                        document.querySelector('#classtitle').innerText = course.modulos[i].aulas[j].titulo;
                        document.querySelector('#videoPlayer').src = `../../media/${course.modulos[i].aulas[j].video}`;
                        document.querySelector('#classdesc').innerText = course.modulos[i].aulas[j].descricao;
                        document.querySelector('#videoPlayer').load();
                        return;
                    }
                    if(course.modulos[i].aulas[j].titulo === currentTitle){
                        
                        found = true;
                    }
                }
                
            }
        }
    });
    
}
function backvideo(){
    let currentTitle = document.querySelector('#classtitle').innerText;
    fetch("../../jsoncursos/cursos.json").then(response => response.json()).then(data => {    
         
        let course = data.cursos.find(c => c.titulo === courseinf);
        if(course){
            let previous = null;
            for(let i = 0; i < course.modulos.length; i++){
                for(let j = 0; j < course.modulos[i].aulas.length; j++){
                    if(course.modulos[i].aulas[j].titulo === currentTitle){
                        if(previous){
                            document.querySelector('#classtitle').innerText = previous.titulo;
                            document.querySelector('#videoPlayer').src = `../../media/${previous.video}`;
                            document.querySelector('#classdesc').innerText = previous.descricao;
                            document.querySelector('#videoPlayer').load();
                        }
                        return;
                    }
                    previous = course.modulos[i].aulas[j];
                }
            }
        }
    });
}
function switchmenu() {
  let navlink = document.getElementById("navlink");
  if (navlink.style.height === "0px" || navlink.style.height === "") {
    navlink.style.height = "100%";
  } else {
    navlink.style.height = "0px";
  }
}
document.getElementById("alumnarealink").addEventListener("click", function(){
  
  fetchAuthStatus().then(isAuthenticated => {
    if (isAuthenticated) {
      window.location.href = '../../pages/alumnarea/index.html';
    } else {
      window.location.href = '../../pages/log/index.html';
    }
  });
});
async function fetchAuthStatus() {
  try {
    const response = await fetch('/autenticado', {
      method: 'GET',
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      return data.autenticado;
    } else {
      console.error('Erro ao verificar status de autenticação:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Erro na requisição de autenticação:', error);
    return false;
  }
}