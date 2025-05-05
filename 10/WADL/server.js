const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let todos = [];
let id = 1;

app.get('/todos', (req, res) => {
    console.log(todos)
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todo = { id: id++, text: req.body.text };
    todos.push(todo);
    console.log(todos)
    res.json(todo);
});

app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (todo) {
        todo.text = req.body.text;
        console.log(todos)
        res.json(todo);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/todos/:id', (req, res) => {
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    console.log(todos)
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
