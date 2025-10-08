// -------- Elements --------
const video = document.querySelector("video");
const audio = document.querySelector(".song");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeButtons = document.querySelectorAll(".time-select button");

// -------- Default values --------
let duration = 600000; // 10 minutes in milliseconds
let remaining = duration;
let timer; // will store setInterval id
let isPlaying = false;

// -------- Initial display --------
timeDisplay.textContent = "10:0";

// -------- Play / Pause button --------
playBtn.addEventListener("click", function () {
  if (isPlaying === false) {
    // start playing
    isPlaying = true;
    playBtn.textContent = "Pause";
    audio.play();
    video.play();
    startTimer();
  } else {
    // pause playing
    isPlaying = false;
    playBtn.textContent = "Play";
    audio.pause();
    video.pause();
    clearInterval(timer);
  }
});

// -------- Timer function --------
function startTimer() {
  // show 9:59 immediately
  remaining -= 1000;
  updateDisplay();

  timer = setInterval(function () {
    remaining -= 1000;
    updateDisplay();

    // when time ends
    if (remaining <= 0) {
      clearInterval(timer);
      audio.pause();
      video.pause();
      isPlaying = false;
      playBtn.textContent = "Play";
      remaining = duration;
      updateDisplay(true); // reset to "10:0" style
    }
  }, 1000);
}

// -------- Display updater --------
function updateDisplay(reset) {
  let totalSec = Math.ceil(remaining / 1000);
  let min = Math.floor(totalSec / 60);
  let sec = totalSec % 60;

  // reset = true => show like "10:0"
  if (reset === true) {
    timeDisplay.textContent = min + ":0";
  } else {
    // show countdown normally like 9:59, 9:58, etc.
    if (sec < 10) sec = "0" + sec;
    timeDisplay.textContent = min + ":" + sec;
  }
}

// -------- Time selection buttons --------
timeButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // read value from data-time attribute
    duration = Number(btn.getAttribute("data-time"));
    remaining = duration;

    // stop any running timer
    clearInterval(timer);
    isPlaying = false;
    playBtn.textContent = "Play";

    // update display (2:0, 5:0, 10:0)
    let mins = Math.floor(duration / 60000);
    timeDisplay.textContent = mins + ":0";
  });
});
