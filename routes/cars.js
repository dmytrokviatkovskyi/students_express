import express from 'express';
const router = express.Router();
import db from '../db/connector.js';

const validateCarData = (data) => {
  const errors = [];
  if (data.horsepower < 0) errors.push('Помилка: потужність може бути тільки додатня.');
  if (data.weight < 0) errors.push('Помилка: вага може бути тільки додатня.');
  if (data.acceleration_0_to_100 < 0) errors.push('Помилка: час розгону може бути тільки додатнім.');
  if (data.price < 0) errors.push('Помилка: ціна може бути тільки додатня.');
  return errors;
};


router.get('/', async function(req, res, next) {
  console.log("Зайшли на головну сторінку!"); 
  try {
    const cars = await db.query('SELECT * FROM cars ORDER BY id ASC');
    const rowCars = cars.rows.map(s => {
      return {
        ...s,
        created_at_time: s.created_at.toLocaleTimeString(), 
        created_at_date: s.created_at.toLocaleDateString()
      }
    });

    res.render('cars', { 
        cars: rowCars || [], 
        showList: true,   
        showForm: false 
    });
  } catch (error) {
    console.error('Помилка при завантаженні машин:', error);
    res.status(500).send('Помилка сервера при завантаженні даних');
  }
});

router.get('/new', (req, res) => {
  console.log("Зайшли на сторінку створення!");
  res.render('cars', { 
      showList: false,  
      showForm: true,   
      editingCar: null 
  });
});


router.post('/', async (req, res) => {
  const { car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url } = req.body; 

  const validationErrors = validateCarData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors.join('<br>')); 
  }

  try {
    await db.query(
      `INSERT INTO cars 
      (car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url] 
    );
    res.redirect('/'); 
  } catch (error) {
    console.error('Помилка при створенні машини:', error);
    res.status(500).send('Помилка при збереженні в базу даних');
  }
});


router.get('/edit/:id', async (req, res) => {
  const carId = req.params.id;
  try {
    const carResult = await db.query('SELECT * FROM cars WHERE id = $1', [carId]);
    if (carResult.rows.length === 0) {
      return res.status(404).send('Машину не знайдено');
    }

    res.render('cars', { 
      showList: false,  
      showForm: true,   
      editingCar: carResult.rows[0] 
    });
  } catch (error) {
    console.error('Помилка при завантаженні машини для редагування:', error);
    res.status(500).send('Помилка сервера');
  }
});

router.post('/edit/:id', async (req, res) => {
  const carId = req.params.id;
  const { car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url } = req.body; 

  const validationErrors = validateCarData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors.join('<br>'));
  }

  try {
    await db.query(
      `UPDATE cars SET 
        car_brand = $1, 
        car_model = $2, 
        engine_type = $3, 
        horsepower = $4, 
        weight = $5, 
        acceleration_0_to_100 = $6, 
        price = $7,
        image_url = $8 
      WHERE id = $9`,
      [car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url, carId] 
    );
    res.redirect('/'); 
  } catch (error) {
    console.error('Помилка при оновленні:', error);
    res.status(500).send('Помилка сервера при оновленні');
  }
});

router.delete('/:id', async (req, res) => {
  const carId = req.params.id;
  try {
    await db.query('DELETE FROM cars WHERE id = $1', [carId]);
    res.status(200).json({ message: 'Машину успішно видалено!' });
  } catch (error) {
    console.error('Помилка при видаленні:', error);
    res.status(500).json({ error: 'Помилка сервера при видаленні' });
  }
});

export default router;
