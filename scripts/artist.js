// #region INIZIALIZZAZIONE E RECUPERO ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const initPage = () => {
  if (!id) {
    console.error("Nessun ID artista trovato nell'URL");
    return;
  }
  getArtist();
  loadAlbumCarousel();
  loadSidebarData();
};
// #endregion

// #region FUNZIONI PRINCIPALI (API)
const getArtist = () => {
  const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`;

  fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Errore nel recupero dati artista");
    })
    .then((data) => {
      console.log(data);
      // Popola Nome e Ascoltatori
      const artistName = document.getElementById("artist-name");
      if (artistName) artistName.innerText = data.name;

      const monthlyListener = document.getElementById("monthly-listener");
      if (monthlyListener) {
        monthlyListener.innerText =
          data.nb_fan.toLocaleString("it-IT") + " Monthly Listener";
      }

      // Sfondo Hero
      const artistHero = document.querySelector(".artist-hero");
      if (artistHero) {
        artistHero.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), #121212), url(${data.picture_xl})`;
        artistHero.style.backgroundPosition = "top";
      }

      // Carica la biografia neutra con i dati dell'artista
      loadArtistInfo(data);
    })
    .catch((error) => console.log(error));
};

// #region POPULAR SONGS

const popularSongs = function (data) {
  console.log(data);
  // caricamento tracce dell'artista
  const tracceArtista = document.getElementById("tracce-artista");

  for (let i = 0; i < 6; i++) {
    tracceArtista.innerHTML += `
    <div
      class="song-row d-flex justify-content-between align-items-center py-2 px-2">
      <div class="d-flex align-items-center gap-3">
        <span class="text-secondary">${i + 1}</span>
        <img src="${data[i].album.cover_big}" width="40" />
        <span class="text-white">${data[i].title}</span>
      </div>
      <span class="text-secondary"> ${(data[i].duration / 60).toPrecision(3)}</span>
    </div>
    `;
  }
};

// #endregion

const loadAlbumCarousel = () => {
  // Recuperiamo prima il nome dell'artista per fare una ricerca più precisa,
  // oppure usiamo l'ID direttamente nell'endpoint corretto.
  // Usiamo l'ID dell'artista per cercare le sue tracce/album
  const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=12`;
  const container = document.getElementById("album-sidebar");

  if (!container || !id) return;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Errore fetch carosello");
      return res.json();
    })
    .then((obj) => {
      container.innerHTML = ""; // Puliamo il contenitore

      // L'endpoint /top restituisce la lista in obj.data
      const tracks = obj.data;

      if (tracks.length === 0) {
        container.innerHTML =
          "<p class='text-white'>Nessun contenuto disponibile</p>";
        return;
      }

      tracks.forEach((item, index) => {
        const isActive = index === 0 ? "active" : "";

        container.innerHTML += `
          <div class="carousel-item ${isActive}">
            <img
              src="${item.album.cover_big}"
              class="d-block w-100 rounded-2"
              alt="${item.album.title}"
            />
            <div class="container position-absolute bottom-0 start-0 pb-2 bg-dark bg-opacity-50 w-100">
              <p
                class="fw-bold mb-0 mt-1 text-light text-truncate"
                style="font-size: 15px; max-width: 90%;"
              >
                ${item.album.title}
              </p>
              <p class="text-light mb-0 text-truncate" style="font-size: 12px; max-width: 90%;">
                ${item.title}
              </p>
            </div>
          </div>`;
      });

      popularSongs(tracks);
    })
    .catch((err) => console.error("Errore album carousel:", err));
};

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

// #region SIDEBAR E UI
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

// Toggle Sidebar (Assicurati che gli ID esistano nell'HTML)
const sidebar = document.getElementById("sidebarLeft");
const toggleBtn = document.getElementById("toggleSidebar");

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-collapsed");
    sidebar.classList.toggle("sidebar-expanded");
  });
}
// #endregion

// AVVIO
initPage();
