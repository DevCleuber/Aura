const sleepInput = document.getElementById("sleepTime");
const calculateBtn = document.getElementById("calculateBtn");
const confirmBtn = document.getElementById("confirmCycleBtn");
const cycleList = document.getElementById("cycleList");
const historyList = document.getElementById("historyList");

let selectedCycle = null;

calculateBtn.addEventListener("click", () => {
  const timeStr = sleepInput.value;

  if (!timeStr) {
    alert("Informe um horário para dormir!");
    return;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const baseTime = new Date();
  baseTime.setHours(hours, minutes, 0, 0);

  cycleList.innerHTML = "";
  selectedCycle = null;

  for (let i = 3; i <= 7; i++) {
    const wakeTime = new Date(baseTime.getTime() + i * 90 * 60000);
    const formatted = wakeTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const durationText = `${(i * 1.5).toFixed(1)}h`;
    const li = document.createElement("li");
    li.textContent = `Acordar às ${formatted} (${durationText}) — ${
      i >= 5 ? "🟢 Bom" : "🟡 Ok"
    }`;

    li.setAttribute("data-time", formatted);
    li.setAttribute("data-duration", durationText);

    li.addEventListener("click", () => {
      document.querySelectorAll("#cycleList li").forEach((el) =>
        el.classList.remove("selected")
      );
      li.classList.add("selected");

      selectedCycle = {
        time: formatted,
        duration: durationText,
        sleep: timeStr,
      };
    });

    cycleList.appendChild(li);
  }
});

confirmBtn.addEventListener("click", () => {
  if (!selectedCycle || !selectedCycle.time || !selectedCycle.sleep) {
    alert("Selecione um horário de dormir e um ciclo!");
    return;
  }

  scheduleRelaxNotification(selectedCycle.sleep);
  saveNight(selectedCycle.sleep, selectedCycle.time, selectedCycle.duration);
  alert("Ciclo salvo com sucesso!");
});

function saveNight(sleep, wake, duration) {
  const history = JSON.parse(localStorage.getItem("sleepHistory")) || [];
  const today = new Date().toLocaleDateString("pt-BR");
  history.unshift(`${today}: dormiu às ${sleep}, acorda às ${wake} (${duration})`);
  localStorage.setItem("sleepHistory", JSON.stringify(history));
  updateHistory();
}

function updateHistory() {
  const history = JSON.parse(localStorage.getItem("sleepHistory")) || [];
  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

function scheduleRelaxNotification(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const relaxTime = new Date();
  relaxTime.setHours(hours, minutes - 30, 0, 0);

  const now = new Date();
  const delay = relaxTime.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(() => {
      alert("Hora de relaxar! Seu sono começa em breve 💤");
    }, delay);
  }
}

updateHistory();
