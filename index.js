const express = require('express')
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection = database.collection("users")
    const menuCollection = database.collection("menu")
    const reviewCollection = database.collection("review")
    const cartCollection = database.collection("carts")

// jWt 

app.post('/jwt' , (req,res)=>{
   const user = req.body 
   const token = jwt.sign( user, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1h' });
   res.send({token})

 })



  // menu collection APIs
    app.get('/menu' ,async(req,res)=>{
        const result = await menuCollection.find().toArray()
         res.send(result)

      })

  // users collection APIs 

  app.get("/users", async(req,res)=>{
    const result = await userCollection.find().toArray()
    res.send(result)
  })

  app.post("/users" , async(req ,res)=>{
    const user = req.body 
    const query ={email: user.email}
    
    const existingUser = await userCollection.findOne(query)
     if(existingUser){
        return res.send({message : 'user already added'})
     }

    const result = await userCollection.insertOne(user)
    res.send(result)
  
   })
  
   app.patch('/users/admin/:id' , async(req,res)=>{
    const id = req.params.id 
    const filter = {_id : new ObjectId(id)}
    const updatedoc = {
       $set :{
             role:'admin'
       }
    }

   const result = await userCollection.updateOne(filter , updatedoc)
         res.send(result)

    })



  // review collection APIs 
   app.get('/review' , async(req,res)=>{
     const result = await reviewCollection.find().toArray()
     res.send(result)
  })   

// cart collection APIs 
app.get('/carts', async(req,res)=>{
  const email = req.query.email 
   if(!email){
      res.send([]) }

   const query = {email : email}  
   const result = await cartCollection.find(query).toArray()
   res.send(result)

  })

  app.post('/carts', async(req,res)=>{
    const item =  req.body
    console.log(item)
     const result = await cartCollection.insertOne(item)
      res.send(result)
    })

// delete collection APIs data 
   app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)} 
      const result = await cartCollection.deleteOne(query) 
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









