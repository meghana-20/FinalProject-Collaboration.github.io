const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost/image-upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const adminUsername = 'admin';
const adminPassword = 'admin123';

// Admin login route
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
        res.redirect('/admin.html');
    } else {
        res.status(401).send('Incorrect admin credentials');
    }
});

// Define User schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const paymentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    totalAmount: Number,
    orderNumber: String // Add orderNumber field to the payment schema
});

const Payment = mongoose.model('Payment', paymentSchema);

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('Username:', user.username);
            // Redirect with username as a query parameter
            res.redirect(`/home.html?username=${user.username}`);
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Routes
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/login.html');
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).send(error);
    }
});

// Image Schema
const imageSchema = new mongoose.Schema({
    title: String,
    price: String,
    filePath: String
});

const Image = mongoose.model('Image', imageSchema);



app.post('/upload', upload.single('imageFile'), async (req, res) => {
    const { imageTitle, imagePrice } = req.body;
    const imagePath = req.file.path; 

    const newImage = new Image({
        title: imageTitle,
        price: imagePrice,
        filePath: imagePath
    });

    try {
        await newImage.save();
        res.redirect('/admin.html');
    } catch (error) {
        res.status(500).send("Error saving image: " + error.message);
    }
});


// Assuming you are using Express and Mongoose
app.delete('/images/:id', async (req, res) => {
    try {
        const result = await Image.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).send({ message: "Image successfully deleted" });
        } else {
            res.status(404).send({ message: "Image not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error deleting image", error: error });
    }
});


app.get('/images', async (req, res) => {
    try {
        const images = await Image.find(); // Retrieve all images from the database
        res.json(images); // Send image data as JSON
    } catch (error) {
        res.status(500).send("Failed to fetch images: " + error.message);
    }
});
// Payment route
app.post('/submit-payment', async (req, res) => {
    try {
        const paymentData = req.body;
        
        // Extract required fields from paymentData
        const { fullName, email, totalAmount } = paymentData;
        
        // Generate order number
        const orderNumber = generateOrderNumber();
        
        // Create a new Payment document
        const payment = new Payment({
            fullName: fullName,
            email: email,
            totalAmount: totalAmount,
            orderNumber: orderNumber
        });
        
        // Save payment to the database
        await payment.save();
        
        // Redirect to order success page
        res.redirect('/orderSucess.html');
    } catch (error) {
        res.status(500).send(error);
    }
});


// GET route to retrieve all orders
app.get('/get-orders', async (req, res) => {
    try {
        const orders = await Payment.find(); // Retrieve all payments/orders from the database
        res.json({ orders }); // Send the orders as JSON
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to generate a random order number
function generateOrderNumber() {
    return '#' + Math.floor(Math.random() * 900000 + 100000);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
