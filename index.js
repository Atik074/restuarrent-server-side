const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors')

// middle ware 
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flztkm6.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
   
    const database  = client.db("BistroDb")
    const menuCollection = database.collection("menu")
    const reviewCollection = database.collection("review")


    app.get('/menu' ,async(req,res)=>{

          const result = await menuCollection.find().toArray()
         res.send(result)

      })





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/' , (req,res)=>{
   res.send('restuarrent server running')
})

app.listen(port, ()=>{
  console.log(`server runing on ${port}`)

})









