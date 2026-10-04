const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://azizpheonix51_db_user:IWRfghC6AjB3x9so@ac-jvsz51q-shard-00-00.mhjhm4j.mongodb.net:27017,ac-jvsz51q-shard-00-01.mhjhm4j.mongodb.net:27017,ac-jvsz51q-shard-00-02.mhjhm4j.mongodb.net:27017/?ssl=true&replicaSet=atlas-u9mgph-shard-0&authSource=admin&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const Blog = mongoose.model('Blog', {
    id: Number,
    title: String,
    content: String,
    likes: Number,
}, "blog");

// 1. Changed model name variable to uppercase 'User'
const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String, 
    role: String,
    uid: String,
}, "user");


app.post('/posts', async (req, res) => {
    try {
        const { title, content, id } = req.body;
        const newPost = {
            id: id,
            title: title,
            content: content,
            likes: 0
        };
        const blogPost = await Blog.create(newPost);
        res.status(201).json(blogPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { name, email, role, uid } = req.body;
        const newUser = {
            name: name,
            email: email,
            role: role,
            uid: uid
        };

        const savedUser = await User.create(newUser);
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const { uid } = req.query;
        const user = await User.findOne({ uid: uid });
        res.json(user.role);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/posts', async (req, res) => {
    const posts = await Blog.find().sort({ _id: -1 });
    res.json(posts);
});

app.patch('/like/:id', async (req, res) => {
    const { id } = req.params;
    await Blog.updateOne({ id: parseInt(id) }, { $inc: { likes: 1 } });
    res.status(200).json({ message: 'Post liked successfully' });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});