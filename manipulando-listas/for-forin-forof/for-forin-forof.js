const service = require('./service');

async function main() {
  try {
    const result = await service.obterPessoas('');
    const names = [];

    console.time('for');
    for (let i = 0; i <= result.results.length - 1; i++) {
      const element = result.results[i];
      names.push(element.name);
    }
    console.timeEnd('for');

    console.time('forIn');
    for (const name in result.results) {
      if (result.results.hasOwnProperty(name)) {
        const pessoa = result.results[name];
        names.push(pessoa);
      }
    }
    console.timeEnd('forIn');

    console.time('forOf');
    for (const pessoa of result.results) {
      names.push(pessoa.name)
    }
    console.timeEnd('forOf')
  } catch (error) {
    console.error('deu ruim: ', error);
  }
}

main();
