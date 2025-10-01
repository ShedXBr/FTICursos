function switchmenu() {
  let navlink = document.getElementById("navlink");
  if (navlink.style.height === "0px" || navlink.style.height === "") {
    navlink.style.height = "100%";
  } else {
    navlink.style.height = "0px";
  }
}
courses = JSON.parse(localStorage.getItem('courses')) || [];
const cursosParaSalvar = courses.map(curso => ({ nome: curso }));
document.addEventListener("DOMContentLoaded", function() {
  fetch("/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ cursos: cursosParaSalvar })
  });
 
  fetchUserData().then(data =>{ 
    document.getElementById("nameof").innerText = data.name;
    data.cursos.forEach(curso => {
      findcourses(curso.nome)
      
      
  });
  
  });
});

async function findcourses(cursoName) {
  const response = await fetch("../../jsoncursos/cursos.json");
  const data = await response.json();
  
  
  data.cursos.forEach(curso => {
    if (curso.titulo.toLowerCase().trim().includes(cursoName.toLowerCase().trim())) {
      const card = document.createElement("div");
card.classList.add("card");
card.innerHTML = `
  <img src="../../media/playimg.png" alt="Curso de ${curso.titulo}">
  <h3>Curso de ${curso.titulo}</h3>
  <p>${curso.descricao}</p>
  <ul>
    <li>Carga horária: ${curso.duration}h</li>
    <li>Com certificado: ${curso.certificate ? "Sim" : "Não"}!</li>
  </ul>
`;
document.getElementById("cardport").appendChild(card);
addeventincards();

    }
  });
}

  async function fetchUserData() {
    try {
      const response = await fetch('/usuario', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        
        return data;
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
function addeventincards(){
  
let cards = document.querySelectorAll('.card');
  cards.forEach(card => {
 
    card.addEventListener('click', function() {
      
        let courseTitle = card.querySelector('h3').textContent.replace("Curso de ", "");
        localStorage.setItem('selectedCourse', courseTitle);
        if (!courses.includes(courseTitle)) {
         courses.push(courseTitle);
        }
        localStorage.setItem('courses', JSON.stringify(courses));
        window.location.href = '../especurse/index.html';
    });
});
}