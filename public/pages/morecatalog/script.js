const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function startScramble(element, finalText) {
    let interval = null;
    let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        element.innerText = finalText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return finalText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= finalText.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3; 
      }, 50);
}

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      let el = entry.target;
        if(entry.isIntersecting){
            
            
            el.classList.add("visible");
            if(el.classList.contains("scramble")){
                const finalText = el.dataset.ogtext;
                startScramble(el, finalText);
            }
        }else{
          el.classList.remove("visible");
        }
    });
}, {threshold: 0.5});
document.querySelectorAll(".scramble").forEach(element => {
    observer.observe(element);
});
document.querySelectorAll("section").forEach(element => {
     observer.observe(element);
});
//buscar os cursos
 const cards = document.querySelectorAll('.card');
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    

    cards.forEach(card => {
        const courseTitle = card.querySelector('h3').textContent.toLowerCase();
        if (courseTitle.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
cards.forEach(card => {
  let courses = JSON.parse(localStorage.getItem('courses')) || [];
    card.addEventListener('click', function() {
        const courseTitle = card.querySelector('h3').textContent.replace("Curso de ", "");
        localStorage.setItem('selectedCourse', courseTitle);
        if (!courses.includes(courseTitle)) {
         courses.push(courseTitle);
        }
        localStorage.setItem('courses', JSON.stringify(courses));
        window.location.href = '../especurse/index.html';
    });
});
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
      window.location.href = 'pages/alumnarea/index.html';
    } else {
      window.location.href = 'pages/log/index.html';
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