'use strict';
const mysql = require('../_core/mysql');
const { misc } = require('../_core/utils');
const model = {};


model.no = async (account, password) => {    
  const conn = await mysql.conn();
  const [accounts] = await conn.query(`
    SELECT account_no AS accountNo FROM t_accounts WHERE account = ? AND password = PASSWORD(?)
  `, [account, password]);       
  if (accounts.length === 0) {
    return null;
  }
  return accounts[0].accountNo;
}
model.authKey = async (accountNo) => {    
  const conn = await mysql.conn();
  const randomNumber = misc.randomInt(1, 999999999);
  await conn.query(`
    UPDATE t_accounts SET auth_key = ? WHERE account_no = ?
  `, [randomNumber, accountNo]);
  return randomNumber;
}
model.checkAuthKey = async (accountNo, authKey) => {    
  const conn = await mysql.conn();
  const [accounts] = await conn.query(`
    SELECT COUNT(*) AS count FROM t_accounts WHERE account_no = ? AND auth_key = ?
  `, [accountNo, authKey]);    
  if (accounts.length === 0) {
    return null;
  }
  return accounts[0].count !== 0;
}

module.exports = model;