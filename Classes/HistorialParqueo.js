class HistorialParqueo {
  static historiales = [];

  constructor(id, CELDA_id, VEHICULO_id, fecha_hora, fecha_salida = null) {
    this.id = id;
    this.CELDA_id = CELDA_id;
    this.VEHICULO_id = VEHICULO_id;
    this.fecha_hora = fecha_hora;
    this.fecha_salida = fecha_salida;
  }

  // Getters
  getId() { return this.id; }
  getCeldaId() { return this.CELDA_id; }
  getVehiculoId() { return this.VEHICULO_id; }
  getFechaHora() { return this.fecha_hora; }
  getFechaSalida() { return this.fecha_salida; }

  // Setters
  setId(id) { this.id = id; }
  setCeldaId(CELDA_id) { this.CELDA_id = CELDA_id; }
  setVehiculoId(VEHICULO_id) { this.VEHICULO_id = VEHICULO_id; }
  setFechaHora(fecha_hora) { this.fecha_hora = fecha_hora; }
  setFechaSalida(fecha_salida) { this.fecha_salida = fecha_salida; }

  // Métodos estáticos
  static insertarHistorial(datos) {
    const id = this.historiales.length > 0 
      ? Math.max(...this.historiales.map(h => h.id)) + 1 
      : 1;
    
    const historial = new HistorialParqueo(
      id, datos.CELDA_id, datos.VEHICULO_id, datos.fecha_hora, datos.fecha_salida
    );
    
    this.historiales.push(historial);
    return historial;
  }

  static listarHistoriales() {
    return this.historiales;
  }

  static obtenerHistorialPorId(id) {
    return this.historiales.find(h => h.id === id);
  }
}

export default HistorialParqueo;