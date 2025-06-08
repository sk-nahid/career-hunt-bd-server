const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.keyl6e1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const jobCollection = client.db('career-hunt').collection('job-collection');
    const applicationCollection = client.db('career-hunt').collection('application-collection')

    //job collections API
    app.get('/jobs', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.hr_email = email
      }
      const result = await jobCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const quary = new ObjectId(id)
      const result = await jobCollection.findOne(quary);
      res.send(result)
    })
    app.post('/jobs', async (req, res) => {
      const jobs = req.body;
      console.log(jobs)
      const result = await jobCollection.insertOne(jobs);
      res.send(result)
    })
    // app.get('/job', async (req, res) => {
    //   const hr_email = req.query.hr_email;
    //   const query = { hr_email }
    //   console.log(hr_email)
    //   console.log(query)
    //   const result = await jobCollection.find(query).toArray();
    //   res.send(result)
    // })

    //application collection API
    app.get('/application', async (req, res) => {
      const result = await applicationCollection.find().toArray();
      res.send(result)
    })
    app.get('/application/job/:jobid',async (req, res) => {
      const jobId = req.params.jobid;
      const query = { jobId };
      const result = await applicationCollection.find(query).toArray();
      res.send(result)
    })
    app.get('/myapplication' ,async (req, res) => {
      const email = req.query.email;
      const quary = { email };
      // console.log(email)
      // console.log(quary)
      const result = await applicationCollection.find(quary).toArray();
      res.send(result)
    })
    app.post('/application',async (req, res) => {
      const application = req.body;
      const result = await applicationCollection.insertOne(application);
      res.send(result)
    })
    
    app.patch('/application/:id', async(req, res) => {
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)};
      const status = req.body.status;
      console.log(id, status)
      const update = {
        $set: {status}
      }
      const result = await applicationCollection.updateOne(filter, update);
      res.send(result)
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
  res.send('career hunting')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})