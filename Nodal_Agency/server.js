const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

// MongoDB connection settings
const mongoURI =
  'mongodb+srv://kavach-nodal-agency:admin@nodal-agency.jffpogr.mongodb.net/obscene-websites';
const dbName = 'obscene-websites'; // Replace with your MongoDB database name
const collectionName = 'obscenity'; // Replace with your MongoDB collection name

// Middleware
app.use(cors({ origin: '*' })); // Set CORS to allow all origins
app.use(bodyParser.json());

app.options('*', cors());

// Connect to MongoDB
let db;
(async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log('Connected to MongoDB!');

    // Start the server after successful connection
    app.listen(port, () => {
      console.log(`Server is running on http://192.168.234.96:${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
})();

// Route for the root endpoint
app.get('/', (req, res) => {
  res.send('Server is running and reachable');
});


// Route to fetch all persons from MongoDB
app.get('/persons', async (req, res) => {
  try {
    const persons = await db.collection(collectionName).find().toArray();
    res.status(200).json(persons);
  } catch (err) {
    console.error('Error fetching persons:', err);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Route to add a new person to MongoDB
app.post('/persons', async (req, res) => {
  const { url, imgurl, comment } = req.body;
  const personObject = {
    url,
    imgurl,
    comment,
  };

  try {
    const result = await db.collection(collectionName).insertOne(personObject);
    const insertedPerson = {
      ...personObject,
      _id: result.insertedId,
    };
    res.status(201).json(insertedPerson);
  } catch (err) {
    console.error('Error adding person:', err);
    res.status(500).json({ error: 'An error occurred while adding the person' });
  }
});
