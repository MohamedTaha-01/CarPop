window.addEventListener("load", function () {
  
    let listaMarcas = this.document.getElementById("lista-marcas");
    let listaModelos = this.document.getElementById("lista-modelos");
    let option;
    let idMarca;
    let marcaSeleccionada;

    cargarMarcas();
    listaMarcas.addEventListener("change", cargarModelos);

    function cargarMarcas(){

        let httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener("readystatechange", recibirMarcas);
        httpRequest.open("GET","recursos/json/marcas.json");
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
                    option.setAttribute("value", marca.id)
                    option.appendChild(txtMarca);
                    listaMarcas.appendChild(option);
                });

            } else if(this.status == 400){
                document.write = "Página no encontrada";
            } else {
                document.write = "Error de conexión";
            }
        } else if(this.readyState == 3){
            console.log("Cargando...");
        }
    }

    function cargarModelos(){

        idMarca = listaMarcas.value;
        if(idMarca=='0'){
            marcaSeleccionada = false;
        } else marcaSeleccionada = true;

        let httpRequest2 = new XMLHttpRequest();
        httpRequest2.addEventListener("readystatechange", recibirMunicipios);
        httpRequest2.open("GET","recursos/json/modelos.json");
        httpRequest2.setRequestHeader("Content-Type", "application-json");
        httpRequest2.send();
    }

    function recibirMunicipios(){

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
                } else {
                    listaModelos.setAttribute("disabled","");
                }

                // crear options modelos
                oModelos.forEach(modelo => {
                    if (modelo.id_marca == idMarca){
                        option = document.createElement("option");
                        let txtModelo = document.createTextNode(modelo.nombre);
                        option.appendChild(txtModelo);
                        listaModelos.appendChild(option);
                    }
                });

            } else if(this.status == 400){
                document.write = "Página no encontrada";
            } else {
                document.write = "Error de conexión";
            }
        } else if(this.readyState == 3){
            console.log("Cargando...");
        }
    }

})