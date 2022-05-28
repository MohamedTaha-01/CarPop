let tarjetas = document.getElementsByClassName("tarjeta-a");
tarjetas = Array.from(tarjetas);

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("mouseenter",(e)=>{

        let elementoTarjeta = e.target.children;
        elementoTarjeta = elementoTarjeta[0].children;
        let infoTarjeta = elementoTarjeta[1];
        elementoTarjeta = elementoTarjeta[0].children;
        let imgTarjeta = elementoTarjeta[0];

        imgTarjeta.classList.remove("rounded-start");
        imgTarjeta.style.borderRadius = "6px";
        imgTarjeta.style.transform = "scale(1.08)";
    });
});
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("mouseleave",(e)=>{

        let elementoTarjeta = e.target.children;
        elementoTarjeta = elementoTarjeta[0].children;
        let infoTarjeta = elementoTarjeta[1];
        elementoTarjeta = elementoTarjeta[0].children;
        let imgTarjeta = elementoTarjeta[0];

        imgTarjeta.classList.add("rounded-start");
        imgTarjeta.style.borderRadius = "";
        imgTarjeta.style.transform = "";
    });
});