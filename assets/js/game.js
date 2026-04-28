import gameState from "./defaultGameState.js";

import { TEST_MODE } from "./config.js";

import { findEnemyByID, findRoomByID } from "./helper.js";

import { showPlayerStats, moveMC } from "./player.js";
import { showEnemyStats, spawnEnemy } from "./enemy.js";

import { sendInput } from "./input.js";

import { logMessage } from "./gameLog.js";

import { saveGame, loadGame } from "./saveManager.js";

// en primer lugar se pregunta al usuario el nombre que le pondrá a su personaje
// con un prompt en el navegador y se guarda en localStorage
if (!TEST_MODE) {
  // TEST_MODE → variable de archivo config.js que se cambia manualmente para desactivar que la pagina pida el nombre
  gameState.player.name = prompt("Introduce el nombre de tu personaje: ");
} else {
  gameState.player.name = "Tester";
}

// variables del estado de juego
export let activeEnemy = -1; // guarda el enemigo activo como objeto (si es -1 no hay ninguno)
export let combatState = false; // depende de si se esta peleando o no. se actualiza en combat.js
export let fleeAttempt = 3; // al aparecer un enemigo, el jugador tiene 3 oportunidades para huir si no ha iniciado el combate
export let slainEnemies = 0; // mantiene un registro del numero de enemigos derrotados, como un sistema de experienca mas simple. solo se reinicia al recargar la pagina
export let droppedEquipment = {
  name: "",
  type: "",
  bonus: "",
  doEquip: false,
}; // guarda el nombre , el tipo y el bonus del equipamiento soltado por un enemigo. tambien guarda en un booleano si el jugador decide cambiar el equipamiento o no

let currentRoomID = gameState.player.currentRoom; // guarda la id de la ubicacion
// currentRoomID se actualiza automaticamente cada vez que el usuario pulsa el dpad:
// pulsa boton → llama funcion moveMC() → la funcion llama update() automaticamente y currentRoomID se acutaliza

export function init() {
  logMessage(
    "Comandos disponibles: <br/>" +
      "- O, Observar → para mostrar descripción del lugar<br/>" +
      "- B, Buscar → para buscar oro<br/>" +
      "- C, Comprar → para comprar una poción en ciertas ubicaciones<br/>" +
      "- R, Recuperar → para recuperar los puntos de vida con una poción<br/>" +
      "- A, Atacar → para atacar al enemigo presente",
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

  // obtiene los botones de guardar/cargar a partir del id del elemento
  let saveButton = document.getElementById("save");
  let loadButton = document.getElementById("load");

  // añade el eventListener para el boton de guardar la partida
  saveButton.addEventListener("click", () => {
    saveGame(
      activeEnemy,
      combatState,
      droppedEquipment,
      fleeAttempt,
      slainEnemies,
    );
  });
  // añade el eventListener para el boton de cargar la partida
  loadButton.addEventListener("click", loadGame);

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
    - O / Observar
    - B / Buscar
    - R / Regenerar (con poción)
    - C / Comprar (solo en una tienda)
    - A / Atacar (si hay un enemigo)
    - TODO
  */
}

// funcion para actualizar los datos que se muestran en pantalla y procesar toda la logica del juego
// si recibe la variable loadingGame con cualquier valor se salta parte del codigo,
export function update(loadingGame) {
  currentRoomID = gameState.player.currentRoom; // actualiza la ubicacion actual

  let currentRoomName = findRoomByID(currentRoomID).name;
  let activeEnemyID = -1;
  if (activeEnemy != -1) {
    activeEnemyID = activeEnemy.id; // obtiene la id del enemigo presente
  }

  if (loadingGame == null) {
    // log
    logMessage("Has entrado en '" + currentRoomName + "'.");

    // reinicia la posibilidad de buscar oro
    gameState.player.hasSearched = false;
    // reinicia las oportunidades de huida
    fleeAttempt = 3;
    // reinicia el equipo disponible
    droppedEquipment = null;

    activeEnemyID = spawnEnemy(); // actualiza el enemigo en pantalla al cambiar de sala
  }

  showPlayerStats(); // actualiza datos del jugador en pantalla
  showEnemyStats(activeEnemyID); // actualiza datos del enemigo en pantalla o borra los que habia si no hay enemigo

  // se actualiza la variable activeEnemy definida fuera de la funcion con el enemigo correspondiente segun la id obtenida de spawnEnemy()
  activeEnemy = findEnemyByID(activeEnemyID);
  console.log(activeEnemy);

  // cambia imagenes de fondo
  currentRoomID = gameState.player.currentRoom;
  let imgSRC = findRoomByID(currentRoomID).img; // direccion de la imagen de la ubicacion objetivo

  let backgroundIMG = document.getElementById("imgBG"); // objeto del DOM de la img de fondo
  backgroundIMG.src = imgSRC; // asigna la direccion de la imagen
}

// funcion para poder actualizar combatState desde combat.js
export function setCombatState(value) {
  combatState = value;
}

// funcion para poder actualizar activeEnemy desde combat.js
export function setActiveEnemy(value) {
  activeEnemy = value;
}

// funcion para poder actualizar fleeAttempt desde player.js
export function setFleeAttempt(value) {
  fleeAttempt = value;
}

// funcion para poder modificar slainEnemies desde saveManager.js
export function setSlainEnemies(value) {
  slainEnemies = value;
}

// funcion para poder incrementar en 1 slainEnemies desde combat.js
export function increaseSlainEnemies() {
  slainEnemies++;
}

// funcion para poder actualizar droppedEquipment desde combat.js
export function setDroppedEquipment(value) {
  droppedEquipment = value;
}
