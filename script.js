const config = window.VALENTINE_CONFIG;

window.addEventListener("DOMContentLoaded", () => {
  // Title + texts
  document.title = config.pageTitle;
  document.getElementById("valentineTitle").textContent = `${config.valentineName}, my love...`;

  document.getElementById("page1Text").textContent = config.page1Question;

  document.getElementById("page2Text").textContent = config.page2Question;
  document.getElementById("startText").textContent = config.page2StartText;

  document.getElementById("page3Title").textContent = config.page3Title;
  document.getElementById("finalMessage").innerText = config.finalMessage;

  // Buttons
  document.getElementById("yesBtn").addEventListener("click", () => showPage("page2"));
  document.getElementById("noBtn").addEventListener("click", (e) => moveButton(e.target));

  document.getElementById("nextBtn").addEventListener("click", () => showPage("page3"));
  document.getElementById("backBtn").addEventListener("click", () => showPage("page2"));

  // Love meter
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");

  loveMeter.value = 100;
  loveValue.textContent = "100";

  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value, 10);
    loveValue.textContent = String(value);

    if (value > 100) {
      extraLove.classList.remove("hidden");

      if (value >= 5000) extraLove.textContent = config.loveMessages.extreme;
      else if (value > 1000) extraLove.textContent = config.loveMessages.high;
      else extraLove.textContent = config.loveMessages.normal;
    } else {
      extraLove.classList.add("hidden");
      extraLove.textContent = "";
    }
  });

  // Floating emojis
  createFloatingElements();

  // Music
  setupMusicPlayer();
});

function showPage(pageId) {
  document.querySelectorAll(".question-section").forEach((s) => s.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  container.innerHTML = "";

  // create a bunch of floating emojis
  for (let i = 0; i < 18; i++) {
    const emoji = config.floatingEmojis[Math.floor(Math.random() * config.floatingEmojis.length)];
    const el = document.createElement("div");
    el.className = "float-emoji";
    el.textContent = emoji;

    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDelay = Math.random() * 6 + "s";
    el.style.animationDuration = 10 + Math.random() * 18 + "s";
    el.style.fontSize = (1.3 + Math.random() * 1.3).toFixed(2) + "rem";

    container.appendChild(el);
  }
}

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
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.load();

  if (config.music.autoplay) {
    bgMusic.play().then(() => {
      musicToggle.textContent = config.music.stopText;
    }).catch(() => {
      musicToggle.textContent = config.music.startText;
    });
  } else {
    musicToggle.textContent = config.music.startText;
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
