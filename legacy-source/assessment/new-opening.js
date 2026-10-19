/* First visit: the viewer restores the dormant Aetheridge signal. */
function initOpeningBoot() {
  const boot = document.getElementById('system-boot');
  const lowEndDevice = Boolean(navigator.connection?.saveData ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  if (!boot) return;
  const returning = Boolean(playerRecord);
  const seen = sessionStorage.getItem('egoCheck.boot.v1') === 'complete';
  const forceReplay = new URLSearchParams(location.search).has('intro');
  if (!forceReplay && (returning || seen || isCreatorStandalone())) {
    initSystemBoot({ skip: !returning && seen });
    return;
  }

  document.body.classList.add('booting', 'system-boot-active');
  boot.className = 'system-boot cinematic-boot';
  boot.setAttribute('aria-label', 'EGO Check opening');
  boot.innerHTML = `
    <div class="cinematic-offline">
      <div class="cinematic-topline"><span>EGO CHECK</span><span id="cinematic-status" aria-live="polite">SEARCHING FOR AETHERIDGE SIGNAL</span></div>
      <div class="cinematic-logo-stage" aria-hidden="true">
        <img class="cinematic-empty-logo" src="assets/ego-check-system/empty-logo.webp" fetchpriority="high" alt="">
        <span class="cinematic-logo-placeholder" aria-hidden="true">EGO <b>✓</b></span>
        <img class="cinematic-pulse-logo" src="assets/ego-check-system/pulse-logo.webp" alt="">
        <span class="cinematic-source anchor"></span><span class="cinematic-source flow"></span>
        <span class="cinematic-source shift"></span><span class="cinematic-source surge"></span>
        <span class="cinematic-source flux"></span>
      </div>
      <div class="cinematic-bottomline">
        <div class="cinematic-progress"><span></span></div>
        <p id="cinematic-detail">FIVE PULSE SOURCES DETECTED</p>
        <button id="cinematic-connect" type="button">RESTORE SIGNAL <span aria-hidden="true">→</span></button>
      </div>
    </div>
    <video id="cinematic-video" class="cinematic-video" playsinline preload="${lowEndDevice ? 'none' : 'auto'}" aria-label="Aetheridge and the five Pulses awakening">
      <source src="assets/ego-check-system/ego-opening-web.mp4?v=3" type="video/mp4">
    </video>
    <div class="cinematic-glow" aria-hidden="true"></div>
    <button id="cinematic-skip" class="cinematic-skip" type="button">SKIP INTRO →</button>
  `;

  const emptyLogo = boot.querySelector('.cinematic-empty-logo');
  const showLogoFallback = () => {
    if (!emptyLogo.naturalWidth) boot.classList.add('cinematic-logo-unavailable');
  };
  emptyLogo.addEventListener('error', showLogoFallback);
  if (emptyLogo.complete) showLogoFallback();
  setTimeout(showLogoFallback, 4000);
  emptyLogo.addEventListener('load', () => boot.classList.remove('cinematic-logo-unavailable'));

  const video = document.getElementById('cinematic-video');
  const connect = document.getElementById('cinematic-connect');
  const skip = document.getElementById('cinematic-skip');
  const status = document.getElementById('cinematic-status');
  const detail = document.getElementById('cinematic-detail');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = new Audio('assets/ego-check-system/EGO_DeviceConnect.wav');
  connection.preload = lowEndDevice ? 'none' : 'auto';
  let done = false;
  let finishing = false;
  let safety;
  let fallback = false;
  let failedMedia = false;
  const attemptTimers = [];
  if (reduced) {
    boot.classList.add('cinematic-failed');
    status.textContent = 'CONNECTION LOST';
    detail.textContent = 'A LOCAL SIGNAL REMAINS';
  } else {
    attemptTimers.push(setTimeout(() => {
      status.textContent = 'CONTACT DETECTED';
      detail.textContent = 'PULSES CONVERGING';
    }, 800));
    attemptTimers.push(setTimeout(() => {
      status.textContent = 'CONNECTION UNSTABLE';
      detail.textContent = 'SIGNAL DRIFT DETECTED';
    }, 1700));
    attemptTimers.push(setTimeout(() => {
      boot.classList.add('cinematic-failed');
      status.textContent = 'CONNECTION LOST';
      detail.textContent = 'A LOCAL SIGNAL REMAINS';
      connect.focus({ preventScroll: true });
    }, 2500));
  }
  const finish = immediate => {
    if (done) return;
    done = true;
    clearTimeout(safety);
    attemptTimers.forEach(clearTimeout);
    video.pause();
    connection.pause();
    sessionStorage.setItem('egoCheck.boot.v1', 'complete');
    boot.classList.toggle('cinematic-immediate', immediate);
    boot.classList.add('cinematic-complete');
    boot.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('booting', 'system-boot-active');
    document.body.classList.add('cinematic-entered');
    setTimeout(() => boot.remove(), immediate ? 0 : 650);
  };
  const recoverMedia = () => {
    if (done || failedMedia) return;
    clearTimeout(safety);
    if (!fallback) {
      fallback = true;
      video.src = 'assets/ego-check-system/ego-opening-original-web.mp4';
      video.load();
      if (boot.classList.contains('cinematic-playing')) {
        const usingFallback = fallback;
        video.play().then(() => { safety = setTimeout(recoverMedia, 10000); }).catch(() => {
          if (fallback === usingFallback) recoverMedia();
        });
      }
      return;
    }
    failedMedia = true;
    boot.classList.remove('cinematic-playing');
    status.textContent = 'VIDEO SIGNAL UNAVAILABLE';
    detail.textContent = 'LOCAL TERMINAL STILL ACCESSIBLE';
    connect.textContent = 'OPEN TERMINAL →';
    connect.focus({ preventScroll: true });
  };
  const glow = () => {
    if (done || finishing) return;
    finishing = true;
    boot.classList.add('cinematic-ending');
    setTimeout(() => finish(false), 650);
  };

  connect.addEventListener('click', () => {
    if (done || boot.classList.contains('cinematic-playing')) return;
    if (failedMedia) { finish(true); return; }
    boot.classList.add('cinematic-playing');
    video.currentTime = 0;
    video.playbackRate = 1;
    connection.volume = Math.min(.9, Math.max(.25, (audioSettings?.sfxVolume || .62)));
    connection.play().catch(() => {});
    video.volume = Math.min(.8, Math.max(.25, (audioSettings?.musicVolume || .6)));
    const usingFallback = fallback;
    video.play().then(() => { safety = setTimeout(recoverMedia, 10000); }).catch(() => {
      if (fallback === usingFallback) recoverMedia();
    });
    if (!document.fullscreenElement && document.fullscreenEnabled && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  video.addEventListener('ended', () => {
    clearTimeout(safety);
    setTimeout(glow, 1200);
  });
  video.addEventListener('error', recoverMedia);
  skip.addEventListener('click', () => finish(true));
  boot.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish(true);
  });
}
