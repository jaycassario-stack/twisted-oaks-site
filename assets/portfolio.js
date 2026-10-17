// Portfolio page: category tabs (all panels stay visible without JavaScript).
(function(){
  var head=document.querySelector('.kt-head');
  function setH(){ if(head) document.documentElement.style.setProperty('--head-h', head.offsetHeight+'px'); }
  setH(); addEventListener('resize', setH);
  var tabs=[].slice.call(document.querySelectorAll('.pf-tabs [role=tab]'));
  var panels=[].slice.call(document.querySelectorAll('.pf-panel'));
  if(!tabs.length) return;
  document.documentElement.classList.add('js-pf');
  function show(id, push){
    tabs.forEach(function(t){ t.setAttribute('aria-selected', t.getAttribute('aria-controls')===id ? 'true':'false'); });
    panels.forEach(function(p){ p.hidden = p.id!==id; });
    if(push && history.replaceState) history.replaceState(null,'','#'+id);
  }
  tabs.forEach(function(t){ t.addEventListener('click', function(){ show(t.getAttribute('aria-controls'), true);
    var nav=document.querySelector('.pf-tabs'); if(nav && nav.getBoundingClientRect().top<0) nav.scrollIntoView(); }); });
  var start=(location.hash||'').slice(1);
  show(panels.some(function(p){return p.id===start;}) ? start : panels[0].id, false);
})();

// Portfolio film strips: one row of photos that glides slowly to the left and loops.
// Pauses on hover, touch, drag or keyboard focus; swipe or drag to scroll by hand.
// Visitors with reduced motion get a still strip they can scroll themselves.
(function(){
  var strips=[].slice.call(document.querySelectorAll('.pf-strip'));
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SPEED=0.035; // px per ms (about 35 px a second)
  strips.forEach(function(s){
    var track=s.querySelector('.pf-track'); if(!track || !track.querySelector('img')) return;
    // copy the photos once so the loop has no gap
    [].slice.call(track.children).forEach(function(f){ var c=f.cloneNode(true); c.setAttribute('aria-hidden','true');
      var im=c.querySelector('img'); if(im){ im.alt=''; } track.appendChild(c); });
    var paused=false, resumeAt=0, last=0, x=0, drag=null;
    function hold(ms){ paused=true; resumeAt=performance.now()+ (ms||0); }
    s.addEventListener('mouseenter',function(){ hold(1e9); });
    s.addEventListener('mouseleave',function(){ resumeAt=performance.now()+600; });
    s.addEventListener('touchstart',function(){ hold(1e9); },{passive:true});
    s.addEventListener('touchend',function(){ resumeAt=performance.now()+2500; });
    s.addEventListener('focusin',function(){ hold(1e9); });
    s.addEventListener('focusout',function(){ resumeAt=performance.now()+600; });
    s.addEventListener('pointerdown',function(e){ if(e.pointerType!=='mouse') return; drag={x:e.clientX,l:s.scrollLeft}; s.classList.add('drag'); });
    addEventListener('pointermove',function(e){ if(!drag) return; s.scrollLeft=drag.l-(e.clientX-drag.x); });
    addEventListener('pointerup',function(){ if(drag){ drag=null; s.classList.remove('drag'); } });
    s.addEventListener('dragstart',function(e){ e.preventDefault(); });
    s.addEventListener('scroll',function(){ var half=track.scrollWidth/2; if(half>0 && s.scrollLeft>=half) s.scrollLeft-=half; x=s.scrollLeft; },{passive:true});
    function tick(t){
      var dt=last?Math.min(t-last,50):0; last=t;
      if(paused && t>=resumeAt) paused=false;
      var visible=s.offsetParent!==null && !document.hidden;
      if(!reduced && !paused && visible && !drag){ x+=SPEED*dt; var half=track.scrollWidth/2; if(half>0 && x>=half) x-=half; s.scrollLeft=x; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
})();
