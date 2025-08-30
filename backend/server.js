const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./firebase'); // Firebase connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Producer Registration Endpoint
app.post('/api/producers', async (req, res) => {
    const { name, wallet, plantCapacity } = req.body;

    if (!name || !wallet || !plantCapacity) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {
        const docRef = await db.collection('producers').add({
            name,
            wallet,
            plantCapacity,
            createdAt: new Date().toISOString()
        });
        res.status(201).send({ id: docRef.id, message: "Producer registered successfully" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
