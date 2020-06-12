// const Sequelize = require('sequelize');
// const driver = new Sequelize('heroes', 'andersonkruel', 'postgresdb', {
//   host: 'localhost',
//   dialect: 'postgres',
//   quoteIdentifiers: false,
//   operatorAliases: false,
// });

// async function main() {
//   await Herois.sync();

//   const result = await Herois.findAll({ raw: true });
//   console.log(result);
// }

// main();

const Mongoose = require('mongoose');
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
const heroesSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  poder: {
    type: String,
    required: true,
  },
  insertedAt: {
    type: Date,
    default: new Date(),
  },
});

const model = Mongoose.model('heroes', heroesSchema);

async function main() {
  const resultCreate = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro',
  });

  const listItems = await model.find();

  console.log('items: ', listItems);

  console.log(resultCreate);
}

main();
