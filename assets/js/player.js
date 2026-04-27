import {
  activeEnemy,
  combatState,
  fleeAttempt,
  setFleeAttempt,
  update,
} from "./game.js";
import gameState from "./defaultGameState.js";

import { findRoomByID } from "./helper.js";
import { logMessage } from "./gameLog.js";
import { startCombatLoop } from "./combat.js";

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
  // comprueba si el jugador esta en combate o no (si ya se ha iniciado el combate no se puede huir)
  if (!combatState) {
    // comprueba si hay algun enemigo en pantalla
    if (activeEnemy != -1) {
      // posibilidad del 10% de que el jugador no pueda huir
      if (Math.random() <= 0.1) {
        setFleeAttempt(fleeAttempt - 1); // se resta 1 intento de huida

        // si ya no quedan oportunidades se inicia el combate
        if (activeEnemy != -1 && fleeAttempt == 0) {
          logMessage(
            "¡No consguiste huir y te has visto forzado a iniciar el combate!",
          );
          startCombatLoop(activeEnemy);
          return;
        }

        let text; // texto que se añade al mensaje para informar sobre los intentos de huida restantes
        // comprobacion de singular o plural
        if (fleeAttempt === 1) {
          text = "Sólo te queda 1 oportunidad para huir.";
        } else {
          text = `Tienes otras ${fleeAttempt} oportunidades para huir.`;
        }

        logMessage(
          "¡El enemigo te ha visto huir y te ha cortado el paso! " + text,
        );
        return;
      }
    }

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
  } else {
    logMessage("No puedes huir en mitad de un combate.");
    return;
  }
  // llama a la funcion para actualizar la interfaz despues de los cambios
  update();
}

// funcion para comprar una pocion a cambio de oro
export function buyPotion() {
  // se comprueba que la localizacion tenga una tienda disponible
  if (findRoomByID(gameState.player.currentRoom).isShop) {
    if (gameState.player.gold >= 30) {
      // se comprueba que haya oro suficiente
      gameState.player.gold -= 30; // cada pocion cuesta 30 de oro y se restan en gameState
      gameState.player.potions++; // suma 1 pocion al jugador
      showPlayerStats(); // actualiza la interfaz para ver los cambios en el oro y las pociones
      return "Has comprado una poción por 30 piezas de oro.";
    } else {
      return "¡No tienes oro suficiente para comprar una poción!";
    }
  } else {
    return "No hay ninguna tienda disponible en esta ubicación.";
  }
}

// funcion para usar una pocion
export function usePotion() {
  // se comprueba que haya oro suficiente
  if (gameState.player.potions >= 1) {
    gameState.player.potions--; // se resta 1 pocion al usarla
    let heal = 5 + parseInt(Math.random() * 11); // valor de la vida regenerada (entre 5 y 15)
    let currentHealth = gameState.player.health;
    // se regenera la vida al jugador
    if (currentHealth + heal >= 30) {
      gameState.player.health = 30; // si el valor recuperado supera el maximo, se le asigna el maximo en vez de sumar heal
      heal = 30 - currentHealth; // reasigna el valor de heal para reflejar la cantidad recuperada real
    } else {
      gameState.player.health += heal;
    }
    showPlayerStats(); // actualiza la interfaz para ver los cambios en la salud

    let text; // texto que aparecera en el registro
    if (heal === 0) {
      text = "No has regenerado ningún punto de vida.";
    } else if (heal === 1) {
      text = "Has regenerado 1 punto de vida.";
    } else {
      text = "Has regenerado " + heal + " puntos de vida.";
    }
    return text;
  } else {
    return "¡No tienes pociones disponibles!";
  }
}

/* funcion para cambiar el equipamiento:
    - recibe el objeto del equipamiento nuevo (nombre + tipo + bonus + booleano para equipar el objeto o no)
    - modifica el bonus adecuado en gameState con el valor adecuado de bonus
    - devuelve un texto que aparecera en el log
*/
export function changeEquipment(newEquipment) {
  let text; // variable con el texto que se aparecera en el log

  // determina el género del equipamiento para que aparezca el articulo adecuado
  let char = newEquipment.name.charAt(2);
  let articleGender = char === "a" ? "la" : "el";

  let equipmentName = newEquipment.name.slice(3).trim(); // corta el un/una del nombre y lo guarda en la variable

  // si doEquip = true es que el jugador selecciono equiparlo
  if (newEquipment.doEquip) {
    // guarda los valores del objeto en variables separadas (el nombre se asigno fuera del if)
    let equipmentType = newEquipment.type;
    let equipmentBonus = newEquipment.bonus;

    // modifica el bonus adecuado del jugador segun el tipo de equipamiento
    equipmentType == 0
      ? (gameState.player.strengthBonus = equipmentBonus)
      : (gameState.player.defenseBonus = equipmentBonus);

    // crea el mensaje que se mostrara en el log
    text =
      `Te has equipado ${articleGender} ${equipmentName} y recibes un bonus de +${equipmentBonus} en la ` +
      (equipmentType == 0 ? "fuerza." : "defensa.");
  } else {
    text = `No te has equipado ${articleGender} ${equipmentName} y lo has dejado en el suelo.`;
  }

  // devuelve el texto que aparecera en el log
  return text;
}
