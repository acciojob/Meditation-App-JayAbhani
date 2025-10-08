// Elements
const app = document.getElementById("app");
const video = document.querySelector(".bg-video");
const audio = document.querySelector(".song");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeSelect = document.getElementById("time-select");
const soundButtons = document.querySelectorAll(".sound-picker .sound-btn");
const progressCircle = document.querySelector(".progress");

// Defaults
let duration = 600000; // 10 min in ms (default)
timeDisplay.textContent = "10:0"; // per requirement

// Helper: format ms -> M:SS (NOTE: initial spec shows 10:0, so pad only seconds when >=10)
function fmt(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? s : s}`; // keep 10:0 style for 600000 initial (handled above)
}

// Progress ring length (circle r=45 => ~282.743)
const RING = 2 * Math.PI * 45;

// PLAY/PAUSE
function togglePlay() {
  if (audio.paused) {
    audio.play();
    video.play();
    playBtn.classList.add("is-playing");
  } else {
    audio.pause();
    video.pause();
    playBtn.classList.remove("is-playing");
  }
}

playBtn.addEventListener("click", togglePlay);

// TIME PRESETS
timeSelect.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-time]");
  if (!btn) return;

  duration = Number(btn.dataset.time);

  // Reset state
  audio.currentTime = 0;
  progressCircle.style.strokeDashoffset = RING;
  playBtn.classList.remove("is-playing");
  audio.pause(); video.pause();

  // Update display (e.g., 2:0, 5:0, 10:0)
  const mins = Math.floor(duration / 60000);
  timeDisplay.textContent = `${mins}:0`;
});

// SOUND PICK
soundButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const soundSrc = btn.getAttribute("data-sound");
    const videoSrc = btn.getAttribute("data-video");

    const wasPlaying = !audio.paused;

    audio.src = soundSrc;
    video.querySelector("source").src = videoSrc;
    video.load(); // ensure new source applied

    // If it was playing, continue; else stay paused
    if (wasPlaying) {
      audio.play();
      video.play();
      playBtn.classList.add("is-playing");
    } else {
      playBtn.classList.remove("is-playing");
    }
  });
});

// TICK: update time + ring
audio.ontimeupdate = () => {
  const current = audio.currentTime * 1000;
  const remaining = duration - current;

  // Update ring
  const progress = Math.max(0, remaining) / duration;
  progressCircle.style.strokeDasharray = RING;
  progressCircle.style.strokeDashoffset = Math.max(0, RING * progress);

  // Update display
  if (remaining >= 0) {
    const sec = Math.ceil(remaining / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    timeDisplay.textContent = `${m}:${s < 10 ? s : s}`;
  }

  // When finished
  if (current >= duration) {
    audio.pause();
    video.pause();
    playBtn.classList.remove("is-playing");
    audio.currentTime = 0;
    progressCircle.style.strokeDashoffset = RING;

    // Reset text to preset style (e.g., 10:0)
    const mins = Math.floor(duration / 60000);
    timeDisplay.textContent = `${mins}:0`;
  }
};
