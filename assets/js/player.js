import { update } from "./game.js";
import gameState from "./defaultGameState.js";

import { findRoomByID } from "./helper.js";
import { logMessage } from "./gameLog.js";

// funcion para mostrar las estadisticas del jugador
export function showPlayerStats() {
  // muestra el nombre
  document.getElementById("MCname").innerHTML = gameState.player.name;
  // muestra la salud
  document.getElementById("MChealth").innerHTML = gameState.player.health;
  // muestra la fuerza + bonus
  document.getElementById("MCstrength").innerHTML =
    gameState.player.strength + " + " + gameState.player.strengthBonus;
  // muestra la defensa + bonus
  document.getElementById("MCdefense").innerHTML =
    gameState.player.defense + " + " + gameState.player.defenseBonus;
  // muestra el nombre de la ubicacion
  let currentRoomID = gameState.player.currentRoom;
  document.getElementById("MCcurrentRoom").innerHTML =
    findRoomByID(currentRoomID).name;
  // muestra el oro
  document.getElementById("player-gold").innerHTML = gameState.player.gold;
  // muestra las pociones
  document.getElementById("player-potions").innerHTML =
    gameState.player.potions;
}

// funcion para buscar oro. devuelve un string que se mostrara en el log
// TODO no se deberia poder buscar oro si el enemigo no ha sido derrotado
export function searchGold() {
  let currentRoom = findRoomByID(gameState.player.currentRoom); // objeto de la habitacion actual
  let text = ""; // texto que se devolvera al final de la funcion

  // comprueba que todavia no se ha buscado en esta sala
  if (gameState.player.hasSearched) {
    return "Ya has buscado en este lugar.";
  } else {
    // solo se puede buscar si hay posibilidad de que aparezca un mosntruo
    if (currentRoom.monsterProb > 0) {
      let diceRoll = Math.random(); // num aleatorio entre 0 y 1
      let foundGold = 0; // cantidad de oro encontrado

      // cuanta mayor prob de monstruo mas probable es encontrar oro
      if (diceRoll < currentRoom.monsterProb) {
        if (Math.random() > 0.97) {
          // 3% de posibilidad de encontrar muchisimo oro
          // TODO poner mensaje distinto comprobando diceRoll
          foundGold = parseInt((diceRoll + currentRoom.monsterProb) * 500);
          gameState.player.hasSearched = true;
        } else {
          foundGold = parseInt((diceRoll + currentRoom.monsterProb) * 100); // cuanto mas peligroso mas oro hay
          gameState.player.hasSearched = true;
        }
      } else {
        gameState.player.hasSearched = true;
      }
      // TODO prob de que aparezca un monstruo si diceRoll es muy pequeño? y que tambien influya monsterProb

      // distintos mensajes dependiendo de la cantidad encontrada
      if (foundGold == 0) return "No has conseguido encontrar oro.";
      else {
        gameState.player.gold += foundGold; // actualiza el gameState con el oro encontrado
        showPlayerStats(); // actualiza la interfaz para mostrar el oro encontrado
        text += "Has encontrado " + foundGold + " piezas de oro.";
        return text;
      }
    } else {
      return "¡No puedes buscar oro en este lugar!";
    }
  }
}

// funciones para mover al personaje dependiendo de la direccion
export function moveMC(dir) {
  let currentRoomID = gameState.player.currentRoom; // var para guardar la id de la ubicacion en la que esta el personaje
  let nextRoomID; // inicializacion de var donde se guardara la id de la proxima sala
  // asigna una id distinta segun la direccion que selecciono el jugador (dir)
  switch (dir) {
    case "u":
      nextRoomID = findRoomByID(currentRoomID).north;
      break;
    case "r":
      nextRoomID = findRoomByID(currentRoomID).east;
      break;
    case "d":
      nextRoomID = findRoomByID(currentRoomID).south;
      break;
    case "l":
      nextRoomID = findRoomByID(currentRoomID).west;
      break;
    default:
      nextRoomID = -1; // por defecto es -1 = mismo valor que cuando no hay una sala conectada en esa direccion
      break;
  }
  // actualiza curretnRoom del pj segun la siguiente sala
  if (nextRoomID != -1) {
    gameState.player.currentRoom = nextRoomID;
  } else {
    logMessage("No hay ninguna ubicación disponible en esa dirección.");
    return;
  }
  // llama a la funcion para actualizar la interfaz despues de los cambios
  update();
}

// funcion para comprar una pocion a cambio de oro
export function buyPotion() {
  if (gameState.player.gold >= 30) {
    gameState.player.gold -= 30; // cada pocion cuesta 30 de oro y se restan en gameState
    gameState.player.potions++; // suma 1 pocion al jugador
    showPlayerStats(); // actualiza la interfaz para ver los cambios en el oro y las pociones
    logMessage("Has comprado una poción por 30 piezas de oro.");
  } else {
    logMessage("¡No tienes oro suficiente para comprar una poción!");
  }
}
