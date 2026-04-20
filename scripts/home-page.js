// #region COMPORTAMENTO CAROSELLO

// const carousel = document.querySelector("#carouselExample");
// if (window.matchMedia("(min-width: 768px)").matches) {
//   const carouselInstance = new bootstrap.Carousel(carousel, {
//     interval: false, // Disattiva lo scorrimento automatico
//   });

//   let scrollPosition = 0;

//   document
//     .querySelector(".carousel-control-next")
//     .addEventListener("click", function () {
//       const containerWidth =
//         document.querySelector(".carousel-inner").scrollWidth;
//       const cardWidth = document.querySelector(".carousel-item").offsetWidth;

//       if (scrollPosition < containerWidth - cardWidth * 4) {
//         scrollPosition += cardWidth;
//         document.querySelector(".carousel-inner").scrollTo({
//           left: scrollPosition,
//           behavior: "smooth",
//         });
//       }
//     });

//   document
//     .querySelector(".carousel-control-prev")
//     .addEventListener("click", function () {
//       const cardWidth = document.querySelector(".carousel-item").offsetWidth;
//       if (scrollPosition > 0) {
//         scrollPosition -= cardWidth;
//         document.querySelector(".carousel-inner").scrollTo({
//           left: scrollPosition,
//           behavior: "smooth",
//         });
//       }
//     });
// }

// #endregion

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

const handleMusic = (preview, isMobile, isMouseHover = false, idBtn = "") => {
  if (audio && audio.src !== preview) {
    audio.pause();
    audio = new Audio(preview);
  }

  if (!audio) {
    audio = new Audio(preview);
  }

  let btn;
  if (isMobile) {
    btn = document.getElementById("play-mobile");
  } else if (isMouseHover) {
    btn = document.getElementById(idBtn);
  } else {
    btn = document.getElementById("play");
  }

  // Logica Play/Pause
  if (audio.paused) {
    audio.play();
    updateBtnIcon(btn, true);
  } else {
    audio.pause();
    updateBtnIcon(btn, false);
  }
};

const updateBtnIcon = (btn, isPlaying) => {
  if (isPlaying) {
    btn.classList.replace("bi-play-fill", "bi-pause-fill");
    btn.classList.replace("btn-success", "btn-warning");
  } else {
    btn.classList.replace("bi-pause-fill", "bi-play-fill");
    btn.classList.replace("btn-warning", "btn-success");
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
          <div class="card album-card bg-dark bg-gradient text-white overflow-hidden h-100">
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
                onclick="handleMusic('${data.tracks.data[0].preview}', false, true, '${idBtn}')">
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

const idAlbum2 = [552945182, 786324441, 234196722, 926315591, 503137, 6347177];
const idAlbum3 = [552945182, 786324441, 234196722, 926315591, 503137, 6347177];

const createCarousel = () => {
  const qs = "album/";
  const row = document.getElementById("album-listened");
  row.innerHTML = "";

  idAlbum2.forEach((id, i) => {
    const fullUrl = urlSearch + qs + id;
    fetch(fullUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Fetch Errata", response.status);
        }
      })
      .then((data) => {
        const row = document.getElementById("album-listened");
        const idBtn = `btn-album${i + 99999}`;

        row.innerHTML += `                            
<div class="col-6 col-md-3 col-lg-2">
    <div class="card h-100 album-card bg-transparent border-0 position-relative">
      <img src="${data.cover_big}" class="card-img-top img-fluid" alt="${data.title}" />
      <div class="card-body text-secondary p-2">
        <p class="card-text text-truncate">${data.artist.name}</p>
      </div>

      <a href="javascript:void(0)" 
        id="${idBtn}"
        class="play-button position-absolute btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle bi bi-play-fill" 
        style="width: 40px; height: 40px; font-size: 1.5rem; bottom: 10px; right: 10px;"
        onclick="handleMusic('${data.tracks.data[0].preview}', false, true, '${idBtn}')">
      </a>
    </div> 
</div>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

createCarousel();

const createCarousel2 = () => {
  const qs = "album/";
  const row = document.getElementById("album-listened2");
  row.innerHTML = "";

  idAlbum3.forEach((id, i) => {
    const fullUrl = urlSearch + qs + id;
    fetch(fullUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Fetch Errata", response.status);
        }
      })
      .then((data) => {
        console.log(data.title);
        const row = document.getElementById("album-listened2");
        const idBtn = `btn-album${i + 999999}`;

        row.innerHTML += `                            
<div class="col-6 col-md-3 col-lg-2">
    <div class="card h-100 album-card bg-transparent border-0 position-relative">
      <img src="${data.cover_big}" class="card-img-top img-fluid" alt="${data.title}" />
      <div class="card-body text-secondary p-2">
        <p class="card-text text-truncate">${data.artist.name}</p>
      </div>

      <a href="javascript:void(0)" 
        id="${idBtn}"
        class="play-button position-absolute btn btn-success text-black p-0 d-flex align-items-center justify-content-center rounded-circle bi bi-play-fill" 
        style="width: 40px; height: 40px; font-size: 1.5rem; bottom: 10px; right: 10px;"
        onclick="handleMusic('${data.tracks.data[0].preview}', false, true, '${idBtn}')">
      </a>
    </div> 
</div>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

createCarousel2();

// #endregion
