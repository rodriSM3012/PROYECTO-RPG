import { logMessage } from "./gameLog.js";

import { generateDescription } from "./map.js";
import { searchGold } from "./player.js";

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
  }
  // TODO elif con cada comando disponible
  else {
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
