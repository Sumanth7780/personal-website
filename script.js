// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
  const warnings = [];

  if (!config.valentineName) {
    warnings.push("Valentine's name is not set! Using default.");
    config.valentineName = "My Love";
  }

  const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  Object.entries(config.colors).forEach(([key, value]) => {
    if (!isValidHex(value)) {
      warnings.push(`Invalid color for ${key}! Using default.`);
      config.colors[key] = getDefaultColor(key);
    }
  });

  if (parseFloat(config.animations.floatDuration) < 5) {
    warnings.push("Float duration too short! Setting to 5s minimum.");
    config.animations.floatDuration = "5s";
  }

  if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
    warnings.push("Heart explosion size should be between 1 and 3! Using default.");
    config.animations.heartExplosionSize = 1.5;
  }

  if (warnings.length > 0) {
    console.warn("⚠️ Configuration Warnings:");
    warnings.forEach((w) => console.warn("- " + w));
  }
}

function getDefaultColor(key) {
  const defaults = {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757",
  };
  return defaults[key];
}

document.title = config.pageTitle;

window.addEventListener("DOMContentLoaded", () => {
  validateConfig();

  // Title
  document.getElementById("valentineTitle").textContent = `${config.valentineName}, my love...`;

  // Question 3 (Start)
  document.getElementById("question3Text").textContent = config.questions.third.text;
  document.getElementById("yesBtn3").textContent = config.questions.third.yesBtn;
  document.getElementById("noBtn3").textContent = config.questions.third.noBtn;

  // Question 2 (Love meter)
  document.getElementById("question2Text").textContent = config.questions.second.text;
  document.getElementById("startText").textContent = config.questions.second.startText;
  document.getElementById("nextBtn").textContent = config.questions.second.nextBtn;

  // Buttons flow:
  // YES on question3 -> go to question2
  document.getElementById("yesBtn3").addEventListener("click", () => showNextQuestion(2));

  // Next on question2 -> show message box
  document.getElementById("nextBtn").addEventListener("click", showMessageBox);

  // Modal close
  document.getElementById("modalCloseBtn").addEventListener("click", closeMessageBox);
  document.getElementById("messageModal").addEventListener("click", (e) => {
    if (e.target.id === "messageModal") closeMessageBox();
  });

  createFloatingElements();
  setupMusicPlayer();
  setInitialPosition();
});

// Floating elements
function createFloatingElements() {
  const container = document.querySelector(".floating-elements");

  config.floatingEmojis.hearts.forEach((heart) => {
    const div = document.createElement("div");
    div.className = "heart";
    div.innerHTML = heart;
    setRandomPosition(div);
    container.appendChild(div);
  });

  config.floatingEmojis.bears.forEach((bear) => {
    const div = document.createElement("div");
    div.className = "bear";
    div.innerHTML = bear;
    setRandomPosition(div);
    container.appendChild(div);
  });
}

function setRandomPosition(element) {
  element.style.left = Math.random() * 100 + "vw";
  element.style.animationDelay = Math.random() * 5 + "s";
  element.style.animationDuration = 10 + Math.random() * 20 + "s";
}

// Show next section
function showNextQuestion(questionNumber) {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  document.getElementById(`question${questionNumber}`).classList.remove("hidden");
}

// Move No button
function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

// Love meter
const loveMeter = document.getElementById("loveMeter");
const loveValue = document.getElementById("loveValue");
const extraLove = document.getElementById("extraLove");

function setInitialPosition() {
  if (!loveMeter) return;
  loveMeter.value = 100;
  loveValue.textContent = 100;
  loveMeter.style.width = "100%";
}

if (loveMeter) {
  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;

    if (value > 100) {
      extraLove.classList.remove("hidden");
      const overflowPercentage = (value - 100) / 9900;
      const extraWidth = overflowPercentage * window.innerWidth * 0.8;
      loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
      loveMeter.style.transition = "width 0.3s";

      if (value >= 5000) {
        extraLove.classList.add("super-love");
        extraLove.textContent = config.loveMessages.extreme;
      } else if (value > 1000) {
        extraLove.classList.remove("super-love");
        extraLove.textContent = config.loveMessages.high;
      } else {
        extraLove.classList.remove("super-love");
        extraLove.textContent = config.loveMessages.normal;
      }
    } else {
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
      loveMeter.style.width = "100%";
    }
  });
}

// ✅ Message box
function showMessageBox() {
  const modal = document.getElementById("messageModal");
  modal.classList.remove("hidden");

  document.getElementById("modalTitle").textContent = config.finalMessageBox.title;
  document.getElementById("modalMessage").textContent = config.finalMessageBox.message;
  document.getElementById("modalEmojis").textContent = config.finalMessageBox.emojis;
  document.getElementById("modalCloseBtn").textContent = config.finalMessageBox.buttonText || "Close";
}

function closeMessageBox() {
  document.getElementById("messageModal").classList.add("hidden");
}

// Music
function setupMusicPlayer() {
  const musicControls = document.getElementById("musicControls");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicSource = document.getElementById("musicSource");

  if (!config.music.enabled) {
    musicControls.style.display = "none";
    return;
  }

  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume || 0.5;
  bgMusic.load();

  if (config.music.autoplay) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicToggle.textContent = config.music.stopText;
        })
        .catch(() => {
          musicToggle.textContent = config.music.startText;
        });
    }
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = config.music.stopText;
    } else {
      bgMusic.pause();
      musicToggle.textContent = config.music.startText;
    }
  });
}
