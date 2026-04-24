import gameState from "./defaultGameState.js";

// funcion para buscar una ubicacion por la ID y devuelve el objeto encontrado o -1
export function findRoomByID(targetID) {
  // usa find() para buscar room que tenga la misma id y si no la encuentra devuelve undefined
  let foundRoom = gameState.map.rooms.find(
    (room) => room.id === targetID,
  );
  if (foundRoom === undefined) {
    return -1; // si no se encontro se devuelve -1
  } else {
    return foundRoom; // devuelve el objeto de room que se encontro con find()
  }
}

// funcion para buscar el enemigo segun la ID y devuelve el objeto encontrado o -1
export function findEnemyByID(targetID) {
  // usa find() para buscar enemy que tenga la misma id y si no la encuentra devuelve undefined
  let foundEnemy = gameState.map.enemies.find(
    (enemy) => enemy.id === targetID,
  );
  if (foundEnemy === undefined) {
    return -1; // si no se encontro se devuelve -1
  } else {
    return foundEnemy; // devuelve el objeto de enemy que se encontro con find()
  }
}
