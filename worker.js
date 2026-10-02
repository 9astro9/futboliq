import { QUESTIONS, QUESTION_SETS, QUESTION_COUNTS } from "./questions.js";

const DIFFICULTY_META = {
  facil: {label:"Fácil", points:100, coins:8},
  dificil: {label:"Normal", points:175, coins:14},
  imposible: {label:"Imposible", points:300, coins:25},
  blassvec: {label:"Blassvec Modo", points:0, coins:0}
};

const STYLES = [
  {id:"clasico",name:"Clásico",price:0,icon:"⚽",desc:"El estilo original de FUTBOLIQ."},
  {id:"neon",name:"Neón",price:2500,icon:"⚡",desc:"Perfil brillante con estética futurista."},
  {id:"fuego",name:"Fuego",price:5000,icon:"🔥",desc:"Un perfil intenso para competir."},
  {id:"hielo",name:"Hielo",price:5000,icon:"❄️",desc:"Estilo frío y elegante."},
  {id:"oro",name:"Oro",price:9000,icon:"👑",desc:"Perfil dorado para coleccionistas."},
  {id:"carbono",name:"Carbono",price:12000,icon:"🖤",desc:"Estilo oscuro de alto nivel."},
  {id:"retro",name:"Retro",price:7500,icon:"📼",desc:"Inspirado en el fútbol clásico."},
  {id:"cosmico",name:"Cósmico",price:15000,icon:"🌌",desc:"Un perfil con estilo espacial."},
  {id:"mundial",name:"Mundial",price:22000,icon:"🏆",desc:"Para quienes viven el fútbol."}
];

const STYLE_BY_ID = new Map(STYLES.map(s=>[s.id,s]));
const NAME_COLORS = [
  {id:"blanco",name:"Blanco",price:0,color:"#f5f7fb",desc:"El color original de FUTBOLIQ."},
  {id:"azul",name:"Azul",price:700,color:"#60a5fa",desc:"Azul eléctrico para tu nombre."},
  {id:"rojo",name:"Rojo",price:900,color:"#fb7185",desc:"Un nombre que resalta."},
  {id:"verde",name:"Verde",price:1200,color:"#35d399",desc:"Tono verde FUTBOLIQ."},
  {id:"violeta",name:"Violeta",price:1600,color:"#c084fc",desc:"Violeta brillante."},
  {id:"celeste",name:"Celeste",price:1900,color:"#67e8f9",desc:"Celeste de selección."},
  {id:"rosa",name:"Rosa",price:2400,color:"#f472b6",desc:"Rosa intenso."},
  {id:"oro",name:"Dorado",price:3500,color:"#f6c453",desc:"Nombre dorado."},
  {id:"arcoiris",name:"Arcoíris",price:9000,color:null,gradient:"linear-gradient(90deg,#ff595e,#ffca3a,#8ac926,#1982c4,#6a4c93)",desc:"Gradiente multicolor."}
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
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_games_user ON games(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_dev_expiry ON dev_sessions(expires_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_user_styles_user ON user_styles(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_user_name_colors_user ON user_name_colors(user_id)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id,read_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_broadcast_created ON broadcast_messages(created_at)"),
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

    const gameInfo=await env.DB.prepare("PRAGMA table_info(games)").all();
    const gameCols=new Set((gameInfo.results||[]).map(r=>r.name));
    if(!gameCols.has("difficulty")) await env.DB.prepare("ALTER TABLE games ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'facil'").run();
    if(!gameCols.has("question_ids")) await env.DB.prepare("ALTER TABLE games ADD COLUMN question_ids TEXT").run();

    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO user_styles(user_id,style_id,purchased_at) SELECT id,'clasico',COALESCE(created_at,?) FROM users").bind(Date.now()),
      env.DB.prepare("UPDATE users SET coins=300 WHERE coins IS NULL"),
      env.DB.prepare("UPDATE users SET profile_style='clasico' WHERE profile_style IS NULL OR profile_style=''"),
      env.DB.prepare("UPDATE users SET name_color='blanco' WHERE name_color IS NULL OR name_color=''"),
      env.DB.prepare("INSERT OR IGNORE INTO user_name_colors(user_id,color_id,purchased_at) SELECT id,'blanco',COALESCE(created_at,?) FROM users").bind(Date.now())
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
      `)
    ]);
  })().catch(e=>{featureSchemaPromise=null;console.error("[feature-db]",e);throw e});
  return featureSchemaPromise;
}

function weekKey(date=new Date()){
  const d=new Date(date);
  const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
  const day=t.getUTCDay()||7;
  t.setUTCDate(t.getUTCDate()+4-day);
  const y=t.getUTCFullYear();
  const first=new Date(Date.UTC(y,0,1));
  const week=Math.ceil((((t-first)/86400000)+1)/7);
  return y+"-W"+String(week).padStart(2,"0");
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
    const xpGain=correct?Math.max(5,Math.floor(Number(points||0)/10)):1;
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
    "SELECT u.id,u.username,u.role,u.status,u.best_score AS bestScore,u.games,u.coins,u.profile_style AS profileStyle,u.beta_tester AS betaTester,u.name_color AS nameColor FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1"
  ).bind(await digest(raw),Date.now()).first();
  if(!u) return null;
  u.betaTester=!!u.betaTester;
  u.owner=isOwnerUser(u,env);
  u.nameColor=u.nameColor||"blanco";
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
    return json({
      profile:u,
      styles:STYLES.map(s=>({...s,owned:ownedIds.has(s.id)||s.id==="clasico",equipped:u.profileStyle===s.id})),
      nameColors:NAME_COLORS.map(c=>({...c,owned:ownedColorIds.has(c.id)||c.id==="blanco",equipped:!u.owner&&u.nameColor===c.id}))
    });
  }

  if(path==="/api/shop" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const owned=await env.DB.prepare("SELECT style_id AS styleId FROM user_styles WHERE user_id=?").bind(u.id).all();
    const ownedIds=new Set((owned.results||[]).map(r=>r.styleId));
    const ownedColors=await env.DB.prepare("SELECT color_id AS colorId FROM user_name_colors WHERE user_id=?").bind(u.id).all();
    const ownedColorIds=new Set((ownedColors.results||[]).map(r=>r.colorId));
    return json({
      coins:u.coins,
      equipped:u.profileStyle,
      styles:STYLES.map(s=>({...s,owned:ownedIds.has(s.id)||s.id==="clasico",equipped:u.profileStyle===s.id})),
      nameColors:NAME_COLORS.map(c=>({...c,owned:ownedColorIds.has(c.id)||c.id==="blanco",equipped:!u.owner&&u.nameColor===c.id})),
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
  }if(path==="/api/health" && req.method==="GET") {
    try {
      const rows=await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','sessions','games','dev_sessions','audit_logs') ORDER BY name"
      ).all();
      return json({ok:true,tables:(rows.results||[]).map(r=>r.name)});
    } catch(e) {
      console.error("[health]",e);
      return json({ok:false,error:"D1 no disponible."},500);
    }
  }

  if(path==="/api/me" && req.method==="GET")
    return json({user:await currentUser(req,env)});

  if(path==="/api/register" && req.method==="POST") {
    if(!limited(req,"register",6,900000)) return json({error:"Demasiados intentos. Prueba más tarde."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const username=String(x.username||"").trim();
    const password=String(x.password||"");
    if(!/^[A-Za-z0-9_]{3,16}$/.test(username)) return json({error:"El usuario debe tener 3-16 caracteres: letras, números o _."},400);
    if(password.length<8 || password.length>128) return json({error:"La contraseña debe tener entre 8 y 128 caracteres."},400);

    const existing=await env.DB.prepare("SELECT id FROM users WHERE username=? COLLATE NOCASE LIMIT 1").bind(username).first();
    if(existing) return json({error:"Ese usuario ya existe."},409);

    const salt=randomSalt();
    const hash=await passwordHash(password,salt,env.PASSWORD_PEPPER||"",10000);
    const role=env.ADMIN_USERNAME && username.toLowerCase()===String(env.ADMIN_USERNAME).toLowerCase() ? "admin" : "user";
    const now=Date.now();
    let created;
    try {
      await env.DB.prepare(
        "INSERT INTO users(username,password_hash,salt,role,status,best_score,games,coins,profile_style,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)"
      ).bind(username,hash,salt,role,"active",0,0,300,"clasico",now).run();
      created=await env.DB.prepare(
        "SELECT id FROM users WHERE username=? COLLATE NOCASE LIMIT 1"
      ).bind(username).first();
    } catch(e) {
      console.error("[register:user]",e);
      if(String(e?.message||e).toLowerCase().includes("unique")) return json({error:"Ese usuario ya existe."},409);
      return json({error:"No se pudo crear la cuenta."},500);
    }

    if(!created?.id) {
      console.error("[register:user-id] No se pudo recuperar el ID.");
      return json({error:"No se pudo crear la cuenta."},500);
    }

    const userId=created.id;
    await env.DB.prepare("INSERT OR IGNORE INTO user_styles(user_id,style_id,purchased_at) VALUES(?,?,?)").bind(userId,"clasico",now).run();
    const session=token();
    try {
      await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
        .bind(await digest(session),userId,now+604800000).run();
    } catch(e) {
      console.error("[register:session]",e);
      try{await env.DB.prepare("DELETE FROM users WHERE id=?").bind(userId).run()}catch{}
      return json({error:"La cuenta no pudo iniciar sesión. Revisa la base de datos."},500);
    }

    return json({user:{id:userId,username,role,status:"active",bestScore:0,games:0,coins:300,profileStyle:"clasico",betaTester:false,owner:isOwnerName(username,env),nameColor:"blanco"}},201,{"Set-Cookie":cookieHeader(req,"f_session",session,604800)});
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
    return json({user:{id:row.id,username:row.username,role:row.role,status:row.status,bestScore:row.best_score,games:row.games,coins:row.coins,profileStyle:row.profile_style,betaTester:!!row.beta_tester,owner:isOwnerName(row.username,env),nameColor:row.name_color||"blanco"},notifications},200,{"Set-Cookie":cookieHeader(req,"f_session",session,604800)});
  }

  if(path==="/api/logout" && req.method==="POST") {
    const raw=getCookie(req,"f_session");
    if(raw) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(raw)).run();
    return json({ok:true},200,{"Set-Cookie":cookieHeader(req,"f_session","",0)});
  }

  if(path==="/api/daily-gift" && (req.method==="GET" || req.method==="POST")) {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const claimDate=new Date().toISOString().slice(0,10);
    const gift=await env.DB.prepare("SELECT 1 FROM daily_gifts WHERE user_id=? AND claim_date=? LIMIT 1").bind(u.id,claimDate).first();
    if(req.method==="GET") return json({claimed:Boolean(gift),coins:u.coins||0,claimDate});
    if(gift) return json({error:"Ya reclamaste el regalo de hoy.",claimed:true,coins:u.coins||0,claimDate},409);
    const inserted=await env.DB.prepare("INSERT OR IGNORE INTO daily_gifts(user_id,claim_date,claimed_at) VALUES(?,?,?)").bind(u.id,claimDate,Date.now()).run();
    if(!inserted.meta?.changes) return json({error:"Ya reclamaste el regalo de hoy.",claimed:true,coins:u.coins||0,claimDate},409);
    try {
      await env.DB.prepare("UPDATE users SET coins=coins+150,updated_at=? WHERE id=?").bind(Date.now(),u.id).run();
      const fresh=await env.DB.prepare("SELECT coins FROM users WHERE id=?").bind(u.id).first();
      await log(env,u.id,"daily_gift",u.id,{amount:150,claimDate});
      return json({ok:true,claimed:true,amount:150,coins:fresh?.coins??((u.coins||0)+150),claimDate});
    } catch(e) {
      await env.DB.prepare("DELETE FROM daily_gifts WHERE user_id=? AND claim_date=?").bind(u.id,claimDate).run().catch(()=>{});
      return json({error:"No se pudo acreditar el regalo."},500);
    }
  }

  if(path==="/api/owner-chat" && req.method==="GET") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const rows=await env.DB.prepare(
      "SELECT id,sender_user_id AS senderId,sender_username AS sender,message,created_at AS createdAt FROM broadcast_messages ORDER BY id DESC LIMIT 50"
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
      "INSERT INTO broadcast_messages(sender_user_id,sender_username,message,created_at) VALUES(?,?,?,?)"
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

  if(path==="/api/ranking" && req.method==="GET") {
    const rows=await env.DB.prepare("SELECT username,best_score AS score,games,profile_style AS profileStyle,beta_tester AS betaTester,name_color AS nameColor FROM users WHERE status='active' AND games>0 ORDER BY best_score DESC, games DESC, id ASC LIMIT 100").all();
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
    const points=correct?meta.points:0;
    const coinGain=correct?meta.coins:0;
    const score=game.score+points;
    const next=game.idx+1;
    let totalCoins=null;

    if(correct) {
      const bonus=next>=ids.length?50:0;
      await env.DB.prepare("UPDATE users SET coins=coins+?,updated_at=? WHERE id=?").bind(coinGain+bonus,Date.now(),u.id).run();
      totalCoins=(u.coins||0)+coinGain+bonus;
    }

    if(next>=ids.length) {
      await env.DB.batch([
        env.DB.prepare("UPDATE users SET games=games+1,best_score=MAX(best_score,?),updated_at=? WHERE id=?").bind(score,Date.now(),u.id),
        env.DB.prepare("DELETE FROM games WHERE id=?").bind(game.id)
      ]);
      const fresh=await env.DB.prepare("SELECT coins,profile_style AS profileStyle FROM users WHERE id=?").bind(u.id).first();
      return json({correct,points,score,done:true,coins:fresh?.coins??totalCoins,difficulty:game.difficulty});
    }

    await env.DB.prepare("UPDATE games SET idx=?,score=? WHERE id=?").bind(next,score,game.id).run();
    const nextQ=QUESTIONS[ids[next]];
    return json({
      correct,points,score,done:false,coins:totalCoins??u.coins,
      difficulty:game.difficulty,
      question:{id:ids[next],category:nextQ[0],q:nextQ[1],options:nextQ[2]}
    });
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

  if(path.startsWith("/api/dev/")) {
    const admin=await requireUser(req,env,true);
    const ds=await devSession(req,env);
    if(!admin || !ds) return json({error:"Sesión de desarrollador no autorizada."},403);

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
        await env.DB.batch([
          env.DB.prepare("DELETE FROM games WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM dev_sessions WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM user_styles WHERE user_id=?").bind(id),
          env.DB.prepare("DELETE FROM user_name_colors WHERE user_id=?").bind(id),
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