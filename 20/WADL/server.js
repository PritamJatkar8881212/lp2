const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB connection settings
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'employeeDB';
let collection;
let dbClient;

// Connect to MongoDB and initialize collection
MongoClient.connect(url)
    .then(client => {
        dbClient = client;
        const db = client.db(dbName);
        collection = db.collection('employees');
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

// (1) Add a new employee
app.post('/api/employees', checkDbConnection, async (req, res) => {
    const { name, department, designation, salary, joiningDate } = req.body;
    const newEmployee = {
        name,
        department,
        designation,
        salary,
        joiningDate: new Date(joiningDate),
    };

    try {
        const result = await collection.insertOne(newEmployee);
        res.status(201).json({ ...newEmployee, _id: result.insertedId });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add employee' });
    }
});

// (2) View all employee records
app.get('/api/employees', checkDbConnection, async (req, res) => {
    try {
        const employees = await collection.find().toArray();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// (3) Update an existing employee’s details
app.put('/api/employees/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const { name, department, designation, salary, joiningDate } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const updatedEmployee = {
        name,
        department,
        designation,
        salary,
        joiningDate: new Date(joiningDate),
    };

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedEmployee }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update employee' });
    }
});

// (4) Delete an employee record
app.delete('/api/employees/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// { "name": "John Doe", "department": "Engineering", "designation": "Software Engineer", "salary": 75000, "joiningDate": "2022-01-15" }
