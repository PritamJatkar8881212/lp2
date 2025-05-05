const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'student';
let collection;

MongoClient.connect(url).then(client => {
    const db = client.db(dbName);
    collection = db.collection('studentmarks');
    console.log('Connected to MongoDB');

    // Insert default students only once
    collection.countDocuments().then(count => {
        if (count === 0) {
            collection.insertMany([
                { Name: 'A', Roll_No: 101, WAD_Marks: 78, CC_Marks: 65, DSBDA_Marks: 82, CNS_Marks: 74, AI_marks: 88 },
                { Name: 'B', Roll_No: 102, WAD_Marks: 45, CC_Marks: 38, DSBDA_Marks: 29, CNS_Marks: 41, AI_marks: 33 },
                { Name: 'AA', Roll_No: 103, WAD_Marks: 23, CC_Marks: 28, DSBDA_Marks: 19, CNS_Marks: 30, AI_marks: 25 },
                { Name: 'BB', Roll_No: 104, WAD_Marks: 90, CC_Marks: 92, DSBDA_Marks: 89, CNS_Marks: 85, AI_marks: 95 },
                { Name: 'C', Roll_No: 105, WAD_Marks: 66, CC_Marks: 72, DSBDA_Marks: 61, CNS_Marks: 67, AI_marks: 70 },
                { Name: 'D', Roll_No: 106, WAD_Marks: 34, CC_Marks: 37, DSBDA_Marks: 45, CNS_Marks: 39, AI_marks: 40 },
                { Name: 'CC', Roll_No: 107, WAD_Marks: 80, CC_Marks: 79, DSBDA_Marks: 82, CNS_Marks: 88, AI_marks: 76 },
                { Name: 'DD', Roll_No: 108, WAD_Marks: 25, CC_Marks: 23, DSBDA_Marks: 21, CNS_Marks: 19, AI_marks: 22 },
                { Name: 'E', Roll_No: 109, WAD_Marks: 55, CC_Marks: 49, DSBDA_Marks: 51, CNS_Marks: 58, AI_marks: 62 },
                { Name: 'EE', Roll_No: 110, WAD_Marks: 68, CC_Marks: 75, DSBDA_Marks: 80, CNS_Marks: 72, AI_marks: 77 }

            ]);
        }
        // collection.deleteMany({});
    });
}).catch(console.error);

// (d) Get all students with count
app.get('/api/students', async (req, res) => {
    const students = await collection.find().toArray();
    const count = await collection.countDocuments();
    res.json({ count, students });
});

// (e) Students with DSBDA_Marks > 20
app.get('/api/students/dsbda/above20', async (req, res) => {
    const students = await collection.find({ DSBDA_Marks: { $gt: 20 } }).toArray();
    res.json(students);
});

// (f) Increase marks of specified student by 10 using $inc
app.put('/api/students/increase/:name', async (req, res) => {
    const name = req.params.name;
    const result = await collection.updateOne(
        { Name: name },
        {
            $inc: {
                WAD_Marks: 10,
                CC_Marks: 10,
                DSBDA_Marks: 10,
                CNS_Marks: 10,
                AI_marks: 10
            }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Marks increased by 10 successfully' });
});

// (g) Students with >25 in all subjects
app.get('/api/students/above25all', async (req, res) => {
    const students = await collection.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_marks: { $gt: 25 }
    }).toArray();
    res.json(students);
});

// (h) Students with <40 in both WAD and CC
app.get('/api/students/less40mathsci', async (req, res) => {
    const students = await collection.find({
        WAD_Marks: { $lt: 40 },
        CC_Marks: { $lt: 40 }
    }).toArray();
    res.json(students);
});

// (i) Delete student by ID
app.delete('/api/students/:id', async (req, res) => {
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Student deleted' });
});

// Serve frontend
app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
