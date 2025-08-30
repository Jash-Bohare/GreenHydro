const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./firebase'); // Firebase connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and text files are allowed'), false);
        }
    }
});

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

// Document Upload Endpoint
app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        const { producerName, producerWallet, documentType, description } = req.body;
        
        if (!producerName || !producerWallet || !documentType) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Save document info to Firebase
        const docRef = await db.collection('documents').add({
            producerName,
            producerWallet,
            documentType,
            description: description || '',
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            status: 'pending',
            riskScore: null,
            submittedAt: new Date().toISOString(),
            reviewedBy: null,
            reviewedAt: null
        });

        res.status(201).send({ 
            id: docRef.id, 
            message: "Document uploaded successfully",
            fileName: req.file.originalname
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get all documents for certifier dashboard
app.get('/api/documents', async (req, res) => {
    try {
        const snapshot = await db.collection('documents').orderBy('submittedAt', 'desc').get();
        const documents = [];
        snapshot.forEach(doc => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.status(200).send(documents);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update document status (for certifier approval)
app.put('/api/documents/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewedBy, riskScore } = req.body;

        await db.collection('documents').doc(id).update({
            status,
            reviewedBy,
            reviewedAt: new Date().toISOString(),
            riskScore: riskScore || null
        });

        res.status(200).send({ message: "Document status updated successfully" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
