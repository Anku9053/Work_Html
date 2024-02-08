const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoURI;
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let tasksCollection;
let usersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        tasksCollection = db.collection('tasks');
        usersCollection = db.collection('users');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();


app.use((req, res, next) => {
    if (!tasksCollection || !usersCollection) {
        return res.status(500).send('Internal Server Error: Database connection not established');
    }
    next();
});

app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await tasksCollection.find({}).toArray();
        res.json(allTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add-task', async (req, res) => {
    const newTask = req.body;
    console.log('Received task:', newTask);
    try {
        const result = await tasksCollection.insertOne(newTask);
        res.send('Task added successfully');
        console.log('Task added successfully')
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.put('/update-task/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const { status } = req.body;

    try {
        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { status: status } }
        );

        if (result.matchedCount > 0) {
            res.send('Task status updated successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/delete-task/:taskId', async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
        if (result.deletedCount > 0) {
            res.send('Task deleted successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        const result = await usersCollection.insertOne({ username, password });
        res.send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usersCollection.findOne({ username, password });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        res.send('Login successful');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
