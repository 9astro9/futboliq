const SIMPLE_TEMPLATES = {
  wcWinner: [
    f => `¿Qué selección ganó el Mundial de ${f.ctx}?`,
    f => `¿Quién fue campeón de la Copa del Mundo en ${f.ctx}?`,
    f => `¿Qué país se consagró campeón mundial en ${f.ctx}?`
  ],
  rule: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ],
  legend: [
    f => `¿Qué jugador está asociado con el dato: ${f.ctx}?`,
    f => `¿A qué leyenda corresponde este dato: ${f.ctx}?`,
    f => `¿Quién es el jugador relacionado con ${f.ctx}?`
  ],
  club: [
    f => `¿Qué club tiene este dato histórico en la Champions: ${f.ctx}?`,
    f => `¿A qué club corresponde ${f.ctx}?`,
    f => `¿Qué equipo registra ${f.ctx} en la Champions?`
  ],
  tournament: [
    f => `¿Qué selección tiene el siguiente récord mundialista: ${f.ctx}?`,
    f => `¿A qué país corresponde este dato de Mundiales: ${f.ctx}?`,
    f => `¿Qué selección está asociada con ${f.ctx}?`
  ],
  basic: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ]
};

const HARD_TEMPLATES = {
  wcApps: [
    f => `¿Cuántos partidos jugó ${f.subject} en la historia de los Mundiales?`,
    f => `¿Qué cifra de apariciones mundialistas corresponde a ${f.subject}?`,
    f => `¿Con cuántos partidos de Mundial figura ${f.subject} en el registro de FIFA?`
  ],
  clean: [
    f => `¿Cuántas vallas invictas consiguió ${f.subject} en Mundiales?`,
    f => `¿Qué cantidad de porterías a cero tiene ${f.subject} en la historia mundialista?`,
    f => `¿Con cuántos partidos sin recibir goles figura ${f.subject} en los Mundiales?`
  ],
  ronaldo: [
    f => f.question,
    f => f.altQuestion,
    f => f.thirdQuestion
  ],
  uclTitles: [
    f => `¿Cuántos títulos de la Champions tiene ${f.subject} según el registro histórico de UEFA?`,
    f => `¿Qué cantidad de Champions corresponde a ${f.subject}?`,
    f => `¿Con cuántas Champions aparece ${f.subject} en el palmarés histórico?`
  ],
  uclAppsClub: [
    f => `¿Cuántas apariciones históricas tiene ${f.subject} en la Champions?`,
    f => `¿Qué cifra de participaciones corresponde a ${f.subject} en la Champions?`,
    f => `¿Con cuántas apariciones figura ${f.subject} en el registro histórico de UEFA?`
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
  {type:"legend",ctx:"es conocido como Ronaldo Nazário",answer:"Ronaldo Nazário",cat:"Leyendas"},
  {type:"legend",ctx:"fue una de las grandes estrellas de Brasil y Barcelona a comienzos del siglo XXI",answer:"Ronaldinho",cat:"Leyendas"},
  {type:"legend",ctx:"fue el histórico líbero y capitán de Italia, Franco",answer:"Franco Baresi",cat:"Leyendas"},
  {type:"legend",ctx:"fue un referente francés y ganó el Balón de Oro en 1983, 1984 y 1985",answer:"Michel Platini",cat:"Leyendas"},

  {type:"club",ctx:"15 títulos",answer:"Real Madrid",cat:"Champions"},
  {type:"basic",question:"¿Qué selección ganó el Mundial 2026?",altQuestion:"¿Quién fue campeón de la Copa del Mundo 2026?",thirdQuestion:"¿Qué país levantó la Copa Mundial de 2026?",answer:"España",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección fue subcampeona del Mundial 2026?",altQuestion:"¿Quién terminó segunda en la Copa del Mundo 2026?",thirdQuestion:"¿Qué selección perdió la final del Mundial 2026?",answer:"Argentina",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección terminó tercera en el Mundial 2026?",altQuestion:"¿Quién ganó el partido por el tercer puesto de 2026?",thirdQuestion:"¿Qué país obtuvo el tercer puesto en el Mundial 2026?",answer:"Inglaterra",cat:"Mundiales"},
  {type:"club",ctx:"5 títulos",answer:"Barcelona",cat:"Champions"},
  {type:"club",ctx:"4 títulos",answer:"Ajax",cat:"Champions"},
  {type:"club",ctx:"3 títulos",answer:"Inter",cat:"Champions"},
  {type:"club",ctx:"2 títulos",answer:"Chelsea",cat:"Champions"},

  {type:"tournament",ctx:"cinco títulos mundiales",answer:"Brasil",cat:"Mundiales"},
  {type:"tournament",ctx:"cuatro títulos mundiales",answer:"Italia",cat:"Mundiales"},
  {type:"tournament",ctx:"tres títulos mundiales",answer:"Alemania",cat:"Mundiales"},
  {type:"tournament",ctx:"dos títulos mundiales",answer:"Uruguay",cat:"Mundiales"},

  {type:"basic",question:"¿Dónde se disputó el Mundial 2022?",altQuestion:"¿Qué país fue sede del Mundial 2022?",thirdQuestion:"¿Qué país organizó la Copa del Mundo de 2022?",answer:"Catar",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección perdió la final del Mundial 2022?",altQuestion:"¿Quién fue subcampeón del Mundial 2022?",thirdQuestion:"¿Qué equipo cayó ante Argentina en la final de 2022?",answer:"Francia",cat:"Mundiales"},
  {type:"basic",question:"¿Qué selección terminó tercera en el Mundial 2022?",altQuestion:"¿Quién obtuvo el tercer puesto en Qatar 2022?",thirdQuestion:"¿Qué equipo ganó el partido por el tercer puesto en 2022?",answer:"Croacia",cat:"Mundiales"},
  {type:"basic",question:"¿Qué torneo comenzó en 1930 con Uruguay como campeón?",altQuestion:"¿Cómo se llama la competencia inaugurada en 1930?",thirdQuestion:"¿Qué gran torneo de selecciones tuvo su primera edición en 1930?",answer:"Copa Mundial de la FIFA",cat:"Mundiales"}
];

const NORMAL_FACTS = [
  // SUDAMÉRICA — 28 temas
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el primer Mundial, en 1930?",altQuestion:"¿Quién fue campeón del Mundial de 1930?",thirdQuestion:"¿Qué país levantó la primera Copa del Mundo?",answer:"Uruguay",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1950?",altQuestion:"¿Quién fue campeón del Mundial de Brasil 1950?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 1950?",answer:"Uruguay",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1978?",altQuestion:"¿Quién fue campeón de la Copa del Mundo de 1978?",thirdQuestion:"¿Qué país ganó el Mundial de 1978?",answer:"Argentina",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1986?",altQuestion:"¿Quién fue campeón del Mundial de 1986?",thirdQuestion:"¿Qué país levantó la Copa del Mundo de 1986?",answer:"Argentina",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 2022?",altQuestion:"¿Quién fue campeón del Mundial de Catar 2022?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 2022?",answer:"Argentina",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección tiene cinco Mundiales?",altQuestion:"¿Qué país es el máximo campeón de la Copa del Mundo?",thirdQuestion:"¿Quién ganó cinco veces el Mundial?",answer:"Brasil",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué jugador es conocido como 'O Rei'?",altQuestion:"¿A quién apodan 'O Rei'?",thirdQuestion:"¿Qué leyenda brasileña fue conocida como 'O Rei'?",answer:"Pelé",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Quién fue una de las grandes figuras de Argentina en el Mundial 1986?",altQuestion:"¿Qué leyenda argentina brilló en México 1986?",thirdQuestion:"¿Qué argentino fue capitán campeón en 1986?",answer:"Diego Maradona",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Cuántos Balones de Oro ganó Lionel Messi hasta 2023?",altQuestion:"¿Qué cantidad de Balones de Oro tiene Messi en el registro hasta 2023?",thirdQuestion:"¿Cuántos premios Balón de Oro suma Messi hasta 2023?",answer:"8",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño ganó el Balón de Oro de 2005?",altQuestion:"¿Quién ganó el Balón de Oro en 2005?",thirdQuestion:"¿Qué estrella de Brasil recibió el Balón de Oro de 2005?",answer:"Ronaldinho",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño ganó el Balón de Oro de 2007?",altQuestion:"¿Quién recibió el Balón de Oro en 2007?",thirdQuestion:"¿Qué jugador brasileño fue Balón de Oro en 2007?",answer:"Kaká",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño ganó el Balón de Oro de 1999?",altQuestion:"¿Quién ganó el premio en 1999?",thirdQuestion:"¿Qué jugador de Brasil fue Balón de Oro en 1999?",answer:"Rivaldo",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño ganó el Balón de Oro de 1997?",altQuestion:"¿Quién recibió el Balón de Oro de 1997?",thirdQuestion:"¿Qué delantero de Brasil ganó el premio en 1997?",answer:"Ronaldo Nazário",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño ganó el Balón de Oro de 2002?",altQuestion:"¿Quién fue el Balón de Oro de 2002?",thirdQuestion:"¿Qué delantero brasileño recibió el premio en 2002?",answer:"Ronaldo Nazário",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2021?",altQuestion:"¿Quién fue campeón de la Copa América de 2021?",thirdQuestion:"¿Qué país levantó la Copa América 2021?",answer:"Argentina",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2011?",altQuestion:"¿Quién fue campeón de la Copa América 2011?",thirdQuestion:"¿Qué país ganó el torneo sudamericano de 2011?",answer:"Uruguay",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2015?",altQuestion:"¿Quién fue campeón de la Copa América 2015?",thirdQuestion:"¿Qué país ganó la edición de 2015?",answer:"Chile",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2016?",altQuestion:"¿Quién fue campeón de la Copa América Centenario?",thirdQuestion:"¿Qué país ganó la Copa América 2016?",answer:"Chile",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección organizó y ganó la Copa América 2001?",altQuestion:"¿Qué país fue campeón de la Copa América 2001?",thirdQuestion:"¿Quién ganó el torneo continental de 2001?",answer:"Colombia",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué colombiano ganó la Bota de Oro del Mundial 2014?",altQuestion:"¿Quién fue máximo goleador del Mundial 2014?",thirdQuestion:"¿Qué jugador de Colombia marcó más goles en Brasil 2014?",answer:"James Rodríguez",cat:"Bota de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué jugador ganó el Balón de Oro del Mundial 2010?",altQuestion:"¿Quién fue elegido mejor jugador de Sudáfrica 2010?",thirdQuestion:"¿Qué jugador recibió el premio al mejor jugador del Mundial 2010?",answer:"Diego Forlán",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Sudamérica",question:"¿Qué jugador argentino marcó tres goles contra Grecia en el Mundial 1994?",altQuestion:"¿Qué delantero hizo un hat-trick ante Grecia en 1994?",thirdQuestion:"¿Quién convirtió tres goles ante Grecia en Estados Unidos 1994?",answer:"Gabriel Batistuta",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño fue capitán en varios Mundiales y ganó dos Copas del Mundo?",altQuestion:"¿Qué histórico lateral brasileño ganó los Mundiales de 1994 y 2002?",thirdQuestion:"¿Quién fue una figura de Brasil y ganó dos Mundiales?",answer:"Cafú",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Qué delantero colombiano es conocido como 'El Tigre'?",altQuestion:"¿A qué futbolista colombiano apodan 'El Tigre'?",thirdQuestion:"¿Quién es conocido como 'El Tigre' en Colombia?",answer:"Radamel Falcao",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Qué chileno fue una de las figuras de las Copas América 2015 y 2016?",altQuestion:"¿Qué delantero chileno destacó en los títulos continentales de 2015 y 2016?",thirdQuestion:"¿Qué estrella de Chile ganó esas dos Copas América?",answer:"Alexis Sánchez",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Quién marcó el gol de España en la final del Mundial 2026?",altQuestion:"¿Qué jugador anotó el gol del título en la final de 2026?",thirdQuestion:"¿Quién convirtió el gol de España ante Argentina en la final de 2026?",answer:"Ferran Torres",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1994?",altQuestion:"¿Quién fue campeón de la Copa del Mundo de 1994?",thirdQuestion:"¿Qué país ganó el Mundial de Estados Unidos 1994?",answer:"Brasil",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué argentino es conocido como 'La Pulga'?",altQuestion:"¿Quién es apodado 'La Pulga'?",thirdQuestion:"¿Qué leyenda argentina recibió el apodo de 'La Pulga'?",answer:"Lionel Messi",cat:"Leyendas"},

  // EUROPA — 28 temas
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 1934?",altQuestion:"¿Quién fue campeón de la Copa del Mundo de 1934?",thirdQuestion:"¿Qué país ganó el Mundial de 1934?",answer:"Italia",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 1966?",altQuestion:"¿Quién fue campeón del Mundial de 1966?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 1966?",answer:"Inglaterra",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 1998?",altQuestion:"¿Quién fue campeón del Mundial de Francia 1998?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 1998?",answer:"Francia",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 2006?",altQuestion:"¿Quién fue campeón del Mundial de Alemania 2006?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 2006?",answer:"Italia",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 2010?",altQuestion:"¿Quién fue campeón del Mundial de Sudáfrica 2010?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 2010?",answer:"España",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó el Mundial de 2014?",altQuestion:"¿Quién fue campeón del Mundial de Brasil 2014?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 2014?",answer:"Alemania",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué inglés ganó la Bota de Oro del Mundial 2018?",altQuestion:"¿Quién fue máximo goleador del Mundial de Rusia 2018?",thirdQuestion:"¿Qué delantero inglés ganó la Bota de Oro en 2018?",answer:"Harry Kane",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué francés ganó la Bota de Oro del Mundial 2022?",altQuestion:"¿Quién fue el máximo goleador de Catar 2022?",thirdQuestion:"¿Qué delantero francés terminó como goleador del Mundial 2022?",answer:"Kylian Mbappé",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué portugués ganó la Bota de Oro del Mundial 1966?",altQuestion:"¿Quién fue el máximo goleador de Inglaterra 1966?",thirdQuestion:"¿Qué leyenda portuguesa terminó como goleador del Mundial 1966?",answer:"Eusébio",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué alemán ganó la Bota de Oro del Mundial 1970?",altQuestion:"¿Quién fue máximo goleador de México 1970?",thirdQuestion:"¿Qué delantero alemán terminó como goleador del Mundial 1970?",answer:"Gerd Müller",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué francés ganó el Balón de Oro de 1998?",altQuestion:"¿Quién recibió el Balón de Oro en 1998?",thirdQuestion:"¿Qué estrella francesa ganó el premio en 1998?",answer:"Zinedine Zidane",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué croata ganó el Balón de Oro de 2018?",altQuestion:"¿Quién recibió el Balón de Oro en 2018?",thirdQuestion:"¿Qué capitán de Croacia fue Balón de Oro en 2018?",answer:"Luka Modrić",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué francés ganó el Balón de Oro de 2022?",altQuestion:"¿Quién recibió el Balón de Oro en 2022?",thirdQuestion:"¿Qué delantero francés fue Balón de Oro en 2022?",answer:"Karim Benzema",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué portugués ganó el Balón de Oro de 2008?",altQuestion:"¿Quién recibió el Balón de Oro en 2008?",thirdQuestion:"¿Qué estrella portuguesa ganó el premio en 2008?",answer:"Cristiano Ronaldo",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué checo ganó el Balón de Oro de 2003?",altQuestion:"¿Quién recibió el Balón de Oro en 2003?",thirdQuestion:"¿Qué jugador de República Checa ganó el premio en 2003?",answer:"Pavel Nedvěd",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué italiano ganó el Balón de Oro de 2006?",altQuestion:"¿Quién recibió el Balón de Oro en 2006?",thirdQuestion:"¿Qué capitán de Italia fue Balón de Oro en 2006?",answer:"Fabio Cannavaro",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué inglés ganó el Balón de Oro de 2001?",altQuestion:"¿Quién recibió el Balón de Oro en 2001?",thirdQuestion:"¿Qué futbolista inglés ganó el premio en 2001?",answer:"Michael Owen",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 2026?",altQuestion:"¿Qué jugador terminó como máximo goleador de la Copa del Mundo 2026?",thirdQuestion:"¿Qué delantero recibió el adidas Golden Boot de 2026?",answer:"Kylian Mbappé",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2016?",altQuestion:"¿Quién fue campeón de la Euro 2016?",thirdQuestion:"¿Qué país ganó el torneo europeo de 2016?",answer:"Portugal",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2008?",altQuestion:"¿Quién fue campeón de la Euro 2008?",thirdQuestion:"¿Qué país ganó el torneo europeo de 2008?",answer:"España",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2012?",altQuestion:"¿Quién fue campeón de la Euro 2012?",thirdQuestion:"¿Qué país ganó la Eurocopa de 2012?",answer:"España",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene más Copas de Europa/Champions League?",altQuestion:"¿Quién lidera el historial de títulos de la Champions?",thirdQuestion:"¿Qué club ganó más veces la principal copa europea de clubes?",answer:"Real Madrid",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene siete Copas de Europa/Champions League?",altQuestion:"¿Qué equipo ganó siete veces la Champions?",thirdQuestion:"¿Qué club suma siete títulos de la máxima copa europea?",answer:"Milan",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene seis Copas de Europa/Champions League?",altQuestion:"¿Qué equipo ganó seis veces la Champions?",thirdQuestion:"¿Qué club suma seis títulos de la máxima copa europea?",answer:"Liverpool",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club alemán tiene seis Copas de Europa/Champions League?",altQuestion:"¿Qué equipo alemán ganó seis veces la Champions?",thirdQuestion:"¿Qué club de Alemania suma seis títulos europeos?",answer:"Bayern Múnich",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club español ganó cinco Copas de Europa/Champions League?",altQuestion:"¿Qué equipo español suma cinco títulos de Champions?",thirdQuestion:"¿Qué club español ganó cinco veces la máxima copa europea?",answer:"Barcelona",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club neerlandés ganó cuatro Copas de Europa/Champions League?",altQuestion:"¿Qué equipo de Países Bajos suma cuatro Champions?",thirdQuestion:"¿Qué club neerlandés ganó cuatro veces la máxima copa europea?",answer:"Ajax",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué jugador ganó el Balón de Oro de 2000?",altQuestion:"¿Quién recibió el Balón de Oro en 2000?",thirdQuestion:"¿Qué estrella portuguesa ganó el premio en el año 2000?",answer:"Luís Figo",cat:"Balón de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Quién ganó el Balón de Oro del Mundial 2022?",altQuestion:"¿Qué jugador fue elegido mejor jugador del Mundial de 2022?",thirdQuestion:"¿Qué argentino recibió el Balón de Oro de Catar 2022?",answer:"Lionel Messi",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Sudamérica",question:"¿Quién ganó el Balón de Oro del Mundial 2014?",altQuestion:"¿Qué jugador fue elegido mejor futbolista de Brasil 2014?",thirdQuestion:"¿Qué argentino recibió el Balón de Oro del Mundial 2014?",answer:"Lionel Messi",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Sudamérica",question:"¿Quién ganó el Balón de Oro del Mundial 2010?",altQuestion:"¿Qué jugador fue elegido mejor jugador de Sudáfrica 2010?",thirdQuestion:"¿Qué uruguayo recibió el premio al mejor jugador de 2010?",answer:"Diego Forlán",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Sudamérica",question:"¿Quién ganó la Bota de Oro del Mundial 2002?",altQuestion:"¿Qué jugador fue máximo goleador de Corea-Japón 2002?",thirdQuestion:"¿Qué brasileño terminó como goleador del Mundial 2002?",answer:"Ronaldo Nazário",cat:"Bota de Oro"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1970?",altQuestion:"¿Quién fue campeón de la Copa del Mundo de México 1970?",thirdQuestion:"¿Qué país ganó el Mundial de 1970?",answer:"Brasil",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección fue cuarta en el Mundial 2010?",altQuestion:"¿Qué selección sudamericana terminó cuarta en Sudáfrica 2010?",thirdQuestion:"¿Qué país perdió el partido por el tercer puesto de 2010?",answer:"Uruguay",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección perdió ante Bélgica en cuartos del Mundial 2018?",altQuestion:"¿Qué país sudamericano quedó eliminado por Bélgica en Rusia 2018?",thirdQuestion:"¿Quién cayó 2-1 ante Bélgica en los cuartos de 2018?",answer:"Brasil",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2024?",altQuestion:"¿Quién fue campeón de la Copa América 2024?",thirdQuestion:"¿Qué país ganó la edición de 2024?",answer:"Argentina",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2019?",altQuestion:"¿Quién fue campeón de la Copa América de 2019?",thirdQuestion:"¿Qué país levantó el título continental en 2019?",answer:"Brasil",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 2007?",altQuestion:"¿Quién fue campeón del torneo sudamericano de 2007?",thirdQuestion:"¿Qué país ganó la Copa América 2007?",answer:"Brasil",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó la Copa América 1993?",altQuestion:"¿Quién fue campeón de la Copa América de 1993?",thirdQuestion:"¿Qué país ganó el torneo sudamericano de 1993?",answer:"Argentina",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club ganó siete veces la Copa Libertadores?",altQuestion:"¿Qué club tiene el récord de títulos de Libertadores?",thirdQuestion:"¿Quién lidera el historial de Copas Libertadores?",answer:"Independiente",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club ganó seis veces la Copa Libertadores?",altQuestion:"¿Qué equipo argentino tiene seis Libertadores?",thirdQuestion:"¿Qué club suma seis títulos de Libertadores?",answer:"Boca Juniors",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club uruguayo ganó cinco Copas Libertadores?",altQuestion:"¿Qué equipo de Uruguay tiene cinco Libertadores?",thirdQuestion:"¿Qué club uruguayo levantó cinco veces la Libertadores?",answer:"Peñarol",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club argentino ganó cuatro Copas Libertadores?",altQuestion:"¿Qué equipo argentino suma cuatro Libertadores?",thirdQuestion:"¿Qué club tiene cuatro títulos de Libertadores?",answer:"River Plate",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club uruguayo ganó tres Copas Libertadores?",altQuestion:"¿Qué equipo de Uruguay suma tres Libertadores?",thirdQuestion:"¿Qué club uruguayo ganó tres veces la máxima copa sudamericana?",answer:"Nacional",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Quién es el máximo goleador histórico de la Copa Libertadores?",altQuestion:"¿Qué jugador lidera la tabla histórica de goleadores de la Libertadores?",thirdQuestion:"¿Quién marcó más goles en la historia de la Copa Libertadores?",answer:"Alberto Spencer",cat:"Copa Libertadores"},
  {type:"basic",region:"Europa",question:"¿Quién ganó el Balón de Oro del Mundial 2026?",altQuestion:"¿Qué jugador recibió el premio al mejor jugador de la Copa del Mundo 2026?",thirdQuestion:"¿Qué español ganó el adidas Golden Ball del Mundial 2026?",answer:"Rodri",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Sudamérica",question:"¿Qué jugador argentino marcó cuatro goles en el Mundial 1994?",altQuestion:"¿Qué delantero argentino convirtió cuatro tantos en Estados Unidos 1994?",thirdQuestion:"¿Quién anotó cuatro goles con Argentina en el Mundial 1994?",answer:"Gabriel Batistuta",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club brasileño ganó la Libertadores 2020?",altQuestion:"¿Quién fue campeón de la Copa Libertadores 2020?",thirdQuestion:"¿Qué equipo brasileño ganó la edición 2020?",answer:"Palmeiras",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué club brasileño ganó la Libertadores 2022?",altQuestion:"¿Quién fue campeón de la Copa Libertadores 2022?",thirdQuestion:"¿Qué equipo ganó la edición 2022?",answer:"Flamengo",cat:"Copa Libertadores"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección ganó el Mundial de 1962?",altQuestion:"¿Quién fue campeón de Chile 1962?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 1962?",answer:"Brasil",cat:"Mundiales"},

  {type:"basic",region:"Europa",question:"¿Quién ganó el Balón de Oro del Mundial 2006?",altQuestion:"¿Qué jugador fue elegido mejor futbolista de Alemania 2006?",thirdQuestion:"¿Qué francés recibió el Balón de Oro del Mundial 2006?",answer:"Zinedine Zidane",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Europa",question:"¿Quién ganó el Balón de Oro del Mundial 2002?",altQuestion:"¿Qué jugador fue elegido mejor futbolista de Corea-Japón 2002?",thirdQuestion:"¿Qué arquero alemán recibió el premio en 2002?",answer:"Oliver Kahn",cat:"Balón de Oro del Mundial"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 2006?",altQuestion:"¿Qué jugador fue máximo goleador de Alemania 2006?",thirdQuestion:"¿Qué delantero alemán terminó como goleador del Mundial 2006?",answer:"Miroslav Klose",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 1982?",altQuestion:"¿Qué jugador fue máximo goleador de España 1982?",thirdQuestion:"¿Qué italiano terminó como goleador del Mundial 1982?",answer:"Paolo Rossi",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 1986?",altQuestion:"¿Qué jugador fue máximo goleador de México 1986?",thirdQuestion:"¿Qué inglés terminó como goleador del Mundial 1986?",answer:"Gary Lineker",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 1990?",altQuestion:"¿Qué jugador fue máximo goleador de Italia 1990?",thirdQuestion:"¿Qué italiano terminó como goleador del Mundial 1990?",answer:"Salvatore Schillaci",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Quién ganó la Bota de Oro del Mundial 2010?",altQuestion:"¿Qué jugador fue máximo goleador de Sudáfrica 2010?",thirdQuestion:"¿Qué alemán terminó como goleador del Mundial 2010?",answer:"Thomas Müller",cat:"Bota de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 1988?",altQuestion:"¿Quién fue campeón de la Euro 1988?",thirdQuestion:"¿Qué país ganó el torneo europeo de 1988?",answer:"Países Bajos",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 1992?",altQuestion:"¿Quién fue campeón de la Euro 1992?",thirdQuestion:"¿Qué país ganó la Eurocopa de 1992?",answer:"Dinamarca",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2000?",altQuestion:"¿Quién fue campeón de la Euro 2000?",thirdQuestion:"¿Qué país ganó el torneo europeo de 2000?",answer:"Francia",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2004?",altQuestion:"¿Quién fue campeón de la Euro 2004?",thirdQuestion:"¿Qué país sorprendió y ganó el torneo europeo de 2004?",answer:"Grecia",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2020?",altQuestion:"¿Quién fue campeón de la Euro 2020?",thirdQuestion:"¿Qué país ganó el torneo que terminó en 2021?",answer:"Italia",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué club ganó la Champions League 1999?",altQuestion:"¿Quién fue campeón de Europa en 1999?",thirdQuestion:"¿Qué equipo ganó la final de Barcelona 1999?",answer:"Manchester United",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club ganó la Champions League 2005?",altQuestion:"¿Quién fue campeón de Europa en 2005?",thirdQuestion:"¿Qué equipo protagonizó la remontada de Estambul en 2005?",answer:"Liverpool",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club ganó la Champions League 2012?",altQuestion:"¿Quién fue campeón de Europa en 2012?",thirdQuestion:"¿Qué equipo ganó la final de Múnich 2012?",answer:"Chelsea",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club ganó la Champions League 2020?",altQuestion:"¿Quién fue campeón de Europa en 2020?",thirdQuestion:"¿Qué equipo ganó la final de Lisboa 2020?",answer:"Bayern Múnich",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué jugador portugués ganó el Balón de Oro de 2013?",altQuestion:"¿Quién recibió el Balón de Oro en 2013?",thirdQuestion:"¿Qué portugués ganó el premio en 2013?",answer:"Cristiano Ronaldo",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué alemán ganó el Balón de Oro de 1990?",altQuestion:"¿Quién recibió el Balón de Oro en 1990?",thirdQuestion:"¿Qué capitán alemán fue Balón de Oro en 1990?",answer:"Lothar Matthäus",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué alemán ganó el Balón de Oro de 1996?",altQuestion:"¿Quién recibió el Balón de Oro en 1996?",thirdQuestion:"¿Qué defensor alemán ganó el premio en 1996?",answer:"Matthias Sammer",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué ucraniano ganó el Balón de Oro de 2004?",altQuestion:"¿Quién recibió el Balón de Oro en 2004?",thirdQuestion:"¿Qué delantero ucraniano ganó el premio en 2004?",answer:"Andriy Shevchenko",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué arquero ganó el Guante de Oro del Mundial 2026?",altQuestion:"¿Quién recibió el premio al mejor arquero de la Copa del Mundo 2026?",thirdQuestion:"¿Qué portero español ganó el adidas Golden Glove de 2026?",answer:"Unai Simón",cat:"Mundiales"},
  {type:"basic",region:"Europa",question:"¿Qué jugador tiene más partidos en la historia de los Mundiales tras 2026?",altQuestion:"¿Quién lidera el récord de apariciones mundialistas?",thirdQuestion:"¿Qué jugador ocupa el primer puesto en partidos jugados en la Copa del Mundo?",answer:"Lionel Messi",cat:"Mundiales"}
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
  {player:"Jonathan David",team:"Canadá",opponent:"Catar",year:"2026",cat:"Hat-tricks"},
  {player:"Ousmane Dembélé",team:"Francia",opponent:"Noruega",year:"2026",cat:"Hat-tricks"},
  {player:"Bukayo Saka",team:"Inglaterra",opponent:"Francia",year:"2026",cat:"Hat-tricks"}
];

const COUNTRY_ANSWERS=new Set([
  "Uruguay","Italia","Alemania Occidental","Brasil","Inglaterra","Argentina","Francia","España","Alemania","Croacia",
  "Portugal","Chile","Colombia","Catar","Países Bajos","Dinamarca","Grecia","Rusia","Canadá","Noruega"
]);
const TOURNAMENT_POOL=["Copa Mundial de la FIFA","Copa América","Eurocopa","Copa Libertadores","UEFA Champions League"];

function answerEntity(f){
  if(f.type==="wcWinner"||f.type==="tournament")return "nation";
  if(f.type==="legend")return "player";
  if(f.type==="club")return "club";
  if(f.type==="rule")return "rule";
  if(f.cat==="Champions")return "club";
  if(f.cat==="Copa Libertadores")return /jugador|máximo goleador|tabla histórica|marcó más goles/i.test(f.question||"")?"player":"club";
  if(f.cat==="Copa América"||f.cat==="Eurocopa")return "nation";
  if(f.cat==="Balón de Oro"||f.cat==="Balón de Oro del Mundial"||f.cat==="Bota de Oro"||f.cat==="Leyendas"||f.cat==="Hat-tricks")return "player";
  if(f.cat==="Mundiales")return COUNTRY_ANSWERS.has(f.answer)?"nation":(f.answer==="Copa Mundial de la FIFA"?"tournament":"player");
  return "general";
}

function smartQuestion(text,f){
  const entity=answerEntity(f);
  if(entity==="player"){
    return text.replace(/\b(brasileñ[oa]|argentino|argentina|uruguayo|uruguaya|francés|francesa|croata|portugués|portuguesa|inglés|inglesa|italiano|italiana|alem[aá]n|alemana|checo|checa|ucraniano|ucraniana|colombiano|colombiana|chileno|chilena)\b/gi,"").replace(/\s{2,}/g," ");
  }
  if(entity==="club"){
    return text.replace(/\b(español|española|inglés|inglesa|italiano|italiana|alemán|alemana|neerlandés|neerlandesa|uruguayo|uruguaya|argentino|argentina|brasileño|brasileña)\b/gi,"").replace(/\s{2,}/g," ");
  }
  return text;
}

function optionSet(pool,answer,seed){
  const unique=[...new Set(pool)].filter(x=>x!==answer);
  if(unique.length<2) throw new Error("No hay suficientes opciones para una pregunta");
  const a=unique[seed%unique.length];
  let b=unique[(seed+1)%unique.length];
  if(b===a)b=unique[(seed+2)%unique.length];
  const values=[answer,a,b],shift=seed%3;
  const options=[values[shift],values[(shift+1)%3],values[(shift+2)%3]];
  return {options,correct:options.indexOf(answer)};
}

function expandSimple(facts,difficulty,templates){
  const allFacts=[...facts];
  const globalPools={player:[],club:[],nation:[],rule:[],tournament:TOURNAMENT_POOL};
  const categoryPools=new Map();
  for(const fact of allFacts){
    const entity=answerEntity(fact);
    const answer=fact.answer;
    if(globalPools[entity])globalPools[entity].push(answer);
    const key=fact.cat+"|"+entity;
    if(!categoryPools.has(key))categoryPools.set(key,[]);
    categoryPools.get(key).push(answer);
  }
  for(const key of Object.keys(globalPools))globalPools[key]=[...new Set(globalPools[key])];
  for(const [key,pool] of categoryPools)categoryPools.set(key,[...new Set(pool)]);
  const out=[];
  facts.forEach((fact,i)=>{
    const entity=answerEntity(fact),key=fact.cat+"|"+entity;
    const categoryPool=categoryPools.get(key)||[];
    const globalPool=globalPools[entity]||allFacts.map(f=>f.answer);
    const usable=categoryPool.filter(x=>x!==fact.answer);
    const pool=usable.length>=2?categoryPool:(entity==="tournament"?TOURNAMENT_POOL:globalPool);
    for(let v=0;v<3;v++){
      const answer=fact.answer;
      const question=smartQuestion(templates[fact.type][v](fact),fact);
      const set=optionSet(pool,answer,i+v);
      out.push([fact.cat,question,set.options,set.correct,difficulty]);
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
    out.push([f.cat,"¿Qué jugador hizo un hat-trick contra "+f.opponent+" en el Mundial de "+f.year+"?",a.options,a.correct,"imposible"]);
    const b=optionSet(opponentPool,f.opponent,i+1);
    out.push([f.cat,"¿Contra qué selección hizo el hat-trick "+f.player+" en "+f.year+"?",b.options,b.correct,"imposible"]);
    const c=optionSet(teamPool,f.team,i+2);
    out.push([f.cat,"¿Qué selección representaba "+f.player+" cuando hizo el hat-trick contra "+f.opponent+" en "+f.year+"?",c.options,c.correct,"imposible"]);
  });
  return out;
}
const EASY=expandSimple(EASY_FACTS,"facil",SIMPLE_TEMPLATES);
const NORMAL=expandSimple(NORMAL_FACTS,"dificil",SIMPLE_TEMPLATES);
const IMPOSSIBLE=expandImpossible(IMPOSSIBLE_FACTS);

const FAMOUS_HATTRICK_NORMAL_INDEXES=new Set([21,24,25,26,27,35,37,42,43,44,45,47,48,50,51,52,53,54,56,57]);
const HARD_NORMAL_KEYS=new Set([
  "Pavel Nedvěd|Balón de Oro","Fabio Cannavaro|Balón de Oro","Michael Owen|Balón de Oro","Andriy Shevchenko|Balón de Oro",
  "Luís Figo|Balón de Oro","Lothar Matthäus|Balón de Oro","Matthias Sammer|Balón de Oro",
  "Independiente|Copa Libertadores","Boca Juniors|Copa Libertadores","Peñarol|Copa Libertadores","River Plate|Copa Libertadores",
  "Nacional|Copa Libertadores","Alberto Spencer|Copa Libertadores","Zinedine Zidane|Balón de Oro del Mundial","Oliver Kahn|Balón de Oro del Mundial",
  "Miroslav Klose|Bota de Oro","Paolo Rossi|Bota de Oro","Gary Lineker|Bota de Oro","Salvatore Schillaci|Bota de Oro","Thomas Müller|Bota de Oro"
]);
const HARD_NORMAL_FACT_INDEXES=new Set(NORMAL_FACTS.map((f,i)=>HARD_NORMAL_KEYS.has(String(f.answer)+"|"+String(f.cat))?i:-1).filter(i=>i>=0));

function grouped(list){const groups=[];for(let i=0;i<list.length;i+=3)groups.push(list.slice(i,i+3));return groups}
function remapDifficulty(q,difficulty){return [q[0],q[1],q[2],q[3],difficulty]}
function uniqueQuestions(list){
  const used=new Set(),dupCount=new Map();
  return list.map((q,i)=>{
    let text=q[1],count=dupCount.get(text)||0;
    if(count>0){
      const year=(String(text).match(/\b(?:19|20)\d{2}\b/)||[])[0];
      let candidate=(year?"En el registro de "+year+", ":"Dato histórico: ")+text.charAt(0).toLowerCase()+text.slice(1);
      let n=1;
      while(used.has(candidate))candidate+=" · variante "+(++n);
      text=candidate;
    }
    dupCount.set(q[1],count+1);used.add(text);
    return [q[0],text,q[2],q[3],q[4]];
  });
}
const normalGroups=grouped(NORMAL),impossibleGroups=grouped(IMPOSSIBLE);
const normalKeep=normalGroups.filter((_,i)=>!HARD_NORMAL_FACT_INDEXES.has(i)).flat().map(q=>remapDifficulty(q,"dificil"));
const normalFromHattricks=impossibleGroups.filter((_,i)=>FAMOUS_HATTRICK_NORMAL_INDEXES.has(i)).flat().map(q=>remapDifficulty(q,"dificil"));
const impossibleKeep=impossibleGroups.filter((_,i)=>!FAMOUS_HATTRICK_NORMAL_INDEXES.has(i)).flat().map(q=>remapDifficulty(q,"imposible"));
const impossibleFromNormal=normalGroups.filter((_,i)=>HARD_NORMAL_FACT_INDEXES.has(i)).flat().map(q=>remapDifficulty(q,"imposible"));
const EASY_FINAL=EASY.map(q=>remapDifficulty(q,"facil"));
const NORMAL_FINAL=uniqueQuestions([...normalKeep,...normalFromHattricks]);
const IMPOSSIBLE_FINAL=uniqueQuestions([...impossibleKeep,...impossibleFromNormal]);
if(HARD_NORMAL_FACT_INDEXES.size!==20||NORMAL_FINAL.length!==300||IMPOSSIBLE_FINAL.length!==174||EASY_FINAL.length!==168)throw new Error("Dificultad desbalanceada");

const BLASSVEC = [
  ["Blassvec","¿Qué deporte juega Lionel Messi?",["Fútbol","Tenis","Básquetbol"],0,"blassvec"],
  ["Blassvec","¿Con qué se juega principalmente al fútbol?",["Pelota","Raqueta","Bate"],0,"blassvec"],
  ["Blassvec","¿Cuántos equipos juegan un partido de fútbol?",["Dos","Tres","Cuatro"],0,"blassvec"],
  ["Blassvec","¿Cuántos jugadores tiene un equipo en cancha?",["11","7","15"],0,"blassvec"],
  ["Blassvec","¿Qué se intenta marcar en fútbol?",["Goles","Canastas","Puntos"],0,"blassvec"],
  ["Blassvec","¿Quién puede usar las manos dentro de su área?",["Arquero","Delantero","Mediocampista"],0,"blassvec"],
  ["Blassvec","¿Qué tarjeta es una expulsión?",["Roja","Amarilla","Azul"],0,"blassvec"],
  ["Blassvec","¿Qué tarjeta es una advertencia?",["Amarilla","Roja","Verde"],0,"blassvec"],
  ["Blassvec","¿Cómo se llama el lugar donde se juega al fútbol?",["Cancha","Piscina","Pista"],0,"blassvec"],
  ["Blassvec","¿Cómo se llama el jugador que ataja?",["Arquero","Delantero","Árbitro"],0,"blassvec"],
  ["Blassvec","¿Qué parte del cuerpo usa normalmente un jugador de campo?",["Pie","Aleta","Raqueta"],0,"blassvec"],
  ["Blassvec","¿Qué hace el árbitro para detener una jugada?",["Usa el silbato","Patea la pelota","Se pone a correr"],0,"blassvec"],
  ["Blassvec","¿Cómo se llama el saque que se hace desde una esquina?",["Córner","Lateral","Penal"],0,"blassvec"],
  ["Blassvec","¿Cómo se llama el tiro desde los 11 metros?",["Penal","Córner","Lateral"],0,"blassvec"],
  ["Blassvec","¿Cuánto dura normalmente un partido?",["90 minutos","30 minutos","120 minutos"],0,"blassvec"],
  ["Blassvec","¿Cuántos tiempos tiene un partido?",["2","3","4"],0,"blassvec"],
  ["Blassvec","¿Cuánto dura normalmente cada tiempo?",["45 minutos","20 minutos","60 minutos"],0,"blassvec"],
  ["Blassvec","¿Qué club es conocido como Real Madrid?",["Un club de fútbol","Una selección nacional","Un torneo"],0,"blassvec"],
  ["Blassvec","¿De qué país es la selección de Uruguay?",["Uruguay","Argentina","Brasil"],0,"blassvec"],
  ["Blassvec","¿De qué país es la selección de Argentina?",["Argentina","Chile","Paraguay"],0,"blassvec"],
  ["Blassvec","¿De qué país es la selección de Brasil?",["Brasil","Portugal","México"],0,"blassvec"],
  ["Blassvec","¿Qué jugador es conocido como O Rei?",["Pelé","Messi","Xavi"],0,"blassvec"],
  ["Blassvec","¿Quién es conocido como La Pulga?",["Lionel Messi","Pelé","Buffon"],0,"blassvec"],
  ["Blassvec","¿Qué selección viste tradicionalmente de celeste?",["Uruguay","Italia","Alemania"],0,"blassvec"],
  ["Blassvec","¿Qué se usa para marcar el resultado de un partido?",["Marcador","Termómetro","Calendario"],0,"blassvec"],
  ["Blassvec","Si un equipo marca un gol, ¿qué aumenta?",["Su cantidad de goles","Su número de jugadores","La duración del campo"],0,"blassvec"],
  ["Blassvec","¿Qué forma tiene una pelota de fútbol?",["Redonda","Cuadrada","Triangular"],0,"blassvec"],
  ["Blassvec","¿Qué objeto usa un arquero en las manos?",["Guantes","Raqueta","Casco de bicicleta"],0,"blassvec"],
  ["Blassvec","¿Qué palabra gritás cuando tu equipo marca?",["¡Gol!","¡Ace!","¡Canasta!"],0,"blassvec"],
  ["Blassvec","¿Cuántas porterías hay en una cancha de fútbol?",["Dos","Una","Cuatro"],0,"blassvec"]
];

if(EASY.length!==168 || NORMAL.length!==300 || IMPOSSIBLE.length!==174 || BLASSVEC.length!==30)
  throw new Error(`Banco inválido: fácil=${EASY.length}, normal=${NORMAL.length}, imposible=${IMPOSSIBLE.length}, blassvec=${BLASSVEC.length}`);

export const QUESTIONS=[...EASY_FINAL,...NORMAL_FINAL,...IMPOSSIBLE_FINAL,...BLASSVEC];
export const QUESTION_SETS={
  facil:EASY_FINAL.map((_,i)=>i),
  dificil:NORMAL_FINAL.map((_,i)=>EASY_FINAL.length+i),
  imposible:IMPOSSIBLE_FINAL.map((_,i)=>EASY_FINAL.length+NORMAL_FINAL.length+i),
  blassvec:BLASSVEC.map((_,i)=>EASY_FINAL.length+NORMAL_FINAL.length+IMPOSSIBLE_FINAL.length+i)
};
export const QUESTION_COUNTS={facil:EASY_FINAL.length,dificil:NORMAL_FINAL.length,imposible:IMPOSSIBLE_FINAL.length,blassvec:BLASSVEC.length};
