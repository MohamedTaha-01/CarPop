window.addEventListener("load", function () {
  
    let listaMarcas = this.document.getElementById("lista-marcas");
    let listaModelos = this.document.getElementById("lista-modelos");
    let option;
    let idMarca;
    let marcaSeleccionada;
    let editandoAnuncio = false;

    // si el parametro marcaanuncio tiene una marca (carga desde la bbdd al editar un anuncio)
    let marcaAn = listaMarcas.dataset.marcaanuncio;
    if(marcaAn != undefined && marcaAn != null && marcaAn != ''){
        var modeloAn = listaModelos.dataset.modeloanuncio;
        editandoAnuncio=true;
    }

    cargarMarcas();

    if (editandoAnuncio) cargarModelos(); // fuerza la carga de modelos si se está editando un anuncio
    
    listaMarcas.addEventListener("change", ()=>{
        /* después de primera ejecución del script con editandoAnuncio=true para cargar las opciones seleccionadas desde bbdd,
        se desactiva para permitir funcionamiento normal */
        editandoAnuncio=false; 
        cargarModelos();
    });

    function cargarMarcas(){

        let httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener("readystatechange", recibirMarcas);
        httpRequest.open("GET","/json/marcas.json");
        httpRequest.setRequestHeader("Content-Type", "application-json");
        httpRequest.send();
    }

    function recibirMarcas(){

        if (this.readyState == 4){
            if(this.status == 200){

                let oMarcas = JSON.parse(this.responseText);

                oMarcas.forEach(marca => {
                    option = document.createElement("option");
                    let txtMarca = document.createTextNode(marca.nombre);
                    option.setAttribute("value", marca.nombre);
                    option.setAttribute("nmarca", marca.id);
                    if (editandoAnuncio) {
                        if (marcaAn == marca.nombre) { // selecciona la marca recogida desde bbdd
                            option.setAttribute("selected", "");
                            idMarca = marca.id;
                            marcaSeleccionada = true;
                        }
                    }
                    option.appendChild(txtMarca);
                    listaMarcas.appendChild(option);
                });

            } else if(this.status == 400){
                console.error("Página no encontrada");
            } else {
                console.error("Error de conexión");
            }
        } else if(this.readyState == 3){
            console.log("Cargando marcas...");
        }
    }

    function cargarModelos(){

        if (!editandoAnuncio) {
            idMarca = listaMarcas.options[listaMarcas.selectedIndex].getAttribute("nmarca"); // recoge la id de la marca seleccionada manualmente
        }
        if(idMarca=='0' || idMarca==null){
            marcaSeleccionada = false;
        } else marcaSeleccionada = true;

        let httpRequest2 = new XMLHttpRequest();
        httpRequest2.addEventListener("readystatechange", recibirModelos);
        httpRequest2.open("GET","/json/modelos.json");
        httpRequest2.setRequestHeader("Content-Type", "application-json");
        httpRequest2.send();
    }

    function recibirModelos(){

        if (this.readyState == 4){
            if(this.status == 200){
                
                let oModelos = JSON.parse(this.responseText);
                
                // eliminar todas las options
                let rem = listaModelos.getElementsByTagName("option");
                rem = Array.from(rem);
                rem.forEach(e => {
                    e.remove();
                });

                // crear option por defecto
                option=document.createElement("option");
                    option.appendChild(document.createTextNode("Seleccionar modelo"));
                    option.setAttribute("value", "0");
                    listaModelos.appendChild(option);

                // activar/desactivar campo
                if(marcaSeleccionada){
                    listaModelos.removeAttribute("disabled");
                    //console.info("marca seleccionada");
                } else {
                    listaModelos.setAttribute("disabled","");
                    //console.info("marca NO seleccionada");
                }

                // crear options modelos
                oModelos.forEach(modelo => {
                    if (modelo.id_marca == idMarca){
                        option = document.createElement("option");
                        let txtModelo = document.createTextNode(modelo.nombre);
                        option.appendChild(txtModelo);
                        if (editandoAnuncio) {
                            if (modeloAn == modelo.nombre) { 
                                option.setAttribute("selected", ""); // selecciona el modelo cargado desde bbdd
                            }
                        }
                        listaModelos.appendChild(option);
                    }
                });

            } else if(this.status == 400){
                console.error("Página no encontrada");
            } else {
                console.error("Error de conexión");
            }
        } else if(this.readyState == 3){
            console.log("Cargando modelos...");
        }
    }

})