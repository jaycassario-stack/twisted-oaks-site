// Story pages: tap a photo to view it large. Arrow keys, swipe and Esc work.
(function(){
  var lb=document.getElementById('lb'); if(!lb) return;
  var links=[].slice.call(document.querySelectorAll('.sp-cover .sp a, .sp-gallery .sp a'));
  var img=lb.querySelector('img'), count=lb.querySelector('.lb-count'), cur=0, opener=null;
  function show(n){ cur=(n+links.length)%links.length; var a=links[cur], t=a.querySelector('img');
    img.src=a.getAttribute('href'); img.alt=t.alt; count.textContent=(cur+1)+' / '+links.length;
    [cur+1,cur-1].forEach(function(k){ var l=links[(k+links.length)%links.length]; if(l){ var p=new Image(); p.src=l.getAttribute('href'); } }); }
  function open(n,a){ opener=a; show(n); lb.hidden=false; document.body.style.overflow='hidden'; lb.querySelector('.lb-x').focus(); }
  function close(){ lb.hidden=true; img.removeAttribute('src'); document.body.style.overflow=''; if(opener) opener.focus(); }
  document.addEventListener('click',function(e){
    var a=e.target.closest('.sp a'); if(!a) return; e.preventDefault();
    var n=+a.dataset.n; open(isNaN(n)?0:n,a); });
  lb.addEventListener('click',function(e){
    if(e.target.closest('.lb-next')) return show(cur+1);
    if(e.target.closest('.lb-prev')) return show(cur-1);
    if(e.target.closest('.lb-x')||e.target===lb) close(); });
  document.addEventListener('keydown',function(e){ if(lb.hidden) return;
    if(e.key==='Escape') close(); else if(e.key==='ArrowRight') show(cur+1); else if(e.key==='ArrowLeft') show(cur-1); });
  var x0=null; lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40) show(cur+(dx<0?1:-1)); },{passive:true});
})();
