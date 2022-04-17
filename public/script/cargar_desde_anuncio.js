document.addEventListener("DOMContentLoaded", () => {

    // combustible
    const optCombustible = document.getElementById('lista-combustibles').children;
    const combustibleAnuncio = document.getElementById('lista-combustibles').dataset.combanuncio;
    for (let i = 0; i < optCombustible.length; i++) {
        const opt = optCombustible[i];
        if (opt.value == combustibleAnuncio) {
            opt.setAttribute("selected", "");
        }
    }
    // transmision
    const optTransmision = document.getElementById('lista-transmisiones').children;
    const transmisionAnuncio = document.getElementById('lista-transmisiones').dataset.transanuncio;
    for (let i = 0; i < optTransmision.length; i++) {
        const opt = optTransmision[i];
        if (opt.value == transmisionAnuncio) {
            opt.setAttribute("selected", "");
        }
    }

});