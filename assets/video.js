// YouTube film: shows a still first, then starts playing muted and looping once it scrolls into view.
// (Browsers only allow autoplay when muted; visitors can turn the sound on with the player controls.)
document.querySelectorAll('.yt').forEach(function (box) {
  var id = box.getAttribute('data-id');
  var started = false;
  function start() {
    if (started) return; started = true;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id + '&rel=0&modestbranding=1&playsinline=1';
    f.title = 'The Legacy, a short film by Jay Cassario';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(f);
    box.classList.add('on');
  }
  var btn = box.querySelector('.yt-play');
  if (btn) btn.addEventListener('click', start);
  var still = box.querySelector('img');
  if (still) {
    var check = function () { if (still.naturalWidth && still.naturalWidth < 200) still.src = still.src.replace('maxresdefault', 'hqdefault'); };
    if (still.complete) check(); else still.addEventListener('load', check);
  }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); start(); } });
    }, { rootMargin: '200px 0px' });
    io.observe(box);
  }
});
