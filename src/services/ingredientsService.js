import * as Ingredient from '../entities/Ingredient.js';
import * as Composition from '../entities/PizzaComposition.js';
import { fail, validateId, validateIngredient } from '../validation.js';

export function list() {
  return Ingredient.findAll();
}

export function get(id) {
  const ingredient = Ingredient.findById(validateId(id));
  if (!ingredient) fail(404, 'Ingrédient introuvable.');
  return ingredient;
}

export function create(body) {
  return Ingredient.create(validateIngredient(body));
}

export function update(id, body) {
  const ingredient = get(id);
  return Ingredient.update(ingredient.id, validateIngredient(body));
}

export function remove(id) {
  const ingredient = get(id);
  if (Composition.isUsed(ingredient.id)) fail(409, 'Cet ingrédient est utilisé par une pizza.');
  Ingredient.remove(ingredient.id);
}

export function ensureExist(ids) {
  for (const id of ids) {
    if (!Ingredient.findById(id)) fail(400, 'Un ingrédient référencé est introuvable.');
  }
}
