const defaultGameState = {
  player: {
    // nombre del jugador
    name: "Rodrigo",
    // salud que tiene el jugador
    health: 30,
    // fuerza del jugador
    strength: 14,
    // bonus de fuerza del jugador
    strengthBonus: 2,
    // defensa del jugador
    defense: 12,
    // bonus de defensa del jugador
    defenseBonus: 0,
    // id de la habitación en la que se encuentra el jugador
    currentRoom: 0,
    // cantidad de dinero que tiene el jugador
    gold: 300,
    // cantidad de pociones que tiene el jugador
    potions: 3,
  },
  map: {
    /*
    MAPA: 
                              +----------------+       
                              | 3 sala tesoro  |        
                              +----------------+       
                                        |              
                                        |              
  +---------+---------+       +---------+---------+       +---------+---------+
  | 4 tienda          |-------| 2 pasillo         |-------| 5 sala cadenas    |
  +-------------------+       +---------+---------+       +-------------------+
                                        |
                                        |
                              +---------+---------+
                              | 1 entrada         |
                              +---------+---------+
                                        |
                                        |
                              +---------+---------+
                              | 0 pueblo          |
                              +-------------------+
    */
    rooms: [
      // entrada
      {
        // id de la sala
        id: 1,
        // probabilidad de cada ubicacion para que aparezca un monstruo
        monsterProb: 0.0,
        // determina si la sala es una tienda donde comprar o no
        isShop: false,
        // nombre de la sala
        name: "Entrada a la mazmorra",
        // descripcion de la sala
        description: "",
        // incluye la id de la sala que se encuentra al norte
        north: 2, // pasillo
        // incluye la id de la sala que se encuentra al sur
        south: 0, // pueblo
        // incluye la id de la sala que se encuentra al oeste
        west: null,
        // incluye la id de la sala que se encuentra al este
        east: null,
        // nombre de la imagen que se usara para cada ubicacion
        img: "/assets/images/game/rooms/entrada.png",
      },
      // pueblo
      {
        id: 0,
        monsterProb: 0.0,
        isShop: false,
        name: "Poblado de humanos",
        description: "",
        north: 1, // entrada
        south: null,
        west: null,
        east: null,
        img: "/assets/images/game/rooms/pueblo.png",
      },
      // pasillo
      {
        id: 2,
        monsterProb: 0.25,
        isShop: false,
        name: "Pasillo principal",
        description: "",
        north: 3, // sala del tesoro
        south: 1, // entrada
        west: 4, // tienda
        east: 5, // sala con cadenas
        img: "/assets/images/game/rooms/pasillo.png",
      },
      // sala del tesoro
      {
        id: 3,
        monsterProb: 0.7,
        isShop: false,
        name: "Cueva con un cofre del tesoro",
        description: "",
        north: null,
        south: 2, // pasillo
        west: null,
        east: null,
        img: "/assets/images/game/rooms/tesoro.png",
      },
      // tienda
      {
        id: 4,
        monsterProb: 0.05,
        isShop: true,
        name: "Tienda del alquimista",
        description: "",
        north: null,
        south: null,
        west: null,
        east: 1, // pasillo
        img: "/assets/images/game/rooms/shop.png",
      },
      // sala con cadenas
      {
        id: 5,
        monsterProb: 0.9,
        isShop: false,
        name: "Sala con cadenas",
        description: "",
        north: null,
        south: null,
        west: 1, // pasillo
        east: null,
        img: "/assets/images/game/rooms/room.png",
      },
    ],
    enemies: [
      // dragon
      {
        // nombre del enemigo
        name: "Dragón dorado",
        // determina si es un enemigo mayor (boss) o menor
        isBoss: true,
        // descripcion del enemigo
        description: "",
        // salud que tiene el enemigo
        health: 340,
        // fuerza del enemigo
        strength: 19,
        // defensa del enemigo
        defence: 13,
        // nombre de la imagen que se usara para cada enemigo
        img: "/assets/images/game/enemies/dragon.png",
      },
      // orco
      {
        name: "Orco",
        isBoss: false,
        description: "",
        health: 90,
        strength: 17,
        defence: 16,
        img: "/assets/images/game/enemies/orc.png",
      },
      // gobin
      {
        name: "Goblin",
        isBoss: false,
        description: "",
        health: 20,
        strength: 11,
        defence: 9,
        img: "/assets/images/game/enemies/goblin.png",
      },
    ],
  },
};
