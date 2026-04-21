class GeneralMusic {
  constructor() {
    this.data = null;
    this.artist = null;
    this.album = null;
    this.isLoaded = false;
  }

  initData(objData) {
    this.data = objData.data;
    this.artist = objData.artist;
    this.album = objData.album;
    this.isLoaded = true;

    console.log(this.artist);
  }
}

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
  songTitle.innerHTML = title;

  const artist = document.getElementById("nome-artista");
  artist.innerHTML = name;

  const coverSong = document.getElementById("cover-canzone");
  coverSong.setAttribute("src", cover);

  const sbRightArtist = document.getElementById("sb-right-name-artist");
  sbRightArtist.innerText = name;

  const sbRightTitle = document.getElementById("sb-right-title");
  sbRightTitle.innerText = title;

  const sbRightSubTitle = document.getElementById("sb-right-subTitle");
  sbRightSubTitle.innerText = name;

  const sbRightImg = document.getElementById("sb-right-img");
  sbRightImg.setAttribute("src", cover);

  const iaImg = document.getElementById("ia-img");
  iaImg.setAttribute("src", cover);

  const iaName = document.getElementById("ia-name");
  iaName.innerText = name;

  const riconoscimenti = document.getElementById("riconoscimenti-name");
  riconoscimenti.innerText = name;
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
    icon.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
  }
};

initVolumeControl();
// #endregion

let urlSearch = "https://striveschool-api.herokuapp.com/api/deezer/";
let qs = "";
let artist = "";
let codAlbum = "";
let fullUrl = "";

// #region GET ANNUNCI

const getAd = () => {
  qs = "search?q=";
  artist = "mengoni";
  fullUrl = urlSearch + qs + artist;
  fetch(fullUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Fetch Errata", response.status);
      }
    })
    .then((data) => {
      const row = document.getElementById("playlist-card");
      row.innerHTML = `
            <div class="card bg-dark bg-gradient text-white overflow-hidden">
                <div class="row g-0 align-items-center">
                    <div class="col-2">
                        <img src="${data.data[0].album.cover_big}" class="img-fluid object-fit-cover rounded-start h-100" alt="album cover"  >
                    </div>
                    
                    <div class="col-10">
                        <div class="card-body justify-content-start">
                            <a class="m-0 text-decoration-none text-white d-none d-md-block"><p class="fw-bold m-0">Album</p></a>
                            <h2 class="card-title fw-bold">${data.data[0].album.title}</h2>
                            <p class="d-none d-md-block">${data.data[0].artist.name}</p>
                            <p class="card-text d-none d-md-block">Ascolta il nuovo album di ${data.data[0].artist.name}!</p>
                            <div class="d-flex gap-2 mt-3 d-none d-md-block">
                                <a href="#" id="play" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold" onclick="handleMusic('${data.data[0].album.title}', '${data.data[0].artist.name}', '${data.data[0].album.cover_big}', '${data.data[0].preview}', false)">Play</a>
                                <a href="#" class="btn btn-outline-light rounded-5 px-4 py-2 fw-bold">Save</a>
                            </div>
                            <div class="d-flex gap-2 mt-3 d-md-none">
                                <a href="#" id="play-mobile" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold bi bi-play-circle-fill" onclick="handleMusic('${data.data[0].album.title}', '${data.data[0].artist.name}', '${data.data[0].album.cover_big}', '${data.data[0].preview}', true)"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    })
    .catch((error) => {
      console.log(error);
    });
};

getAd();
// #endregion

// #region ALBUM

const idAlbum = [
  552945182, 786324441, 234196722, 926315591, 503137, 6347177, 405134707,
  833470021,
];

const getAlbum = () => {
  const qs = "album/";
  const row = document.getElementById("album-music");
  row.innerHTML = "";

  idAlbum.forEach((id, i) => {
    const fullUrl = urlSearch + qs + id;

    fetch(fullUrl)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Fetch Errata");
      })
      .then((data) => {
        const idBtn = `btn-album${i}`;

        row.innerHTML += `
        <div class="col">
          <div class="card album-card bg-dark bg-gradient text-white overflow-hidden h-100 glow-up">
            <div class="row g-0 h-100"> 
              <div class="col-4">
                <img src="${data.cover_big}" class="img-fluid rounded-start h-100 object-fit-cover" alt="cover ${data.title}">
              </div>

              <div class="col-8 position-relative">
                <div class="card-body d-flex align-items-center h-100">
                  <h2 class="card-title h6 mb-0 text-truncate">${data.title}</h2>
                </div>
              </div>

              <a href="#" 
                id="${idBtn}"
                class="play-button position-absolute top-50 end-0 translate-middle-y btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle bi bi-play-fill me-1" 
                style="width: 40px; height: 40px; font-size: 1.5rem;"
                onclick="handleMusic('${data.title}', '${data.artist.name}', '${data.cover_big}', '${data.tracks.data[0].preview}', false, true, '${idBtn}')">
              </a>
            </div>
          </div>
        </div>
        `;
      })
      .catch((error) => console.error(error));
  });
};

getAlbum();

// #endregion

// #region CAROSELLO ALBUM

const idAlbum3 = [
  1127912, 406064537, 629506181, 829966251, 139903102, 13082992, 629506181,
  837881302, 60712222, 226972272, 964049261, 681873311, 586786102, 740854321,
  52661942, 110382, 72487842, 773306041, 681873311, 231182, 908070412, 12279688,
  698935761,
];

const createAllCarousels = async () => {
  const qs = "album/";
  const targetIds = [
    "album-listened",
    "album-listened2",
    "album-search",
    "album-search2",
    "album-recommended",
    "album-recommended2",
    "album-featuring",
    "album-featuring2",
  ];
  const itemsPerSlide = 6;

  const totalSlotsNeeded = targetIds.length * itemsPerSlide;

  const uniqueIds = [...new Set(idAlbum3)];
  const albumCache = {};

  try {
    await Promise.all(
      uniqueIds.map(async (id) => {
        const response = await fetch(`${urlSearch}${qs}${id}`);
        if (response.ok) albumCache[id] = await response.json();
      }),
    );

    for (let i = 0; i < totalSlotsNeeded; i++) {
      const id = idAlbum3[i % idAlbum3.length];

      const slideIndex = Math.floor(i / itemsPerSlide);
      const containerId = targetIds[slideIndex];
      const data = albumCache[id];

      if (containerId && data) {
        const container = document.getElementById(containerId);
        if (container) {
          container.appendChild(createAlbumCard(data, id, containerId, i));
        }
      }
    }
  } catch (error) {
    console.error("Errore:", error);
  }
};

const createAlbumCard = (data, id, containerId, globalIndex) => {
  const idBtn = `btn-album-${id}-${containerId}-${globalIndex}`;
  const col = document.createElement("div");
  col.className = "col-6 col-md-3 col-lg-2 mb-3";

  col.innerHTML = `
    <div class="card h-100 album-card bg-transparent border-0 position-relative glow-up">
      <img src="${data.cover_big}" class="card-img-top img-fluid" alt="${data.title}">
      <div class="card-body text-secondary p-2">
        <p class="card-text text-truncate text-white mb-0">${data.title}</p>
        <p class="card-text text-truncate small">${data.artist.name}</p>
      </div>
      <a href="javascript:void(0)" 
         id="${idBtn}" 
         class="play-button position-absolute btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle bi bi-play-fill"
         style="width: 40px; height: 40px; font-size: 1.5rem; bottom: 10px; right: 10px;"
         onclick="handleMusic('${data.title}', '${data.artist.name}', '${data.cover_big}', '${data.tracks.data[0].preview}', false, true, '${idBtn}')">
      </a>
    </div>`;
  return col;
};

createAllCarousels();
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
