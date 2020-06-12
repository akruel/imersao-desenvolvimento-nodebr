const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UsersSchema = require('../db/strategies/postgres/schemas/usersSchema');
const HeroesSchema = require('../db/strategies/postgres/schemas/heroesSchema');

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGEiLCJpZCI6MSwiaWF0IjoxNTkxOTIzMzAwfQ.y8WXp3rP8_vdjR-TqatS7nlv9YPe7QGWa5Eszo16GMo';

const JWT_PAYLOAD = 1;

const USER = {
  username: 'xuxa',
  password: 'senha',
};

const USER_DB = {
  ...USER,
  password: '$2b$04$6boenKIEAJoJTBpYJdG6OOChmTfgEM7/vMGVoPFYye3vzVN/6Ch1O',
};

let app = {};

describe('Auth API Heroes', function () {
  this.beforeAll(async () => {
    app = await require('./api.test');
    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsersSchema);
    context = new Context(new Postgres(connectionPostgres, model));
    await context.update(null, USER_DB, true);
  });

  it('Obtain token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER,
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data.token[JWT_PAYLOAD], TOKEN[JWT_PAYLOAD]);
  });

  it('Not authorized', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'invalid',
        password: 'invalid',
      },
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.deepEqual(data.error, 'Unauthorized');
  });
});
