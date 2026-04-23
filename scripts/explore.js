const spotifyColors = [
  "#27856A",
  "#1E3264",
  "#8D67AB",
  "#E8115B",
  "#BC5900",
  "#D84000",
  "#E1118C",
];
const PROXY = "https://corsproxy.io/?";

async function renderGenres() {
  const grid = document.getElementById("genre-grid");
  if (!grid) return;

  try {
    const response = await fetch(`${PROXY}https://api.deezer.com/genre`);
    const result = await response.json();
    const genres = result.data;

    grid.innerHTML = "";

    genres.forEach((genre, index) => {
      if (genre.id === 0) return; // Salta "All"

      const color = spotifyColors[index % spotifyColors.length];
      const col = document.createElement("div");

      // Classi Bootstrap native per gestire le colonne (5 su desktop)
      col.className = "col-6 col-md-4 col-lg-3 col-xl-2 mb-4";

      col.innerHTML = `
        <div class="card genre-card border-0" 
             style="background-color: ${color}; height: 120px; position: relative; overflow: hidden; cursor: pointer;" 
             onclick="handleGenreClick(${genre.id}, '${genre.name}')">
          <div class="card-body">
            <h5 class="card-title text-white fw-bold">${genre.name}</h5>
            <img src="${genre.picture_medium}" alt="${genre.name}" 
                 style="position: absolute; width: 85px; bottom: -10px; right: -15px; transform: rotate(25deg); opacity: 0.9; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  } catch (error) {
    console.error("Errore nel caricamento generi:", error);
  }
}

function handleGenreClick(id, name) {
  // Reindirizza alla nuova pagina passando i dati nell'URL
  window.location.href = `explore-result.html?id=${id}&name=${encodeURIComponent(name)}`;
}

renderGenres();

