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

// #region PLAY AND PAUSE MUSIC
let audio = null;

const handleMusic = (preview, isMobile) => {
  if (!isMobile) {
    const btn = document.getElementById("play");

    if (!audio) {
      audio = new Audio(preview);
    }

    if (btn.innerText === "Play") {
      audio.play();
      btn.innerText = "Pause";
      btn.classList.replace("btn-success", "btn-warning");
    } else {
      audio.pause();
      btn.innerText = "Play";
      btn.classList.replace("btn-warning", "btn-success");
    }
  } else {
    const btn = document.getElementById("play-mobile");

    if (!audio) {
      audio = new Audio(preview);
    }

    if (btn.classList.contains("bi-play-circle-fill")) {
      audio.play();
      btn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
      btn.classList.replace("btn-success", "btn-warning");
    } else {
      audio.pause();
      btn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
      btn.classList.replace("btn-warning", "btn-success");
    }
  }
};
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
      console.log(data);
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
                                <a href="#" id="play" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold" onclick="handleMusic('${data.data[0].preview}', false)">Play</a>
                                <a href="#" class="btn btn-outline-light rounded-5 px-4 py-2 fw-bold">Save</a>
                            </div>
                            <div class="d-flex gap-2 mt-3 d-md-none">
                                <a href="#" id="play-mobile" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold bi bi-play-circle-fill" onclick="handleMusic('${data.data[0].preview}', true)"></a>
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

const idAlbum = [
  552945182, 786324441, 234196722, 926315591, 503137, 6347177, 405134707,
  833470021,
];

// #region ALBUM

const getAlbum = () => {
  qs = "album/";
  idAlbum.forEach((id) => {
    codAlbum = id;
    fullUrl = urlSearch + qs + codAlbum;
    console.log(fullUrl);

    fetch(fullUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Fetch Errata", response.status);
        }
      })
      .then((data) => {
        const row = document.getElementById("album-music");

        row.innerHTML += `
        <div class="col">
          <div class="card bg-dark bg-gradient text-white overflow-hidden h-100">
            <div class="row g-0 h-100"> <div class="col-4">
                <img src="${data.cover_big}" class="img-fluid rounded-start h-100 object-fit-cover" alt="cover ${data.title}">
              </div>

              <div class="col-8">
                <div class="card-body d-flex align-items-center h-100">
                  <h2 class="card-title h6 mb-0 text-truncate">${data.title}</h2>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

getAlbum();

// #endregion

// #region CAROSELLO ALBUM

// #endregion
