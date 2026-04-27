import gameState from "./defaultGameState.js";

import {
  slainEnemies,
  update,
  setCombatState,
  setActiveEnemy,
  increaseSlainEnemies,
  setDroppedEquipment,
} from "./game.js";

import { showPlayerStats } from "./player.js";
import { showEnemyStats } from "./enemy.js";
import { logMessage } from "./gameLog.js";

// funcion para extraer todos los datos del jugador y del enemigo y que llama a la funcion para iniciar el combate
export function startCombatLoop(activeEnemy) {
  let enemyName = activeEnemy.name; // copia el nombre del enemigo activo en una variable
  let enemyHealth = activeEnemy.health; // copia la vida del enemigo activo en una variable
  let enemyDefence = activeEnemy.defence; // copia la defensa del enemigo activo en una variable
  let enemyStrength = activeEnemy.strength; // copia la fuerza del enemigo activo en una variable

  setCombatState(true); // actualiza e inicia el estado de combate
  logMessage("¡Comienza el combate contra " + enemyName + "!");

  // inicia
  combatRound(enemyName, enemyHealth, enemyDefence, enemyStrength);
}

// funcion que recrea el bucle del combate. no tiene ningun bucle while por que se llama de forma recursiva
function combatRound(enemyName, enemyHealth, enemyDefence, enemyStrength) {
  // TURNO 1 (enemigo)
  let enemyAttackValue = enemyAttack(gameState.player, enemyStrength); // valor del ataque del enemigo

  // comprueba el valor del ataque para cambiar el mensaje y evitar restar con numeros negativos si llegan a salir
  if (enemyAttackValue > 0) {
    gameState.player.health -= enemyAttackValue; // resta vida al jugador segun el ataque
    logMessage(
      `¡El ${enemyName} te ha atacado y has recibido ${enemyAttackValue} puntos de daño!`,
    );
  } else {
    logMessage("¡Has conseguido evitar el ataque!");
  }

  showPlayerStats(); // actualiza la interfaz

  // comprueba que el jugador sigue vivo
  if (gameState.player.health <= 0) {
    logMessage(
      "Has sido derrotado en combate. Pierdes todo tu inventario y vuelves al inicio.",
    );
    playerDeath(); // llama a la funcion para reiniciar
    return;
  }

  // TURNO 2 (jugador)
  let playerAttackValue = playerAttack(gameState.player, enemyDefence); // valor del ataque del jugador

  if (playerAttackValue > 0) {
    enemyHealth -= playerAttackValue; // resta vida al jugador segun el ataque
    logMessage(
      `Has atacado al ${enemyName} y le has infligido ${playerAttackValue} puntos de daño.`,
    );
  } else {
    logMessage("¡El enemigo ha evitado el ataque!");
  }

  // comprueba si el enemigo ha muerto
  if (enemyHealth <= 0) {
    logMessage(`¡Has derrotado al ${enemyName}!`);

    dropEquipment(enemyName, enemyHealth, enemyDefence, enemyStrength); // se llama a la funcion para soltar equipamiento

    // se reinician varios estados del juego
    increaseSlainEnemies(); // incrementa en 1 el numero de enemigos derrotados
    setCombatState(false); // reinicia el estado de combate a false
    setActiveEnemy(-1); // elimina el monstruo actual

    showEnemyStats(-1); // se actualiza la interfaz
    return;
  }

  // si ambos siguen vivos, se reinicia toda la funcion con un tiempo de espera
  setTimeout(() => {
    combatRound(enemyName, enemyHealth, enemyDefence, enemyStrength);
  }, 3000);
}

// funcion que se ejecuta cuando el jugador ataca. devuelve el valor del ataque que se restara a la vida del enemigo
function playerAttack(player, enemyDefence) {
  let attackValue =
    (Math.random() * player.strength) / 2 -
    (Math.random() * player.strength) / 2 +
    (player.strength + player.strengthBonus);

  attackValue = parseInt(attackValue - enemyDefend(enemyDefence));

  return attackValue;
}

// funcion que se ejecuta uando el jugador se defiende de un ataque. devuelve un valor que se restará al ataque recibido
function playerDefend(player) {
  return player.defense * Math.random() + player.defenseBonus;
}

// funcion que se ejecuta cuando el enemigo ataca. devuelve el valor del ataque que se restara a la vida del jugador
function enemyAttack(player, enemyStrength) {
  let attackValue =
    (Math.random() * enemyStrength) / 2 -
    (Math.random() * enemyStrength) / 2 +
    enemyStrength;

  attackValue = parseInt(attackValue - playerDefend(player));

  return attackValue;
}

// funcion que se ejecuta uando el enemigo se defiende de un ataque. devuelve un valor que se restará al ataque recibido
function enemyDefend(enemyDefence) {
  return enemyDefence * Math.random();
}

// funcion que resetea al jugador y lo manda a la sala inicial tras ser derrotado
function playerDeath() {
  gameState.player.health = 30; // restaura la vida al maximo
  gameState.player.currentRoom = 0; // manda al jugador a la sala inicial
  gameState.player.gold = 0; // pierde todo el oro
  gameState.player.potions = 0; // pierde todas las pociones
  gameState.player.strengthBonus = 0; // pierde el bonus de fuerza
  gameState.player.defenseBonus = 0; // pierde el bonus de defensa

  logMessage("Pulsa cualquer tecla para continuar...");

  // añade un event listener para que la pagina se recargue cuando el jugador pulse una tecla. este listener se elimina despues de usarse por el {once:true}
  document.addEventListener(
    "keydown",
    () => {
      setCombatState(false); // devuelve el estado de combate al incial
      update();
    },
    { once: true },
  );
}

// funcion para generar el equipamiento que suelte el enemigo al morir
function dropEquipment(enemyName, enemyHealth, enemyDefence, enemyStrength) {
  let dropChance = Math.random(); // determina la probabilidad de que el enemigo suelte un objeto de equipamiento

  /*
  Estadisticas totales de los enemigos:
    Vida total: 275
    Defensa total: 87
    Fuerza total: 91

    Media:
      Vida: 45.833333333333336
      Defensa: 14.5
      Fuerza: 15.166666666666666
  */

  // probabilidad del 40% de que suelte un objeto
  if (dropChance < 0.4) {
    /* 
    --- CALCULO DE LA CALIDAD DEL OBJETO ---
     */
    let dropQuality; // determina la calidad del objeto

    /* para determinar la calidad final se tiene en cuenta:
        - todas las estadisticas del enemigo derrotado (por orden de mas relevante a menos: strength, defense, health )
        - numero de enemigos derrotados
        - componente aleatorio en casi todas las operaciones
    */

    // establece el bonus por cada estadistica del enemigo
    let bonusHealth = Math.random() * enemyHealth * 0.05 + Math.random() * 3;
    let bonusStrength =
      Math.random() * enemyStrength * 0.3 +
      (Math.random() + 0.5) * Math.random() * 5;
    let bonusDefence = Math.random() * enemyDefence * 0.2;

    let bonusTotal =
      parseInt(bonusHealth) + parseInt(bonusDefence) + parseInt(bonusStrength);

    // calcula la calidad final del objeto
    dropQuality = parseInt(bonusTotal * (Math.random() + slainEnemies * 0.2));

    /*
    --- SELECCION DE TIPO DE EQUIPAMIENTO ---
    */
    let selectedEquipment; // guarda el equipamiento obtenido
    let objectType; // guarda como texto el tipo de objeto soltado (arma/armadura)
    let newEquipment = {}; // guarda el objeto con los datos del equipamiento soltado

    // probabilidad del 50% de que sea un arma o una armadura
    if (Math.random() <= 0.5) {
      // --- DROP DE ARMA ---
      let availableWeapons = [
        "una espada",
        "un mazo",
        "una espada larga",
        "un hacha",
        "una lanza",
        "un estoque",
      ];
      objectType = 0; // actualiza el tipo de equipamiento que se ha recibido
      // se selecciona un arma de las disponibles aleatoriamente
      selectedEquipment =
        availableWeapons[parseInt(Math.random() * availableWeapons.length)];
    } else {
      // --- DROP DE ARMADURA ---
      objectType = 1; // actualiza el tipo de equipamiento que se ha recibido
      selectedEquipment = "una armadura";
      // inicialmente iba a hacer varios tipos de armaduras, pero tendria que guardar cada tipo posible como una armadura distinta,
      // ya que no tendria sentido tener que desequipar unas botas a cambio de poder equipar unos guantes, pero se deberia tener en cuenta
      // cada tipo equipado e intercambiarlo o no (solo tener 1 casco y cambiarlo cuando aparezca otro, pero no si es unas botas).
      // por lo tanto no podria ser simplemente sumar al defenseBonus continuamente, ya que algunas veces seria intercambiar y otras no
    }

    // actualiza el objeto del equipamiento una vez ya se tienen todos los datos
    newEquipment = {
      name: selectedEquipment,
      type: objectType, // 0 = arma, 1 = armadura
      bonus: dropQuality,
      doEquip: false,
    };
    // tambien lo actualiza en game.js
    setDroppedEquipment(newEquipment);

    /*
    --- GENERACION DEL MENSAJE ---
    */
    let bonus; // guarda el tipo de bonus que se usara para comparar dependiendo de si el objeto soltado es arma o armadura
    let objectTypeName; // guarda el nombre del tipo de equipamiento (arma/armadura)
    if (objectType === 0) {
      bonus = gameState.player.strengthBonus;
      objectTypeName = "arma";
    } else {
      bonus = gameState.player.defenseBonus;
      objectTypeName = "armadura";
    }

    // genera un mensaje para informar al jugador y permitir que se equipe el arma/armadura o no
    let text = `El ${enemyName} ha soltado ${selectedEquipment} con un bonus de +${dropQuality}`;
    // el mensaje es distinto dependiendo de la calidad del objeto en comparacion al equipamiento actual
    if (dropQuality > bonus) {
      text += ` ¿Deseas intercambiarla por tu ${objectTypeName} (+${bonus})? (S/N)`;
    } else if (dropQuality == bonus) {
      text += ` Tiene el mismo ataque que tu ${objectTypeName}, ¿deseas hacer un intercambio igualmente? (S/N)`;
    } else {
      text += `, pero es peor que tu ${objectTypeName}. Decides ignorarlo.`;
    }

    // crea el log con el texto
    logMessage(text);
  }
}
