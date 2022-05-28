
window.addEventListener("load", ()=>{

    const bEditar = document.getElementById("datos-editar");
    const bDescartar = document.getElementById("datos-descartar");
    const bConfirmar = document.getElementById("datos-confirmar");

    const inNombre =  document.getElementById("in-nombre");
    const inApellido =  document.getElementById("in-apellido");
    const inCorreo = document.getElementById("in-correo");
    const inContrasena = document.getElementById("in-contrasena");
    const inTelefono =  document.getElementById("in-telefono");
    const inDireccion = document.getElementById("in-direccion");

    bEditar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        document.getElementById("row-editar1").classList.add("d-none");
        document.getElementById("row-editar2").classList.remove("d-none");

        inNombre.removeAttribute("disabled");
        inApellido.removeAttribute("disabled");
        inCorreo.removeAttribute("disabled");
        inContrasena.removeAttribute("disabled");
        inTelefono.removeAttribute("disabled");
        inDireccion.removeAttribute("disabled");

        inNombre.style.borderColor = '#7de2d1';
        inApellido.style.borderColor = '#7de2d1';
        inCorreo.style.borderColor = '#7de2d1';
        inContrasena.style.borderColor = '#7de2d1';
        inTelefono.style.borderColor = '#7de2d1';
        inDireccion.style.borderColor = '#7de2d1';
    });

    bDescartar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        location.reload(true);
    });
});