import gameState from "./defaultGameState.js";

import { activeEnemy } from "./game.js";

import { findEnemyByID, findRoomByID } from "./helper.js";

// funcion que devuelve un string con la descripcion del sitio y las posibles salidas o del enemigo si lo hay
export function generateDescription() {
  // comprueba que no haya un enemigo activo, si lo hay tendra prioridad la descripcion del enemigo antes que la ubicacion
  if (activeEnemy == -1) {
    let currentRoom = findRoomByID(gameState.player.currentRoom);
    let text = currentRoom.description; // extrae la descripcion de defaultGameState

    let availableLocations = [];
    let cont = 0; // lleva la cuenta de cuantas ubicaciones contiguas hay disponibles
    // serie de ifs para comprobar cada una de las 4 direcciones si existen habitaciones
    if (currentRoom.north != -1) availableLocations.push("norte");
    if (currentRoom.east != -1) availableLocations.push("este");
    if (currentRoom.south != -1) availableLocations.push("sur");
    if (currentRoom.west != -1) availableLocations.push("oeste");
    cont = availableLocations.length; // actualiza cont con la cantidad de ifs exitosos

    text += "<br/>Hay " + cont;
    // if para escribir en plural o singular
    if (cont > 1) {
      let excludeLast = availableLocations.slice(0, -1).join(", ");
      let last = availableLocations[cont - 1];
      text +=
        " ubicaciones accesibles en las direcciones " +
        excludeLast +
        " y " +
        last +
        ".";
    } // aunque en el mapa no ocurra se contempla que no haya ninguna habitacion contigua
    else if (cont === 0) {
      text = "No hay ninguna salida.";
    } else {
      text +=
        " ubicación accesible en la dirección " + availableLocations[0] + ".";
    }

    // si es una ubicacion con una tienda disponible tambien se incluye en la descripcion
    if (currentRoom.isShop) {
      text += " <br/><b>Puedes comprar pociones en una tienda cercana.</b>";
    }

    console.log(text);
    return text;
  } else {
    // devuelve la descripcion del enemigo activo
    return findEnemyByID(activeEnemy).description;
  }
}
