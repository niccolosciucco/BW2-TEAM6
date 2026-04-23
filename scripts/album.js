const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// #region COLORE MEDIO
function getAverageColor(imgElement) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = imgElement.naturalWidth || imgElement.width;
  canvas.height = imgElement.naturalHeight || imgElement.height;
  context.drawImage(imgElement, 0, 0);

  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0,
    g = 0,
    b = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const count = data.length / 4;
  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count),
  };
}
//#endregion

const getAlbum = () => {
  const url = "https://striveschool-api.herokuapp.com/api/deezer/album/";
  const qs = id;
  const fullUrl = url + id;
  fetch(fullUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Fetch Errata", response.status);
      }
    })
    .then((data) => {
      console.log(data);
      const albumTitle = document.getElementById("album-title");
      albumTitle.innerText = data.title;

      const nomeArtista = document.getElementById("nome-artista");
      nomeArtista.innerText = data.artist.name;

      const coverArtist = document.getElementById("cover-artist");
      coverArtist.setAttribute("src", data.cover_big);

      const albumCover = document.getElementById("album-cover");
      albumCover.setAttribute("src", data.cover_big);

      const btnPlayAlbum = document.getElementById("btn-play-album");
      btnPlayAlbum.onclick = () => {
        const firstTrack = data.tracks.data[0];
        const safeTitle = firstTrack.title.replace(/'/g, "\\'");
        const safeArtist = firstTrack.artist.name.replace(/'/g, "\\'");
        handleMusic(
          firstTrack.title,
          firstTrack.artist.name,
          data.cover_big,
          firstTrack.preview,
          false,
          true,
          "btn-play-album",
        );
      };

      //   chiamata ad una funzione che ritorna il colore medio di una foto
      //   dato che è un url e non una foto vera e propria, prima bisogna trasformarla
      // quel colore sarà usato nel background della pagiana
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = data.cover_big;

      img.onload = function () {
        const color = getAverageColor(img);
        const background = document.getElementById("colore-medio");

        background.style.background = `linear-gradient(to bottom, rgb(${color.r}, ${color.g}, ${color.b}), #121212)`;
      };

      const details = document.getElementById("dettagli");

      //   calcola i minuti e i secondi dalla duration del data
      const minutes = Math.floor(data.duration / 60);
      const seconds = data.duration % 60;
      const formattedSeconds = seconds.toString().padStart(2, "0");

      details.innerText = `• ${data.release_date.split("-")[0]} • ${data.nb_tracks} brani, ${minutes} min ${formattedSeconds} sec.`;

      const divAlbumSongs = document.getElementById("elenco-brani");
      //   acquisisco tutti i titoli delle canzoni dell'album e li metto in un array che poi userò per riempire il main
      let arrayTitle = [];
      data.tracks.data.forEach((title) => {
        arrayTitle.push(title);
      });

      const div = document.getElementById("elenco-brani");
      arrayTitle.forEach((title, index) => {
        // generazione numero casuale per gli stream della canzone
        const min = 1000000;
        const max = 50000000;
        const randomNum = (
          Math.floor(Math.random() * (max - min + 1)) + min
        ).toLocaleString("it-IT");

        const idBtn = `btn-track-${title.id}-${index}`;
        const safeTitle = title.title.replace(/'/g, "\\'");
        const safeArtist = title.artist.name.replace(/'/g, "\\'");

        div.innerHTML += `
    <div class="d-flex align-items-center px-3 py-2 rounded text-light grey-scroll"
         style="cursor: pointer;"
         onclick="handleMusic('${safeTitle}', '${safeArtist}', '${data.cover_big}', '${title.preview}', false, true, '${idBtn}')">

      <div style="width: 30px; flex-shrink: 0;" class="position-relative d-flex align-items-center justify-content-center">
        <span class="text-secondary small song-index">${index + 1}</span>
        <button
          id="${idBtn}"
          class="song-play-btn btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle position-absolute"
          style="width: 26px; height: 26px;">
          <i class="bi bi-play-fill" style="font-size: 14px;"></i>
        </button>
      </div>

      <div class="flex-grow-1 overflow-hidden ms-3">
        <p class="mb-0 text-truncate link">${title.title}</p>
        <p class="mb-0 d-flex align-items-center gap-1 text-truncate" style="font-size: 12px">
          <span class="badge bg-secondary text-dark" style="font-size: 10px; flex-shrink: 0;">E</span>
          <span class="text-secondary text-truncate link text-artist">${title.artist.name}</span>
        </p>
      </div>

      <span class="text-secondary small d-none d-xxl-inline" style="width: 400px; flex-shrink: 0;">${randomNum}</span>
      
      <span class="text-secondary small text-end d-lg-none d-xxl-inline" style="width: 60px; flex-shrink: 0;">
        ${Math.floor(title.duration / 60)}:${(title.duration % 60).toString().padStart(2, "0")}
      </span>
    </div>`;
      });

      const releaseDate = document.getElementById("release-date");
      releaseDate.innerText = data.release_date;

      const label = document.getElementById("label");
      label.innerText = data.label;

      const labelYear = document.getElementById("label-year");
      labelYear.innerText +=
        " " + data.release_date.slice(0, 4) + " " + data.label;
      const artistId = data.artist.id;
      fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/artist/${data.artist.id}`,
      )
        .then((res) => res.json())
        .then((fullArtist) => loadArtistInfo(fullArtist));
    })
    .catch((error) => {
      console.log(error);
    });
};

getAlbum();

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

const loadArtistInfo = (artist) => {
  const container = document.getElementById("informazioni");
  if (!container) return;

  container.innerHTML = `
    <p class="fw-bold mb-2 text-light">Informazioni sull'artista</p>
    <div class="d-flex flex-column gap-3 mb-2">
      <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-secondary overflow-hidden" style="width: 52px; height: 52px">
        <img src="${artist.picture_big}" alt="${artist.name}" class="w-100 h-100 object-fit-cover" />
      </div>
      <div>
        <p class="fw-bold mb-0 text-light">${artist.name}</p>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <p class="text-light small mb-0">Artista internazionale</p>
        <button class="btn btn-outline-light btn-sm rounded-pill px-3 small">Segui</button>
      </div>
    </div>

    <p class="text-light-emphasis mb-0 small" style="line-height: 1.8">
      <strong>${artist.name}</strong> rappresenta un punto di riferimento nel panorama musicale contemporaneo. 
      Una carriera costellata di successi che ha portato questa firma a brillare anche a livello internazionale.
      Ecco i pilastri di questo percorso tra canzoni, album e l'attuale fase della produzione artistica:
      <br><br>
      Con oltre <strong>${artist.nb_fan.toLocaleString()} fan</strong> su Deezer e <strong>${artist.nb_album} album</strong> pubblicati, 
      il progetto musicale di <strong>${artist.name}</strong> continua a dominare le classifiche. I brani testimoniano la maturità raggiunta in questi anni.
      <br><br>
      Il dato record: <strong>${artist.name}</strong> continua a crescere grazie allo streaming 
      e alla capacità di restare una realtà rilevante per generazioni diverse, confermandosi un'icona della musica moderna.
    </p>
  `;
};

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
// #region CLICKABLE HEART
const heart = document.getElementById("heartClick")

heart.addEventListener("click", ()=>{
  heart.classList.toggle("heartClick")
})
// #endregion