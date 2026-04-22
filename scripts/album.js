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
      //Modificare la pagina, i testi e le immagini con i risultati della fetch
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
      //   chiamata per acquisire la tracklist dell'album
      const tracklist = getTracklist(data.tracklist);
    })
    .catch((error) => {
      console.log(error);
    });
};

getAlbum();
