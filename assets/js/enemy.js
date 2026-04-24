import gameState from "./defaultGameState.js";
import { findEnemyByID, findRoomByID } from "./helper.js";
import { logMessage } from "./gameLog.js";

// funcion para mostrar las estadisticas del enemigo
export function showEnemyStats(enemyID) {
  const sectionNPC = document.getElementById("sectionNPC");
  const imgNPC = document.getElementById("imgNPC");
  // si es -1 es que no se genero ningun enemigo
  if (enemyID != -1) {
    let currentEnemy = findEnemyByID(enemyID); // busca al enemigo con la id que se genero con spawnEnemy

    // genera la seccion de datos del enemigo con un template
    sectionNPC.innerHTML = `
      <h2 class="name">${currentEnemy.name}</h2>
      <p class="isBoss">${currentEnemy.isBoss ? "Jefe" : "&nbsp"}</p>
      <ul>
        <li><a href="#">Salud: </a>${currentEnemy.health}</li>
        <li><a href="#">Fuerza: </a>${currentEnemy.strength}</li>
        <li><a href="#">Defensa: </a>${currentEnemy.defence}</li>
      </ul>
      `;
    // añade la imagen del enemigo
    imgNPC.src = currentEnemy.img;
    // añade un mensaje en el historial
    logMessage("¡Ha aparecido un " + currentEnemy.name + "!");
  } else {
    // si no aparecio ningun enemigo actualiza los datos para que no muestren nada
    sectionNPC.innerHTML = "";
    imgNPC.src = "";
  }
}

// funcion que genera un enemigo aleatoriamente y devuelve su id
export function spawnEnemy() {
  let diceRoll = Math.random(); // num aleatorio entre 0 y 1
  console.log(diceRoll); // test
  let spawnedEnemyID;

  let currentRoomID = gameState.player.currentRoom;
  let spawnChance = findRoomByID(currentRoomID).monsterProb; // extrae la probabilidad de que aparezca un mosntruo de la ubicacon en concreto
  if (diceRoll < spawnChance) {
    if (currentRoomID === 7) {
      return 0; // si es la habitacion final siempre es el boss
    } else {
      // comprueba si el boss aparece con prob de 2%
      let bossSpawn = Math.random() * 100; // random (0, 100)
      if (bossSpawn < 2) {
        return 0; // id del boss
      } else {
        // si el boss no aparece genera un mosntruo normal
        spawnedEnemyID =
          parseInt(Math.random() * (gameState.map.enemies.length - 1)) + 1;
        // numero entre 0 y 1 * numero total de enemigos y lo pasa a int → id aleatoria de enemigo
        // -1 a length para no tener en cuenta un enemigo, luego suma 1 para evitar la id del boss
        return spawnedEnemyID;
      }
    }
  } else {
    return -1; // no aparecio ningun enemigo
  }
}
