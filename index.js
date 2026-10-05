require('dotenv').config();
const express = require('express');
const cors = require('cors');
const  { MongoClient } = require('mongodb');
const app = express()
const port =process.env.PORT || 3000
// middleware
app.use(cors());
app.use(express.json());


const client = new MongoClient(`${process.env.ATLAS_URI}`);
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
// async function disconnectFromMongoDB() {
//   await client.close();
// }
const db = client.db("news-portalDB")


// upload news data to database
const newsCollection = db.collection("news")
app.post('/news', async (req, res) => {
const newsData = req.body;
const result = await newsCollection.insertOne(newsData);
res.send({
  success:true,
  message:'News added successfully',
  result
})
})

// get news data from database











app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToMongoDB();