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
