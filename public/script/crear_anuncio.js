window.addEventListener("load", function(){

    let form = document.getElementsByTagName("form")[0];
    let inTitulo = document.getElementById("in-titulo");
    let inDescripcion = document.getElementById("in-descripcion");
    let inImagen = document.getElementById("in-imagen");
    let sMarcas = document.getElementById("lista-marcas");
    let sModelos = document.getElementById("lista-modelos");
    let sCombustibles = document.getElementById("lista-combustibles");
    let sTransmisiones = document.getElementById("lista-transmisiones");
    let inPrecio = document.getElementById("in-precio");
    let valido=true;

    inTitulo.addEventListener("focusout", validarTitulo);
    form.addEventListener("submit", enviarFormulario);

    function validarTitulo(){

        if(inTitulo.value==null || inTitulo.value==""){
            inTitulo.classList.add("is-invalid");
            document.querySelector("#err-titulo-vacio").classList.remove("d-none");
        } else {
            inTitulo.classList.remove("is-invalid");
            document.querySelector("#err-titulo-vacio").classList.add("d-none");
            if(inTitulo.value.length<3){
                inTitulo.classList.add("is-invalid");
                document.querySelector("#err-titulo-caracteres").classList.remove("d-none");
            }else{
                inTitulo.classList.remove("is-invalid");
                document.querySelector("#err-titulo-vacio").classList.add("d-none");
            }
        }
    }

    function enviarFormulario(e){

    }
})