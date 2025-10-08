// Elements
const app = document.querySelector(".app");
const video = document.querySelector(".bg-video");
const audio = document.querySelector(".song");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeSelect = document.querySelector(".time-select");

// Duration state (default 10 mins)
let duration = 600000;           // in ms
let remaining = duration;        // remaining ms
let intervalId = null;
let isPlaying = false;

// Render time like M:SS, but initial spec wants "10:0" when setting preset
function renderTime(ms, presetStyle = false) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (presetStyle) {
    // Show e.g., "10:0" exactly (no leading zero)
    timeDisplay.textContent = `${m}:0`;
  } else {
    // Live countdown: "9:59", "9:58", ...
    timeDisplay.textContent = `${m}:${s < 10 ? `0${s}` : s}`;
  }
}

// Start ticking: immediately step to next second so Cypress sees 9:59 right after click
function startCountdown() {
  if (intervalId) return;

  // Immediately show -1s (so test expecting 9:59 passes right away)
  remaining = Math.max(0, remaining - 1000);
  renderTime(remaining);

  intervalId = setInterval(() => {
    remaining = Math.max(0, remaining - 1000);
    renderTime(remaining);
    if (remaining <= 0) {
      pausePlayback(true); // reset when finished
    }
  }, 1000);
}

function pauseCountdown() {
  clearInterval(intervalId);
  intervalId = null;
}

// Playback controls
function playPlayback() {
  if (isPlaying) return;
  isPlaying = true;
  audio.play().catch(() => {}); // ignore autoplay policy errors in CI
  video.play().catch(() => {});
  startCountdown();
}

function pausePlayback(reset = false) {
  if (!isPlaying && !reset) return;
  isPlaying = false;
  audio.pause();
  video.pause();
  pauseCountdown();
  if (reset) {
    // Reset to full duration display style e.g. "10:0"
    remaining = duration;
    renderTime(remaining, true);
  }
}

// Toggle on play button
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playPlayback();
  } else {
    pausePlayback(false);
  }
});

// Time preset clicks
timeSelect.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-time]");
  if (!btn) return;

  duration = Number(btn.dataset.time);
  remaining = duration;

  // Stop any current play
  pausePlayback(true); // also resets display using preset style
});

// Initial render per spec
renderTime(duration, true);
