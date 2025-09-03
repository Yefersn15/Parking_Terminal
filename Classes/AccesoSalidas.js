class AccesoSalidas {
  static accesos = [];

  constructor(id, movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id) {
    this.id = id;
    this.movimiento = movimiento;
    this.fecha_hora = fecha_hora;
    this.puerta = puerta;
    this.tiempo_estadia = tiempo_estadia;
    this.VEHICULO_id = VEHICULO_id;
  }

  // Getters
  getId() { return this.id; }
  getMovimiento() { return this.movimiento; }
  getFechaHora() { return this.fecha_hora; }
  getPuerta() { return this.puerta; }
  getTiempoEstadia() { return this.tiempo_estadia; }
  getVehiculoId() { return this.VEHICULO_id; }

  // Setters
  setId(id) { this.id = id; }
  setMovimiento(movimiento) { this.movimiento = movimiento; }
  setFechaHora(fecha_hora) { this.fecha_hora = fecha_hora; }
  setPuerta(puerta) { this.puerta = puerta; }
  setTiempoEstadia(tiempo_estadia) { this.tiempo_estadia = tiempo_estadia; }
  setVehiculoId(VEHICULO_id) { this.VEHICULO_id = VEHICULO_id; }

  // Métodos estáticos
  static insertarAcceso(datos) {
    const acceso = new AccesoSalidas(
      datos.id, datos.movimiento, datos.fecha_hora, 
      datos.puerta, datos.tiempo_estadia, datos.VEHICULO_id
    );
    
    this.accesos.push(acceso);
    return acceso;
  }

  static listarAccesos() {
    return this.accesos;
  }

  static obtenerAccesoPorId(id) {
    return this.accesos.find(a => a.id === id);
  }
}

export default AccesoSalidas;