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
const userCollection = db.collection("users")
const newsCollection = db.collection("news")
const articleCollection = db.collection("articles")
const careerCollection = db.collection("careers")
const storyCollection = db.collection("stories")
const photoCollection = db.collection("photos")
const videoCollection = db.collection("videos")
const pollCollection = db.collection("polls")
app.get("/",async (req,res)=>{
  res.send("Server is running")
})
// create user api
app.post('/users', async (req, res) => {
  const userData = req.body;
  const result = await userCollection.insertOne(userData);  
  res.send({
    success:true,
    message:'User added successfully',
    result
  })
})
// get all users from database
app.get('/users', async (req, res) => {
  const result = await userCollection.find({}).toArray();
  res.send(result)
})
// upload news dyata to 


app.post('/news', async (req, res) => {
  try {
    const {
      fileName,
      imageUrl,
      fileType,
      fileSize,
      uploadedBy,
    } = req.body;

    if (
      !fileName ||
      !imageUrl ||
      !fileType ||
      !Number.isFinite(fileSize)
    ) {
      return res.status(400).send({
        success: false,
        message: 'Invalid media information',
      });
    }

    const newsData = {
      fileName,
      imageUrl,
      fileType,
      fileSize,
      uploadedBy,
      uploadedAt: new Date(),
    };

    const result = await newsCollection.insertOne(newsData);

    res.status(201).send({
      success: true,
      message: 'Media added successfully',
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Save media error:', error);

    res.status(500).send({
      success: false,
      message: 'Failed to save media',
    });
  }
});

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
// career //#endregion details
app.get('/careers/:id', async (req, res) => {
  const id = req.params.id;
  const result = await careerCollection.findOne({ _id: new ObjectId(id) });
  res.send(result)
})

// delete career from database
app.delete('/careers/:id', async (req, res) => {
  const id = req.params.id;
  const result = await careerCollection.deleteOne({ _id: new ObjectId(id) });
  res.send({
    success:true,
    message:'Career deleted successfully',
    result
  })
})

// add story to database
app.post("/stories", async (req, res) => {
  try {
    const {
      title,
      authorName,
      authorEmail,
      category,
      publishedDate,
      status,
      images,
    } = req.body;

    // Validate required fields
    if (
      !title?.trim() ||
      !authorName?.trim() ||
      !authorEmail?.trim() ||
      !category ||
      !publishedDate ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required story information",
      });
    }

    // Validate image objects
    const validImages = images.every(
      (image) =>
        typeof image.imageUrl === "string" &&
        image.imageUrl.trim() !== "" &&
        typeof image.caption === "string"
    );

    if (!validImages) {
      return res.status(400).send({
        success: false,
        message: "Invalid image data",
      });
    }

    const storyData = {
      title: title.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      category,
      publishedDate: new Date(publishedDate),
      status: status === "Draft" ? "Draft" : "Published",
      images: images.map((image) => ({
        imageUrl: image.imageUrl,
        caption: image.caption.trim(),
      })),
      createdAt: new Date(),
    };

    if (Number.isNaN(storyData.publishedDate.getTime())) {
      return res.status(400).send({
        success: false,
        message: "Invalid published date",
      });
    }

    const result = await storyCollection.insertOne(storyData);

    res.status(201).send({
      success: true,
      message: "Story added successfully",
      result,
    });
  } catch (error) {
    console.error("Story creation error:", error);

    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

// All stories from database
app.get("/stories", async (req, res) => {
  try {
    const result = await storyCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    console.error("Get stories error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch stories",
    });
  }
});
// get specific id story from database

app.get("/stories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid story ID",
      });
    }

    const story = await storyCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!story) {
      return res.status(404).send({
        success: false,
        message: "Story not found",
      });
    }

    res.send(story);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch story",
    });
  }
});

// update story in database
app.patch("/stories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, images, publishedDate } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid story ID",
      });
    }

    const updateFields = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).send({
          success: false,
          message: "Story title is required",
        });
      }

      updateFields.title = title.trim();
    }

    if (images !== undefined) {
      if (
        !Array.isArray(images) ||
        images.length === 0 ||
        !images.every(
          (image) =>
            typeof image.imageUrl === "string" &&
            image.imageUrl.trim() &&
            typeof image.caption === "string"
        )
      ) {
        return res.status(400).send({
          success: false,
          message: "Invalid story images or captions",
        });
      }

      updateFields.images = images.map((image) => ({
        imageUrl: image.imageUrl.trim(),
        caption: image.caption.trim(),
      }));
    }

    if (publishedDate !== undefined) {
      const date = new Date(publishedDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).send({
          success: false,
          message: "Invalid published date",
        });
      }

      updateFields.publishedDate = date;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send({
        success: false,
        message: "No fields provided for update",
      });
    }

    const result = await storyCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Story not found",
      });
    }

    res.send({
      success: true,
      message: "Story updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Failed to update story",
    });
  }
});
// delete story from database
app.delete('/stories/:id', async (req, res) => {
  const id = req.params.id;
  const result = await storyCollection.deleteOne({ _id: new ObjectId(id) });
  res.send({
    success:true,
    message:'Story deleted successfully',
    result
  })
})
// add photo Gallery to database

app.post("/photos", async (req, res) => {
  try {
    const photoData = req.body;

    if (
      !photoData.galleryTitle?.trim() ||
     
      !Array.isArray(photoData.images) ||
      photoData.images.length === 0
    ) {
      return res.status(400).send({
        success: false,
        message: "Gallery title, writer and images are required",
      });
    }

    const result = await photoCollection.insertOne({
      ...photoData,
      galleryTitle: photoData.galleryTitle.trim(),
    });

    res.status(201).send({
      success: true,
      message: "Photo gallery added successfully",
      result,
    });
  } catch (error) {
    console.error("Add photo gallery error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to add photo gallery",
    });
  }
});

// all photos from database
app.get("/photos", async (req, res) => {
  try {
    const result = await photoCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    console.error("Get photos error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch photo galleries",
    });
  }
});
// update photo gallery


// Get a single photo gallery
app.get("/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid gallery ID",
      });
    }

    const photo = await photoCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!photo) {
      return res.status(404).send({
        success: false,
        message: "Photo gallery not found",
      });
    }

    res.send(photo);
  } catch (error) {
    console.error("Get photo error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch photo gallery",
    });
  }
});

// Update a photo gallery
app.patch("/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid gallery ID",
      });
    }

    const {
      galleryTitle,
      images,
      guestWriterName,
      guestWriterDesignation,
      publishedDate,
      status,
    } = req.body;

    const updateFields = {};

    if (galleryTitle !== undefined) {
      if (
        typeof galleryTitle !== "string" ||
        !galleryTitle.trim()
      ) {
        return res.status(400).send({
          success: false,
          message: "Gallery title is required",
        });
      }

      updateFields.galleryTitle = galleryTitle.trim();
    }

    if (images !== undefined) {
      if (
        !Array.isArray(images) ||
        images.length === 0 ||
        !images.every(
          (image) =>
            typeof image.imageUrl === "string" &&
            image.imageUrl.trim() &&
            typeof image.caption === "string"
        )
      ) {
        return res.status(400).send({
          success: false,
          message: "At least one valid image is required",
        });
      }

      updateFields.images = images.map((image) => ({
        imageUrl: image.imageUrl.trim(),
        caption: image.caption.trim(),
      }));
    }

    if (guestWriterName !== undefined) {
      if (typeof guestWriterName !== "string") {
        return res.status(400).send({
          success: false,
          message: "Invalid guest writer name",
        });
      }

      updateFields.guestWriterName = guestWriterName.trim();
    }

    if (guestWriterDesignation !== undefined) {
      if (typeof guestWriterDesignation !== "string") {
        return res.status(400).send({
          success: false,
          message: "Invalid guest writer designation",
        });
      }

      updateFields.guestWriterDesignation =
        guestWriterDesignation.trim();
    }

    if (publishedDate !== undefined) {
      const date = new Date(publishedDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).send({
          success: false,
          message: "Invalid published date",
        });
      }

      updateFields.publishedDate = date;
    }

    if (status !== undefined) {
      if (!["Published", "Draft"].includes(status)) {
        return res.status(400).send({
          success: false,
          message: "Invalid publish status",
        });
      }

      updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send({
        success: false,
        message: "No fields provided for update",
      });
    }

    const result = await photoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Photo gallery not found",
      });
    }

    res.send({
      success: true,
      message: "Photo gallery updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update photo error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to update photo gallery",
    });
  }
});

// Delete photo gallery
app.delete("/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid gallery ID",
      });
    }

    const result = await photoCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Gallery not found",
      });
    }

    res.send({
      success: true,
      message: "Photo gallery deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to delete photo gallery",
    });
  }
});
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
// delete poll from database
app.delete('/polls/:id', async (req, res) => {
  const id = req.params.id;
  const result = await pollCollection.deleteOne({ _id: new ObjectId(id) });
  res.send({
    success:true, 
    message:'Poll deleted successfully',
    result
  })
})












app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToMongoDB();