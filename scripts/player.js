// #region VOLUME MUSICA
const initVolumeControl = () => {
  const volumeRange = document.getElementById("volume-range");
  const volumeIcon = document.getElementById("volume-icon");

  if (!volumeRange) return;

  volumeRange.style.setProperty(
    "--vol-progress",
    `${volumeRange.value * 100}%`,
  );

  volumeRange.addEventListener("input", (e) => {
    const val = e.target.value;

    volumeRange.style.setProperty("--vol-progress", `${val * 100}%`);

    if (audio) {
      audio.volume = val;
    }
    if (val == 0) {
      volumeIcon.classList.replace("bi-volume-up", "bi-volume-mute");
      volumeIcon.classList.replace("bi-volume-down", "bi-volume-mute");
    } else if (val < 0.5) {
      volumeIcon.classList.replace("bi-volume-up", "bi-volume-down");
      volumeIcon.classList.replace("bi-volume-mute", "bi-volume-down");
    } else {
      volumeIcon.classList.replace("bi-volume-down", "bi-volume-up");
      volumeIcon.classList.replace("bi-volume-mute", "bi-volume-up");
    }
  });
};
// #endregion

// #region PLAY AND PAUSE MUSIC
let audio = null;
let currentCardBtnId = null; // Memorizza l'ultimo bottone card cliccato

const handleMusic = (
  title = "",
  name = "",
  cover = "",
  preview,
  isMobile,
  isMouseHover = false,
  idBtn = "",
) => {
  const volumeSlider = document.getElementById("volume-range");
  const currentSavedVolume = volumeSlider ? Number(volumeSlider.value) : 1;

  if (audio && audio.src !== preview) {
    if (currentCardBtnId) {
      updateBtnIcon(document.getElementById(currentCardBtnId), false);
    }

    audio.pause();
    audio = new Audio(preview);

    // volume musica attuale
    audio.volume = currentSavedVolume;

    syncProgressBar(audio);
  }

  if (!audio) {
    audio = new Audio(preview);

    // Volume musica
    audio.volume = currentSavedVolume;

    syncProgressBar(audio);
  }

  // Memorizzo id bottone
  currentCardBtnId = idBtn;

  let btn;

  if (isMobile) {
    btn = document.getElementById("play-mobile");
  } else if (isMouseHover) {
    btn = document.getElementById(idBtn);
  } else {
    btn = document.getElementById("play");
  }

  // recupero bottone play footer
  const mainBtn = document.getElementById("play-main");

  // Logica Play/Pause
  if (audio.paused) {
    audio.play();
    updateBtnIcon(btn, true);
    updateBtnIcon(mainBtn, true); // Sincronizza footer
  } else {
    audio.pause();
    updateBtnIcon(btn, false);
    updateBtnIcon(mainBtn, false); // Sincronizza footer
  }

  handleFooter(title, name, cover, preview);

  // Salvataggio dati
  localStorage.setItem(
    "lastTrack",
    JSON.stringify({ title, name, cover, preview }),
  );
};

// Bottone play footer
document.getElementById("play-main").addEventListener("click", () => {
  if (!audio) return;

  const mainBtn = document.getElementById("play-main");
  const cardBtn = document.getElementById(currentCardBtnId);

  if (audio.paused) {
    audio.play();
    updateBtnIcon(mainBtn, true);
    if (cardBtn) updateBtnIcon(cardBtn, true); // Sincronizza anche la card
  } else {
    audio.pause();
    updateBtnIcon(mainBtn, false);
    if (cardBtn) updateBtnIcon(cardBtn, false); // Sincronizza anche la card
  }
});

const handleFooter = function (title, name, cover, preview) {
  const songTitle = document.getElementById("titolo-canzone");
  if (songTitle) songTitle.innerHTML = title;

  const artist = document.getElementById("nome-artista");
  if (artist) artist.innerHTML = name;

  const coverSong = document.getElementById("cover-canzone");
  if (coverSong) coverSong.setAttribute("src", cover);

  const sbRightArtist = document.getElementById("sb-right-name-artist");
  if (sbRightArtist) sbRightArtist.innerText = name;

  const sbRightTitle = document.getElementById("sb-right-title");
  if (sbRightTitle) sbRightTitle.innerText = title;

  const sbRightSubTitle = document.getElementById("sb-right-subTitle");
  if (sbRightSubTitle) sbRightSubTitle.innerText = name;

  const sbRightImg = document.getElementById("sb-right-img");
  if (sbRightImg) sbRightImg.setAttribute("src", cover);

  const iaImg = document.getElementById("ia-img");
  if (iaImg) iaImg.setAttribute("src", cover);

  const iaName = document.getElementById("ia-name");
  if (iaName) iaName.innerText = name;

  const riconoscimenti = document.getElementById("riconoscimenti-name");
  if (riconoscimenti) riconoscimenti.innerText = name;
};

const updateBtnIcon = (btn, isPlaying) => {
  if (!btn) return;

  const icon = btn.querySelector("i") || btn;

  // Gestione Colore
  if (isPlaying) {
    btn.classList.replace("btn-success", "btn-warning");
  } else {
    btn.classList.replace("btn-warning", "btn-success");
  }

  // 1. Gestione PC
  if (btn.id === "play") {
    btn.innerText = isPlaying ? "Pause" : "Play";
    return;
  }

  // 2. Gestione icone per Mobile e Carousel
  if (isPlaying) {
    icon.classList.replace("bi-play-fill", "bi-pause-fill");
    icon.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
  } else {
    icon.classList.replace("bi-pause-fill", "bi-play-fill");
    icon.classList.replace("bi-play-circle-fill", "bi-play-circle-fill");
  }
};

initVolumeControl();
// #endregion

// #region RIPRODUZIONE MUSICA
let animationId;

const syncProgressBar = (audioInstance) => {
  const range = document.getElementById("track-range");
  const currentTimeLabel = document.getElementById("current-time");
  const durationLabel = document.getElementById("track-duration");

  const update = () => {
    if (!audioInstance.paused) {
      const current = audioInstance.currentTime;
      const duration = audioInstance.duration || 29;

      const percent = (current / duration) * 100;
      range.style.setProperty("--progress", `${percent}%`);

      range.value = current;

      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      currentTimeLabel.innerText = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

      animationId = requestAnimationFrame(update);
    }
  };

  audioInstance.onplay = () => {
    range.max = audioInstance.duration || 29;
    update();
  };

  audioInstance.onpause = () => {
    cancelAnimationFrame(animationId);
  };

  audioInstance.onended = () => {
    cancelAnimationFrame(animationId);

    range.value = 0;

    // Reset colore barra
    range.style.setProperty("--progress", `0%`);

    // Reset del testo tempo
    currentTimeLabel.innerText = "0:00";

    // resetto la barra
    const mainBtn = document.getElementById("play-main");
    if (mainBtn) updateBtnIcon(mainBtn, false);
    if (currentCardBtnId)
      updateBtnIcon(document.getElementById(currentCardBtnId), false);
  };

  range.oninput = () => {
    cancelAnimationFrame(animationId);
    audioInstance.currentTime = range.value;

    if (!audioInstance.paused) update();
  };
};
// #endregion

// #region PERSISTENZA CAMBIO PAGINA
// Ogni secondo salviamo dove siamo arrivati con la canzone
setInterval(() => {
  if (audio && !audio.paused) {
    localStorage.setItem("lastTime", audio.currentTime);
  }
}, 1000);

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lastTrack");
  const savedTime = localStorage.getItem("lastTime");

  if (saved) {
    const t = JSON.parse(saved);
    // Popoliamo il footer così non appare vuoto
    handleFooter(t.title, t.name, t.cover, t.preview);

    audio = new Audio(t.preview);
    const volumeSlider = document.getElementById("volume-range");
    audio.volume = volumeSlider ? Number(volumeSlider.value) : 1;

    // Se avevamo un tempo salvato, lo impostiamo al caricamento
    if (savedTime) {
      audio.addEventListener(
        "loadedmetadata",
        () => {
          audio.currentTime = parseFloat(savedTime);
        },
        { once: true },
      );
    }

    // Colleghiamo la barra del tempo all'audio appena creato
    syncProgressBar(audio);
  }
});
// #endregion
