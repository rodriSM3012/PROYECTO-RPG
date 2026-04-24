// funcion para generar el log que aparecera en el historial 
export function logMessage(text) {
  let historyList = document.getElementById("historyList");
  const maxMessages = 50; // variable para establecer el maximo de mensajes posibles al mismo tiempo

  // crea un elemento nuevo y se le inserta la variabel text como contenido con innerHTML
  const newLi = document.createElement("li");
  newLi.innerHTML = text;
  historyList.appendChild(newLi); // se añade el elemento creado al historial

  // asegura que siempre se vea el ultimo mensaje
  historyList.scrollTop = historyList.scrollHeight;

  // si la cantidad de mensajes (child) en historyList supera el maximo (maxMessages) borra el primero
  if (historyList.childElementCount > maxMessages) {
    historyList.removeChild(historyList.firstChild);
  }
}
