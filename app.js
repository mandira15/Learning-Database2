const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./models/user');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/database2')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render("read", {users});
})

app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/read");
})

app.get('/edit/:userid', async (req, res) => {
    let users = await userModel.findOne({_id: req.params.userid});
    res.render("edit", {users});
})

app.post('/update/:userid', async (req, res) => {
    let { image, name, email} = req.body;
    let users = await userModel.findOneAndUpdate({_id: req.params.userid}, {image, name, email}, {new : true});
    res.redirect("/read");
})

app.post('/create', async (req, res) => {
    let { name, email, image } = req.body;
    let createdUser = await userModel.create({
            name : name,
            email : email,
            image : image
    });
    res.redirect("/read");
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
