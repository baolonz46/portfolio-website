// ── Paulandvideo Custom Script & Video Player ──

document.addEventListener("DOMContentLoaded", () => {
  initCustomVideoPlayers();
  initEmojiCursor();
  initTypewriter();
  initHeroVideo();
});

// ───────── Hero Video (Loop preciso da sec 7 a 25) ─────────
function initHeroVideo() {
  const heroVideo = document.getElementById("hero-video");
  if (!heroVideo) return;

  heroVideo.addEventListener("loadedmetadata", () => {
    heroVideo.currentTime = 7;
  });

  heroVideo.addEventListener("timeupdate", () => {
    if (heroVideo.currentTime >= 25 || heroVideo.currentTime < 6.5) {
      heroVideo.currentTime = 7;
    }
  });
}

// ───────── Typewriter Effect ─────────
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const words = [
    "Directed",
    "Cinematography",
    "Produced",
    "Written",
    "Casting",
    "Set Design",
    "Edited",
    "VFX",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 70 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1800; // pausa sulla parola completa
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

// ───────── Cursore Emoji Fluttuante ─────────
function initEmojiCursor() {
  const cursor = document.getElementById("emoji-cursor");
  if (!cursor) return;

  window.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX + 14}px`;
    cursor.style.top = `${e.clientY + 14}px`;
  }, { passive: true });

  const cards = document.querySelectorAll(".has-emoji-cursor");
  cards.forEach((card) => {
    const emoji = card.getAttribute("data-emoji");
    const video = card.querySelector("video");

    card.addEventListener("mouseenter", () => {
      if (emoji) {
        cursor.textContent = emoji;
        cursor.style.display = "block";
      }
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });

    card.addEventListener("mouseleave", () => {
      cursor.style.display = "none";
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  });
}

// ───────── Custom Sleek Video Player (Non-Stock) ─────────
function initCustomVideoPlayers() {
  const players = document.querySelectorAll(".custom-video-player");

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s.toString().padStart(2, "0")}`;
  }

  // Lista di tutti i video registrati per coordinamento esclusivo
  const allVideos = [];

  players.forEach((player) => {
    const video = player.querySelector("video");
    const centerPlayBtn = player.querySelector(".btn-center-play");
    const bottomBar = player.querySelector(".player-controls-bar");
    const playPauseBtn = player.querySelector(".btn-play-pause");
    const playIcon = player.querySelector(".icon-play");
    const pauseIcon = player.querySelector(".icon-pause");
    const muteBtn = player.querySelector(".btn-mute");
    const soundOnIcon = player.querySelector(".icon-sound-on");
    const soundOffIcon = player.querySelector(".icon-sound-off");
    const fullscreenBtn = player.querySelector(".btn-fullscreen");
    const timeDisplay = player.querySelector(".time-display");
    const track = player.querySelector(".progress-track");
    const progressBar = player.querySelector(".progress-fill");

    if (!video) return;
    allVideos.push(video);

    let hideTimeout = null;

    function showControls() {
      if (bottomBar) bottomBar.style.opacity = "1";
      if (hideTimeout) clearTimeout(hideTimeout);
      if (!video.paused) {
        hideTimeout = setTimeout(() => {
          if (bottomBar) bottomBar.style.opacity = "0";
        }, 2500);
      }
    }

    function updatePlayState(isPlaying) {
      if (centerPlayBtn) {
        centerPlayBtn.style.display = isPlaying ? "none" : "flex";
      }
      if (playIcon && pauseIcon) {
        playIcon.style.display = isPlaying ? "none" : "block";
        pauseIcon.style.display = isPlaying ? "block" : "none";
      }
    }

    function togglePlay() {
      if (video.paused) {
        // Pausa categoricamente qualsiasi altro video prima di riprodurre
        pauseAllOtherVideos(video);
        video.play().then(() => updatePlayState(true)).catch(() => {});
      } else {
        video.pause();
        updatePlayState(false);
      }
      showControls();
    }

    function toggleMute() {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      updateMuteState(nextMuted);

      if (!nextMuted) {
        pauseAllOtherVideos(video);
      }
      showControls();
    }

    function updateMuteState(isMuted) {
      if (soundOnIcon && soundOffIcon) {
        soundOnIcon.style.display = isMuted ? "none" : "block";
        soundOffIcon.style.display = isMuted ? "block" : "none";
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        if (player.requestFullscreen) player.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
      showControls();
    }

    function handleSeek(e) {
      if (!track || !video.duration) return;
      const rect = track.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newTime = (clickX / rect.width) * video.duration;
      video.currentTime = newTime;
      showControls();
    }

    if (centerPlayBtn) centerPlayBtn.addEventListener("click", togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    if (muteBtn) muteBtn.addEventListener("click", toggleMute);
    if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
    if (track) track.addEventListener("click", handleSeek);

    player.addEventListener("mousemove", showControls);
    player.addEventListener("touchstart", showControls, { passive: true });
    player.addEventListener("mouseleave", () => {
      if (!video.paused && bottomBar) {
        bottomBar.style.opacity = "0";
      }
    });

    video.addEventListener("play", () => {
      pauseAllOtherVideos(video);
      updatePlayState(true);
    });

    video.addEventListener("pause", () => {
      updatePlayState(false);
    });

    video.addEventListener("timeupdate", () => {
      if (!video.duration) return;
      const percent = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });

    video.addEventListener("loadedmetadata", () => {
      if (timeDisplay) {
        timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
      }
      updatePlayState(!video.paused);
      updateMuteState(video.muted);
    });

    // Stato iniziale: se il video è in pausa, mostra play centrale e pulsante play
    updatePlayState(!video.paused);
    updateMuteState(video.muted);
  });

  // Funzione per mettere in pausa TUTTI gli altri video sulla pagina
  function pauseAllOtherVideos(activeVideo) {
    allVideos.forEach((v) => {
      if (v !== activeVideo && !v.paused) {
        v.pause();
      }
    });
  }
}
