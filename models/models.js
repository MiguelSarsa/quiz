var path = require('path');

// Postgres DATABASE_URL = postgress:://user:passwd@host:port/DATABASE_URL
// SQLite DATABASE_URL = sqlite://:@/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6]||null);
var user      = (url[2]||null);
var pwd       = (url[3]||null);
var protocol  = (url[1]||null);
var dialect   = (url[1]||null);
var host      = (url[5]||null);
var port      = (url[4]||null);
var storage   = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
      { dialect: protocol,
        protocol: protocol,
        port: port,
        host: host,
        storage: storage,   // solo SQLite (.env)
        omitNUll: true      // solo Postgres
      }
);

// Importar la definici�n de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//var Quiz = sequelize.import(path.join(__dirname, 'quiz');

exports.Quiz = Quiz; // exportar definici�n de tabla Quiz

// sequelize.sync() crea e inicializa la tabla de preguntas de la BBDD
sequelize.sync().then(function(){
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0){    // la tabla se inicializa s�lo si est� vac�a
      Quiz.create({ pregunta: 'Capital de Italia?', respuesta: 'Roma'});
      Quiz.create({ pregunta: 'Capital de Portugal?', respuesta: 'Lisboa'})
      .then(function(){console.log('Base de datos inicializada');});
    };
  });
});