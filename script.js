const sleepInput = document.getElementById("sleepTime");
const calculateBtn = document.getElementById("calculateBtn");
const confirmBtn = document.getElementById("confirmCycleBtn");
const cycleList = document.getElementById("cycleList");
const historyList = document.getElementById("historyList");

let selectedCycle = null;

calculateBtn.onclick = () => {
  const timeStr = sleepInput.value;
  if (!timeStr) {
    alert("Insira um horário de dormir!");
    return;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const baseTime = new Date();
  baseTime.setHours(hours);
  baseTime.setMinutes(minutes);
  baseTime.setSeconds(0);

  const cycles = [];
  cycleList.innerHTML = "";
  selectedCycle = null;

  for (let i = 3; i <= 6; i++) {
    const wakeTime = new Date(baseTime.getTime() + i * 90 * 60000);
    const formatted = wakeTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const durationText = `${i * 1.5}h`;
    const li = document.createElement("li");
    li.textContent = `Acordar às ${formatted} (${durationText}) — ${
      i >= 5 ? "🟢 Bom" : "🟡 Ok"
    }`;
    li.setAttribute("data-time", formatted);
    li.setAttribute("data-duration", durationText);

    li.onclick = () => {
      document.querySelectorAll("#cycleList li").forEach((el) =>
        el.classList.remove("selected")
      );
      li.classList.add("selected");
      selectedCycle = {
        time: formatted,
        duration: durationText,
      };
    };

    cycleList.appendChild(li);
    cycles.push(li);
  }
};

confirmBtn.onclick = () => {
  const sleepTime = sleepInput.value;
  const selectedLi = document.querySelector("#cycleList li.selected");

  if (!sleepTime || !selectedLi) {
    alert("Por favor, selecione um horário de dormir e um ciclo.");
    return;
  }

  const cycleTime = selectedLi.getAttribute("data-time");
  const duration = selectedLi.getAttribute("data-duration");

  scheduleRelaxNotification(sleepTime);
  saveNight(sleepTime, cycleTime, duration);
  alert("Ciclo confirmado e salvo!");
};

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
  relaxTime.setHours(hours);
  relaxTime.setMinutes(minutes - 30);
  relaxTime.setSeconds(0);

  const now = new Date();
  const delay = relaxTime.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(() => {
      alert("Hora de relaxar! Seu sono começa em breve 💤");
    }, delay);
  }
}

// Atualiza histórico ao carregar
updateHistory();
