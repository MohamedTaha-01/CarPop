let divFiltros = document.getElementById("div-filtros");
let rangoMin = document.getElementById("rango-precio-min");
let rangoMax = document.getElementById("rango-precio-max");

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