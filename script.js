const wakeUpInput = document.getElementById("wakeUpTime");
const calculateBtn = document.getElementById("calculateBtn");
const confirmBtn = document.getElementById("confirmCycleBtn");
const cycleList = document.getElementById("cycleList");
const historyList = document.getElementById("historyList");

let selectedCycle = null;

calculateBtn.addEventListener("click", () => {
  const wakeUpStr = wakeUpInput.value;
  if (!wakeUpStr) {
    alert("Informe um horário para acordar!");
    return;
  }

  const [hours, minutes] = wakeUpStr.split(":").map(Number);
  const wakeUpTime = new Date();
  wakeUpTime.setHours(hours, minutes, 0, 0);

  cycleList.innerHTML = "";
  selectedCycle = null;

  for (let i = 3; i <= 7; i++) {
    const sleepTime = new Date(wakeUpTime.getTime() - i * 90 * 60000);
    const formatted = sleepTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const durationText = `${(i * 1.5).toFixed(1)}h`;
    const li = document.createElement("li");
    li.innerHTML = `Dormir às ${formatted} <span class="duration">(${durationText})</span> <span class="quality ${i >= 5 ? "quality-good" : "quality-ok"}">${i >= 5 ? "Bom" : "Ok"}</span>`;

    li.setAttribute("data-time", formatted);
    li.setAttribute("data-duration", durationText);

    li.addEventListener("click", () => {
      document.querySelectorAll("#cycleList li").forEach((el) =>
        el.classList.remove("selected")
      );
      li.classList.add("selected");

      selectedCycle = {
        wakeUp: wakeUpStr,
        sleep: formatted,
        duration: durationText,
      };
    });

    cycleList.appendChild(li);
  }
});

confirmBtn.addEventListener("click", () => {
  if (!selectedCycle || !selectedCycle.sleep || !selectedCycle.wakeUp) {
    alert("Selecione um horário de dormir e um ciclo!");
    return;
  }

  saveNight(selectedCycle.sleep, selectedCycle.wakeUp, selectedCycle.duration);
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

// Atualiza histórico ao carregar
updateHistory();
