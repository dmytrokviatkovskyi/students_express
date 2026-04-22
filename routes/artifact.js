import express from 'express'; // 1. Імпортуємо express
import { getAllArtifacts } from '../controllers/artifactController.js';

const router = express.Router(); // 2. Створюємо екземпляр роутера

// 3. Твій код (маршрут)
router.get('/inventory', async (req, res) => {
    try {
        const items = await getAllArtifacts();
        res.render('inventory_page', { items }); 
    } catch (error) {
        res.status(500).send("Помилка при завантаженні інвентаря: " + error.message);
    }
});

export default router; // 4. Обов'язково експортуємо для app.js
