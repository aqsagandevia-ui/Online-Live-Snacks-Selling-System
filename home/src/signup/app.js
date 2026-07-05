var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signup', { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
    console.log("connection succeeded");
});

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Define schema and model
const RegisterSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String
});

const Register = mongoose.model('Register', RegisterSchema);

// Handle POST request for sign up
app.post('/sign_up', async function(req, res) {
    try {
        var name = req.body.name;
        var email = req.body.email;
        var pass = req.body.password;
        var phone = req.body.phone;

        var data = {
            name: name,
            email: email,
            password: pass,
            phone: phone
        };

        // Create new user and save to database
        const registers = new Register(data);
        await registers.save();

        console.log("Record inserted Successfully");
        return res.redirect('/signup_success.html');
    } catch (error) {
        console.error("Error inserting record:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Handle GET request for home
app.get('/', function(req, res) {
    res.set({ 'Access-control-Allow-Origin': '*' });
    return res.redirect('index.html');
});

// Start server
app.listen(3001, function() {
    console.log("server listening at port 3001");
});