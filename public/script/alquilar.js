let divFiltros = document.getElementById("div-filtros");
let rangoMin = document.getElementById("rango-precio-min");
let rangoMax = document.getElementById("rango-precio-max");

let tarjetas = document.getElementsByClassName("tarjeta-a");

document.getElementById("btn-recargar").addEventListener("click", ()=> location.reload());

// animacion filtros
divFiltros.addEventListener("mouseover", function(){
    divFiltros.classList.add("filtros");
});
divFiltros.addEventListener("mouseout", function(){
    divFiltros.classList.remove("filtros");
});

// rangos
rangoMin.addEventListener("input", function () {
    if (parseInt(rangoMin.value) > parseInt(rangoMax.value)) {
        rangoMax.value = rangoMin.value;
    }
    actualizarValor();
});

rangoMax.addEventListener("input", function () {
    if (parseInt(rangoMax.value) < parseInt(rangoMin.value)) {
        rangoMin.value = rangoMax.value;
    }
    actualizarValor();
});

function actualizarValor() {
    if (rangoMin.value == 0) {
        document.getElementById("out-precio-min").innerHTML = 'No';
    } else {
        document.getElementById("out-precio-min").innerHTML = rangoMin.value + '€';
    }
    if (rangoMax.value == 0) {
        document.getElementById("out-precio-max").innerHTML = 'No';
    } else {
        document.getElementById("out-precio-max").innerHTML = rangoMax.value + '€';
    }
}

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