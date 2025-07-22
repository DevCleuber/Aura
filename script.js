
const sleepInput = document.getElementById("sleep-time");
const saveBtn = document.getElementById("save-btn");
const relaxReminder = document.getElementById("relax-reminder");
const historyList = document.getElementById("history-list");

// Carregar histórico salvo
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("aura-history")) || [];
  historyList.innerHTML = "";
  history.forEach(time => {
    const li = document.createElement("li");
    li.textContent = time;
    historyList.appendChild(li);
  });
}

// Salvar novo horário
saveBtn.addEventListener("click", () => {
  const time = sleepInput.value;
  if (!time) return alert("Escolha uma hora válida.");

  const history = JSON.parse(localStorage.getItem("aura-history")) || [];
  history.unshift(time);
  if (history.length > 10) history.pop();
  localStorage.setItem("aura-history", JSON.stringify(history));
  loadHistory();

  scheduleRelaxReminder(time);
  alert("Hora de dormir salva com sucesso!");
});

// Agendar lembrete (apenas alerta simples)
function scheduleRelaxReminder(timeStr) {
  const now = new Date();
  const [hours, minutes] = timeStr.split(":").map(Number);
  const sleepTime = new Date();
  sleepTime.setHours(hours);
  sleepTime.setMinutes(minutes - 30); // 30 min antes

  let diff = sleepTime - now;
  if (diff < 0) diff += 24 * 60 * 60 * 1000;

  setTimeout(() => {
    alert("⏳ Está na hora de relaxar. Prepare-se para dormir.");
  }, diff);
}

loadHistory();
