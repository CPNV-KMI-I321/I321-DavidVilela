import { test, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.DB_PATH = ':memory:';
const { db } = await import('../src/config/database.js');
const pizzas = await import('../src/services/pizzasService.js');
const ingredients = await import('../src/services/ingredientsService.js');
after(() => db.close());

test('échec SQLite en modification : restauration de la pizza et de toute sa composition', () => {
  const first = ingredients.create({ name: 'Tomate', price: 1 });
  const second = ingredients.create({ name: 'Fromage', price: 2 });
  const original = pizzas.create({ name: 'Originale', price: 10, ingredientIds: [first.id] });
  db.exec(`CREATE TRIGGER fail_update_composition BEFORE INSERT ON pizza_ingredients
    BEGIN SELECT RAISE(ABORT, 'Panne modification'); END;`);
  try {
    assert.throws(() => pizzas.update(original.id, {
      name: 'Modifiée', price: 99, ingredientIds: [second.id]
    }), /Panne modification/);
    assert.deepEqual(pizzas.get(original.id), original);
  } finally {
    db.exec('DROP TRIGGER fail_update_composition');
  }
  const other = pizzas.create({ name: 'Autre', price: 12, ingredientIds: [second.id] });
  assert.throws(() => pizzas.update(other.id, {
    name: 'ORIGINALE', price: 20, ingredientIds: [first.id]
  }), { status: 409 });
  assert.deepEqual(pizzas.get(other.id), other);
  assert.deepEqual(pizzas.list().map(p => p.ingredientIds), [[first.id], [second.id]]);
  pizzas.remove(original.id);
  ingredients.remove(first.id);
  pizzas.remove(other.id);
  ingredients.remove(second.id);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM pizza_ingredients').get().count, 0);
});
