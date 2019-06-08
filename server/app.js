const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
var startTime = new Date().valueOf();

var toDoArr =
    [
        {
            todoItemId: 0,
            name: 'an item',
            priority: 3,
            completed: false
        },
        {
            todoItemId: 1,
            name: 'another item',
            priority: 2,
            completed: false
        },
        {
            todoItemId: 2,
            name: 'a done item',
            priority: 1,
            completed: true
        }
    ];

app.use(bodyParser.json());

app.use(morgan('dev'));

// add your code here
app.get('/', (req, res) => {
    res.status(200).send({ status: 'ok', runtime: `The server has been running for: ${(new Date().valueOf() - startTime) / 1000} seconds!` });
});

app.get('/api/TodoItems/?$', (req, res) => {
    res.status(200).send(toDoArr);
});

app.get('/api/TodoItems/[0-9]+', (req, res) => {
    var id = req.url.match(/[0-9]+/);
    if (id != null) {
        id = id[0];
        toDoArr.forEach((element) => {
            if (!res.finished && element.todoItemId == id) res.status(200).send(element);
        });
    }
    if (!res.finished) res.status(500).send('Error: The requested id does not exist');
});

app.post('/api/TodoItems/?$', (req, res) => {
    var newObj = req.body;

    if (newObj == undefined || newObj.todoItemId == undefined || newObj.name == undefined || newObj.priority == undefined || newObj.completed == undefined) res.status(500).send('Error: Invalid POST request');
    if (!res.finished) {
        toDoArr.forEach((element, index) => {
            if (!res.finished && element.todoItemId == newObj.todoItemId) {
                toDoArr[index] = newObj
                res.status(201).send(newObj);
            }
        });
    }
    if (!res.finished) {
        toDoArr[toDoArr.length] = newObj
        res.status(201).send(newObj);
    }
});

app.delete('/api/TodoItems/[0-9]+', (req, res) => {
    var id = req.url.match(/[0-9]+/);
    if (id != null) {
        id = id[0];
        var tempArr = [];
        toDoArr.forEach((element) => {
            if (!res.finished && element.todoItemId == id) res.status(200).send(element)
            else tempArr.push(element);
        });
        toDoArr = tempArr;
    }
    if (!res.finished) res.status(500).send('Error: The requested id does not exist');
});

app.get('*', (req, res) => {
    res.status(404).send('404: Resource not found');
})
module.exports = app;
