import { db } from '../config/database.js';

export function ingredientIds(pizzaId) {
  return db.prepare('SELECT ingredient_id FROM pizza_ingredients WHERE pizza_id = ? ORDER BY ingredient_id')
    .all(pizzaId).map(row => row.ingredient_id);
}

// Le service englobe le remplacement dans la transaction de la pizza.
export function replace(pizzaId, ids) {
  db.prepare('DELETE FROM pizza_ingredients WHERE pizza_id = ?').run(pizzaId);
  const insert = db.prepare('INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)');
  for (const id of ids) insert.run(pizzaId, id);
}

export function isUsed(ingredientId) {
  return Boolean(db.prepare('SELECT 1 FROM pizza_ingredients WHERE ingredient_id = ? LIMIT 1').get(ingredientId));
}
