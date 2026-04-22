// #region SEARCH BAR
const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions-container");

const searchIcon = document.querySelector(".bi-collection-play");

const handleSearch = () => {
  const query = searchInput.value.trim();
  if (query) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data.length > 0) {
          window.location.href = `artist.html?id=${result.data[0].artist.id}`;
        } else {
          alert("Nessun artista trovato.");
        }
      })
      .catch((err) => console.error("Errore ricerca:", err));
  }
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length > 1) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
      .then((res) => res.json())
      .then((obj) => {
        suggestionsContainer.innerHTML = "";
        const seenArtists = new Set();
        const limitedArtists = obj.data
          .filter((item) => {
            if (!seenArtists.has(item.artist.id)) {
              seenArtists.add(item.artist.id);
              return true;
            }
            return false;
          })
          .slice(0, 5);

        limitedArtists.forEach((item) => {
          const suggestionItem = document.createElement("button");
          suggestionItem.className =
            "list-group-item list-group-item-action bg-dark text-white border-secondary d-flex align-items-center gap-3 py-2";
          suggestionItem.style.border = "1px solid #333";
          suggestionItem.innerHTML = `
            <img src="${item.artist.picture_small}" class="rounded-circle" style="width: 35px; height: 35px; object-fit: cover;">
            <div class="text-truncate">
                <p class="mb-0 fw-bold">${item.artist.name}</p>
                <small class="text-secondary">Artista</small>
            </div>`;

          suggestionItem.onclick = () => {
            window.location.href = `artist.html?id=${item.artist.id}`;
          };
          suggestionsContainer.appendChild(suggestionItem);
        });
      });
  } else {
    suggestionsContainer.innerHTML = "";
  }
});

if (searchIcon) {
  searchIcon.style.cursor = "pointer";
  searchIcon.addEventListener("click", handleSearch);
}

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

document.addEventListener("click", (e) => {
  if (
    !searchInput.contains(e.target) &&
    !suggestionsContainer.contains(e.target)
  ) {
    suggestionsContainer.innerHTML = "";
  }
});
// #endregion
