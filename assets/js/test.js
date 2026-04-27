import defaultGameState from "./defaultGameState.js";

let totalEnemyHealth = 0;
let totalEnemyStrength = 0;
let totalEnemyDefence = 0;

defaultGameState.map.enemies.forEach((e) => {
  totalEnemyHealth += parseInt(e.health);
  totalEnemyStrength += parseInt(e.strength);
  totalEnemyDefence += parseInt(e.defence);
});
/*
console.log(
  "Vida total: " +
    totalEnemyHealth +
    "\nDefensa total: " +
    totalEnemyDefence +
    "\nFuerza total: " +
    totalEnemyStrength,
);

let nEnemies = defaultGameState.map.enemies.length;
console.log(
  "Media:\n   Vida: " +
    totalEnemyHealth / nEnemies +
    "\n   Defensa: " +
    totalEnemyDefence / nEnemies +
    "\n   Fuerza: " +
    totalEnemyStrength / nEnemies,
);
*/
console.log(defaultGameState.map.enemies[0].health);

let sum = 0;
let highest = 0;
let lowest = 0;

let i = 100;

let cont = 0;

for (i; i > 0; i--) {
  let randomEnemyArrayPos = parseInt(Math.random() * 6);
  console.log("randomEnemyArrayPos = " + randomEnemyArrayPos);

  let bonusHealth =
    Math.random() *
      defaultGameState.map.enemies[randomEnemyArrayPos].health *
      0.05 +
    Math.random() * 3;
  let bonusStrength =
    Math.random() *
      defaultGameState.map.enemies[randomEnemyArrayPos].strength *
      0.3 +
    (Math.random() + 0.5) * Math.random() * 5;
  let bonusDefence =
    Math.random() *
    defaultGameState.map.enemies[randomEnemyArrayPos].defence *
    0.2;

  let bonusTotal =
    parseInt(bonusHealth) + parseInt(bonusDefence) + parseInt(bonusStrength);
  console.log(
    "Bonus total: " +
      parseInt(bonusHealth) +
      " + " +
      parseInt(bonusStrength) +
      " + " +
      parseInt(bonusDefence) +
      " = " +
      bonusTotal,
  );

  if (bonusTotal > highest) highest = bonusTotal;
  else if (bonusTotal < lowest) lowest = bonusTotal;

  sum += bonusTotal;
  cont++;
}

console.log(
  `TOTAL: ${sum}\nMEDIA: ${sum / cont}\nMAYOR: ${highest}\nMENOR: ${lowest}`,
);
