class ReporteIncidencia {
  static reportes = [];

  constructor(id, VEHICULO_id, INCIDENCIA_id, fecha_hora) {
    this.id = id;
    this.VEHICULO_id = VEHICULO_id;
    this.INCIDENCIA_id = INCIDENCIA_id;
    this.fecha_hora = fecha_hora;
  }

  // Getters
  getId() { return this.id; }
  getVehiculoId() { return this.VEHICULO_id; }
  getIncidenciaId() { return this.INCIDENCIA_id; }
  getFechaHora() { return this.fecha_hora; }

  // Setters
  setId(id) { this.id = id; }
  setVehiculoId(VEHICULO_id) { this.VEHICULO_id = VEHICULO_id; }
  setIncidenciaId(INCIDENCIA_id) { this.INCIDENCIA_id = INCIDENCIA_id; }
  setFechaHora(fecha_hora) { this.fecha_hora = fecha_hora; }

  // Métodos estáticos
  static insertarReporte(datos) {
    const id = this.reportes.length > 0 
      ? Math.max(...this.reportes.map(r => r.id)) + 1 
      : 1;
    
    const reporte = new ReporteIncidencia(
      id, datos.VEHICULO_id, datos.INCIDENCIA_id, datos.fecha_hora
    );
    
    this.reportes.push(reporte);
    return reporte;
  }

  static listarReportes() {
    return this.reportes;
  }

  static obtenerReportePorId(id) {
    return this.reportes.find(r => r.id === id);
  }
}

export default ReporteIncidencia;