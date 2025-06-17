import getGames from "./getGames.js";
import dotenv from "dotenv";
import pool from './db.js';
dotenv.config();

export const saveToDatabase = async () => {
    try {
        const data = await getGames();
        console.log(data);

        if (data.length === 0) {
            console.log("No games to insert.");
            return;
        }

        const client = await pool.connect();
        try {
            await client.query('DELETE FROM games;');
            await client.query('ALTER SEQUENCE games_id_seq RESTART WITH 1;');

            const insertPromises = data.map(game => {
                return client.query('INSERT INTO games (game) VALUES ($1)', [game]);
            });

            await Promise.all(insertPromises);
            console.log("Games have been inserted successfully!");
        } catch (insertError) {
            console.error("Error inserting games:", insertError);
        } finally {
            client.release();
        }
    }
    catch (error) {
        console.error("Error fetching games:", error);
    }
}

saveToDatabase();