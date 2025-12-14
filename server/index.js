const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const TransactionModel = require('./models/Transaction.js');

app.use(cors());
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json('test ok');
});

app.post('/transaction', async (req, res) => {
    try {
        const { name, description, datetime, price } = req.body;
        const transaction = new TransactionModel({
            name,
            description,
            datetime,
            price
        });
        await transaction.save();
        res.json(transaction);
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await TransactionModel.find();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message });
    }
});
const PORT = 5000;

// ✅ CONNECT TO DB ONCE
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));

// o5WgQEx4iqTAIqvb
// mongodb+srv://dvishnuvardhan1737_db_user:o5WgQEx4iqTAIqvb@cluster0.xpbondf.mongodb.net/?appName=Cluster0