import { TEST_MODE } from "./config.js";
import { init } from "./game.js";

if (TEST_MODE) {
  document.title = "PROYECTO RPG - testing"; // cambia el titulo si se estan haciendo pruebas
}

// DOMContentLoaded asegura que se procese despues de que la pagina cargue
document.addEventListener("DOMContentLoaded", init);
