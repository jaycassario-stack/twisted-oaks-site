// Home page slideshow: slides to the next photo every 5 seconds, loops forever.
// Arrows, swipe and keyboard work too. Pauses on hover, when the tab is hidden,
// and starts paused for visitors who have reduced motion turned on.
(function () {
  var show = document.querySelector('.hero-show');
  if (!show) return;
  var track = show.querySelector('.hs-track');

  // The first photos stay in the order set in the page; the ones marked
  // data-shuffle are mixed into a new random order on every visit.
  var mix = Array.prototype.slice.call(track.querySelectorAll('[data-shuffle]'));
  for (var k = mix.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var tmp = mix[k]; mix[k] = mix[r]; mix[r] = tmp;
  }
  mix.forEach(function (s) { track.appendChild(s); });

  var slides = Array.prototype.slice.call(track.children);
  slides.forEach(function (s, i) { s.setAttribute('aria-label', (i + 1) + ' of ' + slides.length); });
  var total = slides.length;
  var now = show.querySelector('.hs-now');
  var pauseBtn = show.querySelector('.hs-pause');
  var DELAY = 5000;
  var index = 0, timer = null, hovering = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var userPaused = reduced;

  // Copy of the first photo at the end so the loop slides forward seamlessly.
  var clone = slides[0].cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  function prime(i) {
    var s = slides[(i + total) % total];
    var img = s && s.querySelector('img');
    if (img && img.loading === 'lazy') img.loading = 'eager';
  }

  function render(animate) {
    track.classList.toggle('no-anim', !animate);
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    var shown = (index % total) + 1;
    now.textContent = shown < 10 ? '0' + shown : String(shown);
    slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === index % total ? 'false' : 'true'); });
    prime(index + 1); prime(index + 2);
  }

  function go(i) {
    if (i < 0) {           // going back from the first photo: jump to the copy, then slide back
      index = total; render(false);
      void track.offsetWidth;
      index = total - 1; render(true);
    } else {
      index = i; render(true);
    }
    restart();
  }

  track.addEventListener('transitionend', function () {
    if (index >= total) { index = 0; render(false); }
  });

  function tick() { go(index + 1); }
  function stop() { clearTimeout(timer); timer = null; }
  function restart() {
    stop();
    if (!userPaused && !hovering && !document.hidden) timer = setTimeout(tick, DELAY);
  }
  function setPaused(p) {
    userPaused = p;
    show.classList.toggle('paused', p);
    pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    restart();
  }

  show.querySelector('.hs-next').addEventListener('click', function () { go(index + 1); });
  show.querySelector('.hs-prev').addEventListener('click', function () { go(index - 1); });
  pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });
  show.addEventListener('mouseenter', function () { hovering = true; stop(); });
  show.addEventListener('mouseleave', function () { hovering = false; restart(); });
  document.addEventListener('visibilitychange', restart);
  show.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  });

  // Swipe on phones and tablets.
  var startX = null;
  show.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') startX = e.clientX; });
  show.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
  });

  show.classList.toggle('paused', userPaused);
  pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
  render(false);
  restart();
})();
