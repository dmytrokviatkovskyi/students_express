// 1. Імпортуємо спільний пул
import pool from '../db/index.js';

// 2. Функція отримання списку (тепер вона ПОВЕРТАЄ дані, а не просто малює таблицю)
export const getAllArtifacts = async () => {
    try {
        const res = await pool.query("SELECT * FROM artifacts ORDER BY id ASC");
        return res.rows; 
    } catch (err) {
        console.error("Помилка БД:", err.message);
        throw err;
    }
};

// 3. Функція додавання (приймає об'єкт, а не аргументи командного рядка)
export const addArtifact = async (artifactData) => {
    const { name, anomaly, rarity, rad, weight, value, owner, notes } = artifactData;

    const query = `
        INSERT INTO artifacts
        (name, origin_anomaly, rarity, radiation_level, weight, market_value, stalker_owner, properties_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

    const values = [name, anomaly, rarity, rad, weight, value, owner, notes];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Аналогічно винеси updateValue та decommissionArtifact, додавши 'export' на початку
