const toggle=document.querySelector(".menu-toggle");
const menu=document.querySelector(".nav-menu");

function closeMenu(returnFocus=false){
  if(!toggle||!menu)return;
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Open menu");
  menu.classList.remove("is-open");
  if(returnFocus)toggle.focus();
}

if(toggle&&menu){
  toggle.addEventListener("click",()=>{
    const opening=toggle.getAttribute("aria-expanded")!=="true";
    toggle.setAttribute("aria-expanded",String(opening));
    toggle.setAttribute("aria-label",opening?"Close menu":"Open menu");
    menu.classList.toggle("is-open",opening);
    if(opening)menu.querySelector("a")?.focus();
  });

  menu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>closeMenu()));
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&toggle.getAttribute("aria-expanded")==="true")closeMenu(true);
  });
  document.addEventListener("click",event=>{
    if(!menu.contains(event.target)&&!toggle.contains(event.target))closeMenu();
  });
  window.addEventListener("resize",()=>{
    if(window.innerWidth>760)closeMenu();
  });
}

const year=document.querySelector("#year");
if(year)year.textContent=new Date().getFullYear();
