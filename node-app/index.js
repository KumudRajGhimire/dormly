const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
const bodyParser = require('body-parser');
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

// Message and Notification Store
let messages = [];
let notifications = [];

app.get('/', (req, res) => {
    res.send('hello...');
});

app.get('/search', productController.search);
app.post('/like-product', userController.likeProducts);
app.post('/dislike-product', userController.dislikeProducts);
app.post('/add-product', upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.addProduct);
app.post('/edit-product', upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.editProduct);
app.get('/get-products', productController.getProducts);
app.post('/delete-product', productController.deleteProduct);
app.get('/get-product/:pId', productController.getProductsById);
app.post('/liked-products', userController.likedProducts);
app.post('/my-products', productController.myProducts);
app.post('/signup', userController.signup);
app.get('/my-profile/:userId', userController.myProfileById);
app.get('/get-user/:uId', userController.getUserById);
app.post('/login', userController.login);

// Get Notifications for a User
app.get('/notifications/:userId', (req, res) => {
    const userId = req.params.userId;
    const userNotifications = notifications.filter(notification => notification.to === userId);
    res.send({ notifications: userNotifications });
});

// Socket.io Message and Notification Logic
io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);

    // Handle Sending Messages
    socket.on('sendMsg', (data) => {
        messages.push(data);

        // Create a notification for the receiver
        const notification = {
            to: data.productId, // Assuming `productId` relates to the product owner's user ID
            message: `New message from ${data.username}`,
            timestamp: new Date()
        };

        notifications.push(notification);

        // Emit updated messages and notification to all clients
        io.emit('getMsg', messages);
        io.emit('getNotification', notification);
    });

    // Emit All Messages to New Connections
    io.emit('getMsg', messages);
});

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
