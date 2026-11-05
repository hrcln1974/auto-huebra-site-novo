(function(){var H=window.HB,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var tg=$('.tg'),nv=$('nav');tg&&tg.addEventListener('click',function(){var o=nv.classList.toggle('on');tg.setAttribute('aria-expanded',o)});
$$('[data-y]').forEach(function(e){e.textContent=new Date().getFullYear()});
function ga(){if(!H.ga||window.gtag)return;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+H.ga;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',H.ga)}
var ck=$('.ck'),c=localStorage.getItem('hb_ck');if(c==='1')ga();else if(!c&&ck)ck.classList.add('on');
$$('[data-ck]').forEach(function(b){b.onclick=function(){localStorage.setItem('hb_ck',b.dataset.ck);ck.classList.remove('on');if(b.dataset.ck==='1')ga()}});
$$('a[href^="https://wa.me"]').forEach(function(a){a.addEventListener('click',function(){window.gtag&&gtag('event','whatsapp_click')})});
var lb=$('.lb');$$('[data-lb]').forEach(function(b){b.onclick=function(){lb.querySelector('img').src=b.dataset.lb;lb.classList.add('on')}});lb&&(lb.onclick=function(){lb.classList.remove('on')});
// Leads (CRM)
function leads(){try{return JSON.parse(localStorage.getItem('hb_leads')||'[]')}catch(e){return[]}}
$$('form[data-lead]').forEach(function(f){f.setAttribute('novalidate','');f.addEventListener('submit',function(e){e.preventDefault();var ok=true,d={};
 $$('[name]',f).forEach(function(i){var er=$('[data-e="'+i.name+'"]',f),m='';var v=i.type==='checkbox'?i.checked:i.value.trim();d[i.name]=v;
  if(i.name==='nome'&&v.length<3)m='Informe seu nome completo.';
  if(i.name==='telefone'&&v.replace(/\D/g,'').length<10)m='Informe um telefone com DDD.';
  if(i.name==='email'&&v&&!/^\S+@\S+\.\S+$/.test(v))m='E-mail inválido.';
  if(i.name==='consent'&&!v)m='É necessário aceitar para enviarmos o contato.';
  if(er)er.textContent=m;i.classList.toggle('bad',!!m);if(m)ok=false});
 if(!ok){var b=$('.bad',f);b&&b.focus();return}
 d.id=Date.now();d.data=new Date().toISOString();d.status='Novo';d.origem=location.pathname;delete d.consent;
 var L=leads();L.unshift(d);localStorage.setItem('hb_leads',JSON.stringify(L));
 window.gtag&&gtag('event','generate_lead');
 var go=function(){location.href='obrigado.html?n='+encodeURIComponent(d.nome.split(' ')[0])};
 var btn=$('button[type=submit]',f);btn.disabled=true;btn.textContent='Enviando…';
 if(H.endpoint){fetch(H.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)}).then(go,function(){var m=$('.fm',f);m.textContent='Não foi possível enviar agora. Chame no WhatsApp.';btn.disabled=false;btn.textContent='Solicitar orçamento'})}else go()})});
// Catálogo público
var pg=$('#prods');if(pg){var P=[];try{P=JSON.parse(localStorage.getItem('hb_prods')||'null')}catch(e){}
 (P?Promise.resolve(P):fetch('products.json').then(function(r){return r.json()})).then(function(P){var lim=+pg.dataset.n||99,cats=['Todos'].concat(P.map(function(p){return p.cat}).filter(function(v,i,a){return a.indexOf(v)===i}));
 var fl=$('#cats');function draw(c){pg.innerHTML=P.filter(function(p){return c==='Todos'||p.cat===c}).slice(0,lim).map(function(p){var s=+p.estoque>0;
  return '<article class="card pc"><div class="pi"><img src="'+p.img+'" alt="'+p.nome+'" loading="lazy" width="400" height="400"></div><span class="tag">'+p.cat+'</span> <span class="tag '+(s?'ok':'no')+'">'+(s?'Em estoque':'Sob encomenda')+'</span><h3 style="margin-top:10px;font-size:1.15rem">'+p.nome+'</h3><p class="mu">'+p.desc+'</p><p><strong>'+(p.preco?'R$ '+p.preco:'Consulte o preço')+'</strong></p><a class="btn bw sm" href="https://wa.me/'+H.wa+'?text='+encodeURIComponent('Olá! Tenho interesse em: '+p.nome)+'" target="_blank" rel="noopener">Pedir no WhatsApp</a></article>'}).join('')}
 if(fl){fl.innerHTML=cats.map(function(c,i){return '<button class="'+(i?'':'on')+'">'+c+'</button>'}).join('');fl.onclick=function(e){if(e.target.tagName!=='BUTTON')return;$$('button',fl).forEach(function(b){b.classList.remove('on')});e.target.classList.add('on');draw(e.target.textContent)}}draw('Todos')})}

// Galeria dinâmica: conteúdo publicado em gallery.json ou preparado no painel local
function galleryLoad(cb){var local=null;try{local=JSON.parse(localStorage.getItem('hb_gallery')||'null')}catch(e){}
 if(local){cb(local);return}fetch('gallery.json').then(function(r){if(!r.ok)throw Error();return r.json()}).then(cb).catch(function(){cb({photos:[],videos:[]})})}
function safeText(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function safeMediaUrl(value){var u=String(value||'').trim();if(/^https:\/\//i.test(u)||/^http:\/\//i.test(u)||/^(?!\/)(?!.*\.\.\/)[a-z0-9_./-]+\.(mp4|webm|ogg)(\?.*)?$/i.test(u)||u.indexOf('data:video/')===0)return u;return '#'}
function videoMarkup(v){var u=safeMediaUrl(v.url),embed=u;
 if(/youtu\.be\/|youtube\.com\/watch/.test(u)){var id=(u.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/)||[])[1];if(id)embed='https://www.youtube-nocookie.com/embed/'+id}
 else if(/instagram\.com/.test(u)){return '<a class="video-link-card" href="'+safeText(u)+'" target="_blank" rel="noopener"><span>▶</span><b>'+safeText(v.title)+'</b><small>Assistir no Instagram</small></a>'}
 if(/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)||u.indexOf('data:video/')===0)return '<video controls preload="none" playsinline '+(v.poster?'poster="'+safeText(safeMediaUrl(v.poster))+'"':'')+' aria-label="'+safeText(v.title)+'"><source src="'+safeText(u)+'"></video>';
 if(embed.indexOf('youtube-nocookie.com/embed/')===0)return '<iframe class="video-embed" src="'+safeText(embed)+'" title="'+safeText(v.title)+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
 return '<a class="video-link-card" href="'+safeText(u)+'" target="_blank" rel="noopener"><span>▶</span><b>'+safeText(v.title)+'</b><small>Abrir vídeo</small></a>'}
galleryLoad(function(G){var photos=$('#gallery-photos'),videos=$('#gallery-videos'),home=$('#home-videos');
 if(photos)photos.innerHTML=(G.photos||[]).map(function(p){return '<div class="ph"><button data-lb="'+safeText(p.src)+'" aria-label="Ampliar: '+safeText(p.title)+'"><img src="'+safeText(p.src)+'" alt="'+safeText(p.title)+'" loading="lazy"></button><p class="gallery-caption">'+safeText(p.title)+'</p></div>'}).join('');
 if(videos)videos.innerHTML=(G.videos||[]).map(function(v){return '<div class="video-item">'+videoMarkup(v)+'<p class="gallery-caption">'+safeText(v.title)+'</p></div>'}).join('');
 if(home)home.innerHTML=(G.videos||[]).slice(0,+home.dataset.limit||3).map(function(v){return '<div class="video-item">'+videoMarkup(v)+'</div>'}).join('');
 $$('[data-lb]').forEach(function(b){b.onclick=function(){var box=$('.lb');if(box){box.querySelector('img').src=b.dataset.lb;box.classList.add('on')}}})
});

// Obrigado
var n=$('[data-nome]');if(n){var q=new URLSearchParams(location.search).get('n');if(q)n.textContent=', '+q;window.gtag&&gtag('event','conversion_obrigado')}
})();
