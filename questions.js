const SIMPLE_TEMPLATES = {
  wcWinner: [
    f => \`¿Qué selección ganó el Mundial de \${f.ctx}?\`,
    f => \`¿Quién fue campeón de la Copa del Mundo en \${f.ctx}?\`,
    f => \`¿Qué país se consagró campeón mundial en \${f.ctx}?\`
  ],
  rule: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ],
  legend: [
    f => \`¿Qué jugador está asociado con el dato: \${f.ctx}?\`,
    f => \`¿A qué leyenda corresponde este dato: \${f.ctx}?\`,
    f => \`¿Quién es el jugador relacionado con \${f.ctx}?\`
  ],
  club: [
    f => \`¿Qué club tiene este dato histórico en la Champions: \${f.ctx}?\`,
    f => \`¿A qué club corresponde \${f.ctx}?\`,
    f => \`¿Qué equipo registra \${f.ctx} en la Champions?\`
  ],
  tournament: [
    f => \`¿Qué selección tiene el siguiente récord mundialista: \${f.ctx}?\`,
    f => \`¿A qué país corresponde este dato de Mundiales: \${f.ctx}?\`,
    f => \`¿Qué selección está asociada con \${f.ctx}?\`
  ],
  basic: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ]
};

const HARD_TEMPLATES = {
  wcApps: [
    f => \`¿Cuántos partidos jugó \${f.subject} en la historia de los Mundiales?\`,
    f => \`¿Qué cifra de apariciones mundialistas corresponde a \${f.subject}?\`,
    f => \`¿Con cuántos partidos de Mundial figura \${f.subject} en el registro de FIFA?\`
  ],
  clean: [
    f => \`¿Cuántas vallas invictas consiguió \${f.subject} en Mundiales?\`,
    f => \`¿Qué cantidad de porterías a cero tiene \${f.subject} en la historia mundialista?\`,
    f => \`¿Con cuántos partidos sin recibir goles figura \${f.subject} en los Mundiales?\`
  ],
  ronaldo: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ],
  uclTitles: [
    f => \`¿Cuántos títulos de la Champions tiene \${f.subject} según el registro histórico de UEFA?\`,
    f => \`¿Qué cantidad de Champions corresponde a \${f.subject}?\`,
    f => \`¿Con cuántas Champions aparece \${f.subject} en el palmarés histórico?\`
  ],
  uclAppsClub: [
    f => \`¿Cuántas apariciones históricas tiene \${f.subject} en la Champions?\`,
    f => \`¿Qué cifra de participaciones corresponde a \${f.subject} en la Champions?\`,
    f => \`¿Con cuántas apariciones figura \${f.subject} en el registro histórico de UEFA?\`
  ]
};

const EASY_FACTS = [
  {type:"wcWinner",ctx:"1930",answer:"Uruguay",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1934",answer:"Italia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1938",answer:"Italia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1950",answer:"Uruguay",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1954",answer:"Alemania Occidental",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1958",answer:"Brasil",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1962",answer:"Brasil",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1966",answer:"Inglaterra",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1970",answer:"Brasil",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1974",answer:"Alemania Occidental",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1978",answer:"Argentina",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1982",answer:"Italia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1986",answer:"Argentina",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1990",answer:"Alemania Occidental",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1994",answer:"Brasil",cat:"Mundiales"},
  {type:"wcWinner",ctx:"1998",answer:"Francia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2002",answer:"Brasil",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2006",answer:"Italia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2010",answer:"España",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2014",answer:"Alemania",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2018",answer:"Francia",cat:"Mundiales"},
  {type:"wcWinner",ctx:"2022",answer:"Argentina",cat:"Mundiales"},

  {type:"rule",answer:"11",cat:"Reglas",question:"¿Cuántos jugadores tiene un equipo al comenzar un partido?",altQuestion:"¿Cuál es el número reglamentario de titulares por equipo?",thirdQuestion:"¿Con cuántos jugadores inicia normalmente cada equipo?"},
  {type:"rule",answer:"90 minutos",cat:"Reglas",question:"¿Cuánto dura un partido de fútbol sin contar el tiempo añadido?",altQuestion:"¿Cuál es la duración reglamentaria básica de un partido?",thirdQuestion:"¿Cuántos minutos dura el tiempo reglamentario de un partido?"},
  {type:"rule",answer:"45 minutos",cat:"Reglas",question:"¿Cuánto dura un tiempo de un partido?",altQuestion:"¿Cuántos minutos tiene cada mitad del partido?",thirdQuestion:"¿Cuánto dura una parte reglamentaria de fútbol?"},
  {type:"rule",answer:"Tarjeta roja",cat:"Reglas",question:"¿Qué tarjeta implica la expulsión de un jugador?",altQuestion:"¿Qué tarjeta muestra el árbitro para expulsar a un jugador?",thirdQuestion:"¿Con qué tarjeta se ordena una expulsión?"},
  {type:"rule",answer:"11 metros",cat:"Reglas",question:"¿A qué distancia está el punto de penal del arco?",altQuestion:"¿Cuántos metros separan el punto de penal de la línea de gol?",thirdQuestion:"¿Cuál es la distancia del punto de penal al arco?"},
  {type:"rule",answer:"Dos",cat:"Reglas",question:"¿Cuántas amarillas suelen convertirse en una expulsión?",altQuestion:"¿Cuántas tarjetas amarillas recibe un jugador antes de ser expulsado por doble amarilla?",thirdQuestion:"¿Cuántas amarillas equivalen a una doble amonestación?"},
  {type:"rule",answer:"Con las dos manos",cat:"Reglas",question:"¿Cómo debe realizarse un saque de banda?",altQuestion:"¿Con qué forma básica se ejecuta un saque de banda?",thirdQuestion:"¿Qué debe usar un jugador para efectuar legalmente un saque de banda?"},
  {type:"rule",answer:"Esquina",cat:"Reglas",question:"¿Desde dónde se ejecuta un córner?",altQuestion:"¿En qué zona del campo se realiza un saque de esquina?",thirdQuestion:"¿Dónde se coloca el balón para sacar un córner?"},
  {type:"rule",answer:"El arquero",cat:"Reglas",question:"¿Qué jugador puede usar las manos dentro de su propia área en condiciones reglamentarias?",altQuestion:"¿Quién tiene permitido jugar el balón con las manos dentro de su área?",thirdQuestion:"¿Qué posición puede usar las manos dentro de su propio área?"},
  {type:"rule",answer:"Fuera de juego",cat:"Reglas",question:"¿Cómo se llama la infracción de offside en español?",altQuestion:"¿Qué término español se usa para 'offside'?",thirdQuestion:"¿Cómo se denomina la posición antirreglamentaria que impide una ventaja por estar adelantado?"},

  {type:"legend",ctx:"es conocido como 'O Rei'",answer:"Pelé",cat:"Leyendas"},
  {type:"legend",ctx:"fue capitán de Argentina en el Mundial 1986",answer:"Diego Maradona",cat:"Leyendas"},
  {type:"legend",ctx:"fue una de las grandes figuras de Países Bajos y del 'fútbol total'",answer:"Johan Cruyff",cat:"Leyendas"},
  {type:"legend",ctx:"marcó dos goles en la final del Mundial 1998",answer:"Zinedine Zidane",cat:"Leyendas"},
  {type:"legend",ctx:"es conocido como Ronaldo Nazário",answer:"Ronaldo",cat:"Leyendas"},
  {type:"legend",ctx:"fue una de las grandes estrellas de Brasil y Barcelona a comienzos del siglo XXI",answer:"Ronaldinho",cat:"Leyendas"},
  {type:"legend",ctx:"fue el histórico líbero y capitán de Italia, Franco",answer:"Franco Baresi",cat:"Leyendas"},
  {type:"legend",ctx:"fue un referente francés y ganó el Balón de Oro en 1983, 1984 y 1985",answer:"Michel Platini",cat:"Leyendas"},

  {type:"club",ctx:"15 títulos",answer:"Real Madrid",cat:"Champions"},
  {type:"club",ctx:"7 títulos",answer:"Milan",cat:"Champions"},
  {type:"club",ctx:"6 títulos",answer:"Liverpool",cat:"Champions"},
  {type:"club",ctx:"6 títulos",answer:"Bayern Múnich",cat:"Champions"},
  {type:"club",ctx:"5 títulos",answer:"Barcelona",cat:"Champions"},
  {type:"club",ctx:"4 títulos",answer:"Ajax",cat:"Champions"},
  {type:"club",ctx:"3 títulos",answer:"Inter",cat:"Champions"},
  {type:"club",ctx:"3 títulos",answer:"Manchester United",cat:"Champions"},

  {type:"tournament",ctx:"cinco títulos mundiales",answer:"Brasil",cat:"Mundiales"},
  {type:"tournament",ctx:"cuatro títulos mundiales",answer:"Italia",cat:"Mundiales"},
  {type:"tournament",ctx:"tres títulos mundiales",answer:"Alemania",cat:"Mundiales"},
  {type:"tournament",ctx:"dos títulos mundiales",answer:"Uruguay",cat:"Mundiales"},

  {type:"basic",question:"¿Dónde se disputó el Mundial 2022?",altQuestion:"¿Qué país fue sede del Mundial 2022?",thirdQuestion:"¿Qué país organizó la Copa del Mundo de 2022?",answer:"Catar",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección perdió la final del Mundial 2022?",altQuestion:"¿Quién fue subcampeón del Mundial 2022?",thirdQuestion:"¿Qué equipo cayó ante Argentina en la final de 2022?",answer:"Francia",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección terminó tercera en el Mundial 2022?",altQuestion:"¿Quién obtuvo el tercer puesto en Qatar 2022?",thirdQuestion:"¿Qué equipo ganó el partido por el tercer puesto en 2022?",answer:"Croacia",cat:"Mundiales"},
  {type:"basic",question:"¿Qué torneo comenzó en 1930 con Uruguay como campeón?",altQuestion:"¿Cómo se llama la competencia inaugurada en 1930?",thirdQuestion:"¿Qué gran torneo de selecciones tuvo su primera edición en 1930?",answer:"Copa Mundial de la FIFA",cat:"Mundiales"}
];

const HARD_FACTS = [
  {type:"wcApps",subject:"Lionel Messi",answer:"34",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Cristiano Ronaldo",answer:"27",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Lothar Matthäus",answer:"25",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Miroslav Klose",answer:"24",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Paolo Maldini",answer:"23",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Luka Modrić",answer:"23",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Manuel Neuer",answer:"23",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Kylian Mbappé",answer:"22",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Thibaut Courtois",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Diego Maradona",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Nicolás Otamendi",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Ivan Perišić",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Uwe Seeler",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Władysław Żmuda",answer:"21",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Cafú",answer:"20",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Philipp Lahm",answer:"20",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Grzegorz Lato",answer:"20",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Hugo Lloris",answer:"20",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Javier Mascherano",answer:"20",cat:"Récords FIFA"},
  {type:"wcApps",subject:"Bastian Schweinsteiger",answer:"20",cat:"Récords FIFA"},

  {type:"clean",subject:"Fabien Barthez",answer:"10",cat:"Récords FIFA"},
  {type:"clean",subject:"Peter Shilton",answer:"10",cat:"Récords FIFA"},
  {type:"clean",subject:"Unai Simón",answer:"9",cat:"Récords FIFA"},
  {type:"clean",subject:"Jan Jongbloed",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Leão",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Sepp Maier",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Taffarel",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Thibaut Courtois",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Hugo Lloris",answer:"8",cat:"Récords FIFA"},
  {type:"clean",subject:"Alisson",answer:"7",cat:"Récords FIFA"},
  {type:"clean",subject:"Gilmar",answer:"7",cat:"Récords FIFA"},
  {type:"clean",subject:"Iker Casillas",answer:"7",cat:"Récords FIFA"},
  {type:"clean",subject:"Fernando Muslera",answer:"7",cat:"Récords FIFA"},
  {type:"clean",subject:"Manuel Neuer",answer:"7",cat:"Récords FIFA"},

  {type:"ronaldo",answer:"145",cat:"Récords UEFA",question:"¿Cuántos goles tiene Cristiano Ronaldo en competiciones de clubes de UEFA?",altQuestion:"¿Qué cifra de goles ostenta Cristiano Ronaldo como récord en competiciones de clubes UEFA?",thirdQuestion:"¿Cuál es el récord de goles de Cristiano Ronaldo en competiciones de clubes de UEFA?",label:"goles en competiciones de clubes UEFA"},
  {type:"ronaldo",answer:"140",cat:"Récords UEFA",question:"¿Cuántos goles tiene Cristiano Ronaldo en la Champions League?",altQuestion:"¿Cuál es el récord de goles de Cristiano Ronaldo en la Champions?",thirdQuestion:"¿Qué cifra de goles registra Cristiano Ronaldo en la Champions League?",label:"goles en Champions League"},
  {type:"ronaldo",answer:"17",cat:"Récords UEFA",question:"¿Cuál es el récord de goles de Cristiano Ronaldo en una temporada de Champions?",altQuestion:"¿Cuántos goles marcó Cristiano Ronaldo en su temporada récord de Champions 2013/14?",thirdQuestion:"¿Qué cantidad de goles hizo Ronaldo en la Champions 2013/14?",label:"goles en la temporada 2013/14"},
  {type:"ronaldo",answer:"67",cat:"Récords UEFA",question:"¿Cuántos goles marcó Cristiano Ronaldo en fases eliminatorias de Champions?",altQuestion:"¿Qué cifra de goles de eliminatorias de Champions posee Ronaldo?",thirdQuestion:"¿Cuántos goles de knockout de Champions tiene Cristiano Ronaldo?",label:"goles en eliminatorias"},
  {type:"ronaldo",answer:"7",cat:"Récords UEFA",question:"¿En cuántas temporadas fue máximo goleador de la Champions Cristiano Ronaldo?",altQuestion:"¿Cuántas veces terminó Ronaldo como máximo goleador de la Champions?",thirdQuestion:"¿Cuántas temporadas lideró Ronaldo la tabla de goleadores de la Champions?",label:"temporadas como máximo goleador"},
  {type:"ronaldo",answer:"183",cat:"Récords UEFA",question:"¿Cuántas apariciones tiene Cristiano Ronaldo en la Champions League?",altQuestion:"¿Qué cifra de partidos de Champions registra Ronaldo?",thirdQuestion:"¿Cuántas veces apareció Cristiano Ronaldo en la Champions según UEFA?",label:"apariciones en Champions"},
  {type:"ronaldo",answer:"Tres finales",cat:"Récords UEFA",question:"¿En cuántas finales de Champions distintas fue capaz Cristiano Ronaldo de marcar?",altQuestion:"¿Cuántas finales de Champions tuvieron un gol de Ronaldo?",thirdQuestion:"¿En cuántas finales de Champions anotó Ronaldo?",label:"finales de Champions con gol"},
  {type:"ronaldo",answer:"11 partidos consecutivos",cat:"Récords UEFA",question:"¿Cuál es la racha de partidos consecutivos de Champions en los que Ronaldo marcó?",altQuestion:"¿Cuántos partidos seguidos de Champions llegó a marcar Cristiano Ronaldo?",thirdQuestion:"¿Qué longitud tiene la racha de Ronaldo anotando en partidos consecutivos de Champions?",label:"racha consecutiva anotando"},
  {type:"ronaldo",answer:"4",cat:"Récords UEFA",question:"¿Cuántos premios UEFA de Jugador del Año/Jugador del Año equivalente ganó Cristiano Ronaldo según UEFA?",altQuestion:"¿Cuántos reconocimientos de mejor jugador de UEFA acumula Ronaldo?",thirdQuestion:"¿Qué cantidad de premios UEFA como mejor jugador figura para Ronaldo?",label:"premios UEFA como mejor jugador"},
  {type:"ronaldo",answer:"15",cat:"Récords UEFA",question:"¿Cuántas veces apareció Cristiano Ronaldo en el Equipo del Año de UEFA.com?",altQuestion:"¿Qué cifra de apariciones tiene Ronaldo en el Equipo del Año de UEFA.com?",thirdQuestion:"¿Cuántas selecciones al Equipo del Año de UEFA.com registra Cristiano Ronaldo?",label:"apariciones en el Equipo del Año"},

  {type:"uclTitles",subject:"Real Madrid",answer:"15",cat:"Champions histórica"},
  {type:"uclTitles",subject:"Milan",answer:"7",cat:"Champions histórica"},
  {type:"uclTitles",subject:"Liverpool",answer:"6",cat:"Champions histórica"},
  {type:"uclTitles",subject:"Bayern Múnich",answer:"6",cat:"Champions histórica"},
  {type:"uclTitles",subject:"Barcelona",answer:"5",cat:"Champions histórica"},
  {type:"uclTitles",subject:"Ajax",answer:"4",cat:"Champions histórica"},

  {type:"uclAppsClub",subject:"Real Madrid",answer:"44",cat:"Champions histórica"},
  {type:"uclAppsClub",subject:"Benfica",answer:"42",cat:"Champions histórica"},
  {type:"uclAppsClub",subject:"Ajax",answer:"36",cat:"Champions histórica"},
  {type:"uclAppsClub",subject:"Dynamo Kyiv",answer:"35",cat:"Champions histórica"},
  {type:"uclAppsClub",subject:"Bayern Múnich",answer:"34",cat:"Champions histórica"},
  {type:"uclAppsClub",subject:"Juventus",answer:"33",cat:"Champions histórica"}
];

const IMPOSSIBLE_FACTS = [
  {player:"Bert Patenaude",team:"Estados Unidos",opponent:"Paraguay",year:"1930",cat:"Hat-tricks"},
  {player:"Guillermo Stábile",team:"Argentina",opponent:"México",year:"1930",cat:"Hat-tricks"},
  {player:"Pedro Cea",team:"Uruguay",opponent:"Yugoslavia",year:"1930",cat:"Hat-tricks"},
  {player:"Angelo Schiavio",team:"Italia",opponent:"Estados Unidos",year:"1934",cat:"Hat-tricks"},
  {player:"Edmund Conen",team:"Alemania",opponent:"Bélgica",year:"1934",cat:"Hat-tricks"},
  {player:"Oldřich Nejedlý",team:"Checoslovaquia",opponent:"Alemania",year:"1934",cat:"Hat-tricks"},
  {player:"Ernest Wilimowski",team:"Polonia",opponent:"Brasil",year:"1938",cat:"Hat-tricks"},
  {player:"Leônidas",team:"Brasil",opponent:"Polonia",year:"1938",cat:"Hat-tricks"},
  {player:"Gustav Wetterström",team:"Suecia",opponent:"Cuba",year:"1938",cat:"Hat-tricks"},
  {player:"Harry Andersson",team:"Suecia",opponent:"Cuba",year:"1938",cat:"Hat-tricks"},
  {player:"Óscar Míguez",team:"Uruguay",opponent:"Bolivia",year:"1950",cat:"Hat-tricks"},
  {player:"Ademir de Menezes",team:"Brasil",opponent:"Suecia",year:"1950",cat:"Hat-tricks"},
  {player:"Sándor Kocsis",team:"Hungría",opponent:"Corea del Sur",year:"1954",cat:"Hat-tricks"},
  {player:"Erich Probst",team:"Austria",opponent:"Checoslovaquia",year:"1954",cat:"Hat-tricks"},
  {player:"Carlos Borges",team:"Uruguay",opponent:"Escocia",year:"1954",cat:"Hat-tricks"},
  {player:"Sándor Kocsis",team:"Hungría",opponent:"Alemania Occidental",year:"1954",cat:"Hat-tricks"},
  {player:"Burhan Sargun",team:"Turquía",opponent:"Corea del Sur",year:"1954",cat:"Hat-tricks"},
  {player:"Max Morlock",team:"Alemania Occidental",opponent:"Turquía",year:"1954",cat:"Hat-tricks"},
  {player:"Theodor Wagner",team:"Austria",opponent:"Suiza",year:"1954",cat:"Hat-tricks"},
  {player:"Josef Hugi",team:"Suiza",opponent:"Austria",year:"1954",cat:"Hat-tricks"},
  {player:"Just Fontaine",team:"Francia",opponent:"Paraguay",year:"1958",cat:"Hat-tricks"},
  {player:"Pelé",team:"Brasil",opponent:"Francia",year:"1958",cat:"Hat-tricks"},
  {player:"Just Fontaine",team:"Francia",opponent:"Alemania Occidental",year:"1958",cat:"Hat-tricks"},
  {player:"Flórián Albert",team:"Hungría",opponent:"Bulgaria",year:"1962",cat:"Hat-tricks"},
  {player:"Eusébio",team:"Portugal",opponent:"Corea del Norte",year:"1966",cat:"Hat-tricks"},
  {player:"Geoff Hurst",team:"Inglaterra",opponent:"Alemania Occidental",year:"1966",cat:"Hat-tricks"},
  {player:"Gerd Müller",team:"Alemania Occidental",opponent:"Bulgaria",year:"1970",cat:"Hat-tricks"},
  {player:"Gerd Müller",team:"Alemania Occidental",opponent:"Perú",year:"1970",cat:"Hat-tricks"},
  {player:"Dušan Bajević",team:"Yugoslavia",opponent:"Zaire",year:"1974",cat:"Hat-tricks"},
  {player:"Andrzej Szarmach",team:"Polonia",opponent:"Haití",year:"1974",cat:"Hat-tricks"},
  {player:"Rob Rensenbrink",team:"Países Bajos",opponent:"Irán",year:"1978",cat:"Hat-tricks"},
  {player:"Teófilo Cubillas",team:"Perú",opponent:"Irán",year:"1978",cat:"Hat-tricks"},
  {player:"László Kiss",team:"Hungría",opponent:"El Salvador",year:"1982",cat:"Hat-tricks"},
  {player:"Karl-Heinz Rummenigge",team:"Alemania Occidental",opponent:"Chile",year:"1982",cat:"Hat-tricks"},
  {player:"Zbigniew Boniek",team:"Polonia",opponent:"Bélgica",year:"1982",cat:"Hat-tricks"},
  {player:"Paolo Rossi",team:"Italia",opponent:"Brasil",year:"1982",cat:"Hat-tricks"},
  {player:"Preben Elkjær Larsen",team:"Dinamarca",opponent:"Uruguay",year:"1986",cat:"Hat-tricks"},
  {player:"Gary Lineker",team:"Inglaterra",opponent:"Polonia",year:"1986",cat:"Hat-tricks"},
  {player:"Igor Belánov",team:"Unión Soviética",opponent:"Bélgica",year:"1986",cat:"Hat-tricks"},
  {player:"Emilio Butragueño",team:"España",opponent:"Dinamarca",year:"1986",cat:"Hat-tricks"},
  {player:"Michel",team:"España",opponent:"Corea del Sur",year:"1990",cat:"Hat-tricks"},
  {player:"Tomáš Skuhravý",team:"Checoslovaquia",opponent:"Costa Rica",year:"1990",cat:"Hat-tricks"},
  {player:"Gabriel Batistuta",team:"Argentina",opponent:"Grecia",year:"1994",cat:"Hat-tricks"},
  {player:"Oleg Salenko",team:"Rusia",opponent:"Camerún",year:"1994",cat:"Hat-tricks"},
  {player:"Gabriel Batistuta",team:"Argentina",opponent:"Jamaica",year:"1998",cat:"Hat-tricks"},
  {player:"Miroslav Klose",team:"Alemania",opponent:"Arabia Saudita",year:"2002",cat:"Hat-tricks"},
  {player:"Pauleta",team:"Portugal",opponent:"Polonia",year:"2002",cat:"Hat-tricks"},
  {player:"Gonzalo Higuaín",team:"Argentina",opponent:"Corea del Sur",year:"2010",cat:"Hat-tricks"},
  {player:"Thomas Müller",team:"Alemania",opponent:"Portugal",year:"2014",cat:"Hat-tricks"},
  {player:"Xherdan Shaqiri",team:"Suiza",opponent:"Honduras",year:"2014",cat:"Hat-tricks"},
  {player:"Cristiano Ronaldo",team:"Portugal",opponent:"Suiza",year:"2018",cat:"Hat-tricks"},
  {player:"Harry Kane",team:"Inglaterra",opponent:"Panamá",year:"2018",cat:"Hat-tricks"},
  {player:"Gonçalo Ramos",team:"Portugal",opponent:"Suiza",year:"2022",cat:"Hat-tricks"},
  {player:"Kylian Mbappé",team:"Francia",opponent:"Argentina",year:"2022",cat:"Hat-tricks"},
  {player:"Lionel Messi",team:"Argentina",opponent:"Argelia",year:"2026",cat:"Hat-tricks"},
  {player:"Jonathan David",team:"Canadá",opponent:"Catar",year:"2026",cat:"Hat-tricks"}
];

function optionSet(pool,answer,seed){
  const unique=[...new Set(pool)].filter(x=>x!==answer);
  if(unique.length<2) throw new Error("No hay suficientes opciones para una pregunta");
  const a=unique[seed%unique.length];
  let b=unique[(seed+1)%unique.length];
  if(b===a) b=unique[(seed+2)%unique.length];
  const values=[answer,a,b];
  const shift=seed%3;
  const options=[values[shift],values[(shift+1)%3],values[(shift+2)%3]];
  return {options,correct:options.indexOf(answer)};
}

function expandSimple(facts,difficulty,templates){
  const pools={};
  for(const f of facts)(pools[f.type]??=[]).push(f.answer);
  const out=[];
  facts.forEach((f,i)=>{
    for(let v=0;v<3;v++){
      const answer=f.answer;
      const q=templates[f.type][v](f);
      const set=optionSet(pools[f.type],answer,i+v);
      out.push([f.cat,q,set.options,set.correct,difficulty]);
    }
  });
  return out;
}

function expandImpossible(facts){
  const playerPool=facts.map(f=>f.player);
  const teamPool=facts.map(f=>f.team);
  const opponentPool=facts.map(f=>f.opponent);
  const out=[];
  facts.forEach((f,i)=>{
    const a=optionSet(playerPool,f.player,i);
    out.push([f.cat,\`¿Qué jugador hizo un hat-trick contra \${f.opponent} en el Mundial de \${f.year}?\`,a.options,a.correct,"imposible"]);
    const b=optionSet(opponentPool,f.opponent,i+1);
    out.push([f.cat,\`¿Contra qué selección hizo el hat-trick \${f.player} en \${f.year}?\`,b.options,b.correct,"imposible"]);
    const c=optionSet(teamPool,f.team,i+2);
    out.push([f.cat,\`¿Qué selección representaba \${f.player} cuando hizo el hat-trick contra \${f.opponent} en \${f.year}?\`,c.options,c.correct,"imposible"]);
  });
  return out;
}

const EASY=expandSimple(EASY_FACTS,"facil",SIMPLE_TEMPLATES);
const HARD=expandSimple(HARD_FACTS,"dificil",HARD_TEMPLATES);
const IMPOSSIBLE=expandImpossible(IMPOSSIBLE_FACTS);

if(EASY.length!==168 || HARD.length!==168 || IMPOSSIBLE.length!==168)
  throw new Error(\`Banco inválido: fácil=\${EASY.length}, difícil=\${HARD.length}, imposible=\${IMPOSSIBLE.length}\`);

export const QUESTIONS=[...EASY,...HARD,...IMPOSSIBLE];
export const QUESTION_SETS={
  facil:EASY.map((_,i)=>i),
  dificil:HARD.map((_,i)=>168+i),
  imposible:IMPOSSIBLE.map((_,i)=>336+i)
};
export const QUESTION_COUNTS={facil:EASY.length,dificil:HARD.length,imposible:IMPOSSIBLE.length};
