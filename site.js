(function(){
  var h=document.documentElement,q=new URLSearchParams(location.search).get('lang'),l=q;
  h.classList.add('js');
  try{l=l||localStorage.getItem('langue')}catch(x){}
  if(!l)l=(navigator.language||'en').slice(0,2)==='fr'?'fr':'en';
  function poser(v){h.setAttribute('data-l',v);h.lang=v;try{localStorage.setItem('langue',v)}catch(x){}}
  poser(l);
  var calme=matchMedia('(prefers-reduced-motion: reduce)').matches,tout=location.search.indexOf('tout')>=0;
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[data-langue]').forEach(function(b){b.onclick=function(){poser(h.getAttribute('data-l')==='en'?'fr':'en')}});
    // zoom des images
    var z=document.getElementById('zoom');
    if(z){var zi=z.querySelector('img');
      document.querySelectorAll('[data-zoom]').forEach(function(a){a.onclick=function(ev){ev.preventDefault();zi.src=a.getAttribute('href');z.classList.add('ouvert')}});
      z.onclick=function(){z.classList.remove('ouvert');zi.src=''};
      document.addEventListener('keydown',function(ev){if(ev.key==='Escape')z.onclick()});}
    // titre d'accueil : les mots montent un par un
    document.querySelectorAll('[data-mots]').forEach(function(t){var k=0;
      t.querySelectorAll('span[lang]').forEach(function(s){
        s.innerHTML=s.innerHTML.split(/(<br>|<em>|<\/em>|\s+)/).map(function(m){
          if(!m||/^\s+$/.test(m)||m[0]==='<')return m;return '<span class="mot" style="animation-delay:'+(0.06*(k++))+'s">'+m+'</span>'}).join('');k=0})});
    // barre de lecture et ombre de l'en-tête
    var barre=document.querySelector('.lecture'),tete=document.querySelector('.haut');
    function defile(){var m=h.scrollHeight-innerHeight;if(barre)barre.style.transform='scaleX('+(m>0?scrollY/m:0)+')';if(tete)tete.classList.toggle('ombre',scrollY>10)}
    addEventListener('scroll',defile,{passive:true});defile();
    // compteurs
    function compter(el){var brut=el.dataset.compte,m=brut.match(/^([^0-9]*)([0-9,]+)(.*)$/);if(!m||calme)return;
      var fin=+m[2].replace(/,/g,''),virg=m[2].indexOf(',')>=0,t0=null;
      function pas(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/1400),v=Math.round(fin*(1-Math.pow(1-p,3)));
        el.textContent=m[1]+(virg?v.toLocaleString(h.lang==='fr'?'fr-FR':'en-US'):v)+m[3];if(p<1)requestAnimationFrame(pas)}
      requestAnimationFrame(pas)}
    // schémas : les étapes s'allument
    function allumer(s){var els=s.querySelectorAll('.etape,.fleche');els.forEach(function(x,i){
      setTimeout(function(){x.classList.add('allume')},calme?0:i*260)})}
    // journal qui s'écrit
    var lignes=window.JOURNAL||[],j=document.querySelector('[data-journal]'),parti=false;
    function ligne(L,i){return '<span class="t">16:'+String(4+i).padStart(2,'0')+'</span> '+L[0].padEnd(9,' ')+(L[2]?'<span class="'+L[2]+'">'+L[1]+'</span>':L[1])+'\n'}
    function ecrire(){if(parti||!j)return;parti=true;
      if(calme){j.innerHTML=lignes.map(ligne).join('');return}
      var i=0;(function suivante(){if(i>=lignes.length){setTimeout(function(){j.innerHTML='';i=0;suivante()},5000);return}
        j.innerHTML+=ligne(lignes[i],i);i++;j.scrollTop=j.scrollHeight;setTimeout(suivante,750)})()}
    var vus=document.querySelectorAll('.apparait,[data-etapes],[data-journal],[data-compte]');
    function montrer(x){
      if(x.classList.contains('apparait'))x.classList.add('vu');
      if(x.hasAttribute('data-etapes'))allumer(x);
      if(x.hasAttribute('data-journal'))ecrire();
      if(x.hasAttribute('data-compte'))compter(x)}
    if(tout||!('IntersectionObserver' in window)){vus.forEach(montrer)}
    else{var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){montrer(en.target);io.unobserve(en.target)}})},
        {threshold:.2,rootMargin:'0px 0px -8% 0px'});vus.forEach(function(x){io.observe(x)})}
    // décalage des apparitions dans une même grille
    document.querySelectorAll('.mur,.recit').forEach(function(g){[].forEach.call(g.children,function(c,i){c.style.transitionDelay=(i%4)*90+'ms'})});
    // menu : la partie lue
    var liens=document.querySelectorAll('.haut nav a');
    var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){
      liens.forEach(function(a){a.classList.toggle('actif',a.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(s){io2.observe(s)});
  });
})();
