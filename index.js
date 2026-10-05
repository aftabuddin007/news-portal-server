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


// collection name
const newsCollection = db.collection("news")
const articleCollection = db.collection("articles")
const careerCollection = db.collection("careers")
const storyCollection = db.collection("stories")
const photoCollection = db.collection("photos")
const videoCollection = db.collection("videos")
const pollCollection = db.collection("polls")
// upload news data to database
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
// update news
app.put('/news/:id', async (req, res) => {
  const id = req.params.id;
  const updatedNews = req.body;
  const result = await newsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedNews }
  );
  res.send({
    success:true,
    message:'News updated successfully',
    result
  })
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
// update article in database
app.put('/articles/:id', async (req, res) => {
  const id = req.params.id;
  const updatedArticle = req.body;
  const result = await articleCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedArticle }
  );
  res.send({
    success:true,
    message:'Article updated successfully',
    result
  })
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
// article by status pending,published,rejected
app.get('/articles/status/:status', async (req, res) => {
  const status = req.params.status;
  const result = await articleCollection.find({ status: status }).toArray();
  res.send(result)
})
// career data
app.post('/careers', async (req, res) => {
  const careerData = req.body;
  const result = await careerCollection.insertOne(careerData);
  res.send({
    success:true,
    message:'Career added successfully',
    result
  })
})
// all careers from database
app.get('/careers', async (req, res) => { 
  const result = await careerCollection.find({}).toArray();
  res.send(result)
})
// photo story
app.post('/stories', async (req, res) => {
  const storyData = req.body;
  const result = await storyCollection.insertOne(storyData);
  res.send({
    success:true,
    message:'Story added successfully',
    result
  })
})
// All stories from database
app.get('/stories', async (req, res) => {
  const result = await storyCollection.find({}).toArray();
  res.send(result)
})
// add photo Gallery to database
app.post('/photos', async (req, res) => {
  const photoData = req.body;
  const result = await photoCollection.insertOne(photoData);
  res.send({
    success:true,
    message:'Photo added successfully',
    result
  })
})
// all photos from database
app.get('/photos', async (req, res) => {
  const result = await photoCollection.find({}).toArray();
  res.send(result)
})
// add video Gallery to database
app.post('/videos', async (req, res) => {
  const videoData = req.body;
  const result = await videoCollection.insertOne(videoData);
  res.send({
    success:true,
    message:'Video added successfully',
    result
  })
})
// all videos from database
app.get('/videos', async (req, res) => {
  const result = await videoCollection.find({}).toArray();
  res.send(result)
})
// poll data
app.post('/polls', async (req, res) => {
  const pollData = req.body;
  const result = await pollCollection.insertOne(pollData);
  res.send({
    success:true,
    message:'Poll added successfully',
    result
  })
})
// all polls from database
app.get('/polls', async (req, res) => {
  const result = await pollCollection.find({}).toArray();
  res.send(result)
})













app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToMongoDB();