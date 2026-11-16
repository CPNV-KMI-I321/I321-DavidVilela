import { db } from '../config/database.js';

export function findAll() {
  return db.prepare('SELECT * FROM ingredients ORDER BY id').all();
}

export function findById(id) {
  return db.prepare('SELECT * FROM ingredients WHERE id = ?').get(id);
}

export function create({ name, price }) {
  const result = db.prepare('INSERT INTO ingredients (name, price) VALUES (?, ?)').run(name, price);
  return findById(Number(result.lastInsertRowid));
}

export function update(id, { name, price }) {
  db.prepare('UPDATE ingredients SET name = ?, price = ? WHERE id = ?').run(name, price, id);
  return findById(id);
}

export function remove(id) {
  return db.prepare('DELETE FROM ingredients WHERE id = ?').run(id).changes > 0;
}
