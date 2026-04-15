import db from '../db/connector.js';

const SALT_ROUNDS = 10;
export async function createCar(carData) {
  const { car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url } = carData;
  
  try {
    const query = `
      INSERT INTO cars (car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`;
      
    const res = await db.query(query, [
      car_brand, 
      car_model, 
      engine_type, 
      horsepower, 
      weight, 
      acceleration_0_to_100, 
      price, 
      image_url
    ]);
    
    console.log(`✓ Автомобіль додано успішно: ${res.rows[0].car_brand} ${res.rows[0].car_model}`);
    return res.rows[0];
  } catch (err) {
    console.error('Помилка створення автомобіля:', err);
    throw err;
  }
}

export async function deleteCar(id) {
  try {
    const res = await db.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);
    
    if (res.rows.length === 0) {
      throw new Error('Автомобіль не знайдено');
    }

    console.log(`✓ Автомобіль ${res.rows[0].car_brand} ${res.rows[0].car_model} був видалений.`);
    return true;
  } catch (err) {
    console.error('Помилка видалення авто:', err);
    throw err;
  }
}

export async function updateCar(id, updateData) {
  const fields = [];
  const values = [];
  let index = 1;


  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && value !== '') { 
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error('Немає даних для оновлення');
  }

  values.push(id);
  const query = `UPDATE cars SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

  try {
    const updateRes = await db.query(query, values);
    
    if (updateRes.rows.length === 0) {
      throw new Error('Автомобіль не оновлено');
    }
    
    console.log(`✓ Автомобіль оновлено: ${updateRes.rows[0].car_brand} ${updateRes.rows[0].car_model}`);
    return updateRes.rows[0];
  } catch (err) {
    console.error('Помилка оновлення автомобіля:', err);
    throw err;
  }
}

export function checkStringField(value, fieldName) {
  if (!value || value.trim().length < 2) {
    throw new Error(`Поле '${fieldName}' є обов’язковим і має містити принаймні 2 символи.`);
  }
}

export function checkPositiveNumber(value, fieldName) {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw new Error(`Поле '${fieldName}' має бути додатнім і більше нуля.`);
  }
}

export function checkAcceleration(value) {
  const num = Number(value);
  if (isNaN(num) || num <= 0 || num > 30) {
    throw new Error("Прискорення від 0 до 100 має бути реалістичним значенням(між 1 та 30 секундами).");
  }
}

export function validateCarData(carData) {
  if (carData.car_brand) checkStringField(carData.car_brand, 'Марка авто');
  if (carData.car_model) checkStringField(carData.car_model, 'Модель авто');
  if (carData.engine_type) checkStringField(carData.engine_type, 'Тип двигуна');
  
  if (carData.horsepower) checkPositiveNumber(carData.horsepower, 'Кінські сили');
  if (carData.weight) checkPositiveNumber(carData.weight, 'Вага');
  if (carData.price) checkPositiveNumber(carData.price, 'Ціна');
  
  if (carData.acceleration_0_to_100) checkAcceleration(carData.acceleration_0_to_100);
}
