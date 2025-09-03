import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import Usuario from './Classes/Usuario.js';
import Vehiculo from './Classes/Vehiculo.js';
import Celda from './Classes/Celda.js';
import HistorialParqueo from './Classes/HistorialParqueo.js';
import Incidencia from './Classes/Incidencia.js';
import PerfilUsuario from './Classes/PerfilUsuario.js';
import PicoPlaca from './Classes/PicoPlaca.js';
import ReporteIncidencia from './Classes/ReporteIncidencia.js';
import AccesoSalidas from './Classes/AccesoSalidas.js';

class ParkingSystem {
  constructor() {
    this.rl = readline.createInterface({ input, output });
    this.usuarioActual = null;
    this.claves = new Map(); // numero_documento -> contraseña

    this.inicializarDatos();
  }

  inicializarDatos() {
    // Perfiles parametrizados (REQ-USR-1)
    PerfilUsuario.insertarPerfil({ id: 1, perfil: "administrador" });
    PerfilUsuario.insertarPerfil({ id: 2, perfil: "operador" });
    PerfilUsuario.insertarPerfil({ id: 3, perfil: "usuario" });

    // Usuario administrador por defecto (REQ-USR-2)
    const admin = new Usuario({
      id: 1,
      tipo_documento: "CC",
      numero_documento: "1001",
      nombre: "Admin",
      correo: "admin@parking.local",
      celular: "3000000000",
      tipo_usuario: "administrador",
      estado: "Activo"
    });
    Usuario.usuarios.push(admin);
    Usuario.ultimoId = Math.max(Usuario.ultimoId, admin.id);
    this.claves.set(admin.numero_documento, "admin123"); // REQ-USR-7

    // Celdas iniciales con área/piso (REQ-CLD-01)
    for (let i = 1; i <= 20; i++) {
      const tipo = i <= 15 ? "carro" : "moto";
      const area = i <= 10 ? "Piso 1" : "Piso 2";
      Celda.insertarCelda({ id: i, tipo, estado: "disponible", area });
    }

    // Tipos de incidencias (REQ-INCD-1)
    ["Rayones", "Choques", "Atropellamientos", "Golpes contra muros"].forEach((n, idx) => {
      Incidencia.insertarIncidencia({ id: idx + 1, nombre: n });
    });
  }

  async iniciar() {
    while (true) {
      await this.login();
      await this.menuPrincipal();
    }
  }

  // --- Autenticación ---
  async login() {
    console.log("\n--- Login ---");
    const doc = await this.rl.question("Número de documento: ");
    const user = Usuario.usuarios.find(u => u.numero_documento === doc);

    if (!user) {
      console.log("No existe usuario. ¿Desea registrarse como usuario (sí/no)?");
      const resp = (await this.rl.question("> ")).toLowerCase();
      if (resp.startsWith("s")) {
        const nuevo = await Usuario.formularioRegistro(this.rl); // REQ-USR-2 (operador/admin en menú también pueden crear)
        this.usuarioActual = nuevo;
        return;
      } else {
        return await this.login();
      }
    }

    // REQ-USR-7/8
    if (user.tipo_usuario === "administrador" || user.tipo_usuario === "operador") {
      const pass = await this.rl.question("Contraseña: ");
      const ok = this.claves.get(user.numero_documento) === pass;
      if (!ok) {
        console.log("Contraseña incorrecta.");
        return await this.login();
      }
    }
    if (user.estado !== "Activo") {
      console.log("Usuario inactivo. Contacte al administrador.");
      return await this.login();
    }
    this.usuarioActual = user;
  }

async menuPrincipal() {
  while (this.usuarioActual) {
    console.log("\n--- Menú Principal ---");
    switch (this.usuarioActual.tipo_usuario) {
      case "administrador":
        await this.menuAdministrador();
        break;
      case "operador":
        await this.menuOperador();
        break;
      case "usuario":
        await this.menuUsuario();
        break;
      default:
        console.log("Tipo de usuario no reconocido.");
        this.usuarioActual = null;
    }
  }
}

async menuAdministrador() {
  let salir = false;
  
  while (!salir && this.usuarioActual) {
    console.log("\n--- Menú Administrador ---");
    console.log("1. Gestión de Usuarios");
    console.log("2. Gestión de Vehículos");
    console.log("3. Gestión de Celdas");
    console.log("4. Accesos/Salidas");
    console.log("5. Incidencias");
    console.log("6. Gestión Pico y Placa");
    console.log("7. Reportes");
    console.log("8. Cerrar Sesión");

    const opcion = await this.rl.question("Seleccione una opción: ");
    switch (opcion) {
      case "1": await this.gestionUsuarios(); break;
      case "2": await this.gestionVehiculos(true); break; // true => admin
      case "3": await this.gestionCeldas(); break;
      case "4": await this.registrarEntradaSalida(); break;
      case "5": await this.registrarIncidencia(); break;
      case "6": await this.gestionPicoPlaca(); break;
      case "7": await this.menuReportes(); break;
      case "8": 
        this.usuarioActual = null; 
        salir = true;
        console.log("Sesión cerrada."); 
        break;
      default: console.log("Opción no válida.");
    }
  }
}

async menuOperador() {
  let salir = false;
  
  while (!salir && this.usuarioActual) {
    console.log("\n--- Menú Operador ---");
    console.log("1. Registrar Entrada/Salida");
    console.log("2. Registrar Incidencia");
    console.log("3. Ver/Actualizar Celdas");
    console.log("4. Crear vehículo (asignado a su propietario)");
    console.log("5. Gestión de Pico y Placa");
    console.log("6. Crear usuario");
    console.log("7. Cerrar Sesión");

    const opcion = await this.rl.question("Seleccione una opción: ");
    switch (opcion) {
      case "1": await this.registrarEntradaSalida(); break;
      case "2": await this.registrarIncidencia(); break;
      case "3": await this.gestionCeldas(); break;
      case "4": await this.crearVehiculo(); break; // REQ-USR-6, REQ-CAR-1
      case "5": await this.gestionPicoPlaca(); break; // REQ-CAR-4
      case "6": await this.crearUsuario(); break; // REQ-USR-2
      case "7": 
        this.usuarioActual = null; 
        salir = true;
        console.log("Sesión cerrada."); 
        break;
      default: console.log("Opción no válida.");
    }
  }
}

async menuUsuario() {
  let salir = false;
  
  while (!salir && this.usuarioActual) {
    console.log("\n--- Menú Usuario ---");
    console.log("1. Ver Celdas");
    console.log("2. Actualizar Mis Datos");
    console.log("3. Cerrar Sesión");
    
    const opcion = await this.rl.question("Seleccione una opción: ");
    switch (opcion) {
      case "1": await this.verCeldas(); break;
      case "2": await this.actualizarMisDatos(); break; // REQ-USR-4
      case "3": 
        this.usuarioActual = null; 
        salir = true;
        console.log("Sesión cerrada."); 
        break;
      default: console.log("Opción no válida.");
    }
  }
}

  // --- Usuarios ---
async gestionUsuarios() {
  let salir = false;
  
  while (!salir) {
    console.log("\n--- Gestión de Usuarios ---");
    console.log("1. Crear usuario");
    console.log("2. Listar usuarios");
    console.log("3. Actualizar estado (activo/inactivo)");
    console.log("4. Actualizar datos de usuario");
    console.log("5. Volver al menú principal");

    const opcion = await this.rl.question("Seleccione una opción: ");
    switch (opcion) {
      case "1": await this.crearUsuario(); break;
      case "2": this.listarUsuarios(); break;
      case "3": await this.actualizarEstadoUsuario(); break; // REQ-USR-3
      case "4": await this.actualizarDatosUsuario(); break; // REQ-USR-5
      case "5": salir = true; break;
      default: console.log("Opción no válida.");
    }
  }
}

  async crearUsuario() {
    const u = await Usuario.formularioRegistro(this.rl);
    // Si es admin/operador, asignar contraseña inicial
    if (u.tipo_usuario !== "usuario") {
      const pass = await this.rl.question("Asignar contraseña inicial: ");
      this.claves.set(u.numero_documento, pass || "123456");
    }
    console.log("Usuario creado con ID:", u.id);
  }

  listarUsuarios() {
    console.log("\n--- Usuarios ---");
    Usuario.usuarios.forEach(u => {
      console.log(`ID:${u.id} Doc:${u.numero_documento} Nombre:${u.nombre} Tipo:${u.tipo_usuario} Estado:${u.estado}`);
    });
  }

  async actualizarEstadoUsuario() { // REQ-USR-3
    this.listarUsuarios();
    const id = parseInt(await this.rl.question("ID del usuario a cambiar estado: "));
    const u = Usuario.usuarios.find(x => x.id === id);
    if (!u) return console.log("No encontrado.");
    u.estado = (u.estado === "Activo") ? "Inactivo" : "Activo";
    console.log(`Nuevo estado: ${u.estado}`);
  }

  async actualizarDatosUsuario() { // REQ-USR-5
    this.listarUsuarios();
    const id = parseInt(await this.rl.question("ID del usuario a actualizar: "));
    const u = Usuario.usuarios.find(x => x.id === id);
    if (!u) return console.log("No encontrado.");
    const nombre = await this.rl.question(`Nombre (${u.nombre}): `);
    const correo = await this.rl.question(`Correo (${u.correo}): `);
    const celular = await this.rl.question(`Celular (${u.celular}): `);
    const tipo = await this.rl.question(`Tipo (${u.tipo_usuario}) [administrador/operador/usuario]: `);
    if (nombre) u.nombre = nombre;
    if (correo) u.correo = correo;
    if (celular) u.celular = celular;
    if (tipo && ["administrador", "operador", "usuario"].includes(tipo)) u.tipo_usuario = tipo;
    console.log("Datos actualizados.");
  }

  async actualizarMisDatos() { // REQ-USR-4
    const u = this.usuarioActual;
    const nombre = await this.rl.question(`Nombre (${u.nombre}): `);
    const correo = await this.rl.question(`Correo (${u.correo}): `);
    const celular = await this.rl.question(`Celular (${u.celular}): `);
    if (nombre) u.nombre = nombre;
    if (correo) u.correo = correo;
    if (celular) u.celular = celular;
    console.log("Tus datos fueron actualizados. (Notificación enviada al administrador)");
  }

  // --- Vehículos ---
async gestionVehiculos(esAdmin = false) {
  let salir = false;
  
  while (!salir) {
    console.log("\n--- Gestión de Vehículos ---");
    console.log("1. Crear vehículo");
    console.log("2. Listar vehículos");
    if (esAdmin) {
      console.log("3. Actualizar datos de vehículo (solo admin)");
      console.log("4. Reasignar vehículo a otro usuario (solo admin)");
      console.log("5. Volver al menú principal");
    } else {
      console.log("3. Volver al menú principal");
    }
    
    const opcion = await this.rl.question("Seleccione una opción: ");
    if (esAdmin) {
      switch (opcion) {
        case "1": await this.crearVehiculo(); break; // REQ-CAR-1
        case "2": this.listarVehiculos(); break;
        case "3": await this.actualizarVehiculo(); break; // REQ-CAR-2
        case "4": await this.reasignarVehiculo(); break; // REQ-CAR-3
        case "5": salir = true; break;
        default: console.log("Opción no válida.");
      }
    } else {
      switch (opcion) {
        case "1": await this.crearVehiculo(); break; // REQ-USR-6
        case "2": this.listarVehiculos(); break;
        case "3": salir = true; break;
        default: console.log("Opción no válida.");
      }
    }
  }
}

  async crearVehiculo() {
    this.listarUsuarios();
    const usuarioId = parseInt(await this.rl.question("ID del dueño del vehículo: "));
    const u = Usuario.usuarios.find(x => x.id === usuarioId);
    if (!u) return console.log("Usuario no válido.");
    const v = await Vehiculo.formularioRegistro(usuarioId, this.rl);
    console.log("Vehículo creado con ID:", v.id);
  }

  listarVehiculos() {
    console.log("\n--- Vehículos ---");
    Vehiculo.vehiculos.forEach(v => {
      const dueno = Usuario.usuarios.find(u => u.id === v.usuarioId);
      console.log(`ID:${v.id} Placa:${v.placa} Tipo:${v.tipo} Color:${v.color} Marca:${v.marca} Modelo:${v.modelo} Dueño:${dueno ? dueno.nombre : 'N/A'}`);
    });
  }

  async actualizarVehiculo() { // REQ-CAR-2
    this.listarVehiculos();
    const id = parseInt(await this.rl.question("ID del vehículo a actualizar: "));
    const v = Vehiculo.vehiculos.find(x => x.id === id);
    if (!v) return console.log("No encontrado.");
    const color = await this.rl.question(`Color (${v.color}): `);
    const marca = await this.rl.question(`Marca (${v.marca}): `);
    const modelo = await this.rl.question(`Modelo (${v.modelo}): `);
    if (color) v.color = color;
    if (marca) v.marca = marca;
    if (modelo) v.modelo = modelo;
    console.log("Vehículo actualizado.");
  }

  async reasignarVehiculo() { // REQ-CAR-3
    this.listarVehiculos();
    const id = parseInt(await this.rl.question("ID del vehículo a reasignar: "));
    const v = Vehiculo.vehiculos.find(x => x.id === id);
    if (!v) return console.log("No encontrado.");
    this.listarUsuarios();
    const nuevoDueno = parseInt(await this.rl.question("ID del nuevo propietario: "));
    const u = Usuario.usuarios.find(x => x.id === nuevoDueno);
    if (!u) return console.log("Usuario inválido.");
    v.usuarioId = u.id;
    console.log("Vehículo reasignado.");
  }

  // --- Celdas ---
async gestionCeldas() {
  let salir = false;
  
  while (!salir) {
    console.log("\n--- Celdas ---");
    console.log("1. Ver celdas");
    console.log("2. Cambiar estado celda");
    console.log("3. Volver al menú principal");
    
    const op = await this.rl.question("Opción: ");
    switch (op) {
      case "1": await this.verCeldas(); break; // REQ-CLD-01/02
      case "2": await this.actualizarEstadoCelda(); break; // REQ-CLD-03
      case "3": salir = true; break;
      default: console.log("Opción no válida.");
    }
  }
}

  async verCeldas() { // REQ-CLD-01/02
    console.log("\n--- Estado de Celdas ---");
    const area = await this.rl.question("Filtrar por área (enter para todas): ");
    const estado = await this.rl.question("Filtrar por estado (disponible/ocupado, enter para ambos): ");
    const celdas = Celda.listarCeldas().filter(c =>
      (area ? c.area.toLowerCase() === area.toLowerCase() : true) &&
      (estado ? c.estado.toLowerCase() === estado.toLowerCase() : true)
    );
    celdas.forEach(c => console.log(`ID:${c.id} Tipo:${c.tipo} Estado:${c.estado} Área:${c.area}`));
  }

  async actualizarEstadoCelda() { // REQ-CLD-03
    const id = parseInt(await this.rl.question("ID de la celda: "));
    const celda = Celda.obtenerCeldaPorId(id);
    if (!celda) return console.log("Celda no válida.");
    const nuevoEstado = await this.rl.question("Nuevo estado (disponible/ocupado): ");
    if (!["disponible", "ocupado"].includes(nuevoEstado)) return console.log("Estado inválido.");
    Celda.actualizarEstadoCelda(id, nuevoEstado);
    if (nuevoEstado === "ocupado") {
      this.listarVehiculos();
      const vehiculoId = parseInt(await this.rl.question("ID del vehículo que ocupa la celda: "));
      const vehiculo = Vehiculo.vehiculos.find(v => v.id === vehiculoId);
      if (!vehiculo) return console.log("Vehículo no válido.");
      HistorialParqueo.insertarHistorial({ CELDA_id: id, VEHICULO_id: vehiculoId, fecha_hora: new Date() });
    } else {
      // cerrar historial activo de la celda si existe
      const activo = HistorialParqueo.historiales.find(h => h.CELDA_id === id && h.fecha_salida === null);
      if (activo) activo.setFechaSalida(new Date());
    }
    console.log("Estado de celda actualizado.");
  }

  // --- Entradas y salidas ---
  async registrarEntradaSalida() {
    console.log("\n1. Registrar ENTRADA");
    console.log("2. Registrar SALIDA");
    const op = await this.rl.question("Opción: ");
    if (op === "1") return await this.registrarEntrada();
    if (op === "2") return await this.registrarSalida();
    console.log("Opción no válida.");
  }

  cumplePicoYPlaca(placa, tipoVehiculo, diaSemana) {
    const reglas = PicoPlaca.restricciones.filter(r => r.tipo_vehiculo.toLowerCase() === tipoVehiculo.toLowerCase()
      && r.dia.toLowerCase() === diaSemana.toLowerCase());
    if (reglas.length === 0) return true;
    const ultimo = placa.slice(-1);
    return !reglas.some(r => r.numero.split(",").map(s => s.trim()).includes(ultimo));
  }

  async registrarEntrada() { // REQ-INEX-1 + REQ-INEX-4
    const puerta = await this.rl.question("Puerta de acceso: ");
    this.listarVehiculos();
    const vehiculoId = parseInt(await this.rl.question("ID del vehículo: "));
    const vehiculo = Vehiculo.vehiculos.find(v => v.id === vehiculoId);
    if (!vehiculo) return console.log("Vehículo no válido.");
    const now = new Date();
    const diaSemana = now.toLocaleDateString('es-CO', { weekday: 'long' });
    if (!this.cumplePicoYPlaca(vehiculo.placa, vehiculo.tipo, diaSemana)) {
      console.log("Acceso denegado por pico y placa."); // REQ-INEX-4
      return;
    }
    AccesoSalidas.insertarAcceso({
      id: AccesoSalidas.accesos.length + 1,
      movimiento: "entrada",
      fecha_hora: now,
      puerta,
      tiempo_estadia: 0,
      VEHICULO_id: vehiculoId
    });
    console.log("Entrada registrada.");
  }

  async registrarSalida() { // REQ-INEX-2/3
    const puerta = await this.rl.question("Puerta de salida: ");
    this.listarVehiculos();
    const vehiculoId = parseInt(await this.rl.question("ID del vehículo: "));
    const vehiculo = Vehiculo.vehiculos.find(v => v.id === vehiculoId);
    if (!vehiculo) return console.log("Vehículo no válido.");
    const now = new Date();

    // encontrar última entrada
    const ultimaEntrada = [...AccesoSalidas.accesos].reverse().find(a => a.VEHICULO_id === vehiculoId && a.movimiento === "entrada");
    if (!ultimaEntrada) return console.log("No hay entrada previa registrada.");
    const estadiaMin = Math.round((now - new Date(ultimaEntrada.fecha_hora)) / 60000);

    AccesoSalidas.insertarAcceso({
      id: AccesoSalidas.accesos.length + 1,
      movimiento: "salida",
      fecha_hora: now,
      puerta,
      tiempo_estadia: estadiaMin,
      VEHICULO_id: vehiculoId
    });
    console.log(`Salida registrada. Tiempo de estadía: ${estadiaMin} min.`);
  }

  // --- Incidencias --- // REQ-INCD-1
  async registrarIncidencia() { 
    console.log("\n--- Registrar Incidencia ---");
    this.listarVehiculos();
    const vehiculoId = parseInt(await this.rl.question("ID del vehículo afectado: "));
    const v = Vehiculo.vehiculos.find(x => x.id === vehiculoId);
    if (!v) return console.log("Vehículo no válido.");
    console.log("Tipos de incidencia:");
    Incidencia.incidencias.forEach(i => console.log(`${i.id}. ${i.nombre}`));
    const incId = parseInt(await this.rl.question("Seleccione tipo: "));
    const inc = Incidencia.incidencias.find(i => i.id === incId);
    if (!inc) return console.log("Incidencia no válida.");
    const rep = ReporteIncidencia.insertarReporte({ VEHICULO_id: v.id, INCIDENCIA_id: inc.id, fecha_hora: new Date() });
    console.log("Incidencia registrada con código:", rep.id);
  }

  // --- Pico y Placa ---  // REQ-CAR-4
  async gestionPicoPlaca() {
    let salir = false;

    while (!salir) {
      console.log("\n--- Pico y Placa ---");
      console.log("1. Agregar regla");
      console.log("2. Listar reglas");
      console.log("3. Volver al menú principal");

      const op = await this.rl.question("Opción: ");
      switch (op) {
        case "1":
          const tipo = await this.rl.question("Tipo de vehículo (carro/moto): ");
          const numero = await this.rl.question("Números restringidos (separados por coma, ej: 1,2,3): ");
          const dia = await this.rl.question("Día (ej: lunes): ");
          PicoPlaca.insertarPicoPlaca({ id: PicoPlaca.restricciones.length + 1, tipo_vehiculo: tipo, numero, dia });
          console.log("Regla agregada.");
          break;
        case "2":
          PicoPlaca.restricciones.forEach(r => console.log(`ID:${r.id} Tipo:${r.tipo_vehiculo} Números:${r.numero} Día:${r.dia}`));
          break;
        case "3": salir = true; break;
        default: console.log("Opción no válida.");
      }
    }
  }

  // --- Reportes (REQ-REP-01 .. REQ-REP-10) ---
async menuReportes() {
  let salir = false;
  
  while (!salir) {
    console.log("\n--- Reportes ---");
    console.log("1. Listado de usuarios"); // REQ-REP-01
    console.log("2. Listado de vehículos"); // REQ-REP-02
    console.log("3. Entradas al parqueadero"); // REQ-REP-03
    console.log("4. Salidas del parqueadero"); // REQ-REP-04
    console.log("5. Incidencias"); // REQ-REP-05
    console.log("6. Vehículos restringidos por día"); // REQ-REP-06
    console.log("7. Celdas ocupadas por día"); // REQ-REP-07
    console.log("8. Celdas más usadas"); // REQ-REP-08
    console.log("9. Vehículos que más usan"); // REQ-REP-09
    console.log("10. Horas y días de mayor ocupación"); // REQ-REP-10
    console.log("11. Volver al menú principal");
    
    const opcion = await this.rl.question("Seleccione una opción: ");
    switch (opcion) {
      case "1": this.listarUsuarios(); break; // REQ-REP-01
      case "2": this.listarVehiculos(); break; // REQ-REP-02
      case "3": this.reporteEntradas(); break; // REQ-REP-03
      case "4": this.reporteSalidas(); break; // REQ-REP-04
      case "5": this.reporteIncidencias(); break; // REQ-REP-05
      case "6": await this.reporteVehiculosRestringidos(); break; // REQ-REP-06
      case "7": await this.reporteCeldasOcupadas(); break; // REQ-REP-07
      case "8": await this.reporteCeldasMasUsadas(); break; // REQ-REP-08
      case "9": await this.reporteVehiculosQueMasUsan(); break; // REQ-REP-09
      case "10": await this.reporteHorasDiasMasOcupado(); break; // REQ-REP-10
      case "11": salir = true; break;
      default: console.log("Opción no válida.");
    }
  }
}

  reporteEntradas() {
    console.log("\n--- Entradas ---");
    AccesoSalidas.accesos.filter(a => a.movimiento === "entrada").forEach(a => {
      const v = Vehiculo.vehiculos.find(x => x.id === a.VEHICULO_id);
      console.log(`${a.id}. ${a.fecha_hora} Puerta:${a.puerta} Vehículo:${v ? v.placa : a.VEHICULO_id}`);
    });
  }

  reporteSalidas() {
    console.log("\n--- Salidas ---");
    AccesoSalidas.accesos.filter(a => a.movimiento === "salida").forEach(a => {
      const v = Vehiculo.vehiculos.find(x => x.id === a.VEHICULO_id);
      console.log(`${a.id}. ${a.fecha_hora} Puerta:${a.puerta} Vehículo:${v ? v.placa : a.VEHICULO_id} Estadia(min):${a.tiempo_estadia}`);
    });
  }

  reporteIncidencias() {
    console.log("\n--- Incidencias ---");
    ReporteIncidencia.reportes.forEach(r => {
      const v = Vehiculo.vehiculos.find(x => x.id === r.VEHICULO_id);
      const inc = Incidencia.incidencias.find(i => i.id === r.INCIDENCIA_id);
      console.log(`${r.id}. ${r.fecha_hora} Vehículo:${v ? v.placa : r.VEHICULO_id} Tipo:${inc ? inc.nombre : r.INCIDENCIA_id}`);
    });
  }

  async reporteVehiculosRestringidos() { // REQ-REP-06
    const dia = await this.rl.question("Día a consultar (ej: lunes): ");
    const reglas = PicoPlaca.restricciones.filter(r => r.dia.toLowerCase() === dia.toLowerCase());
    if (reglas.length === 0) return console.log("Sin reglas para ese día.");
    let total = 0;
    reglas.forEach(r => {
      const nums = r.numero.split(",").map(s => s.trim());
      const afectados = Vehiculo.vehiculos.filter(v => v.tipo.toLowerCase() === r.tipo_vehiculo.toLowerCase() && nums.includes(v.placa.slice(-1)));
      total += afectados.length;
      console.log(`Tipo:${r.tipo_vehiculo} Números:${r.numero} Afectados registrados:${afectados.length}`);
    });
    console.log(`TOTAL afectados el ${dia}: ${total}`);
  }

  async reporteCeldasOcupadas() { // REQ-REP-07
    const fechaStr = await this.rl.question("Fecha (YYYY-MM-DD): ");
    const fechaConsulta = new Date(fechaStr);
    if (isNaN(fechaConsulta)) return console.log("Fecha no válida.");
    const celdasOcupadas = HistorialParqueo.historiales.filter(h => {
      const f = new Date(h.fecha_hora);
      return f.toDateString() === fechaConsulta.toDateString();
    });
    console.log(`Celdas ocupadas el ${fechaConsulta.toDateString()}: ${celdasOcupadas.length}`);
    celdasOcupadas.forEach(h => {
      const celda = Celda.obtenerCeldaPorId(h.CELDA_id);
      const vehiculo = Vehiculo.vehiculos.find(v => v.id === h.VEHICULO_id);
      console.log(`Celda:${celda ? celda.id : h.CELDA_id} (${celda ? celda.tipo : 'N/A'}) Vehículo:${vehiculo ? vehiculo.placa : 'N/A'}`);
    });
  }

  async reporteCeldasMasUsadas() { // REQ-REP-08
    const desde = new Date(await this.rl.question("Desde (YYYY-MM-DD): "));
    const hasta = new Date(await this.rl.question("Hasta (YYYY-MM-DD): "));
    if (isNaN(desde) || isNaN(hasta) || hasta < desde) return console.log("Rango inválido.");
    const conteo = new Map();
    HistorialParqueo.historiales.forEach(h => {
      const fh = new Date(h.fecha_hora);
      if (fh >= desde && fh <= hasta) conteo.set(h.CELDA_id, (conteo.get(h.CELDA_id) || 0) + 1);
    });
    [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([celdaId, usos], i) => {
      const c = Celda.obtenerCeldaPorId(celdaId);
      console.log(`${i + 1}. Celda ${celdaId} (${c ? c.tipo : 'N/A'}, Área:${c ? c.area : 'N/A'}) — usos: ${usos}`);
    });
  }

  async reporteVehiculosQueMasUsan() { // REQ-REP-09
    const entradas = AccesoSalidas.accesos.filter(a => a.movimiento === "entrada");
    const conteo = new Map();
    entradas.forEach(e => conteo.set(e.VEHICULO_id, (conteo.get(e.VEHICULO_id) || 0) + 1));
    [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([vehiculoId, usos], i) => {
      const v = Vehiculo.vehiculos.find(v => v.id === vehiculoId);
      console.log(`${i + 1}. ${v ? v.placa : 'ID ' + vehiculoId} — entradas: ${usos}`);
    });
  }

  async reporteHorasDiasMasOcupado() { // REQ-REP-10
    const buckets = new Map(); // YYYY-MM-DD HH -> count
    HistorialParqueo.historiales.forEach(h => {
      const start = new Date(h.fecha_hora);
      const end = h.fecha_salida ? new Date(h.fecha_salida) : new Date();
      // recorre por horas
      let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours());
      while (cur <= end) {
        const key = cur.toISOString().slice(0, 13); // YYYY-MM-DDTHH
        buckets.set(key, (buckets.get(key) || 0) + 1);
        cur = new Date(cur.getTime() + 60 * 60 * 1000);
      }
    });
    if (buckets.size === 0) return console.log("Sin datos.");
    const [key, max] = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0];
    const fecha = key.replace("T", " ");
    console.log(`Pico de ocupación: ${max} celdas alrededor de ${fecha}:00`);
    const porDia = new Map();
    for (const [k, v] of buckets) {
      const d = new Date(k + ":00:00Z");
      const dow = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][d.getUTCDay()];
      porDia.set(dow, (porDia.get(dow) || 0) + v);
    }
    const diaTop = [...porDia.entries()].sort((a, b) => b[1] - a[1])[0];
    if (diaTop) console.log(`Día con mayor ocupación acumulada: ${diaTop[0]}`);
  }
}

// Iniciar la aplicación
const parkingSystem = new ParkingSystem();
parkingSystem.iniciar();