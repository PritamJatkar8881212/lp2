const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB connection settings
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'bookstoreDB';
let collection;
let dbClient;

// Connect to MongoDB and initialize collection
MongoClient.connect(url)
    .then(client => {
        dbClient = client;
        const db = client.db(dbName);
        collection = db.collection('books');
        console.log('Connected to MongoDB');
    })
    .catch(console.error);

// Check if MongoDB is initialized
function checkDbConnection(req, res, next) {
    if (!collection) {
        return res.status(500).json({ error: 'Database connection not established' });
    }
    next();
}

// (1) Add a new book
app.post('/api/books', checkDbConnection, async (req, res) => {
    const { title, author, price, genre } = req.body;
    const newBook = {
        title,
        author,
        price,
        genre,
    };

    try {
        const result = await collection.insertOne(newBook);
        res.status(201).json({ ...newBook, _id: result.insertedId });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add book' });
    }
});

// (2) Retrieve a list of all books
app.get('/api/books', checkDbConnection, async (req, res) => {
    try {
        const books = await collection.find().toArray();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// (3) Update book details
app.put('/api/books/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const { title, author, price, genre } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    const updatedBook = {
        title,
        author,
        price,
        genre,
    };

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedBook }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update book' });
    }
});

// (4) Delete a book from the collection
app.delete('/api/books/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 10.99, "genre": "Fiction" }