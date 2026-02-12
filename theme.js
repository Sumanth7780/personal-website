window.addEventListener("DOMContentLoaded", () => {
  const c = window.VALENTINE_CONFIG;

  const root = document.documentElement;
  root.style.setProperty("--bg1", c.colors.backgroundStart);
  root.style.setProperty("--bg2", c.colors.backgroundEnd);
  root.style.setProperty("--btn", c.colors.buttonBackground);
  root.style.setProperty("--btnHover", c.colors.buttonHover);
  root.style.setProperty("--txt", c.colors.textColor);

  root.style.setProperty("--floatDuration", c.animations.floatDuration);
  root.style.setProperty("--floatDistance", c.animations.floatDistance);
  root.style.setProperty("--bounceSpeed", c.animations.bounceSpeed);
});
