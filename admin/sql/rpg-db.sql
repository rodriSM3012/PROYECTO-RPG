CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Nombre del ítem  
    description TEXT, -- Descripción del ítem  
    type ENUM ('weapon', 'armor', 'potion', 'misc') NOT NULL, -- Tipo de ítem     effect 
    INT NOT NULL DEFAULT 0, -- Valor numérico que indica el impacto del ítem     img 
    VARCHAR(255) -- Ruta o URL de la imagen asociada al ítem  
);

CREATE TABLE enemies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Nombre del enemigo     
    description TEXT NOT NULL, -- Descripción del enemigo  
    isBoss BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el enemigo es un jefe     
    health INT NOT NULL, -- Puntos de vida del enemigo     strength INT NOT NULL, -- 
    Fuerza del enemigo defense INT NOT NULL, -- Defensa del enemigo  
    img VARCHAR(255) -- Ruta o URL de la imagen asociada al enemigo  
);