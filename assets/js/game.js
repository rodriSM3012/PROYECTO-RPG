// array con todos los datos del juego
const defaultGameState = {
  player: {
    name: "",
    health: 30,
    strength: 14,
    strengthBonus: 2,
    defense: 12,
    defenseBonus: 0,
    currentRoom: 0, // se empieza siempre en la ciudad
    gold: 300,
    potions: 3,
  },
  map: {
    rooms: [
      // ciudad
      {
        id: 0,
        monsterProb: 0.0,
        isShop: false,
        name: "Puerto del Atardecer",
        description:
          "Desde la penumbra de una ladera boscosa, emerge una ciudad portuaria bañada por una luz dorada y majestuosa. El aire huele a salitre y leña quemada mientras los galeones mecen sus mástiles sobre el agua. El murmullo lejano del puerto y la brisa fresca de montaña crean una calma profunda.",
        // ids de las salas contiguas
        north: -1,
        south: -1,
        west: -1,
        east: 1, // fortaleza
        // nombre de la imagen que se usara para cada ubicacion
        img: "./assets/images/game/rooms/city.png",
      },
      // fortaleza
      {
        id: 1,
        monsterProb: 0.0,
        isShop: true,
        name: "Bastión del Paso del Río",
        description:
          "Una imponente fortaleza de piedra se alza sobre un promontorio rocoso, dominando el cauce de un río turbulento. Los rayos de sol filtrados por las nubes iluminan los muros desgastados y las velas de los barcos que se aproximan. Se percibe el olor a tierra mojada y la fuerza de la corriente.",
        north: -1,
        south: 2, // mazmorra
        west: 0, // ciudad
        east: 3, // ruinas
        img: "./assets/images/game/rooms/fortress.png",
      },
      // mazmorra
      {
        id: 2,
        monsterProb: 0.9,
        isShop: false,
        name: "Mazmorra de los Trofeos Bestiales",
        description:
          "Un corredor gótico sumido en la oscuridad revela altares improvisados con cráneos de bestias y estandartes harapientos. La tenue luz de las velas lucha contra las sombras densas y el olor a cuero viejo. El ambiente es claustrofóbico, cargado de una tensión latente, como si el lugar aún fuera habitado.",
        north: 1, // fortaleza
        south: -1,
        west: -1,
        east: -1,
        img: "./assets/images/game/rooms/monster-ruins.png",
      },
      // ruinas
      {
        id: 3,
        monsterProb: 0.3,
        isShop: false,
        name: "Ciudadela de los Riscos Nublados",
        description:
          "Desde un risco elevado, se contemplan las ruinas de una civilización dorada suspendida sobre un abismo de nubes. El sol atraviesa el cielo brumoso, calentando los muros de piedra invadidos por la vegetación. Se siente la inmensidad del viento de altura y el rugido lejano de una cascada escondida.",
        north: -1,
        south: -1,
        west: 1, // fortaleza
        east: 4, //tierra maldita
        img: "./assets/images/game/rooms/ruins.png",
      },
      // tierra maldita
      {
        id: 4,
        monsterProb: 0.7,
        isShop: false,
        name: "Páramo de las Sombras Espectrales",
        description:
          "Un páramo lúgubre se extiende bajo un cielo tormentoso, donde árboles retorcidos parecen asfixiados por volutas de energía espectral cian. Se percibe un frío antinatural y el silencio opresivo de una tierra marchita, donde la niebla se arrastra entre raíces nudosas que parecen vigilar cada paso del intruso.",
        north: -1,
        south: 5, // cueva con setas
        west: 3, // ruinas
        east: 7, // templo
        img: "./assets/images/game/rooms/cursed-lands.png",
      },
      // cueva con setas
      {
        id: 5,
        monsterProb: 0.5,
        isShop: false,
        name: "Gruta de los Hongos Bioluminiscentes",
        description:
          "Bajo la cúpula de una caverna colosal, un ecosistema bioluminiscente cobra vida entre estalagmitas y puentes de madera destartalados. Hongos gigantes emiten un resplandor ámbar y cian, mientras el aire se siente denso, cargado de humedad y el dulce aroma de las esporas flotando en la penumbra.",
        north: 4, //tierra maldita
        south: -1,
        west: -1,
        east: 6, // cueva con lava
        img: "./assets/images/game/rooms/mushroom-cave.png",
      },
      // cueva con lava
      {
        id: 6,
        monsterProb: 0.7,
        isShop: false,
        name: "Forja del Magma Ancestral",
        description:
          "Una forja ancestral se despliega sobre ríos de lava incandescente que iluminan las estatuas de guerreros talladas en la roca. El calor es sofocante y el aire vibra con el rugido constante del magma. Cadenas masivas cuelgan del techo, sugiriendo una industria colosal ahora abandonada al fuego eterno.",
        north: -1,
        south: -1,
        west: 5, // cueva con setas
        east: -1,
        img: "./assets/images/game/rooms/lava-cave.png",
      },
      // templo
      {
        id: 7,
        monsterProb: 1,
        isShop: false,
        name: "Necrópolis de las Estatuas Profanadas",
        description:
          "En las entrañas de un templo profanado, estatuas monumentales custodian pasillos cubiertos de escombros y restos óseos. La luz violeta de las piras proyecta sombras alargadas sobre la piedra fría, mientras un eco metálico recorre las bóvedas, evocando la soledad de un lugar donde el tiempo y la muerte se detuvieron.",
        north: -1,
        south: -1,
        west: 4, //tierra maldita
        east: -1,
        img: "./assets/images/game/rooms/temple.png",
      },
    ],
    enemies: [
      {
        // spectator
        name: "Contemplador",
        // determina si es un enemigo mayor (boss) o menor
        isBoss: true,
        description:
          "Desde un fondo gélido y vacío, surge esta aberración de pesadilla dominada por un ojo central hipnótico y fauces repletas de colmillos irregulares. De su cuerpo quitinoso brotan extremidades serpenteantes que terminan en bulbos oculares purpúreos, siempre vigilantes. La piel oscura y espinosa parece absorber la luz, transmitiendo una inquietante sensación de parálisis y escrutinio eterno.",
        health: 400,
        strength: 22,
        defence: 14,
        // nombre de la imagen que se usara para cada enemigo
        img: "./assets/images/game/enemies/spectator.png",
      },
      {
        // minotaur
        name: "Minotauro",
        isBoss: false,
        description:
          "Una mole de músculo y pelaje castaño se yergue con violencia, empuñando un garrote de piedra tosca. Sus cuernos asimétricos y ojos inyectados en sangre exudan una furia ciega.",
        health: 200,
        strength: 18,
        defence: 16,
        img: "./assets/images/game/enemies/minotaur.png",
      },
      {
        // mimic
        name: "Mímico",
        isBoss: false,
        description:
          "Una aberración de madera y carne que rompe la ilusión del tesoro al desplegar una lengua purpúrea y viscosa entre fauces repletas de colmillos. Su presencia es la encarnación del engaño letal; emana un hambre insaciable que paraliza el corazón y domina el entorno como un depredador supremo.",
        health: 150,
        strength: 16,
        defence: 18,
        img: "./assets/images/game/enemies/mimic.png",
      },
      {
        // woodwoad
        name: "Guardián del bosque",
        isBoss: false,
        description:
          "Una entidad de corteza nudosa y musgo vibrante se camufla entre ramas que sirven de escudo y maza. Sus ojos son apenas destellos de luz ancestral entre la madera retorcida.",
        health: 180,
        strength: 12,
        defence: 17,
        img: "./assets/images/game/enemies/woodwoad.png",
      },
      {
        // redcap
        name: "Duende del pantano",
        isBoss: false,
        description:
          "Un humanoide encorvado de facciones grotescas y largas orejas puntiagudas observa con malicia desde su gorro escarlata. Sus manos ganchudas y botas de hierro sugieren una crueldad metódica.",
        health: 100,
        strength: 14,
        defence: 10,
        img: "./assets/images/game/enemies/redcap.png",
      },
      {
        // kobold
        name: "Kobold",
        isBoss: false,
        description:
          "Este pequeño reptiloide de escamas rojizas acecha en tensión, aferrando una daga y una honda gastada. Su postura ágil y mirada astuta delatan a un superviviente oportunista.",
        health: 80,
        strength: 9,
        defence: 12,
        img: "./assets/images/game/enemies/kobold.png",
      },
    ],
  },
};
