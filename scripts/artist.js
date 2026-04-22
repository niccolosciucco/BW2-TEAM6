const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const getArtist = () => {
  const url = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
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

      const artistName = document.getElementById("artist-name");
      artistName.innerText = data.name;

      const monthlyListener = document.getElementById("monthly-listener");
      monthlyListener.innerText =
        data.nb_fan.toLocaleString("it-IT") + " Monthly Listener";

      const artistHero = document.querySelector(".artist-hero");
      artistHero.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), #121212), url(${data.picture_xl})`;
      artistHero.style.backgroundPosition = "top";
    })
    .catch((error) => {
      console.log(error);
    });
};

getArtist();

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
        <strong>${artist.name}</strong> è uno dei talenti più cristallini e premiati del panorama musicale italiano contemporaneo. 
        La sua carriera, iniziata con la vittoria a X Factor nel 2009, è costellata di successi che lo hanno reso un punto di riferimento anche a livello internazionale.
        Ecco i pilastri del suo successo tra canzoni, album e l'attuale fase della sua carriera:
        L'essenziale (2013): Il brano della consacrazione definitiva e della prima vittoria a Sanremo.
        Guerriero (2014): Un vero inno di protezione e forza, certificato 6 volte Platino.
        Ti ho voluto bene veramente (2015): Uno dei suoi video più visti, girato tra i paesaggi spettacolari dell'Islanda.
        Due vite (2023): Il successo della maturità, che ha dominato le classifiche europee dopo il Festival di Sanremo.
        Tra il 2021 e il 2023, Mengoni ha realizzato un progetto monumentale diviso in tre capitoli, ognuno con un'anima diversa:
        Terra: Un ritorno alle origini, tra soul, blues e suoni acustici (Cambia un uomo).
        Pelle: Dedicato alle contaminazioni, ai viaggi e all'incontro con altre culture (No Stress).
        Prisma: Il capitolo finale che riflette le mille sfaccettature dell'uomo e dell'artista (Due vite).
        Il dato record: Marco ha superato la soglia degli 80 dischi di platino complessivi, un numero che continua a crescere grazie allo streaming 
        e alla sua capacità di restare rilevante per generazioni diverse.
        </p>
      `;
    })
    .catch((err) => console.error("Errore caricamento artista:", err));
};

loadArtistInfo();
// #endregion