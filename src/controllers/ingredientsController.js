import * as service from '../services/ingredientsService.js';

export function list(req, res) {
  res.json(service.list());
}

export function get(req, res) {
  res.json(service.get(req.params.id));
}

export function create(req, res) {
  const resource = service.create(req.body);
  res.location(`/api/ingredients/${resource.id}`).status(201).json(resource);
}

export function update(req, res) {
  res.json(service.update(req.params.id, req.body));
}

export function remove(req, res) {
  service.remove(req.params.id);
  res.status(204).end();
}
