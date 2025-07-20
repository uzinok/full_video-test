"use strict";

const customVideo = document.querySelector('.custom-video');
const video = customVideo.querySelector('.custom-video__elements');
const buttonStart = customVideo.querySelector('.custom-video__start');
const buttonPlayPause = customVideo.querySelector('.custom-video__play-pause');
const rangeTime = customVideo.querySelector('.custom-video__range-elements');
const timeBefore = customVideo.querySelector('.custom-video__range-before');
const timeAfter = customVideo.querySelector('.custom-video__range-after');
const fullscreen = customVideo.querySelector('.custom-video__fullscreen');
const buttonSound = customVideo.querySelector('.custom-video__sound-button');
const rangeSound = customVideo.querySelector('.custom-video__sound-range');
const soundDownload = customVideo.querySelector('.custom-video__download');
const buttonCC = customVideo.querySelector('.custom-video__button-cc');
const labelSpeed = customVideo.querySelector('.custom-video__speed-label span');
const rangeSpeed = customVideo.querySelector('.custom-video__speed-range');
const buttonSettings = customVideo.querySelector('.custom-video__settings');
video.controls = false;
if (video.muted) {
  buttonSound.classList.add('custom-video__sound-button--muted');
}
const setDuration = () => {
  rangeTime.setAttribute("max", video.duration);
  timeAfter.innerText = secondsToTime(0);
  timeBefore.innerText = secondsToTime(video.duration);
};
const handleLoadedMetaData = () => {
  setDuration();
};
video.addEventListener("loadedmetadata", handleLoadedMetaData);

// start
const handleButtonStart = () => {
  buttonStart.removeEventListener('click', handleButtonStart);
  buttonStart.classList.add('hidden');
  toggleMuted();
};
const toggleButtonPlayPause = () => {
  buttonPlayPause.classList.toggle('custom-video__play-pause--played');
};
if (video.muted && video.autoplay && buttonStart) {
  buttonStart.classList.remove('hidden');
  buttonStart.addEventListener('click', handleButtonStart);
  toggleButtonPlayPause();
  buttonSound.classList.add('custom-video__sound-button--muted');
}
const handleButtonPlayPause = () => {
  if (video.paused || video.ended) {
    if (video.duration - video.currentTime <= 10) {
      video.currentTime = 0;
    }
    video.play();
    toggleButtonPlayPause();
  } else {
    video.pause();
    buttonPlayPause.classList.remove('custom-video__play-pause--played');
  }
};
buttonPlayPause.addEventListener('click', handleButtonPlayPause);

// time
const secondsToTime = SECONDS => {
  return new Date(SECONDS * 1000).toISOString().slice(11, 19);
};
const handleTimeUpdate = () => {
  if (!rangeTime.getAttribute("max")) {
    setDuration();
  }
  rangeTime.value = video.currentTime;
  timeAfter.innerText = secondsToTime(video.currentTime);
};
video.addEventListener("timeupdate", handleTimeUpdate);
const handleEnded = () => {
  buttonPlayPause.classList.remove('custom-video__play-pause--played');
};
video.addEventListener('ended', handleEnded);
const handleRangeTime = () => {
  video.currentTime = +rangeTime.value;
};
rangeTime.addEventListener('input', handleRangeTime);

// sound
const toggleMuted = () => {
  buttonSound.classList.toggle('custom-video__sound-button--muted');
  video.muted = !video.muted;
};
const handleButtonSound = () => {
  if (video.volume === 0) {
    return;
  }
  toggleMuted();
};
buttonSound.addEventListener('click', handleButtonSound);
const handleRangeSound = () => {
  video.volume = rangeSound.value;
  buttonSound.classList.toggle('custom-video__sound-button--down', +rangeSound.value <= 0.5);
  buttonSound.classList.toggle('custom-video__sound-button--muted', +rangeSound.value === 0);
  video.muted = !video.volume;
};
rangeSound.addEventListener('input', handleRangeSound);

// fullscreen
const toggleFullscreenClass = () => {
  customVideo.classList.toggle('custom-video--fullscreen');
};
const handleFullscreenchange = () => {
  if (document.fullscreenElement === null) {
    toggleFullscreenClass();
    customVideo.removeEventListener('fullscreenchange', handleFullscreenchange);
  }
};
const handleFullscreen = () => {
  if (document.fullscreenElement === null) {
    customVideo.addEventListener('fullscreenchange', handleFullscreenchange);
    customVideo.requestFullscreen();
  } else {
    customVideo.removeEventListener('fullscreenchange', handleFullscreenchange);
    document.exitFullscreen();
  }
  toggleFullscreenClass();
};
fullscreen.addEventListener('click', handleFullscreen);

// speed
const handleRangeSpeed = () => {
  video.playbackRate = +rangeSpeed.value;
  labelSpeed.innerText = +rangeSpeed.value;
};
rangeSpeed.addEventListener('input', handleRangeSpeed);
const checkSettingsClick = evt => {
  if (!evt.target.closest('.custom-video__settings') && !evt.target.closest('.custom-video__list-settings')) {
    closeSetting();
  }
};
const openSetting = () => {
  buttonSettings.classList.add('custom-video__settings--opened');
  document.addEventListener('click', checkSettingsClick);
};
const closeSetting = () => {
  buttonSettings.classList.remove('custom-video__settings--opened');
  document.removeEventListener('click', checkSettingsClick);
};
const handleButtonSettings = () => {
  if (buttonSettings.classList.contains('custom-video__settings--opened')) {
    return closeSetting();
  }
  openSetting();
};
buttonSettings.addEventListener('click', handleButtonSettings);

// track
// subtitles

const toggleButtonCCClassHidden = () => {
  buttonCC.classList.toggle('hidden');
};
if (video.textTracks.length === 0) {
  toggleButtonCCClassHidden();
} else {
  for (var i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = "hidden";
  }
}
const handleButtonCC = () => {
  if (video.textTracks[0].mode === 'hidden') {
    video.textTracks[0].mode = 'showing';
    buttonCC.classList.toggle('custom-video__button-cc--current');
  } else {
    buttonCC.classList.toggle('custom-video__button-cc--current');
    video.textTracks[0].mode = 'hidden';
  }
};
if (video.textTracks.length === 1) {
  buttonCC.addEventListener('click', handleButtonCC);
}
const toggleButtonCCClassCurrent = (AllButtonListCC, current) => {
  AllButtonListCC.forEach(button => {
    button.classList.toggle('custom-video__button-cc--current', +button.dataset.track === +current);
  });
};
const createButtonCC = (label, dataTrack) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = label;
  button.classList.add('custom-video__button-settings');
  button.classList.add('custom-video__button-cc');
  button.dataset.track = dataTrack;
  return button;
};
if (video.textTracks.length > 1) {
  toggleButtonCCClassHidden();
  const AllButtonListCC = [];
  const listCC = document.createElement('ul');
  listCC.classList.add('custom-video__list-cc');
  const li = document.createElement('li');
  const buttonHiddenCC = createButtonCC('Отключить', -1);
  AllButtonListCC.push(buttonHiddenCC);
  toggleButtonCCClassCurrent(AllButtonListCC, -1);
  li.append(buttonHiddenCC);
  listCC.append(li);
  for (let i = 0; i < video.textTracks.length; i++) {
    const element = video.textTracks[i];
    const li = document.createElement('li');
    const button = createButtonCC(element.label, i);
    AllButtonListCC.push(button);
    li.append(button);
    listCC.append(li);
  }
  buttonCC.after(listCC);
  listCC.addEventListener('click', evt => {
    if (!evt.target.dataset.track) {
      return;
    }
    const datasetTrack = evt.target.dataset.track;
    for (var i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "hidden";
    }
    toggleButtonCCClassCurrent(AllButtonListCC, datasetTrack);
    if (datasetTrack !== '-1') {
      video.textTracks[datasetTrack].mode = 'showing';
    }
  });
}