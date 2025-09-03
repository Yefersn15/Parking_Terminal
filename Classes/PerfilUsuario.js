class PerfilUsuario {
  static perfiles = [];

  constructor(id, perfil) {
    this.id = id;
    this.perfil = perfil;
  }

  // Getters
  getId() { return this.id; }
  getPerfil() { return this.perfil; }

  // Setters
  setId(id) { this.id = id; }
  setPerfil(perfil) { this.perfil = perfil; }

  // Métodos estáticos
  static insertarPerfil(datos) {
    const perfil = new PerfilUsuario(datos.id, datos.perfil);
    this.perfiles.push(perfil);
    return perfil;
  }

  static listarPerfiles() {
    return this.perfiles;
  }

  static obtenerPerfilPorId(id) {
    return this.perfiles.find(p => p.id === id);
  }

  static obtenerPerfilPorNombre(nombre) {
    return this.perfiles.find(p => p.perfil === nombre);
  }
}

export default PerfilUsuario;