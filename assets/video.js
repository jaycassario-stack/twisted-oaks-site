// YouTube film: shows a still first and loads the player (with sound) only when someone presses play.
document.querySelectorAll('.yt').forEach(function (box) {
  var id = box.getAttribute('data-id');
  var started = false;
  function start() {
    if (started) return; started = true;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
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
});
    }, { rootMargin: '200px 0px' });
    io.observe(box);
  }
});
