require('dotenv').config();
const express = require('express');
const cors = require('cors');
const  { MongoClient,ObjectId } = require('mongodb');
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
const articleCollection = db.collection("articles")
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
app.get('/news', async (req, res) => {
  const result = await newsCollection.find({}).toArray();
  res.send(result)
})
// news details
app.get('/news/:id', async (req, res) => {
  const id = req.params.id;
  const result = await newsCollection.findOne({ _id: new ObjectId(id) });
  res.send(result)
})
// delete news
app.delete('/news/:id', async (req, res) => {
  const id = req.params.id;
  const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send({
    success:true,
    message:'News deleted successfully',
    result
  })
})
// add article to database
app.post('/articles', async (req, res) => {
  const articleData = req.body;
  const result = await articleCollection.insertOne(articleData);
  res.send({
    success:true,
    message:'Article added successfully',
    result
  })
})
// all articles from database
app.get('/articles', async (req, res) => {
  const result = await articleCollection.find({}).toArray();
  res.send(result)
})
// article details
app.get('/articles/:id', async (req, res) => {
  const id = req.params.id;
  const result = await articleCollection.findOne({ _id: new ObjectId(id) });
  res.send(result)
})
// delete article from database
app.delete('/articles/:id', async (req, res) => {
  const id = req.params.id;
  const result = await articleCollection.deleteOne({ _id: new ObjectId(id) });
  res.send({
    success:true,
    message:'Article deleted successfully',
    result
  })
})









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToMongoDB();