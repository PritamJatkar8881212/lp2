const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'music';
let collection;

MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {
    const db = client.db(dbName);
    collection = db.collection('song_details');
    console.log('Connected to MongoDB');

    // Insert default songs only once
    collection.countDocuments().then(count => {
        if (count === 0) {
            collection.insertMany([
                { Songname: 'Tum Hi Ho', Film: 'Aashiqui 2', Music_director: 'Mithoon', Singer: 'Arijit Singh' },
                { Songname: 'Kal Ho Naa Ho', Film: 'Kal Ho Naa Ho', Music_director: 'Shankar-Ehsaan-Loy', Singer: 'Sonu Nigam' },
                { Songname: 'Chaiyya Chaiyya', Film: 'Dil Se', Music_director: 'A. R. Rahman', Singer: 'Sukhwinder Singh' },
                { Songname: 'Tujh Mein Rab Dikhta Hai', Film: 'Rab Ne Bana Di Jodi', Music_director: 'Salim-Sulaiman', Singer: 'Roop Kumar Rathod' },
                { Songname: 'Jai Ho', Film: 'Slumdog Millionaire', Music_director: 'A. R. Rahman', Singer: 'Sukhwinder Singh' }
            ]);
        }
    });
}).catch(console.error);

// Get all songs with count
app.get('/api/songs', async (req, res) => {
    const songs = await collection.find().toArray();
    const count = await collection.countDocuments();
    res.json({ count, songs });
});

// Add a new song
app.post('/api/songs', async (req, res) => {
    const result = await collection.insertOne(req.body);
    res.json(result);
});

// Delete a song by ID
app.delete('/api/songs/:id', async (req, res) => {
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Song deleted' });
});

// Update Actor and Actress
app.put('/api/songs/:id', async (req, res) => {
    await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { Actor: req.body.Actor, Actress: req.body.Actress } }
    );
    res.json({ message: 'Updated' });
});

// Songs by Music Director
app.get('/api/songs/director/:name', async (req, res) => {
    const songs = await collection.find({ Music_director: req.params.name }).toArray();
    res.json(songs);
});

// Songs by Director and Singer
app.get('/api/songs/director/:dir/singer/:singer', async (req, res) => {
    const songs = await collection.find({ Music_director: req.params.dir, Singer: req.params.singer }).toArray();
    res.json(songs);
});

// Songs by Film and Singer
app.get('/api/songs/film/:film/singer/:singer', async (req, res) => {
    const songs = await collection.find({ Film: req.params.film, Singer: req.params.singer }).toArray();
    res.json(songs);
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
