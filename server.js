// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/CSS/JS

// MongoDB Connection
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let ordersCollection;

async function connectDB() {
    try {
        await client.connect();

        // Access database "cafeOrders" and collection "orders"
        const db = client.db('cafeOrders');
        ordersCollection = db.collection('orders');

        console.log('✅ Connected to MongoDB → cafeOrders > orders');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
    }
}
connectDB();

// Store order
app.post('/order', async (req, res) => {
    try {
        const order = req.body;
        order.date = new Date();
        await ordersCollection.insertOne(order);
        res.status(200).json({ message: 'Order stored successfully' });
    } catch (err) {
        console.error('Error inserting order:', err);
        res.status(500).json({ error: 'Failed to store order' });
    }
});

// Fetch recent orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await ordersCollection.find().sort({ date: -1 }).limit(5).toArray();
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Serve menu.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

