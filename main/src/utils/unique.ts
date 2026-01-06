let counter = 0
function generate() {
  const timestamp = Date.now().toString();
  return Number(timestamp) + counter+ '' +getRandomNumber(1, 8) ;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getId() {
  if(counter >10000) counter = 0
  counter++
  return Number(generate());
}
