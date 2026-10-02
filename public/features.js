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
    style.textContent=`.feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.feature-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.feature-stat{padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--card2)}.feature-stat b{display:block;font-size:24px;margin-top:4px}.feature-progress{height:12px;background:var(--card2);border:1px solid var(--line);border-radius:999px;overflow:hidden}.feature-progress i{display:block;height:100%;background:var(--accent);width:0}.feature-list{display:grid;gap:8px}.feature-row{padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--card2)}.feature-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.feature-answer-grid{display:grid;gap:9px;margin-top:15px}.feature-answer-grid button{text-align:left}.achievement-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.achievement{padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--card2)}.achievement.unlocked{border-color:var(--accent);background:rgba(53,211,154,.08)}.live-card{border-color:#e85b5b}.live-timer{font-size:31px;font-weight:950}.career-hero{display:grid;grid-template-columns:1.3fr 1fr;gap:14px}.career-avatar{min-height:220px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(135deg,#102018,#263247,#35d399);display:grid;place-items:center;font-size:92px;font-weight:950}.event-card{padding:20px;border-radius:18px;border:1px solid var(--line);background:linear-gradient(135deg,var(--card),var(--card2))}.feature-muted{color:var(--muted)}@media(max-width:720px){.feature-grid,.achievement-grid,.career-hero{grid-template-columns:1fr}.feature-stat-grid{grid-template-columns:repeat(2,1fr)}}`;
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
    box.innerHTML="<div class='feature-list'>"+(x.ranking||[]).map((r,i)=>"<div class='feature-row'><strong>#"+(i+1)+" "+nameHtml(r.username,r.nameColor,false)+"</strong> · "+Number(r.score||0).toLocaleString("es-ES")+" pts</div>").join("")+"</div>";
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
  box.innerHTML=`<div class="card"><div class="small muted">${esc(q.category)} · Pregunta ${Number(x.idx)+1}/${x.total}</div><h2 class="question">${esc(q.q)}</h2><div class="feature-answer-grid">${q.options.map((o,i)=>`<button class="btn option" data-daily-choice="${i}">${esc(o)}</button>`).join("")}</div><p class="small muted">Puntos: ${x.score}</p></div>`;
  document.querySelectorAll("[data-daily-choice]").forEach(b=>b.onclick=async()=>{
    document.querySelectorAll("[data-daily-choice]").forEach(z=>z.disabled=true);
    try{const y=await api("/api/daily-challenge/answer",{method:"POST",body:JSON.stringify({choice:Number(b.dataset.dailyChoice)})});if(y.done){renderDailyQuestion({completed:true,score:y.score});showGlobalBroadcast({sender:"FUTBOLIQ",message:"¡Desafío diario completado!",createdAt:Date.now()})}else renderDailyQuestion({...y,total:x.total,idx:(x.idx||0)+1})}catch(e){alert(e.message);loadDaily()}
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
      box.innerHTML=`<div class="card live-card"><div class="small muted">${esc(x.category)}</div><div class="live-timer">00:${String(left).padStart(2,"0")}</div><h2 class="question">${esc(x.q)}</h2>${x.answered?"<div class='notice'>✅ Ya respondiste esta pregunta.</div>":"<div class='feature-answer-grid'>"+x.options.map((o,i)=>"<button class='btn option' data-live-choice='"+i+"'>"+esc(o)+"</button>").join("")+"</div>"}<p class="small muted">Respuestas: ${x.answers||0} · Correctas: ${x.correctAnswers||0}</p></div>`;
      document.querySelectorAll("[data-live-choice]").forEach(b=>b.onclick=async()=>{
        document.querySelectorAll("[data-live-choice]").forEach(z=>z.disabled=true);
        try{const y=await api("/api/live/answer",{method:"POST",body:JSON.stringify({liveId:x.id,choice:Number(b.dataset.liveChoice)})});box.insertAdjacentHTML("beforeend","<p class='notice'>"+(y.correct?"✅ ¡Correcto! +25 🪙":"❌ Incorrecto.")+"</p>");setTimeout(draw,800)}catch(e){alert(e.message);draw()}
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
  return {name:user?.username||"Jugador",position:"DC",club:"FUTBOLIQ FC",season:1,age:16,matches:0,goals:0,assists:0,coins:0,rating:55,form:0,level:1,xp:0,retired:false};
}
function getCareer(){try{return JSON.parse(localStorage.getItem("fql_career_v1")||"null")}catch{return null}}
function saveCareer(c){localStorage.setItem("fql_career_v1",JSON.stringify(c))}
function loadCareer(){
  const box=$("careerContent");if(!box||!user)return;
  let c=getCareer();
  if(!c){
    box.innerHTML=`<div class="card"><h3>Empezá tu carrera</h3><div class="field"><label>Posición</label><select id="careerPos"><option>DC</option><option>EI</option><option>ED</option><option>MCO</option><option>MC</option><option>MCD</option><option>DFC</option></select></div><div class="field"><label>Club inicial</label><input id="careerClub" maxlength="30" value="FUTBOLIQ FC"></div><button class="btn primary" id="careerStart">Crear jugador</button></div>`;
    $("careerStart").onclick=()=>{c=careerDefault();c.position=$("careerPos").value;c.club=$("careerClub").value.trim()||"FUTBOLIQ FC";saveCareer(c);loadCareer()};
    return;
  }
  const nextLevel=Math.max(100,c.level*100),pct=Math.min(100,c.xp/nextLevel*100);
  box.innerHTML=`<div class="career-hero"><div class="career-avatar">${esc((c.name||"?").slice(0,1).toUpperCase())}</div><div class="card"><h2>${esc(c.name)}</h2><p><strong>${esc(c.position)}</strong> · ${esc(c.club)}</p><p>Edad: ${c.age} · Temporada: ${c.season}</p><div class="feature-progress"><i style="width:${pct}%"></i></div><p class="small muted">Nivel ${c.level} · ${c.xp}/${nextLevel} XP</p></div></div>
  <div class="feature-stat-grid" style="margin-top:14px"><div class="feature-stat"><span class="small muted">Partidos</span><b>${c.matches}</b></div><div class="feature-stat"><span class="small muted">Goles</span><b>${c.goals}</b></div><div class="feature-stat"><span class="small muted">Asistencias</span><b>${c.assists}</b></div><div class="feature-stat"><span class="small muted">Valoración</span><b>${c.rating}</b></div></div>
  <div class="card" style="margin-top:14px"><h3>⚽ Próximo partido</h3><p>Tu rendimiento depende de una simulación rápida.</p><div class="feature-actions"><button class="btn primary" id="careerMatch">${c.retired?"Retirado":"Jugar partido"}</button><button class="btn" id="careerReset">Nueva carrera</button></div><div id="careerLog" class="small muted" style="margin-top:10px"></div></div>`;
  $("careerMatch").onclick=()=>{if(c.retired)return;const goals=Math.floor(Math.random()*3),assists=Math.floor(Math.random()*2),rating=Math.max(45,Math.min(99,55+goals*8+assists*4+Math.floor(Math.random()*12)));c.matches++;c.goals+=goals;c.assists+=assists;c.rating=rating;c.form=Math.max(0,Math.min(10,c.form+(rating>=70?1:-1)));c.xp+=20+goals*25+assists*10;if(c.xp>=c.level*100){c.xp-=c.level*100;c.level++;c.rating=Math.min(99,c.rating+2)};if(c.matches%20===0){c.season++;c.age++;if(c.age>=36)c.retired=true};saveCareer(c);loadCareer();setTimeout(()=>{const log=$("careerLog");if(log)log.textContent=goals?"⚽ Marcaste "+goals+" gol"+(goals===1?"":"es")+" y diste "+assists+" asistencia(s).":"Partido trabajado. Sin goles esta vez."},0)};
  $("careerReset").onclick=()=>{if(confirm("¿Borrar tu carrera local y comenzar otra?")){localStorage.removeItem("fql_career_v1");loadCareer()}};
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