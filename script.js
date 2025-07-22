function calculateCycles() {
  const input = document.getElementById("sleepTime").value;
  if (!input) return alert("Informe a hora para dormir!");

  const [hours, minutes] = input.split(":").map(Number);
  const sleepTime = new Date();
  sleepTime.setHours(hours, minutes, 0, 0);

  const cycleList = document.getElementById("cycleList");
  cycleList.innerHTML = "";

  const cycles = [];
  for (let i = 1; i <= 6; i++) {
    const wakeTime = new Date(sleepTime.getTime() + 90 * 60000 * i);
    const formatted = wakeTime.toTimeString().slice(0, 5);
    const qualidade = i >= 4 ? "Ótimo ciclo (sono profundo)" : "Ciclo leve";
    cycles.push({ time: formatted, quality: qualidade });

    const li = document.createElement("li");
    li.textContent = `${formatted} – ${qualidade}`;
    li.onclick = () => {
  // Remove seleção anterior
  document.querySelectorAll("#cycleList li").forEach(item => {
    item.classList.remove("selected");
  });

  // Marca o clicado
  li.classList.add("selected");

  // Salva e agenda alerta
  saveNight(input, formatted);
  scheduleRelaxAlert(input);
  alert(`Alarme de relaxamento agendado para 30 minutos antes de ${input}.`);
};

    cycleList.appendChild(li);
  }

  document.getElementById("results").classList.remove("hidden");
}

function saveNight(sleep, wake) {
  const data = {
    sleep,
    wake,
    date: new Date().toLocaleDateString("pt-BR"),
  };

  const history = JSON.parse(localStorage.getItem("auraHistory")) || [];
  history.unshift(data);
  if (history.length > 10) history.pop();
  localStorage.setItem("auraHistory", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("auraHistory")) || [];
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  history.forEach(({ sleep, wake, date }) => {
    const li = document.createElement("li");
    li.textContent = `${date}: Dormiu às ${sleep} → Acordou às ${wake}`;
    list.appendChild(li);
  });
}

function scheduleRelaxAlert(sleepTimeStr) {
  const [h, m] = sleepTimeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m - 30, 0, 0); // 30 min antes
  const delay = target.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(() => {
      alert("⏳ Hora de relaxar! Prepare-se para dormir.");
    }, delay);
  }
}

loadHistory();
