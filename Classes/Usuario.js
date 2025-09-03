import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Usuario {
  static usuarios = [];
  static ultimoId = 0;

  constructor({ id, tipo_documento, numero_documento, nombre, correo, celular, tipo_usuario, estado }) {
    this.id = id;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.nombre = nombre;
    this.correo = correo;
    this.celular = celular;
    this.tipo_usuario = tipo_usuario;
    this.estado = estado || "Activo";
  }

  static async autenticarAdministrador(rl) {
    console.log("\n--- Autenticación Requerida ---");
    console.log("Se requiere autenticación de administrador para asignar roles privilegiados");

    const documento = await rl.question("Documento del administrador: ");
    const password = await rl.question("Contraseña: "); // En sistema real, esto se validaría contra hash

    // Buscar administrador válido
    const admin = Usuario.usuarios.find(u =>
      u.numero_documento === documento &&
      u.tipo_usuario === "administrador" &&
      u.estado === "Activo"
    );

    if (admin) {
      console.log("✅ Autenticación exitosa");
      return admin;
    }

    console.log("❌ Autenticación fallida o usuario no es administrador");
    return null;
  }

  static async formularioRegistro(rl) {
    console.log("--- Registro de Usuario ---");

    // Validar tipo de documento
    let tipo_documento;
    while (true) {
      tipo_documento = (await rl.question("Tipo documento (CC/TI/CE/PAS): ")).trim().toUpperCase();
      if (!tipo_documento) {
        console.log("❌ El tipo de documento es obligatorio.");
        continue;
      }
      if (["CC", "TI", "CE", "PAS"].includes(tipo_documento)) {
        break;
      }
      console.log("❌ Tipo de documento no válido. Use CC (Cédula), TI (Tarjeta de Identidad), CE (Cédula extranjería) o PAS (Pasaporte).");
    }

    // Validar número de documento (solo números)
    let numero_documento;
    while (true) {
      numero_documento = (await rl.question("Número documento: ")).trim();
      if (!numero_documento) {
        console.log("❌ El número de documento es obligatorio.");
        continue;
      }
      if (/^\d+$/.test(numero_documento)) {
        // Verificar si el documento ya existe
        const existe = Usuario.usuarios.some(u =>
          u.tipo_documento === tipo_documento && u.numero_documento === numero_documento
        );
        if (existe) {
          console.log("❌ Ya existe un usuario con este tipo y número de documento.");
          continue;
        }
        break;
      }
      console.log("❌ El número de documento solo puede contener dígitos.");
    }

    // Validar nombre (no vacío)
    let nombre;
    while (true) {
      nombre = (await rl.question("Nombre completo: ")).trim();
      if (!nombre) {
        console.log("❌ El nombre es obligatorio.");
        continue;
      }
      if (nombre.length < 3) {
        console.log("❌ El nombre debe tener al menos 3 caracteres.");
        continue;
      }
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/;
      if (!nombreRegex.test(nombre)) {
        console.log("❌ El nombre solo puede contener letras, espacios, guiones y apóstrofes.");
        continue;
      }
      break;
    }

    // Validar correo electrónico
    let correo;
    while (true) {
      correo = (await rl.question("Correo: ")).trim();
      if (!correo) {
        console.log("❌ El correo es obligatorio.");
        continue;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(correo)) {
        const existe = Usuario.usuarios.some(u => u.correo === correo);
        if (existe) {
          console.log("❌ Ya existe un usuario con este correo electrónico.");
          continue;
        }
        break;
      }
      console.log("❌ Formato de correo electrónico no válido.");
    }

    // Validar celular (solo números, 10 dígitos)
    let celular;
    while (true) {
      celular = (await rl.question("Celular (10 dígitos): ")).trim();
      if (!celular) {
        console.log("❌ El celular es obligatorio.");
        continue;
      }
      if (/^\d{10}$/.test(celular)) {
        break;
      }
      console.log("❌ El celular debe tener exactamente 10 dígitos numéricos.");
    }

    // Validar tipo de usuario - SOLO administradores pueden asignar roles
    let tipo_usuario = "usuario"; // Valor por defecto

    // Preguntar si se quiere asignar un rol diferente
    const asignarRol = (await rl.question("¿Desea asignar un rol diferente a 'usuario'? (si/no) [no]: ")).trim().toLowerCase();

    if (asignarRol === "si" || asignarRol === "sí") {
      // Requerir autenticación de administrador
      const admin = await Usuario.autenticarAdministrador(rl);

      if (admin) {
        // Solo administradores autenticados pueden elegir el tipo de usuario
        while (true) {
          tipo_usuario = (await rl.question("Tipo usuario (administrador/operador/usuario): ")).trim().toLowerCase();
          if (!tipo_usuario) {
            tipo_usuario = "usuario";
            break;
          }
          if (["administrador", "operador", "usuario"].includes(tipo_usuario)) {
            break;
          }
          console.log("❌ Tipo de usuario no válido. Use: administrador, operador o usuario.");
        }
      } else {
        console.log("⚠️  No se pudo autenticar, se asignará rol: usuario");
      }
    }

    Usuario.ultimoId++;
    const usuario = new Usuario({
      id: Usuario.ultimoId,
      tipo_documento,
      numero_documento,
      nombre,
      correo,
      celular,
      tipo_usuario,
      estado: "Activo"
    });

    Usuario.usuarios.push(usuario);
    console.log("✅ Usuario registrado exitosamente!");
    return usuario;
  }

  static listarUsuarios() {
    return Usuario.usuarios;
  }
}

export default Usuario;