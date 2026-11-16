import { test, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.DB_PATH = ':memory:';
const { db } = await import('../src/config/database.js');
const pizzas = await import('../src/services/pizzasService.js');
const ingredients = await import('../src/services/ingredientsService.js');
after(() => db.close());
const tomato = ingredients.create({ name: 'Tomate', price: 1 });
const cheese = ingredients.create({ name: 'Mozzarella', price: 2 });
const input = { name: 'Margherita', price: 14, ingredientIds: [tomato.id, cheese.id] };

test('règles métier : nom unique, composition obligatoire et ingrédients existants', () => {
  const pizza = pizzas.create(input);
  assert.deepEqual(pizza.ingredientIds, [tomato.id, cheese.id]);
  assert.throws(() => pizzas.create({ ...input, name: 'margherita' }), { status: 409 });
  for (const ingredientIds of [undefined, [], [999], [tomato.id, tomato.id], ['1']]) {
    assert.throws(() => pizzas.create({ ...input, name: 'Autre', ingredientIds }), { status: 400 });
  }
  assert.throws(() => ingredients.remove(tomato.id), { status: 409 });
  assert.equal(ingredients.get(tomato.id).name, 'Tomate');
  assert.equal(pizzas.list().length, 1);
  pizzas.remove(pizza.id);
});

test('création et composition annulées ensemble si SQLite échoue', () => {
  db.exec(`CREATE TRIGGER fail_composition BEFORE INSERT ON pizza_ingredients
    BEGIN SELECT RAISE(ABORT, 'Panne simulée'); END;`);
  try {
    assert.throws(() => pizzas.create({ ...input, name: 'Rollback' }), /Panne simulée/);
    assert.equal(pizzas.list().length, 0);
  } finally {
    db.exec('DROP TRIGGER fail_composition');
  }
});

test('mise à jour invalide conserve le prix et la composition précédents', () => {
  const pizza = pizzas.create({ ...input, name: 'Stable' });
  assert.throws(() => pizzas.update(pizza.id, { ...input, price: 99, ingredientIds: [999] }), { status: 400 });
  assert.deepEqual(pizzas.get(pizza.id), pizza);
  const updated = pizzas.update(pizza.id, { ...input, name: 'Stable', ingredientIds: [cheese.id] });
  assert.deepEqual(updated.ingredientIds, [cheese.id]);
  ingredients.remove(tomato.id);
  assert.throws(() => ingredients.get(tomato.id), { status: 404 });
  pizzas.remove(pizza.id);
  ingredients.remove(cheese.id);
});
