import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Vehiculo {
  static vehiculos = [];
  static ultimoId = 0;

  constructor({id, placa, color, marca, modelo, tipo, usuarioId}) {
    this.id = id;
    this.placa = placa;
    this.color = color;
    this.marca = marca;
    this.modelo = modelo;
    this.tipo = tipo;
    this.usuarioId = usuarioId; // referencia al usuario dueño
  }

  static async formularioRegistro(usuarioId, rl) {
  console.log("--- Registro de Vehículo ---");
  const placa = await rl.question("Placa: ");
  const color = await rl.question("Color: ");
  const marca = await rl.question("Marca: ");
  const modelo = await rl.question("Modelo: ");
  const tipo = await rl.question("Tipo (carro/moto): ");

  Vehiculo.ultimoId++;
  const vehiculo = new Vehiculo({
    id: Vehiculo.ultimoId,
    placa,
    color,
    marca,
    modelo,
    tipo,
    usuarioId
  });

  Vehiculo.vehiculos.push(vehiculo);
  return vehiculo;
}


  static listarVehiculos() {
    return Vehiculo.vehiculos;
  }
}

export default Vehiculo;