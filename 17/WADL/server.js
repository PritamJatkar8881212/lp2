const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname))); 

app.get('/api/employees', (req, res) => {
    fs.readFile('employees.json', 'utf8', (err, data) => {
        if (err) {
            console.log("Error reading employees data", err);
            res.status(500).send('Error reading data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
