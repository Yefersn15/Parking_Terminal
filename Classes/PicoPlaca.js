class PicoPlaca {
  static restricciones = [];

  constructor(id, tipo_vehiculo, numero, dia) {
    this.id = id;
    this.tipo_vehiculo = tipo_vehiculo;
    this.numero = numero;
    this.dia = dia;
  }

  // Getters
  getId() { return this.id; }
  getTipoVehiculo() { return this.tipo_vehiculo; }
  getNumero() { return this.numero; }
  getDia() { return this.dia; }

  // Setters
  setId(id) { this.id = id; }
  setTipoVehiculo(tipo_vehiculo) { this.tipo_vehiculo = tipo_vehiculo; }
  setNumero(numero) { this.numero = numero; }
  setDia(dia) { this.dia = dia; }

  // Métodos estáticos
  static insertarPicoPlaca(datos) {
    const picoPlaca = new PicoPlaca(
      datos.id, datos.tipo_vehiculo, datos.numero, datos.dia
    );
    
    this.restricciones.push(picoPlaca);
    return picoPlaca;
  }

  static listarRestricciones() {
    return this.restricciones;
  }

  static obtenerRestriccionPorId(id) {
    return this.restricciones.find(p => p.id === id);
  }
}

export default PicoPlaca;