const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroesRoutes = require('./routes/heroesRoutes');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const app = new Hapi.Server({
  port: 4000,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroesSchema));

  const swaggerOptions = {
    info: {
      title: 'API Heróis - #CursoNodeBR',
      version: 'v1.0',
    },
    lang: 'pt',
  };

  await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.route(mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods()));

  await app.start();
  console.log('Servidor rodando na porta ', app.info.port);

  return app;
}

module.exports = main();
