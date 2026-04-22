const urlParams = new URLSearchParams(window.location.search);
const genreName = urlParams.get("name") || "Music";

document.getElementById("genre-title").innerText = genreName;

async function loadCategoryPage() {
  const playlistContainer = document.getElementById("playlist-row");
  const artistContainer = document.getElementById("artist-row");

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(genreName)}&limit=24&entity=song`,
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const albums = data.results.slice(0, 10);
      const artistsData = data.results.slice(10, 20);

      renderItems(albums, "playlist-row", "album");
      renderItems(artistsData, "artist-row", "artist");
    } else {
      console.error("Nessun risultato trovato");
    }
  } catch (error) {
    console.error("Errore nel caricamento:", error);
  }
}

// GESTIONE COLORE DINAMICO (Senza conflitti)
window.myColorPicker = window.myColorPicker || new ColorThief();

function renderItems(data, targetId, type) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = "";

  data.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 col-xl-2 mb-4";

    const title = (item.trackName || item.collectionName || "Brano").replace(
      /'/g,
      "\\'",
    );
    const artist = (item.artistName || "Artista").replace(/'/g, "\\'");
    const img = item.artworkUrl100
      ? item.artworkUrl100.replace("100x100bb", "300x300bb")
      : "";
    const preview = item.previewUrl;
    const cardBtnId = `btn-card-${type}-${index}`;

    col.innerHTML = `
            <div class="card h-100 border-0 p-3 text-white shadow-sm card-hover position-relative" 
                 style="background-color: #181818; cursor: pointer;"
                 onclick="handleMusic('${title}', '${artist}', '${img}', '${preview}', false, true, '${cardBtnId}'); updateHeroBackground('${img}')">
                
                <div class="position-relative">
                    <img src="${img}" class="card-img-top ${type === "artist" ? "rounded-circle" : "rounded"}" 
                         style="aspect-ratio: 1/1; object-fit: cover;" alt="${title}">
                    
                    <button id="${cardBtnId}" class="btn btn-success rounded-circle position-absolute bottom-0 end-0 m-2 shadow-lg" 
                            style="width: 45px; height: 45px; opacity: 0; transition: 0.3s; transform: translateY(10px); border: none; background-color: #1db954;">
                        <i class="bi bi-play-fill" style="color: black; font-size: 1.5rem;"></i>
                    </button>
                </div>
                
                <div class="card-body p-0 mt-3">
                    <h6 class="card-title text-truncate m-0" style="font-size: 0.9rem; font-weight: bold;">${title}</h6>
                    <p class="text-secondary small m-0 text-truncate">${artist}</p>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
}

function updateHeroBackground(imgUrl) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgUrl;

  img.onload = function () {
    try {
      const color = window.myColorPicker.getColor(img);
      const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      const hero = document.querySelector(".hero-result");
      if (hero) {
        hero.style.setProperty("--bg-color", rgbColor);
      }
    } catch (e) {
      console.log("Errore colore saltato");
    }
  };
}

// FONDAMENTALE: Avvia la funzione al caricamento!
loadCategoryPage();
