window.addEventListener("load", function(){

    let form = document.getElementsByTagName("form")[0];
    let inTitulo = document.getElementById("in-titulo");
    let inDescripcion = document.getElementById("in-descripcion");
    let inImagen = document.getElementById("in-imagen");
    let inMatricula = document.getElementById("in-matricula");
    let sMarcas = document.getElementById("lista-marcas");
    let sModelos = document.getElementById("lista-modelos");
    let sCombustibles = document.getElementById("lista-combustibles");
    let sTransmisiones = document.getElementById("lista-transmisiones");
    let inPrecio = document.getElementById("in-precio");
    let inFecha = document.getElementById("in-fecha");
    let valido=true;

    inTitulo.addEventListener("focusout", validarTitulo);
    inDescripcion.addEventListener("focusout", validarDescripcion);
    inMatricula.addEventListener("focusout", validarMatricula);
    sMarcas.addEventListener("focusout", validarMarca);
    sModelos.addEventListener("focusout", validarModelo);
    sCombustibles.addEventListener("focusout", validarCombustible);
    sTransmisiones.addEventListener("focusout", validarTransmision);
    inPrecio.addEventListener("focusout", validarPrecio);
    form.addEventListener("submit", enviarFormulario);

    function validarTitulo(){

        if(inTitulo.value==null || inTitulo.value=="" || inTitulo.value.length<3 || inTitulo.value.length>50){
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

        if (inDescripcion.value==null || inDescripcion.value=="" || inDescripcion.value.length<3 || inDescripcion.value.length>300) {
            inDescripcion.classList.add("is-invalid");
            document.querySelector("#err-desc-caracteres").classList.remove("d-none");
            return false;
        }else{
            inDescripcion.classList.remove("is-invalid");
            document.querySelector("#err-desc-caracteres").classList.add("d-none");
            return true;
        }
    }

    function validarMatricula(){

        const regMatricula = /^\d{4}[A-Za-z]{3}$/;

        inMatricula.value = inMatricula.value.toUpperCase();
        if(!regMatricula.test(inMatricula.value)){
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

        if(sMarcas.value=='0' || sMarcas.value=='' || sMarcas.value==0){
            sMarcas.classList.add("is-invalid");
            return false;
        }else{
            sMarcas.classList.remove("is-invalid");
            return true;
        }
    }

    function validarModelo(){

        if(sModelos.value=='0' || sModelos.value=='' || sModelos.value==0){
            sModelos.classList.add("is-invalid");
            return false;
        }else{
            sModelos.classList.remove("is-invalid");
            return true;
        }
    }

    function validarCombustible(){

        if(sCombustibles.value=='0' || sCombustibles.value=='' || sCombustibles.value==0){
            sCombustibles.classList.add("is-invalid");
            return false;
        }else{
            sCombustibles.classList.remove("is-invalid");
            return true;
        }
    }

    function validarTransmision(){

        if(sTransmisiones.value=='0' || sTransmisiones.value=='' || sTransmisiones.value==0){
            sTransmisiones.classList.add("is-invalid");
            return false;
        }else{
            sTransmisiones.classList.remove("is-invalid");
            return true;
        }
    }

    function validarPrecio(){

        inPrecio.value=parseInt(inPrecio.value);
        if(isNaN(inPrecio.value) || inPrecio.value<1 || inPrecio.value>999){
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

        let fecha = new Date();
        inFecha.value = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()} ${fecha.getUTCHours()+2}:${fecha.getUTCMinutes()}`;

        if(!validarTitulo() || !validarDescripcion() || !validarMatricula() || !validarMarca() ||
         !validarModelo() || !validarCombustible() || !validarTransmision() || !validarPrecio()){
            e.preventDefault();
            e.stopPropagation();
        }
    }
})