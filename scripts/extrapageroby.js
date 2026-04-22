/**
 * Logica Dedica Speciale - FIX ICONA PLAY/PAUSE
 */

const initDedicaSpeciale = () => {
  const searchTerms = "The Smashing Pumpkins Luna";
  const itunesApi = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerms)}&limit=1&entity=song`;

  const btnPlay = document.getElementById("play-dedica");

  if (btnPlay) {
    btnPlay.onclick = async () => {
      // Se esiste già un audio globale e sta suonando questa canzone, lo mettiamo in pausa
      // Nota: Adattato per funzionare con la tua handleMusic globale
      try {
        console.log("Ricerca brano su iTunes API...");
        const response = await fetch(itunesApi);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const track = data.results[0];
          const title = track.trackName;
          const artist = track.artistName;
          const cover = track.artworkUrl100.replace("100x100bb", "600x600bb");
          const audioUrl = track.previewUrl;

          // Aggiorna l'immagine della card
          const cardImg = document.getElementById("img-card-dedica");
          if (cardImg) cardImg.src = cover;

          console.log("Brano trovato! Chiamata a handleMusic...");

          // Chiamata alla tua funzione globale
          // Passiamo l'ID "play-dedica"
          handleMusic(
            title,
            artist,
            cover,
            audioUrl,
            false, // isMobile
            true, // isMouseHover
            "play-dedica", // Questo ID serve a updateBtnIcon per switchare l'icona
          );

          // --- TRUCCO PER IL TOGGLE ---
          // Se la tua handleMusic non gestisce il ritorno a PLAY,
          // lo facciamo noi monitorando lo stato dell'audio dopo un piccolo delay
          setTimeout(() => {
            const globalAudio = document.getElementById("audio"); // ID standard del tuo player
            if (globalAudio) {
              globalAudio.onpause = () => {
                const icon = btnPlay.querySelector("i");
                icon.classList.remove("bi-pause-circle-fill");
                icon.classList.add("bi-play-circle-fill");
              };
              globalAudio.onplay = () => {
                const icon = btnPlay.querySelector("i");
                icon.classList.remove("bi-play-circle-fill");
                icon.classList.add("bi-pause-circle-fill");
              };
            }
          }, 500);
        }
      } catch (error) {
        console.error("Errore durante la riproduzione:", error);
      }
    };
  }
};

window.addEventListener("load", initDedicaSpeciale);
