window.addEventListener("load", ()=>{

    let parametros = (location.href.substring(location.href.indexOf('?')+1)).split('&');
    parametros = parametros.map((parametro) => {
        let arrParms = parametro.split('=');
        return arrParms[1];
    })

    if (parametros[0] != undefined) {
        if (parametros[0]!='') {
            if (parametros[0] == 'Di%C3%A9sel') {
                parametros[0] = 'Diésel';
            } else if (parametros[0] == 'El%C3%A9ctrico'){
                parametros[0] = 'Eléctrico';
            } else if (parametros[0] == 'H%C3%ADbrido'){
                parametros[0] = 'Híbrido';
            }
            document.getElementsByName("combustible")[0].value = parametros[0];
        }
        if (parametros[1]!='') {
            if (parametros[1]!="Manual") {
                document.getElementsByName("transmision")[0].value = "Automático";
            } else document.getElementsByName("transmision")[0].value = "Manual";
        }
        if (parametros[2]!='') {
            document.getElementsByName("preciomin")[0].value = parametros[2];
        }
        if (parametros[3]!='') {
            document.getElementsByName("preciomax")[0].value = parametros[3];
        }
    }
})