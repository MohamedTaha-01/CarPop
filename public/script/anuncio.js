import {crearModal} from './modal.js';

window.addEventListener("load", ()=>{

    let bCopiarLink = document.getElementById("btn-copiar-link");

    bCopiarLink.addEventListener("click", (e)=>{

        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
            crearModal("Enlace copiado", false, 2500, true);
        }, () => {
            crearModal("Error", "No se ha podido copiar el enlace", 2500, true);
        });
    });
});