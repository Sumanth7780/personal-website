const config = window.VALENTINE_CONFIG;

window.addEventListener("DOMContentLoaded", () => {
  // Title
  document.title = config.pageTitle;
  document.getElementById("valentineTitle").textContent = `${config.valentineName}, my love...`;

  // Start question (Valentine question)
  document.getElementById("question3Text").textContent = config.questions.third.text;
  document.getElementById("yesBtn3").textContent = config.questions.third.yesBtn;
  document.getElementById("noBtn3").textContent = config.questions.third.noBtn;

  // Love meter page
  document.getElementById("question2Text").textContent = config.questions.second.text;
  document.getElementById("startText").textContent = config.questions.second.startText;
  document.getElementById("nextBtn").textContent = config.questions.second.nextBtn;

  // Button actions
  document.getElementById("yesBtn3").addEventListener("click", () => showOnly("question2"));
  document.getElementById("noBtn3").addEventListener("click", (e) => moveButton(e.target));

  document.getElementById("nextBtn").addEventListener("click", showMessageBox);

  // Modal close
  document.getElementById("modalCloseBtn").addEventListener("click", closeMessageBox);
  document.getElementById("messageModal").addEventListener("click", (e) => {
    if (e.target.id === "messageModal") closeMessageBox();
  });

  // Love meter logic
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");

  loveMeter.value = 100;
  loveValue.textContent = 100;

  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value, 10);
    loveValue.textContent = value;

    if (value > 100) {
      extraLove.classList.remove("hidden");

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
      extraLove.textContent = "";
    }
  });

  // Floating emojis
  createFloatingElements();

  // Music
  setupMusicPlayer();
});

function showOnly(sectionId) {
  document.querySelectorAll(".question-section").forEach((s) => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}

function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

function createFloatingElements() {
  const container = document.querySelector(".floating-elements");

  [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears].forEach((emoji) => {
    const div = document.createElement("div");
    div.className = config.floatingEmojis.hearts.includes(emoji) ? "heart" : "bear";
    div.textContent = emoji;

    div.style.left = Math.random() * 100 + "vw";
    div.style.top = Math.random() * 100 + "vh";
    div.style.animationDelay = Math.random() * 5 + "s";
    div.style.animationDuration = 10 + Math.random() * 20 + "s";

    container.appendChild(div);
  });
}

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
