// Elements
const video = document.querySelector("video");
const audio = document.querySelector(".song");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeButtons = document.querySelectorAll(".time-select button");

// Default 10 mins
let duration = 600000;
let remaining = duration;
let timer = null;
let isPlaying = false;

// Show initial display
timeDisplay.textContent = "10:0";

// Format helper (minutes:seconds)
function format(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? s : s}`;
}

// Play / Pause toggle
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    isPlaying = true;
    playBtn.textContent = "Pause";
    audio.play().catch(() => {});
    video.play().catch(() => {});
    startTimer();
  } else {
    isPlaying = false;
    playBtn.textContent = "Play";
    audio.pause();
    video.pause();
    clearInterval(timer);
  }
});

// Start countdown timer
function startTimer() {
  // Show 9:59 right away
  remaining -= 1000;
  timeDisplay.textContent = format(remaining);

  timer = setInterval(() => {
    remaining -= 1000;
    if (remaining <= 0) {
      clearInterval(timer);
      audio.pause();
      video.pause();
      isPlaying = false;
      playBtn.textContent = "Play";
      remaining = duration;
      timeDisplay.textContent = format(duration).replace(":00", ":0");
    } else {
      timeDisplay.textContent = format(remaining);
    }
  }, 1000);
}

// Change time duration
timeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    duration = Number(btn.dataset.time);
    remaining = duration;
    clearInterval(timer);
    isPlaying = false;
    playBtn.textContent = "Play";
    const mins = Math.floor(duration / 60000);
    timeDisplay.textContent = `${mins}:0`;
  });
});
