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
    const idBtn = `btn-track-artist-${data[i].id}-${i}`;
    const safeTitle = data[i].title.replace(/'/g, "\\'");
    const safeArtist = data[i].artist.name.replace(/'/g, "\\'");

    tracceArtista.innerHTML += `
      <div class="song-row d-flex justify-content-between align-items-center py-2 px-2 grey-scroll"
           style="cursor: pointer;"
           onclick="handleMusic('${safeTitle}', '${safeArtist}', '${data[i].album.cover_big}', '${data[i].preview}', false, true, '${idBtn}')">
        
        <div class="d-flex align-items-center gap-3">
          <div style="width: 20px; flex-shrink: 0;" class="position-relative d-flex align-items-center justify-content-center">
            <span class="text-secondary song-index">${i + 1}</span>
            <button
              id="${idBtn}"
              class="song-play-btn btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle position-absolute"
              style="width: 26px; height: 26px;">
              <i class="bi bi-play-fill" style="font-size: 14px;"></i>
            </button>
          </div>
          <img src="${data[i].album.cover_big}" width="40" class="rounded-1"/>
          <span class="text-white">${data[i].title}</span>
        </div>

        <span class="text-secondary">${(data[i].duration / 60).toPrecision(3)}</span>
      </div>
    `;
  }

  tracceArtista.innerHTML += `   
    <div class="mt-4">
      <h2 class="text-light">Albums</h2>
    </div>  
    <div id="carousel-artist-page" class="d-flex gap-4 overflow-hidden mt-4">
      ${data
        .slice(0, 5)
        .map(
          (album) => `
        <div class="card p-3 border-0 spotify-card" style="background-color: #181818; width: 200px; cursor: pointer; transition: background 0.3s ease; border-radius: 8px;">
          <div class="position-relative mb-3">
            <img src="${album.album.cover_big}" class="card-img-top shadow-lg rounded-3" alt="${album.title}">
            <div class="play-btn-spotify position-absolute" style="bottom: 8px; right: 8px; opacity: 0; transition: all 0.3s ease; transform: translateY(10px);">
               <div class="bg-success rounded-circle d-flex align-items-center justify-content-center shadow" style="width: 48px; height: 48px;">
                 <i class="bi bi-play-fill text-black fs-2"></i>
               </div>
            </div>
          </div>
          <div class="card-body p-0">
            <h6 class="text-white text-truncate mb-1 fw-bold">${album.album.title}</h6>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
`;
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

      //playButton
      const btnPlayArtist = document.getElementById("btn-play-artist");
      if (btnPlayArtist) {
        btnPlayArtist.onclick = () => {
          const firstTrack = tracks[0];
          handleMusic(
            firstTrack.title,
            firstTrack.artist.name,
            firstTrack.album.cover_big,
            firstTrack.preview,
            false,
            true,
            "btn-play-artist",
          );
        };
      }

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
              class="d-block w-100 rounded-2 collapse-hidden"
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
    <p class="fw-bold mb-2 text-light">Artist's information</p>
    <div class="d-flex flex-column gap-3 mb-2">
      <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-secondary overflow-hidden" style="width: 52px; height: 52px">
        <img src="${artist.picture_big}" alt="${artist.name}" class="w-100 h-100 object-fit-cover" />
      </div>
      <div>
        <p class="fw-bold mb-0 text-light">${artist.name}</p>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <p class="text-light small mb-0">Internationally renowned artist</p>
        <button class="btn btn-outline-light btn-sm rounded-pill px-3 small">Follow</button>
      </div>
    </div>

    <p class="text-light-emphasis mb-0 small" style="line-height: 1.8">
      <strong>${artist.name}</strong> represents a benchmark in the contemporary music scene.
      A career studded with successes that has led this artist to shine internationally.
      Here are the pillars of this journey, including songs, albums, and the current phase of artistic production:
      <br><br>
      With more than <strong>${artist.nb_fan.toLocaleString()} fans</strong> on Deezer and <strong>${artist.nb_album} album</strong> published, 
      <strong>${artist.name}</strong>'s musical project continues to dominate the charts. The songs demonstrate the maturity achieved over the years.
      <br><br>
      The record: <strong>${artist.name}</strong> continues to grow thanks to streaming
      and its ability to remain relevant across generations, confirming themselves as an icon of modern music.
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


// AVVIO
initPage();

// #region CLICKABLE HEART
const heart = document.getElementById("heartClick");

heart.addEventListener("click", () => {
  heart.classList.toggle("heartClick");
});
// #endregion
