function crearModal(titulo, info, duracion, sePuedeCerrar){
    
    // crear div modal
    let div = document.createElement("div");
    div.id="modal";
    div.classList.add("modal");
    document.body.appendChild(div);
    
    let modal = document.getElementById("modal");

    modal.style.zIndex = 998;
    modal.innerHTML="<div id='modal-contenido' class='modal-contenido'></div>";

    let modalContenido = document.getElementById("modal-contenido");

    if (titulo) {
        let span = document.createElement("div");
        if (info) {
            span.innerHTML = "<div class='bg-primary px-5 py-3'><div class='fw-bold fs-5 text-light'>"+titulo+"</div></div>";
        } else {
            span.innerHTML = "<div class='bg-primary px-5 py-3'><div class='text-center fw-bold fs-5 text-light'>"+titulo+"</div></div>";
        }
        modalContenido.appendChild(span);
    }
    if (info) {
        let span = document.createElement("div");
        span.innerHTML = "<div class='bg-light px-5 py-4'><div class='text-dark'>"+info+"</div></div>"
        modalContenido.appendChild(span);
    }

    modal.style.display = "block";

    if (sePuedeCerrar) {
        window.addEventListener("click", (e)=>{
            if (e.target == modal) {
                modal.style.display = "none";
            }
        })
    }

    setTimeout((()=>{
                
        document.getElementById("modal").remove();

    }), duracion);
}

export {crearModal};