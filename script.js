let selectedCycle = null;
let selectedCyclesCount = 0;

function calculateCycles() {
  const input = document.getElementById("sleepTime").value;
  if (!input) return alert("Informe um horário válido.");

  const [h, m] = input.split(":").map(Number);
  const base = new Date();
  base.setHours(h, m, 0, 0);

  const cycleList = document.getElementById("cycleList");
  const confirmBtn = document.getElementById("confirmButton");
  cycleList.innerHTML = "";
  confirmBtn.classList.add("hidden");
  selectedCycle = null;

  for (let i = 6; i >= 1; i--) {
    const wakeTime = new Date(base.getTime() + i * 90 * 60000);
    const hours = String(wakeTime.getHours()).padStart(2, "0");
    const minutes = String(wakeTime.getMinutes()).padStart(2, "0");
    const totalSleep = (i * 1.5).toFixed(1);
    const formatted = `${hours}:${minutes}`;
    const li = document.createElement("li");
    li.textContent = `${formatted} — ${i} ciclo(s) ≈ ${totalSleep}h de sono`;
    li.onclick = () => {
      document.querySelectorAll("#cycleList li").forEach(item => {
        item.classList.remove("selected");
      });
      li.classList.add("selected");
      selectedCycle = { sleepTime: input, wakeTime: formatted };
      selectedCyclesCount = i;
      confirmBtn.classList.remove("hidden");
    };
    cycleList.appendChild(li);
  }
}

function confirmCycle() {
  if (!selectedCycle) return;

  saveNight(selectedCycle.sleepTime, selectedCycle.wakeTime, selectedCyclesCount);
  scheduleRelaxAlert(selectedCycle.sleepTime);
  alert(`Alarme de relaxamento agendado para 30 minutos antes de ${selectedCycle.sleepTime}.`);
}

function saveNight(sleepTime, wakeTime, cycles) {
  const history = JSON.parse(localStorage.getItem("auraHistory") || "[]");
  const total = (cycles * 1.5).toFixed(1);
  history.unshift({ sleepTime, wakeTime, total, date: new Date().toLocaleDateString() });
  localStorage.setItem("auraHistory", JSON.stringify(history.slice(0, 10)));
  loadHistory();
}

function loadHistory() {
  const list = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("auraHistory") || "[]");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: Dormiu às ${entry.sleepTime}, acordou às ${entry.wakeTime} (${entry.total}h)`;
    list.appendChild(li);
  });
}

function scheduleRelaxAlert(sleepTime) {
  const [h, m] = sleepTime.split(":").map(Number);
  const relaxTime = new Date();
  relaxTime.setHours(h, m - 30, 0, 0);
  const now = new Date();
  const delay = relaxTime.getTime() - now.getTime();
  if (delay > 0) {
    setTimeout(() => {
      alert("Hora de começar a relaxar para dormir bem. 💤");
    }, delay);
  }
}

window.onload = loadHistory;