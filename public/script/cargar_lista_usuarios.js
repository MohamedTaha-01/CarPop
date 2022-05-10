window.addEventListener("load", ()=>{

    let listaUsuarios = document.getElementById('lista-usuarios');
    let inIdUsuario = document.getElementById('in-idusuario');
    let usuarios = listaUsuarios.dataset.usuarios.split(',');
    let idusuarios = listaUsuarios.dataset.idusuarios.split(',');
    let idusuarioanuncio = inIdUsuario.dataset.idusuarioanuncio;
    usuarios.shift();
    idusuarios.shift();

    for (let i = 0; i < usuarios.length; i++) {
        
        let opt = document.createElement("option");
        opt.appendChild(document.createTextNode(usuarios[i]));
        opt.setAttribute("value", idusuarios[i]);
        if(idusuarioanuncio!=undefined && idusuarioanuncio!=null && idusuarioanuncio!=''){ // si se ha cargado una id_usuario (se está editando un anuncio), seleccionar la opción
            if(idusuarios[i] == idusuarioanuncio){
                opt.setAttribute("selected", "");
                inIdUsuario.value = idusuarioanuncio;
            }
        }
        listaUsuarios.appendChild(opt);
    }

    listaUsuarios.addEventListener("change", seleccionaUsuario);

    function seleccionaUsuario(){
        inIdUsuario.value = listaUsuarios.value;
    }
});