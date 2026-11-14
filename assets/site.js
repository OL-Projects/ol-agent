(function(){
var d=document,w=window,H=d.documentElement;
var RM=!!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);
var motion=H.classList.contains('motion');
var meta=d.querySelector('meta[name="ol-root"]');
var ROOT=meta&&meta.getAttribute('content')||'';
var FR=(H.lang||'').toLowerCase().indexOf('fr')===0;

/* every string this file puts on screen, in the page's own language */
var T = FR ? {
 v:{verified:'vérifié',refused:'refusé',held:'en attente',closed:'fermé'},
 rows:[
  ['facture-0413 · p.1 rendue','png · 0 px hors du cadre','verified'],
  ['facture-0413 · total recalculé','2 180,00 + 109,00 + 217,46 = 2 506,46','verified'],
  ['facture-0413 · toutes les vérifications','preuve : 1 png · 1 recalcul','closed'],
  ['courriel · « réponse envoyée »','aucun message-id dans les envoyés','refused'],
  ['courriel · renvoyé','message-id consigné · en attente de la porte','held'],
  ['courriel · message-id concordant','trouvé dans les envoyés','verified'],
  ['rapport · prétend device-proven','prouvé : built · prétention abaissée','held'],
  ['déploiement · le serveur a répondu 200','un code de statut n\'est pas une preuve','held'],
  ['déploiement · sha256 servi = construit','4b07…c2a9 = 4b07…c2a9','verified']
 ],
 checking:'vérification',
 insecure:'Ce navigateur ne calcule pas d\'empreinte hors d\'un contexte sécurisé. Ouvrez la page en https et réessayez.',
 reading:'Lecture du reçu…',
 answered:'proof.json a répondu ',
 nofiles:'le reçu n\'énumère aucun fichier',
 fileOne:' fichier', fileMany:' fichiers',
 hashing:'Calcul de ', hashingEnd:' empreintes dans ce navigateur…',
 ok:'vérifié', mismatch:'écart', unreadable:'illisible', fetchfail:'lecture échouée',
 of:' de ', filesVerified:' fichiers vérifiés · ', inDrift:' en écart', zeroDrift:'0 en écart',
 itSays:' — la page vous le dit, elle ne le cache pas.',
 browserSays:' — recalculé dans votre navigateur, pas dans le nôtre.',
 unreadableReceipt:'Le reçu n\'a pas pu être lu : ', unknownReason:'raison inconnue',
 refusal:' C\'est un refus, pas un succès.'
} : {
 v:{verified:'verified',refused:'refused',held:'held',closed:'closed'},
 rows:[
  ['invoice-0413 · p.1 rendered','png · 0 px outside page bounds','verified'],
  ['invoice-0413 · total recomputed','2,180.00 + 109.00 + 217.46 = 2,506.46','verified'],
  ['invoice-0413 · all checks pass','evidence: 1 png · 1 recompute','closed'],
  ['email · “reply sent”','no message-id in sent folder','refused'],
  ['email · resent','message-id recorded · awaiting gate','held'],
  ['email · message-id matches','found in sent folder','verified'],
  ['report · claimed device-proven','proven: built · claim lowered','held'],
  ['deploy · server returned 200','a status code is not proof','held'],
  ['deploy · sha256 served = built','4b07…c2a9 = 4b07…c2a9','verified']
 ],
 checking:'checking',
 insecure:'This browser will not hash without a secure context. Open the page over https and try again.',
 reading:'Reading the receipt…',
 answered:'proof.json answered ',
 nofiles:'the receipt lists no files',
 fileOne:' file', fileMany:' files',
 hashing:'Hashing ', hashingEnd:' files in this browser…',
 ok:'verified', mismatch:'mismatch', unreadable:'unreadable', fetchfail:'fetch failed',
 of:' of ', filesVerified:' files verified · ', inDrift:' mismatched', zeroDrift:'0 mismatched',
 itSays:' — the page is telling you, not hiding it.',
 browserSays:' — recomputed in your browser, not ours.',
 unreadableReceipt:'The receipt could not be read: ', unknownReason:'unknown reason',
 refusal:'. That is a refusal, not a pass.'
};

/* ── reveal: never hide what the viewport holds; hard fallback at 3 s ────── */
var els=[].slice.call(d.querySelectorAll('[data-reveal],.mask,[data-fade]'));
function show(e){e.classList.add('in')}
function showAll(){els.forEach(show)}
if(!motion||!('IntersectionObserver' in w)){showAll()}else{
 var lim=w.innerHeight*1.5;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px 240px 0px',threshold:0});
 els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<lim)show(e);else io.observe(e)});
 w.addEventListener('load',function(){var l2=w.innerHeight*1.5;els.forEach(function(e){if(!e.classList.contains('in')&&e.getBoundingClientRect().top<l2)show(e)})});
 setTimeout(showAll,3000);
}

/* ── active section, rail + strip ────────────────────────────────────────── */
var links={};
d.querySelectorAll('.rail a,.strip a').forEach(function(a){var k=a.getAttribute('data-s');(links[k]=links[k]||[]).push(a)});
function setOn(id){
 for(var k in links)links[k].forEach(function(a){
  var on=k===id;a.classList.toggle('on',on);
  if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
 });
}
if('IntersectionObserver' in w){
 var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setOn(e.target.id)})},{rootMargin:'-40% 0px -55% 0px'});
 d.querySelectorAll('main > section').forEach(function(s){so.observe(s)});
}

/* ── ledger replay: a sample, and it says so in the caption ──────────────── */
var L=d.getElementById('lg'),clock=d.getElementById('lg-clock');
if(L&&motion){
 var D=T.rows;
 var N=12,rows=[].slice.call(L.querySelectorAll('.row')),idx=0,t=4*60000+31902,rh=46,vis=true;
 var cnt={verified:5,refused:3,held:2,closed:2},cEl={};
 d.querySelectorAll('[data-c]').forEach(function(b){cEl[b.getAttribute('data-c')]=b});
 function fmt(ms){var m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,x=ms%1000;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s+'.'+('00'+x).slice(-3)}
 function readRh(){rh=parseFloat(getComputedStyle(L).getPropertyValue('--rh'))||46}
 function bump(v){cnt[v]++;if(cEl[v])cEl[v].textContent=cnt[v]}
 function mk(it){
  var r=d.createElement('div');r.className='row';r.setAttribute('data-v','checking');
  r.innerHTML='<span class="t"></span><i class="dot"></i><span class="c"><b></b><em></em></span><span class="v"></span>';
  r.querySelector('.t').textContent=fmt(t);
  r.querySelector('b').textContent=it[0];
  r.querySelector('em').textContent=it[1];
  r.querySelector('.v').textContent=T.checking;
  clock.textContent='T+ '+fmt(t);
  return r;
 }
 function place(){var off=rows.length-N;rows.forEach(function(r,k){var y=(k-off)*rh;r.style.transform='translate3d(0,'+y+'px,0)';r.style.opacity=y<0?'0':'1'})}
 readRh();L.classList.add('js');place();
 requestAnimationFrame(function(){requestAnimationFrame(function(){L.classList.add('anim')})});
 function tick(){
  if(!vis||d.hidden){setTimeout(tick,800);return}
  while(rows.length>N){rows.shift().remove()}
  var it=D[idx%D.length];idx++;t+=900+Math.floor(Math.random()*2600);
  var r=mk(it);r.style.transform='translate3d(0,'+(N*rh)+'px,0)';r.style.opacity='0';
  L.appendChild(r);rows.push(r);void r.offsetWidth;place();
  setTimeout(function(){r.setAttribute('data-v',it[2]);r.querySelector('.v').textContent=T.v[it[2]];bump(it[2])},1600);
  setTimeout(tick,3400);
 }
 if('IntersectionObserver' in w){new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(L)}
 setTimeout(tick,2200);
 var rz;
 w.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){readRh();L.classList.remove('anim');place();requestAnimationFrame(function(){L.classList.add('anim')})},150)});
}

/* ── proof: fetch every file this page is made of, hash it in the browser ── */
(function(){
 var run=d.getElementById('vf-run'),body=d.getElementById('vf-body'),sum=d.getElementById('vf-sum'),
     count=d.getElementById('vf-count'),gen=d.getElementById('vf-gen');
 if(!run||!body)return;
 function hex(buf){var b=new Uint8Array(buf),s='',i;for(i=0;i<b.length;i++){s+=('0'+b[i].toString(16)).slice(-2)}return s}
 function row(path,hash){
  var el=d.createElement('div');el.className='vf-row';el.setAttribute('data-v','checking');
  var b=d.createElement('b');b.textContent=path;
  var h=d.createElement('span');h.className='hg';h.textContent=hash.slice(0,16)+'…';
  var v=d.createElement('span');v.className='v';v.textContent='…';
  el.appendChild(b);el.appendChild(h);el.appendChild(v);body.appendChild(el);
  return {el:el,v:v,h:h};
 }
 run.addEventListener('click',function(){
  if(!(w.crypto&&w.crypto.subtle)){sum.textContent=T.insecure;return}
  run.disabled=true;body.innerHTML='';sum.textContent=T.reading;
  fetch(ROOT+'proof.json',{cache:'no-store'}).then(function(r){
   if(!r.ok)throw new Error(T.answered+r.status);
   return r.json();
  }).then(function(p){
   var files=p.files||[];
   if(!files.length)throw new Error(T.nofiles);
   if(gen)gen.textContent='build '+String(p.build||'').slice(0,12);
   if(count)count.textContent=files.length+(files.length===1?T.fileOne:T.fileMany);
   var done=0,ok=0,bad=0;
   sum.textContent=T.hashing+files.length+T.hashingEnd;
   files.forEach(function(f){
    var r=row(f.path,f.sha256);
    fetch(ROOT+f.path,{cache:'no-store'}).then(function(res){
     if(!res.ok)throw new Error(res.status);
     return res.arrayBuffer();
    }).then(function(ab){
     return w.crypto.subtle.digest('SHA-256',ab);
    }).then(function(dg){
     var got=hex(dg);
     if(got===f.sha256){ok++;r.el.setAttribute('data-v','verified');r.v.textContent=T.ok}
     else{bad++;r.el.setAttribute('data-v','refused');r.v.textContent=T.mismatch;r.h.textContent=got.slice(0,16)+'…'}
    }).catch(function(){
     bad++;r.el.setAttribute('data-v','refused');r.v.textContent=T.unreadable;r.h.textContent=T.fetchfail;
    }).then(function(){
     done++;
     if(done===files.length){
      sum.innerHTML='<b>'+ok+'</b>'+T.of+files.length+T.filesVerified+
        (bad?'<span class="bad">'+bad+T.inDrift+'</span>':T.zeroDrift)+
        (bad?T.itSays:T.browserSays);
      run.disabled=false;
     }
    });
   });
  }).catch(function(e){
   sum.textContent=T.unreadableReceipt+(e&&e.message?e.message:T.unknownReason)+T.refusal;
   run.disabled=false;
  });
 });
})();

/* ── figures: read the published status, so the page cannot carry a stale one */
(function(){
 function set(id,v){var e=d.getElementById(id);if(e&&v!==undefined&&v!==null&&v!=='')e.textContent=v}
 fetch(ROOT+'status.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(s){
  if(!s)return;
  set('fig-legs',s.legs_total);set('fig-done',s.legs_done);set('fig-open',s.legs_open);
  set('fig-done-pct',s.legs_done_pct);
  set('fig-checks',s.checks);set('fig-pass',s.checks_passing);
  set('fig-at',s.generated_date);set('fig-checks-at',s.checks_date);
 }).catch(function(){});
 fetch(ROOT+'proof.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(p){
  if(!p)return;
  var b=String(p.build||'').slice(0,12);
  set('gen-hero',b);set('build-foot',b);set('build-num',b);set('build-start',b);
 }).catch(function(){});
})();
})();
