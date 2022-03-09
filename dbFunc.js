//const Database = require("@replit/database")
//const db = new Database()
const JSONdb = require('simple-json-db');
const db = new JSONdb('./storage/db.json');

module.exports = {
  getKey: async function(key) {
    let key1 = await db.get(key).then(value => { });
    return key1;
  },

  setKey: async function(key2, value) {
    let key21 = await db.set(key2, value).then(() => { });
  },

  delKey: async function(user, pass, key3) {
    if(user == process.env.admin && pass == process.env.adminpass) {
    await db.delete(key3).then(() => {});
    return "0";
    } else {
      return "1";
    }
  }
};