// Twisted Oaks Studio: menu, header, scroll reveals and parallax. Shared by every page.
(function(){
var d=document,h=d.documentElement;h.classList.add('js');
var btn=d.getElementById('ktMenuBtn'),menu=d.getElementById('ktMenu'),head=d.getElementById('ktHead');
function setMenu(o){if(!btn||!menu)return;menu.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);menu.setAttribute('aria-hidden',!o);h.classList.toggle('menu-open',o);var l=btn.querySelector('.lbl');if(l)l.textContent=o?'Close':'Menu';upd()}
if(btn){btn.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});}
if(menu){menu.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});}
d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
addEventListener('hashchange',function(){setMenu(false);setTimeout(function(){io();upd()},60)});
function upd(){if(!head)return;var hero=d.querySelector('.hero-show,.kthero');var over=hero&&hero.offsetParent!==null&&scrollY<hero.offsetHeight-90&&!(menu&&menu.classList.contains('open'));head.classList.toggle('over',!!over);head.classList.toggle('scrolled',scrollY>20)}
addEventListener('scroll',function(){upd();par()},{passive:true});addEventListener('resize',upd);
var obs=null;function io(){if(!('IntersectionObserver' in window)){d.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')});return}
if(!obs){obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.08})}
d.querySelectorAll('.rv:not(.in)').forEach(function(e){if(e.offsetParent!==null)obs.observe(e)})}
function par(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;d.querySelectorAll('[data-par]').forEach(function(e){if(e.offsetParent===null)return;var r=e.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;e.style.setProperty('--py',(c*parseFloat(e.dataset.par)*-1).toFixed(1)+'px')})}
var strip=d.getElementById('ktStrip');function sc(n){if(strip)strip.scrollBy({left:n*(strip.clientWidth*0.6),behavior:'smooth'})}
var p=d.getElementById('ktPrev'),n=d.getElementById('ktNext');if(p)p.onclick=function(){sc(-1)};if(n)n.onclick=function(){sc(1)};
io();upd();par();
})();
