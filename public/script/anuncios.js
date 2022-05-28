let divFiltros = document.getElementById("div-filtros");
let formFiltros = document.getElementsByTagName("form")[0];

document.getElementById("btn-recargar").addEventListener("click", ()=> location.reload());

// animacion filtros
divFiltros.addEventListener("mouseover", function(){
    divFiltros.classList.add("filtros");
});
divFiltros.addEventListener("mouseout", function(){
    divFiltros.classList.remove("filtros");
});