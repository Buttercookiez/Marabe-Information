// index.js
const express = require('express');
const path = require('path');
const db = require('./firebase-config');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('public'));

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const docRef = await db.collection('users').add({ name, email });
        res.status(201).json({ id: docRef.id });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).json({ error: err.message });
    }
});

// Read all users
app.get('/users', async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(400).json({ error: err.message });
    }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        await docRef.update({ name, email });
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(400).json({ error: err.message });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        await docRef.delete();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(400).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});