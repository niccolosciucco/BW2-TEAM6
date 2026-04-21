const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const getArtist = () => {
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
      //Modificare la pagina, i testi e le immagini con i risultati della fetch
    })
    .catch((error) => {
      console.log(error);
    });
};

getArtist();
