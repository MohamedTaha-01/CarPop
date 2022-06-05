import {crearModal} from './modal.js';

window.addEventListener("load", ()=>{

    // datos
    const bEditar = document.getElementById("datos-editar");
    const bDescartar = document.getElementById("datos-descartar");
    const bConfirmar = document.getElementById("datos-confirmar");
    const inNombre =  document.getElementById("in-nombre");
    const inApellido =  document.getElementById("in-apellido");
    const inCorreo = document.getElementById("in-correo");
    const inTelefono =  document.getElementById("in-telefono");
    const inDireccion = document.getElementById("in-direccion");

    // contraseña
    const bContrasenaEditar = document.getElementById("contrasena-editar");
    const bContrasenaConfirmar = document.getElementById("contrasena-confirmar");
    const divConfirmar = document.getElementById("div-confirmar");
    const divEditar = document.getElementById("div-editar");
    const inContrasena = document.getElementById("in-contrasena");
    let bDescartarContrasena = document.getElementById("descartar-contrasena");

    function resetearContrasena() {
        
        inContrasena.value = "";
        document.getElementById("info-contrasena").classList.remove("d-none");
        document.getElementById("err-contrasena").classList.add("d-none");
        inContrasena.setAttribute("disabled", "");
        inContrasena.style.borderColor = "";
        document.getElementById("modificar-contrasena").classList.add("d-none");
        bContrasenaEditar.classList.remove("d-none");
        document.getElementById("row-editar-contrasena").classList.remove("d-none");
        inContrasena.classList.remove("is-invalid");
    }


    function validarEmail(){

        const regEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if(!inCorreo.value.match(regEmail)){
            document.getElementById("err-correo").classList.remove("d-none");
            inCorreo.classList.add("is-invalid");
            return false;
        } else {
            document.getElementById("err-correo").classList.add("d-none");
            inCorreo.classList.remove("is-invalid");
            return true;
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


    bDescartar.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        location.reload(true);
    });
    bDescartarContrasena.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetearContrasena();
    });

    bEditar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        document.getElementById("row-editar1").classList.add("d-none");
        document.getElementById("row-editar2").classList.remove("d-none");

        inNombre.removeAttribute("disabled");
        inApellido.removeAttribute("disabled");
        inCorreo.removeAttribute("disabled");
        inTelefono.removeAttribute("disabled");
        inDireccion.removeAttribute("disabled");

        inNombre.style.borderColor = '#7de2d1';
        inApellido.style.borderColor = '#7de2d1';
        inCorreo.style.borderColor = '#7de2d1';
        inTelefono.style.borderColor = '#7de2d1';
        inDireccion.style.borderColor = '#7de2d1';
    });

    bConfirmar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        if (validarNombre() && validarApellido() && validarEmail() && validarTelefono() && validarDireccion()) {
            
            fetch(`/perfiles/${bContrasenaConfirmar.dataset.idusuario}/datos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: inNombre.value,
                    apellido: inApellido.value,
                    correo: inCorreo.value,
                    telefono: inTelefono.value,
                    direccion: inDireccion.value
                })
            }).then(response => response.json())
            .then(data => {
                if (data.estado) {
                    crearModal("Datos modificados", data.mensaje, 2000, true);
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }else{
                    crearModal("Error", data.mensaje, 3000, true);
                }
            })
            .catch((error)=>{
                crearModal("Error", data.mensaje, 3000, true);
            });

        } else {
        
            return false;
        }

    })

    bContrasenaEditar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();
        
        document.getElementById("row-editar-contrasena").classList.add("d-none");

        document.getElementById("modificar-contrasena").classList.remove("d-none");

        bContrasenaEditar.classList.add("d-none");

        inContrasena.removeAttribute("disabled");
        inContrasena.style.borderColor = '#7de2d1';
    });

    bContrasenaConfirmar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        if (inContrasena.value == '') {
            console.log(document.getElementById("err-contrasena"));
            document.getElementById("info-contrasena").classList.add("d-none");
            document.getElementById("err-contrasena").classList.remove("d-none");
            document.getElementById("err-contrasena").classList.add("d-block");
            inContrasena.classList.add("is-invalid");
        } else {
            fetch(`/perfiles/${bContrasenaConfirmar.dataset.idusuario}/contrasena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contrasena: inContrasena.value
                })
            }).then(response => response.json())
            .then(data => {
                if (data.estado) {
                    crearModal("Contraseña modificada", data.mensaje, 3000, true);
                    resetearContrasena();
                }else{
                    crearModal("Error", data.mensaje, 3000, true);
                }
            })
            .catch((error)=>{
                crearModal("Error", data.mensaje, 3000, true);
            })
        }

    })

});