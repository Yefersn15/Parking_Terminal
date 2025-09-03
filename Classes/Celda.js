class Celda {
  static celdas = [];

  constructor(id, tipo, estado, area) {
    this.id = id;
    this.tipo = tipo;
    this.estado = estado;
    this.area = area; // área/piso/nivel
  }

  // Getters
  getId() { return this.id; }
  getTipo() { return this.tipo; }
  getEstado() { return this.estado; }
  getArea() { return this.area; }

  // Setters
  setId(id) { this.id = id; }
  setTipo(tipo) { this.tipo = tipo; }
  setEstado(estado) { this.estado = estado; }
  setArea(area) { this.area = area; }


  // Getters
  getId() { return this.id; }
  getTipo() { return this.tipo; }
  getEstado() { return this.estado; }

  // Setters
  setId(id) { this.id = id; }
  setTipo(tipo) { this.tipo = tipo; }
  setEstado(estado) { this.estado = estado; }

  // Métodos estáticos
  static insertarCelda(datos) {
    const celda = new Celda(datos.id, datos.tipo, datos.estado, datos.area || 'Piso 1');
    this.celdas.push(celda);
    return celda;
  }

  static listarCeldas() {
    return this.celdas;
  }

  static obtenerCeldaPorId(id) {
    return this.celdas.find(c => c.id === id);
  }

  static actualizarEstadoCelda(id, nuevoEstado) {
    const celda = this.obtenerCeldaPorId(id);
    if (celda) {
      celda.setEstado(nuevoEstado);
      return celda;
    }
    return null;
  }
}

export default Celda;