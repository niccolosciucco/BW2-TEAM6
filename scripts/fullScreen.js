// #region FULLSCREEN PLAYER
const btnFullscreen = document.getElementById("btn-fullscreen");
const fullscreenPlayer = document.getElementById("fullscreen-player");
const btnCloseFullscreen = document.getElementById("btn-close-fullscreen");
const fsPlayBtn = document.getElementById("fs-play-btn");

if (btnFullscreen) {
  btnFullscreen.addEventListener("click", () => {
    const coverSrc = document.getElementById("cover-canzone").src;
    document.getElementById("fs-cover").src = coverSrc;
    document.getElementById("fs-title").innerText = document.getElementById("titolo-canzone").innerText;
    document.getElementById("fs-artist").innerText = document.getElementById("nome-artista").innerText;

    // Colore dinamico dalla cover
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = coverSrc;
    img.onload = function () {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(img);
      fullscreenPlayer.style.background = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), #121212)`;
    };

    fullscreenPlayer.style.display = "flex";
  });
}

if (btnCloseFullscreen) {
  btnCloseFullscreen.addEventListener("click", () => {
    fullscreenPlayer.style.display = "none";
  });
}

if (fsPlayBtn) {
  fsPlayBtn.addEventListener("click", () => {
    if (!audio) return;
    const mainBtn = document.getElementById("play-main");
    if (audio.paused) {
      audio.play();
      updateBtnIcon(mainBtn, true);
      updateBtnIcon(fsPlayBtn, true);
    } else {
      audio.pause();
      updateBtnIcon(mainBtn, false);
      updateBtnIcon(fsPlayBtn, false);
    }
  });
}
// #endregion

const fsRange = document.getElementById("fs-track-range");
if (fsRange) {
  fsRange.addEventListener("input", (e) => {
    if (audio) audio.currentTime = e.target.value;
  });
}

