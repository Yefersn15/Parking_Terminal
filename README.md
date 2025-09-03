Aquí tienes el README completo convertido en código para que lo copies y pegues directamente en tu archivo `README.md`:

````markdown
# 🅿️ Sistema de Gestión de Parqueadero

Un sistema completo de gestión de parqueaderos desarrollado en Node.js que permite administrar usuarios, vehículos, celdas de estacionamiento, control de accesos y generación de reportes.

## ✨ Características Principales

### 👥 Gestión de Usuarios
- **Tres tipos de usuarios**: Administrador, Operador y Usuario
- **Registro y autenticación** con validación de documentos
- **Estados de usuario**: Activo/Inactivo
- **Actualización de datos** personales

### 🚗 Gestión de Vehículos
- **Registro de vehículos** (carros y motos)
- **Asignación a propietarios**
- **Validación de Pico y Placa**
- **Actualización y reasignación** de vehículos

### 🅿️ Gestión de Celdas
- **20 celdas iniciales** (15 para carros, 5 para motos)
- **Dos áreas**: Piso 1 y Piso 2
- **Estados**: Disponible/Ocupado
- **Filtrado por área y estado**

### 🔐 Control de Accesos
- **Registro de entradas y salidas**
- **Validación de Pico y Placa** en tiempo real
- **Cálculo automático** de tiempo de estadía
- **Control por puertas** específicas

### 📊 Reportes
- **Listados completos** de usuarios y vehículos
- **Historial de entradas y salidas**
- **Reporte de incidencias**
- **Estadísticas de uso** (celdas más usadas, horarios pico, etc.)
- **Vehículos restringidos** por día

### ⚠️ Sistema de Incidencias
- **Tipos predefinidos**: Rayones, Choques, Atropellamientos, Golpes
- **Registro de incidentes** con vehículos afectados
- **Seguimiento completo** de reportes

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd parking-system

# Instalar dependencias
npm install
````

### Ejecución

```bash
# Iniciar la aplicación
node ParkingSystem.js
```

## 👤 Usuario por Defecto

El sistema incluye un usuario administrador por defecto:

* **Documento**: 1001
* **Contraseña**: admin123
* **Correo**: [admin@parking.local](mailto:admin@parking.local)

## 📋 Estructura del Proyecto

```
parking-system/
├── Classes/
│   ├── Usuario.js          # Gestión de usuarios
│   ├── Vehiculo.js         # Gestión de vehículos
│   ├── Celda.js            # Gestión de celdas
│   ├── HistorialParqueo.js # Historial de parqueo
│   ├── Incidencia.js       # Tipos de incidencias
│   ├── PerfilUsuario.js    # Perfiles de usuario
│   ├── PicoPlaca.js        # Reglas de pico y placa
│   ├── ReporteIncidencia.js # Reportes de incidencias
│   └── AccesoSalidas.js    # Control de accesos
├── ParkingSystem.js        # Aplicación principal
└── README.md
```

## 🎯 Funcionalidades por Rol

### Administrador

* Gestión completa de usuarios
* Gestión de vehículos
* Administración de celdas
* Control de accesos y salidas
* Registro de incidencias
* Configuración de Pico y Placa
* Generación de todos los reportes

### Operador

* Registrar entradas/salidas
* Reportar incidencias
* Ver/actualizar celdas
* Crear vehículos
* Gestión de Pico y Placa
* Crear usuarios

### Usuario

* Ver estado de celdas
* Actualizar sus datos personales

## 🔧 Tecnologías Utilizadas

* **Node.js** - Entorno de ejecución
* **readline/promises** - Interfaz de línea de comandos
* **Programación Orientada a Objetos** - Estructura del sistema
* **ES6 Modules** - Sistema de módulos

## 📝 Requisitos Cumplidos

El sistema cumple con todos los requisitos funcionales:

* **REQ-USR-1** a **REQ-USR-8**: Gestión completa de usuarios
* **REQ-CAR-1** a **REQ-CAR-4**: Gestión de vehículos y Pico y Placa
* **REQ-CLD-01** a **REQ-CLD-03**: Gestión de celdas
* **REQ-INEX-1** a **REQ-INEX-4**: Control de entradas/salidas
* **REQ-INCD-1**: Sistema de incidencias
* **REQ-REP-01** a **REQ-REP-10**: Reportes completos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas, por favor abre un issue en el repositorio.

---

**¡Gracias por usar nuestro Sistema de Gestión de Parqueadero!** 🚀

```

¿Quieres que te prepare también un **README resumido tipo presentación académica** (más corto, ideal si te lo piden entregar en un taller), o lo dejamos en este formato completo para GitHub?
```