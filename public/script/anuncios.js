let divFiltros = document.getElementById("div-filtros");
let formFiltros = document.getElementsByTagName("form")[0];


let tarjetas = document.getElementsByClassName("tarjeta-a");

document.getElementById("btn-recargar").addEventListener("click", ()=> location.reload());

// animacion filtros
divFiltros.addEventListener("mouseover", function(){
    divFiltros.classList.add("filtros");
});
divFiltros.addEventListener("mouseout", function(){
    divFiltros.classList.remove("filtros");
});

tarjetas = Array.from(tarjetas);
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("mouseenter",(e)=>{

        let elementoTarjeta = e.target.children;
        elementoTarjeta = elementoTarjeta[0].children;
        let infoTarjeta = elementoTarjeta[1];
        elementoTarjeta = elementoTarjeta[0].children;
        let imgTarjeta = elementoTarjeta[0];

        imgTarjeta.classList.remove("rounded-start");
        imgTarjeta.style.borderRadius = "6px";
        imgTarjeta.style.transform = "scale(1.08)";
    });
});
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("mouseleave",(e)=>{

        let elementoTarjeta = e.target.children;
        elementoTarjeta = elementoTarjeta[0].children;
        let infoTarjeta = elementoTarjeta[1];
        elementoTarjeta = elementoTarjeta[0].children;
        let imgTarjeta = elementoTarjeta[0];

        imgTarjeta.classList.add("rounded-start");
        imgTarjeta.style.borderRadius = "";
        imgTarjeta.style.transform = "";
    });
});

/*formFiltros.addEventListener("submit", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    let url = window.location.href;
    url = url.concat("?");
    url = url.concat("combustible="+document.getElementById("filtros-combustible").value);
    console.log(url);
    window.location.href = url;
})*/