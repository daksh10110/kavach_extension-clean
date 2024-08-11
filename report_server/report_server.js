const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3002;

// MongoDB connection settings
const mongoURI = 'mongodb+srv://kavach-nodal-agency:admin@nodal-agency.jffpogr.mongodb.net/obscene-websites'; // Your MongoDB connection URI
const dbName = 'obscene-websites';     // Your MongoDB database name
const collectionName = 'reports';      // Your MongoDB collection name

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

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
      console.log(`Server is running on http://localhost:${port}`);
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

// Route to add a new report to MongoDB
app.post('/submit-report', async (req, res) => {
  const { mediaInput, reportReason } = req.body;

  if (!mediaInput || !reportReason) {
    return res.status(400).json({ error: 'Media input and report reason are required' });
  }

  const reportObject = {
    mediaInput,
    reportReason,
  };

  try {
    const result = await db.collection(collectionName).insertOne(reportObject);
    const insertedReport = {
      ...reportObject,
      _id: result.insertedId,
    };
    res.status(201).json(insertedReport);
  } catch (err) {
    console.error('Error adding report:', err);
    res.status(500).json({ error: 'An error occurred while adding the report' });
  }
});

// Handle other routes or endpoints here if needed

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
