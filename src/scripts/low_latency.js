import { configRead, configAddChangeListener } from '../config.js';
import { ENABLE_LOW_LATENCY } from '../constants/config.constants.js';

// Low Latency Variables
let curVideo = null;
let minDiff = 9999;
let diff = 0;
let banner = null;
let lowLatencyEnabled = false;
let lowLatencyInterval = null;

/**
 * Find and set the current video element
 */
function checkCurVideo() {
  const videos = document.querySelectorAll('video');
  if (videos.length === 1) {
    curVideo = videos[0];
  } else {
    curVideo = null;
  }
}

/**
 * Create the latency banner element
 */
function createLatencyBanner() {
  if (banner) return;

  banner = document.createElement('div');
  banner.className = 'taf-low-latency-banner';

  banner.innerHTML = 'Delay: <span class="taf-latency-value"></span>s';

  document.body.appendChild(banner);
}

/**
 * Initialize low latency mode on the current video
 */
function initializeLowLatency() {
  checkCurVideo();

  if (!curVideo) {
    if (lowLatencyEnabled) {
      setTimeout(initializeLowLatency, 1000);
    }
    return;
  }

  if (lowLatencyEnabled) {
    try {
      const videoAtInit = curVideo;

      function waitForBuffer() {
        if (!lowLatencyEnabled || curVideo !== videoAtInit) return;
        if (videoAtInit.buffered.length > 0) {
          videoAtInit.currentTime = videoAtInit.buffered.end(0);

          function checkMinDiff() {
            setTimeout(() => {
              if (diff <= 0) {
                checkMinDiff();
              }
              minDiff = diff;
            }, 5000);
          }
          checkMinDiff();
        } else {
          setTimeout(waitForBuffer, 1000);
        }
      }
      waitForBuffer();
    } catch (err) {
      console.warn('Error initializing low latency:', err);
    }
  }
}

/**
 * Check latency and update banner
 */
function checkLatency() {
  if (!lowLatencyEnabled) return;

  checkCurVideo();

  if (curVideo) {
    try {
      if (curVideo.buffered.length > 0) {
        diff = curVideo.buffered.end(0) - curVideo.currentTime;

        if (diff > 0) {
          if (diff < minDiff) {
            minDiff = diff;
          }

          if (banner) {
            const diffRound = Math.round(diff * 10) / 10;
            const latencyValueElement = banner.querySelector('.taf-latency-value');
            if (latencyValueElement) {
              latencyValueElement.textContent = diffRound;
            }
            banner.style.display = 'block';
          }
        }
      }
    } catch (err) {
      console.warn('Error checking latency:', err);
    }
  }
}

/**
 * Start the low latency monitoring
 */
function startLowLatencyMonitoring() {
  if (lowLatencyInterval) return;

  initializeLowLatency();

  let lastVideo = curVideo;
  lowLatencyInterval = setInterval(() => {
    checkLatency();
    if (curVideo !== lastVideo) {
      lastVideo = curVideo;
      minDiff = 9999;
      initializeLowLatency();
    }
  }, 5000);
}

/**
 * Stop the low latency monitoring
 */
function stopLowLatencyMonitoring() {
  if (lowLatencyInterval) {
    clearInterval(lowLatencyInterval);
    lowLatencyInterval = null;
  }

  if (banner) {
    banner.style.display = 'none';
  }

  minDiff = 9999;
  diff = 0;
}

/**
 * Update low latency state based on configuration
 */
function updateLowLatencyState() {
  const enabled = configRead(ENABLE_LOW_LATENCY);

  lowLatencyEnabled = enabled;

  if (lowLatencyEnabled) {
    if (!banner) {
      createLatencyBanner();
    }
    startLowLatencyMonitoring();
  } else {
    stopLowLatencyMonitoring();
  }
}

/**
 * Initialize the low latency feature
 */
function initLowLatency() {
  // Create banner element
  createLatencyBanner();

  // Read initial configuration
  updateLowLatencyState();

  // Listen for configuration changes
  configAddChangeListener(ENABLE_LOW_LATENCY, () => {
    updateLowLatencyState();
  });

}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLowLatency);
} else {
  initLowLatency();
}
