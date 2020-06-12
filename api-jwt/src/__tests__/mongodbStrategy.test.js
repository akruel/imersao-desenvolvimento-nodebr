const assert = require('assert');
const Mongodb = require('../db/strategies/mongodb/mongodb');
const HeroesSchema = require('../db/strategies/mongodb/schemas/heroesSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_CREATE_HEROES = { nome: 'Mulher Maravilha', poder: 'Laço' };
const MOCK_UPDATE_HEROES = { nome: 'Patolino', poder: 'Velocidade' };

let context = {};

let MOCK_HEROES_ID = '';

describe('MongoDB Strategy', () => {
  before(async () => {
    const connection = Mongodb.connect();
    context = new Context(new Mongodb(connection, HeroesSchema));
    await context.delete();
    MOCK_HEROES_ID = await context.create(MOCK_UPDATE_HEROES);
  });

  it('MongoDB Connection', async () => {
    const result = await context.isConnected();
    const expected = 'Connected';

    assert.deepEqual(result, expected);
  });

  it('Create', async () => {
    const { nome, poder } = await context.create(MOCK_CREATE_HEROES);
    assert.deepEqual({ nome, poder }, MOCK_CREATE_HEROES);
  });

  it('List', async () => {
    const [{ nome, poder }] = await context.read({
      nome: MOCK_CREATE_HEROES.nome,
    });
    const result = { nome, poder };

    assert.deepEqual(result, MOCK_CREATE_HEROES);
  });

  it('Update', async () => {
    const result = await context.update(MOCK_HEROES_ID, {
      nome: 'Pernalonga',
    });
    assert.deepEqual(result.nModified, 1);
  });

  it('Delete', async () => {
    const result = await context.delete(MOCK_HEROES_ID);
    assert.deepEqual(result.n, 1);
  });
});
