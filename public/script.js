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

let btn = document.querySelector(".btnanim");

btn.addEventListener('mousemove', e=>{
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  btn.style.setProperty('--x', `${x}px`);
  btn.style.setProperty('--y', `${y}px`);
})

let secabout = document.getElementById("about");
let icons = document.querySelectorAll(".iconpit");

window.addEventListener("scroll", ()=>{
   if(secabout.classList.contains("visible")){
  let offsety = 0;
  let offsetx = 0;
  let especicons = [0, 1, 4, 5]
  icons.forEach((icon, index) => {
    icon.style.fontSize = "7rem";
    
    if(especicons.includes(index)){
      icon.style.transform = `translate(${window.innerWidth/1.8+offsetx}px, ${500+offsety}px)`;
    }else{
      icon.style.transform = `translate(0px, ${500+offsety}px)`;
    }

    offsety = randomInt(0, 100); 
    offsetx = randomInt(0, 100); 
  });
}else{
  icons.forEach(icon => {
    icon.style.fontSize = "2rem";
    icon.style.transform = "translate(0px, 0px)";
  });
}
});
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let courses = JSON.parse(localStorage.getItem('courses')) || [];
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('click', function() {
        const courseTitle = card.querySelector('h3').textContent.replace("Curso de ", "");
        localStorage.setItem('selectedCourse', courseTitle);
        if (!courses.includes(courseTitle)) {
         courses.push(courseTitle);
        }
        localStorage.setItem('courses', JSON.stringify(courses));
       
        window.location.href = 'pages/especurse/index.html';
    });
});
function switchmenu() {
  let navlink = document.getElementById("navlink");
  if (navlink.style.height === "0px" || navlink.style.height === "") {
    navlink.style.height = "210%";
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