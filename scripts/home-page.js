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
  col.className = "col-6 col-md-3 col-lg-2 mb-4 glow-up"; // 6 card su desktop, 2 su mobile

  col.innerHTML = `
        <div class="card h-100 album-card bg-transparent border-0 position-relative">
          <div class="position-relative overflow-hidden rounded-3 shadow-sm shadow-lg-hover">
            <img src="${albumCover}" class="card-img-top img-fluid" alt="${albumTitle}">
            <button 
            id="${idBtn}" 
            class="play-button  position-absolute btn btn-success text-black p-0 pt-1 d-flex align-items-center justify-content-center rounded-circle shadow-lg" 
            style="width: 40px; height: 40px; bottom: 8px; right: 8px;" 
            onclick="handleMusic('${albumTitle.replace(/'/g, "\\'")}', '${artistName.replace(/'/g, "\\'")}', '${albumCover}', '${previewUrl}', false, true, '${idBtn}')">
            <i class="bi bi-play-fill fs-2"></i>
</button>
          </div>
          <div class="card-body p-2">
            <a href="./album.html?id=${albumId}" class="text-decoration-none">
                <p class="card-text text-truncate text-white fw-bold mb-0 link">${albumTitle}</p>
            </a>
            <a href="./artist.html?id=${artistId}" class="text-decoration-none">
                <p class="card-text text-truncate text-secondary small link">${artistName}</p>
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

// #region COLLASSO SIDEBAR
const sidebar = document.getElementById("sidebarLeft");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("sidebar-expanded");
});
// #endregion
