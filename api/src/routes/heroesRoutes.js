const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const failAction = (request, headers, erro) => {
  throw erro;
};

class HeroesRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar heróis',
        notes: 'Pode paginar resultados e filtrar por nome',
        validate: {
          failAction,
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          },
        },
      },
      handler: (request, head) => {
        try {
          const { skip, limit, nome } = request.query;
          return this.db.read(
            nome ? { nome: { $regex: `.*${nome}*.` } } : {},
            skip,
            limit,
          );
        } catch (error) {
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Deve cadastrar herói',
        notes: 'deve cadastrar herói por nome e poder',
        validate: {
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });
          return {
            _id: result._id,
            message: 'Herói cadastrado com sucesso!',
          };
        } catch (error) {
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Deve atualizar herói por id',
        notes: 'deve atualizar herói por nome e/ou poder',
        validate: {
          params: {
            id: Joi.string().required(),
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;

          const stringData = JSON.stringify(payload);
          const data = JSON.parse(stringData);
          const result = await this.db.update(id, data);
          return { message: 'Herói atualizado com sucesso!' };
        } catch (error) {
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deve deletar herói',
        notes: 'deve deletar herói por id',
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);
          return { message: 'Herói removido com sucesso!' };
        } catch (error) {
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroesRoutes;
