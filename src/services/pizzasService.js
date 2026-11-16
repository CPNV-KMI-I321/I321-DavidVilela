import { db } from '../config/database.js';
import * as Pizza from '../entities/Pizza.js';
import * as Composition from '../entities/PizzaComposition.js';
import { ensureExist } from './ingredientsService.js';
import { fail, validateId, validatePizza, validateIngredientIds } from '../validation.js';

function withComposition(pizza) {
  return { ...pizza, ingredientIds: Composition.ingredientIds(pizza.id) };
}

function transaction(operation) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function ensureUniqueName(name, currentId) {
  const existing = Pizza.findByName(name);
  if (existing && existing.id !== currentId) fail(409, 'Ce nom de pizza est déjà utilisé.');
}

export function list() {
  return Pizza.findAll().map(withComposition);
}

export function get(id) {
  const pizza = Pizza.findById(validateId(id));
  if (!pizza) fail(404, 'Pizza introuvable.');
  return withComposition(pizza);
}

export function create(body) {
  const data = validatePizza(body);
  const ids = validateIngredientIds(body.ingredientIds);
  return transaction(() => {
    ensureExist(ids);
    ensureUniqueName(data.name);
    const pizza = Pizza.create(data);
    Composition.replace(pizza.id, ids);
    return withComposition(pizza);
  });
}

export function update(id, body) {
  id = validateId(id);
  return transaction(() => {
    if (!Pizza.findById(id)) fail(404, 'Pizza introuvable.');
    const data = validatePizza(body);
    const ids = validateIngredientIds(body.ingredientIds);
    ensureExist(ids);
    ensureUniqueName(data.name, id);
    const pizza = Pizza.update(id, data);
    Composition.replace(id, ids);
    return withComposition(pizza);
  });
}

export function remove(id) {
  if (!Pizza.remove(validateId(id))) fail(404, 'Pizza introuvable.');
}
