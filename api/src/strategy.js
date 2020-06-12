class NotImplementendException extends Error {
  constructor() {
    super('Not Implemented Exception');
  }
}

const contextMongo = new ContextStrategy(new MongoDB());
const contextPostgres = new ContextStrategy(new Postgres());
contextMongo.create();
contextPostgres.create();
