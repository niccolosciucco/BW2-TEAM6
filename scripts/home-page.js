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

// #region RIEMPIMENTO CAROSELLO ALBUM
const urlEurovision =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=album%20eurovision";
const urlGeneric =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=album";
const urlSanremo =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=album%20sanremo";

const createAlbumCard = (data, containerId, index) => {
  const albumId = data.album.id;
  const albumTitle = data.album.title;
  const albumCover = data.album.cover_big;
  const artistName = data.artist.name;
  const artistId = data.artist.id;
  const previewUrl = data.preview;

  const idBtn = `btn-play-${albumId}-${index}`;

  const col = document.createElement("div");
  col.className = "col-6 col-md-3 col-lg-2 mb-4"; // 6 card su desktop, 2 su mobile

  col.innerHTML = `
        <div class="card h-100 album-card bg-transparent border-0 position-relative">
          <div class="position-relative overflow-hidden rounded-3 shadow-sm shadow-lg-hover">
            <img src="${albumCover}" class="card-img-top img-fluid" alt="${albumTitle}">
            <button 
               id="${idBtn}" 
               class="play-button position-absolute btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle shadow"
               style="width: 48px; height: 48px; bottom: 8px; right: 8px; opacity: 0; transition: all 0.3s;"
               onclick="handleMusic('${albumTitle.replace(/'/g, "\\'")}', '${artistName.replace(/'/g, "\\'")}', '${albumCover}', '${previewUrl}', false, true, '${idBtn}')">
               <i class="bi bi-play-fill fs-3"></i>
            </button>
          </div>
          <div class="card-body p-2">
            <a href="./album.html?id=${albumId}" class="text-decoration-none">
                <p class="card-text text-truncate text-white fw-bold mb-0">${albumTitle}</p>
            </a>
            <a href="./artist.html?id=${artistId}" class="text-decoration-none">
                <p class="card-text text-truncate text-secondary small">${artistName}</p>
            </a>
          </div>
        </div>`;
  return col;
};

const populateCarousel = async () => {
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

  try {
    // Eseguiamo entrambe le fetch contemporaneamente (più veloce)
    const [res1, res2, res3] = await Promise.all([
      fetch(urlGeneric),
      fetch(urlSanremo),
      fetch(urlEurovision),
    ]);

    const json1 = await res1.json();
    const json2 = await res2.json();
    const json3 = await res3.json();

    // Uniamo i due array di risultati in uno solo
    const allAlbums = [...json1.data, ...json2.data, ...json3.data];

    if (!allAlbums || allAlbums.length === 0) return;

    targetIds.forEach((containerId, containerIndex) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const itemsPerSlide = 6;
      const start = containerIndex * itemsPerSlide;

      // Prendiamo i 6 album per questa riga dal "super-array" unito
      const selection = allAlbums.slice(start, start + itemsPerSlide);

      // Puliamo il contenitore prima di riempirlo
      container.innerHTML = "";

      selection.forEach((item, i) => {
        container.appendChild(createAlbumCard(item, containerId, i));
      });
    });
  } catch (error) {
    console.error("Errore nel caricamento dei dati uniti:", error);
  }
};

populateCarousel();
// #endregion

// #region SIDEBAR CONTENUTO SINISTRO
const loadSidebarData = () => {
  const url =
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=playlist";
  const container = document.getElementById("playlist-album");

  if (!container) return;

  fetch(url)
    .then((res) => res.json())
    .then((obj) => {
      container.innerHTML = "";

      const limitedData = obj.data.slice(0, 12);

      limitedData.forEach((item) => {
        // CORREZIONE: Ho aggiunto i backtick (`) all'inizio e alla fine dell'HTML
        container.innerHTML += `
          <div class="d-flex align-items-center my-3">
            <img src="${item.album.cover_big}" width="50" height="50" class="rounded-1 shadow-sm">
            <div class="px-2 collapse-hidden">
              <div class="fw-bold text-light text-truncate" style="max-width: 150px;">
                ${item.album.title}
              </div>
              <small class="text-secondary">${item.artist.name}</small>
            </div>
          </div>`;
      });
    })
    .catch((err) => console.error("Errore sidebar:", err));
};

loadSidebarData();
// #endregion

// #region SIDEBAR CONTENUTO DESTRO
const loadAlbumCarousel = () => {
  const url =
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=album";
  const container = document.getElementById("album-sidebar");

  if (!container) return;

  fetch(url)
    .then((res) => res.json())
    .then((obj) => {
      container.innerHTML = "";

      const limitedData = obj.data.slice(0, 12);

      limitedData.forEach((item, index) => {
        const isActive = index === 0 ? "active" : "";

        container.innerHTML += `
          <div class="carousel-item ${isActive}">
            <img
              src="${item.album.cover_big}"
              class="d-block w-100 rounded-2"
              alt="${item.album.title}"
            />
            <div class="container position-absolute bottom-0 start-0 pb-2">
              <p
                class="fw-bold mb-0 mt-1 text-light text-shadow text-truncate"
                style="font-size: 15px; max-width: 90%;"
              >
                ${item.album.title}
              </p>
              <p class="text-light mb-0 text-shadow text-truncate" style="font-size: 12px; max-width: 90%;">
                ${item.artist.name}
              </p>
            </div>
          </div>`;
      });
    })
    .catch((err) => console.error("Errore album carousel:", err));
};

loadAlbumCarousel();
// #endregion

// #region RICONOSCIMENTI SIDEBAR DESTRA
const loadArtistInfo = () => {
  // Usiamo l'endpoint search filtrando per l'artista specifico, è più affidabile
  const url =
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=marco%20mengoni";
  const container = document.getElementById("informazioni");

  if (!container) return;

  fetch(url)
    .then((res) => res.json())
    .then((obj) => {
      // Prendiamo i dati dell'artista dal primo risultato della ricerca
      const artist = obj.data[0].artist;

      container.innerHTML = `
        <p class="fw-bold mb-2 text-light">Informazioni sull'artista</p>
        <div class="d-flex flex-column gap-3 mb-2">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-secondary overflow-hidden"
            style="width: 52px; height: 52px"
          >
            <img
              id="ia-img"
              src="${artist.picture_big}"
              alt="${artist.name}"
              class="w-100 h-100 object-fit-cover"
            />
          </div>
          <div>
            <p id="ia-name" class="fw-bold mb-0 text-light">
              ${artist.name}
            </p>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <p class="text-light small mb-0">
              Artista di fama internazionale!
            </p>
            <div class="ms-auto">
              <button
                class="btn btn-outline-light btn-sm rounded-pill px-3 small"
              >
                Segui
              </button>
            </div>
          </div>
        </div>

        <p class="text-light-emphasis mb-0 small" style="line-height: 1.8">
          Punto di riferimento nel panorama musicale contemporaneo:   
          una figura capace di collezionare numerosi riconoscimenti 
          certificati e di definire il suono del proprio tempo. Grazie 
          a una carriera costellata di successi e collaborazioni di rilievo, 
          ha ottenuto traguardi straordinari tra produzioni e brani iconici.
        </p>
      `;
    })
    .catch((err) => console.error("Errore caricamento artista:", err));
};

loadArtistInfo();
// #endregion

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
      const songData = data.data[0]; // Prendiamo il primo risultato

      // Ho aggiunto l'ID "ad-card" per poter cambiare lo sfondo via JS
      row.innerHTML = `
            <div id="ad-card" class="card text-white overflow-hidden border-0" style="transition: background 0.8s ease;">
                <div class="row g-0 align-items-center">
                    <div class="col-2">
                        <img id="ad-img" src="${songData.album.cover_big}" 
                             class="img-fluid object-fit-cover rounded-start h-100 ms-2" 
                             alt="album cover" crossorigin="anonymous">
                    </div>
                    
                    <div class="col-10">
                        <div class="card-body justify-content-start">
                            <a class="m-0 text-decoration-none text-white d-none d-md-block"><p class="fw-bold m-0">Album</p></a>
                            <a href="./album.html?id=${songData.album.id}" class="link"><h2 class="card-title fw-bold">${songData.album.title}</h2></a>
                            <a href="./artist.html?id=${songData.artist.id}" class="link"><p class="d-none d-md-block">${songData.artist.name}</p></a>
                            <p class="card-text d-none d-md-block">Ascolta il nuovo album di ${songData.artist.name}!</p>
                            <div class="d-flex gap-2 mt-3 d-none d-md-block ms-2">
                                <a href="#" id="play" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold me-2" onclick="handleMusic('${songData.album.title}', '${songData.artist.name}', '${songData.album.cover_big}', '${songData.preview}', false)">Play</a>
                                <a href="#" class="btn btn-outline-light rounded-5 px-4 py-2 fw-bold">Save</a>
                            </div>
                            <div class="d-flex gap-2 mt-3 d-md-none">
                                <a href="#" id="play-mobile" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold bi bi-play-circle-fill" onclick="handleMusic('${songData.album.title}', '${songData.artist.name}', '${songData.album.cover_big}', '${songData.preview}', true)"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

      // Background dinamico
      const img = document.getElementById("ad-img");
      const card = document.getElementById("ad-card");
      const colorThief = new ColorThief();

      const applyGradient = () => {
        const rgb = colorThief.getColor(img);
        const mainColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

        card.style.background = `linear-gradient(180deg, ${mainColor} 0%, #121212 100%)`;
      };

      if (img.complete) {
        applyGradient();
      } else {
        img.addEventListener("load", () => {
          applyGradient();
        });
      }
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
                  <a href="./album.html?id=${data.id}" class="link"><h2 class="card-title h6 mb-0 text-truncate">${data.title}</h2></a>
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

// #region COLLASSO SIDEBAR
const sidebar = document.getElementById("sidebarLeft");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("sidebar-expanded");
});
// #endregion

// #region SEARCH BAR
const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions-container");
// Selezioniamo l'icona
const searchIcon = document.querySelector(".bi-collection-play");

// --- FUNZIONE RIUTILIZZABILE PER LA RICERCA ---
const handleSearch = () => {
  const query = searchInput.value.trim();
  if (query) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data.length > 0) {
          // Reindirizza al primo risultato trovato
          window.location.href = `artist.html?id=${result.data[0].artist.id}`;
        } else {
          alert("Nessun artista trovato.");
        }
      })
      .catch((err) => console.error("Errore ricerca:", err));
  }
};

// --- SUGGERIMENTI (Mentre scrivi) ---
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length > 1) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
      .then((res) => res.json())
      .then((obj) => {
        suggestionsContainer.innerHTML = "";
        const seenArtists = new Set();
        const limitedArtists = obj.data
          .filter((item) => {
            if (!seenArtists.has(item.artist.id)) {
              seenArtists.add(item.artist.id);
              return true;
            }
            return false;
          })
          .slice(0, 5);

        limitedArtists.forEach((item) => {
          const suggestionItem = document.createElement("button");
          suggestionItem.className =
            "list-group-item list-group-item-action bg-dark text-white border-secondary d-flex align-items-center gap-3 py-2";
          suggestionItem.style.border = "1px solid #333";
          suggestionItem.innerHTML = `
            <img src="${item.artist.picture_small}" class="rounded-circle" style="width: 35px; height: 35px; object-fit: cover;">
            <div class="text-truncate">
                <p class="mb-0 fw-bold">${item.artist.name}</p>
                <small class="text-secondary">Artista</small>
            </div>`;

          suggestionItem.onclick = () => {
            window.location.href = `artist.html?id=${item.artist.id}`;
          };
          suggestionsContainer.appendChild(suggestionItem);
        });
      });
  } else {
    suggestionsContainer.innerHTML = "";
  }
});

// --- ASCOLTATORI EVENTI ---

// 1. Click sull'icona bi-collection-play
if (searchIcon) {
  searchIcon.style.cursor = "pointer"; // Rende l'icona cliccabile visivamente
  searchIcon.addEventListener("click", handleSearch);
}

// 2. Tasto Enter nell'input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// 3. Click fuori per chiudere suggerimenti
document.addEventListener("click", (e) => {
  if (
    !searchInput.contains(e.target) &&
    !suggestionsContainer.contains(e.target)
  ) {
    suggestionsContainer.innerHTML = "";
  }
});
// #endregion
