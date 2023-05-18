const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp83dff.mongodb.net/?retryWrites=true&w=majority`;

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
     client.connect();

     const toyCollection = client.db('toyShop').collection('toys');
    //  
    app.get('/toys', async(req, res)=>{
        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email }
        }
        const result = await toyCollection.find(query).limit(20).toArray();
        res.send(result);
    })

    app.get('/toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.findOne(query);
        res.send(result);
    })

    app.get('/toys/:category', async(req, res)=>{
        const catagory = req.params.category;
        const query = { category: req.params.category }
        const result = await toyCollection.find(query);
        res.send(result);
    })

    app.post('/toys', async(req, res)=>{
        console.log(req.body);
        const toy = req.body;
        const result = await toyCollection.insertOne(toy);
        res.send(result);
    })

    app.patch('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
            const updatedToy = req.body;
            console.log(updatedToy);
            const updateDoc = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description
                },
            };
            const result = await toyCollection.updateOne(filter, updateDoc);
        
        res.send(result);
    })
    app.delete('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.deleteOne(query);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('toy server is running.......')
})

app.listen(port, () => {
    console.log(`toy Server is running on port ${port}`)
})