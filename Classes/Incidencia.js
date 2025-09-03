class Incidencia {
  static incidencias = [];

  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  // Getters
  getId() { return this.id; }
  getNombre() { return this.nombre; }

  // Setters
  setId(id) { this.id = id; }
  setNombre(nombre) { this.nombre = nombre; }

  // Métodos estáticos
  static insertarIncidencia(datos) {
    const incidencia = new Incidencia(datos.id, datos.nombre);
    this.incidencias.push(incidencia);
    return incidencia;
  }

  static listarIncidencias() {
    return this.incidencias;
  }

  static obtenerIncidenciaPorId(id) {
    return this.incidencias.find(i => i.id === id);
  }
}

export default Incidencia;