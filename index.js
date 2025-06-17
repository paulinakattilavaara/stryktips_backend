import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { saveToDatabase } from './saveToDatabase.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/games', async (req, res) => {
    try {
        await saveToDatabase();
        const result = await pool.query('SELECT * FROM games');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Något gick fel' });
    }
});

app.listen(port, () => {
    console.log(`Server körs på http://localhost:${port}`);
});