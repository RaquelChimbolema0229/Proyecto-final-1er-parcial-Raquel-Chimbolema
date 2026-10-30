"use strict";

const screenIds = ["welcomeScreen", "menuScreen", "missionScreen", "finalScreen"];
const completed = new Set();
let stars = 0;
let soundOn = true;
let currentMission = null;
let cplusplus = null;

const missions = [
  { id:"fish-home", title:"Los peces encuentran casa", animal:"🐠", icon:"🐟", type:"home", instruction:"Ayuda al pez a llegar a su casa." },
  { id:"colors", title:"Colores del mar", animal:"🐬", icon:"🎨", type:"colors", instruction:"Encuentra el color azul." },
  { id:"count", title:"Cuenta los peces", animal:"🐢", icon:"🔢", type:"count", instruction:"¿Cuántos peces hay?" },
  { id:"shapes", title:"Formas submarinas", animal:"🐙", icon:"🔷", type:"shapes", instruction:"Encuentra el círculo." },
  { id:"animals", title:"¿Quién es el amigo?", animal:"⭐", icon:"🧭", type:"animals", instruction:"Elige al animal que nada muy rápido." },
  { id:"rescue", title:"Gran rescate final", animal:"🏆", icon:"⭐", type:"rescue", instruction:"Ayuda a elegir todos los amigos del océano." }
];

function showScreen(id) {
  screenIds.forEach(screenId => document.getElementById(screenId).classList.toggle("active", screenId === id));
}

function makeBubbles() {
  const layer = document.getElementById("bubbleLayer");
  for (let i = 0; i < 18; i++) {
    const bubble = document.createElement("span");
    bubble.className = "bubble";
    const size = 8 + Math.random() * 34;
    bubble.style.width = bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${7 + Math.random() * 8}s`;
    bubble.style.animationDelay = `${-Math.random() * 10}s`;
    layer.appendChild(bubble);
  }
}

function speak(text) {
  if (!soundOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.82;
  utterance.pitch = 1.15;
  speechSynthesis.speak(utterance);
}

function renderMenu() {
  const grid = document.getElementById("missionGrid");
  grid.innerHTML = "";
  missions.forEach((mission, index) => {
    const available = index === 0 || completed.has(missions[index - 1].id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mission-tile${available ? "" : " locked"}`;
    button.innerHTML = `<span class="tile-stars">${completed.has(mission.id) ? "⭐⭐⭐" : "☆ ☆ ☆"}</span>
      <span class="tile-animal">${mission.animal}</span>${mission.title}`;
    button.addEventListener("click", () => available ? startMission(mission) : playTry("Primero, ayuda al amigo anterior."));
    grid.appendChild(button);
  });
  document.getElementById("scoreValue").textContent = stars;
}

function startMission(mission) {
  currentMission = mission;
  showScreen("missionScreen");
  document.getElementById("missionTitle").textContent = mission.title;
  document.getElementById("missionIcon").textContent = mission.icon;
  document.getElementById("instruction").textContent = mission.instruction;
  document.getElementById("feedback").textContent = "";
  document.getElementById("missionScoreValue").textContent = stars;
  document.getElementById("progressText").textContent = "1 de 1";
  document.getElementById("progressBar").style.width = "0%";
  speak(mission.instruction);

  const area = document.getElementById("playArea");
  area.innerHTML = "";
  if (mission.type === "home") renderFishHome(area);
  if (mission.type === "colors") renderColors(area);
  if (mission.type === "count") renderCount(area);
  if (mission.type === "shapes") renderShapes(area);
  if (mission.type === "animals") renderAnimals(area);
  if (mission.type === "rescue") renderRescue(area);
}

function checkChoice(expected, chosen) {
  if (cplusplus && typeof cplusplus.check_choice === "function") {
    return cplusplus.check_choice(expected, chosen) === 1;
  }
  return String(expected) === String(chosen);
}

function checkCount(expected, chosen) {
  if (cplusplus && typeof cplusplus.check_count === "function") {
    return cplusplus.check_count(expected, chosen) === 1;
  }
  return Number(expected) === Number(chosen);
}

function markCorrect(element) {
  if (element) element.classList.add("correct");
  document.getElementById("feedback").textContent = "¡Muy bien! ✨";
  speak("¡Muy bien!");
  document.getElementById("progressBar").style.width = "100%";
  if (!completed.has(currentMission.id)) {
    completed.add(currentMission.id);
    stars += 3;
    updateScores();
  }
  setTimeout(() => {
    if (currentMission.id === "rescue") {
      showScreen("finalScreen");
    } else {
      renderMenu();
      showScreen("menuScreen");
    }
  }, 1100);
}

function markTry(element, message = "¡Inténtalo otra vez! Tú puedes.") {
  if (element) {
    element.classList.add("try");
    setTimeout(() => element.classList.remove("try"), 420);
  }
  document.getElementById("feedback").textContent = message;
  speak("¡Casi! Inténtalo otra vez.");
}

function playTry(message) {
  speak(message);
  document.getElementById("feedback").textContent = message;
}

function updateScores() {
  document.getElementById("scoreValue").textContent = stars;
  document.getElementById("missionScoreValue").textContent = stars;
}

function answerButton(label, expected, chosen) {
  const button = document.createElement("button");
  button.className = "answer-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => checkChoice(expected, chosen) ? markCorrect(button) : markTry(button));
  return button;
}

function renderFishHome(area) {
  const row = document.createElement("div");
  row.className = "home-row";
  const fish = document.createElement("button");
  fish.className = "fish";
  fish.type = "button";
  fish.textContent = "🐟";
  const coral = document.createElement("button");
  coral.className = "home";
  coral.type = "button";
  coral.innerHTML = "<span>🪸</span><small style='display:block;font-size:14px'>Casa</small>";
  fish.addEventListener("click", () => {
    fish.classList.add("traveling");
    document.getElementById("instruction").textContent = "Ahora, toca la casa del pez.";
    speak("Ahora, toca la casa del pez.");
    coral.classList.add("pulse");
  });
  coral.addEventListener("click", () => markCorrect(coral));
  row.append(fish, coral);
  area.appendChild(row);
}

function renderColors(area) {
  [
    ["Azul", "blue", "blue"], ["Rojo", "red", "red"],
    ["Amarillo", "yellow", "yellow"], ["Verde", "green", "green"]
  ].forEach(([label, color, value]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-dot ${color}`;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => checkChoice("blue", value) ? markCorrect(button) : markTry(button));
    area.appendChild(button);
  });
}

function renderCount(area) {
  const amount = 3 + Math.floor(Math.random() * 3);
  const fishRow = document.createElement("div");
  fishRow.className = "fish-row";
  for (let i = 0; i < amount; i++) {
    const fish = document.createElement("span");
    fish.className = "fish";
    fish.textContent = i % 2 ? "🐠" : "🐟";
    fishRow.appendChild(fish);
  }
  area.appendChild(fishRow);
  [1,2,3,4,5].forEach(number => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "count-button";
    button.textContent = number;
    button.addEventListener("click", () => checkCount(amount, number) ? markCorrect(button) : markTry(button, `Hay ${amount} peces. ¡Casi!`));
    area.appendChild(button);
  });
}

function renderShapes(area) {
  [
    ["circle", "Círculo"], ["square", "Cuadrado"], ["triangle", "Triángulo"]
  ].forEach(([shape, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shape ${shape}`;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => checkChoice("circle", shape) ? markCorrect(button) : markTry(button));
    area.appendChild(button);
  });
}

function renderAnimals(area) {
  document.getElementById("instruction").textContent = "Elige al animal que nada muy rápido.";
  [
    ["🐢", "turtle"], ["🐬", "dolphin"], ["🐙", "octopus"], ["⭐", "star"]
  ].forEach(([emoji, animal]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "animal-choice";
    button.textContent = emoji;
    button.setAttribute("aria-label", animal);
    button.addEventListener("click", () => checkChoice("dolphin", animal) ? markCorrect(button) : markTry(button));
    area.appendChild(button);
  });
}

function renderRescue(area) {
  document.getElementById("instruction").textContent = "Elige todos los amigos del océano.";
  const choices = [
    ["🐬", "dolphin"], ["🐢", "turtle"], ["🐙", "octopus"], ["⭐", "star"], ["🐱", "cat"]
  ];
  const found = new Set();
  choices.forEach(([emoji, animal]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "animal-choice";
    button.textContent = emoji;
    button.setAttribute("aria-label", animal);
    button.addEventListener("click", () => {
      if (["dolphin","turtle","octopus","star"].includes(animal)) {
        found.add(animal);
        button.classList.add("correct");
        button.disabled = true;
        if (found.size === 4) markCorrect(button);
      } else {
        markTry(button, "Ese amigo vive en tierra. ¡Busca a otro!");
      }
    });
    area.appendChild(button);
  });
}

function loadWasm() {
  const script = document.createElement("script");
  script.src = "game.js";
  script.onerror = () => {
    cplusplus = null;
    console.info("C++ WebAssembly no encontrado. Se usa el modo web de respaldo.");
  };
  script.onload = () => {
    if (window.createGameModule) {
      window.createGameModule().then(module => {
        cplusplus = module;
        if (typeof module.ccall === "function") {
          module.check_choice = (expected, chosen) => module.ccall(
            "check_choice", "number", ["string", "string"], [String(expected), String(chosen)]
          );
          module.check_count = (expected, chosen) => module.ccall(
            "check_count", "number", ["number", "number"], [Number(expected), Number(chosen)]
          );
        } else if (typeof module.cwrap === "function") {
          module.check_choice = module.cwrap("check_choice", "number", ["string", "string"]);
          module.check_count = module.cwrap("check_count", "number", ["number", "number"]);
        } else if (typeof module._check_choice === "function") {
          module.check_choice = (expected, chosen) => module._check_choice(String(expected), String(chosen));
          module.check_count = (expected, chosen) => module._check_count(Number(expected), Number(chosen));
        }
        console.info("Motor C++ WebAssembly conectado.");
      }).catch(() => {
        cplusplus = null;
        console.info("No se pudo iniciar WebAssembly; se usa el modo web de respaldo.");
      });
    }
  };
  document.head.appendChild(script);
}

document.getElementById("startButton").addEventListener("click", () => {
  speak("Elige una misión");
  showScreen("menuScreen");
  renderMenu();
});
document.getElementById("homeButton").addEventListener("click", () => showScreen("welcomeScreen"));
document.getElementById("backButton").addEventListener("click", () => { renderMenu(); showScreen("menuScreen"); });
document.getElementById("soundButton").addEventListener("click", event => {
  soundOn = !soundOn;
  event.currentTarget.textContent = soundOn ? "🔊" : "🔇";
});
document.getElementById("playAgainButton").addEventListener("click", () => {
  completed.clear();
  stars = 0;
  renderMenu();
  showScreen("menuScreen");
});

document.addEventListener("pointerdown", event => {
  const colors = ["#fff56a", "#ff5da2", "#3be8ff", "#7cff6b"];
  for (let i = 0; i < 7; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "click-sparkle";
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    sparkle.style.setProperty("--spark", colors[i % colors.length]);
    const angle = (Math.PI * 2 * i) / 7;
    const distance = 24 + Math.random() * 24;
    sparkle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  }
});

document.addEventListener("pointermove", event => {
  const tile = event.target.closest(".mission-tile, .animal-choice, .count-button, .home");
  if (!tile || window.matchMedia("(pointer: coarse)").matches) return;
  const rect = tile.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  tile.style.transform = `translateY(-5px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) scale(1.03)`;
});

document.addEventListener("pointerout", event => {
  const tile = event.target.closest(".mission-tile, .animal-choice, .count-button, .home");
  if (tile) tile.style.transform = "";
});

makeBubbles();
loadWasm();
