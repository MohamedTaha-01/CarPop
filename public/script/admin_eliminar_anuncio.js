import {crearModal} from './modal.js';

// boton eliminar anuncio
let bEliminarAn = document.querySelectorAll('.b-eliminar-anuncio');
bEliminarAn.forEach(boton => {
    
    boton.addEventListener("click", async() =>{
        let idEliminarAn = boton.dataset.id;
        try {
            const res = await fetch(`/admin/anuncios/eliminar/${idEliminarAn}`, {method: 'DELETE'});
            const resjson = await res.json();
            if (resjson.eliminado) {
                crearModal(resjson.mensaje, false, 3000, true);
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                crearModal("Error", resjson.mensaje, 5000, true);
            }
        } catch (error) {
            crearModal("Error", error, 3000, true);
        }
    });
});