class Usuario {

    constructor(nombre, apellido, correo, contrasena, telefono, direccion) {
        
        this.id = Usuario.incrementarId()
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contrasena = contrasena;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    static incrementarId() {
        if (!this.ultimaId) this.ultimaId = 1;
        else this.ultimaId++
        return this.ultimaId
    }
}

module.exports = Usuario;