import { logMessage } from "./gameLog.js";

import { generateDescription } from "./map.js";
import { buyPotion, changeEquipment, searchGold, usePotion } from "./player.js";

import { activeEnemy, droppedEquipment, setDroppedEquipment } from "./game.js";
import { startCombatLoop } from "./combat.js";

// funcion que procesa el contenido de input y llama a una funcion distinta dependiendo del contenido de input para generar un mensaje
export function sendInput() {
  // contenido del input que intrudjo el jugador
  let userInput = document.getElementById("command-input").value.toLowerCase();
  if (userInput == "observar" || userInput == "o") {
    deleteInput();
    logMessage(generateDescription());
  } else if (userInput == "buscar" || userInput == "b") {
    deleteInput();
    logMessage(searchGold());
  } else if (userInput == "comprar" || userInput == "c") {
    deleteInput();
    logMessage(buyPotion());
  } else if (userInput == "recuperar" || userInput == "r") {
    deleteInput();
    logMessage(usePotion());
  } else if (userInput == "atacar" || userInput == "a") {
    deleteInput();
    if (activeEnemy != -1) {
      startCombatLoop(activeEnemy);
    } else {
      logMessage("No hay ningún enemigo cercano al que atacar.");
    }
  } else if (userInput == "s" || userInput == "si" || userInput == "sí") {
    if (droppedEquipment != null) {
      deleteInput();
      droppedEquipment.doEquip = true; // actualiza doEquip para que si se equipe y cambien las estadisticas
      logMessage(changeEquipment(droppedEquipment));
      setDroppedEquipment(null);
    } else {
      deleteInput();
      logMessage("No hay ningún mensaje que requiera confirmación.");
    }
  } else if (userInput == "n" || userInput == "no") {
    if (droppedEquipment != null) {
      deleteInput();
      logMessage(changeEquipment(droppedEquipment));
      setDroppedEquipment(null);
    } else {
      deleteInput();
      logMessage("No hay ningún mensaje que requiera confirmación.");
    }
  } else {
    deleteInput();
    logMessage(
      "Comando no identificado. Pulsa ❓ Ayuda para ver todos los comandos. (función por implementar)",
    ); // TODO seccion de ayuda
  }
}

// funcion para resetear el input de comandos
function deleteInput() {
  document.getElementById("command-input").value = "";
}
