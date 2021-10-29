const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// npm install dotenv 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh8a9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const servicesCullection = database.collection('services');

    // GET API
    app.get('/services', async (req, res) => {
      const cursor = servicesCullection.find({});
      const services = await cursor.toArray();
      res.send(services);
    })

    // GET SINGLE API
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = {_id: ObjectId(id)};
      const service = await servicesCullection.findOne(query);
      res.json(service);
    })

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log('post the hit api', service)
      const result = await servicesCullection.insertOne(service);
      console.log(result);
      res.json(result)
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await servicesCullection.deleteOne(query);
      console.log('getting delete',result)
      res.json(result);
    })

  } 
  
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("remaining ginius server");
});

app.listen(port, () => {
  console.log("Running ginius server on port", port);
});
