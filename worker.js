import { QUESTIONS, QUESTION_SETS, QUESTION_COUNTS } from "./questions.js";

const DIFFICULTY_META = {
  facil: {label:"Fácil", points:100, coins:8},
  dificil: {label:"Normal", points:175, coins:14},
  imposible: {label:"Imposible", points:300, coins:25},
  blassvec: {label:"Blassvec Modo", points:0, coins:0}
};

const STYLES = [
  {id:"clasico",name:"Clásico",price:0,icon:"⚽",desc:"El estilo original de FUTBOLIQ."},
  {id:"neon",name:"Neón",price:5000,icon:"⚡",desc:"Perfil brillante con estética futurista."},
  {id:"fuego",name:"Fuego",price:10000,icon:"🔥",desc:"Un perfil intenso para competir."},
  {id:"hielo",name:"Hielo",price:10000,icon:"❄️",desc:"Estilo frío y elegante."},
  {id:"oro",name:"Oro",price:20000,icon:"👑",desc:"Perfil dorado para coleccionistas."},
  {id:"carbono",name:"Carbono",price:30000,icon:"🖤",desc:"Estilo oscuro de alto nivel."},
  {id:"retro",name:"Retro",price:15000,icon:"📼",desc:"Inspirado en el fútbol clásico."},
  {id:"cosmico",name:"Cósmico",price:45000,icon:"🌌",desc:"Un perfil con estilo espacial."},
  {id:"mundial",name:"Mundial",price:75000,icon:"🏆",desc:"Para quienes viven el fútbol."}
];

const STYLE_BY_ID = new Map(STYLES.map(s=>[s.id,s]));
const RANKS = [
  {id:"novato",name:"Novato",price:0,icon:"⚽",desc:"Rango inicial. Solo estético.",css:"novato",multiplier:1},
  {id:"amateur",name:"Amateur",price:7500,icon:"🥉",desc:"Rango estético para empezar a escalar.",css:"amateur",multiplier:1},
  {id:"profesional",name:"Profesional",price:25000,icon:"🥈",desc:"Rango estético para jugadores serios.",css:"profesional",multiplier:1},
  {id:"elite",name:"Élite",price:75000,icon:"🥇",desc:"Rango estético de alto nivel.",css:"elite",multiplier:1},
  {id:"leyenda",name:"Leyenda",price:200000,icon:"🏆",desc:"Rango estético para verdaderas leyendas.",css:"leyenda",multiplier:1},
  {id:"idolo",name:"Ídolo",price:600000,icon:"👑",desc:"Rango estético de colección.",css:"idolo",multiplier:1},
  {id:"vip",name:"VIP",price:2500000,icon:"💎",desc:"Rango premium: x2 EXP y x2 monedas en todas las recompensas.",css:"vip",multiplier:2,vip:true}
];
const RANK_BY_ID = new Map(RANKS.map(r=>[r.id,r]));
const NAME_COLORS = [
  {id:"blanco",name:"Blanco",price:0,color:"#f5f7fb",desc:"El color original de FUTBOLIQ."},
  {id:"azul",name:"Azul",price:1200,color:"#60a5fa",desc:"Azul eléctrico para tu nombre."},
  {id:"rojo",name:"Rojo",price:1800,color:"#fb7185",desc:"Un nombre que resalta."},
  {id:"verde",name:"Verde",price:2500,color:"#35d399",desc:"Tono verde FUTBOLIQ."},
  {id:"violeta",name:"Violeta",price:3500,color:"#c084fc",desc:"Violeta brillante."},
  {id:"celeste",name:"Celeste",price:4500,color:"#67e8f9",desc:"Celeste de selección."},
  {id:"rosa",name:"Rosa",price:6000,color:"#f472b6",desc:"Rosa intenso."},
  {id:"oro",name:"Dorado",price:8500,color:"#f6c453",desc:"Nombre dorado."},
  {id:"arcoiris",name:"Arcoíris",price:20000,color:null,gradient:"linear-gradient(90deg,#ff595e,#ffca3a,#8ac926,#1982c4,#6a4c93)",desc:"Gradiente multicolor."}
];
const NAME_COLOR_BY_ID = new Map(NAME_COLORS.map(c=>[c.id,c]));
const OWNER_NAME_COLOR = {
  id:"owner",name:"OWNER",color:null,
  gradient:"linear-gradient(90deg,#35d399,#f6c453,#7dd3fc,#c084fc,#35d399)",
  desc:"Exclusivo del Owner. No está a la venta."
};
const RATE = new Map();

function isOwnerName(username,env){
  return !!env.ADMIN_USERNAME && String(username||"").toLowerCase()===String(env.ADMIN_USERNAME).toLowerCase();
}
function isOwnerUser(user,env){
  return !!user && isOwnerName(user.username,env);
}

let schemaReadyPromise=null;
async function ensureDatabase(env) {
  if(schemaReadyPromise) return schemaReadyPromise;
  schemaReadyPromise=(async()=>{
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'active',
        best_score INTEGER NOT NULL DEFAULT 0,
        games INTEGER NOT NULL DEFAULT 0,
        coins INTEGER NOT NULL DEFAULT 300,
        profile_style TEXT NOT NULL DEFAULT 'clasico',
        beta_tester INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions(
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS games(
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        idx INTEGER NOT NULL,
        score INTEGER NOT NULL,
        difficulty TEXT NOT NULL DEFAULT 'facil',
        question_ids TEXT,
        started_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS dev_sessions(
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS audit_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        target_user_id INTEGER,
        details TEXT,
        created_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS user_styles(
        user_id INTEGER NOT NULL,
        style_id TEXT NOT NULL,
        purchased_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,style_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS user_name_colors(
        user_id INTEGER NOT NULL,
        color_id TEXT NOT NULL,
        purchased_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,color_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS user_ranks(
        user_id INTEGER NOT NULL,
        rank_id TEXT NOT NULL,
        purchased_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,rank_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS notifications(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        read_at INTEGER
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS daily_gifts(
        user_id INTEGER NOT NULL,
        claim_date TEXT NOT NULL,
        claimed_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,claim_date),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS broadcast_messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_user_id INTEGER,
        sender_username TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS owner_chat_messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_user_id INTEGER NOT NULL,
        sender_username TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_games_user ON games(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_dev_expiry ON dev_sessions(expires_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_user_styles_user ON user_styles(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_user_name_colors_user ON user_name_colors(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_user_ranks_user ON user_ranks(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id,read_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_broadcast_created ON broadcast_messages(created_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_owner_chat_created ON owner_chat_messages(created_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_daily_gifts_date ON daily_gifts(claim_date)"),
    ]);

    // Este índice es útil, pero no debe dejar fuera de servicio el juego si una
    // base antigua ya contiene nombres que solo difieren en mayúsculas/minúsculas.
    try {
      await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username_nocase ON users(username COLLATE NOCASE)").run();
    } catch(e) {
      console.warn("[db:username-index]",e);
    }

    const userInfo=await env.DB.prepare("PRAGMA table_info(users)").all();
    const userCols=new Set((userInfo.results||[]).map(r=>r.name));
    if(!userCols.has("coins")) await env.DB.prepare("ALTER TABLE users ADD COLUMN coins INTEGER NOT NULL DEFAULT 300").run();
    if(!userCols.has("profile_style")) await env.DB.prepare("ALTER TABLE users ADD COLUMN profile_style TEXT NOT NULL DEFAULT 'clasico'").run();
    if(!userCols.has("beta_tester")) await env.DB.prepare("ALTER TABLE users ADD COLUMN beta_tester INTEGER NOT NULL DEFAULT 0").run();
    if(!userCols.has("name_color")) await env.DB.prepare("ALTER TABLE users ADD COLUMN name_color TEXT NOT NULL DEFAULT 'blanco'").run();
    if(!userCols.has("profile_rank")) await env.DB.prepare("ALTER TABLE users ADD COLUMN profile_rank TEXT NOT NULL DEFAULT 'novato'").run();

    const gameInfo=await env.DB.prepare("PRAGMA table_info(games)").all();
    const gameCols=new Set((gameInfo.results||[]).map(r=>r.name));
    if(!gameCols.has("difficulty")) await env.DB.prepare("ALTER TABLE games ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'facil'").run();
    if(!gameCols.has("question_ids")) await env.DB.prepare("ALTER TABLE games ADD COLUMN question_ids TEXT").run();

    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO user_styles(user_id,style_id,purchased_at) SELECT id,'clasico',COALESCE(created_at,?) FROM users").bind(Date.now()),
      env.DB.prepare("UPDATE users SET coins=300 WHERE coins IS NULL"),
      env.DB.prepare("UPDATE users SET profile_style='clasico' WHERE profile_style IS NULL OR profile_style=''"),
      env.DB.prepare("UPDATE users SET name_color='blanco' WHERE name_color IS NULL OR name_color=''"),
      env.DB.prepare("INSERT OR IGNORE INTO user_name_colors(user_id,color_id,purchased_at) SELECT id,'blanco',COALESCE(created_at,?) FROM users").bind(Date.now()),
      env.DB.prepare("UPDATE users SET profile_rank='novato' WHERE profile_rank IS NULL OR profile_rank=''"),
      env.DB.prepare("INSERT OR IGNORE INTO user_ranks(user_id,rank_id,purchased_at) SELECT id,'novato',COALESCE(created_at,?) FROM users").bind(Date.now())
    ]);
  })().catch(e=>{
    schemaReadyPromise=null;
    console.error("[db:init]",e);
    throw e;
  });
  return schemaReadyPromise;
}
const FEATURE_ACHIEVEMENTS=[
  {id:"first_correct",title:"Primer acierto",desc:"Respondé una pregunta correctamente."},
  {id:"correct_100",title:"Centenario",desc:"100 respuestas correctas."},
  {id:"correct_500",title:"Máquina",desc:"500 respuestas correctas."},
  {id:"streak_10",title:"Racha x10",desc:"10 respuestas correctas seguidas."},
  {id:"daily_7",title:"Semana perfecta",desc:"7 días seguidos completando el desafío diario."},
  {id:"duel_1",title:"Primer duelo",desc:"Ganás tu primer duelo."},
  {id:"duel_10",title:"Rey del 1v1",desc:"Ganás 10 duelos."},
  {id:"level_10",title:"Nivel 10",desc:"Llegás al nivel 10."}
];

let featureSchemaPromise=null;
async function ensureFeatureTables(env){
  if(featureSchemaPromise) return featureSchemaPromise;
  featureSchemaPromise=(async()=>{
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS user_stats(
        user_id INTEGER PRIMARY KEY,
        xp INTEGER NOT NULL DEFAULT 0,
        total_answers INTEGER NOT NULL DEFAULT 0,
        correct_answers INTEGER NOT NULL DEFAULT 0,
        current_streak INTEGER NOT NULL DEFAULT 0,
        best_streak INTEGER NOT NULL DEFAULT 0,
        daily_streak INTEGER NOT NULL DEFAULT 0,
        best_daily_streak INTEGER NOT NULL DEFAULT 0,
        daily_last_date TEXT,
        wins INTEGER NOT NULL DEFAULT 0,
        weekly_score INTEGER NOT NULL DEFAULT 0,
        weekly_key TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS achievements(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_id TEXT NOT NULL,
        unlocked_at INTEGER NOT NULL,
        UNIQUE(user_id,achievement_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS daily_progress(
        user_id INTEGER NOT NULL,
        challenge_date TEXT NOT NULL,
        idx INTEGER NOT NULL DEFAULT 0,
        score INTEGER NOT NULL DEFAULT 0,
        question_ids TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,challenge_date)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS live_questions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        question_text TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_index INTEGER NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        starts_at INTEGER NOT NULL,
        ends_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS live_answers(
        live_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        choice INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        answered_at INTEGER NOT NULL,
        PRIMARY KEY(live_id,user_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS friends(
        user_id INTEGER NOT NULL,
        friend_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY(user_id,friend_id)
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS duels(
        id TEXT PRIMARY KEY,
        challenger_id INTEGER NOT NULL,
        opponent_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        question_ids TEXT NOT NULL,
        challenger_idx INTEGER NOT NULL DEFAULT 0,
        opponent_idx INTEGER NOT NULL DEFAULT 0,
        challenger_score INTEGER NOT NULL DEFAULT 0,
        opponent_score INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS app_settings(
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS event_answers(
        event_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        choice INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        answered_at INTEGER NOT NULL,
        PRIMARY KEY(event_id,user_id)
      )`)
    ]);
  })().catch(e=>{featureSchemaPromise=null;console.error("[feature-db]",e);throw e});
  return featureSchemaPromise;
}

function montevideoDate(date=new Date()){
  try{
    const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Montevideo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
    const get=t=>parts.find(p=>p.type===t)?.value;
    return get("year")+"-"+get("month")+"-"+get("day");
  }catch{
    const d=new Date(date),y=d.getUTCFullYear(),m=String(d.getUTCMonth()+1).padStart(2,"0"),day=String(d.getUTCDate()).padStart(2,"0");
    return y+"-"+m+"-"+day;
  }
}
function weekKey(date=new Date()){
  const t=new Date(montevideoDate(date)+"T00:00:00Z");
  const day=t.getUTCDay()||7;
  t.setUTCDate(t.getUTCDate()+4-day);
  const y=t.getUTCFullYear();
  const first=new Date(Date.UTC(y,0,1));
  const week=Math.ceil((((t-first)/86400000)+1)/7);
  return y+"-W"+String(week).padStart(2,"0");
}

function weekendMultiplier(){
  try{
    const day=new Intl.DateTimeFormat("en-US",{timeZone:"America/Montevideo",weekday:"short"}).format(new Date());
    return (day==="Sat"||day==="Sun")?3:1;
  }catch{
    const day=new Date().getUTCDay();
    return (day===0||day===6)?3:1;
  }
}
let rewardMultiplierCache={value:1,expiresAt:0,override:null};
async function getActiveSpecialEvent(env){
  try{
    await ensureFeatureTables(env);
    const row=await env.DB.prepare("SELECT value FROM app_settings WHERE key='special_event' LIMIT 1").first();
    if(!row?.value)return null;
    const event=JSON.parse(row.value);
    if(!event||Number(event.activeUntil)<=Date.now())return null;
    return event;
  }catch{
    return null;
  }
}
async function getBaseRewardMultiplier(env){
  const now=Date.now();
  const specialEvent=await getActiveSpecialEvent(env);
  if(specialEvent?.multiplier){
    return Number(specialEvent.multiplier);
  }
  if(rewardMultiplierCache.expiresAt>now&&rewardMultiplierCache.override!==null)return rewardMultiplierCache.value;
  try{
    await ensureFeatureTables(env);
    const row=await env.DB.prepare("SELECT value FROM app_settings WHERE key='reward_multiplier' LIMIT 1").first();
    if(row&&row.value!==null&&row.value!==""){
      const value=Number(row.value);
      if(Number.isFinite(value)&&value>=0&&value<=100){
        rewardMultiplierCache={value,expiresAt:now+10000,override:value};
        return value;
      }
    }
  }catch{}
  const value=weekendMultiplier();
  rewardMultiplierCache={value,expiresAt:now+10000,override:null};
  return value;
}
async function getVipMultiplier(env,userId){
  if(!userId)return 1;
  try{
    const row=await env.DB.prepare("SELECT profile_rank AS profileRank FROM users WHERE id=? LIMIT 1").bind(userId).first();
    return row?.profileRank==="vip"?2:1;
  }catch{
    return 1;
  }
}
async function getRewardMultiplier(env,userId=null){
  const base=await getBaseRewardMultiplier(env);
  const vip=await getVipMultiplier(env,userId);
  return base*vip;
}
function levelFromXp(xp){return Math.max(1,Math.floor(Math.sqrt(Math.max(0,Number(xp||0))/100))+1)}
function dailyQuestionIds(date){
  const pool=QUESTION_SETS.dificil||[];
  let seed=[...String(date)].reduce((n,ch)=>((n*31+ch.charCodeAt(0))>>>0),2166136261);
  const ids=[],used=new Set();
  while(ids.length<10&&ids.length<pool.length){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const id=pool[seed%pool.length];
    if(!used.has(id)){used.add(id);ids.push(id)}
  }
  return ids;
}
async function ensureUserStats(env,userId){
  const now=Date.now(),wk=weekKey();
  await env.DB.prepare("INSERT OR IGNORE INTO user_stats(user_id,created_at,updated_at,weekly_key) VALUES(?,?,?,?,?)".replace("VALUES(?,?,?,?,?)","VALUES(?,?,?,?)"))
    .bind(userId,now,now,wk).run();
}
async function updateAnswerStats(env,userId,correct,points){
  try{
    await ensureFeatureTables(env);
    await ensureUserStats(env,userId);
    const row=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(userId).first();
    const now=Date.now(),wk=weekKey();
    const boost=await getRewardMultiplier(env,userId);
const xpGain=(correct?Math.max(5,Math.floor(Number(points||0)/10)):1)*boost;
    const streak=correct?(Number(row?.current_streak||0)+1):0;
    const best=Math.max(Number(row?.best_streak||0),streak);
    const weekly=(row?.weekly_key===wk?Number(row?.weekly_score||0):0)+(correct?Number(points||0):0);
    const xp=Number(row?.xp||0)+xpGain;
    await env.DB.prepare("UPDATE user_stats SET xp=?,total_answers=total_answers+1,correct_answers=correct_answers+?,current_streak=?,best_streak=?,weekly_score=?,weekly_key=?,updated_at=? WHERE user_id=?")
      .bind(xp,correct?1:0,streak,best,weekly,wk,now,userId).run();
    const after=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(userId).first();
    await maybeUnlockAchievements(env,userId,after);
    return after;
  }catch(e){console.error("[answer-stats]",e);return null}
}
async function maybeUnlockAchievements(env,userId,s){
  if(!s)return;
  const ids=[];
  if(Number(s.correct_answers)>=1)ids.push("first_correct");
  if(Number(s.correct_answers)>=100)ids.push("correct_100");
  if(Number(s.correct_answers)>=500)ids.push("correct_500");
  if(Number(s.best_streak)>=10)ids.push("streak_10");
  if(Number(s.daily_streak)>=7)ids.push("daily_7");
  if(Number(s.wins)>=1)ids.push("duel_1");
  if(Number(s.wins)>=10)ids.push("duel_10");
  if(levelFromXp(s.xp)>=10)ids.push("level_10");
  for(const id of ids){
    const ins=await env.DB.prepare("INSERT OR IGNORE INTO achievements(user_id,achievement_id,unlocked_at) VALUES(?,?,?)").bind(userId,id,Date.now()).run();
    if(ins.meta?.changes){
      const def=FEATURE_ACHIEVEMENTS.find(x=>x.id===id);
      if(def) await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(userId,"achievement","🏅 Logro desbloqueado: "+def.title+" — "+def.desc,Date.now()).run().catch(()=>{});
    }
  }
}

const json = (data,status=200,headers={}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}
  });

const bytes = (n=32) => crypto.getRandomValues(new Uint8Array(n));
const hex = bytesArr => [...bytesArr].map(x=>x.toString(16).padStart(2,"0")).join("");
const token = () => { const a=bytes(); return btoa(String.fromCharCode(...a)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); };
const digest = async text => hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))));
const randomSalt = () => token();

async function passwordHash(password,salt,pepper,iterations=10000) {
  const key = await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {name:"PBKDF2",salt:new TextEncoder().encode(salt+pepper),iterations,hash:"SHA-256"},
    key,256
  );
  return hex(new Uint8Array(bits));
}

function getCookie(req,name) {
  for (const part of (req.headers.get("Cookie")||"").split(";")) {
    const [k,...v]=part.trim().split("=");
    if(k===name) return decodeURIComponent(v.join("="));
  }
  return "";
}

function cookieHeader(req,name,value,maxAge) {
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function sameOrigin(req) {
  if(!["POST","PUT","PATCH","DELETE"].includes(req.method)) return true;
  const origin=req.headers.get("Origin");
  return !origin || origin===new URL(req.url).origin;
}

function limited(req,key,max,windowMs) {
  const ip=req.headers.get("CF-Connecting-IP")||"unknown";
  const k=key+":"+ip;
  const now=Date.now();
  const e=RATE.get(k);
  if(!e || now-e.start>windowMs){ RATE.set(k,{start:now,count:1}); return true; }
  e.count++;
  return e.count<=max;
}

async function currentUser(req,env) {
  const raw=getCookie(req,"f_session");
  if(!raw) return null;
  const u=await env.DB.prepare(
    "SELECT u.id,u.username,u.role,u.status,u.best_score AS bestScore,u.games,u.coins,u.profile_style AS profileStyle,u.profile_rank AS profileRank,u.beta_tester AS betaTester,u.name_color AS nameColor FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1"
  ).bind(await digest(raw),Date.now()).first();
  if(!u) return null;
  u.betaTester=!!u.betaTester;
  u.owner=isOwnerUser(u,env);
  u.nameColor=u.nameColor||"blanco";
  u.profileRank=u.profileRank||"novato";
  return u;
}

async function consumeNotifications(env,userId){
  const rows=await env.DB.prepare(
    "SELECT id,type,message,created_at AS createdAt FROM notifications WHERE user_id=? AND read_at IS NULL ORDER BY created_at ASC LIMIT 20"
  ).bind(userId).all();
  const notifications=rows.results||[];
  if(notifications.length)
    await env.DB.prepare("UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL").bind(Date.now(),userId).run();
  return notifications;
}

async function requireUser(req,env,admin=false) {
  const u=await currentUser(req,env);
  if(!u || u.status!=="active" || (admin && u.role!=="admin")) return null;
  return u;
}

async function devSession(req,env) {
  const raw=getCookie(req,"f_dev");
  if(!raw) return null;
  const row=await env.DB.prepare(
    "SELECT d.user_id FROM dev_sessions d JOIN users u ON u.id=d.user_id WHERE d.token_hash=? AND d.expires_at>? AND u.role='admin' AND u.status='active' LIMIT 1"
  ).bind(await digest(raw),Date.now()).first();
  return row?.user_id ? row : null;
}

async function log(env,userId,action,targetId,details) {
  try {
    await env.DB.prepare("INSERT INTO audit_logs(user_id,action,target_user_id,details,created_at) VALUES(?,?,?,?,?)")
      .bind(userId,action,targetId||null,JSON.stringify(details||{}),Date.now()).run();
  } catch {}
}

async function api(req,env) {
  await ensureDatabase(env);
  const url=new URL(req.url);
  const path=url.pathname;
  if(!sameOrigin(req)) return json({error:"Origen no permitido"},403);

  if(path==="/api/health" && req.method==="GET") {
    try {
      const rows=await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','sessions','games','dev_sessions','audit_logs','user_styles') ORDER BY name"
      ).all();
      return json({ok:true,tables:(rows.results||[]).map(r=>r.name)});
    } catch(e) {
      console.error("[health]",e);
      return json({ok:false,error:"D1 no disponible."},500);
    }
  }

  if(path==="/api/guest/questions" && req.method==="GET") {
    const difficulty=String(url.searchParams.get("difficulty")||"facil");
    if(!QUESTION_SETS[difficulty])return json({error:"Dificultad inválida."},400);
    const ids=QUESTION_SETS[difficulty];
    return json({difficulty,questions:ids.map(id=>{const q=QUESTIONS[id];return {category:q[0],q:q[1],options:q[2]}})});
  }

  if(path==="/api/me" && req.method==="GET") {
    const me=await currentUser(req,env);
    if(!me) return json({user:null,notifications:[]});
    return json({user:me,notifications:await consumeNotifications(env,me.id)});
  }

  if(path==="/api/profile" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const owned=await env.DB.prepare("SELECT style_id AS styleId FROM user_styles WHERE user_id=?").bind(u.id).all();
    const ownedIds=new Set((owned.results||[]).map(r=>r.styleId));
    const ownedColors=await env.DB.prepare("SELECT color_id AS colorId FROM user_name_colors WHERE user_id=?").bind(u.id).all();
    const ownedColorIds=new Set((ownedColors.results||[]).map(r=>r.colorId));
    const ownedRanks=await env.DB.prepare("SELECT rank_id AS rankId FROM user_ranks WHERE user_id=?").bind(u.id).all();
    const ownedRankIds=new Set((ownedRanks.results||[]).map(r=>r.rankId));
    return json({
      profile:u,
      styles:STYLES.map(s=>({...s,owned:ownedIds.has(s.id)||s.id==="clasico",equipped:u.profileStyle===s.id})),
      nameColors:NAME_COLORS.map(c=>({...c,owned:ownedColorIds.has(c.id)||c.id==="blanco",equipped:!u.owner&&u.nameColor===c.id})),
      ranks:RANKS.map(r=>({...r,owned:ownedRankIds.has(r.id)||r.id==="novato",equipped:u.profileRank===r.id}))
    });
  }

  if(path==="/api/shop" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const owned=await env.DB.prepare("SELECT style_id AS styleId FROM user_styles WHERE user_id=?").bind(u.id).all();
    const ownedIds=new Set((owned.results||[]).map(r=>r.styleId));
    const ownedColors=await env.DB.prepare("SELECT color_id AS colorId FROM user_name_colors WHERE user_id=?").bind(u.id).all();
    const ownedColorIds=new Set((ownedColors.results||[]).map(r=>r.colorId));
    const ownedRanks=await env.DB.prepare("SELECT rank_id AS rankId FROM user_ranks WHERE user_id=?").bind(u.id).all();
    const ownedRankIds=new Set((ownedRanks.results||[]).map(r=>r.rankId));
    return json({
      coins:u.coins,
      equipped:u.profileStyle,
      equippedRank:u.profileRank,
      styles:STYLES.map(s=>({...s,owned:ownedIds.has(s.id)||s.id==="clasico",equipped:u.profileStyle===s.id})),
      nameColors:NAME_COLORS.map(c=>({...c,owned:ownedColorIds.has(c.id)||c.id==="blanco",equipped:!u.owner&&u.nameColor===c.id})),
      ranks:RANKS.map(r=>({...r,owned:ownedRankIds.has(r.id)||r.id==="novato",equipped:u.profileRank===r.id})),
      ownerNameColor:u.owner?OWNER_NAME_COLOR:null
    });
  }

  if(path==="/api/shop/buy" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const styleId=String(x.styleId||"");
    const style=STYLE_BY_ID.get(styleId);
    if(!style) return json({error:"Estilo inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_styles WHERE user_id=? AND style_id=? LIMIT 1").bind(u.id,styleId).first();
    if(own || styleId==="clasico") return json({error:"Ya tienes este estilo."},409);
    if(u.coins<style.price) return json({error:"No tienes suficientes monedas."},400);
    const paid=await env.DB.prepare("UPDATE users SET coins=coins-?,updated_at=? WHERE id=? AND coins>=?").bind(style.price,Date.now(),u.id,style.price).run();
    if(!paid.meta?.changes) return json({error:"No tienes suficientes monedas."},400);
    try {
      await env.DB.prepare("INSERT INTO user_styles(user_id,style_id,purchased_at) VALUES(?,?,?)").bind(u.id,styleId,Date.now()).run();
    } catch(e) {
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(style.price,Date.now(),u.id).run();
      return json({error:"No se pudo guardar la compra."},500);
    }
    await log(env,u.id,"style_buy",u.id,{styleId,price:style.price});
    return json({ok:true,coins:u.coins-style.price,styleId});
  }

  if(path==="/api/shop/equip" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const styleId=String(x.styleId||"");
    if(!STYLE_BY_ID.has(styleId)) return json({error:"Estilo inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_styles WHERE user_id=? AND style_id=? LIMIT 1").bind(u.id,styleId).first();
    if(!own && styleId!=="clasico") return json({error:"Primero debes comprar ese estilo."},403);
    await env.DB.prepare("UPDATE users SET profile_style=?,updated_at=? WHERE id=?").bind(styleId,Date.now(),u.id).run();
    await log(env,u.id,"style_equip",u.id,{styleId});
    return json({ok:true,profileStyle:styleId});
  }

  if(path==="/api/shop/rank/buy" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const rankId=String(x.rankId||"");
    const rank=RANK_BY_ID.get(rankId);
    if(!rank) return json({error:"Rango inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_ranks WHERE user_id=? AND rank_id=? LIMIT 1").bind(u.id,rankId).first();
    if(own || rankId==="novato") return json({error:"Ya tienes este rango."},409);
    if(u.coins<rank.price) return json({error:"No tienes suficientes monedas."},400);
    const paid=await env.DB.prepare("UPDATE users SET coins=coins-?,updated_at=? WHERE id=? AND coins>=?").bind(rank.price,Date.now(),u.id,rank.price).run();
    if(!paid.meta?.changes) return json({error:"No tienes suficientes monedas."},400);
    try{
      await env.DB.prepare("INSERT INTO user_ranks(user_id,rank_id,purchased_at) VALUES(?,?,?)").bind(u.id,rankId,Date.now()).run();
    }catch(e){
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(rank.price,Date.now(),u.id).run();
      return json({error:"No se pudo guardar la compra."},500);
    }
    await log(env,u.id,"rank_buy",u.id,{rankId,price:rank.price,vip:!!rank.vip});
    return json({ok:true,coins:u.coins-rank.price,rankId});
  }

  if(path==="/api/shop/rank/equip" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const rankId=String(x.rankId||"");
    if(!RANK_BY_ID.has(rankId)) return json({error:"Rango inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_ranks WHERE user_id=? AND rank_id=? LIMIT 1").bind(u.id,rankId).first();
    if(!own && rankId!=="novato") return json({error:"Primero debes comprar ese rango."},403);
    await env.DB.prepare("UPDATE users SET profile_rank=?,updated_at=? WHERE id=?").bind(rankId,Date.now(),u.id).run();
    await log(env,u.id,"rank_equip",u.id,{rankId,vip:rankId==="vip"});
    return json({ok:true,profileRank:rankId});
  }

  if(path==="/api/shop/name-color/buy" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    if(u.owner) return json({error:"El color OWNER es exclusivo y no está a la venta."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const colorId=String(x.colorId||"");
    const color=NAME_COLOR_BY_ID.get(colorId);
    if(!color) return json({error:"Color inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_name_colors WHERE user_id=? AND color_id=? LIMIT 1").bind(u.id,colorId).first();
    if(own||colorId==="blanco") return json({error:"Ya tienes este color."},409);
    if(u.coins<color.price) return json({error:"No tienes suficientes monedas."},400);
    const paid=await env.DB.prepare("UPDATE users SET coins=coins-?,updated_at=? WHERE id=? AND coins>=?").bind(color.price,Date.now(),u.id,color.price).run();
    if(!paid.meta?.changes) return json({error:"No tienes suficientes monedas."},400);
    try{
      await env.DB.prepare("INSERT INTO user_name_colors(user_id,color_id,purchased_at) VALUES(?,?,?)").bind(u.id,colorId,Date.now()).run();
    }catch(e){
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(color.price,Date.now(),u.id).run();
      return json({error:"No se pudo guardar la compra."},500);
    }
    await log(env,u.id,"name_color_buy",u.id,{colorId,price:color.price});
    return json({ok:true,coins:u.coins-color.price,colorId});
  }

  if(path==="/api/shop/name-color/equip" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    if(u.owner) return json({error:"El color OWNER es exclusivo del Owner."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const colorId=String(x.colorId||"");
    if(!NAME_COLOR_BY_ID.has(colorId)) return json({error:"Color inexistente."},404);
    const own=await env.DB.prepare("SELECT 1 FROM user_name_colors WHERE user_id=? AND color_id=? LIMIT 1").bind(u.id,colorId).first();
    if(!own&&colorId!=="blanco") return json({error:"Primero debes comprar ese color."},403);
    await env.DB.prepare("UPDATE users SET name_color=?,updated_at=? WHERE id=?").bind(colorId,Date.now(),u.id).run();
    await log(env,u.id,"name_color_equip",u.id,{colorId});
    return json({ok:true,nameColor:colorId});
  }

  if(path==="/api/login" && req.method==="POST") {
    if(!limited(req,"login",8,900000)) return json({error:"Demasiados intentos. Prueba más tarde."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const username=String(x.username||"").trim();
    const password=String(x.password||"");
    const row=await env.DB.prepare("SELECT * FROM users WHERE username=? COLLATE NOCASE LIMIT 1").bind(username).first();
    if(!row) return json({error:"La cuenta no existe."},404);
    if(row.status!=="active") return json({error:"Esta cuenta está bloqueada."},403);
    const pepper=env.PASSWORD_PEPPER||"";
    const candidate=await passwordHash(password,row.salt,pepper,10000);
    if(candidate!==row.password_hash) {
      const legacy=await passwordHash(password,row.salt,pepper,310000);
      if(legacy!==row.password_hash) return json({error:"Usuario o contraseña incorrectos."},401);
      await env.DB.prepare("UPDATE users SET password_hash=?,updated_at=? WHERE id=?")
        .bind(candidate,Date.now(),row.id).run();
    }

    const session=token();
    try {
      await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
        .bind(await digest(session),row.id,Date.now()+604800000).run();
    } catch(e) {
      console.error("[login:session]",e);
      return json({error:"No se pudo iniciar la sesión. Revisa la base de datos."},500);
    }
    const notifications=await consumeNotifications(env,row.id);
    return json({user:{id:row.id,username:row.username,role:row.role,status:row.status,bestScore:row.best_score,games:row.games,coins:row.coins,profileStyle:row.profile_style,profileRank:row.profile_rank||"novato",betaTester:!!row.beta_tester,owner:isOwnerName(row.username,env),nameColor:row.name_color||"blanco"},notifications},200,{"Set-Cookie":cookieHeader(req,"f_session",session,604800)});
  }

  if(path==="/api/logout" && req.method==="POST") {
    const raw=getCookie(req,"f_session");
    if(raw) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(raw)).run();
    return json({ok:true},200,{"Set-Cookie":cookieHeader(req,"f_session","",0)});
  }

  if(path==="/api/daily-gift" && (req.method==="GET" || req.method==="POST")) {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const claimDate=montevideoDate();
    const gift=await env.DB.prepare("SELECT 1 FROM daily_gifts WHERE user_id=? AND claim_date=? LIMIT 1").bind(u.id,claimDate).first();
    if(req.method==="GET"){
      const boost=await getRewardMultiplier(env,u.id);
      return json({claimed:Boolean(gift),coins:u.coins||0,claimDate,multiplier:boost,amount:150*boost});
    }
    if(gift) return json({error:"Ya reclamaste el regalo de hoy.",claimed:true,coins:u.coins||0,claimDate,multiplier:await getRewardMultiplier(env,u.id)},409);
    const inserted=await env.DB.prepare("INSERT OR IGNORE INTO daily_gifts(user_id,claim_date,claimed_at) VALUES(?,?,?)").bind(u.id,claimDate,Date.now()).run();
    if(!inserted.meta?.changes) return json({error:"Ya reclamaste el regalo de hoy.",claimed:true,coins:u.coins||0,claimDate},409);
    try {
      const boost=await getRewardMultiplier(env,u.id);
      const amount=150*boost;
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(amount,Date.now(),u.id).run();
      const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first();
      await log(env,u.id,"daily_gift",u.id,{amount,baseAmount:150,claimDate,weekendMultiplier:boost});
      return json({ok:true,claimed:true,amount,coins:fresh?.coins??((u.coins||0)+amount),claimDate,weekendMultiplier:boost});
    } catch(e) {
      await env.DB.prepare("DELETE FROM daily_gifts WHERE user_id=? AND claim_date=?").bind(u.id,claimDate).run().catch(()=>{});
      return json({error:"No se pudo acreditar el regalo."},500);
    }
  }

  if(path==="/api/owner-chat" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const rows=await env.DB.prepare(
      "SELECT id,sender_user_id AS senderId,sender_username AS sender,message,created_at AS createdAt FROM owner_chat_messages ORDER BY id DESC LIMIT 50"
    ).all();
    return json({messages:(rows.results||[]).reverse()});
  }

  if(path==="/api/owner-chat" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u || !isOwnerUser(u,env)) return json({error:"Solo el OWNER puede escribir en este chat."},403);
    if(!limited(req,"owner-chat",30,60000)) return json({error:"Demasiados mensajes. Esperá un momento."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const message=String(x.message||"").trim();
    if(!message) return json({error:"Escribí un mensaje."},400);
    if(message.length>500) return json({error:"El mensaje no puede superar 500 caracteres."},400);
    const now=Date.now();
    const result=await env.DB.prepare(
      "INSERT INTO owner_chat_messages(sender_user_id,sender_username,message,created_at) VALUES(?,?,?,?)"
    ).bind(u.id,u.username,message,now).run();
    const id=result.meta?.last_row_id;
    await log(env,u.id,"owner_chat_message",null,{message});
    return json({ok:true,message:{id,senderId:u.id,sender:u.username,message,createdAt:now}});
  }

  if(path==="/api/broadcast" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const history=url.searchParams.get("history")==="1";
    if(history){
      const rows=await env.DB.prepare("SELECT id,sender_user_id AS senderId,sender_username AS sender,message,created_at AS createdAt FROM broadcast_messages ORDER BY id DESC LIMIT 50").all();
      return json({messages:(rows.results||[]).reverse()});
    }
    const after=Math.max(0,Number(url.searchParams.get("after")||0));
    const rows=await env.DB.prepare("SELECT id,sender_user_id AS senderId,sender_username AS sender,message,created_at AS createdAt FROM broadcast_messages WHERE id>? ORDER BY id ASC LIMIT 20").bind(Number.isSafeInteger(after)?after:0).all();
    return json({messages:rows.results||[]});
  }

  if(path==="/api/progress" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    await ensureUserStats(env,u.id);
    const s=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(u.id).first();
    const a=await env.DB.prepare("SELECT achievement_id AS achievementId,unlocked_at AS unlockedAt FROM achievements WHERE user_id=? ORDER BY unlocked_at DESC").bind(u.id).all();
    const total=Number(s?.total_answers||0), correct=Number(s?.correct_answers||0);
    return json({stats:{
      xp:Number(s?.xp||0),level:levelFromXp(s?.xp||0),totalAnswers:total,correctAnswers:correct,
      accuracy:total?Math.round(correct/total*100):0,currentStreak:Number(s?.current_streak||0),
      bestStreak:Number(s?.best_streak||0),dailyStreak:Number(s?.daily_streak||0),
      bestDailyStreak:Number(s?.best_daily_streak||0),wins:Number(s?.wins||0),
      weeklyScore:s?.weekly_key===weekKey()?Number(s?.weekly_score||0):0
    },achievements:a.results||[],defs:FEATURE_ACHIEVEMENTS});
  }

  if(path==="/api/ranking/weekly" && req.method==="GET") {
    await ensureFeatureTables(env);
    const wk=weekKey();
    const rows=await env.DB.prepare("SELECT u.id,u.username,u.name_color AS nameColor,u.profile_rank AS profileRank,s.weekly_score AS score,s.wins FROM user_stats s JOIN users u ON u.id=s.user_id WHERE u.status='active' AND s.weekly_key=? ORDER BY s.weekly_score DESC,s.wins DESC,u.id ASC LIMIT 100").bind(wk).all();
    return json({week:wk,ranking:rows.results||[]});
  }

  if(path==="/api/achievements" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const rows=await env.DB.prepare("SELECT achievement_id AS achievementId,unlocked_at AS unlockedAt FROM achievements WHERE user_id=? ORDER BY unlocked_at DESC").bind(u.id).all();
    return json({defs:FEATURE_ACHIEVEMENTS,unlocked:rows.results||[]});
  }

  if(path==="/api/daily-challenge" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    await ensureUserStats(env,u.id);
    const date=montevideoDate();
    const p=await env.DB.prepare("SELECT * FROM daily_progress WHERE user_id=? AND challenge_date=? LIMIT 1").bind(u.id,date).first();
    const ids=p?JSON.parse(p.question_ids||"[]"):dailyQuestionIds(date);
    if(!ids.length) return json({error:"No hay preguntas disponibles."},500);
    if(!p){
      const q=QUESTIONS[ids[0]];
      return json({date,started:false,completed:false,idx:0,score:0,total:ids.length,question:{id:ids[0],category:q[0],q:q[1],options:q[2]}});
    }
    const idx=Math.min(Number(p.idx||0),ids.length), q=idx<ids.length?QUESTIONS[ids[idx]]:null;
    return json({date,started:true,completed:!!p.completed,idx,score:Number(p.score||0),total:ids.length,question:q?{id:ids[idx],category:q[0],q:q[1],options:q[2]}:null});
  }

  if(path==="/api/daily-challenge/start" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const date=montevideoDate(),ids=dailyQuestionIds(date),now=Date.now();
    if(!ids.length) return json({error:"No hay preguntas disponibles."},500);
    await env.DB.prepare("INSERT OR IGNORE INTO daily_progress(user_id,challenge_date,idx,score,question_ids,completed,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").bind(u.id,date,0,0,JSON.stringify(ids),0,now,now).run();
    const q=QUESTIONS[ids[0]];
    return json({date,started:true,completed:false,idx:0,score:0,total:ids.length,question:{id:ids[0],category:q[0],q:q[1],options:q[2]}});
  }

  if(path==="/api/daily-challenge/answer" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    await ensureUserStats(env,u.id);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const date=montevideoDate();
    const p=await env.DB.prepare("SELECT * FROM daily_progress WHERE user_id=? AND challenge_date=? LIMIT 1").bind(u.id,date).first();
    if(!p)return json({error:"Primero iniciá el desafío diario."},400);
    if(Number(p.completed))return json({error:"Ya completaste el desafío de hoy.",completed:true,score:Number(p.score||0)},409);
    const ids=JSON.parse(p.question_ids||"[]"),idx=Number(p.idx||0),q=QUESTIONS[ids[idx]],choice=Number(x.choice);
    if(!q||!Number.isInteger(choice)||choice<0||choice>=q[2].length)return json({error:"Respuesta inválida."},400);
    const correct=choice===q[3],boost=await getRewardMultiplier(env,u.id),points=correct?Math.round(100*boost):0,next=idx+1,score=Number(p.score||0)+points,now=Date.now();
    let claimed=false;
    if(next>=ids.length){
      const upd=await env.DB.prepare("UPDATE daily_progress SET idx=?,score=?,completed=1,updated_at=? WHERE user_id=? AND challenge_date=? AND idx=? AND completed=0").bind(next,score,now,u.id,date,idx).run();
      claimed=!!upd.meta?.changes;
    }else{
      const upd=await env.DB.prepare("UPDATE daily_progress SET idx=?,score=?,updated_at=? WHERE user_id=? AND challenge_date=? AND idx=? AND completed=0").bind(next,score,now,u.id,date,idx).run();
      claimed=!!upd.meta?.changes;
    }
    if(!claimed)return json({error:"Esta respuesta ya fue procesada.",alreadyAnswered:true},409);
    if(next>=ids.length){
      const s=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(u.id).first();
      const yesterday=new Date(Date.parse(date+"T00:00:00Z")-86400000).toISOString().slice(0,10);
      const dailyStreak=s?.daily_last_date===yesterday?Number(s.daily_streak||0)+1:1;
      const bestDaily=Math.max(Number(s?.best_daily_streak||0),dailyStreak),wk=weekKey(),boost=await getRewardMultiplier(env,u.id),xp=Number(s?.xp||0)+(correct?50:10)*boost;
      await env.DB.prepare("UPDATE user_stats SET xp=?,daily_streak=?,best_daily_streak=?,daily_last_date=?,weekly_score=?,weekly_key=?,updated_at=? WHERE user_id=?")
        .bind(xp,dailyStreak,bestDaily,date,s?.weekly_key===wk?Number(s?.weekly_score||0):0,wk,now,u.id).run();
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(100*boost,now,u.id).run();
      const after=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(u.id).first();
      await maybeUnlockAchievements(env,u.id,after);
      const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first();
      return json({correct,points,score,done:true,coins:fresh?.coins??0,dailyStreak,bestDailyStreak:bestDaily,level:levelFromXp(xp),weekendMultiplier:boost});
    }
    const nq=QUESTIONS[ids[next]];
    if(!nq)return json({error:"Pregunta siguiente inválida."},500);
    return json({correct,points,score,done:false,question:{id:ids[next],category:nq[0],q:nq[1],options:nq[2]}});
  }
  if(path==="/api/live/start" && req.method==="POST") {
    const admin=await requireUser(req,env);
    if(!admin||!isOwnerUser(admin,env))return json({error:"Solo el OWNER puede iniciar una pregunta en vivo."},403);
    await ensureFeatureTables(env);
    const pool=QUESTION_SETS.dificil||[];
    if(!pool.length)return json({error:"No hay preguntas normales disponibles."},500);
    const qid=pool[Math.floor(Math.random()*pool.length)],q=QUESTIONS[qid],now=Date.now(),ends=now+20000;
    await env.DB.prepare("UPDATE live_questions SET active=0 WHERE active=1").run();
    const result=await env.DB.prepare("INSERT INTO live_questions(question_id,category,question_text,options_json,correct_index,active,starts_at,ends_at) VALUES(?,?,?,?,?,?,?,?)")
      .bind(qid,q[0],q[1],JSON.stringify(q[2]),q[3],1,now,ends).run();
    await log(env,admin.id,"live_question_start",null,{liveId:result.meta?.last_row_id,questionId:qid});
    return json({ok:true,liveId:result.meta?.last_row_id,endsAt:ends});
  }

  if(path==="/api/live" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const live=await env.DB.prepare("SELECT * FROM live_questions WHERE active=1 ORDER BY id DESC LIMIT 1").first();
    if(!live||Number(live.ends_at)<=Date.now())return json({active:false});
    const answered=await env.DB.prepare("SELECT choice,correct FROM live_answers WHERE live_id=? AND user_id=? LIMIT 1").bind(live.id,u.id).first();
    const counts=await env.DB.prepare("SELECT COUNT(*) total,COALESCE(SUM(correct),0) correct FROM live_answers WHERE live_id=?").bind(live.id).first();
    return json({active:true,id:live.id,category:live.category,q:live.question_text,options:JSON.parse(live.options_json),endsAt:Number(live.ends_at),answered:!!answered,correct:answered?!!answered.correct:null,answers:Number(counts?.total||0),correctAnswers:Number(counts?.correct||0)});
  }

  if(path==="/api/event" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const event=await getActiveSpecialEvent(env);
    if(!event)return json({active:false});
    const answer=await env.DB.prepare("SELECT correct FROM event_answers WHERE event_id=? AND user_id=? LIMIT 1").bind(String(event.id),u.id).first();
    return json({
      active:true,
      id:String(event.id),
      multiplier:Number(event.multiplier||5),
      startedAt:Number(event.startedAt||0),
      endsAt:Number(event.activeUntil),
      title:"EVENTO x5",
      question:{category:event.category,q:event.question,options:event.options},
      answered:!!answer,
      correct:answer?!!answer.correct:null,
      points:100000
    });
  }

  if(path==="/api/event/answer" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const event=await getActiveSpecialEvent(env);
    if(!event)return json({error:"El evento terminó.",active:false},409);
    const old=await env.DB.prepare("SELECT 1 FROM event_answers WHERE event_id=? AND user_id=? LIMIT 1").bind(String(event.id),u.id).first();
    if(old)return json({error:"Ya respondiste la pregunta de este evento.",answered:true},409);
    const choice=Number(x.choice),options=Array.isArray(event.options)?event.options:[];
    if(!Number.isInteger(choice)||choice<0||choice>=options.length)return json({error:"Respuesta inválida."},400);
    const correct=choice===Number(event.correctIndex),now=Date.now();
    const inserted=await env.DB.prepare("INSERT OR IGNORE INTO event_answers(event_id,user_id,choice,correct,answered_at) VALUES(?,?,?,?,?)")
      .bind(String(event.id),u.id,choice,correct?1:0,now).run();
    if(!inserted.meta?.changes)return json({error:"Ya respondiste la pregunta de este evento.",answered:true},409);
    if(correct){
      const scoreGain=100000;
      await env.DB.prepare("UPDATE users SET best_score=best_score+?,updated_at=? WHERE id=?").bind(scoreGain,now,u.id).run();
      await ensureUserStats(env,u.id);
      const row=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=? LIMIT 1").bind(u.id).first();
      const wk=weekKey();
      const streak=Number(row?.current_streak||0)+1,best=Math.max(Number(row?.best_streak||0),streak);
      const weekly=(row?.weekly_key===wk?Number(row?.weekly_score||0):0)+scoreGain;
      await env.DB.prepare("UPDATE user_stats SET total_answers=total_answers+1,correct_answers=correct_answers+1,current_streak=?,best_streak=?,weekly_score=?,weekly_key=?,updated_at=? WHERE user_id=?")
        .bind(streak,best,weekly,wk,now,u.id).run();
      const after=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=? LIMIT 1").bind(u.id).first();
      await maybeUnlockAchievements(env,u.id,after);
      return json({ok:true,correct:true,points:scoreGain,scoreGain,coins:(await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first())?.coins??u.coins});
    }
    await ensureUserStats(env,u.id);
    await env.DB.prepare("UPDATE user_stats SET total_answers=total_answers+1,current_streak=0,updated_at=? WHERE user_id=?").bind(now,u.id).run();
    return json({ok:true,correct:false,points:0,scoreGain:0,coins:u.coins});
  }

  if(path==="/api/live/answer" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env); await ensureUserStats(env,u.id);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const live=await env.DB.prepare("SELECT * FROM live_questions WHERE id=? AND active=1 LIMIT 1").bind(Number(x.liveId)).first();
    if(!live||Number(live.ends_at)<=Date.now())return json({error:"La pregunta en vivo terminó.",active:false},409);
    const old=await env.DB.prepare("SELECT 1 FROM live_answers WHERE live_id=? AND user_id=? LIMIT 1").bind(live.id,u.id).first();
    if(old)return json({error:"Ya respondiste esta pregunta.",answered:true},409);
    const choice=Number(x.choice),opts=JSON.parse(live.options_json||"[]");
    if(!Number.isInteger(choice)||choice<0||choice>=opts.length)return json({error:"Respuesta inválida."},400);
    const correct=choice===Number(live.correct_index),now=Date.now();
    await env.DB.prepare("INSERT INTO live_answers(live_id,user_id,choice,correct,answered_at) VALUES(?,?,?,?,?)").bind(live.id,u.id,choice,correct?1:0,now).run();
    const boost=await getRewardMultiplier(env,u.id);
if(correct)await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(25*boost,now,u.id).run();
    await updateAnswerStats(env,u.id,correct,correct?25:0);
    const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first();
    return json({ok:true,correct,reward:correct?25*boost:0,coins:fresh?.coins??u.coins,weekendMultiplier:boost});
  }

  if(path.startsWith("/api/friends")) {
    const u=await requireUser(req,env);
    if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    if(path==="/api/friends/search"&&req.method==="GET"){
      const q=String(url.searchParams.get("q")||"").trim();
      if(q.length<2)return json({users:[]});
      const rows=await env.DB.prepare("SELECT id,username,best_score AS bestScore,games FROM users WHERE status='active' AND id<>? AND username LIKE ? COLLATE NOCASE ORDER BY username COLLATE NOCASE LIMIT 20").bind(u.id,"%"+q+"%").all();
      return json({users:rows.results||[]});
    }
    if(path==="/api/friends"&&req.method==="GET"){
      const rows=await env.DB.prepare("SELECT f.user_id,f.friend_id,f.status,f.created_at AS createdAt,u.username FROM friends f JOIN users u ON u.id=CASE WHEN f.user_id=? THEN f.friend_id ELSE f.user_id END WHERE f.user_id=? OR f.friend_id=? ORDER BY f.updated_at DESC LIMIT 100").bind(u.id,u.id,u.id).all();
      return json({
        incoming:(rows.results||[]).filter(r=>r.status==="pending"&&Number(r.friend_id)===u.id),
        outgoing:(rows.results||[]).filter(r=>r.status==="pending"&&Number(r.user_id)===u.id),
        accepted:(rows.results||[]).filter(r=>r.status==="accepted")
      });
    }
    if(path==="/api/friends/request"&&req.method==="POST"){
      let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const targetId=Number(x.userId);
      if(!Number.isInteger(targetId)||targetId===u.id)return json({error:"Usuario inválido."},400);
      const target=await env.DB.prepare("SELECT id,username FROM users WHERE id=? AND status='active'").bind(targetId).first();
      if(!target)return json({error:"Cuenta no encontrada."},404);
      const rev=await env.DB.prepare("SELECT * FROM friends WHERE user_id=? AND friend_id=? LIMIT 1").bind(targetId,u.id).first();
      if(rev?.status==="accepted")return json({error:"Ya son amigos."},409);
      if(rev?.status==="pending"){
        await env.DB.prepare("UPDATE friends SET status='accepted',updated_at=? WHERE user_id=? AND friend_id=?").bind(Date.now(),targetId,u.id).run();
        await env.DB.prepare("INSERT OR REPLACE INTO friends(user_id,friend_id,status,created_at,updated_at) VALUES(?,?,?,?,?)").bind(u.id,targetId,"accepted",rev.created_at,Date.now()).run();
        return json({ok:true,accepted:true});
      }
      const cur=await env.DB.prepare("SELECT status FROM friends WHERE user_id=? AND friend_id=? LIMIT 1").bind(u.id,targetId).first();
      if(cur?.status==="pending")return json({error:"Solicitud ya enviada."},409);
      await env.DB.prepare("INSERT INTO friends(user_id,friend_id,status,created_at,updated_at) VALUES(?,?,?,?,?)").bind(u.id,targetId,"pending",Date.now(),Date.now()).run();
      await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(targetId,"friend_request",u.username+" te envió una solicitud de amistad.",Date.now()).run().catch(()=>{});
      return json({ok:true});
    }
    if(path==="/api/friends/accept"&&req.method==="POST"){
      let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const from=Number(x.userId);
      const row=await env.DB.prepare("SELECT * FROM friends WHERE user_id=? AND friend_id=? AND status='pending' LIMIT 1").bind(from,u.id).first();
      if(!row)return json({error:"Solicitud no encontrada."},404);
      await env.DB.prepare("UPDATE friends SET status='accepted',updated_at=? WHERE user_id=? AND friend_id=?").bind(Date.now(),from,u.id).run();
      await env.DB.prepare("INSERT OR REPLACE INTO friends(user_id,friend_id,status,created_at,updated_at) VALUES(?,?,?,?,?)").bind(u.id,from,"accepted",row.created_at,Date.now()).run();
      await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(from,"friend_accept",u.username+" aceptó tu solicitud de amistad.",Date.now()).run().catch(()=>{});
      return json({ok:true});
    }
    return json({error:"No encontrado"},404);
  }

  if(path==="/api/duels"&&req.method==="GET"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const rows=await env.DB.prepare("SELECT d.id,d.status,d.created_at AS createdAt,d.expires_at AS expiresAt,d.challenger_id,d.opponent_id,d.challenger_score,d.opponent_score,cu.username challenger,ou.username opponent FROM duels d JOIN users cu ON cu.id=d.challenger_id JOIN users ou ON ou.id=d.opponent_id WHERE (d.challenger_id=? OR d.opponent_id=?) AND d.expires_at>? ORDER BY d.created_at DESC LIMIT 30").bind(u.id,u.id,Date.now()).all();
    return json({duels:rows.results||[]});
  }

  if(path==="/api/duel/challenge"&&req.method==="POST"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const targetId=Number(x.userId),target=await env.DB.prepare("SELECT id,username FROM users WHERE id=? AND status='active'").bind(targetId).first();
    if(!target||target.id===u.id)return json({error:"Usuario inválido."},400);
    const existing=await env.DB.prepare("SELECT id FROM duels WHERE status IN ('pending','active') AND ((challenger_id=? AND opponent_id=?) OR (challenger_id=? AND opponent_id=?)) AND expires_at>? LIMIT 1").bind(u.id,targetId,targetId,u.id,Date.now()).first();
    if(existing)return json({error:"Ya hay un duelo pendiente o activo contra ese jugador."},409);
    const pool=QUESTION_SETS.dificil||[],ids=[],used=new Set();let seed=(Date.now()^u.id^targetId)>>>0;
    while(ids.length<10&&ids.length<pool.length){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const id=pool[seed%pool.length];if(!used.has(id)){used.add(id);ids.push(id)}}
    const id=token(),now=Date.now();
    await env.DB.prepare("INSERT INTO duels(id,challenger_id,opponent_id,status,question_ids,created_at,expires_at) VALUES(?,?,?,?,?,?,?)").bind(id,u.id,targetId,"pending",JSON.stringify(ids),now,now+86400000).run();
    await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(targetId,"duel_challenge",u.username+" te desafió a un duelo 1v1.",now).run().catch(()=>{});
    return json({ok:true,duelId:id});
  }

  if(path==="/api/duel/accept"&&req.method==="POST"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const d=await env.DB.prepare("SELECT id FROM duels WHERE id=? AND opponent_id=? AND status='pending' AND expires_at>? LIMIT 1").bind(String(x.duelId),u.id,Date.now()).first();
    if(!d)return json({error:"Duelo no encontrado o vencido."},404);
    await env.DB.prepare("UPDATE duels SET status='active' WHERE id=? AND status='pending'").bind(d.id).run();
    return json({ok:true});
  }

  if(path==="/api/duel/decline"&&req.method==="POST"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    await env.DB.prepare("UPDATE duels SET status='declined' WHERE id=? AND opponent_id=? AND status='pending'").bind(String(x.duelId),u.id).run();
    return json({ok:true});
  }

  const duelMatch=path.match(/^\/api\/duel\/([^/]+)$/);
  if(duelMatch&&req.method==="GET"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);
    const d=await env.DB.prepare("SELECT d.*,cu.username challenger,ou.username opponent FROM duels d JOIN users cu ON cu.id=d.challenger_id JOIN users ou ON ou.id=d.opponent_id WHERE d.id=? AND (d.challenger_id=? OR d.opponent_id=?) LIMIT 1").bind(duelMatch[1],u.id,u.id).first();
    if(!d)return json({error:"Duelo no encontrado."},404);
    const ids=JSON.parse(d.question_ids||"[]"),isCh=Number(d.challenger_id)===u.id,idx=isCh?Number(d.challenger_idx):Number(d.opponent_idx),q=(d.status==="active"&&idx<ids.length)?QUESTIONS[ids[idx]]:null;
    return json({id:d.id,status:d.status,challenger:d.challenger,opponent:d.opponent,challengerScore:Number(d.challenger_score||0),opponentScore:Number(d.opponent_score||0),idx,total:ids.length,question:q?{id:ids[idx],category:q[0],q:q[1],options:q[2]}:null});
  }

  const duelAnswer=path.match(/^\/api\/duel\/([^/]+)\/answer$/);
  if(duelAnswer&&req.method==="POST"){
    const u=await requireUser(req,env);if(!u)return json({error:"Inicia sesión."},403);
    await ensureFeatureTables(env);await ensureUserStats(env,u.id);
    let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const d=await env.DB.prepare("SELECT * FROM duels WHERE id=? AND status='active' AND expires_at>? AND (challenger_id=? OR opponent_id=?) LIMIT 1").bind(duelAnswer[1],Date.now(),u.id,u.id).first();
    if(!d)return json({error:"Duelo no disponible."},404);
    const isCh=Number(d.challenger_id)===u.id,idx=isCh?Number(d.challenger_idx):Number(d.opponent_idx),ids=JSON.parse(d.question_ids||"[]"),q=QUESTIONS[ids[idx]],choice=Number(x.choice);
    if(!q||!Number.isInteger(choice)||choice<0||choice>=q[2].length)return json({error:"Respuesta inválida."},400);
    const correct=choice===q[3],boost=await getRewardMultiplier(env,u.id),scoreGain=correct?Math.round(100*boost):0,next=idx+1,now=Date.now();
     let claimed=false;
     if(isCh){
       const upd=await env.DB.prepare("UPDATE duels SET challenger_idx=?,challenger_score=challenger_score+? WHERE id=? AND status='active' AND challenger_idx=?").bind(next,scoreGain,d.id,idx).run();
       claimed=!!upd.meta?.changes;
     }else{
       const upd=await env.DB.prepare("UPDATE duels SET opponent_idx=?,opponent_score=opponent_score+? WHERE id=? AND status='active' AND opponent_idx=?").bind(next,scoreGain,d.id,idx).run();
       claimed=!!upd.meta?.changes;
     }
     if(!claimed)return json({error:"Esta respuesta ya fue procesada.",alreadyAnswered:true},409);
     await updateAnswerStats(env,u.id,correct,correct?100:0);
     const fresh=await env.DB.prepare("SELECT * FROM duels WHERE id=?").bind(d.id).first();
     if(Number(fresh.challenger_idx)>=ids.length&&Number(fresh.opponent_idx)>=ids.length){
       const complete=await env.DB.prepare("UPDATE duels SET status='completed' WHERE id=? AND status='active'").bind(d.id).run();
       if(complete.meta?.changes){
         let winner=0;
         if(Number(fresh.challenger_score)>Number(fresh.opponent_score))winner=Number(fresh.challenger_id);
         else if(Number(fresh.opponent_score)>Number(fresh.challenger_score))winner=Number(fresh.opponent_id);
         if(winner){
           const boost=await getRewardMultiplier(env,winner);
           await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(100*boost,now,winner).run();
           await env.DB.prepare("UPDATE user_stats SET wins=wins+1,updated_at=? WHERE user_id=?").bind(now,winner).run();
           const s=await env.DB.prepare("SELECT * FROM user_stats WHERE user_id=?").bind(winner).first();
           await maybeUnlockAchievements(env,winner,s);
           const loser=winner===Number(fresh.challenger_id)?Number(fresh.opponent_id):Number(fresh.challenger_id);
           await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(loser,"duel_result","⚔️ El duelo terminó. Ganó "+(winner===Number(fresh.challenger_id)?fresh.challenger:fresh.opponent)+".",now).run().catch(()=>{});
           await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)").bind(winner,"duel_result","🏆 Ganaste el duelo y recibiste "+(100*boost)+" monedas.",now).run().catch(()=>{});
         }
         return json({correct,done:true,challengerScore:fresh.challenger_score,opponentScore:fresh.opponent_score,winner});
       }
       const after=await env.DB.prepare("SELECT * FROM duels WHERE id=?").bind(d.id).first();
       const winner=Number(after?.challenger_score||0)>Number(after?.opponent_score||0)?Number(after.challenger_id):Number(after?.opponent_score||0)>Number(after?.challenger_score||0)?Number(after.opponent_id):0;
       return json({correct,done:true,challengerScore:after?.challenger_score||0,opponentScore:after?.opponent_score||0,winner});
     }
     return json({correct,done:false,idx:next});
  }
  if(path==="/api/ranking" && req.method==="GET") {
    const rows=await env.DB.prepare("SELECT username,best_score AS score,games,profile_style AS profileStyle,profile_rank AS profileRank,beta_tester AS betaTester,name_color AS nameColor FROM users WHERE status='active' AND games>0 ORDER BY best_score DESC, games DESC, id ASC LIMIT 100").all();
    const ranking=(rows.results||[]).map(r=>({...r,betaTester:!!r.betaTester,owner:isOwnerName(r.username,env)}));
    return json({ranking});
  }

  if(path==="/api/game" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const difficulty=String(x.difficulty||"facil");
    if(!QUESTION_SETS[difficulty] || !DIFFICULTY_META[difficulty]) return json({error:"Dificultad inválida."},400);
    const pool=QUESTION_SETS[difficulty];
    const questionCount=difficulty==="blassvec"?30:10;
    const picked=[];
    const used=new Set();
    while(picked.length<questionCount && picked.length<pool.length){
      const candidate=pool[Math.floor(Math.random()*pool.length)];
      if(!used.has(candidate)){used.add(candidate);picked.push(candidate);}
    }
    const gameId=token();
    await env.DB.prepare(
      "INSERT INTO games(id,user_id,idx,score,difficulty,question_ids,started_at) VALUES(?,?,?,?,?,?,?)"
    ).bind(gameId,u.id,0,0,difficulty,JSON.stringify(picked),Date.now()).run();
    const q=QUESTIONS[picked[0]];
    return json({gameId,difficulty,total:picked.length,question:{id:picked[0],category:q[0],q:q[1],options:q[2]}});
  }

  if(path==="/api/answer" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const game=await env.DB.prepare("SELECT * FROM games WHERE id=? AND user_id=? LIMIT 1").bind(String(x.gameId),u.id).first();
    if(!game) return json({error:"Partida inválida."},400);
    const ids=JSON.parse(game.question_ids||"[]");
    if(!Array.isArray(ids) || ids.length<1) return json({error:"Partida antigua o corrupta."},400);
    if(!DIFFICULTY_META[game.difficulty]) return json({error:"Dificultad inválida."},400);
    if(game.idx<0 || game.idx>=ids.length) return json({error:"Partida corrupta."},400);

    const q=QUESTIONS[ids[game.idx]];
    if(!q) return json({error:"Pregunta inválida."},400);
    const choice=Number(x.choice);
    if(!Number.isInteger(choice) || choice<0 || choice>=q[2].length) return json({error:"Respuesta inválida."},400);

    const correct=choice===q[3];
    const meta=DIFFICULTY_META[game.difficulty];
    const rewardMultiplier=await getRewardMultiplier(env,u.id);
    const points=correct?Math.round(meta.points*rewardMultiplier):0;
    const coinGain=correct?meta.coins:0;
    const score=game.score+points;
    const next=game.idx+1;
    const now=Date.now();
    let claimed=false;
    if(next>=ids.length){
      const del=await env.DB.prepare("DELETE FROM games WHERE id=? AND user_id=? AND idx=?").bind(game.id,u.id,game.idx).run();
      claimed=!!del.meta?.changes;
    }else{
      const upd=await env.DB.prepare("UPDATE games SET idx=?,score=? WHERE id=? AND user_id=? AND idx=?").bind(next,score,game.id,u.id,game.idx).run();
      claimed=!!upd.meta?.changes;
    }
    if(!claimed)return json({error:"Esta respuesta ya fue procesada.",alreadyAnswered:true},409);
    await updateAnswerStats(env,u.id,correct,meta.points);
    if(correct){
      const bonus=next>=ids.length?50:0;
      const awardedCoins=(coinGain+bonus)*rewardMultiplier;
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(awardedCoins,now,u.id).run();
    }
    const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first();
    const totalCoins=fresh?.coins??u.coins;
    if(next>=ids.length){
      await env.DB.prepare("UPDATE users SET games=games+1,best_score=MAX(best_score,?),updated_at=? WHERE id=?").bind(score,now,u.id).run();
      return json({correct,points,score,done:true,coins:totalCoins,difficulty:game.difficulty});
    }
    const nextQ=QUESTIONS[ids[next]];
    if(!nextQ)return json({error:"Pregunta siguiente inválida."},500);
    return json({correct,points,score,done:false,coins:totalCoins,difficulty:game.difficulty,question:{id:ids[next],category:nextQ[0],q:nextQ[1],options:nextQ[2]}});
  }
  if(path==="/api/game/abandon" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const result=await env.DB.prepare("DELETE FROM games WHERE id=? AND user_id=?").bind(String(x.gameId||""),u.id).run();
    return json({ok:true,removed:Boolean(result.meta?.changes)});
  }

  if(path==="/api/dev/open" && req.method==="POST") {
    const admin=await requireUser(req,env,true);
    if(!admin) return json({error:"Solo un administrador puede usar la consola."},403);
    if(!limited(req,"dev",5,900000)) return json({error:"Demasiados intentos."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    if(!env.DEV_PANEL_CODE || String(x.code||"")!==String(env.DEV_PANEL_CODE)) return json({error:"Código incorrecto."},403);
    const dev=token();
    await env.DB.prepare("INSERT INTO dev_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
      .bind(await digest(dev),admin.id,Date.now()+3600000).run();
    await log(env,admin.id,"dev_login",admin.id,{});
    return json({ok:true},200,{"Set-Cookie":cookieHeader(req,"f_dev",dev,3600)});
  }

  if(path==="/api/event/start" && req.method==="POST") {
    const admin=await requireUser(req,env);
    if(!admin||!isOwnerUser(admin,env))return json({error:"Solo el OWNER puede activar el evento."},403);
    await ensureFeatureTables(env);
    const pool=QUESTION_SETS.imposible||[];
    if(!pool.length)return json({error:"No hay preguntas imposibles disponibles."},500);
    const qid=pool[Math.floor(Math.random()*pool.length)],q=QUESTIONS[qid];
    const now=Date.now(),activeUntil=now+3600000;
    const event={
      id:String(now)+"-"+token().slice(0,10),
      multiplier:5,
      startedAt:now,
      activeUntil,
      questionId:qid,
      category:q[0],
      question:q[1],
      options:q[2],
      correctIndex:q[3]
    };
    await env.DB.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('special_event',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at")
      .bind(JSON.stringify(event),now).run();
    rewardMultiplierCache={value:5,expiresAt:now+10000,override:null};
    await env.DB.prepare("INSERT INTO broadcast_messages(sender_user_id,sender_username,message,created_at) VALUES(?,?,?,?)")
      .bind(admin.id,admin.username,"🚨 EVENTO x5 ACTIVADO · Todas las recompensas están x5 durante 1 hora. Hay una pregunta especial de 100.000 puntos.",now).run();
    await log(env,admin.id,"special_event_start",null,{eventId:event.id,questionId:qid,endsAt:activeUntil});
    return json({ok:true,event});
  }

  if(path.startsWith("/api/dev/")) {
    const admin=await requireUser(req,env,true);
    const ds=await devSession(req,env);
    if(!admin || !ds) return json({error:"Sesión de desarrollador no autorizada."},403);


    if(path==="/api/dev/reward-multiplier" && (req.method==="GET" || req.method==="POST")) {
      const admin=await requireUser(req,env,true);
      const ds=await devSession(req,env);
      if(!admin||!ds||!isOwnerUser(admin,env))return json({error:"Solo el OWNER puede cambiar el multiplicador."},403);
      await ensureFeatureTables(env);
      if(req.method==="GET"){
        const row=await env.DB.prepare("SELECT value,updated_at AS updatedAt FROM app_settings WHERE key='reward_multiplier' LIMIT 1").first();
        const value=row?Number(row.value):null;
        return json({override:Number.isFinite(value)?value:null,automatic:weekendMultiplier(),effective:row?value:weekendMultiplier()});
      }
      let x;try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const raw=x.multiplier;
      if(raw===null||raw===undefined||String(raw).trim()===""){
        await env.DB.prepare("DELETE FROM app_settings WHERE key='reward_multiplier'").run();
        rewardMultiplierCache={value:weekendMultiplier(),expiresAt:Date.now()+10000,override:null};
        await log(env,admin.id,"reward_multiplier_reset",null,{automatic:weekendMultiplier()});
        return json({ok:true,override:null,effective:await getRewardMultiplier(env)});
      }
      const multiplier=Number(raw);
      if(!Number.isFinite(multiplier)||multiplier<0||multiplier>100)return json({error:"El multiplicador debe estar entre x0 y x100."},400);
      await env.DB.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('reward_multiplier',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(String(multiplier),Date.now()).run();
      rewardMultiplierCache={value:multiplier,expiresAt:Date.now()+10000,override:multiplier};
      await log(env,admin.id,"reward_multiplier_set",null,{multiplier});
      return json({ok:true,override:multiplier,effective:multiplier});
    }

    if(path==="/api/dev/broadcast" && req.method==="POST") {
      const admin=await requireUser(req,env,true);
      const ds=await devSession(req,env);
      if(!admin || !ds) return json({error:"Sesión de desarrollador no autorizada."},403);
      if(!isOwnerUser(admin,env)) return json({error:"Solo el OWNER puede escribir en el chat."},403);
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const message=String(x.message||"").trim();
      if(!message) return json({error:"Escribe un mensaje."},400);
      if(message.length>500) return json({error:"El mensaje no puede superar 500 caracteres."},400);
      const now=Date.now();
      const result=await env.DB.prepare("INSERT INTO broadcast_messages(sender_user_id,sender_username,message,created_at) VALUES(?,?,?,?)").bind(admin.id,admin.username,message,now).run();
      const id=result.meta?.last_row_id;
      await log(env,admin.id,"global_broadcast",null,{message});
      return json({ok:true,message:{id,sender:admin.username,message,createdAt:now}});
    }

    if(path==="/api/dev/users" && req.method==="GET") {
      const rows=await env.DB.prepare("SELECT id,username,role,status,best_score AS bestScore,games,coins,profile_style AS profileStyle,beta_tester AS betaTester,name_color AS nameColor,created_at AS createdAt FROM users ORDER BY id DESC").all();
      const users=(rows.results||[]).map(r=>({...r,betaTester:!!r.betaTester,owner:isOwnerName(r.username,env)}));
      return json({users,viewerOwner:isOwnerUser(admin,env)});
    }

    if(path==="/api/dev/stats" && req.method==="GET") {
      const [u,g,s]=await Promise.all([
        env.DB.prepare("SELECT COUNT(*) c FROM users").first(),
        env.DB.prepare("SELECT COUNT(*) c FROM games").first(),
        env.DB.prepare("SELECT COUNT(*) c FROM sessions WHERE expires_at>?").bind(Date.now()).first()
      ]);
      return json({users:u?.c||0,activeGames:g?.c||0,activeSessions:s?.c||0});
    }

    const coinMatch=path.match(/^\/api\/dev\/users\/(\d+)\/coins$/);
    if(coinMatch && req.method==="POST") {
      if(!isOwnerUser(admin,env)) return json({error:"Solo el Owner puede modificar monedas."},403);
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const delta=Number(x.delta);
      if(!Number.isSafeInteger(delta)||Math.abs(delta)>1000000000) return json({error:"Cantidad de monedas inválida."},400);
      const id=Number(coinMatch[1]);
      const target=await env.DB.prepare("SELECT id,username,coins FROM users WHERE id=?").bind(id).first();
      if(!target) return json({error:"Cuenta no encontrada."},404);
      await env.DB.prepare("UPDATE users SET coins=MAX(0,coins+?),updated_at=? WHERE id=?").bind(delta,Date.now(),id).run();
      await log(env,admin.id,"coins_delta",id,{delta});
      const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(id).first();
      return json({ok:true,coins:fresh?.coins??0});
    }

    const betaMatch=path.match(/^\/api\/dev\/users\/(\d+)\/beta-tester$/);
    if(betaMatch && req.method==="POST") {
      if(!isOwnerUser(admin,env)) return json({error:"Solo el Owner puede asignar BETA TESTER."},403);
      const id=Number(betaMatch[1]);
      if(id===admin.id) return json({error:"El Owner no necesita BETA TESTER."},400);
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const enabled=x.enabled===true;
      const target=await env.DB.prepare("SELECT id,username,beta_tester FROM users WHERE id=?").bind(id).first();
      if(!target) return json({error:"Cuenta no encontrada."},404);
      if(enabled===!!target.beta_tester) return json({ok:true,betaTester:!!target.beta_tester,coins:null});
      if(enabled){
        await env.DB.prepare("UPDATE users SET beta_tester=1,coins=coins+10000,updated_at=? WHERE id=?").bind(Date.now(),id).run();
        await log(env,admin.id,"beta_tester_grant",id,{bonusCoins:10000});
      }else{
        await env.DB.prepare("UPDATE users SET beta_tester=0,updated_at=? WHERE id=?").bind(Date.now(),id).run();
        await log(env,admin.id,"beta_tester_revoke",id,{});
      }
      const fresh=await env.DB.prepare("SELECT beta_tester AS betaTester,coins FROM users WHERE id=?").bind(id).first();
      return json({ok:true,betaTester:!!fresh?.betaTester,coins:fresh?.coins??0,bonusCoins:enabled?10000:0});
    }

    const passwordMatch=path.match(/^\/api\/dev\/users\/(\d+)\/password$/);
    if(passwordMatch && req.method==="POST") {
      if(!isOwnerUser(admin,env)) return json({error:"Solo el Owner puede cambiar contraseñas."},403);
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const password=String(x.password||"");
      if(password.length<8||password.length>128) return json({error:"La contraseña debe tener entre 8 y 128 caracteres."},400);
      const id=Number(passwordMatch[1]);
      const target=await env.DB.prepare("SELECT id,username FROM users WHERE id=?").bind(id).first();
      if(!target) return json({error:"Cuenta no encontrada."},404);
      const salt=randomSalt();
      const hash=await passwordHash(password,salt,env.PASSWORD_PEPPER||"",10000);
      await env.DB.prepare("UPDATE users SET password_hash=?,salt=?,updated_at=? WHERE id=?").bind(hash,salt,Date.now(),id).run();
      await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id).run();
      await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)")
        .bind(id,"password_changed",`El administrador ${admin.username} te cambió la contraseña.`,Date.now()).run();
      await log(env,admin.id,"password_change",id,{notified:true});
      return json({ok:true,username:target.username});
    }

    if(path==="/api/dev/test-password-notification" && req.method==="POST") {
      if(!isOwnerUser(admin,env)) return json({error:"Solo el Owner puede probar esta notificación."},403);
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      let target=null;
      if(x?.userId!==undefined && x.userId!==null && String(x.userId)!=="")
        target=await env.DB.prepare("SELECT id,username FROM users WHERE id=?").bind(Number(x.userId)).first();
      else if(String(x?.username||"").trim())
        target=await env.DB.prepare("SELECT id,username FROM users WHERE username=? COLLATE NOCASE LIMIT 1").bind(String(x.username).trim()).first();
      if(!target) return json({error:"Cuenta no encontrada."},404);
      await env.DB.prepare("INSERT INTO notifications(user_id,type,message,created_at) VALUES(?,?,?,?)")
        .bind(target.id,"password_changed_test",`Prueba de notificación: el administrador ${admin.username} te cambió la contraseña.`,Date.now()).run();
      await log(env,admin.id,"password_notification_test",target.id,{});
      return json({ok:true,username:target.username});
    }

    const scoreMatch=path.match(/^\/api\/dev\/users\/(\d+)\/score$/);
    if(scoreMatch && req.method==="POST") {
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const delta=Number(x.delta);
      if(!Number.isSafeInteger(delta) || Math.abs(delta)>1000000000) return json({error:"Cantidad inválida."},400);
      const id=Number(scoreMatch[1]);
      const row=await env.DB.prepare("SELECT username,best_score FROM users WHERE id=?").bind(id).first();
      if(!row) return json({error:"Cuenta no encontrada."},404);
      if(isOwnerName(row.username,env) && !isOwnerUser(admin,env)) return json({error:"Solo el Owner puede modificar al Owner."},403);
      await env.DB.prepare("UPDATE users SET best_score=MAX(0,best_score+?),updated_at=? WHERE id=?").bind(delta,Date.now(),id).run();
      await log(env,admin.id,"score_delta",id,{delta});
      return json({ok:true});
    }

    const setScore=path.match(/^\/api\/dev\/users\/(\d+)\/set-score$/);
    if(setScore && req.method==="POST") {
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const score=Number(x.score),id=Number(setScore[1]);
      if(!Number.isSafeInteger(score)||score<0||score>1000000000)return json({error:"Puntuación inválida."},400);
      const target=await env.DB.prepare("SELECT username FROM users WHERE id=?").bind(id).first();
      if(target && isOwnerName(target.username,env) && !isOwnerUser(admin,env)) return json({error:"Solo el Owner puede modificar al Owner."},403);
      await env.DB.prepare("UPDATE users SET best_score=?,updated_at=? WHERE id=?").bind(score,Date.now(),id).run();
      await log(env,admin.id,"score_set",id,{score});
      return json({ok:true});
    }

    const userAction=path.match(/^\/api\/dev\/users\/(\d+)\/(block|unblock|reset|promote|demote)$/);
    if(userAction && req.method==="POST") {
      const id=Number(userAction[1]),action=userAction[2];
      if(id===admin.id && ["block","demote"].includes(action)) return json({error:"No puedes quitarte tu propio acceso de administrador."},400);
      const target=await env.DB.prepare("SELECT username FROM users WHERE id=?").bind(id).first();
      if(target && isOwnerName(target.username,env) && ["block","demote"].includes(action))
        return json({error:"El Owner no puede ser bloqueado ni perder el rol de administrador."},403);
      if(action==="block") {
        await env.DB.prepare("UPDATE users SET status='blocked',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      }
      if(action==="unblock") {
        await env.DB.prepare("UPDATE users SET status='active',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      }
      if(action==="reset") {
        if(!target) return json({error:"Cuenta no encontrada."},404);
        if(isOwnerName(target.username,env)) return json({error:"El Owner no puede ser borrado."},403);
        await log(env,admin.id,"account_delete",id,{username:target.username});
        await Promise.all([
          env.DB.prepare("DELETE FROM achievements WHERE user_id=?").bind(id).run().catch(()=>{}),
          env.DB.prepare("DELETE FROM daily_progress WHERE user_id=?").bind(id).run().catch(()=>{}),
          env.DB.prepare("DELETE FROM user_stats WHERE user_id=?").bind(id).run().catch(()=>{}),
          env.DB.prepare("DELETE FROM live_answers WHERE user_id=?").bind(id).run().catch(()=>{}),
          env.DB.prepare("DELETE FROM friends WHERE user_id=? OR friend_id=?").bind(id,id).run().catch(()=>{}),
          env.DB.prepare("DELETE FROM duels WHERE challenger_id=? OR opponent_id=?").bind(id,id).run().catch(()=>{})
        ]);
        await env.DB.batch([
          env.DB.prepare("DELETE FROM games WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM dev_sessions WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM user_styles WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM user_name_colors WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM user_ranks WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM notifications WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM daily_gifts WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM users WHERE id=?").bind(id)
        ]);
        return json({ok:true,deleted:true,username:target.username});
      }
      if(action==="promote") {
        await env.DB.prepare("UPDATE users SET role='admin',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      }
      if(action==="demote") {
        if(id===admin.id) return json({error:"No puedes quitarte tu propio acceso de administrador."},400);
        if(target && isOwnerName(target.username,env)) return json({error:"El Owner no puede perder el rol de administrador."},403);
        await env.DB.prepare("UPDATE users SET role='user',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      }
      await log(env,admin.id,action,id,{});
      return json({ok:true});
    }

    if(path==="/api/dev/audit" && req.method==="GET") {
      const rows=await env.DB.prepare("SELECT a.created_at AS createdAt,a.action,a.details,u.username actor FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 100").all();
      return json({logs:rows.results||[]});
    }

    if(path==="/api/dev/close" && req.method==="POST") {
      const raw=getCookie(req,"f_dev");
      if(raw) await env.DB.prepare("DELETE FROM dev_sessions WHERE token_hash=?").bind(await digest(raw)).run();
      return json({ok:true},200,{"Set-Cookie":cookieHeader(req,"f_dev","",0)});
    }
  }

  return json({error:"No encontrado"},404);
}

export default {
  async fetch(req,env) {
    try {
      const url=new URL(req.url);
      if(url.pathname.startsWith("/api/")) return await api(req,env);
      const assetResponse=await env.ASSETS.fetch(req);
      const contentType=assetResponse.headers.get("content-type")||"";
      if(contentType.includes("text/html")){
        const headers=new Headers(assetResponse.headers);
        headers.set("Cache-Control","no-store, no-cache, must-revalidate, proxy-revalidate");
        headers.set("Pragma","no-cache");
        headers.set("Expires","0");
        return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
      }
      return assetResponse;
    } catch(e) {
      console.error("[worker]",e);
      return json({error:"Error interno"},500);
    }
  }
};