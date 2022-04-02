let bIrArriba = document.createElement("button");
bIrArriba.setAttribute("id","bIrArriba");
bIrArriba.setAttribute("title","Ir arriba");
bIrArriba.innerHTML = '<img src="./public/img/google/arrow_upward.svg"></img>';

document.getElementsByTagName("body")[0].appendChild(bIrArriba);

bIrArriba.addEventListener("click", clickSubir);

window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    bIrArriba.style.display = "block";
  } else {
    bIrArriba.style.display = "none";
  }
}

function clickSubir() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  window.scrollTo({top: 0, behavior: 'smooth'});
} 