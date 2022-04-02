window.addEventListener("load", function(){

    let inEmail = document.getElementById("in-email");
    let errEmail = document.getElementById("err-email");
    // contrasena
    let inContrasena = document.getElementById("in-contrasena");
    let divMedidor = document.getElementById("medidor-contra-registro");
    let outMedidores = document.querySelectorAll(".progress-bar");

    inEmail.addEventListener("change", validarEmail);
    inContrasena.addEventListener("keyup", cambiarContrasena);

    function validarEmail(){

        const regEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if(inEmail.value.match(regEmail)){
            errEmail.classList.add("d-none");
            errEmail.classList.remove("d-block");
            inEmail.classList.remove("is-invalid");
        } else {
            errEmail.classList.remove("d-none");
            errEmail.classList.add("d-block");
            inEmail.classList.add("is-invalid");
        }
    }

    function cambiarContrasena(){

        if(inContrasena.value!=null && inContrasena.value!=""){
            // si ha escrito contraseña
            divMedidor.classList.remove("d-none");
            seguridadContrasena();
        } else {
            divMedidor.classList.add("d-none");
        }
    }

    function seguridadContrasena(){

        let valorSeguridad=0;

        const regMinusculas = /[a-zñáéíóú]+/g;
        const regMayusculas = /[A-ZÑÁÉÍÓÚ]+/g;
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
});