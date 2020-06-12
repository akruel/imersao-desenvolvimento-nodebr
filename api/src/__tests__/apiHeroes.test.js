const assert = require('assert');
const api = require('../api');

const MOCK_CREATE_HERO = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica',
};

const MOCK_INITIAL_HERO = {
  nome: 'Gavião Negro',
  poder: 'A mira',
};

let MOCK_ID = '';

describe('API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_INITIAL_HERO),
    });
    MOCK_ID = JSON.parse(result.payload)._id;
  });

  it('List /herois', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois',
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });

  it('List /herois with pagination', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois?skip=0&limit=1',
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.ok(statusCode, 200);
    assert.ok(data.length === 1);
  });

  it('Create /herois', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: MOCK_CREATE_HERO,
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(message, 'Herói cadastrado com sucesso!');
  });

  it('Update /herois', async () => {
    const updatePower = {
      poder: 'Super Mira',
    };
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${MOCK_ID}`,
      payload: updatePower,
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, 'Herói atualizado com sucesso!');
  });

  it('Delete /herois', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${MOCK_ID}`,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, 'Herói removido com sucesso!');
  });
});
