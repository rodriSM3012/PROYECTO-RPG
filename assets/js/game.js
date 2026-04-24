import gameState from "./defaultGameState.js";

import { TEST_MODE } from "./config.js";

import { findRoomByID } from "./helper.js";

import { showPlayerStats, moveMC } from "./player.js";
import { showEnemyStats, spawnEnemy } from "./enemy.js";

import { sendInput } from "./input.js";

import { logMessage } from "./gameLog.js";

// en primer lugar se pregunta al usuario el nombre que le pondrá a su personaje
// con un prompt en el navegador y se guarda en localStorage
if (!TEST_MODE) {
  // TEST_MODE → variable de archivo config.js que se cambia manualmente para desactivar que la pagina pida el nombre
  gameState.player.name = prompt("Introduce el nombre de tu personaje: ");
} else {
  gameState.player.name = "Tester";
}

export let activeEnemy = -1;
let currentRoomID = gameState.player.currentRoom; // guarda la id de la ubicacion
// currentRoomID se actualiza automaticamente cada vez que el usuario pulsa el dpad:
// pulsa boton → llama funcion moveMC() → la funcion llama update() automaticamente y currentRoomID se acutaliza

export function init() {
  logMessage(
    "Comandos disponibles: <br/>" +
      "- O, Observar → para mostrar descripción del lugar<br/>" +
      "- B, Buscar → para buscar oro",
  );

  // actualiza los datos en pantalla y procesa la logica de generar enemigos
  update();

  // añade eventListener a los botones del dpad
  let dpadU = document.getElementById("up");
  let dpadR = document.getElementById("right");
  let dpadD = document.getElementById("down");
  let dpadL = document.getElementById("left");

  // usa funciones anonimas para solo tener 1 funcion moveMC y una variable para cada direccion
  dpadU.addEventListener("click", () => {
    moveMC("u");
  });
  dpadR.addEventListener("click", () => {
    moveMC("r");
  });
  dpadD.addEventListener("click", () => {
    moveMC("d");
  });
  dpadL.addEventListener("click", () => {
    moveMC("l");
  });

  // añade eventListener al boton de enviar comandos
  let submitCommand = document.getElementById("submitCommand");
  submitCommand.addEventListener("click", sendInput);
  // para que tambien funcione con Enter
  let userInput = document.getElementById("command-input");
  userInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") sendInput();
  });
  /*
  COMANDOS:
    - A / Ayuda (muestra los comandos)
    - O / Observar
    - B / Buscar
    - R / Regenerar (con poción)
    - C / Comprar (solo en una tienda)
    - 
    - TODO
  */
}

// funcion para actualizar los datos que se muestran en pantalla y procesar toda la logica del juego
export function update() {
  currentRoomID = gameState.player.currentRoom; // actualiza la ubicacion actual
  // log
  let currentRoomName = findRoomByID(currentRoomID).name;
  logMessage("Has entrado en '" + currentRoomName + "'.");

  activeEnemy = spawnEnemy(); // actualiza el enemigo en pantalla si lo hay
  showPlayerStats(); // actualiza datos del jugador en pantalla
  showEnemyStats(activeEnemy); // actualiza datos del enemigo en pantalla o borra los que habia si no hay enemigo

  // reinicia la posibilidad de buscar oro
  gameState.player.hasSearched = false;

  // cambia imagenes de fondo
  currentRoomID = gameState.player.currentRoom;
  let imgSRC = findRoomByID(currentRoomID).img; // direccion de la imagen de la ubicacion objetivo

  let backgroundIMG = document.getElementById("imgBG"); // objeto del DOM de la img de fondo
  backgroundIMG.src = imgSRC; // asigna la direccion de la imagen
}
