// #region GET ANNUNCI
let urlSearch = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const searchTerms = [
  "mengoni",
  "james arthur",
  "alan walker",
  "maneskin",
  "elodie",
  "taylor swift",
  "avril lavigne",
];
let currentTermIndex = 0;
let adInterval;

const getAd = () => {
  const row = document.getElementById("playlist-card");
  if (!row) return;

  if (currentTermIndex >= searchTerms.length) {
    const lastCard = document.getElementById("ad-card");
    if (lastCard) {
      lastCard.classList.add("fade-out");

      setTimeout(() => {
        row.classList.add("d-none");
      }, 600);
    }

    clearInterval(adInterval);
    return;
  }

  // --- LOGICA DI CAMBIO NORMALE ---
  const oldCard = document.getElementById("ad-card");
  if (oldCard) {
    oldCard.classList.add("fade-out");
  }

  setTimeout(() => {
    const term = searchTerms[currentTermIndex];

    fetch(urlSearch + term)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Fetch Errata", response.status);
        }
      })
      .then((data) => {
        const songData = data.data[0];

        row.innerHTML = `
            <div id="ad-card" class="card text-white overflow-hidden border-0 position-relative fade-in" style="transition: background 0.8s ease;">
                
                <div class="position-absolute top-0 end-0 mt-2 me-3">
                    <small class="fw-bold opacity-75" style="letter-spacing: 1px; font-size: 0.7rem;">ANNUNCI</small>
                </div>

                <div class="row g-0 align-items-center">
                    <div class="col-2">
                        <img id="ad-img" src="${songData.album.cover_big}" 
                             class="img-fluid object-fit-cover rounded-start h-100 ms-2" 
                             alt="album cover" crossorigin="anonymous">
                    </div>
                    
                    <div class="col-10">
                        <div class="card-body justify-content-start">
                            <a class="m-0 text-decoration-none text-white d-none d-md-block"><p class="fw-bold m-0">Album</p></a>
                            <a href="./album.html?id=${songData.album.id}" class="link text-white text-decoration-none"><h2 class="card-title fw-bold link">${songData.album.title}</h2></a>
                            <a href="./artist.html?id=${songData.artist.id}" class="link text-white text-decoration-none"><p class="d-none d-md-block link">${songData.artist.name}</p></a>
                            <p class="card-text d-none d-md-block">Ascolta il nuovo album di ${songData.artist.name}!</p>
                            <div class="d-flex gap-2 mt-3 d-none d-md-block ms-2">
                                <a href="#" id="play" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold me-2" onclick="handleMusic('${songData.album.title.replace(/'/g, "\\'")}', '${songData.artist.name.replace(/'/g, "\\'")}', '${songData.album.cover_big}', '${songData.preview}', false)">Play</a>
                                <a href="#" class="btn btn-outline-light rounded-5 px-4 py-2 fw-bold">Save</a>
                            </div>
                            <div class="d-flex gap-2 mt-3 d-md-none">
                                <a href="#" id="play-mobile" class="btn btn-success text-black rounded-5 px-4 py-2 fw-bold bi bi-play-circle-fill" onclick="handleMusic('${songData.album.title.replace(/'/g, "\\'")}', '${songData.artist.name.replace(/'/g, "\\'")}', '${songData.album.cover_big}', '${songData.preview}', true)"></a>
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
          img.addEventListener("load", applyGradient);
        }

        currentTermIndex++;
      })
      .catch((error) => {
        console.log("Errore annunci:", error);
      });
  }, 600);
};

getAd();

adInterval = setInterval(getAd, 8000);
// #endregion

// #region Resize Sidebar Left

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLeft = document.getElementById("sidebarLeft");

  if (sidebarLeft) {
    // 1. Crea l'elemento
    const resizer = document.createElement("div");
    resizer.id = "resizerLeft";
    resizer.className = "resizer-v";

    sidebarLeft.after(resizer);

    const handleMouseMove = (e) => {
      // Se è collassata non ridimensionare
      if (sidebarLeft.classList.contains("sidebar-collapsed")) return;

      let newWidth = e.clientX;
      if (newWidth > 250 && newWidth < 900) {
        sidebarLeft.style.setProperty('width', newWidth + 'px', 'important');
      }
    };

    const handleMouseUp = () => {
      document.body.classList.remove('resizing-active');
      resizer.classList.remove('resizing');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    resizer.addEventListener('mousedown', (e) => {
      if (sidebarLeft.classList.contains("sidebar-collapsed")) return;
      
      e.preventDefault();
      document.body.classList.add('resizing-active');
      resizer.classList.add('resizing');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    });
  }
});

{
  const sidebar = document.getElementById("sidebarLeft");
  if (sidebar) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isCollapsed = sidebar.classList.contains("sidebar-collapsed");
          if (isCollapsed) {
            sidebar.style.removeProperty("width");
            sidebar.style.setProperty("min-width", "0px", "important");
            sidebar.style.setProperty("max-width", "60px", "important");
          } else {
            sidebar.style.removeProperty("min-width");
            sidebar.style.removeProperty("max-width");
          }
        }
      });
    });
    observer.observe(sidebar, { attributes: true });
  }
}

// #endregion

// #region Resize Sidebar Right
{
  const sidebarRight = document.getElementById("sidebarRight");
  const resizerRight = document.getElementById("resizerRight");

  if (sidebarRight && resizerRight) {
    const handleMouseMoveRight = (e) => {
      if (sidebarRight.classList.contains("sidebar-collapsed")) return;

      let newWidth = window.innerWidth - e.clientX;

      if (newWidth > 200 && newWidth < 900) {                                                       // Per aumentare o diminuire quanto è espandibile la sidebar
        sidebarRight.style.setProperty('width', newWidth + 'px', 'important');
      }
    };

    const handleMouseUpRight = () => {
      document.body.classList.remove('resizing-active');
      resizerRight.classList.remove('resizing');
      window.removeEventListener('mousemove', handleMouseMoveRight);
      window.removeEventListener('mouseup', handleMouseUpRight);
    };

    resizerRight.addEventListener('mousedown', (e) => {
      if (sidebarRight.classList.contains("sidebar-collapsed")) return;
      
      e.preventDefault();
      document.body.classList.add('resizing-active');
      resizerRight.classList.add('resizing');
      window.addEventListener('mousemove', handleMouseMoveRight);
      window.addEventListener('mouseup', handleMouseUpRight);
    });
  }
}

{
  const sidebarRight = document.getElementById("sidebarRight");

  if (sidebarRight) {
    const observerRight = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          if (sidebarRight.classList.contains("sidebar-collapsed")) {
            sidebarRight.style.removeProperty("width");
            sidebarRight.style.setProperty("min-width", "65px", "important");
            sidebarRight.style.setProperty("max-width", "65px", "important");
          } else {
            sidebarRight.style.removeProperty("min-width");
            sidebarRight.style.removeProperty("max-width");
          }
        }
      });
    });
    observerRight.observe(sidebarRight, { attributes: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebarRight = document.getElementById("sidebarRight");

  if (sidebarRight) {
    // 1. Crea l'elemento resizer
    const resizerR = document.createElement("div");
    resizerR.id = "resizerRight";
    resizerR.className = "resizer-v";

    sidebarRight.before(resizerR);

    // 3. Logica di Resize
    const handleMouseMoveRight = (e) => {
      let newWidth = window.innerWidth - e.clientX;

      if (newWidth > 200 && newWidth < 900) {                                             // Per aumentare o diminuire quanto è espandibile la sidebar
        sidebarRight.style.setProperty('width', newWidth + 'px', 'important');
      }
    };

    const handleMouseUpRight = () => {
      document.body.classList.remove('resizing-active');
      resizerR.classList.remove('resizing');
      window.removeEventListener('mousemove', handleMouseMoveRight);
      window.removeEventListener('mouseup', handleMouseUpRight);
    };

    resizerR.addEventListener('mousedown', (e) => {
      e.preventDefault();
      document.body.classList.add('resizing-active');
      resizerR.classList.add('resizing');
      window.addEventListener('mousemove', handleMouseMoveRight);
      window.addEventListener('mouseup', handleMouseUpRight);
    });
  }
});

// #endregion