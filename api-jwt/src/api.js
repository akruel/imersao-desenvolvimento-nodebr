const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroesRoutes = require('./routes/heroesRoutes');
const AuthRoutes = require('./routes/authRoutes');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');
const JWT_SECRET = 'MEU_SEGREDO_123';
const Postgres = require('./db/strategies/postgres/postgres');
const UsersSchema = require('./db/strategies/postgres/schemas/usersSchema');

const app = new Hapi.Server({
  port: 5000,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroesSchema));

  const connectionPostgres = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPostgres, UsersSchema);
  const contextPostgres = new Context(new Postgres(connectionPostgres, model));

  const swaggerOptions = {
    info: {
      title: 'API Heróis - #CursoNodeBR',
      version: 'v1.0',
    },
    lang: 'pt',
  };

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20,
    // },
    validate: async (data, request) => {
      const result = await contextPostgres.read({
        username: data.username.toLowerCase(),
      });

      if (!result) {
        return { isValid: false };
      } else {
        return { isValid: true };
      }
    },
  });
  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods()),
    ...mapRoutes(
      new AuthRoutes(JWT_SECRET, contextPostgres),
      AuthRoutes.methods(),
    ),
  ]);

  await app.start();
  console.log('Servidor rodando na porta ', app.info.port);

  return app;
}

module.exports = main();
