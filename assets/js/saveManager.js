import gameState from "./defaultGameState.js";
import {
  setActiveEnemy,
  setCombatState,
  setDroppedEquipment,
  setFleeAttempt,
  setSlainEnemies,
  update,
} from "./game.js";
import { logMessage } from "./gameLog.js";

// funcion para guardar la partida
export function saveGame(
  activeEnemy,
  combatState,
  droppedEquipment,
  fleeAttempt,
  slainEnemies,
) {
  // evita poder cargar la partida si se esta en un combate
  if (!combatState) {
    // crea la variable para guardar todos los datos necesarios
    let gameData = {
      player: {},
      game: {
        activeEnemy: 0,
        combatState: false,
        fleeAttempt: 0,
        slainEnemies: 0,
        droppedEquipment: {},
      },
    };

    // guarda el gameState en gameData (solo player ya que es el unico que se modifica)
    gameData.player = gameState.player;

    // guarda otras variables del juego relevantes que no estan en gameState
    gameData.game.activeEnemy = activeEnemy;
    gameData.game.combatState = combatState;
    gameData.game.fleeAttempt = fleeAttempt;
    gameData.game.slainEnemies = slainEnemies;
    gameData.game.droppedEquipment = droppedEquipment;

    localStorage.setItem("saveData", JSON.stringify(gameData)); // guarda todo el contenido en localStorage
    console.log("partida guardada");
    logMessage("Partida guardada.");
  } else {
    logMessage("No puedes guardar en mitad de un combate.");
  }
}

// funcion para cargar la partida
export function loadGame() {
  // extrae los datos de localStorage
  let saveData = localStorage.getItem("saveData");
  // comprueba que no este vacio
  if (saveData != null) {
    // modificacion de gameState
    let parsedData = JSON.parse(saveData); // convierte los datos en formato string a JSON
    Object.assign(gameState.player, parsedData.player); // sobreescribe gameState con los datos extraidos
    console.log(gameState.player);

    // modificacion del resto de variables de game.js
    setActiveEnemy(parsedData.game.activeEnemy);
    setCombatState(parsedData.game.combatState);
    setFleeAttempt(parsedData.game.fleeAttempt);
    setSlainEnemies(parsedData.game.slainEnemies);
    setDroppedEquipment(parsedData.game.droppedEquipment);

    // llama a la funcion para recargar todo pero pasando true como variable, haciendo que se salte los pasos de reiniciar algunas variables y generar un enemigo nuevo
    update(true);

    logMessage("Partida cargada.");
  } else {
    logMessage("No hay ninguna partida guardada.");
  }
}
