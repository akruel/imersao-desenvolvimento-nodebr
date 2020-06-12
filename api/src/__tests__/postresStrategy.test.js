const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroesSchema = require('../db/strategies/postgres/schemas/heroesSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_CREATE_HEROES = { nome: 'Gavião Negro', poder: 'Flexas' };
const MOCK_UPDATE_HEROES = { nome: 'Batman', poder: 'Dinheiro' };

let context = {};

describe('Postgres Strategy', () => {
  before(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroesSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_UPDATE_HEROES);
  });
  it('PostgresSQL Connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('Create', async () => {
    const result = await context.create(MOCK_CREATE_HEROES);
    delete result.id;
    assert.deepEqual(result, MOCK_CREATE_HEROES);
  });

  it('List', async () => {
    await context.create(MOCK_CREATE_HEROES);
    const [result] = await context.read({ nome: MOCK_CREATE_HEROES.nome });
    delete result.id;
    assert.deepEqual(result, MOCK_CREATE_HEROES);
  });

  it('Update', async () => {
    const [itemToUpdate] = await context.read({
      nome: MOCK_UPDATE_HEROES.nome,
    });
    const newItem = {
      ...MOCK_UPDATE_HEROES,
      nome: 'Mulher Maravilha',
    };
    const [result] = await context.update(itemToUpdate.id, newItem);
    const [updatedItem] = await context.read({ id: itemToUpdate.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(updatedItem.nome, newItem.nome);
  });

  it('Delete', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
