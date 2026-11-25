// The Legacy film: a silent, looping clip hosted on the site. It loads only when it scrolls into view,
// pauses when it scrolls away, and stays still (poster only) for visitors who ask for reduced motion.
document.querySelectorAll('.film').forEach(function (box) {
  var v = box.querySelector('video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.controls = true; }
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var small = window.matchMedia('(max-width: 760px)').matches;
    v.src = box.getAttribute(small ? 'data-sm' : 'data-lg');
  }
  function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  if (!('IntersectionObserver' in window)) { if (!reduce) { load(); play(); } return; }
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { if (!reduce) { load(); play(); } }
      else if (loaded) { v.pause(); }
    });
  }, { rootMargin: '200px 0px' }).observe(box);
});
