const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve HTML/CSS/images

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cafeOrders', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

// 2. Create Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    items: [String],
    totalPrice: Number,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 3. API route to store order
app.post('/order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: 'Order saved!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving order' });
    }
});

// 4. Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
