import {crearModal} from './modal.js';

window.addEventListener("load", function(){
    
    let valorSeguridad=0;

    document.getElementsByTagName('form')[0].addEventListener("submit", enviarForumlario)

    let inEmail = document.getElementById("in-email");
    // contrasena
    let inContrasena = document.getElementById("in-contrasena");
    let inContrasena2 = document.getElementById("in-contrasena2");
    let divMedidor = document.getElementById("medidor-contra-registro");
    let outMedidores = document.querySelectorAll(".progress-bar");
    //
    let inNombre = document.getElementById("in-nombre");
    let inApellido = document.getElementById("in-apellido");
    let inTelefono = document.getElementById("in-telefono");
    let inDireccion = this.document.getElementById("in-direccion");
    // Boton mostrar contrasena
    let bMostrar = this.document.getElementById("b-mostrar-contra");
    let imgMostrar = this.document.getElementById("img-mostrar-contra");
    //

    inEmail.addEventListener("focusout", validarEmail);
    inContrasena.addEventListener("keyup", contrasenaUp);
    inContrasena.addEventListener("keyup", validarContrasena);
    inContrasena2.addEventListener("keyup", validarContrasena);
    inNombre.addEventListener("focusout", validarNombre);
    inApellido.addEventListener("focusout", validarApellido);
    inTelefono.addEventListener("focusout", validarTelefono);
    inDireccion.addEventListener("focusout", validarDireccion);

    bMostrar.addEventListener("click", mostrarContrasena);

    function mostrarContrasena(e){

        e.preventDefault();
        e.stopPropagation();
        if(inContrasena.type=="password") {
            inContrasena.setAttribute("type", "text");
            inContrasena2.setAttribute("type", "text");
            imgMostrar.setAttribute("src", "/img/google/visibilityoff.svg");
        } else {
            inContrasena.setAttribute("type", "password");
            inContrasena2.setAttribute("type", "password");
            imgMostrar.setAttribute("src", "/img/google/visibility.svg");
        }
    }

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

    function contrasenaUp(){

        if(inContrasena.value!=null && inContrasena.value!=""){
            // si ha escrito contrase??a
            divMedidor.classList.remove("d-none");
            seguridadContrasena();
            validarContrasena();
        } else {
            divMedidor.classList.add("d-none");
        }
    }

    function seguridadContrasena(){

        valorSeguridad=0;

        const regMinusculas = /[a-z????????????]+/g;
        const regMayusculas = /[A-Z????????????]+/g;
        const regNumeros = /\d+/g;
        const regCaracteres = /[^a-z\d]+/gi
        const regLongitud = /.{8,}/gi

        if(regMinusculas.test(inContrasena.value)) valorSeguridad++;
        if(regMayusculas.test(inContrasena.value)) valorSeguridad++;
        if(regNumeros.test(inContrasena.value)) valorSeguridad++;
        if(regCaracteres.test(inContrasena.value)) valorSeguridad++;
        if(regLongitud.test(inContrasena.value)) valorSeguridad++;

        outMedidores[0].classList.add("d-none");
        outMedidores[1].classList.add("d-none");
        outMedidores[2].classList.add("d-none");
        outMedidores[3].classList.add("d-none");
        outMedidores[4].classList.add("d-none");

        if (valorSeguridad<=1){
            outMedidores[0].classList.remove("d-none");
        } else if(valorSeguridad==2){
            outMedidores[1].classList.remove("d-none");
        } else if(valorSeguridad==3){
            outMedidores[2].classList.remove("d-none");
        } else if(valorSeguridad==4){
            outMedidores[3].classList.remove("d-none");
        } else {
            outMedidores[4].classList.remove("d-none");
        }
    }

    function validarContrasena(){

        if(valorSeguridad<3){ // validar contrase??a
            document.getElementById("err-contrasena").classList.remove("d-none");
            document.getElementById("err-contrasena").classList.add("d-block");
            inContrasena.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-contrasena").classList.add("d-none");
            document.getElementById("err-contrasena").classList.remove("d-block");
            inContrasena.classList.remove("is-invalid");
            if (inContrasena.value != inContrasena2.value) { // validar repetir contrase??a
                document.getElementById("err-contrasena2").classList.remove("d-none");
                document.getElementById("err-contrasena2").classList.add("d-block");
                inContrasena2.classList.add("is-invalid");
                return false;
            } else {
                document.getElementById("err-contrasena2").classList.add("d-none");
                document.getElementById("err-contrasena2").classList.remove("d-block");
                inContrasena2.classList.remove("is-invalid");
                return true;
            }
        }
    }

    function validarNombre(){

        inNombre.value = inNombre.value.trim();
        if(inNombre.value==null || inNombre.value==''){
            inNombre.classList.add("is-invalid");
            return false;
        } else {
            inNombre.classList.remove("is-invalid");
            return true;
        }
    }

    function validarApellido(){
        
        inApellido.value = inApellido.value.trim();
        if(inApellido.value==null || inApellido.value==''){
            inApellido.classList.add("is-invalid");
            return false;
        } else {
            inApellido.classList.remove("is-invalid");
            return true;
        }
    }

    function validarTelefono(){
        
        const regTelefono = /^(6|9){1}\d{8}$/;
        if(!inTelefono.value.match(regTelefono)){
            document.getElementById("err-telefono").classList.remove("d-none");
            inTelefono.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-telefono").classList.add("d-none");
            inTelefono.classList.remove("is-invalid");
            return true;
        }
    }

    function validarDireccion(){

        inDireccion.value = inDireccion.value.trim();
        if(inDireccion.value==null || inDireccion.value==''){
            document.getElementById("err-direccion").classList.remove("d-none");
            inDireccion.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-direccion").classList.add("d-none");
            inDireccion.classList.remove("is-invalid");
            return true;
        }
    }

    function enviarForumlario(e) {
        
        e.preventDefault();
        e.stopPropagation();
        
        if(!validarEmail() || !validarContrasena() || !validarNombre() || !validarApellido() || !validarTelefono() || !validarDireccion()){
            return false;
        } else {
            fetch('/registrarse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: inNombre.value,
                    apellido: inApellido.value,
                    correo: inEmail.value,
                    contrasena: inContrasena.value,
                    telefono: inTelefono.value,
                    direccion: inDireccion.value
                })
            }).then(response => response.json())
            .then(data => {
                if (data.estado) {
                    location.href = '/iniciar_sesion';
                }else{
                    crearModal("Error", data.mensaje, 3000, true);
                }
            })
            .catch((error)=>{
                crearModal("Error", data.mensaje, 3000, true);
            })
        }
    }

});