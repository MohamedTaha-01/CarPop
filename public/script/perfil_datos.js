
window.addEventListener("load", ()=>{

    const bEditar = document.getElementById("datos-editar");
    const bDescartar = document.getElementById("datos-descartar");

    const inNombre =  document.getElementById("in-nombre");
    const inApellido =  document.getElementById("in-apellido");
    const inCorreo = document.getElementById("in-correo");
    const inTelefono =  document.getElementById("in-telefono");
    const inDireccion = document.getElementById("in-direccion");

    const bContrasena = document.getElementById("contrasena-editar");
    const divConfirmar = document.getElementById("div-confirmar");
    const divEditar = document.getElementById("div-editar");
    const inContrasena = document.getElementById("in-contrasena");
    
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

    bDescartar.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        location.reload(true);
    });

    bContrasena.addEventListener("click", (e)=>{

        e.preventDefault();
        e.stopPropagation();

        divConfirmar.classList.remove("d-none");
        divEditar.classList.add("d-none");

        inContrasena.removeAttribute("disabled");
        inContrasena.style.borderColor = '#7de2d1';

    });
});