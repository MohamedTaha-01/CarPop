import {crearModal} from './modal.js';

window.addEventListener("load", function(){

    const inAsunto = this.document.getElementById("in-asunto");
    const inMensaje = this.document.getElementById("in-mensaje");
    const bEnviar = this.document.getElementById("b-enviar");

    function validarAsunto() {
        
        if (inAsunto.value == '') {
            inAsunto.classList.add("is-invalid");
            return false;
        } else {
            inAsunto.classList.remove("is-invalid");
            return true;
        }
    }

    function validarMensaje() {
        
        if (inMensaje.value.length < 5) {
            inMensaje.classList.add("is-invalid");
            return false;
        } else {
            inMensaje.classList.remove("is-invalid");
            return true;
        }
    }

    inAsunto.addEventListener("focusout", () => validarAsunto());
    inMensaje.addEventListener("focusout", () => validarMensaje());

    bEnviar.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (validarAsunto() && validarMensaje()) {

            fetch('/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    asunto: inAsunto.value.trim(),
                    mensaje: inMensaje.value,
                    correo: bEnviar.dataset.correo,
                    nombreap: bEnviar.dataset.usuario.trim()
                })
            }).then(response => response.json())
            .then(data => {
                if (data.estado) {
                    crearModal("Mensaje enviado", data.mensaje, 5000, true);
                    inAsunto.value = "";
                    inMensaje.value = "";
                }else{
                    crearModal("Error", data.mensaje, 3000, true);
                }
            })
            .catch((error)=>{
                crearModal("Error", data.mensaje, 3000, true);
            })
            
        } else return false;
    });

})