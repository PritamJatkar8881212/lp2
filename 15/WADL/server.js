const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error reading product file' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
