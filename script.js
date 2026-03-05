const startBtn = document.getElementById("startBtn");
const target = document.getElementById("target");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");
const bestText = document.getElementById("best");

let gameState = "idle";
let startTime = 0;
let timeoutId = null;
let bestTime = null;

function setTargetClass(nextClass) {
  target.classList.remove("waiting", "ready", "too-soon");
  if (nextClass) {
    target.classList.add(nextClass);
  }
}

function startRound() {
  if (gameState !== "idle") {
    return;
  }

  gameState = "waiting";
  statusText.textContent = "Warte auf Gruen...";
  resultText.textContent = "-";
  setTargetClass("waiting");
  startBtn.disabled = true;

  const delay = Math.floor(Math.random() * 2000) + 1200;

  timeoutId = setTimeout(() => {
    gameState = "ready";
    startTime = performance.now();
    setTargetClass("ready");
    statusText.textContent = "JETZT klicken!";
  }, delay);
}

function handleTooSoon() {
  clearTimeout(timeoutId);
  timeoutId = null;
  gameState = "idle";
  setTargetClass("too-soon");
  statusText.textContent = "Zu frueh! Starte eine neue Runde.";
  resultText.textContent = "Fehlstart";
  startBtn.disabled = false;

  setTimeout(() => {
    if (gameState === "idle") {
      setTargetClass("");
    }
  }, 350);
}

function handleSuccess() {
  const reactionTime = Math.round(performance.now() - startTime);
  resultText.textContent = `${reactionTime} ms`;

  if (bestTime === null || reactionTime < bestTime) {
    bestTime = reactionTime;
    bestText.textContent = `${bestTime} ms`;
  }

  gameState = "idle";
  timeoutId = null;
  setTargetClass("");
  statusText.textContent = "Gut! Druecke Start fuer die naechste Runde.";
  startBtn.disabled = false;
}

function onTargetClick() {
  if (gameState === "waiting") {
    handleTooSoon();
    return;
  }

  if (gameState === "ready") {
    handleSuccess();
    return;
  }

  statusText.textContent = "Druecke zuerst auf Start.";
}

startBtn.addEventListener("click", startRound);
target.addEventListener("click", onTargetClick);
target.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onTargetClick();
  }
});
