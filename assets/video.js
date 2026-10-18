// Click-to-play YouTube: shows a still first, loads the player only when someone presses play.
document.querySelectorAll('.yt').forEach(function (box) {
  var btn = box.querySelector('.yt-play');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + box.getAttribute('data-id') + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title = 'The Legacy, a short film by Jay Cassario';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(f);
    box.classList.add('on');
  });
});
// Fall back to the smaller still if YouTube has no full-size one for this video.
document.querySelectorAll('.yt img').forEach(function (img) {
  function check() { if (img.naturalWidth && img.naturalWidth < 200) img.src = img.src.replace('maxresdefault', 'hqdefault'); }
  if (img.complete) check(); else img.addEventListener('load', check);
});
