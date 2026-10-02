const QUESTIONS = [
  ["Mundiales","¿Quién tiene más goles en la historia de los Mundiales?",["Lionel Messi","Cristiano Ronaldo","Miroslav Klose"],2],
  ["Mundiales","¿Qué selección ganó el Mundial 2022?",["Argentina","Francia","Brasil"],0],
  ["Reglas","¿Cuántos jugadores tiene un equipo al comenzar un partido?",["10","11","12"],1],
  ["Mundiales","¿Qué país ganó el Mundial 2014?",["Alemania","Argentina","España"],0],
  ["Leyendas","¿Quién era conocido como 'O Rei'?",["Pelé","Maradona","Zidane"],0],
  ["Mundiales","¿Qué selección tiene más títulos mundiales?",["Brasil","Alemania","Italia"],0],
  ["Reglas","¿Cuánto dura un partido sin contar el tiempo añadido?",["80 minutos","90 minutos","100 minutos"],1],
  ["Reglas","¿Qué tarjeta implica expulsión?",["Amarilla","Azul","Roja"],2],
  ["Uruguay","¿Cuántos Mundiales ganó Uruguay?",["1","2","3"],1],
  ["Leyendas","¿Quién fue capitán de Argentina en el Mundial 1986?",["Batistuta","Maradona","Zanetti"],1],
  ["Champions","¿Qué club ganó más Champions League hasta 2025?",["Real Madrid","Milan","Liverpool"],0],
  ["Mundiales","¿Quién marcó el gol de la final del Mundial 2010?",["Iniesta","Villa","Xavi"],0]
];

const PUBLIC_QUESTIONS = QUESTIONS.map((q,i)=>({id:i,category:q[0],q:q[1],options:q[2]}));
const RATE = new Map();

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

async function passwordHash(password,salt,pepper) {
  const key = await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {name:"PBKDF2",salt:new TextEncoder().encode(salt+pepper),iterations:310000,hash:"SHA-256"},
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
  return env.DB.prepare(
    "SELECT u.id,u.username,u.role,u.status,u.best_score AS bestScore,u.games FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1"
  ).bind(await digest(raw),Date.now()).first();
}

async function requireUser(req,env,admin=false) {
  const u=await currentUser(req,env);
  if(!u || u.status!=="active" || (admin && u.role!=="admin")) return null;
  return u;
}

async function captcha(tokenValue,req,env) {
  if(!env.TURNSTILE_SECRET) return true;
  if(!tokenValue) return false;
  const form=new FormData();
  form.append("secret",env.TURNSTILE_SECRET);
  form.append("response",tokenValue);
  const ip=req.headers.get("CF-Connecting-IP");
  if(ip) form.append("remoteip",ip);
  const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:form});
  if(!r.ok) return false;
  const data=await r.json();
  return data.success===true;
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
  const url=new URL(req.url);
  const path=url.pathname;
  if(!sameOrigin(req)) return json({error:"Origen no permitido"},403);

  if(path==="/api/config" && req.method==="GET")
    return json({turnstileSiteKey:env.TURNSTILE_SITEKEY||"",questionCount:PUBLIC_QUESTIONS.length});

  if(path==="/api/me" && req.method==="GET")
    return json({user:await currentUser(req,env)});

  if(path==="/api/register" && req.method==="POST") {
    if(!limited(req,"register",6,900000)) return json({error:"Demasiados intentos. Prueba más tarde."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const username=String(x.username||"").trim();
    const password=String(x.password||"");
    if(!/^[A-Za-z0-9_]{3,16}$/.test(username)) return json({error:"El usuario debe tener 3-16 caracteres: letras, números o _."},400);
    if(password.length<8 || password.length>128) return json({error:"La contraseña debe tener entre 8 y 128 caracteres."},400);
    if(!(await captcha(x.turnstileToken,req,env))) return json({error:"Completa el CAPTCHA."},400);

    const existing=await env.DB.prepare("SELECT id FROM users WHERE username=? COLLATE NOCASE LIMIT 1").bind(username).first();
    if(existing) return json({error:"Ese usuario ya existe."},409);

    const salt=randomSalt();
    const hash=await passwordHash(password,salt,env.PASSWORD_PEPPER||"");
    const role=env.ADMIN_USERNAME && username.toLowerCase()===String(env.ADMIN_USERNAME).toLowerCase() ? "admin" : "user";
    const now=Date.now();
    const result=await env.DB.prepare(
      "INSERT INTO users(username,password_hash,salt,role,status,best_score,games,created_at) VALUES(?,?,?,?,?,?,?,?)"
    ).bind(username,hash,salt,role,"active",0,0,now).run();

    const userId=result.meta.last_row_id;
    const session=token();
    await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
      .bind(await digest(session),userId,now+604800000).run();
    return json({user:{id:userId,username,role,status:"active",bestScore:0,games:0}},201,{"Set-Cookie":cookieHeader(req,"f_session",session,604800)});
  }

  if(path==="/api/login" && req.method==="POST") {
    if(!limited(req,"login",8,900000)) return json({error:"Demasiados intentos. Prueba más tarde."},429);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const username=String(x.username||"").trim();
    const password=String(x.password||"");
    if(!(await captcha(x.turnstileToken,req,env))) return json({error:"Completa el CAPTCHA."},400);
    const row=await env.DB.prepare("SELECT * FROM users WHERE username=? COLLATE NOCASE LIMIT 1").bind(username).first();
    if(!row) return json({error:"La cuenta no existe."},404);
    if(row.status!=="active") return json({error:"Esta cuenta está bloqueada."},403);
    const candidate=await passwordHash(password,row.salt,env.PASSWORD_PEPPER||"");
    if(candidate!==row.password_hash) return json({error:"Usuario o contraseña incorrectos."},401);

    const session=token();
    await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
      .bind(await digest(session),row.id,Date.now()+604800000).run();
    return json({user:{id:row.id,username:row.username,role:row.role,status:row.status,bestScore:row.best_score,games:row.games}},200,{"Set-Cookie":cookieHeader(req,"f_session",session,604800)});
  }

  if(path==="/api/logout" && req.method==="POST") {
    const raw=getCookie(req,"f_session");
    if(raw) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(raw)).run();
    return json({ok:true},{"Set-Cookie":cookieHeader(req,"f_session","",0)});
  }

  if(path==="/api/ranking" && req.method==="GET") {
    const rows=await env.DB.prepare("SELECT username,best_score AS score,games FROM users WHERE status='active' AND games>0 ORDER BY best_score DESC, id ASC LIMIT 100").all();
    return json({ranking:rows.results||[]});
  }

  if(path==="/api/game" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    const gameId=token();
    await env.DB.prepare("INSERT INTO games(id,user_id,idx,score,started_at) VALUES(?,?,?,?,?)")
      .bind(gameId,u.id,0,0,Date.now()).run();
    return json({gameId,question:PUBLIC_QUESTIONS[0],total:PUBLIC_QUESTIONS.length});
  }

  if(path==="/api/answer" && req.method==="POST") {
    const u=await requireUser(req,env);
    if(!u) return json({error:"Inicia sesión."},403);
    let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
    const game=await env.DB.prepare("SELECT * FROM games WHERE id=? AND user_id=? LIMIT 1").bind(String(x.gameId),u.id).first();
    if(!game) return json({error:"Partida inválida."},400);
    if(game.idx<0 || game.idx>=QUESTIONS.length) return json({error:"Partida corrupta."},400);

    const q=QUESTIONS[game.idx];
    const choice=Number(x.choice);
    if(!Number.isInteger(choice) || choice<0 || choice>=q[2].length) return json({error:"Respuesta inválida."},400);

    const correct=choice===q[3];
    const points=correct?100:0;
    const score=game.score+points;
    const next=game.idx+1;

    if(next>=QUESTIONS.length) {
      await env.DB.batch([
        env.DB.prepare("UPDATE users SET games=games+1,best_score=MAX(best_score,?),updated_at=? WHERE id=?").bind(score,Date.now(),u.id),
        env.DB.prepare("DELETE FROM games WHERE id=?").bind(game.id)
      ]);
      return json({correct,points,score,done:true});
    }

    await env.DB.prepare("UPDATE games SET idx=?,score=? WHERE id=?").bind(next,score,game.id).run();
    return json({correct,points,score,done:false,question:PUBLIC_QUESTIONS[next]});
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

    if(path==="/api/dev/users" && req.method==="GET") {
      const rows=await env.DB.prepare("SELECT id,username,role,status,best_score AS bestScore,games,created_at AS createdAt FROM users ORDER BY id DESC").all();
      return json({users:rows.results||[]});
    }

    if(path==="/api/dev/stats" && req.method==="GET") {
      const [u,g,s]=await Promise.all([
        env.DB.prepare("SELECT COUNT(*) c FROM users").first(),
        env.DB.prepare("SELECT COUNT(*) c FROM games").first(),
        env.DB.prepare("SELECT COUNT(*) c FROM sessions WHERE expires_at>?").bind(Date.now()).first()
      ]);
      return json({users:u?.c||0,activeGames:g?.c||0,activeSessions:s?.c||0});
    }

    const scoreMatch=path.match(/^\/api\/dev\/users\/(\d+)\/score$/);
    if(scoreMatch && req.method==="POST") {
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const delta=Number(x.delta);
      if(!Number.isSafeInteger(delta) || Math.abs(delta)>1000000000) return json({error:"Cantidad inválida."},400);
      const id=Number(scoreMatch[1]);
      const row=await env.DB.prepare("SELECT username,best_score FROM users WHERE id=?").bind(id).first();
      if(!row) return json({error:"Cuenta no encontrada."},404);
      await env.DB.prepare("UPDATE users SET best_score=MAX(0,best_score+?),updated_at=? WHERE id=?").bind(delta,Date.now(),id).run();
      await log(env,admin.id,"score_delta",id,{delta});
      return json({ok:true});
    }

    const setScore=path.match(/^\/api\/dev\/users\/(\d+)\/set-score$/);
    if(setScore && req.method==="POST") {
      let x; try{x=await req.json()}catch{return json({error:"Solicitud inválida"},400);}
      const score=Number(x.score),id=Number(setScore[1]);
      if(!Number.isSafeInteger(score)||score<0||score>1000000000)return json({error:"Puntuación inválida."},400);
      await env.DB.prepare("UPDATE users SET best_score=?,updated_at=? WHERE id=?").bind(score,Date.now(),id).run();
      await log(env,admin.id,"score_set",id,{score});
      return json({ok:true});
    }

    const userAction=path.match(/^\/api\/dev\/users\/(\d+)\/(block|unblock|reset|promote|demote)$/);
    if(userAction && req.method==="POST") {
      const id=Number(userAction[1]),action=userAction[2];
      if(id===admin.id && ["block","demote"].includes(action)) return json({error:"No puedes quitarte tu propio acceso de administrador."},400);
      if(action==="block") await env.DB.prepare("UPDATE users SET status='blocked',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      if(action==="unblock") await env.DB.prepare("UPDATE users SET status='active',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      if(action==="reset") await env.DB.prepare("UPDATE users SET best_score=0,games=0,updated_at=? WHERE id=?").bind(Date.now(),id).run();
      if(action==="promote") await env.DB.prepare("UPDATE users SET role='admin',updated_at=? WHERE id=?").bind(Date.now(),id).run();
      if(action==="demote") await env.DB.prepare("UPDATE users SET role='user',updated_at=? WHERE id=?").bind(Date.now(),id).run();
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
      return env.ASSETS.fetch(req);
    } catch {
      return json({error:"Error interno"},500);
    }
  }
};