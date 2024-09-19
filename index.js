const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const bodyParser = require('body-parser');
require('dotenv').config()

app.use(express.json())
app.use(cors())
// app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yc8ov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const usersList = client.db('asrTravel').collection('users');
    const countryList = client.db('asrTravel').collection('countries');
    const touristSpots = client.db('asrTravel').collection('spots');
    
    //for country
    app.get('/countries',async(req,res)=>{
      const cursor = countryList.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/countries/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await countryList.findOne(query);
      res.send(result);
    })

    app.get('/spots/:country', async (req, res) => {
      const countryName = req.params.country;
      const query = { country: countryName }; // Adjusted this line
      const result = await touristSpots.find(query).toArray();
      res.send(result);
  });
    //for tourist spots
    app.post('/spots',async(req,res)=>{
      const newSpots = { ...req.body, userId: req.body.userId };
      const result = await touristSpots.insertOne(newSpots);
      res.send(result);
    })
    app.get('/spots/user/:userId', async (req, res) => {
      const userId = req.params.userId;
      const query = { userId: userId }; // Filter by userId
      const cursor = touristSpots.find(query);
      const result = await cursor.toArray();
      res.send(result);
  });



    //
    app.get('/spots',async(req,res)=>{
      const cursor = touristSpots.find();
      const result = await cursor.toArray();
      res.send(result);
    })





    app.post('/users',async(req,res)=>{
        const newUser = req.body;
        const result = await usersList.insertOne(newUser);
        res.send(result);
    })

   
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //FOR USERS DATABASE
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('asr travel server is running');
})

app.listen(port,()=>{
    console.log(`asr server is runing on port:${port}`);
})