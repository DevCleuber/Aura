
const sleepInput = document.getElementById("sleep-time");
const calculateBtn = document.getElementById("calculate-btn");
const suggestions = document.getElementById("suggestions");
const cycleOptions = document.getElementById("cycle-options");
const selectedCycle = document.getElementById("selected-cycle");
const confirmBtn = document.getElementById("confirm-btn");
const relaxReminder = document.getElementById("relax-reminder");
const historyList = document.getElementById("history-list");

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("aura-history")) || [];
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

function calculateCycles() {
  const value = sleepInput.value;
  if (!value) return alert("Escolha uma hora válida.");
  const [h, m] = value.split(":").map(Number);
  const base = new Date();
  base.setHours(h, m, 0, 0);

  const cycles = [90, 180, 270, 360, 450, 540]; // minutos de 1 a 6 ciclos
  cycleOptions.innerHTML = "";

  cycles.forEach((mins, index) => {
    const wakeTime = addMinutes(base, mins);
    const li = document.createElement("li");
    li.textContent = `${formatTime(wakeTime)} — ${index + 1} ciclo(s) ${index < 3 ? "⚠️ (sono leve)" : "✅ (bom)"}`;
    li.addEventListener("click", () => selectCycle(formatTime(wakeTime), base));
    cycleOptions.appendChild(li);
  });

  suggestions.classList.remove("hidden");
}

function selectCycle(time, sleepTime) {
  selectedCycle.textContent = `Você escolheu acordar às ${time}`;
  selectedCycle.dataset.sleepTime = sleepTime.toISOString();
  confirmBtn.parentElement.classList.remove("hidden");
}

function confirmCycle() {
  const sleepTime = new Date(selectedCycle.dataset.sleepTime);
  const history = JSON.parse(localStorage.getItem("aura-history")) || [];
  history.unshift(sleepTime.toTimeString().slice(0, 5));
  if (history.length > 10) history.pop();
  localStorage.setItem("aura-history", JSON.stringify(history));
  loadHistory();

  scheduleRelaxReminder(sleepTime);
  alert("Ciclo salvo com sucesso!");
}

function scheduleRelaxReminder(time) {
  const now = new Date();
  const relaxTime = new Date(time.getTime() - 30 * 60000);
  let diff = relaxTime - now;
  if (diff < 0) diff += 24 * 60 * 60 * 1000;

  setTimeout(() => {
    alert("⏳ Está na hora de relaxar. Prepare-se para dormir.");
  }, diff);

  relaxReminder.textContent = `Alerta programado para ${formatTime(relaxTime)}.`;
}

calculateBtn.addEventListener("click", calculateCycles);
confirmBtn.addEventListener("click", confirmCycle);

loadHistory();
