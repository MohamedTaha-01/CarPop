import * as validarAnuncio from '/script/validar_anuncio.js';
import {crearModal} from './modal.js';

window.addEventListener("load", function(){

    let hayCampoIdUsuario=true;

    let form = document.getElementsByTagName("form")[0];
    if(this.document.getElementById("lista-usuarios")==''||this.document.getElementById("lista-usuarios")==null){
        hayCampoIdUsuario=false;
    } else {
        var sIdUsuario = this.document.getElementById("lista-usuarios");
        var inIdUsuario = document.getElementById("in-idusuario");
        hayCampoIdUsuario=true;
    }
    let inTitulo = document.getElementById("in-titulo");
    let inDescripcion = document.getElementById("in-descripcion");
    let inImagen = document.getElementById("in-imagen");
    let inMatricula = document.getElementById("in-matricula");
    let sMarcas = document.getElementById("lista-marcas");
    let sModelos = document.getElementById("lista-modelos");
    let sCombustibles = document.getElementById("lista-combustibles");
    let sTransmisiones = document.getElementById("lista-transmisiones");
    let inPrecio = document.getElementById("in-precio");

    inTitulo.addEventListener("focusout", validarTitulo);
    inDescripcion.addEventListener("focusout", validarDescripcion);
    inImagen.addEventListener("change", validarImagen);
    inMatricula.addEventListener("focusout", validarMatricula);
    sMarcas.addEventListener("focusout", validarMarca);
    sModelos.addEventListener("focusout", validarModelo);
    sCombustibles.addEventListener("focusout", validarCombustible);
    sTransmisiones.addEventListener("focusout", validarTransmision);
    inPrecio.addEventListener("focusout", validarPrecio);
    form.addEventListener("submit", enviarFormulario);

    function validarIdUsuario(){

        if (!validarAnuncio.vIdUsuario(inIdUsuario.value)) {
            sIdUsuario.classList.add("is-invalid");
            return false;
        } else {
            sIdUsuario.classList.remove("is-invalid");
            return true;
        }
    }

    function validarTitulo(){

        if(!validarAnuncio.vTitulo(inTitulo.value)){
            inTitulo.classList.add("is-invalid");
            document.querySelector("#err-titulo-caracteres").classList.remove("d-none");
            return false;
        } else {
            inTitulo.classList.remove("is-invalid");
            document.querySelector("#err-titulo-vacio").classList.add("d-none");
            return true;
        }
    }

    function validarDescripcion(){

        if (!validarAnuncio.vDescripcion(inDescripcion.value)) {
            inDescripcion.classList.add("is-invalid");
            document.querySelector("#err-desc-caracteres").classList.remove("d-none");
            return false;
        }else{
            inDescripcion.classList.remove("is-invalid");
            document.querySelector("#err-desc-caracteres").classList.add("d-none");
            return true;
        }
    }

    function validarImagen(){

        
    }

    function validarMatricula(){

        inMatricula.value = inMatricula.value.toUpperCase();
        if(!validarAnuncio.vMatricula(inMatricula.value)){
            inMatricula.classList.add("is-invalid");
            document.querySelector("#err-matricula").classList.remove("d-none");
            return false;
        } else {
            inMatricula.classList.remove("is-invalid");
            document.querySelector("#err-matricula").classList.add("d-none");
            return true;
        }
    }

    function validarMarca() {
        
        sModelos.classList.remove("is-invalid");
        if(!validarAnuncio.vMarca(sMarcas.value)){
            sMarcas.classList.add("is-invalid");
            return false;
        }else{
            sMarcas.classList.remove("is-invalid");
            return true;
        }
    }

    function validarModelo(){

        if(!validarAnuncio.vModelo(sModelos.value)){
            sModelos.classList.add("is-invalid");
            return false;
        }else{
            sModelos.classList.remove("is-invalid");
            return true;
        }
    }

    function validarCombustible(){

        if(!validarAnuncio.vCombustible(sCombustibles.value)){
            sCombustibles.classList.add("is-invalid");
            return false;
        }else{
            sCombustibles.classList.remove("is-invalid");
            return true;
        }
    }

    function validarTransmision(){

        if(!validarAnuncio.vTransmision(sTransmisiones.value)){
            sTransmisiones.classList.add("is-invalid");
            return false;
        }else{
            sTransmisiones.classList.remove("is-invalid");
            return true;
        }
    }

    function validarPrecio(){

        inPrecio.value=parseInt(inPrecio.value);
        if(!validarAnuncio.vPrecio(inPrecio.value)){
            inPrecio.classList.add("is-invalid");
            document.querySelector("#err-precio").classList.remove("d-none");
            return false;
        }else{
            inPrecio.classList.remove("is-invalid");
            document.querySelector("#err-precio").classList.add("d-none");
            return true;
        }
    }

    function enviarFormulario(e){
        
        e.preventDefault();
        e.stopPropagation();
        if(hayCampoIdUsuario==true){

            if(!validarIdUsuario() || !validarTitulo() || !validarDescripcion() || !validarMatricula() || !validarMarca() ||
            !validarModelo() || !validarCombustible() || !validarTransmision() || !validarPrecio()){
               return false;
            } else {
                
                fetch('/admin/anuncios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: inIdUsuario.value,
                        titulo: inTitulo.value,
                        descripcion: inDescripcion.value,
                        img: inImagen.value,
                        matricula: inMatricula.value,
                        marca: sMarcas.value,
                        modelo: sModelos.value,
                        combustible: sCombustibles.value,
                        transmision: sTransmisiones.value,
                        precio: inPrecio.value
                    })
                }).then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        location.href = '/admin/anuncios'
                    }else{
                        crearModal("Error", data.mensaje, 3000, true);
                    }
                })
                .catch((error)=>{
                    crearModal("Error", data.mensaje, 3000, true);
                })

            };

        } else {

            if(!validarTitulo() || !validarDescripcion() || !validarMatricula() || !validarMarca() ||
            !validarModelo() || !validarCombustible() || !validarTransmision() || !validarPrecio()){
                return false;
            } else {

                fetch('/crear_anuncio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        titulo: inTitulo.value,
                        descripcion: inDescripcion.value,
                        img: inImagen.value,
                        matricula: inMatricula.value,
                        marca: sMarcas.value,
                        modelo: sModelos.value,
                        combustible: sCombustibles.value,
                        transmision: sTransmisiones.value,
                        precio: inPrecio.value
                    })
                }).then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        crearModal("Anuncio creado", data.mensaje, 3000, true);
                    }else{
                        crearModal("Error", data.mensaje, 3000, true);
                    }
                })
                .catch((error)=>{
                    crearModal("Error", data.mensaje, 3000, true);
                })

            };

        }
        
    }
})