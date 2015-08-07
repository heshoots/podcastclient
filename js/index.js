var onplayhead, followtime, controls, music, totalTime,
sBack, pButton, sForwards, nButton, playhead, timeline, timelineWidth;

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
  return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// mouseDown EventListener
function mouseDown() {
  onplayhead = true;
  window.addEventListener('mousemove', moveplayhead, true);
  music.removeEventListener('timeupdate', timeUpdate, false);
}

function changeSong(url) {
  music.src = url;
}

// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
    if (onplayhead == true) {
      moveplayhead(e);
      window.removeEventListener('mousemove', moveplayhead, true);
      // change current time
      music.currentTime = duration * clickPercent(e);
      music.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
  }
  // mousemove EventListener
  // Moves playhead as user drags
function moveplayhead(e) {
  var newMargLeft = e.pageX - timeline.offsetLeft;
  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }
}

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
  var playPercent = timelineWidth * (music.currentTime / duration);
  followtime.innerHTML = getTimeText(music.currentTime)
  totaltime.innerHTML = getTimeText(music.duration)
  playhead.style.marginLeft = playPercent + "px";
  if (music.currentTime == duration) {
    pButton.className = "";
    pButton.className = "play";
  }
}

function seekback() {
  music.currentTime -= 30;
}

function seekforward() {
  music.currentTime += 30;
}

//Play and Pause
function play() {
  // start music
  if (music.paused) {
    music.play();
    // remove play, add pause
    pButton.className = "";
    pButton.className = "pause";
  } else { // pause music
    music.pause();
    // remove pause, add play
    pButton.className = "";
    pButton.className = "play";
  }
}

$(document).ready(function() {
  $("#podplayer").hide();
  $("#feeddrawer").hide();
  $("#closefeed").hide();

  $(".addfeed").click(function() {
    $("#addfeed").hide();
    $("#closefeed").show();
    $("#feeddrawer").show();
  })

  $(".closefeed").click(function() {
    $("#closefeed").hide();
    $("#addfeed").show();
    $("#feeddrawer").hide();
  })

  $("#buttonLeft").click(function() {
    $('#podplayer').hide();
    $('#feed').show();
  })

  $("#buttonRight").click(function() {
    $('#feed').hide();
    $('#podplayer').show();
  });


});


function getTimeText(timeinseconds) {
  var seconds = (timeinseconds % 60)
  var minutes = ((timeinseconds - seconds) / 60) % 60
  var hours = (timeinseconds - 60 * minutes - seconds) / 3600
  if (hours > 0) {
    return "" + hours + ":" + leadingZero(minutes) + ":" + leadingZero(seconds)
  } else {
    return "" + leadingZero(minutes) + ":" + leadingZero(seconds)
  }
}

function playpod(url) {
  music.src = url;
  play();
}

function leadingZero(num) {
  num = num.toFixed()
  if (num < 10) {
    return "0" + num
  } else return "" + num
}

window.onload = function() {
  followtime = document.getElementById('currenttime')
  controls = document.getElementById('controls')
  music = document.getElementById('music'); // id for audio element
  totalTime = document.getElementById('totaltime');
  sBack = document.getElementById('seekbackwards'); //seekbackwards button
  pButton = document.getElementById('pButton'); // play button
  sForwards = document.getElementById('seekforwards'); //seekforwards button
  nButton = document.getElementById('nextpod'); //next button
  playhead = document.getElementById('playhead'); // playhead
  timeline = document.getElementById('timeline'); // timeline
  // timeline width adjusted for playhead
  timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
  // timeupdate event listener
  music.addEventListener("timeupdate", timeUpdate, false);

  //Makes timeline clickable
  timeline.addEventListener("click", function(event) {
    moveplayhead(event);
    music.currentTime = duration * clickPercent(event);
  }, false);

  // Makes playhead draggable
  playhead.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  // Boolean value so that mouse is moved on mouseUp only when the playhead is released
  onplayhead = false;

  // Gets audio file duration
  music.addEventListener("canplaythrough", function() {
    duration = music.duration;
  }, false);

}
