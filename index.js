//Import dependencies
const express = require('express');
//const Database = require("@replit/database")
//const db = new Database()
const JSONdb = require('simple-json-db');
const db = new JSONdb('./storage/db.json');
const dbFunc = require("./dbFunc")
const app = express();
//Variables
const PORT = 8080;

//Middleware
app.use(express.json())

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
})

app.get('/get/msg', (req, res) => {

  //Gets last message sent to the server
  const lastMsg = dbFunc.getKey("lastMsg");

  res.status(200).send({
        val: `${lastMsg}`,
    })
  
})

app.post('/post/setMsg', (req, res) => {

  //Gets user request
  const { data } = req.body;

  res.status(200).send({
    msg: '501 Not Implemented',
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
