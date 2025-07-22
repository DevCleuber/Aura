function calculateCycles() {
  const input = document.getElementById("sleepTime").value;
  if (!input) return alert("Informe um horário válido.");

  const [h, m] = input.split(":").map(Number);
  const base = new Date();
  base.setHours(h, m, 0, 0);

  const cycleList = document.getElementById("cycleList");
  cycleList.innerHTML = "";

  for (let i = 6; i >= 1; i--) {
    const wakeTime = new Date(base.getTime() + i * 90 * 60000);
    const hours = String(wakeTime.getHours()).padStart(2, "0");
    const minutes = String(wakeTime.getMinutes()).padStart(2, "0");
    const formatted = `${hours}:${minutes}`;
    const li = document.createElement("li");
    li.textContent = `${formatted} — ${i} ciclo(s)`;
    li.onclick = () => {
      document.querySelectorAll("#cycleList li").forEach(item => {
        item.classList.remove("selected");
      });
      li.classList.add("selected");
      saveNight(input, formatted);
      scheduleRelaxAlert(input);
      alert(`Alarme de relaxamento agendado para 30 minutos antes de ${input}.`);
    };
    cycleList.appendChild(li);
  }
}

function saveNight(sleepTime, wakeTime) {
  const history = JSON.parse(localStorage.getItem("auraHistory") || "[]");
  history.unshift({ sleepTime, wakeTime, date: new Date().toLocaleDateString() });
  localStorage.setItem("auraHistory", JSON.stringify(history.slice(0, 10)));
  loadHistory();
}

function loadHistory() {
  const list = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("auraHistory") || "[]");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: Dormiu às ${entry.sleepTime}, acordou às ${entry.wakeTime}`;
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