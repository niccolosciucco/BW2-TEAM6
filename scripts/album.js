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
        div.innerHTML += `
        <div class="d-flex align-items-center px-3 py-2 rounded text-light">
          <span class="text-secondary small" style="width: 30px; flex-shrink: 0;">${index + 1}</span>
          
          <div class="flex-grow-1 overflow-hidden">
            <p class="mb-0 text-truncate">${title.title}</p>
            <p class="mb-0 d-flex align-items-center gap-1 text-truncate" style="font-size: 12px">
              <span class="badge bg-secondary text-dark" style="font-size: 10px; flex-shrink: 0;">E</span>
              <span class="text-secondary text-truncate">${title.artist.name}</span>
            </p>
          </div>

          <span class="text-secondary small" style="width: 400px; flex-shrink: 0;">4.435.605</span>
          
          <span class="text-secondary small text-end" style="width: 60px; flex-shrink: 0;">
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
    })
    .catch((error) => {
      console.log(error);
    });
};

getAlbum();
