//Import dependencies
const express = require('express');
const cors = require('cors');
const cleanser = require('profanity-cleanser');
cleanser.setLocale();
//const Database = require("@replit/database")
//const db = new Database()
const JSONdb = require('simple-json-db');
const db = new JSONdb('./storage/db.json');
const UID = require("./UIDFunctions.js");
const fs = require('fs');
const app = express();
//Variables
const PORT = 8080;

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Initialize server
app.listen(
    PORT,
    () => console.log(`IT'S ALIVE!! on http://NodeChatAPI.repl.co:${PORT}`)
)

//Set up default message
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'We have all seen an API before, nothing to see here...',
    })
  console.log("robot");
})

app.get('/get/msg', (req, res) => {

  //Gets last message sent to the server
  var lastMsg = db.get('msg');

  res.status(200).send(`${lastMsg}`)
  
})

app.get('/misc/ping', (req, res) => {

  //Pong!
  res.send('Pong!');
  
})

app.post('/post/setMsg', (req, res) => {

  //Gets user request
  const { data } = req.body;
  const { id } = req.body;
  const { username } = req.body;
  console.log(username);
  let result;
  console.log(JSON.stringify(req.body));

  let idVerifyResult = UID.verifyID(id, username);
  console.log(idVerifyResult);
  let filteredData = cleanser.replace(data);
  //XSS check
  filteredData = filteredData.replace(new RegExp('<script', "gi"), "");
  filteredData = filteredData.replace(new RegExp('document.cookie', "g"), "");
  filteredData = filteredData.replace(new RegExp('<br>', "gi"), "");
  filteredData = filteredData.replace(new RegExp('<a', "gi"), "");
  filteredData = filteredData.replace(new RegExp('<meta', "gi"), "");
  filteredData = filteredData.replace(new RegExp('javascript:', "gi"), "");
  filteredData = filteredData.replace(new RegExp('<iframe>', "gi"), "");
  filteredData = filteredData.replace(new RegExp('<link>', "gi"), "");
  filteredData = filteredData.replace(new RegExp('onerror=', "gi"), "");

  if(idVerifyResult == true) {
    db.set('msg', filteredData);
    result = "success";
  } else {
    result = "fail";
  }
  
  res.status(200).send({
    msg: `${result}`,
  })
/*
  if (!data) {
    res.status(400).send({ error:'No data specified' })
  } else {
    dbFunc.setKey(data);
    res.send({
      msg: `${data} was set successfully`,
    })
  }
*/
})

app.get('/admin/getUID', (req, res) => {

  const { username } = req.body;
  console.log(username);
  const { adminUserName } = req.body;
  const { adminPass } = req.body;

  if(adminUserName != process.env.admin || adminPass != process.env.adminPass) {
    res.status(401).send({
      msg: `Unauthorized`,
    })
  } else {
    const foundUID = UID.getId(username);
    res.status(200).send({
      msg: `${foundUID}`,
    })
  }
})

app.post('/admin/banID', (req, res) => {
  const { id } = req.body;
  const { adminUserName } = req.body;
  const { adminPass } = req.body;

  if(adminUserName != process.env.admin || adminPass != process.env.adminPass) {
    res.status(401).send({
      msg: `Unauthorized`,
    })
  } else {
    fs.appendFileSync('./storage/bannedIDs.txt', `${id}|`);
    res.status(200).send({
      msg: `Possible success`,
    })
  }
})

app.post('/post/id', (req, res) => {
  const { id } = req.body;
  //const { username } = req.body;

  fs.appendFileSync('./storage/ids.txt', `|${id}`);

  res.status(200).send({
      msg: `Possible success`,
  })
}) 

app.post('/admin/unbanID', (req, res) => {
  const { id } = req.body;
  const { adminUserName } = req.body;
  const { adminPass } = req.body;

  if(adminUserName != process.env.admin || adminPass != process.env.adminPass) {
    res.status(401).send({
      msg: `Unauthorized`,
    })
  } else {
    let data = fs.readFileSync("./storage/bannedIDs.txt");
    var newValue = data.replace(id, "");
    fs.writeFileSync('./storage/bannedIDs.txt', newValue);
    res.status(200).send({
      msg: `Possible success`,
    })
  }
})

app.get('/misc/banStatus', (req, res) => {

  const { id } = req.body;

  const checkBanResult = UID.checkBan(id);
  res.status(200).send({
    msg: `${checkBanResult}`,
  })

})