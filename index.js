const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxeo9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const creativeCollection = client.db("creativeAgency").collection("clients");
  app.post('/addClient', (req, res) => {
      const creative = req.body;
      creativeCollection.insertOne(creative)
      .then(result => {
          res.send(result.insertedCount)
      })
  })
  console.log('db mongo added')
});


app.get('/', (req, res) => {
  res.send('Hello db World!')
})

app.listen(port)