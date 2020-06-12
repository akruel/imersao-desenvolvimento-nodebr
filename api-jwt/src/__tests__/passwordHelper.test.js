const assert = require('assert');
const PassworHelper = require('../helpers/passwordHelper');

const PASSWORD = 'senha';
const HASH = '$2b$04$6boenKIEAJoJTBpYJdG6OOChmTfgEM7/vMGVoPFYye3vzVN/6Ch1O';

describe('Password Helper', function () {
  it('Generate Hash', async () => {
    const result = await PassworHelper.hashPassword(PASSWORD);
    assert.ok(result);
  });

  it('Compare Password', async () => {
    const result = await PassworHelper.comparePassword(PASSWORD, HASH);
    assert.ok(result);
  });
});
