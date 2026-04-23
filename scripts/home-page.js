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
            class="play-button position-absolute btn btn-success text-black p-0 pt-1 d-flex align-items-center justify-content-center rounded-circle shadow-lg" 
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
            <img src="${item.album.cover_big}" width="50" height="50" class=" rounded-1 shadow-sm">
            <div class="px-2">
              <div class="fw-bold text-light text-truncate collapse-hidden" style="max-width: 150px;">
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
              class="d-block w-100 rounded-2 collapse-hidden"
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

// #region GET ALBUM
const idAlbum = [
  552945182, 786324441, 234196722, 926315591, 503137, 6347177, 405134707,
  833470021,
];

const getAlbum = () => {
  const urlApi = "https://striveschool-api.herokuapp.com/api/deezer/album/";
  const row = document.getElementById("album-music");

  if (!row) {
    console.error("Non ho trovato l'id album-music nell'HTML!");
    return;
  }

  row.innerHTML = "";

  idAlbum.forEach((id, i) => {
    fetch(urlApi + id)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Errore fetch album " + id);
      })
      .then((data) => {
        const idBtn = `btn-album${i}`;

        const safeTitle = data.title.replace(/'/g, "\\'");
        const safeArtist = data.artist.name.replace(/'/g, "\\'");

        row.innerHTML += `
        <div class="col">
          <div class="card album-card bg-dark bg-gradient text-white overflow-hidden h-100 glow-up border-0 shadow-sm">
            <div class="row g-0 h-100 position-relative"> 
              <div class="col-4">
                <img src="${data.cover_big}" class="img-fluid rounded-start h-100 object-fit-cover" alt="cover">
              </div>

              <div class="col-8">
                <div class="card-body d-flex align-items-center h-100">
                  <a href="./album.html?id=${data.id}" class="link text-white text-decoration-none">
                    <h2 class="card-title h6 mb-0 text-truncate link" style="max-width: 120px;">${data.title}</h2>
                  </a>
                </div>
              </div>

              <a href="#" 
                id="${idBtn}"
                class="play-button position-absolute top-50 end-0 btn-success translate-middle-y btn text-black p-0 d-flex align-items-center justify-content-center rounded-circle bi bi-play-fill me-1" 
                style="width: 40px; height: 40px; font-size: 1.5rem;"
                onclick="handleMusic('${data.title}', '${data.artist.name}', '${data.cover_big}', '${data.tracks.data[0].preview}', false, true, '${idBtn}')">
              </a>
            </div>
          </div>
        </div>
        `;
      })
      .catch((error) => console.error("Errore:", error));
  });
};

getAlbum();
// #endregion

// #region COLLASSO SIDEBAR
const sidebar = document.getElementById("sidebarLeft");
const toggleBtn = document.getElementById("toggleSidebar");

const wrap = document.getElementById("wrapcollapse");
const centerPlus = document.getElementById("centerPlus");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("sidebar-expanded");
  const isCollapsed = sidebar.classList.contains("sidebar-collapsed");

  if (wrap) {
    wrap.classList.toggle("flex-wrap", isCollapsed);
  }

  if (centerPlus) {
    centerPlus.classList.toggle("justify-content-between", !isCollapsed);
    centerPlus.classList.toggle("justify-content-center", isCollapsed);
  }
});

const sidebar2 = document.getElementById("sidebarRight");
const toggleBtn2 = document.getElementById("toggleSidebar2");

toggleBtn2.addEventListener("click", () => {
  sidebar2.classList.toggle("sidebar-collapsed");
  sidebar2.classList.toggle("sidebar-expanded");
});

// #endregion

// #region CLICKABLE HEART
const heart = document.getElementById("heartClick");

heart.addEventListener("click", () => {
  heart.classList.toggle("heartClick");
});
// #endregion


