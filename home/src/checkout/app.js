var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
//const { default: CheckOut } = require("../checkout");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/checkout', { useNewUrlParser: true, useUnifiedTopology: true });

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
const checkoutSchema = new mongoose.Schema({
    name: String,
    address:  String,
    pincode: String,
    city:  String,
    phone: String
});


const Checkout = mongoose.model('Checkout', checkoutSchema);

// Handle POST request for sign up
app.post('/checkout', async function(req, res) {
    try {
        var name = req.body.name;
        var address = req.body.address;
        var pincode = req.body.pincode;
        var city=req.body.city;
        var phone = req.body.phone;
        var data = {
            name: name,
            address: address,
            pincode: pincode,
            city: city,
            phone: phone
        };

        // Create new user and save to database
        const checkout = new Checkout(data);
        await checkout.save();

        // const checkout =new checkout(data1);
        // await checkout.save();

        console.log("Record inserted Successfully");
        return res.redirect('signup_success.html');
        
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
app.listen(3004, function() {
    console.log("server listening at port 3004");
});





