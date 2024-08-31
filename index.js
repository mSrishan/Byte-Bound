const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'Lapshop';
let collection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    collection = db.collection('Laptops');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  }
}

// Route to handle GET requests
app.get('/', async (req, res) => {
  try {
    const findResult = await collection.find({}).toArray();
    res.status(200).send(findResult);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch data from the database' });
  }
});

// Route to handle POST requests
app.post('/', async (req, res) => {
  try {
    const insertResult = await collection.insertOne(req.body);
    res.status(201).send(insertResult);
  } catch (error) {
    res.status(500).send({ error: 'Failed to insert data into the database' });
  }
});

// Route to handle PUT requests
app.put('/:id', async (req, res) => {
  try {
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.status(200).send(updateResult);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update data in the database' });
  }
});

// Route to handle DELETE requests
app.delete('/:id', async (req, res) => {
  try {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).send(deleteResult);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete data from the database' });
  }
});

// Connect to the database and then start the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
