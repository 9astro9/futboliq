(()=>{

const FEATURE_DEFS={
  progreso:{icon:"📈",title:"Mi progreso",desc:"Nivel, experiencia, rachas, precisión y logros."},
  diario:{icon:"📅",title:"Desafío del día",desc:"Las mismas 10 preguntas para todos durante el día."},
  live:{icon:"🔴",title:"FUTBOLIQ LIVE",desc:"Preguntas en vivo lanzadas por el OWNER."},
  amigos:{icon:"👥",title:"Amigos",desc:"Buscá jugadores, agregalos y compará tus partidas."},
  duelos:{icon:"⚔️",title:"Duelos 1v1",desc:"Desafiá a otro jugador con 10 preguntas."},
  carrera:{icon:"🏟️",title:"Modo carrera",desc:"Construí tu carrera y convertite en leyenda."},
  extras:{icon:"🧠",title:"Modos extra",desc:"Adiviná jugadores y clubes en partidas rápidas."},
  eventos:{icon:"🎉",title:"Eventos",desc:"Eventos rotativos de FUTBOLIQ con desafíos especiales."}
};

const PLAYER_QUIZ=[
  ["Lionel Messi","Argentina","Barcelona, PSG e Inter Miami","La Pulga"],
  ["Cristiano Ronaldo","Portugal","Manchester United, Real Madrid y Al Nassr","CR7"],
  ["Pelé","Brasil","Santos y New York Cosmos","O Rei"],
  ["Diego Maradona","Argentina","Boca Juniors, Napoli y Barcelona","El Diez"],
  ["Ronaldinho","Brasil","Barcelona, Milan y PSG","Dinho"],
  ["Zinedine Zidane","Francia","Real Madrid y Juventus","Zizou"],
  ["Ronaldo Nazário","Brasil","Inter, Real Madrid y Barcelona","El Fenómeno"],
  ["Luka Modrić","Croacia","Real Madrid","Capitán de Croacia"],
  ["Kaká","Brasil","Milan y Real Madrid","Balón de Oro 2007"],
  ["Neymar","Brasil","Santos, Barcelona, PSG y Al Hilal","Ney"]
];

const CLUB_QUIZ=[
  ["Real Madrid","España","15 Champions","Los Blancos"],
  ["Milan","Italia","7 Champions","Rossoneri"],
  ["Liverpool","Inglaterra","6 Champions","Reds"],
  ["Bayern Múnich","Alemania","6 Champions","Bávaros"],
  ["Barcelona","España","5 Champions","Blaugrana"],
  ["Ajax","Países Bajos","4 Champions","Godenzonen"],
  ["Boca Juniors","Argentina","6 Libertadores","Xeneize"],
  ["Independiente","Argentina","7 Libertadores","Rey de Copas"],
  ["Peñarol","Uruguay","5 Libertadores","Carbonero"],
  ["Nacional","Uruguay","3 Libertadores","Tricolor"]
];

function featureHideAll(){
  document.querySelectorAll("main>section").forEach(s=>s.classList.add("hidden"));
}
function featureHome(){
  if(typeof liveTimer!=="undefined")clearInterval(liveTimer);
  if(typeof duelPoll!=="undefined")clearInterval(duelPoll);
  featureHideAll();
  const home=$( "homeView" );
  if(home)home.classList.remove("hidden");
  if(typeof updateHome==="function")updateHome();
}
function openFeature(id){
  if(typeof guestMode!=="undefined"&&guestMode){
    alert("⚠️ El modo invitado no puede usar esta función. Creá una cuenta para acceder.");
    return;
  }
  featureHideAll();
  const el=$(id);
  if(el){el.classList.remove("hidden");el.scrollIntoView({behavior:"smooth",block:"start"})}
}

function esc(s){return typeof escapeHtml==="function"?escapeHtml(s):String(s);}
function addCard(id){
  if(document.getElementById("feature-card-"+id))return;
  const grid=document.querySelector("#homeView .menu-grid");
  if(!grid)return;
  const d=FEATURE_DEFS[id];
  const card=document.createElement("div");
  card.className="menu-card";
  card.id="feature-card-"+id;
  card.innerHTML="<div class='menu-icon'>"+d.icon+"</div><h3>"+d.title+"</h3><p>"+d.desc+"</p>";
  grid.appendChild(card);
}
function addViews(){
  const main=document.querySelector("main");
  if(!main)return;
  if(!$("featureStyles")){
    const style=document.createElement("style");
    style.id="featureStyles";
    style.textContent=`.feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.feature-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.feature-stat{padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--card2)}.feature-stat b{display:block;font-size:24px;margin-top:4px}.feature-progress{height:12px;background:var(--card2);border:1px solid var(--line);border-radius:999px;overflow:hidden}.feature-progress i{display:block;height:100%;background:var(--accent);width:0}.feature-list{display:grid;gap:8px}.feature-row{padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--card2)}.feature-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.feature-answer-grid{display:grid;gap:9px;margin-top:15px}.feature-answer-grid button{text-align:left}.achievement-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.achievement{padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--card2)}.achievement.unlocked{border-color:var(--accent);background:rgba(53,211,154,.08)}.live-card{border-color:#e85b5b}.live-timer{font-size:31px;font-weight:950}.career-hero{display:grid;grid-template-columns:1.3fr 1fr;gap:14px}.career-avatar{min-height:220px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(135deg,#102018,#263247,#35d399);display:grid;place-items:center;font-size:92px;font-weight:950}.event-card{padding:20px;border-radius:18px;border:1px solid var(--line);background:linear-gradient(135deg,var(--card),var(--card2))}.feature-muted{color:var(--muted)}.career-rank-line{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:8px 0}.rank-badge{white-space:nowrap}@media(max-width:720px){.feature-grid,.achievement-grid,.career-hero{grid-template-columns:1fr}.feature-stat-grid{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(style);
  }
  for(const id of Object.keys(FEATURE_DEFS))addCard(id);

  const views={
    progreso:`<section id="progresoView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>📈 Mi progreso</h2><div class="small muted">Tu evolución en FUTBOLIQ.</div></div><button class="btn" id="progressReload">Actualizar</button></div><div id="progressContent"></div></section>`,
    diario:`<section id="diarioView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>📅 Desafío del día</h2><div class="small muted">Las mismas 10 preguntas para todos durante hoy.</div></div></div><div id="dailyContent"></div></section>`,
    live:`<section id="liveView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>🔴 FUTBOLIQ LIVE</h2><div class="small muted">Una pregunta para todos los jugadores conectados.</div></div></div><div id="liveContent"></div></section>`,
    amigos:`<section id="amigosView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>👥 Amigos</h2><div class="small muted">Buscá jugadores y agregalos.</div></div></div><div class="field"><label>Buscar usuario</label><input id="friendSearch" maxlength="16" placeholder="Nombre de usuario"></div><div id="friendSearchResults" class="feature-list"></div><div id="friendsContent" style="margin-top:18px"></div></section>`,
    duelos:`<section id="duelosView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>⚔️ Duelos 1v1</h2><div class="small muted">10 preguntas, 100 puntos por acierto.</div></div></div><div class="field"><label>Desafiar usuario</label><input id="duelSearch" maxlength="16" placeholder="Nombre de usuario"><div id="duelSearchResults" class="feature-list"></div></div><div id="duelsContent"></div><div id="duelPlay" style="margin-top:16px"></div></section>`,
    carrera:`<section id="carreraView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>🏟️ Modo carrera</h2><div class="small muted">Una carrera personal guardada en este navegador.</div></div></div><div id="careerContent"></div></section>`,
    extras:`<section id="extrasView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>🧠 Modos extra</h2><div class="small muted">Partidas rápidas de entrenamiento.</div></div></div><div id="extraContent"></div></section>`,
    eventos:`<section id="eventosView" class="card panel hidden"><button class="btn back" data-feature-home>← Menú</button><div class="section-head"><div><h2>🎉 Eventos FUTBOLIQ</h2><div class="small muted">Rotación semanal de temas y recompensas.</div></div></div><div id="eventsContent"></div></section>`
  };
  const temp=document.createElement("div");
  temp.innerHTML=Object.values(views).join("");
  while(temp.firstElementChild)main.appendChild(temp.firstElementChild);
  document.querySelectorAll("[data-feature-home]").forEach(b=>b.addEventListener("click",featureHome));
}

function featureLoad(id){
  if(typeof guestMode!=="undefined"&&guestMode)return;
  if(id==="progreso")loadProgress();
  if(id==="diario")loadDaily();
  if(id==="live")loadLive();
  if(id==="amigos")loadFriends();
  if(id==="duelos")loadDuels();
  if(id==="carrera")loadCareer();
  if(id==="extras")loadExtras();
  if(id==="eventos")loadEvents();
}
function makeMenuClicks(){
  for(const id of Object.keys(FEATURE_DEFS)){
    const card=$("feature-card-"+id);
    if(card){
      card.onclick=()=>{openFeature(id+"View");featureLoad(id)};
    }
  }
}

async function loadProgress(){
  const box=$("progressContent");if(!box||!user)return;
  box.innerHTML="<p class='feature-muted'>Cargando…</p>";
  try{
    const x=await api("/api/progress"),s=x.stats||{},unlocked=new Set((x.achievements||[]).map(a=>a.achievementId));
    const xpNow=Number(s.xp||0),level=Number(s.level||1),base=(level-1)*(level-1)*100,next=level*level*100,percent=next>base?Math.max(0,Math.min(100,(xpNow-base)/(next-base)*100)):100;
    const defs=x.defs||[];
    box.innerHTML=`<div class="card"><h3>Nivel ${level}</h3><p class="feature-muted">XP: <strong>${xpNow}</strong></p><div class="feature-progress"><i style="width:${percent}%"></i></div><div class="small muted" style="margin-top:6px">Progreso al próximo nivel: ${Math.round(percent)}%</div></div>
      <div class="feature-stat-grid" style="margin-top:14px">
        <div class="feature-stat"><span class="small muted">Preguntas</span><b>${s.totalAnswers||0}</b></div>
        <div class="feature-stat"><span class="small muted">Aciertos</span><b>${s.correctAnswers||0}</b></div>
        <div class="feature-stat"><span class="small muted">Precisión</span><b>${s.accuracy||0}%</b></div>
        <div class="feature-stat"><span class="small muted">Racha</span><b>🔥 ${s.currentStreak||0}</b></div>
        <div class="feature-stat"><span class="small muted">Mejor racha</span><b>${s.bestStreak||0}</b></div>
        <div class="feature-stat"><span class="small muted">Racha diaria</span><b>${s.dailyStreak||0}</b></div>
        <div class="feature-stat"><span class="small muted">Mejor diaria</span><b>${s.bestDailyStreak||0}</b></div>
        <div class="feature-stat"><span class="small muted">Victorias 1v1</span><b>⚔️ ${s.wins||0}</b></div>
      </div>
      <div class="card" style="margin-top:14px"><h3>🏆 Tu semana</h3><p class="feature-muted">Puntos semanales: <strong>${Number(s.weeklyScore||0).toLocaleString("es-ES")}</strong></p><button class="btn primary" id="weeklyRankingBtn">Ver ranking semanal</button><div id="weeklyRanking" style="margin-top:12px"></div></div>
      <div class="card" style="margin-top:14px"><h3>🏅 Logros</h3><div class="achievement-grid">${defs.map(d=>`<div class="achievement ${unlocked.has(d.id)?"unlocked":""}"><strong>${unlocked.has(d.id)?"✅":"🔒"} ${esc(d.title)}</strong><div class="small muted">${esc(d.desc)}</div></div>`).join("")}</div></div>`;
    $("progressReload").onclick=loadProgress;
    $("weeklyRankingBtn").onclick=loadWeeklyRanking;
  }catch(e){box.innerHTML="<p class='feature-muted'>"+esc(e.message||"No se pudo cargar.")+"</p>"}
}
async function loadWeeklyRanking(){
  const box=$("weeklyRanking");if(!box)return;
  try{
    const x=await api("/api/ranking/weekly");
    box.innerHTML="<div class='feature-list'>"+(x.ranking||[]).map((r,i)=>"<div class='feature-row'><strong>#"+(i+1)+" "+nameHtml(r.username,r.nameColor,false)+" "+(typeof rankHtml==="function"?rankHtml(r.profileRank):"")+"</strong> · "+Number(r.score||0).toLocaleString("es-ES")+" pts</div>").join("")+"</div>";
  }catch(e){box.textContent=e.message||"No se pudo cargar."}
}

async function loadDaily(){
  const box=$("dailyContent");if(!box||!user)return;
  try{
    let x=await api("/api/daily-challenge");
    if(!x.started){
      box.innerHTML=`<div class="card"><h3>🎯 Desafío de hoy</h3><p>10 preguntas · 100 puntos por acierto · recompensa final de 100 🪙.</p><button class="btn primary" id="dailyStart">Empezar</button></div>`;
      $("dailyStart").onclick=async()=>{try{x=await api("/api/daily-challenge/start",{method:"POST",body:"{}"});renderDailyQuestion(x)}catch(e){alert(e.message)}};
      return;
    }
    renderDailyQuestion(x);
  }catch(e){box.innerHTML="<p class='feature-muted'>"+esc(e.message)+"</p>"}
}
function renderDailyQuestion(x){
  const box=$("dailyContent");if(!box)return;
  if(x.completed){box.innerHTML=`<div class="card"><h3>✅ Desafío completado</h3><p>Puntuación: <strong>${x.score}</strong></p><p>Volvé mañana para mantener tu racha.</p></div>`;return}
  const q=x.question;if(!q){box.textContent="No hay pregunta.";return}
  box.innerHTML=`<div class="card">${typeof categoryBadge==="function"?categoryBadge(q.category):"<div class='small muted'>"+esc(q.category)+"</div>"}<div class="small muted">Pregunta ${Number(x.idx)+1}/${x.total}</div><h2 class="question">${esc(q.q)}</h2><div class="feature-answer-grid">${q.options.map((o,i)=>`<button class="btn option" data-daily-choice="${i}">${esc(o)}</button>`).join("")}</div><p class="small muted">Puntos: ${x.score}</p></div>`;
  document.querySelectorAll("[data-daily-choice]").forEach(b=>b.onclick=async()=>{
    document.querySelectorAll("[data-daily-choice]").forEach(z=>z.disabled=true);
    try{const y=await api("/api/daily-challenge/answer",{method:"POST",body:JSON.stringify({choice:Number(b.dataset.dailyChoice)})});if(y.done){if(y.coins!==undefined){user.coins=Number(y.coins);if(typeof updateHome==="function")updateHome()}renderDailyQuestion({completed:true,score:y.score});showGlobalBroadcast({sender:"FUTBOLIQ",message:"¡Desafío diario completado!",createdAt:Date.now()})}else renderDailyQuestion({...y,total:x.total,idx:(x.idx||0)+1})}catch(e){alert(e.message);loadDaily()}
  });
}

let liveTimer=null;
async function loadLive(){
  const box=$("liveContent");if(!box||!user)return;
  clearInterval(liveTimer);
  async function draw(){
    try{
      const x=await api("/api/live");
      if(!x.active){
        box.innerHTML=`<div class="card"><h3>⏳ No hay pregunta en vivo</h3><p class="feature-muted">Cuando el OWNER lance una pregunta aparecerá acá.</p>${user.owner?"<button class='btn primary' id='launchLive'>🔴 Lanzar pregunta</button>":""}</div>`;
        if(user.owner)$("launchLive").onclick=launchLive;
        return;
      }
      const left=Math.max(0,Math.ceil((Number(x.endsAt)-Date.now())/1000));
      box.innerHTML=`<div class="card live-card">${typeof categoryBadge==="function"?categoryBadge(x.category):"<div class='small muted'>"+esc(x.category)+"</div>"}<div class="live-timer">00:${String(left).padStart(2,"0")}</div><h2 class="question">${esc(x.q)}</h2>${x.answered?"<div class='notice'>✅ Ya respondiste esta pregunta.</div>":"<div class='feature-answer-grid'>"+x.options.map((o,i)=>"<button class='btn option' data-live-choice='"+i+"'>"+esc(o)+"</button>").join("")+"</div>"}<p class="small muted">Respuestas: ${x.answers||0} · Correctas: ${x.correctAnswers||0}</p></div>`;
      document.querySelectorAll("[data-live-choice]").forEach(b=>b.onclick=async()=>{
        document.querySelectorAll("[data-live-choice]").forEach(z=>z.disabled=true);
        try{const y=await api("/api/live/answer",{method:"POST",body:JSON.stringify({liveId:x.id,choice:Number(b.dataset.liveChoice)})});if(y.coins!==undefined){user.coins=Number(y.coins);if(typeof updateHome==="function")updateHome()}box.insertAdjacentHTML("beforeend","<p class='notice'>"+(y.correct?"✅ ¡Correcto! +"+Number(y.reward||0).toLocaleString("es-ES")+" 🪙":"❌ Incorrecto.")+"</p>");setTimeout(draw,800)}catch(e){alert(e.message);draw()}
      });
    }catch(e){box.innerHTML="<p class='feature-muted'>"+esc(e.message)+"</p>"}
  }
  await draw();
  liveTimer=setInterval(draw,1000);
}
async function launchLive(){
  try{await api("/api/live/start",{method:"POST",body:"{}"});loadLive()}catch(e){alert(e.message||"Primero abrí la consola de desarrollador.")}
}

async function loadFriends(){
  const box=$("friendsContent");if(!box||!user)return;
  const input=$("friendSearch");
  let timer=null;
  if(input&&!input.dataset.bound){
    input.dataset.bound="1";
    input.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>searchFriends(input.value.trim()),250)};
  }
  try{
    const x=await api("/api/friends");
    box.innerHTML=`<div class="card"><h3>Solicitudes recibidas</h3>${(x.incoming||[]).length?(x.incoming.map(r=>`<div class="feature-row">${nameHtml(r.username,null,false)} <button class="btn primary" data-accept-friend="${r.user_id}">Aceptar</button></div>`).join("")):"<p class='feature-muted'>No tenés solicitudes pendientes.</p>"}</div>
      <div class="card" style="margin-top:12px"><h3>Tus amigos</h3>${(x.accepted||[]).length?(x.accepted.map(r=>`<div class="feature-row">${nameHtml(r.username,null,false)} <span class="small muted">Amigo</span></div>`).join("")):"<p class='feature-muted'>Todavía no agregaste amigos.</p>"}</div>`;
    document.querySelectorAll("[data-accept-friend]").forEach(b=>b.onclick=async()=>{try{await api("/api/friends/accept",{method:"POST",body:JSON.stringify({userId:Number(b.dataset.acceptFriend)})});loadFriends()}catch(e){alert(e.message)}});
  }catch(e){box.textContent=e.message||"No se pudo cargar."}
}
async function searchFriends(q){
  const box=$("friendSearchResults");if(!box)return;
  if(q.length<2){box.innerHTML="";return}
  try{
    const x=await api("/api/friends/search?q="+encodeURIComponent(q));
    box.innerHTML=(x.users||[]).map(r=>`<div class="feature-row"><strong>${esc(r.username)}</strong> · ${Number(r.bestScore||0).toLocaleString("es-ES")} pts <button class="btn primary" data-add-friend="${r.id}">Agregar</button> <button class="btn" data-duel-friend="${r.id}">Desafiar</button></div>`).join("");
    document.querySelectorAll("[data-add-friend]").forEach(b=>b.onclick=async()=>{try{await api("/api/friends/request",{method:"POST",body:JSON.stringify({userId:Number(b.dataset.addFriend)})});b.textContent="✅ Enviado";b.disabled=true}catch(e){alert(e.message)}});
    document.querySelectorAll("[data-duel-friend]").forEach(b=>b.onclick=async()=>{try{await api("/api/duel/challenge",{method:"POST",body:JSON.stringify({userId:Number(b.dataset.duelFriend)})});alert("⚔️ Desafío enviado.");loadDuels()}catch(e){alert(e.message)}});
  }catch(e){box.textContent=e.message||"No se pudo buscar."}
}

async function loadDuels(){
  const box=$("duelsContent");if(!box||!user)return;
  const input=$("duelSearch");
  let timer=null;
  if(input&&!input.dataset.bound){
    input.dataset.bound="1";
    input.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>searchDuelPlayers(input.value.trim()),250)};
  }
  try{
    const x=await api("/api/duels");
    box.innerHTML="<div class='feature-list'>"+(x.duels||[]).map(d=>{
      const incoming=Number(d.opponent_id)===Number(user.id)&&d.status==="pending";
      const other=Number(d.challenger_id)===Number(user.id)?d.opponent:d.challenger;
      return `<div class="feature-row">⚔️ <strong>${esc(other)}</strong> · ${esc(d.status)} · ${d.challenger_score}-${d.opponent_score} <div class="feature-actions">${incoming?"<button class='btn primary' data-duel-accept='"+d.id+"'>Aceptar</button><button class='btn danger' data-duel-decline='"+d.id+"'>Rechazar</button>":"<button class='btn primary' data-duel-open='"+d.id+"'>Abrir</button>"}</div></div>`;
    }).join("")+"</div>";
    document.querySelectorAll("[data-duel-accept]").forEach(b=>b.onclick=async()=>{try{await api("/api/duel/accept",{method:"POST",body:JSON.stringify({duelId:b.dataset.duelAccept})});loadDuels()}catch(e){alert(e.message)}});
    document.querySelectorAll("[data-duel-decline]").forEach(b=>b.onclick=async()=>{try{await api("/api/duel/decline",{method:"POST",body:JSON.stringify({duelId:b.dataset.duelDecline})});loadDuels()}catch(e){alert(e.message)}});
    document.querySelectorAll("[data-duel-open]").forEach(b=>b.onclick=()=>openDuel(b.dataset.duelOpen));
  }catch(e){box.textContent=e.message||"No se pudieron cargar los duelos."}
}
async function searchDuelPlayers(q){
  const box=$("duelSearchResults");if(!box)return;if(q.length<2){box.innerHTML="";return}
  try{
    const x=await api("/api/friends/search?q="+encodeURIComponent(q));
    box.innerHTML=(x.users||[]).map(r=>`<div class="feature-row"><strong>${esc(r.username)}</strong> <button class="btn primary" data-challenge-user="${r.id}">⚔️ Desafiar</button></div>`).join("");
    document.querySelectorAll("[data-challenge-user]").forEach(b=>b.onclick=async()=>{try{await api("/api/duel/challenge",{method:"POST",body:JSON.stringify({userId:Number(b.dataset.challengeUser)})});alert("⚔️ Desafío enviado.");loadDuels()}catch(e){alert(e.message)}});
  }catch(e){box.textContent=e.message||"Error";}
}
let duelPoll=null;
async function openDuel(id){
  clearInterval(duelPoll);
  const box=$("duelPlay");if(!box)return;
  async function draw(){
    try{
      const x=await api("/api/duel/"+encodeURIComponent(id));
      const meCh=x.challenger===user.username;
      const myScore=meCh?x.challengerScore:x.opponentScore,otherScore=meCh?x.opponentScore:x.challengerScore;
      if(x.status==="pending"){box.innerHTML="<div class='card'><p>Esperando que el rival acepte…</p></div>";return}
      if(x.status==="completed"){box.innerHTML=`<div class="card"><h3>🏁 Duelo terminado</h3><p>${esc(x.challenger)} ${x.challengerScore} — ${x.opponentScore} ${esc(x.opponent)}</p></div>`;return}
      if(!x.question){box.innerHTML=`<div class="card"><h3>⚔️ ${esc(x.challenger)} ${x.challengerScore} — ${x.opponentScore} ${esc(x.opponent)}</h3><p class="feature-muted">Tu rival todavía está respondiendo.</p></div>`;return}
      box.innerHTML=`<div class="card"><div class="small muted">Pregunta ${Number(x.idx)+1}/${x.total}</div><h3>⚔️ ${esc(x.challenger)} ${x.challengerScore} — ${x.opponentScore} ${esc(x.opponent)}</h3><h2 class="question">${esc(x.question.q)}</h2><div class="feature-answer-grid">${x.question.options.map((o,i)=>`<button class="btn option" data-duel-choice="${i}">${esc(o)}</button>`).join("")}</div></div>`;
      document.querySelectorAll("[data-duel-choice]").forEach(b=>b.onclick=async()=>{document.querySelectorAll("[data-duel-choice]").forEach(z=>z.disabled=true);try{await api("/api/duel/"+encodeURIComponent(id)+"/answer",{method:"POST",body:JSON.stringify({choice:Number(b.dataset.duelChoice)})});draw()}catch(e){alert(e.message);draw()}});
    }catch(e){box.innerHTML="<p class='feature-muted'>"+esc(e.message||"No se pudo cargar el duelo.")+"</p>"}
  }
  await draw();duelPoll=setInterval(draw,2500);
}

function careerDefault(){
  return {
    version:2,
    name:user?.username||"Jugador",dorsal:9,foot:"Derecho",nationality:"Uruguay",
    position:"DC",style:"Desborde",club:"",league:"",initialClub:"",
    age:16,season:1,seasonYear:new Date().getFullYear(),
    ovr:58,maxOvr:58,potential:88,level:1,xp:0,
    matches:0,goals:0,assists:0,caps:0,nationalGoals:0,titles:0,
    cups:[],transfers:0,marketValue:100000,peakValue:100000,salary:0,
    contractYears:3,form:70,morale:70,fitness:90,injurySeasons:0,
    retired:false,retirementAge:40,decisionHistory:[],seasonHistory:[],
    currentObjective:"Ganar minutos y consolidarte"
  };
}
function migrateCareer(c){
  if(!c)return null;
  const out={...careerDefault(),...c,version:2};if(isAstro67Career(out)){out.potential=99;out.ovr=Math.max(out.ovr,70);out.maxOvr=Math.max(out.maxOvr,out.ovr)}
  for(const k of ["season","age","ovr","maxOvr","potential","level","xp","matches","goals","assists","caps","nationalGoals","titles","transfers","contractYears"])
    out[k]=Number(out[k])||0;
  out.age=out.age||16;out.season=out.season||1;out.ovr=careerClamp(out.ovr||58,40,99);
  out.maxOvr=Math.max(out.ovr,out.maxOvr||out.ovr);out.potential=careerClamp(out.potential||88,out.ovr,99);
  out.form=careerClamp(Number(out.form)||70,0,100);out.morale=careerClamp(Number(out.morale)||70,0,100);
  out.fitness=careerClamp(Number(out.fitness)||90,0,100);
  out.marketValue=Math.max(100000,Number(out.marketValue)||100000);out.peakValue=Math.max(out.marketValue,Number(out.peakValue)||out.marketValue);
  out.cups=Array.isArray(out.cups)?out.cups:[];out.seasonHistory=Array.isArray(out.seasonHistory)?out.seasonHistory:[];out.decisionHistory=Array.isArray(out.decisionHistory)?out.decisionHistory:[];
  out.retirementAge=40;out.club=String(out.club||"");out.league=String(out.league||"");
  return out;
}
function getCareer(){try{return migrateCareer(JSON.parse(localStorage.getItem("fql_career_v2")||localStorage.getItem("fql_career_v1")||"null"))}catch{return null}}
function saveCareer(c){localStorage.setItem("fql_career_v2",JSON.stringify(c));localStorage.removeItem("fql_career_v1")}
const CAREER_CLUBS=[
  {name:"FUTBOLIQ FC",league:"Liga FUTBOLIQ",tier:1,base:58,salary:120000},
  {name:"Atlético del Plata",league:"Liga FUTBOLIQ",tier:2,base:54,salary:80000},
  {name:"Montevideo United",league:"Liga FUTBOLIQ",tier:2,base:57,salary:90000},
  {name:"Capital FC",league:"Liga FUTBOLIQ",tier:3,base:60,salary:140000},
  {name:"Racing Europa",league:"Liga Europea",tier:3,base:68,salary:280000},
  {name:"Inter",league:"Italia",tier:4,base:79,salary:850000},
  {name:"Paris Saint-Germain",league:"Francia",tier:4,base:80,salary:900000},
  {name:"Real Madrid",league:"España",tier:5,base:84,salary:1500000},
  {name:"Barcelona",league:"España",tier:5,base:83,salary:1450000},
  {name:"Manchester City",league:"Inglaterra",tier:5,base:86,salary:1600000},
  {name:"Bayern Múnich",league:"Alemania",tier:5,base:84,salary:1500000}
];
const CAREER_STYLES={
  Desborde:{goals:1,assists:2,growth:2},
  Organizador:{goals:0,assists:3,growth:2},
  Potencia:{goals:2,assists:0,growth:1}
};
const CAREER_POS={
  POR:{goalRate:0,assistRate:0},LI:{goalRate:1,assistRate:1},DFC:{goalRate:1,assistRate:1},LD:{goalRate:1,assistRate:1},
  MCD:{goalRate:1,assistRate:2},MC:{goalRate:2,assistRate:3},MCO:{goalRate:4,assistRate:5},MI:{goalRate:3,assistRate:4},
  MD:{goalRate:3,assistRate:4},EI:{goalRate:5,assistRate:5},ED:{goalRate:5,assistRate:5},DC:{goalRate:7,assistRate:3}
};
function careerClubByName(name){return CAREER_CLUBS.find(x=>x.name===name)||CAREER_CLUBS[0]}
function careerClamp(n,min,max){return Math.max(min,Math.min(max,n))}
function careerTierLabel(t){return ["","Cantera","Profesional","Europa","Élite","Superélite"][t]||"Profesional"}
function careerXpNeed(c){return 100+Math.max(0,c.level-1)*75}
function isAstro67Career(c){return String(c?.name||"").trim().toLowerCase()==="astro67"||String(user?.username||"").trim().toLowerCase()==="astro67"}
function careerOffers(c){return isAstro67Career(c)?[CAREER_CLUBS[7],CAREER_CLUBS[9],CAREER_CLUBS[10]]:[CAREER_CLUBS[0],CAREER_CLUBS[1],CAREER_CLUBS[2]]}
function careerDecisionOptions(c){
  if(c.age<22)return [
    {id:"training",title:"Entrenar al máximo",desc:"+3 OVR · -5 físico",growth:3,form:4,fitness:-5,morale:1},
    {id:"minutes",title:"Buscar minutos",desc:"+2 OVR · +5 moral",growth:2,form:3,fitness:-2,morale:5},
    {id:"body",title:"Cuidar el físico",desc:"+1 OVR · +8 físico",growth:1,form:1,fitness:8,morale:2}
  ];
  if(c.age<30)return [
    {id:"training",title:"Subir el nivel",desc:"+3 OVR · -5 físico",growth:3,form:4,fitness:-5,morale:1},
    {id:"team",title:"Priorizar al equipo",desc:"+1 OVR · +5 moral",growth:1,form:3,fitness:-2,morale:5},
    {id:"body",title:"Cuidar el físico",desc:"+1 OVR · +8 físico",growth:1,form:1,fitness:8,morale:2}
  ];
  return [
    {id:"experience",title:"Usar la experiencia",desc:"+1 OVR · +6 moral",growth:1,form:4,fitness:0,morale:6},
    {id:"team",title:"Ser líder",desc:"+0 OVR · +8 moral",growth:0,form:4,fitness:-1,morale:8},
    {id:"body",title:"Cuidar el físico",desc:"+0 OVR · +10 físico",growth:0,form:2,fitness:10,morale:2}
  ];
}
function careerApplyDecision(c,id){
  const opt=careerDecisionOptions(c).find(x=>x.id===id)||careerDecisionOptions(c)[0];
  const previous=c.decisionHistory.findIndex(x=>Number(x.season)===Number(c.season));
  const entry={season:c.season,choice:opt.title};
  if(previous>=0)c.decisionHistory[previous]=entry;
  else c.decisionHistory.push(entry);
  return opt;
}
function careerStartWithClub(c,club){
  c.club=club.name;c.league=club.league;c.initialClub=c.initialClub||club.name;c.salary=club.salary;
  c.marketValue=Math.max(100000,Math.round(club.base*club.base*120));c.peakValue=c.marketValue;
}
function careerSeasonOutcome(c,choice){
  const club=careerClubByName(c.club),pos=CAREER_POS[c.position]||CAREER_POS.DC,style=CAREER_STYLES[c.style]||CAREER_STYLES.Desborde;
  const starterScore=c.ovr+Math.floor(c.form/15)+Math.floor(c.morale/20)-(club.base>c.ovr?2:0);
  const matches=careerClamp(Math.round(28+(starterScore-55)*0.9),14,48);
  const goals=careerClamp(Math.round(matches*(pos.goalRate+style.goals)/100)+(c.ovr>=85?Math.floor(matches/18):0),0,60);
  const assists=careerClamp(Math.round(matches*(pos.assistRate+style.assists)/100)+(c.ovr>=82?Math.floor(matches/18):0),0,35);
  const avgRating=careerClamp(Math.round((6.2+(c.ovr-55)/14+(c.form-50)/50)*10)/10,5.8,9.0);
  const teamEdge=c.ovr-club.base+Math.floor(c.morale/20);
  const trophies=[];
  if(teamEdge>=10)trophies.push("Liga");
  if(teamEdge>=14 && c.season%2===0)trophies.push("Copa nacional");
  if(club.tier>=4 && teamEdge>=12 && c.season%3!==1)trophies.push("Competición continental");
  c.titles+=trophies.length;
  trophies.forEach(t=>c.cups.push(t+" · T"+c.season));
  if(c.age>=18&&c.ovr>=70){
    c.caps+=Math.max(2,Math.floor((c.ovr-62)/4));
    if(c.position!=="POR"&&c.season%3===0)c.nationalGoals+=Math.max(1,Math.floor(goals/9));
  }
  const ageGrowth=c.age<23?2:c.age<29?1:c.age<33?0:-1;
  c.ovr=careerClamp(c.ovr+ageGrowth+choice.growth,40,99);
  if(c.age>=30)c.ovr=careerClamp(c.ovr-1,40,99);
  c.maxOvr=Math.max(c.maxOvr,c.ovr);
  c.form=careerClamp(c.form+choice.form+(avgRating>=7.5?3:-1),25,100);
  c.fitness=careerClamp(c.fitness+choice.fitness-(matches>=42?4:0),35,100);
  c.morale=careerClamp(c.morale+choice.morale+(trophies.length?5:-2),25,100);
  if(c.fitness<45){c.injurySeasons=1;c.form=careerClamp(c.form-6,20,100)}else c.injurySeasons=0;
  c.matches+=matches;c.goals+=goals;c.assists+=assists;
  c.marketValue=careerClamp(Math.round(club.base*club.base*200+c.ovr*c.ovr*700+c.form*10000),100000,999000000);
  c.peakValue=Math.max(c.peakValue,c.marketValue);
  c.xp+=matches*3+goals*12+assists*7+trophies.length*30;
  while(c.xp>=careerXpNeed(c)){c.xp-=careerXpNeed(c);c.level++}
  c.contractYears=Math.max(0,c.contractYears-1);c.salary=club.salary;
  c.currentObjective=c.ovr>=85?"Pelear por títulos y selección":c.ovr>=75?"Convertirte en figura":c.age>=30?"Mantener tu nivel y cerrar la carrera":"Ganar minutos y mejorar";
  return {matches,goals,assists,avgRating,trophies};
}
function careerPossibleTransfer(c){
  const targets=isAstro67Career(c)?["Real Madrid","Barcelona","Manchester City","Bayern Múnich","Paris Saint-Germain","Inter","Racing Europa"]:["Racing Europa","Inter","Paris Saint-Germain","Real Madrid","Barcelona","Bayern Múnich","Manchester City"];
  for(const name of targets){
    const club=careerClubByName(name);
    if(club.name!==c.club&&club.base<=c.ovr&&c.ovr>=club.base-2)return club;
  }
  return null;
}
function careerRenderSeasonRow(s){
  return "<div class='feature-row'><strong>T"+s.season+" · "+s.age+" años</strong> · "+esc(s.club)+" · OVR "+s.ovr+" · "+s.matches+" PJ · "+s.goals+" G · "+s.assists+" A"+(s.trophies?.length?" · 🏆 "+s.trophies.join(", "):"")+(s.transfer?" · 🔄 "+esc(s.transfer):"")+"</div>";
}
function loadCareer(){
  const box=$("careerContent");if(!box||!user)return;
  let c=getCareer();
  if(!c){
    box.innerHTML=`<div class="career-hero"><div class="card">
      <h2>🏟️ Crear futbolista</h2>
      <div class="field"><label>Nombre en la camiseta</label><input id="careerName" maxlength="18" value="${esc(user.username||"Jugador")}"></div>
      <div class="field"><label>Dorsal</label><input id="careerDorsal" type="number" min="1" max="99" value="9"></div>
      <div class="field"><label>Pie hábil</label><select id="careerFoot"><option>Derecho</option><option>Izquierdo</option></select></div>
      <div class="field"><label>Nacionalidad</label><select id="careerNation"><option>Uruguay</option><option>Argentina</option><option>Brasil</option><option>España</option><option>Francia</option><option>Portugal</option><option>Inglaterra</option><option>Italia</option><option>Alemania</option></select></div>
      <div class="field"><label>Posición</label><select id="careerPos"><option>DC</option><option>EI</option><option>ED</option><option>MCO</option><option>MC</option><option>MI</option><option>MD</option><option>MCD</option><option>LI</option><option>DFC</option><option>LD</option><option>POR</option></select></div>
      <div class="field"><label>Estilo</label><select id="careerStyle"><option>Desborde</option><option>Organizador</option><option>Potencia</option></select></div>
      <button class="btn primary" id="careerStart">Crear jugador → Elegir cantera</button>
    </div><div class="card"><h2>Cómo funciona</h2><p class="feature-muted">Como en Copero: empezás a los 16, elegís tu primera cantera y avanzás por temporadas.</p>
      <div class="feature-list"><div class="feature-row">📅 24 temporadas · retiro a los 40</div><div class="feature-row">📈 OVR · forma · físico · moral · valor</div><div class="feature-row">🏆 Títulos · selección · fichajes</div><div class="feature-row">🎯 Sin tiradas de suerte: tus valores mandan</div></div>
    </div></div>`;
    $("careerStart").onclick=()=>{
      c=careerDefault();c.name=$("careerName").value.trim()||user.username||"Jugador";if(String(c.name).trim().toLowerCase()==="astro67"){c.potential=99;c.ovr=70;c.maxOvr=70}c.dorsal=careerClamp(Number($("careerDorsal").value)||9,1,99);
      c.foot=$("careerFoot").value;c.nationality=$("careerNation").value;c.position=$("careerPos").value;c.style=$("careerStyle").value;saveCareer(c);loadCareer();
    };
    return;
  }
  if(!c.club){
    const offers=careerOffers(c);
    box.innerHTML=`<div class="card"><div class="section-head"><div><h2>🌱 Ofertas de cantera</h2><div class="small muted">Elegí tu primer club. Son siempre las mismas tres ofertas: nada de suerte.</div></div></div>
      <div class="feature-grid">${offers.map((o,i)=>`<div class="feature-row"><h3>${esc(o.name)}</h3><p class="feature-muted">${esc(o.league)} · ${careerTierLabel(o.tier)}</p><p>OVR del club: <strong>${o.base}</strong></p><p>Salario inicial: <strong>€${o.salary.toLocaleString("es-ES")}</strong></p><button class="btn primary" data-career-club="${i}">Firmar</button></div>`).join("")}</div></div>`;
    document.querySelectorAll("[data-career-club]").forEach(b=>b.onclick=()=>{careerStartWithClub(c,offers[Number(b.dataset.careerClub)]||offers[0]);saveCareer(c);loadCareer()});
    return;
  }
  if(c.retired){
    const score=Math.round(c.matches*2+c.goals*8+c.assists*4+c.titles*55+c.caps*3+c.maxOvr*10+c.transfers*10);
    box.innerHTML=`<div class="career-hero"><div class="career-avatar">🏆</div><div class="card"><h2>👑 Carrera completada</h2><p><strong>${esc(c.name)}</strong> · ${esc(c.position)} · #${c.dorsal}</p><p>${esc(c.nationality)} · 16 → ${c.age} años</p><h3>Puntaje de carrera: ${score.toLocaleString("es-ES")}</h3><p class="feature-muted">Mejor OVR ${c.maxOvr} · Valor máximo €${(c.peakValue/1000000).toFixed(1)}M</p></div></div>
      <div class="feature-stat-grid" style="margin-top:14px"><div class="feature-stat"><span class="small muted">Partidos</span><b>${c.matches}</b></div><div class="feature-stat"><span class="small muted">Goles</span><b>${c.goals}</b></div><div class="feature-stat"><span class="small muted">Asistencias</span><b>${c.assists}</b></div><div class="feature-stat"><span class="small muted">Títulos</span><b>${c.titles}</b></div><div class="feature-stat"><span class="small muted">Selección</span><b>${c.caps}</b></div><div class="feature-stat"><span class="small muted">Fichajes</span><b>${c.transfers}</b></div><div class="feature-stat"><span class="small muted">Mejor OVR</span><b>${c.maxOvr}</b></div><div class="feature-stat"><span class="small muted">Valor máximo</span><b>€${(c.peakValue/1000000).toFixed(1)}M</b></div></div>
      <div class="card" style="margin-top:14px"><h3>📚 Historial</h3><div class="feature-list">${c.seasonHistory.slice().reverse().map(careerRenderSeasonRow).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3>🏆 Vitrina</h3><p class="feature-muted">${c.cups.length?c.cups.map(esc).join(" · "):"Sin títulos"}</p><button class="btn" id="careerReset">Empezar otra carrera</button></div>`;
    $("careerReset").onclick=()=>{if(confirm("¿Borrar tu carrera y empezar otra?")){localStorage.removeItem("fql_career_v2");loadCareer()}};
    return;
  }
  const need=careerXpNeed(c),pct=Math.min(100,c.xp/need*100),options=careerDecisionOptions(c),transfer=careerPossibleTransfer(c),club=careerClubByName(c.club);
  box.innerHTML=`<div class="career-hero"><div class="career-avatar">${esc((c.name||"?").slice(0,1).toUpperCase())}</div><div class="card">
    <h2>${esc(c.name)}</h2><p><strong>${esc(c.position)}</strong> · ${esc(c.club)} · #${c.dorsal}</p><p>${esc(c.nationality)} · ${esc(c.style)} · ${esc(c.foot)}</p>
    <div class="career-rank-line"><span class="rank-badge ${c.ovr>=90?"rank-vip":c.ovr>=80?"rank-elite":c.ovr>=70?"rank-profesional":c.ovr>=60?"rank-amateur":"rank-novato"}">OVR ${c.ovr}</span><span class="small muted">${c.age} años · Temporada ${c.season}/24 · Contrato ${c.contractYears} años</span></div>
    <div class="feature-progress"><i style="width:${pct}%"></i></div><p class="small muted">Nivel ${c.level} · ${c.xp}/${need} XP · Potencial ${c.potential}</p>
  </div></div>
  <div class="feature-stat-grid" style="margin-top:14px"><div class="feature-stat"><span class="small muted">Partidos</span><b>${c.matches}</b></div><div class="feature-stat"><span class="small muted">Goles</span><b>${c.goals}</b></div><div class="feature-stat"><span class="small muted">Asistencias</span><b>${c.assists}</b></div><div class="feature-stat"><span class="small muted">Títulos</span><b>${c.titles}</b></div><div class="feature-stat"><span class="small muted">Selección</span><b>${c.caps}</b></div><div class="feature-stat"><span class="small muted">Valor</span><b>€${(c.marketValue/1000000).toFixed(1)}M</b></div><div class="feature-stat"><span class="small muted">Forma</span><b>${c.form}/100</b></div><div class="feature-stat"><span class="small muted">Físico</span><b>${c.fitness}/100</b></div></div>
  <div class="card" style="margin-top:14px"><h3>🎯 Decisión de la temporada</h3><p class="feature-muted">${esc(c.currentObjective)}</p><div class="feature-grid">${options.map(o=>`<button class="btn" data-career-choice="${o.id}"><strong>${esc(o.title)}</strong><br><span class="small">${esc(o.desc)}</span></button>`).join("")}</div><div id="careerLog" class="small muted" style="margin-top:12px"></div></div>
  <div class="card" style="margin-top:14px"><h3>🔄 Mercado de pases</h3><p>${transfer?"Hay una oferta de <strong>"+esc(transfer.name)+"</strong> ("+esc(transfer.league)+").":"No hay una oferta superior todavía."}</p><div class="feature-actions">${transfer?"<button class='btn primary' id='careerTransfer'>Aceptar oferta</button>":""}<button class="btn" id="careerStay">Quedarme en ${esc(c.club)}</button></div></div>
  <div class="card" style="margin-top:14px"><h3>📚 Últimas temporadas</h3><div class="feature-list">${c.seasonHistory.slice().reverse().slice(0,6).map(careerRenderSeasonRow).join("")||"<p class='feature-muted'>Todavía no completaste una temporada.</p>"}</div></div>
  <div class="card" style="margin-top:14px"><div class="feature-actions"><button class="btn" id="careerSim">Simular temporada</button><button class="btn" id="careerRetire">Retirarme ahora</button><button class="btn" id="careerReset">Nueva carrera</button></div><p class="small muted">Los partidos se simulan con tus atributos, el club y la decisión elegida. No hay azar para decidir tu temporada.</p></div>`;
  let pendingChoice=null;
  document.querySelectorAll("[data-career-choice]").forEach(btn=>btn.onclick=()=>{
    pendingChoice=careerApplyDecision(c,btn.dataset.careerChoice);
    document.querySelectorAll("[data-career-choice]").forEach(x=>x.classList.remove("primary"));btn.classList.add("primary");
    const log=$("careerLog");if(log)log.textContent="✅ Decisión guardada. Ahora simulá la temporada.";
  });
  $("careerSim").onclick=()=>{
    if(!pendingChoice){alert("Elegí primero una decisión.");return}
    const seasonNo=c.season,age=c.age,outcome=careerSeasonOutcome(c,pendingChoice);
    const snapshot={season:seasonNo,age,ovr:c.ovr,club:c.club,matches:outcome.matches,goals:outcome.goals,assists:outcome.assists,trophies:outcome.trophies,transfer:null};
    c.seasonHistory.push(snapshot);c.season++;c.age++;
    if(c.age>=40){c.retired=true;saveCareer(c);loadCareer();return}
    if(c.contractYears<=0){
      const target=careerPossibleTransfer(c);
      if(target){careerStartWithClub(c,target);c.transfers++;c.contractYears=3;snapshot.transfer=target.name}
      else c.contractYears=2;
    }
    saveCareer(c);loadCareer();
  };
  if($("careerTransfer"))$("careerTransfer").onclick=()=>{if(transfer){careerStartWithClub(c,transfer);c.transfers++;c.contractYears=3;saveCareer(c);loadCareer()}};
  $("careerStay").onclick=()=>{c.contractYears=Math.max(2,c.contractYears);c.morale=careerClamp(c.morale+4,0,100);saveCareer(c);loadCareer()};
  $("careerRetire").onclick=()=>{if(confirm("¿Retirarte ahora?")){c.retired=true;saveCareer(c);loadCareer()}};
  $("careerReset").onclick=()=>{if(confirm("¿Borrar tu carrera y empezar otra?")){localStorage.removeItem("fql_career_v2");loadCareer()}};
}

let extraIndex=0,extraScore=0,extraType="player";
function loadExtras(){
  const box=$("extraContent");if(!box)return;
  extraIndex=0;extraScore=0;extraType="player";
  renderExtraMenu();
}
function renderExtraMenu(){
  const box=$("extraContent");
  box.innerHTML=`<div class="feature-grid"><div class="card"><h3>🕵️ Adiviná el jugador</h3><p class="feature-muted">Recibí 3 pistas y elegí la respuesta.</p><button class="btn primary" onclick="window.startExtra('player')">Jugar</button></div><div class="card"><h3>🛡️ Adiviná el club</h3><p class="feature-muted">Tres pistas para descubrir el club.</p><button class="btn primary" onclick="window.startExtra('club')">Jugar</button></div></div>`;
}
window.startExtra=function(type){
  extraType=type;extraIndex=0;extraScore=0;renderExtraQuestion();
};
function renderExtraQuestion(){
  const data=extraType==="player"?PLAYER_QUIZ:CLUB_QUIZ;
  if(extraIndex>=data.length){$("extraContent").innerHTML=`<div class="card"><h2>🏆 Terminaste</h2><p>Puntaje: <strong>${extraScore}/${data.length}</strong></p><button class="btn primary" onclick="window.startExtra('${extraType}')">Jugar de nuevo</button></div>`;return}
  const item=data[extraIndex],pool=data.map(x=>x[0]),others=pool.filter(x=>x!==item[0]),opts=[item[0],others[(extraIndex*2)%others.length],others[(extraIndex*2+1)%others.length]].sort(()=>Math.random()-.5);
  $("extraContent").innerHTML=`<div class="card"><div class="small muted">${extraType==="player"?"Adiviná el jugador":"Adiviná el club"} · ${extraIndex+1}/${data.length}</div><h2>¿Quién es?</h2><div class="feature-list"><div class="feature-row">🌎 ${esc(item[1])}</div><div class="feature-row">🏟️ ${esc(item[2])}</div><div class="feature-row">🔎 ${esc(item[3])}</div></div><div class="feature-answer-grid">${opts.map(o=>`<button class="btn option" data-extra-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div><p class="small muted">Puntaje: ${extraScore}</p></div>`;
  document.querySelectorAll("[data-extra-answer]").forEach(b=>b.onclick=()=>{if(b.dataset.extraAnswer===item[0])extraScore++;extraIndex++;renderExtraQuestion()});
};

function loadEvents(){
  const box=$("eventsContent");if(!box)return;
  const events=[
    ["🌎","Semana Mundialista","Preguntas centradas en Mundiales, campeones, goleadores y leyendas."],
    ["🥇","Semana de Premios","Balón de Oro, Bota de Oro y premios individuales."],
    ["🏆","Semana Sudamericana","Copa América, Libertadores y grandes clubes sudamericanos."],
    ["🇪🇺","Semana Europea","Eurocopa, Champions y gigantes europeos."]
  ];
  const week=Math.floor(Date.now()/604800000),e=events[((week%events.length)+events.length)%events.length];
  box.innerHTML=`<div class="event-card"><div style="font-size:48px">${e[0]}</div><h2>${e[1]}</h2><p>${e[2]}</p><p class="feature-muted">El evento rota automáticamente cada semana.</p></div><div class="feature-grid" style="margin-top:14px">${events.map((x,i)=>`<div class="card"><strong>${x[0]} ${x[1]}</strong><p class="small muted">${x[2]}</p></div>`).join("")}</div>`;
}

function init(){
  addViews();makeMenuClicks();
  const pr=$("progressReload");if(pr)pr.onclick=loadProgress;
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();

})();