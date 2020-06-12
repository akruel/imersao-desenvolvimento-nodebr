const ICrud = require('../interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting',
};

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === STATUS[1]) return state;

    if (state !== STATUS[2]) return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];
  }

  static connect() {
    Mongoose.connect(
      'mongodb://admin:admin@localhost:27017',
      {
        useNewUrlParser: true,
      },
      (error) => {
        if (error) {
          console.error('Falha na conexão: ', error);
        } else {
          return;
        }
      },
    );
    const connection = Mongoose.connection;
    connection.once('open', () => console.log('database rodando!'));
    return connection;
  }

  async create(item) {
    return this._schema.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  async update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    if (id) {
      return this._schema.deleteOne({ _id: id });
    } else {
      return this._schema.deleteMany({});
    }
  }
}

module.exports = MongoDB;
