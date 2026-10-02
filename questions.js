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
  {type:"basic",region:"Sudamérica",question:"¿Qué uruguayo ganó el Balón de Oro del Mundial 2010?",altQuestion:"¿Quién fue elegido mejor jugador de Sudáfrica 2010?",thirdQuestion:"¿Qué jugador de Uruguay recibió el premio al mejor jugador del Mundial 2010?",answer:"Diego Forlán",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué jugador argentino marcó tres goles contra Grecia en el Mundial 1994?",altQuestion:"¿Qué delantero hizo un hat-trick ante Grecia en 1994?",thirdQuestion:"¿Quién convirtió tres goles ante Grecia en Estados Unidos 1994?",answer:"Gabriel Batistuta",cat:"Mundiales"},
  {type:"basic",region:"Sudamérica",question:"¿Qué brasileño fue capitán en varios Mundiales y ganó dos Copas del Mundo?",altQuestion:"¿Qué histórico lateral brasileño ganó los Mundiales de 1994 y 2002?",thirdQuestion:"¿Quién fue una figura de Brasil y ganó dos Mundiales?",answer:"Cafú",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Qué delantero colombiano es conocido como 'El Tigre'?",altQuestion:"¿A qué futbolista colombiano apodan 'El Tigre'?",thirdQuestion:"¿Quién es conocido como 'El Tigre' en Colombia?",answer:"Radamel Falcao",cat:"Leyendas"},
  {type:"basic",region:"Sudamérica",question:"¿Qué chileno fue una de las figuras de las Copas América 2015 y 2016?",altQuestion:"¿Qué delantero chileno destacó en los títulos continentales de 2015 y 2016?",thirdQuestion:"¿Qué estrella de Chile ganó esas dos Copas América?",answer:"Alexis Sánchez",cat:"Copa América"},
  {type:"basic",region:"Sudamérica",question:"¿Qué selección sudamericana ganó el Mundial de 1962?",altQuestion:"¿Quién fue campeón del Mundial de Chile 1962?",thirdQuestion:"¿Qué país ganó la Copa del Mundo de 1962?",answer:"Brasil",cat:"Mundiales"},
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
  {type:"basic",region:"Europa",question:"¿Qué ucraniano ganó el Balón de Oro de 2004?",altQuestion:"¿Quién recibió el Balón de Oro en 2004?",thirdQuestion:"¿Qué delantero de Ucrania ganó el premio en 2004?",answer:"Andriy Shevchenko",cat:"Balón de Oro"},
  {type:"basic",region:"Europa",question:"¿Qué portugués ganó la Eurocopa 2016?",altQuestion:"¿Quién fue campeón de la Euro 2016?",thirdQuestion:"¿Qué país ganó la Eurocopa de 2016?",answer:"Portugal",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2008?",altQuestion:"¿Quién fue campeón de la Euro 2008?",thirdQuestion:"¿Qué país ganó el torneo europeo de 2008?",answer:"España",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué selección ganó la Eurocopa 2012?",altQuestion:"¿Quién fue campeón de la Euro 2012?",thirdQuestion:"¿Qué país ganó la Eurocopa de 2012?",answer:"España",cat:"Eurocopa"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene más Copas de Europa/Champions League?",altQuestion:"¿Quién lidera el historial de títulos de la Champions?",thirdQuestion:"¿Qué club ganó más veces la principal copa europea de clubes?",answer:"Real Madrid",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene siete Copas de Europa/Champions League?",altQuestion:"¿Qué equipo ganó siete veces la Champions?",thirdQuestion:"¿Qué club suma siete títulos de la máxima copa europea?",answer:"Milan",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club tiene seis Copas de Europa/Champions League?",altQuestion:"¿Qué equipo ganó seis veces la Champions?",thirdQuestion:"¿Qué club suma seis títulos de la máxima copa europea?",answer:"Liverpool",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club alemán tiene seis Copas de Europa/Champions League?",altQuestion:"¿Qué equipo alemán ganó seis veces la Champions?",thirdQuestion:"¿Qué club de Alemania suma seis títulos europeos?",answer:"Bayern Múnich",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club español ganó cinco Copas de Europa/Champions League?",altQuestion:"¿Qué equipo español suma cinco títulos de Champions?",thirdQuestion:"¿Qué club español ganó cinco veces la máxima copa europea?",answer:"Barcelona",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué club neerlandés ganó cuatro Copas de Europa/Champions League?",altQuestion:"¿Qué equipo de Países Bajos suma cuatro Champions?",thirdQuestion:"¿Qué club neerlandés ganó cuatro veces la máxima copa europea?",answer:"Ajax",cat:"Champions"},
  {type:"basic",region:"Europa",question:"¿Qué jugador ganó el Balón de Oro de 2000?",altQuestion:"¿Quién recibió el Balón de Oro en 2000?",thirdQuestion:"¿Qué estrella portuguesa ganó el premio en el año 2000?",answer:"Luís Figo",cat:"Balón de Oro"}
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
    out.push([f.cat,`¿Qué jugador hizo un hat-trick contra ${f.opponent} en el Mundial de ${f.year}?`,a.options,a.correct,"imposible"]);
    const b=optionSet(opponentPool,f.opponent,i+1);
    out.push([f.cat,`¿Contra qué selección hizo el hat-trick ${f.player} en ${f.year}?`,b.options,b.correct,"imposible"]);
    const c=optionSet(teamPool,f.team,i+2);
    out.push([f.cat,`¿Qué selección representaba ${f.player} cuando hizo el hat-trick contra ${f.opponent} en ${f.year}?`,c.options,c.correct,"imposible"]);
  });
  return out;
}

const EASY=expandSimple(EASY_FACTS,"facil",SIMPLE_TEMPLATES);
const NORMAL=expandSimple(NORMAL_FACTS,"dificil",SIMPLE_TEMPLATES);
const IMPOSSIBLE=expandImpossible(IMPOSSIBLE_FACTS);

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

if(EASY.length!==168 || NORMAL.length!==168 || IMPOSSIBLE.length!==168 || BLASSVEC.length!==30)
  throw new Error(`Banco inválido: fácil=${EASY.length}, difícil=${HARD.length}, imposible=${IMPOSSIBLE.length}, blassvec=${BLASSVEC.length}`);

export const QUESTIONS=[...EASY,...HARD,...IMPOSSIBLE,...BLASSVEC];
export const QUESTION_SETS={
  facil:EASY.map((_,i)=>i),
  dificil:NORMAL.map((_,i)=>168+i),
  imposible:IMPOSSIBLE.map((_,i)=>336+i),
  blassvec:BLASSVEC.map((_,i)=>504+i)
};
export const QUESTION_COUNTS={facil:EASY.length,dificil:NORMAL.length,imposible:IMPOSSIBLE.length,blassvec:BLASSVEC.length};
