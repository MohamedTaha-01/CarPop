window.addEventListener("load", ()=>{

    let bCopiarLink = document.getElementById("btn-copiar-link");

    bCopiarLink.addEventListener("click", (e)=>{

        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
            document.getElementById("modal-copiar-link").classList.remove("d-none");
            document.getElementById("modal-copiar-link").classList.add("d-flex");
            setTimeout((()=>{
                document.getElementById("modal-copiar-link").classList.remove("d-flex");
                document.getElementById("modal-copiar-link").classList.add("d-none");
            }), 3000);
        }, () => {
            //! mensaje error
        });
    });
});