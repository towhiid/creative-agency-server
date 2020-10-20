const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs-extra')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxeo9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload())

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

  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    console.log(name, file);
    file.mv(`${__dirname}/services/${file.name}`, err => {
      if(err){
        console.log(err);
        return res.status(500).send({msg: 'Failed to upload'});
      }
      return res.send({name: file.name, path: `/${file.name}`})
    })
  })

  console.log('mongodb added')
});


app.get('/', (req, res) => {
  res.send('Hey mongodb World!')
})

app.listen(process.env.PORT || port)