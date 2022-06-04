import {crearModal} from './modal.js';

window.addEventListener("load", function(){

    document.getElementsByTagName('form')[0].addEventListener("submit", enviarForumlario);
    let inEmail = document.getElementById("in-email");
    let inContrasena = document.getElementById("in-contrasena");

    inEmail.addEventListener("focusout", validarEmail);
    inContrasena.addEventListener("focusout", validarContrasena);

    function validarEmail(){

        const regEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if(!inEmail.value.match(regEmail)){
            document.getElementById("err-email").classList.remove("d-none");
            inEmail.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-email").classList.add("d-none");
            inEmail.classList.remove("is-invalid");
            return true;
        }
    }

    function validarContrasena(){

        if(inContrasena.value==null || inContrasena.value==""){
            document.getElementById("err-contrasena").classList.remove("d-none");
            inContrasena.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-contrasena").classList.add("d-none");
            inContrasena.classList.remove("is-invalid");
            return true;
        }
    }

    function enviarForumlario(e) {
        
        e.preventDefault();
        e.stopPropagation();

        if(!validarEmail() || !validarContrasena()){
            return false;
        } else {
            fetch('/iniciar_sesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo: inEmail.value,
                    contrasena: inContrasena.value
                })
            }).then(response => response.json())
            .then(data => {
                if (data.estado) {
                    location.href = '/';
                }else{
                    crearModal("Error", data.mensaje, 3000, true);
                }
            })
            .catch((error)=>{
                crearModal("Error", data.mensaje, 3000, true);
            })
        }
    }

})