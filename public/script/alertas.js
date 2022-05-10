function error (mensaje) {

    let div1 = document.createElement('div');
    div1.classList.add('toast align-items-center text-white bg-primary border-0');
    div1.setAttribute('role', 'alert');
    div1.setAttribute('aria-live', 'assertive');
    div1.setAttribute('aria-atomic', 'true');
    let div2 = document.createElement('div');
    div2.classList.add('d-flex');
    let div3 = document.createElement('div');
    div3.classList.add('toast-body');
    div3.appendChild(document.textContent("mensaje"));
    div2.appendChild(div3);
    div1.appendChild(div2);
    document.body.appendChild(div1);
}

function info (titulo, mensaje) {

    window.setTimeout(() => {
        // Get the modal
        let modal = document.getElementById("modal");
        let bCerrarModal = document.querySelector(".cerrar-modal");
        let outTituloModal = document.querySelector("#titulo-modal");
        let outMensajeModal = document.querySelector("#mensaje-modal");

        outTituloModal.innerText = titulo;
        outMensajeModal.innerText = mensaje;
        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        bCerrarModal.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        } 
    }, 50);
}

function log(params) {
    console.log(params);
}

export {error,info,log};