function vIdUsuario(idusuario) {
    if (idusuario == 0 || idusuario=='0' || idusuario == '' ||
        idusuario == null || idusuario == undefined) return false;
    else return true;
}
function vTitulo(titulo){
    if(titulo==null || titulo=="" || titulo.length<3 || titulo.length>50) return false;
    else return true;
}
function vDescripcion(descripcion){
    if (descripcion==null || descripcion=="" || descripcion.length<3 || descripcion.length>300) return false;
    else return true;
}
function vImagen() {
}
function vMatricula(matricula){
    const regMatricula = /^\d{4}[A-Za-z]{3}$/;
    matricula = matricula.toUpperCase();
    if(!regMatricula.test(matricula)) return false;
    else return true;
}
function vMarca(marca){
    if(marca=='0' || marca=='' || marca==0) return false; 
    else return true;
}
function vModelo(modelo){
    if(modelo=='0' || modelo=='' || modelo==0) return false;
    else return true;
}
function vCombustible(combustible){
    if(combustible=='0' || combustible=='' || combustible==0) return false;
    else return true;
}
function vTransmision(transmision){
    if(transmision=='0' || transmision=='' || transmision==0) return false;
    else return true;
}
function vPrecio(precio){
    if(isNaN(precio) || precio<1 || precio>999) return false;
    else return true;
}
export {vIdUsuario, vTitulo, vDescripcion, vImagen, vMatricula,vMarca,vModelo,vCombustible,vTransmision,vPrecio};