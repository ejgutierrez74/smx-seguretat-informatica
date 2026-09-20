const panelPages={"ra1":"ra1.html","teoria":"ra1.html","practiques":"ra1.html","avaluacio":"ra1.html","ra2":"ra2.html","ra2-apunts":"ra2.html","ra2-practiques":"ra2.html","ra2-criteris":"ra2.html","ra3":"ra3.html","ra3-apunts":"ra3.html","ra3-practiques":"ra3.html","ra3-criteris":"ra3.html","ra4":"ra4.html","ra4-apunts":"ra4.html","ra4-practiques":"ra4.html","ra4-criteris":"ra4.html","ra5":"ra5.html","ra5-apunts":"ra5.html","ra5-practiques":"ra5.html","ra5-criteris":"ra5.html","inici":"index.html","programacio":"index.html","fonts":"index.html","professorat":"index.html","competencia-digital":"index.html","planificacio-docent":"index.html","planificacio-ra1":"index.html","planificacio-ra2":"index.html","planificacio-ra3":"index.html","planificacio-ra4":"index.html","planificacio-ra5":"index.html"};
const legacyRoutes={'programacio/planificacio-docent':'planificacio-docent','programacio/planificacio-ra1':'planificacio-ra1','programacio/planificacio-ra2':'planificacio-ra2','ra2-pla':'planificacio-ra2','ra2-apunts/r2-llicencies':'competencia-digital/digital-llicencies'};if(legacyRoutes[location.hash.slice(1)])location.replace('#'+legacyRoutes[location.hash.slice(1)]);
function route(){const alias=legacyRoutes[location.hash.slice(1)];if(alias){location.replace('#'+alias);return;}const bits=location.hash.slice(1).split('/'),key=bits[0]||document.body.dataset.defaultPanel||'inici',anchor=bits[1];const destination=panelPages[key];if(destination&&!document.getElementById(key)){location.replace(destination+'#'+key+(anchor?'/'+anchor:''));return;}const panel=document.getElementById(key)||document.getElementById(document.body.dataset.defaultPanel)||document.querySelector('.panel');if(!panel)return;document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x===panel));document.querySelectorAll('nav a').forEach(a=>{const active=a.pathname===location.pathname&&a.hash==='#'+key+(anchor?'/'+anchor:'');a.classList.toggle('active',active);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');if(active){let p=a.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}}});document.querySelectorAll('#teoria > article, #ra2-apunts > article, #ra3-apunts > article, #ra4-apunts > article, #ra5-apunts > article').forEach(a=>a.hidden=a.parentElement.id===key&&!!anchor&&a.id!==anchor);selectProgrammeRA(key,anchor);selectDigitalRA(key,anchor);if(anchor){requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView())}else window.scrollTo(0,0);document.title=panel.dataset.title+' · M0226';}window.addEventListener('hashchange',route);route();document.getElementById('print').addEventListener('click',()=>window.print());function calc(){if(!document.getElementById('watts'))return;const w=Number(document.getElementById('watts').value),pf=Number(document.getElementById('pf').value),reserve=Number(document.getElementById('reserve').value);const result=document.getElementById('result');if(!(w>0&&pf>0&&pf<=1&&reserve>=0&&reserve<=50)){result.textContent='Introdueix una càrrega positiva, un factor entre 0 i 1 i una reserva entre 0 i 50%.';return}const f=1-reserve/100;result.textContent=`Mínim de selecció: ${(w/f).toLocaleString('ca-ES',{maximumFractionDigits:1})} W i ${(w/pf/f).toLocaleString('ca-ES',{maximumFractionDigits:1})} VA. Cal complir els dos límits i verificar l’autonomia a la fitxa del fabricant.`}document.querySelectorAll('.calc input').forEach(x=>x.addEventListener('input',calc));calc();

const form=document.getElementById('teacher-login'), target=document.getElementById('teacher-content'),lock=document.getElementById('teacher-lock');
form?.addEventListener('submit',async e=>{e.preventDefault();const message=document.getElementById('teacher-message');message.textContent='Obrint…';try{const r=await fetch('teacher.enc.json',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('teacher-key').value),'PBKDF2',false,['deriveKey']);const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(data.salt),iterations:data.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(data.iv)},key,bytes(data.cipher));target.innerHTML=new TextDecoder().decode(plain);alignTeacherContent(target);form.hidden=true;lock.hidden=false;document.getElementById('teacher-key').value='';message.textContent='';}catch(err){message.textContent='No s’ha pogut obrir. Comprova la contrasenya i la connexió.';}});
lock?.addEventListener('click',()=>{target.replaceChildren();lock.hidden=true;form.hidden=false;});
window.addEventListener('hashchange',()=>{if(location.hash.split('/')[0]!=='#professorat')lock?.click();});

function alignTeacherContent(root){
 const old=root.querySelector('#pla-docent');
 if(old){const note=document.createElement('p');note.innerHTML='<a href="#planificacio-docent">Consulta la planificació docent vigent de RA1, RA2, RA3, RA4 i RA5</a>.';old.replaceWith(note);}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){node.textContent=node.textContent.replace(/1\.([a-k])\s*\/\s*CA\d+/g,'1.$1').replace(/CA\s*(\d{1,2})(?![\d.])/g,(_,n)=>'1.'+String.fromCharCode(96+Number(n)));}
 const notice=document.createElement('p');notice.textContent='Els criteris *1.k i *1.l tenen activitats i registre independents a Avaluació de competències digitals. Les rúbriques històriques d’aquest material privat no en determinen la qualificació.';root.prepend(notice);
}

function selectProgrammeRA(key,anchor){
 if(key!=='programacio')return;
 const selected=/^programacio-ra[1-5]$/.test(anchor||'')?anchor:'programacio-ra1';
 document.querySelectorAll('#programacio-ra-curriculum > article').forEach(a=>a.hidden=a.id!==selected);
 document.querySelectorAll('#programacio-ra-curriculum [role="tab"]').forEach(a=>{const on=a.getAttribute('aria-controls')===selected;a.setAttribute('aria-selected',String(on));a.tabIndex=on?0:-1;});
}
document.querySelector('#programacio-ra-curriculum [role="tablist"]')?.addEventListener('keydown',e=>{
 const tabs=[...e.currentTarget.querySelectorAll('[role="tab"]')];const i=tabs.indexOf(document.activeElement);if(i<0)return;
 let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
 e.preventDefault();tabs[next].focus();location.hash=tabs[next].hash;
});

function selectDigitalRA(key,anchor){
 if(key!=='competencia-digital')return;
 const owners={'digital-dispositius':1,'digital-privacitat':1,'digital-llicencies':2,'digital-guia-llicencies':2,'digital-ciutadania':3,'digital-netiqueta':5,'digital-identitat':5};
 const selected=/^digital-ra[1-5]$/.test(anchor||'')?anchor:'digital-ra'+(owners[anchor]||1);
 document.querySelectorAll('#digital-ra-tabs > [role="tabpanel"]').forEach(p=>p.hidden=p.id!==selected);
 document.querySelectorAll('#digital-ra-tabs [role="tab"]').forEach(tab=>{const active=tab.getAttribute('aria-controls')===selected;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
 const group=document.getElementById('nav-digital');if(group)group.open=true;
}
document.querySelector('#digital-ra-tabs [role="tablist"]')?.addEventListener('keydown',e=>{
 const tabs=[...e.currentTarget.querySelectorAll('[role="tab"]')],i=tabs.indexOf(document.activeElement);if(i<0)return;
 let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
 e.preventDefault();tabs[next].focus();location.hash=tabs[next].hash;
});
